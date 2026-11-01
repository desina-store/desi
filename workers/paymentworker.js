// worker.js
// DeSinaHub - Production Payment/Webhook Worker
// MongoDB Atlas = Primary Source of Truth
//
// Responsibilities:
// - Atomic job claiming (no race condition)
// - Lease-based processing
// - Safe retries with exponential backoff
// - Idempotency protection
// - Stale-job recovery
// - Graceful shutdown
// - Strong MongoDB indexes
// - No MongoDB Data API
//
// Required:
//   MONGODB_URI
//   MONGODB_DATABASE
//
// Optional:
//   MONGODB_JOBS_COLLECTION
//   MONGODB_WEBHOOK_COLLECTION
//   MONGODB_ORDERS_COLLECTION
//   WORKER_ID
//   WORKER_CONCURRENCY
//   WORKER_BATCH_SIZE
//   WORKER_LEASE_SECONDS
//   WORKER_MAX_ATTEMPTS
//   WORKER_POLL_INTERVAL_MS
//   WORKER_RETRY_BASE_MS
//   WORKER_RETRY_MAX_MS

import crypto from 'node:crypto';
import { MongoClient } from 'mongodb';

/* -------------------------------------------------------------------------- */
/* Configuration                                                              */
/* -------------------------------------------------------------------------- */

const MONGODB_URI = process.env.MONGODB_URI;
const DATABASE_NAME =
  process.env.MONGODB_DATABASE || 'DeSinaHubDB';

const JOBS_COLLECTION =
  process.env.MONGODB_JOBS_COLLECTION || 'jobs';

const WEBHOOK_COLLECTION =
  process.env.MONGODB_WEBHOOK_COLLECTION || 'webhook_events';

const ORDERS_COLLECTION =
  process.env.MONGODB_ORDERS_COLLECTION || 'orders';

const WORKER_ID =
  process.env.WORKER_ID ||
  `${process.env.HOSTNAME || 'desinahub-worker'}-${crypto.randomUUID()}`;

const WORKER_CONCURRENCY = Math.max(
  1,
  Number(process.env.WORKER_CONCURRENCY || 5)
);

const WORKER_BATCH_SIZE = Math.max(
  1,
  Number(process.env.WORKER_BATCH_SIZE || 5)
);

const LEASE_SECONDS = Math.max(
  30,
  Number(process.env.WORKER_LEASE_SECONDS || 120)
);

const MAX_ATTEMPTS = Math.max(
  1,
  Number(process.env.WORKER_MAX_ATTEMPTS || 8)
);

const POLL_INTERVAL_MS = Math.max(
  250,
  Number(process.env.WORKER_POLL_INTERVAL_MS || 1500)
);

const RETRY_BASE_MS = Math.max(
  1000,
  Number(process.env.WORKER_RETRY_BASE_MS || 5000)
);

const RETRY_MAX_MS = Math.max(
  RETRY_BASE_MS,
  Number(process.env.WORKER_RETRY_MAX_MS || 15 * 60 * 1000)
);

if (!MONGODB_URI) {
  throw new Error('[DeSinaHub] MONGODB_URI is required.');
}

/* -------------------------------------------------------------------------- */
/* MongoDB                                                                    */
/* -------------------------------------------------------------------------- */

let mongoClient = null;
let database = null;

async function connectToDatabase() {
  if (database) {
    return database;
  }

  mongoClient = new MongoClient(MONGODB_URI, {
    maxPoolSize: Math.max(10, WORKER_CONCURRENCY * 3),
    minPoolSize: 1,
    serverSelectionTimeoutMS: 15000,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 30000,
    retryWrites: true,
    retryReads: true,
  });

  await mongoClient.connect();

  database = mongoClient.db(DATABASE_NAME);

  console.log(
    `[DeSinaHub] MongoDB connected. DB=${DATABASE_NAME}`
  );

  return database;
}

/* -------------------------------------------------------------------------- */
/* Collections                                                                */
/* -------------------------------------------------------------------------- */

function getCollections(db) {
  return {
    jobs: db.collection(JOBS_COLLECTION),
    webhooks: db.collection(WEBHOOK_COLLECTION),
    orders: db.collection(ORDERS_COLLECTION),
  };
}

/* -------------------------------------------------------------------------- */
/* Indexes                                                                     */
/* -------------------------------------------------------------------------- */

export async function ensureIndexes() {
  const db = await connectToDatabase();
  const { jobs, webhooks, orders } = getCollections(db);

  await Promise.all([
    /*
     * One payment event must not create multiple jobs.
     *
     * Sparse index allows old jobs without provider/event_id.
     */
    jobs.createIndex(
      { provider: 1, event_id: 1 },
      {
        unique: true,
        sparse: true,
        name: 'uniq_job_provider_event',
      }
    ),

    /*
     * Main queue index.
     */
    jobs.createIndex(
      { status: 1, next_attempt_at: 1, created_at: 1 },
      {
        name: 'jobs_queue_scan',
      }
    ),

    /*
     * Recovery of jobs whose lease expired.
     */
    jobs.createIndex(
      { lease_until: 1 },
      {
        name: 'jobs_lease_recovery',
      }
    ),

    /*
     * Operational/debugging queries.
     */
    jobs.createIndex(
      { provider: 1, status: 1, created_at: -1 },
      {
        name: 'jobs_provider_status',
      }
    ),

    /*
     * Webhook idempotency.
     */
    webhooks.createIndex(
      { idempotency_key: 1 },
      {
        unique: true,
        sparse: true,
        name: 'uniq_webhook_idempotency',
      }
    ),

    /*
     * Provider/event lookup.
     */
    webhooks.createIndex(
      { provider: 1, event_id: 1 },
      {
        name: 'webhook_provider_event',
      }
    ),

    /*
     * Order lookup.
     */
    webhooks.createIndex(
      { order_id: 1, created_at: -1 },
      {
        name: 'webhook_order',
      }
    ),

    /*
     * Orders remain unique by business order ID.
     */
    orders.createIndex(
      { order_id: 1 },
      {
        unique: true,
        sparse: true,
        name: 'uniq_order_id',
      }
    ),
  ]);

  console.log('[DeSinaHub] MongoDB indexes verified.');
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function now() {
  return new Date();
}

function calculateRetryDelay(attempt) {
  const exponential =
    RETRY_BASE_MS * Math.pow(2, Math.max(0, attempt - 1));

  const capped = Math.min(exponential, RETRY_MAX_MS);

  /*
   * Small jitter prevents multiple workers from retrying
   * the same failed operations simultaneously.
   */
  const jitter = Math.floor(Math.random() * 1000);

  return capped + jitter;
}

function getNextAttemptDate(attempt) {
  return new Date(Date.now() + calculateRetryDelay(attempt));
}

function createLeaseToken() {
  return crypto.randomUUID();
}

function safeError(error) {
  return {
    name: error?.name || 'Error',
    message: String(error?.message || error),
    code: error?.code ?? null,
    stack:
      process.env.NODE_ENV === 'production'
        ? undefined
        : error?.stack,
  };
}

function isDuplicateKey(error) {
  return error?.code === 11000;
}

/* -------------------------------------------------------------------------- */
/* Job Claiming                                                               */
/* -------------------------------------------------------------------------- */

async function claimOneJob(jobs) {
  const currentTime = now();

  const leaseToken = createLeaseToken();
  const leaseUntil = new Date(
    currentTime.getTime() + LEASE_SECONDS * 1000
  );

  /*
   * IMPORTANT:
   *
   * findOneAndUpdate is atomic.
   *
   * This is the critical difference from:
   *
   * find(Pending) -> process -> update(Processing)
   *
   * which can suffer from race conditions.
   */

  const result = await jobs.findOneAndUpdate(
    {
      $or: [
        /*
         * New/retryable jobs.
         */
        {
          status: 'pending',
          $or: [
            { next_attempt_at: { $exists: false } },
            { next_attempt_at: { $lte: currentTime } },
          ],
        },

        /*
         * Recovery of a job whose worker died
         * before completing it.
         */
        {
          status: 'processing',
          lease_until: { $lte: currentTime },
        },
      ],
    },
    {
      $set: {
        status: 'processing',
        worker_id: WORKER_ID,
        lease_token: leaseToken,
        lease_until: leaseUntil,
        started_at: currentTime,
        updated_at: currentTime,
      },

      $inc: {
        attempts: 1,
      },
    },
    {
      sort: {
        priority: -1,
        created_at: 1,
      },

      returnDocument: 'after',
    }
  );

  return result?.value || null;
}

/* -------------------------------------------------------------------------- */
/* Webhook Idempotency                                                        */
/* -------------------------------------------------------------------------- */

async function hasCompletedWebhook(webhooks, job) {
  const key =
    job.idempotency_key ||
    job.idempotencyKey ||
    (
      job.provider &&
      job.event_id
        ? `${job.provider}:${job.event_id}`
        : null
    );

  if (!key) {
    return false;
  }

  const existing = await webhooks.findOne({
    idempotency_key: key,
    status: 'completed',
  });

  return Boolean(existing);
}

/* -------------------------------------------------------------------------- */
/* Webhook Completion Record                                                  */
/* -------------------------------------------------------------------------- */

async function recordWebhookCompletion(webhooks, job) {
  const key =
    job.idempotency_key ||
    job.idempotencyKey ||
    (
      job.provider &&
      job.event_id
        ? `${job.provider}:${job.event_id}`
        : null
    );

  if (!key) {
    return;
  }

  /*
   * This record is written ONLY AFTER successful processing.
   *
   * Therefore a temporary processing failure does NOT poison
   * future retries.
   */

  await webhooks.updateOne(
    {
      idempotency_key: key,
    },
    {
      $set: {
        idempotency_key: key,
        provider: job.provider || 'unknown',
        event_id: job.event_id || null,
        order_id: job.order_id || null,
        status: 'completed',
        completed_at: now(),
        updated_at: now(),
      },

      $setOnInsert: {
        created_at: now(),
      },
    },
    {
      upsert: true,
    }
  );
}

/* -------------------------------------------------------------------------- */
/* Job State Updates                                                          */
/* -------------------------------------------------------------------------- */

async function markCompleted(jobs, job) {
  const result = await jobs.updateOne(
    {
      _id: job._id,
      worker_id: WORKER_ID,
      lease_token: job.lease_token,
      status: 'processing',
    },
    {
      $set: {
        status: 'completed',
        completed_at: now(),
        updated_at: now(),
      },

      $unset: {
        lease_token: '',
        lease_until: '',
        worker_id: '',
      },
    }
  );

  if (result.modifiedCount !== 1) {
    throw new Error(
      `[DeSinaHub] Lost job lease before completion: ${job._id}`
    );
  }
}

async function markRetry(jobs, job, error) {
  const attempt = Number(job.attempts || 1);

  const shouldRetry = attempt < MAX_ATTEMPTS;

  if (!shouldRetry) {
    await jobs.updateOne(
      {
        _id: job._id,
        worker_id: WORKER_ID,
        lease_token: job.lease_token,
      },
      {
        $set: {
          status: 'dead',
          dead_at: now(),
          updated_at: now(),
          last_error: safeError(error),
        },

        $unset: {
          lease_token: '',
          lease_until: '',
          worker_id: '',
        },
      }
    );

    console.error(
      `[DeSinaHub] Job moved to DEAD after ${attempt} attempts: ${job._id}`
    );

    return;
  }

  const nextAttempt = getNextAttemptDate(attempt);

  await jobs.updateOne(
    {
      _id: job._id,
      worker_id: WORKER_ID,
      lease_token: job.lease_token,
    },
    {
      $set: {
        status: 'pending',
        next_attempt_at: nextAttempt,
        updated_at: now(),
        last_error: safeError(error),
      },

      $unset: {
        lease_token: '',
        lease_until: '',
        worker_id: '',
        started_at: '',
      },
    }
  );

  console.warn(
    `[DeSinaHub] Job retry scheduled: ${job._id} ` +
    `attempt=${attempt}/${MAX_ATTEMPTS} ` +
    `next=${nextAttempt.toISOString()}`
  );
}

/* -------------------------------------------------------------------------- */
/* Provider Dispatcher                                                        */
/* -------------------------------------------------------------------------- */

async function processJob(job, context) {
  const provider = String(job.provider || '').toLowerCase();

  switch (provider) {
    case 'stripe':
      return processStripeJob(job, context);

    case 'paypal':
      return processPayPalJob(job, context);

    case 'paymob':
      return processPaymobJob(job, context);

    case 'fawry':
      return processFawryJob(job, context);

    case 'bank':
      return processBankJob(job, context);

    default:
      throw new Error(
        `Unsupported payment provider: ${job.provider}`
      );
  }
}

/* -------------------------------------------------------------------------- */
/* Provider Handlers                                                          */
/* -------------------------------------------------------------------------- */

async function processStripeJob(job, context) {
  return {
    provider: 'stripe',
    handled: true,
  };
}

async function processPayPalJob(job, context) {
  return {
    provider: 'paypal',
    handled: true,
  };
}

async function processPaymobJob(job, context) {
  return {
    provider: 'paymob',
    handled: true,
  };
}

async function processFawryJob(job, context) {
  return {
    provider: 'fawry',
    handled: true,
  };
}

async function processBankJob(job, context) {
  return {
    provider: 'bank',
    handled: true,
  };
}

/* -------------------------------------------------------------------------- */
/* Single Job Execution                                                       */
/* -------------------------------------------------------------------------- */

async function processClaimedJob(job, collections) {
  const { jobs, webhooks, orders } = collections;

  try {
    const alreadyCompleted =
      await hasCompletedWebhook(webhooks, job);

    if (alreadyCompleted) {
      await markCompleted(jobs, job);

      console.log(
        `[DeSinaHub] Idempotent skip: ${job._id}`
      );

      return {
        jobId: job._id,
        status: 'idempotent_skip',
      };
    }

    const result = await processJob(job, {
      jobs,
      webhooks,
      orders,
    });

    await recordWebhookCompletion(webhooks, job);

    await markCompleted(jobs, job);

    console.log(
      `[DeSinaHub] Job completed: ${job._id}`
    );

    return {
      jobId: job._id,
      status: 'completed',
      result,
    };
  } catch (error) {
    console.error(
      `[DeSinaHub] Job failed: ${job._id}`,
      error
    );

    await markRetry(jobs, job, error);

    return {
      jobId: job._id,
      status: 'failed_or_retry',
      error: safeError(error),
    };
  }
}

/* -------------------------------------------------------------------------- */
/* Worker Cycle                                                               */
/* -------------------------------------------------------------------------- */

export async function runWorkerOnce() {
  const db = await connectToDatabase();
  const collections = getCollections(db);

  const results = [];

  const workerCount = Math.min(
    WORKER_CONCURRENCY,
    WORKER_BATCH_SIZE
  );

  const promises = [];

  for (let i = 0; i < workerCount; i++) {
    promises.push(
      (async () => {
        const job = await claimOneJob(collections.jobs);

        if (!job) {
          return null;
        }

        return processClaimedJob(job, collections);
      })()
    );
  }

  const settled = await Promise.allSettled(promises);

  for (const result of settled) {
    if (result.status === 'fulfilled' && result.value) {
      results.push(result.value);
    } else if (result.status === 'rejected') {
      console.error(
        '[DeSinaHub] Worker execution error:',
        result.reason
      );

      results.push({
        status: 'worker_error',
        error: safeError(result.reason),
      });
    }
  }

  return {
    workerId: WORKER_ID,
    processed: results.length,
    results,
  };
}

/* -------------------------------------------------------------------------- */
/* Continuous Worker                                                         */
/* -------------------------------------------------------------------------- */

let shuttingDown = false;

export async function startWorker() {
  await ensureIndexes();

  console.log(
    `[DeSinaHub] Worker started: ${WORKER_ID}`
  );

  console.log(
    `[DeSinaHub] concurrency=${WORKER_CONCURRENCY}, ` +
    `batch=${WORKER_BATCH_SIZE}, ` +
    `maxAttempts=${MAX_ATTEMPTS}, ` +
    `lease=${LEASE_SECONDS}s`
  );

  while (!shuttingDown) {
    try {
      const result = await runWorkerOnce();

      if (result.processed === 0) {
        await sleep(POLL_INTERVAL_MS);
      }
    } catch (error) {
      console.error(
        '[DeSinaHub] Worker cycle failed:',
        error
      );

      await sleep(Math.max(POLL_INTERVAL_MS, 3000));
    }
  }

  console.log('[DeSinaHub] Worker stopped.');
}

/* -------------------------------------------------------------------------- */
/* Graceful Shutdown                                                         */
/* -------------------------------------------------------------------------- */

async function shutdown(signal) {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;

  console.log(
    `[DeSinaHub] Received ${signal}. Shutting down gracefully...`
  );

  try {
    if (mongoClient) {
      await mongoClient.close();
      console.log('[DeSinaHub] MongoDB connection closed.');
    }
  } catch (error) {
    console.error(
      '[DeSinaHub] Shutdown error:',
      error
    );
  }
}

process.once('SIGINT', () => shutdown('SIGINT'));
process.once('SIGTERM', () => shutdown('SIGTERM'));

/* -------------------------------------------------------------------------- */
/* Utilities                                                                  */
/* -------------------------------------------------------------------------- */

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/* -------------------------------------------------------------------------- */
/* Optional direct execution                                                  */
/* -------------------------------------------------------------------------- */

if (
  process.argv[1] &&
  import.meta.url === `file://${process.argv[1]}`
) {
  startWorker().catch(async error => {
    console.error(
      '[DeSinaHub] Fatal worker error:',
      error
    );

    await shutdown('FATAL_ERROR');

    process.exit(1);
  });
}
