// ================================================================
// DeSinaHub — Order tracking lookup API
// ================================================================
// الغرض: allowing a shopper to follow an order from another device.
//
// قواعد الحماية (Order-data protection):
// 1) الوصول يُتحقق عليه في السيرفر: رقم الطلب + بريد أو هاتف مطابق للطلب نفسه.
// 2) رقم الطلب DeSinaHub قصير (6 أرقام) لذا لا يُعامل كسر وصول: بدون مطابق
//    لا تُرجع أي بيانات، والرسالة واحدة سواء وجد الطلب أو لم يوجد.
// 3) الاستجابة تحتوي الحد الأدنى: الحالة، التاريخ، العدد، الإجمالي، العناصر.
//    لا اسم العميل ولا هاتف ولا بريد ولا عنوان ولا رقم عملية دفع.
// 4) أسعار العناصر لا تُقرأ من قاعدة البيانات (كُتبت من المتصفح أصلًا)؛
//    تُرسل الأكواد والكميات فقط ويعيد الواجهة تسعيرها من كتالوج المتجر الرسمي.
// 5) Rate limiting لكل IP، والاستجابة بلا كاش.
//
// يتطلب MONGODB_URI. بدونه تُرجع 503 ويتابع الموقع العمل بالتتبع المحلي.
// ================================================================

import crypto from 'node:crypto';

import { getDatabase } from '../lib/mongodb.js';

const ORDERS_COLLECTION = 'orders';

const RATE_LIMIT_MAX = Number(process.env.TRACK_RATE_LIMIT_MAX) || 8;
const RATE_LIMIT_WINDOW_MS = Number(process.env.TRACK_RATE_LIMIT_WINDOW_MS) || 60_000;
const rateBuckets = new Map();

const NOT_FOUND = { ok: false, error: 'order_not_found' };

function digest(value) {
  return crypto.createHash('sha256').update(String(value)).digest();
}

// Both sides are hashed first, so the comparison always runs on equal-length buffers.
function secretMatches(provided, stored) {
  if (!provided || !stored) return false;
  return crypto.timingSafeEqual(digest(provided), digest(stored));
}

function normalizeOrderId(value) {
  const text = String(value ?? '').trim().toUpperCase();
  return /^[A-Z0-9][A-Z0-9_-]{3,63}$/.test(text) ? text : null;
}

function normalizeEmail(value) {
  const text = String(value ?? '').trim().toLowerCase();
  return text.length <= 254 && text.includes('@') ? text : null;
}

function normalizePhone(value) {
  const digits = String(value ?? '').replace(/\D/g, '');
  return digits.length >= 8 && digits.length <= 15 ? digits : null;
}

function normalizeContact(value) {
  return normalizeEmail(value) ?? normalizePhone(value);
}

function clientKey(req) {
  const forwarded = req.headers?.['x-forwarded-for'];
  const first = Array.isArray(forwarded) ? forwarded[0] : String(forwarded ?? '').split(',')[0];
  return (first || req.socket?.remoteAddress || 'unknown').trim();
}

function isRateLimited(req) {
  const now = Date.now();
  const key = clientKey(req);
  const bucket = rateBuckets.get(key);

  if (!bucket || now - bucket.start > RATE_LIMIT_WINDOW_MS) {
    rateBuckets.set(key, { start: now, count: 1 });
    if (rateBuckets.size > 5000) {
      for (const [entryKey, entry] of rateBuckets) {
        if (now - entry.start > RATE_LIMIT_WINDOW_MS) rateBuckets.delete(entryKey);
      }
    }
    return false;
  }

  bucket.count += 1;
  return bucket.count > RATE_LIMIT_MAX;
}

// الحالة في قاعدة البيانات لا تطابق واجهة المتجر، تُخفَّض إلى الحالات المدعومة.
function mapStatus(order) {
  const payment = String(order.payment_status ?? '').toLowerCase();
  const status = String(order.status ?? '').toLowerCase();
  const fulfillment = String(order.order_status ?? '').toLowerCase();

  if (fulfillment === 'delivered') return 'delivered';
  if (fulfillment === 'shipped') return 'shipped';
  if (payment === 'paid' || status === 'confirmed' || status === 'processing' || status === 'completed') {
    return 'processing';
  }
  return 'awaiting_payment';
}

function totalOf(order) {
  const cents = Number(order.amount_cents ?? order.total_cents);
  if (Number.isFinite(cents) && cents > 0) return Math.round(cents) / 100;
  const units = Number(order.amount ?? order.total_amount);
  return Number.isFinite(units) && units > 0 ? Math.round(units) : 0;
}

function linesOf(order) {
  const items = Array.isArray(order.cart_items) ? order.cart_items : [];
  return items
    .map((item) => {
      const rawCode = String(item?.code ?? item?.product_id ?? item?.sku ?? item?.id ?? '');
      const code = Number(rawCode.replace(/\D/g, ''));
      const quantity = Number(item?.quantity ?? item?.qty ?? item?.count);
      if (!Number.isFinite(code) || code <= 0) return null;
      return { code, quantity: Math.min(Math.max(Math.round(quantity) || 1, 1), 99) };
    })
    .filter(Boolean)
    .slice(0, 100);
}

function isoDate(value) {
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}

function project(order) {
  const lines = linesOf(order);
  const id = normalizeOrderId(order.order_id ?? order.custom_order_number);

  return {
    ok: true,
    order: {
      id,
      status: mapStatus(order),
      date: isoDate(order.created_at ?? order.updated_at),
      updatedAt: isoDate(order.updated_at ?? order.created_at),
      total: totalOf(order),
      currency: 'EGP',
      paymentMethod: String(order.payment_gateway ?? order.gateway_name ?? '').slice(0, 40),
      items: lines,
      itemCount: lines.reduce((sum, line) => sum + line.quantity, 0),
    },
  };
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, max-age=0, must-revalidate');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  if (isRateLimited(req)) {
    res.setHeader('Retry-After', String(Math.ceil(RATE_LIMIT_WINDOW_MS / 1000)));
    return res.status(429).json({ ok: false, error: 'too_many_requests' });
  }

  const body = req.body ?? {};
  const orderId = normalizeOrderId(body.order_id ?? body.orderId ?? body.id);
  const contact = normalizeContact(body.contact ?? body.email ?? body.phone);

  if (!orderId || !contact) {
    return res.status(400).json({ ok: false, error: 'invalid_request' });
  }

  if (!process.env.MONGODB_URI) {
    return res.status(503).json({ ok: false, error: 'tracking_unavailable' });
  }

  let order;

  try {
    const db = await getDatabase();
    order = await db.collection(ORDERS_COLLECTION).findOne(
      { $or: [{ order_id: orderId }, { custom_order_number: orderId }] },
      {
        projection: {
          order_id: 1,
          custom_order_number: 1,
          status: 1,
          order_status: 1,
          payment_status: 1,
          amount: 1,
          total_amount: 1,
          amount_cents: 1,
          total_cents: 1,
          currency: 1,
          payment_gateway: 1,
          gateway_name: 1,
          cart_items: 1,
          created_at: 1,
          updated_at: 1,
          customer: 1,
          customer_email: 1,
          customer_phone: 1,
        },
      }
    );
  } catch (error) {
    // رسالة عامة: تفاصيل قاعدة البيانات ورسائل الأخطاء الداخلية لا تصل للمتصفح.
    console.error('[track] lookup failed:', error?.message);
    return res.status(503).json({ ok: false, error: 'tracking_unavailable' });
  }

  if (!order) return res.status(404).json(NOT_FOUND);

  const storedEmails = [order.customer?.email, order.customer_email];
  const storedPhones = [order.customer?.phone, order.customer_phone];

  const email = normalizeEmail(contact);
  const phone = normalizePhone(contact);

  const verified = email
    ? storedEmails.some((value) => secretMatches(email, normalizeEmail(value)))
    : storedPhones.some((value) => secretMatches(phone, normalizePhone(value)));

  // نفس الرد في الحالتين: لا يوجد طلب، أو الطلب موجود وبيانات التحقق غير مطابقة.
  if (!verified) return res.status(404).json(NOT_FOUND);

  const payload = project(order);
  if (!payload.order.id) return res.status(404).json(NOT_FOUND);

  return res.status(200).json(payload);
}
