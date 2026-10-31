// ================================================================
// DeSinaHub - Checkout API
// ================================================================
// الوظيفة:
// استقبال بيانات Checkout من المتصفح ثم حفظ الطلب في MongoDB Atlas.
//
// المعمارية:
// checkout.html
//      ↓
// api/checkout.js
//      ↓
// lib/mongodb.js
//      ↓
// MongoDB Atlas
//
// MongoDB Atlas = Primary Source of Truth
// Supabase       = Webhook Audit / Backup
// jobs           = Async Processing Queue
//
// v1.1 — التعديلات:
// 1) السعر يُحسب Server-Side من أسعار قاعدة البيانات
//    (المبلغ القادم من المتصفح لا يُعتمد)
// 2) Rate Limiting بسيط لكل IP
// 3) حقل email في بيانات العميل
// 4) next_attempt_at في الـ checkout job
// 5) توحيد الاستيراد إلى lib/mongodb.js
// 6) Timeout على نداء Supabase
//
// مهم:
// - لا توجد هنا مفاتيح Stripe / PayPal / Paymob.
// - كل الأسرار تأتي من Vercel Environment Variables.
//
// يتطلب:
// - collection باسم "products" فيه كل منتج:
//   { code: "CODE-1", price: 800, ... }
//   (البحث يتم أيضاً بـ product_id أو id إن وجدت)
// ================================================================

import crypto from 'node:crypto';

import { getDatabase } from "../lib/mongodb.js";

// ---------------------------------------------------------------
// إعدادات الـ Collections
// ---------------------------------------------------------------

const ORDERS_COLLECTION = "orders";
const JOBS_COLLECTION = "jobs";
const WEBHOOK_COLLECTION = "webhook_events";
const PRODUCTS_COLLECTION = "products";

// ---------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------

function safeString(value, fallback = "") {
  if (value === null || value === undefined) return fallback;

  return String(value)
    .trim()
    .slice(0, 2000);
}

function safeOrderId(value) {
  const id = safeString(value);

  if (!id) return "";

  return id
    .replace(/[^a-zA-Z0-9._-]/g, "")
    .slice(0, 100);
}

function generateOrderId() {
  return `DSH-${Date.now()}-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
}

function safeCurrency(value) {
  const currency = safeString(value, "EGP").toUpperCase();

  if (!/^[A-Z]{3}$/.test(currency)) {
    return "EGP";
  }

  return currency;
}

function safePaymentMethod(value) {
  const method = safeString(value, "unknown")
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "");

  return method.slice(0, 50) || "unknown";
}

function safeNumber(value, fallback = 0) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return fallback;
  }

  return number;
}

function safeQuantity(value) {
  const qty = Math.floor(safeNumber(value, 1));

  if (qty < 1) return 1;

  if (qty > 99) return 99;

  return qty;
}

function roundMoney(value) {
  return Math.round(value * 100) / 100;
}

function amountToCents(value) {
  const amount = safeNumber(value, 0);

  if (amount < 0) return 0;

  return Math.round(amount * 100);
}

function createIdempotencyKey(orderId) {
  return `checkout:${orderId}`;
}

function getClientIp(req) {
  const forwarded = req.headers?.["x-forwarded-for"];

  if (forwarded) {
    return String(forwarded)
      .split(",")[0]
      .trim()
      .slice(0, 100);
  }

  return safeString(
    req.headers?.["x-real-ip"],
    ""
  ).slice(0, 100);
}

// ---------------------------------------------------------------
// Rate Limiting (in-memory)
// ---------------------------------------------------------------
//
// يعمل لكل function instance على Vercel.
// قبل الإطلاق الكبير يُنصح بـ Upstash Redis للحد الموزع.
// ---------------------------------------------------------------

const RATE_LIMIT_MAX = Number(process.env.CHECKOUT_RATE_LIMIT_MAX || 10);

const RATE_LIMIT_WINDOW_MS = Number(process.env.CHECKOUT_RATE_LIMIT_WINDOW_MS || 10 * 60 * 1000);

const rateLimitMap = new Map();

function checkRateLimit(ip) {
  const now = Date.now();

  const entry = rateLimitMap.get(ip) || [];

  const recent = entry.filter(
    timestamp => now - timestamp < RATE_LIMIT_WINDOW_MS
  );

  if (recent.length >= RATE_LIMIT_MAX) {
    return false;
  }

  recent.push(now);

  rateLimitMap.set(ip, recent);

  // منع نمو غير محدود للـ Map
  if (rateLimitMap.size > 10000) {
    rateLimitMap.clear();
  }

  return true;
}

// ---------------------------------------------------------------
// قراءة Body بشكل آمن
// ---------------------------------------------------------------

async function readBody(req) {
  if (req.body && typeof req.body === "object") {
    return req.body;
  }

  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body);
    } catch {
      throw new Error("Invalid JSON body");
    }
  }

  return {};
}

// ---------------------------------------------------------------
// استخراج بيانات العميل
// ---------------------------------------------------------------

function normalizeCustomer(payload) {
  const customer = payload.customer || {};

  const shipping =
    payload.shipping_address ||
    payload.shippingAddress ||
    {};

  const name = safeString(
    customer.full_name ??
    customer.name ??
    payload.customer_name ??
    payload.full_name
  ).slice(0, 200);

  const phone = safeString(
    customer.phone ??
    payload.customer_phone ??
    payload.phone
  ).slice(0, 50);

  const email = safeString(
    customer.email ??
    payload.customer_email ??
    payload.email
  ).slice(0, 200);

  const country = safeString(
    shipping.country ??
    payload.country
  ).slice(0, 100);

  const city = safeString(
    shipping.city ??
    payload.city
  ).slice(0, 100);

  const zip = safeString(
    shipping.zip_code ??
    shipping.zip ??
    payload.zip
  ).slice(0, 20);

  const address = safeString(
    shipping.address_details ??
    shipping.address ??
    payload.address
  ).slice(0, 500);

  return {
    name,
    phone,
    email,
    country,
    city,
    zip,
    address
  };
}

// ---------------------------------------------------------------
// استخراج بيانات الطلب (بدون الاعتماد على amount القادم من العميل)
// ---------------------------------------------------------------

function normalizeOrder(payload) {
  // v1.1: إذا لم يرسل العميل order_id يتم توليده على السيرفر
  const orderId = safeOrderId(
    payload.order_id ??
    payload.orderId ??
    payload.custom_order_number
  ) || generateOrderId();

  const currency = safeCurrency(
    payload.currency
  );

  const paymentMethod = safePaymentMethod(
    payload.payment_method ??
    payload.paymentMethod ??
    payload.payment_gateway ??
    payload.gateway_name
  );

  const cartItems = Array.isArray(payload.cart_items)
    ? payload.cart_items
    : Array.isArray(payload.items)
      ? payload.items
      : [];

  // المبلغ القادم من المتصفح — لا يُعتمد، يُستخدم للمقارنة فقط
  const clientAmount = safeNumber(
    payload.amount ??
    payload.total_amount ??
    payload.total ??
    0
  );

  return {
    orderId,
    clientAmount,
    currency,
    paymentMethod,
    cartItems
  };
}

// ---------------------------------------------------------------
// حساب الإجمالي من قاعدة البيانات (Server-Side)
// ---------------------------------------------------------------
//
// هذا هو سطر الأمان الأساسي:
// كل منتج يُسحب سعره الحقيقي من collection: products
// والكمية محدودة (1..99 لكل منتج، أقصى 100 منتج في السلة).
// أي منتج غير موجود أو بدون سعر → الطلب يُرفض بالكامل.
// ---------------------------------------------------------------

async function calculateServerTotal(db, cartItems) {
  if (!cartItems.length) {
    return {
      ok: false,
      error: "Cart is empty"
    };
  }

  if (cartItems.length > 100) {
    return {
      ok: false,
      error: "Too many items in cart"
    };
  }

  let total = 0;

  const productsCollection =
    db.collection(PRODUCTS_COLLECTION);

  for (const item of cartItems) {
    const code = safeString(
      item.code ??
      item.product_id ??
      item.productId ??
      item.id ??
      item.sku
    ).slice(0, 100);

    const qty = safeQuantity(
      item.qty ??
      item.quantity ??
      item.count
    );

    if (!code) {
      return {
        ok: false,
        error: "Cart item is missing product code"
      };
    }

    const product =
      await productsCollection.findOne({
        $or: [
          { code: code },
          { product_id: code },
          { id: code }
        ]
      });

    if (!product) {
      return {
        ok: false,
        error: `Product not found: ${code}`
      };
    }

    const price = safeNumber(
      product.price ??
      product.sale_price ??
      product.amount,
      -1
    );

    if (price < 0) {
      return {
        ok: false,
        error: `Product has no valid price: ${code}`
      };
    }

    total += price * qty;
  }

  return {
    ok: true,
    total: roundMoney(total),
    currency: "EGP"
  };
}

// ---------------------------------------------------------------
// التحقق من صحة البيانات
// ---------------------------------------------------------------

function validateCheckout(order, customer) {
  const errors = [];

  if (!order.orderId) {
    errors.push("order_id is required");
  }

  if (!order.amount || order.amount <= 0) {
    errors.push("amount must be greater than zero");
  }

  if (!customer.name) {
    errors.push("customer name is required");
  }

  if (!customer.phone) {
    errors.push("customer phone is required");
  }

  if (errors.length) {
    return {
      valid: false,
      errors
    };
  }

  return {
    valid: true,
    errors: []
  };
}

// ---------------------------------------------------------------
// إنشاء سجل الطلب
// ---------------------------------------------------------------

function buildOrderDocument(order, customer, req) {
  const now = new Date();

  return {
    order_id: order.orderId,
    custom_order_number: order.orderId,

    amount: order.amount,
    total_amount: order.amount,
    amount_cents: order.amountCents,
    total_cents: order.amountCents,
    currency: order.currency,

    payment_gateway: order.paymentMethod,
    gateway_name: order.paymentMethod,

    status: "pending",
    payment_status: "pending",
    order_status: "processing",

    customer: {
      full_name: customer.name,
      phone: customer.phone,
      email: customer.email
    },

    customer_name: customer.name,
    customer_phone: customer.phone,
    customer_email: customer.email,

    shipping_address: {
      country: customer.country,
      city: customer.city,
      zip_code: customer.zip,
      address_details: customer.address
    },

    cart_items: order.cartItems,

    idempotency_key:
      createIdempotencyKey(order.orderId),

    source: "checkout",

    client_ip: getClientIp(req),

    created_at: now,
    updated_at: now,

    payment: {
      provider: order.paymentMethod,
      status: "pending",
      transaction_id: null,
      paid_at: null
    }
  };
}

// ---------------------------------------------------------------
// إنشاء Job للمعالجة غير المتزامنة
// ---------------------------------------------------------------
//
// job_type = 'payment_initialization'
// الـ worker الحالي لا يلتقطه (يفلتر على payment_success).
// يوجد هنا كـ Audit / Hook مستقبلي (تأكيد الطلب، COD...).
// ---------------------------------------------------------------

function buildPaymentJob(order, customer) {
  const now = new Date();

  return {
    provider: order.paymentMethod,

    event_id: `checkout:${order.orderId}`,

    order_id: order.orderId,

    type: "payment_initialization",

    job_type: "payment_initialization",

    status: "pending",

    payload: {
      order_id: order.orderId,

      amount: order.amount,

      amount_cents: order.amountCents,

      currency: order.currency,

      payment_gateway: order.paymentMethod,

      customer: {
        name: customer.name,
        phone: customer.phone,
        email: customer.email
      }
    },

    attempts: 0,

    created_at: now,

    updated_at: now,

    next_attempt_at: now
  };
}

// ---------------------------------------------------------------
// Supabase Audit / Backup
// ---------------------------------------------------------------
// MongoDB يظل المصدر الأساسي.
// فشل Supabase لا يلغي إنشاء الطلب في MongoDB.
// ---------------------------------------------------------------

async function writeSupabaseAudit(order, customer) {
  const supabaseUrl =
    process.env.SUPABASE_URL;

  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY;

  const table =
    process.env.SUPABASE_WEBHOOK_TABLE ||
    "webhook_events";

  if (!supabaseUrl || !serviceKey) {
    return {
      attempted: false,
      success: false,
      skipped: true
    };
  }

  const endpoint =
    `${supabaseUrl.replace(/\/$/, "")}/rest/v1/${table}`;

  const auditDocument = {
    idempotency_key:
      createIdempotencyKey(order.orderId),

    provider: order.paymentMethod,

    event_id: `checkout:${order.orderId}`,

    order_id: order.orderId,

    event_type: "checkout.created",

    payload: {
      order_id: order.orderId,

      amount: order.amount,

      amount_cents: order.amountCents,

      currency: order.currency,

      payment_gateway: order.paymentMethod,

      customer: {
        name: customer.name,
        phone: customer.phone,
        email: customer.email
      }
    },

    created_at: new Date().toISOString()
  };

  try {
    const response =
      await fetch(endpoint, {
        method: "POST",

        headers: {
          "apikey": serviceKey,

          "Authorization":
            `Bearer ${serviceKey}`,

          "Content-Type":
            "application/json",

          "Prefer":
            "resolution=merge-duplicates,return=minimal"
        },

        body:
          JSON.stringify(auditDocument),

        signal:
          AbortSignal.timeout(8000)
      });

    if (!response.ok) {
      const text =
        await response.text();

      console.error(
        "Supabase audit failed:",
        response.status,
        text.slice(0, 500)
      );

      return {
        attempted: true,
        success: false,
        skipped: false
      };
    }

    return {
      attempted: true,
      success: true,
      skipped: false
    };

  } catch (error) {
    console.error(
      "Supabase audit connection error:",
      error
    );

    return {
      attempted: true,
      success: false,
      skipped: false
    };
  }
}

// ---------------------------------------------------------------
// HTTP Handler
// ---------------------------------------------------------------

export default async function handler(req, res) {

  // -------------------------------------------------------------
  // CORS / OPTIONS
  // -------------------------------------------------------------

  if (req.method === "OPTIONS") {

    res.setHeader(
      "Access-Control-Allow-Origin",
      "*"
    );

    res.setHeader(
      "Access-Control-Allow-Methods",
      "POST, OPTIONS"
    );

    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type"
    );

    return res.status(204).end();
  }

  // -------------------------------------------------------------
  // POST فقط
  // -------------------------------------------------------------

  if (req.method !== "POST") {
    return res.status(405).json({
      ok: false,
      error: "Method not allowed"
    });
  }

  try {

    // -----------------------------------------------------------
    // Rate Limiting
    // -----------------------------------------------------------

    const clientIp = getClientIp(req) || "unknown";

    if (!checkRateLimit(clientIp)) {
      return res.status(429).json({
        ok: false,
        error: "Too many requests. Please try again later."
      });
    }

    // -----------------------------------------------------------
    // قراءة Body
    // -----------------------------------------------------------

    const payload =
      await readBody(req);

    // -----------------------------------------------------------
    // توحيد بيانات الطلب والعميل
    // -----------------------------------------------------------

    const order =
      normalizeOrder(payload);

    const customer =
      normalizeCustomer(payload);

    // -----------------------------------------------------------
    // MongoDB Atlas
    // -----------------------------------------------------------

    const db =
      await getDatabase();

    // -----------------------------------------------------------
    // v1.1: حساب الإجمالي Server-Side من أسعار الـ products
    //
    // أي فرق بين المبلغ المحسوب وما أرسله المتصفح
    // يُسجل في اللوجز فقط — القرار للسعر الحقيقي.
    // -----------------------------------------------------------

    const serverTotal =
      await calculateServerTotal(
        db,
        order.cartItems
      );

    if (!serverTotal.ok) {
      return res.status(400).json({
        ok: false,

        error:
          "Invalid cart",

        details: [
          serverTotal.error
        ]
      });
    }

    if (
      order.clientAmount > 0 &&
      Math.abs(order.clientAmount - serverTotal.total) > 0.01
    ) {
      console.warn(
        `[DeSinaHub Checkout] Client amount mismatch | ` +
        `order=${order.orderId} | ` +
        `client=${order.clientAmount} | ` +
        `server=${serverTotal.total} | ip=${clientIp}`
      );
    }

    order.amount = serverTotal.total;

    order.amountCents = amountToCents(serverTotal.total);

    order.currency = serverTotal.currency;

    // -----------------------------------------------------------
    // Validation
    // -----------------------------------------------------------

    const validation =
      validateCheckout(
        order,
        customer
      );

    if (!validation.valid) {
      return res.status(400).json({
        ok: false,

        error:
          "Invalid checkout data",

        details:
          validation.errors
      });
    }

    // -----------------------------------------------------------
    // Collections
    // -----------------------------------------------------------

    const orders =
      db.collection(
        ORDERS_COLLECTION
      );

    const jobs =
      db.collection(
        JOBS_COLLECTION
      );

    // -----------------------------------------------------------
    // Idempotency
    // -----------------------------------------------------------

    const idempotencyKey =
      createIdempotencyKey(
        order.orderId
      );

    const existingOrder =
      await orders.findOne({
        $or: [
          {
            order_id:
              order.orderId
          },

          {
            custom_order_number:
              order.orderId
          },

          {
            idempotency_key:
              idempotencyKey
          }
        ]
      });

    // -----------------------------------------------------------
    // الطلب موجود بالفعل
    // -----------------------------------------------------------

    if (existingOrder) {

      return res.status(200).json({
        ok: true,

        existing: true,

        order: {
          order_id:
            existingOrder.order_id ||
            existingOrder.custom_order_number,

          amount:
            existingOrder.amount ??
            existingOrder.total_amount ??
            0,

          amount_cents:
            existingOrder.amount_cents ??
            existingOrder.total_cents ??
            0,

          currency:
            existingOrder.currency ||
            order.currency,

          payment_gateway:
            existingOrder.payment_gateway ||
            order.paymentMethod,

          status:
            existingOrder.status ||
            "pending",

          payment_status:
            existingOrder.payment_status ||
            "pending"
        }
      });
    }

    // -----------------------------------------------------------
    // إنشاء سجل الطلب
    // -----------------------------------------------------------

    const orderDocument =
      buildOrderDocument(
        order,
        customer,
        req
      );

    let insertResult;

    try {

      insertResult =
        await orders.insertOne(
          orderDocument
        );

    } catch (insertError) {

      // ---------------------------------------------------------
      // Race Condition Protection
      // ---------------------------------------------------------

      if (
        insertError?.code === 11000
      ) {

        const duplicateOrder =
          await orders.findOne({
            $or: [
              {
                order_id:
                  order.orderId
              },

              {
                custom_order_number:
                  order.orderId
              },

              {
                idempotency_key:
                  idempotencyKey
              }
            ]
          });

        if (duplicateOrder) {

          return res.status(200).json({
            ok: true,

            existing: true,

            order: {
              order_id:
                duplicateOrder.order_id ||
                duplicateOrder.custom_order_number,

              amount:
                duplicateOrder.amount ??
                duplicateOrder.total_amount ??
                0,

              amount_cents:
                duplicateOrder.amount_cents ??
                duplicateOrder.total_cents ??
                0,

              currency:
                duplicateOrder.currency ||
                order.currency,

              payment_gateway:
                duplicateOrder.payment_gateway ||
                order.paymentMethod,

              status:
                duplicateOrder.status ||
                "pending",

              payment_status:
                duplicateOrder.payment_status ||
                "pending"
            }
          });
        }
      }

      throw insertError;
    }

    // -----------------------------------------------------------
    // إنشاء Job
    // -----------------------------------------------------------

    const jobDocument =
      buildPaymentJob(
        order,
        customer
      );

    let jobCreated = false;

    try {

      await jobs.updateOne(
        {
          provider:
            jobDocument.provider,

          event_id:
            jobDocument.event_id
        },

        {
          $setOnInsert:
            jobDocument,

          $set: {
            updated_at:
              new Date()
          }
        },

        {
          upsert: true
        }
      );

      jobCreated = true;

    } catch (jobError) {

      console.error(
        "Job creation error:",
        jobError
      );
    }

    // -----------------------------------------------------------
    // Supabase Audit
    // -----------------------------------------------------------

    const audit =
      await writeSupabaseAudit(
        order,
        customer
      );

    // -----------------------------------------------------------
    // الرد للـCheckout
    // -----------------------------------------------------------

    return res.status(201).json({
      ok: true,

      existing: false,

      order: {
        order_id:
          order.orderId,

        amount:
          order.amount,

        amount_cents:
          order.amountCents,

        currency:
          order.currency,

        payment_gateway:
          order.paymentMethod,

        status:
          "pending",

        payment_status:
          "pending"
      },

      processing: {
        job_created:
          jobCreated
      },

      audit: {
        attempted:
          audit.attempted,

        success:
          audit.success,

        skipped:
          audit.skipped
      }
    });

  } catch (error) {

    // -----------------------------------------------------------
    // Error Handler
    // -----------------------------------------------------------

    console.error(
      "DeSinaHub Checkout API Error:",
      error
    );

    return res.status(500).json({
      ok: false,

      error:
        "Unable to create checkout order"
    });
  }
}
