// ============================================================
// DeSinaHub Durable Payment Worker
// ============================================================
// PURPOSE:
// Vercel Cron -> Worker -> MongoDB Durable Jobs Queue
//
// IMPORTANT:
// - webhook.js = FINAL / DO NOT MODIFY
// - worker.js = Cron entry point only
// - Worker processing logic remains in webhook.js
// - MongoDB Jobs Queue is the durable async queue
// - CRON_SECRET protects this endpoint
//
// v1.1:
// - الاستيراد من ./webhook.js (الملف الواقعي الوحيد)
// - حذف الاستيراد المرجعي لملف غير موجود
//
// FILE LOCATION:
// /api/worker.js
// ============================================================

// ⚠️⚠️⚠️
// ده أهم سطر في الملف:
// منطق الـ Worker كاملاً (claim / process / retry / DLQ)
// موجود في ملف webhook.js نفسه — مش في ملف منفصل
// ⚠️⚠️⚠️
import { runWorkerOnce } from './webhook.js';

// ============================================================
// VERCEL FUNCTION SETTINGS
// ============================================================

// Node.js runtime is required for MongoDB and server-side APIs.
export const runtime = 'nodejs';

// Allow enough time for one worker batch.
// Actual maximum depends on the Vercel plan/configuration.
//
// ملاحظة:
// JOB_BATCH_SIZE الافتراضي = 25 job لكل تشغيلة.
// لو Batch كاملاً بياخد أكتر من 60 ثانية:
// - إما تقلل JOB_BATCH_SIZE في Environment Variables
// - أو ترفع maxDuration حسب البلان
export const maxDuration = 60;

// ============================================================
// WORKER HANDLER
// ============================================================

export default async function handler(req, res) {

  // ----------------------------------------------------------
  // 1. METHOD CHECK
  // ----------------------------------------------------------

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');

    return res.status(405).json({
      success: false,
      error: 'Method Not Allowed'
    });
  }

  // ----------------------------------------------------------
  // 2. CRON SECRET CHECK
  // ----------------------------------------------------------

  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    console.error(
      '[DeSinaHub Worker] CRON_SECRET is not configured'
    );

    return res.status(500).json({
      success: false,
      error: 'Worker security is not configured'
    });
  }

  // ----------------------------------------------------------
  // 3. AUTHORIZATION HEADER
  // ----------------------------------------------------------

  const authorization =
    req.headers.authorization || '';

  const expectedAuthorization =
    `Bearer ${cronSecret}`;

  if (authorization !== expectedAuthorization) {
    console.warn(
      '[DeSinaHub Worker] Unauthorized worker request'
    );

    return res.status(401).json({
      success: false,
      error: 'Unauthorized'
    });
  }

  // ----------------------------------------------------------
  // 4. RUN DURABLE JOB WORKER
  // ----------------------------------------------------------

  try {

    console.log(
      '[DeSinaHub Worker] Worker execution started'
    );

    const result =
      await runWorkerOnce();

    // --------------------------------------------------------
    // 5. SUCCESS RESPONSE
    // --------------------------------------------------------

    console.log(
      `[DeSinaHub Worker] Worker execution completed | claimed=${result?.claimed || 0}`
    );

    return res.status(200).json({
      success: true,
      worker: 'DeSinaHub',
      claimed: result?.claimed || 0,
      results: result?.results || []
    });

  } catch (error) {

    // --------------------------------------------------------
    // 6. WORKER FAILURE
    // --------------------------------------------------------

    console.error(
      '[DeSinaHub Worker] Worker execution failed:',
      error
    );

    return res.status(500).json({
      success: false,
      error: 'Worker execution failed'
    });
  }
}
