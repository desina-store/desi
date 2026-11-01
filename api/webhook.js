// DeSinaHub Global Unified Webhook System
// Production Architecture
//
// MongoDB Atlas = Primary Source of Truth
// Supabase = Webhook Audit / Backup
// Jobs Collection = Durable Async Queue
//
// هذا الملف هو Webhook Receiver فقط.
// الخدمات الخارجية الثقيلة تتم عن طريق Worker من خلال Jobs Collection.
//
// v1.1 — التعديلات:
// 1) Amount/Currency Match قبل تثبيت paid
// 2) worker_id Lease Protection في completeJob/failJob
// 3) فلتر job_type = 'payment_success' في claimJobs
// 4) Timeout على كل fetch (fetchWithTimeout)
// 5) تحديث status/order_status عند نجاح الدفع + 'failed' للأحداث الفاشلة
// 6) تنبيه Telegram عند نقل Job إلى DLQ
//
// مهم:
// MongoDB connection يتم من خلال: lib/mongodb.js
//
// قبل التشغيل:
// 1) ضع MONGODB_URI
// 2) ضع MONGODB_DATABASE
// 3) ضع SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY
// 4) ضع مفاتيح بوابات الدفع في ENV
// 5) Stripe يحتاج rawBody حقيقي
// 6) PayPal يحتاج بيانات Webhook الرسمية
// 7) Paymob / Fawry / Bank يتم تثبيت Verification النهائي
//    حسب الـ specifications الرسمية بعد التعاقد

import crypto from 'crypto';
import Stripe from 'stripe';

import { getDatabase } from '../lib/mongodb.js';

// ============================================================
// ENVIRONMENT
// ============================================================

const NODE_ENV = process.env.NODE_ENV || 'development';

const IS_PRODUCTION = NODE_ENV === 'production';

const ALLOW_UNVERIFIED = process.env.WEBHOOK_ALLOW_UNVERIFIED === 'true';

// ============================================================
// MONGODB ATLAS
// ============================================================

const MONGODB_DATABASE = process.env.MONGODB_DATABASE || 'DeSinaHubDB';

const MONGODB_ORDERS_COLLECTION = process.env.MONGODB_ORDERS_COLLECTION || 'orders';

const MONGODB_WEBHOOK_COLLECTION = process.env.MONGODB_WEBHOOK_COLLECTION || 'webhook_events';

const MONGODB_JOBS_COLLECTION = process.env.MONGODB_JOBS_COLLECTION || 'jobs';

const MONGODB_DLQ_COLLECTION = process.env.MONGODB_DLQ_COLLECTION || 'dead_letter_jobs';

// ============================================================
// SUPABASE
// ============================================================

const SUPABASE_URL = process.env.SUPABASE_URL;

const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const SUPABASE_WEBHOOK_TABLE = process.env.SUPABASE_WEBHOOK_TABLE || 'webhook_events';

// ============================================================
// STRIPE
// ============================================================

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

// ============================================================
// PAYPAL
// ============================================================

const PAYPAL_WEBHOOK_ID = process.env.PAYPAL_WEBHOOK_ID;

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;

const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;

const PAYPAL_API_BASE = process.env.PAYPAL_API_BASE || 'https://api-m.paypal.com';

// ============================================================
// PAYMOB
// ============================================================

const PAYMOB_WEBHOOK_SECRET = process.env.PAYMOB_WEBHOOK_SECRET;

// ============================================================
// FAWRY
// ============================================================

const FAWRY_WEBHOOK_SECRET = process.env.FAWRY_WEBHOOK_SECRET;

// ============================================================
// BANK
// ============================================================

const BANK_WEBHOOK_SECRET = process.env.BANK_WEBHOOK_SECRET;

// ============================================================
// TELEGRAM
// ============================================================

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// ============================================================
// GOOGLE ANALYTICS 4
// ============================================================

const GA_MEASUREMENT_ID = process.env.GA_MEASUREMENT_ID;

const GA_API_SECRET = process.env.GA_API_SECRET;

// ============================================================
// META
// ============================================================

const FB_PIXEL_ID = process.env.FB_PIXEL_ID;

const FB_ACCESS_TOKEN = process.env.FB_ACCESS_TOKEN;

// ============================================================
// TIKTOK
// ============================================================

const TIKTOK_PIXEL_ID = process.env.TIKTOK_PIXEL_ID;

const TIKTOK_ACCESS_TOKEN = process.env.TIKTOK_ACCESS_TOKEN;

// ============================================================
// MIXPANEL
// ============================================================

const MIXPANEL_TOKEN = process.env.MIXPANEL_TOKEN;

// ============================================================
// HUBSPOT
// ============================================================

const HUBSPOT_API_KEY = process.env.HUBSPOT_API_KEY;

const HUBSPOT_OWNER_ID = process.env.HUBSPOT_OWNER_ID;

const HUBSPOT_PIPELINE = process.env.HUBSPOT_PIPELINE || 'default';

const HUBSPOT_CLOSED_WON_STAGE = process.env.HUBSPOT_CLOSED_WON_STAGE || 'closedwon';

// ============================================================
// SALESFORCE (محفوظ للتكامل المستقبلي)
// ============================================================

const SALESFORCE_CLIENT_ID = process.env.SALESFORCE_CLIENT_ID;

const SALESFORCE_CLIENT_SECRET = process.env.SALESFORCE_CLIENT_SECRET;

const SALESFORCE_USERNAME = process.env.SALESFORCE_USERNAME;

const SALESFORCE_PASSWORD = process.env.SALESFORCE_PASSWORD;

const SALESFORCE_SECURITY_TOKEN = process.env.SALESFORCE_SECURITY_TOKEN;

const SALESFORCE_LOGIN_URL = process.env.SALESFORCE_LOGIN_URL || 'https://login.salesforce.com';

// ============================================================
// CUSTOMER EMAIL
// ============================================================

const CUSTOMER_EMAIL_WEBHOOK_URL = process.env.CUSTOMER_EMAIL_WEBHOOK_URL;

const CUSTOMER_EMAIL_API_KEY = process.env.CUSTOMER_EMAIL_API_KEY;

// ============================================================
// WORKER SETTINGS
// ============================================================

const MAX_JOB_ATTEMPTS = Number(process.env.MAX_JOB_ATTEMPTS || 8);

const JOB_LEASE_SECONDS = Number(process.env.JOB_LEASE_SECONDS || 300);

const JOB_BATCH_SIZE = Number(process.env.JOB_BATCH_SIZE || 25);

// ============================================================
// MONGODB
// ============================================================

let indexesReady = false;

async function db() {
  return getDatabase();
}

// ============================================================
// INDEXES
// ============================================================

async function ensureIndexes() {
  if (indexesReady) {
    return;
  }

  const database = await db();

  await Promise.all([
    database
      .collection(MONGODB_WEBHOOK_COLLECTION)
      .createIndex(
        { idempotency_key: 1 },
        { unique: true, name: 'uniq_webhook_idempotency_key' }
      ),

    database
      .collection(MONGODB_WEBHOOK_COLLECTION)
      .createIndex(
        { provider: 1, event_id: 1 },
        { name: 'webhook_provider_event' }
      ),

    database
      .collection(MONGODB_WEBHOOK_COLLECTION)
      .createIndex(
        { order_id: 1 },
        { name: 'webhook_order_id' }
      ),

    database
      .collection(MONGODB_JOBS_COLLECTION)
      .createIndex(
        { provider: 1, event_id: 1 },
        { unique: true, sparse: true, name: 'uniq_payment_job_event' }
      ),

    database
      .collection(MONGODB_JOBS_COLLECTION)
      .createIndex(
        { job_type: 1, status: 1, next_attempt_at: 1 },
        { name: 'jobs_type_status_next_attempt' }
      ),

    database
      .collection(MONGODB_JOBS_COLLECTION)
      .createIndex(
        { lease_until: 1 },
        { name: 'jobs_lease_until' }
      ),

    database
      .collection(MONGODB_ORDERS_COLLECTION)
      .createIndex(
        { order_id: 1 },
        { unique: true, sparse: true, name: 'uniq_order_id' }
      ),

    database
      .collection(MONGODB_DLQ_COLLECTION)
      .createIndex(
        { original_job_id: 1 },
        { name: 'dlq_original_job' }
      )
  ]);

  indexesReady = true;
}

// ============================================================
// HELPERS
// ============================================================

function safeString(value) {
  if (value === undefined || value === null) {
    return '';
  }

  return String(value);
}

function normalizeEmail(email) {
  return email ? String(email).trim().toLowerCase() : '';
}

function hashEmail(email) {
  const normalized = normalizeEmail(email);

  if (!normalized) {
    return undefined;
  }

  return crypto.createHash('sha256').update(normalized).digest('hex');
}

function safeAmount(value) {
  const parsed = Number.parseFloat(value);

  return Number.isFinite(parsed) ? parsed : 0;
}

function constantTimeCompare(aValue, bValue) {
  const a = Buffer.from(safeString(aValue), 'utf8');

  const b = Buffer.from(safeString(bValue), 'utf8');

  if (a.length !== b.length) {
    return false;
  }

  return crypto.timingSafeEqual(a, b);
}

function hmacSha256(secret, payload) {
  return crypto.createHmac('sha256', secret).update(payload, 'utf8').digest('hex');
}

// ============================================================
// FETCH WITH TIMEOUT
// ============================================================
//
// كل نداء خارجي له حد أقصى للانتظار حتى لا يعلق الـ batch.
// Node 18+ (Vercel) يدعم AbortSignal.timeout.
// ============================================================

async function fetchWithTimeout(url, options = {}, timeoutMs = 8000) {
  return fetch(url, {
    ...options,
    signal: AbortSignal.timeout(timeoutMs)
  });
}

// ============================================================
// RAW BODY
// ============================================================

function getRawBody(req) {
  if (req.rawBody) {
    return Buffer.isBuffer(req.rawBody)
      ? req.rawBody.toString('utf8')
      : String(req.rawBody);
  }

  if (typeof req.body === 'string') {
    return req.body;
  }

  return JSON.stringify(req.body || {});
}

// ============================================================
// NORMALIZE HEADERS
// ============================================================

function normalizeHeaders(headers) {
  const normalized = {};

  for (const [key, value] of Object.entries(headers || {})) {
    normalized[String(key).toLowerCase()] = value;
  }

  return normalized;
}

// ============================================================
// PROVIDER DETECTION
// ============================================================

function detectProvider(headers, payload) {
  const h = normalizeHeaders(headers);

  if (
    h['stripe-signature'] ||
    (typeof payload?.type === 'string' && payload.type.startsWith('payment_intent.'))
  ) {
    return 'stripe';
  }

  if (
    h['paypal-transmission-id'] ||
    h['paypal-transmission-sig'] ||
    payload?.resource?.status === 'COMPLETED'
  ) {
    return 'paypal';
  }

  if (payload?.merchantRefNumber || payload?.charge_response_code) {
    return 'fawry';
  }

  if (payload?.obj?.success !== undefined || payload?.txnResponseCode !== undefined) {
    return 'paymob';
  }

  if (h['x-bank-signature']) {
    return 'bank';
  }

  return 'unknown';
}

// ============================================================
// STRIPE
// ============================================================

async function verifyStripeWebhook(rawBody, signature) {
  if (!STRIPE_SECRET_KEY || !STRIPE_WEBHOOK_SECRET) {
    return {
      verified: false,
      reason: 'Stripe credentials are not configured'
    };
  }

  if (!signature) {
    return {
      verified: false,
      reason: 'Stripe signature missing'
    };
  }

  try {
    const stripe = new Stripe(STRIPE_SECRET_KEY);

    const event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      STRIPE_WEBHOOK_SECRET
    );

    return {
      verified: true,
      event
    };
  } catch (error) {
    return {
      verified: false,
      reason: error?.message || 'Stripe verification failed'
    };
  }
}

// ============================================================
// GENERIC HMAC
// ============================================================

function verifyGenericHmac(signature, rawBody, secret) {
  if (!signature || !secret) {
    return false;
  }

  const expected = hmacSha256(secret, rawBody);

  return constantTimeCompare(signature, expected);
}

// ============================================================
// PAYPAL ACCESS TOKEN
// ============================================================

async function getPayPalAccessToken() {
  if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
    throw new Error('PayPal credentials are not configured');
  }

  const auth = Buffer
    .from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`)
    .toString('base64');

  const response = await fetchWithTimeout(
    `${PAYPAL_API_BASE}/v1/oauth2/token`,
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials'
    }
  );

  if (!response.ok) {
    throw new Error(`PayPal OAuth failed: ${await response.text()}`);
  }

  const data = await response.json();

  if (!data?.access_token) {
    throw new Error('PayPal access token missing');
  }

  return data.access_token;
}

// ============================================================
// PAYPAL WEBHOOK VERIFICATION
// ============================================================

async function verifyPayPalWebhook(headers, payload) {
  if (!PAYPAL_WEBHOOK_ID) {
    return {
      verified: false,
      reason: 'PAYPAL_WEBHOOK_ID is not configured'
    };
  }

  try {
    const accessToken = await getPayPalAccessToken();

    const body = {
      auth_algo: headers['paypal-auth-algo'],
      cert_url: headers['paypal-cert-url'],
      transmission_id: headers['paypal-transmission-id'],
      transmission_sig: headers['paypal-transmission-sig'],
      transmission_time: headers['paypal-transmission-time'],
      webhook_id: PAYPAL_WEBHOOK_ID,
      webhook_event: payload
    };

    const response = await fetchWithTimeout(
      `${PAYPAL_API_BASE}/v1/notifications/verify-webhook-signature`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      }
    );

    if (!response.ok) {
      return {
        verified: false,
        reason: `PayPal verification failed: ${await response.text()}`
      };
    }

    const result = await response.json();

    return {
      verified: result.verification_status === 'SUCCESS',
      reason: result.verification_status
    };
  } catch (error) {
    return {
      verified: false,
      reason: error?.message || 'PayPal verification failed'
    };
  }
}

// ============================================================
// PROVIDER VERIFICATION
// ============================================================

async function verifyProviderWebhook({ provider, headers, rawBody, payload }) {
  const h = normalizeHeaders(headers);

  if (provider === 'stripe') {
    return verifyStripeWebhook(rawBody, h['stripe-signature']);
  }

  if (provider === 'paypal') {
    return verifyPayPalWebhook(h, payload);
  }

  if (provider === 'paymob') {
    const signature = h['x-paymob-signature'] || h['x-webhook-signature'];

    if (!PAYMOB_WEBHOOK_SECRET) {
      return {
        verified: false,
        reason: 'PAYMOB_WEBHOOK_SECRET is not configured'
      };
    }

    return {
      verified: verifyGenericHmac(signature, rawBody, PAYMOB_WEBHOOK_SECRET)
    };
  }

  if (provider === 'fawry') {
    const signature = h['x-fawry-signature'] || h['x-webhook-signature'];

    if (!FAWRY_WEBHOOK_SECRET) {
      return {
        verified: false,
        reason: 'FAWRY_WEBHOOK_SECRET is not configured'
      };
    }

    return {
      verified: verifyGenericHmac(signature, rawBody, FAWRY_WEBHOOK_SECRET)
    };
  }

  if (provider === 'bank') {
    if (!BANK_WEBHOOK_SECRET) {
      return {
        verified: false,
        reason: 'BANK_WEBHOOK_SECRET is not configured'
      };
    }

    return {
      verified: verifyGenericHmac(h['x-bank-signature'], rawBody, BANK_WEBHOOK_SECRET)
    };
  }

  return {
    verified: false,
    reason: 'Unknown payment provider'
  };
}

// ============================================================
// DATA EXTRACTION
// ============================================================

function extractEventId(provider, payload, headers) {
  const h = normalizeHeaders(headers);

  if (provider === 'stripe') {
    return payload?.id || h['stripe-event-id'];
  }

  if (provider === 'paypal') {
    return payload?.id || h['paypal-transmission-id'];
  }

  return (
    payload?.event_id ||
    payload?.eventId ||
    payload?.transaction_id ||
    payload?.transactionId ||
    payload?.reference ||
    payload?.merchantRefNumber ||
    payload?.trackId ||
    payload?.id
  );
}

function extractOrderId(payload) {
  return (
    payload?.order_id ||
    payload?.orderId ||
    payload?.merchant_order_id ||
    payload?.merchantOrderId ||
    payload?.obj?.order_id ||
    payload?.resource?.invoice_id ||
    payload?.resource?.custom ||
    payload?.merchantRefNumber ||
    payload?.trackId
  );
}

function extractAmount(payload) {
  return (
    payload?.amount ??
    payload?.amount_total ??
    payload?.amount_received ??
    payload?.obj?.amount ??
    payload?.resource?.amount?.value ??
    '0.00'
  );
}

function extractCurrency(payload) {
  return (
    payload?.currency ||
    payload?.currency_code ||
    payload?.resource?.amount?.currency_code ||
    'EGP'
  );
}

function extractCustomerEmail(payload) {
  return (
    payload?.customer_email ||
    payload?.email ||
    payload?.customer?.email ||
    payload?.customer_details?.email ||
    payload?.resource?.payer?.email_address
  );
}

function detectSuccess(payload) {
  const status = String(payload?.status || '').toLowerCase();

  return (
    payload?.success === true ||
    payload?.paid === true ||
    status === 'success' ||
    status === 'succeeded' ||
    status === 'paid' ||
    status === 'completed' ||
    payload?.charge_response_code === '00' ||
    payload?.txnResponseCode === '0' ||
    payload?.obj?.success === true ||
    payload?.resource?.status === 'COMPLETED'
  );
}

// ============================================================
// IDEMPOTENCY
// ============================================================

function createIdempotencyKey({ provider, eventId, orderId, payload }) {
  if (eventId) {
    return `${provider}:${eventId}`;
  }

  const payloadHash = crypto
    .createHash('sha256')
    .update(JSON.stringify(payload || {}), 'utf8')
    .digest('hex');

  return `${provider}:order:${orderId}:payload:${payloadHash}`;
}

// ============================================================
// CLAIM WEBHOOK EVENT
// ============================================================

async function claimWebhookEvent({ provider, eventId, orderId, payload }) {
  const database = await db();

  const idempotencyKey = createIdempotencyKey({ provider, eventId, orderId, payload });

  try {
    const result = await database
      .collection(MONGODB_WEBHOOK_COLLECTION)
      .updateOne(
        { idempotency_key: idempotencyKey },
        {
          $setOnInsert: {
            idempotency_key: idempotencyKey,
            provider,
            event_id: eventId || null,
            order_id: orderId,
            status: 'processing',
            payload,
            received_at: new Date()
          }
        },
        { upsert: true }
      );

    return {
      duplicate: result.upsertedCount !== 1,
      idempotencyKey
    };
  } catch (error) {
    if (error?.code === 11000) {
      return {
        duplicate: true,
        idempotencyKey
      };
    }

    throw error;
  }
}

// ============================================================
// MARK WEBHOOK STATUS
// ============================================================

async function updateWebhookStatus(idempotencyKey, status, extra = {}) {
  const database = await db();

  await database
    .collection(MONGODB_WEBHOOK_COLLECTION)
    .updateOne(
      { idempotency_key: idempotencyKey },
      {
        $set: {
          status,
          updated_at: new Date(),
          ...extra
        }
      }
    );
}

// ============================================================
// COMMIT PAYMENT
// ============================================================

async function commitPayment({
  orderId,
  provider,
  eventId,
  amount,
  currency,
  idempotencyKey,
  payload,
  customerEmail
}) {
  const database = await db();

  const orders = database.collection(MONGODB_ORDERS_COLLECTION);

  const jobs = database.collection(MONGODB_JOBS_COLLECTION);

  const webhookEvents = database.collection(MONGODB_WEBHOOK_COLLECTION);

  // ----------------------------------------------------------
  // أولاً: التأكد أن الطلب موجود.
  // ----------------------------------------------------------

  const existingOrder = await orders.findOne({ order_id: orderId });

  if (!existingOrder) {
    throw new Error(`Order not found: ${orderId}`);
  }

  // ----------------------------------------------------------
  // ثانياً: Amount / Currency Match.
  //
  // لا يتم تثبيت paid أبداً إذا كان المبلغ أو العملة
  // مختلفين عن قيمة الطلب المسجلة في checkout.
  // ----------------------------------------------------------

  const orderAmount = safeAmount(existingOrder.total_amount ?? existingOrder.amount);

  const paidAmount = safeAmount(amount);

  const orderCurrency = safeString(existingOrder.currency || 'EGP').toUpperCase();

  const paidCurrency = safeString(currency || 'EGP').toUpperCase();

  if (Math.abs(paidAmount - orderAmount) > 0.01 || paidCurrency !== orderCurrency) {
    await orders.updateOne(
      { order_id: orderId },
      {
        $set: {
          payment_status: 'amount_mismatch',
          updated_at: new Date()
        }
      }
    );

    await sendTelegram({
      order_id: orderId,
      amount: paidAmount,
      currency: paidCurrency,
      provider,
      text:
        `🚨 Amount Mismatch في DeSinaHub!\n` +
        `رقم الأوردر: ${orderId}\n` +
        `المتوقع: ${orderAmount} ${orderCurrency}\n` +
        `المستلم: ${paidAmount} ${paidCurrency}\n` +
        `البوابة: ${provider}\n` +
        `لم يتم تثبيت الدفع.`
    });

    throw new Error(
      `Amount mismatch for order ${orderId}: ` +
      `expected ${orderAmount} ${orderCurrency}, ` +
      `received ${paidAmount} ${paidCurrency}`
    );
  }

  // ----------------------------------------------------------
  // ثالثاً: تثبيت الدفع في MongoDB.
  // ----------------------------------------------------------

  await orders.updateOne(
    {
      order_id: orderId,

      $or: [
        { payment_status: { $ne: 'paid' } },
        { payment_event_id: eventId || null }
      ]
    },
    {
      $set: {
        status: 'confirmed',
        payment_status: 'paid',
        payment_provider: provider,
        payment_event_id: eventId || null,
        payment_amount: paidAmount,
        payment_currency: paidCurrency,
        paid_at: existingOrder.paid_at || new Date(),
        updated_at: new Date()
      }
    }
  );

  // ----------------------------------------------------------
  // إنشاء Job واحد فقط (payment_success).
  //
  // الـ unique index يمنع تكرار Job لنفس provider/event.
  // ----------------------------------------------------------

  try {
    await jobs.updateOne(
      { idempotency_key: idempotencyKey },
      {
        $setOnInsert: {
          order_id: orderId,
          provider,
          event_id: eventId || null,
          job_type: 'payment_success',
          status: 'pending',
          attempts: 0,
          payload,
          customerEmail: customerEmail || null,
          amount: paidAmount,
          currency: paidCurrency,
          idempotency_key: idempotencyKey,
          created_at: new Date(),
          next_attempt_at: new Date()
        }
      },
      { upsert: true }
    );
  } catch (error) {
    // duplicate بسبب race condition لا يفشل الدفع.
    if (error?.code !== 11000) {
      throw error;
    }
  }

  // ----------------------------------------------------------
  // تحديث Webhook Event.
  // ----------------------------------------------------------

  await webhookEvents.updateOne(
    { idempotency_key: idempotencyKey },
    {
      $set: {
        status: 'committed',
        processed_at: new Date(),
        updated_at: new Date()
      }
    }
  );

  return true;
}

// ============================================================
// SUPABASE AUDIT
// ============================================================

async function saveSupabaseAudit(job) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return { skipped: true };
  }

  const response = await fetchWithTimeout(
    `${SUPABASE_URL}/rest/v1/${SUPABASE_WEBHOOK_TABLE}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        Prefer: 'resolution=ignore-duplicates,return=minimal'
      },
      body: JSON.stringify({
        idempotency_key: job.idempotency_key,
        provider: job.provider,
        event_id: job.event_id || null,
        order_id: job.order_id,
        amount: safeAmount(job.amount),
        currency: job.currency,
        payment_status: 'paid',
        customer_email_hash: hashEmail(job.customerEmail),
        payload: job.payload,
        created_at: new Date().toISOString()
      })
    }
  );

  if (!response.ok) {
    throw new Error(`Supabase audit failed: ${await response.text()}`);
  }

  return { success: true };
}

// ============================================================
// TELEGRAM
// ============================================================
//
// يقبل job عادي (رسالة مبيعة) أو job فيه text مخصص (تنبيهات).
// ============================================================

async function sendTelegram(job) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    return { skipped: true };
  }

  const text = job.text || (
    `🎉 مبيعة جديدة في DeSinaHub!\n` +
    `رقم الأوردر: ${job.order_id}\n` +
    `المبلغ: ${job.amount} ${job.currency}\n` +
    `البوابة: ${job.provider}\n` +
    `حالة الدفع: مدفوع بنجاح ✅`
  );

  const response = await fetchWithTimeout(
    `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text
      })
    }
  );

  if (!response.ok) {
    throw new Error(`Telegram failed: ${await response.text()}`);
  }

  return { success: true };
}

// ============================================================
// GA4
// ============================================================

async function sendGA4(job) {
  if (!GA_MEASUREMENT_ID || !GA_API_SECRET) {
    return { skipped: true };
  }

  const url =
    `https://www.google-analytics.com/mp/collect` +
    `?measurement_id=${encodeURIComponent(GA_MEASUREMENT_ID)}` +
    `&api_secret=${encodeURIComponent(GA_API_SECRET)}`;

  const response = await fetchWithTimeout(
    url,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        client_id: job.order_id,
        events: [
          {
            name: 'purchase',
            params: {
              transaction_id: job.order_id,
              value: safeAmount(job.amount),
              currency: job.currency
            }
          }
        ]
      })
    }
  );

  if (!response.ok) {
    throw new Error(`GA4 failed: ${await response.text()}`);
  }

  return { success: true };
}

// ============================================================
// META
// ============================================================

async function sendMeta(job) {
  if (!FB_PIXEL_ID || !FB_ACCESS_TOKEN) {
    return { skipped: true };
  }

  const userData = {};

  const emailHash = hashEmail(job.customerEmail);

  if (emailHash) {
    userData.em = [emailHash];
  }

  const response = await fetchWithTimeout(
    `https://graph.facebook.com/v20.0/${FB_PIXEL_ID}/events` +
    `?access_token=${encodeURIComponent(FB_ACCESS_TOKEN)}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data: [
          {
            event_name: 'Purchase',
            event_time: Math.floor(Date.now() / 1000),
            event_id: job.order_id,
            user_data: userData,
            custom_data: {
              currency: job.currency,
              value: safeAmount(job.amount)
            }
          }
        ]
      })
    }
  );

  if (!response.ok) {
    throw new Error(`Meta failed: ${await response.text()}`);
  }

  return { success: true };
}

// ============================================================
// TIKTOK
// ============================================================

async function sendTikTok(job) {
  if (!TIKTOK_PIXEL_ID || !TIKTOK_ACCESS_TOKEN) {
    return { skipped: true };
  }

  const response = await fetchWithTimeout(
    'https://business-api.tiktok.com/open_api/v1.3/event/track/',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Token': TIKTOK_ACCESS_TOKEN
      },
      body: JSON.stringify({
        event_source: 'web',
        event_source_id: TIKTOK_PIXEL_ID,
        data: [
          {
            event: 'CompletePayment',
            event_id: job.order_id,
            properties: {
              currency: job.currency,
              value: safeAmount(job.amount)
            }
          }
        ]
      })
    }
  );

  if (!response.ok) {
    throw new Error(`TikTok failed: ${await response.text()}`);
  }

  return { success: true };
}

// ============================================================
// MIXPANEL
// ============================================================

async function sendMixpanel(job) {
  if (!MIXPANEL_TOKEN) {
    return { skipped: true };
  }

  const response = await fetchWithTimeout(
    'https://api.mixpanel.com/track',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        event: 'Payment Success',
        properties: {
          token: MIXPANEL_TOKEN,
          distinct_id: job.order_id,
          transaction_id: job.order_id,
          amount: safeAmount(job.amount),
          currency: job.currency
        }
      })
    }
  );

  if (!response.ok) {
    throw new Error(`Mixpanel failed: ${await response.text()}`);
  }

  return { success: true };
}

// ============================================================
// HUBSPOT
// ============================================================

async function sendHubSpot(job) {
  if (!HUBSPOT_API_KEY) {
    return { skipped: true };
  }

  const properties = {
    dealname: `Order ${job.order_id}`,
    amount: safeAmount(job.amount).toString(),
    dealstage: HUBSPOT_CLOSED_WON_STAGE,
    pipeline: HUBSPOT_PIPELINE
  };

  if (HUBSPOT_OWNER_ID) {
    properties.hubspot_owner_id = HUBSPOT_OWNER_ID;
  }

  const response = await fetchWithTimeout(
    'https://api.hubapi.com/crm/v3/objects/deals',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${HUBSPOT_API_KEY}`
      },
      body: JSON.stringify({ properties })
    }
  );

  if (!response.ok) {
    throw new Error(`HubSpot failed: ${await response.text()}`);
  }

  return { success: true };
}

// ============================================================
// CUSTOMER EMAIL
// ============================================================

async function sendCustomerEmail(job) {
  if (!CUSTOMER_EMAIL_WEBHOOK_URL || !CUSTOMER_EMAIL_API_KEY) {
    return { skipped: true };
  }

  if (!job.customerEmail) {
    return {
      skipped: true,
      reason: 'Customer email unavailable'
    };
  }

  const response = await fetchWithTimeout(
    CUSTOMER_EMAIL_WEBHOOK_URL,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${CUSTOMER_EMAIL_API_KEY}`
      },
      body: JSON.stringify({
        email: job.customerEmail,
        order_id: job.order_id,
        amount: safeAmount(job.amount),
        currency: job.currency,
        event: 'payment_success'
      })
    }
  );

  if (!response.ok) {
    throw new Error(`Customer email service failed: ${await response.text()}`);
  }

  return { success: true };
}

// ============================================================
// JOB HANDLER
// ============================================================

async function processJob(job) {
  const results = await Promise.allSettled([
    saveSupabaseAudit(job),
    sendTelegram(job),
    sendGA4(job),
    sendMeta(job),
    sendTikTok(job),
    sendMixpanel(job),
    sendHubSpot(job),
    sendCustomerEmail(job)
  ]);

  const failures = results.filter(result => result.status === 'rejected');

  if (failures.length) {
    throw new Error(
      failures
        .map(failure => failure.reason?.message || String(failure.reason))
        .join(' | ')
    );
  }

  return true;
}

// ============================================================
// JOB CLAIM / LEASE
// ============================================================
//
// v1.1: يعالج فقط jobs من نوع payment_success.
// الـ checkout initialization jobs لا تمر من هنا.
// ============================================================

async function claimJobs(workerId, limit = JOB_BATCH_SIZE) {
  const database = await db();

  const now = new Date();

  const leaseUntil = new Date(Date.now() + JOB_LEASE_SECONDS * 1000);

  const jobs = [];

  for (let i = 0; i < limit; i++) {
    const result = await database
      .collection(MONGODB_JOBS_COLLECTION)
      .findOneAndUpdate(
        {
          job_type: 'payment_success',

          status: { $in: ['pending', 'retry'] },

          next_attempt_at: { $lte: now },

          $or: [
            { lease_until: { $exists: false } },
            { lease_until: { $lte: now } }
          ]
        },
        {
          $set: {
            status: 'processing',
            lease_until: leaseUntil,
            worker_id: workerId,
            started_at: new Date()
          },
          $inc: {
            attempts: 1
          }
        },
        {
          sort: {
            created_at: 1
          },
          returnDocument: 'after'
        }
      );

    if (!result) {
      break;
    }

    jobs.push(result);
  }

  return jobs;
}

// ============================================================
// JOB SUCCESS
// ============================================================
//
// v1.1: التحقق من worker_id حتى لا يكمل worker قديم
// job تم التقاطه بواسطة worker آخر بعد انتهاء الـ lease.
// ============================================================

async function completeJob(job, workerId) {
  const database = await db();

  const result = await database
    .collection(MONGODB_JOBS_COLLECTION)
    .updateOne(
      {
        _id: job._id,
        status: 'processing',
        worker_id: workerId
      },
      {
        $set: {
          status: 'completed',
          completed_at: new Date()
        },
        $unset: {
          lease_until: '',
          worker_id: ''
        }
      }
    );

  if (result.modifiedCount !== 1) {
    console.warn(
      `[DeSinaHub] completeJob ignored (lease moved): ${job._id}`
    );
  }
}

// ============================================================
// JOB FAILURE
// ============================================================
//
// v1.1: التحقق من worker_id + تنبيه Telegram عند DLQ.
// ============================================================

async function failJob(job, workerId, error) {
  const database = await db();

  const attempts = Number(job.attempts || 1);

  const errorMessage = error?.message || String(error);

  if (attempts >= MAX_JOB_ATTEMPTS) {
    const ownership = await database
      .collection(MONGODB_JOBS_COLLECTION)
      .updateOne(
        {
          _id: job._id,
          worker_id: workerId
        },
        {
          $set: {
            status: 'dead_letter',
            last_error: errorMessage,
            failed_at: new Date()
          },
          $unset: {
            lease_until: '',
            worker_id: ''
          }
        }
      );

    if (ownership.modifiedCount !== 1) {
      console.warn(
        `[DeSinaHub] failJob ignored (lease moved): ${job._id}`
      );
      return;
    }

    await database
      .collection(MONGODB_DLQ_COLLECTION)
      .updateOne(
        { original_job_id: job._id },
        {
          $setOnInsert: {
            original_job_id: job._id,
            order_id: job.order_id,
            provider: job.provider,
            event_id: job.event_id,
            payload: job.payload,
            attempts,
            error: errorMessage,
            created_at: new Date()
          }
        },
        { upsert: true }
      );

    // تنبيه فوري: الـ DLQ لازم ميسكتش
    try {
      await sendTelegram({
        order_id: job.order_id,
        amount: job.amount,
        currency: job.currency,
        provider: job.provider,
        text:
          `🚨 Job مات ودخل DLQ بعد ${attempts} محاولات!\n` +
          `رقم الأوردر: ${job.order_id}\n` +
          `البوابة: ${job.provider}\n` +
          `آخر خطأ: ${errorMessage.slice(0, 300)}`
      });
    } catch (telegramError) {
      console.error(
        '[DeSinaHub] DLQ Telegram alert failed:',
        telegramError
      );
    }

    return;
  }

  await database
    .collection(MONGODB_JOBS_COLLECTION)
    .updateOne(
      {
        _id: job._id,
        worker_id: workerId
      },
      {
        $set: {
          status: 'retry',
          last_error: errorMessage,
          next_attempt_at: new Date(Date.now() + Math.min(3600, Math.pow(2, attempts) * 10) * 1000)
        },
        $unset: {
          lease_until: '',
          worker_id: ''
        }
      }
    );
}

// ============================================================
// WORKER ENTRY
// ============================================================

export async function runWorkerOnce() {
  await ensureIndexes();

  const workerId =
    process.env.WORKER_ID ||
    `worker-${process.pid}-${Date.now()}`;

  const jobs = await claimJobs(workerId, JOB_BATCH_SIZE);

  const results = await Promise.allSettled(
    jobs.map(async job => {
      try {
        await processJob(job);

        await completeJob(job, workerId);

        return {
          success: true,
          id: job._id
        };
      } catch (error) {
        await failJob(job, workerId, error);

        return {
          success: false,
          id: job._id,
          error: error?.message || String(error)
        };
      }
    })
  );

  return {
    claimed: jobs.length,
    results
  };
}

// ============================================================
// MAIN WEBHOOK HANDLER
// ============================================================

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');

    return res.status(405).json({
      error: 'Method Not Allowed'
    });
  }

  let claimedWebhook = null;

  try {
    await ensureIndexes();

    const rawBody = getRawBody(req);

    let paymentData;

    try {
      paymentData = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    } catch {
      return res.status(400).json({
        error: 'Invalid JSON payload'
      });
    }

    if (!paymentData || typeof paymentData !== 'object') {
      return res.status(400).json({
        error: 'Invalid webhook payload'
      });
    }

    const headers = req.headers || {};

    const provider = detectProvider(headers, paymentData);

    const verification = await verifyProviderWebhook({
      provider,
      headers,
      rawBody,
      payload: paymentData
    });

    if (!verification.verified) {
      console.error(
        `Webhook verification failed | provider=${provider} | reason=${verification.reason}`
      );

      if (IS_PRODUCTION || !ALLOW_UNVERIFIED) {
        return res.status(401).json({
          error: 'Webhook signature verification failed',
          provider
        });
      }
    }

    const orderId = extractOrderId(paymentData);

    if (!orderId) {
      return res.status(400).json({
        error: 'Order ID not found in payload'
      });
    }

    const amount = extractAmount(paymentData);

    const currency = extractCurrency(paymentData);

    const customerEmail = extractCustomerEmail(paymentData);

    const isSuccess = detectSuccess(paymentData);

    const eventId = extractEventId(provider, paymentData, headers);

    const claim = await claimWebhookEvent({
      provider,
      eventId,
      orderId,
      payload: paymentData
    });

    claimedWebhook = claim;

    if (claim.duplicate) {
      return res.status(200).json({
        received: true,
        duplicate: true,
        orderId,
        provider
      });
    }

    // --------------------------------------------------------
    // Non-Success Event
    // --------------------------------------------------------
    //
    // v1.1: تسجيل payment_status='failed' على الطلب
    // بدل تركه معلقاً بلا حالة.
    // --------------------------------------------------------

    if (!isSuccess) {
      try {
        const database = await db();

        await database
          .collection(MONGODB_ORDERS_COLLECTION)
          .updateOne(
            {
              order_id: orderId,
              payment_status: 'pending'
            },
            {
              $set: {
                payment_status: 'failed',
                updated_at: new Date()
              }
            }
          );
      } catch (orderError) {
        console.error(
          '[DeSinaHub] Failed to mark order as failed:',
          orderError
        );
      }

      await updateWebhookStatus(
        claim.idempotencyKey,
        'ignored',
        {
          processed_at: new Date(),
          reason: 'Payment event is not successful'
        }
      );

      return res.status(200).json({
        received: true,
        processed: false,
        reason: 'Payment event is not successful',
        orderId,
        provider
      });
    }

    await commitPayment({
      orderId,
      provider,
      eventId,
      amount,
      currency,
      idempotencyKey: claim.idempotencyKey,
      payload: paymentData,
      customerEmail
    });

    console.log(
      `Payment committed | provider=${provider} | order=${orderId} | event=${eventId || 'N/A'}`
    );

    return res.status(200).json({
      received: true,
      processed: true,
      queued: true,
      orderId,
      provider,
      eventId: eventId || null
    });
  } catch (error) {
    console.error(
      'DeSinaHub Webhook Error:',
      error
    );

    if (claimedWebhook?.idempotencyKey) {
      try {
        await updateWebhookStatus(
          claimedWebhook.idempotencyKey,
          'failed',
          {
            last_error: error?.message || String(error),
            failed_at: new Date()
          }
        );
      } catch (statusError) {
        console.error(
          'Failed to update webhook error status:',
          statusError
        );
      }
    }

    return res.status(500).json({
      error: 'Internal Server Error'
    });
  }
}
