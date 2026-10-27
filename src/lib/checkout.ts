import type { Lang } from './site';

/**
 * Gateway destinations copied byte-for-byte from checkout.html.
 * These are the tested redirect targets; the real integration can later swap
 * them for backend-issued payment sessions without touching the UI.
 */
export const GATEWAY_LINKS: Record<string, string> = {
  vodafone: 'https://paymob.com',
  etisalat: 'https://paymob.com',
  orange: 'https://paymob.com',
  instapay: 'https://www.instapay.eg',
  bank_1: 'https://example.com/test/bank-1',
  bank_2: 'https://example.com/test/bank-2',
  bank_3: 'https://example.com/test/bank-3',
  bank_4: 'https://example.com/test/bank-4',
  visa: 'https://stripe.com',
  mastercard: 'https://stripe.com',
  paypal: 'https://paypal.com',
  applepay: 'https://apple.com',
};

export const DEFAULT_PAYMENT_METHOD = 'visa';

/** Same algorithm as buildGatewayUrl() in checkout.html. */
export function buildGatewayUrl(
  method: string,
  orderId: string,
  amount: string | number,
  currency: string,
): string | null {
  const base = GATEWAY_LINKS[method];
  if (!base) return null;
  try {
    const url = new URL(base);
    url.searchParams.set('order_id', orderId);
    url.searchParams.set('amount', String(amount));
    url.searchParams.set('currency', currency);
    url.searchParams.set('payment_method', method);
    return url.toString();
  } catch {
    const separator = base.includes('?') ? '&' : '?';
    return `${base}${separator}order_id=${encodeURIComponent(orderId)}&amount=${encodeURIComponent(
      String(amount),
    )}&currency=${encodeURIComponent(currency)}&payment_method=${encodeURIComponent(method)}`;
  }
}

/** Legacy order number format from cart.html: DS-HUB-######. */
export function generateOrderId(): string {
  return 'DS-HUB-' + Math.floor(100000 + Math.random() * 900000);
}

export const ORDER_ID_PATTERN = /^DS-HUB-\d{6}$/;

export type PaymentMethod = {
  id: string;
  label: { ar: string; en: string };
  image?: string;
};

export type PaymentGroup = {
  title: { ar: string; en: string };
  methods: PaymentMethod[];
};

export const PAYMENT_GROUPS: PaymentGroup[] = [
  {
    title: { ar: 'المحافظ المحلية والدفع الفوري', en: 'Local Wallets & Instant Pay' },
    methods: [
      { id: 'vodafone', label: { ar: 'فودافون كاش', en: 'Vodafone Cash' } },
      { id: 'etisalat', label: { ar: 'اتصالات كاش', en: 'Etisalat Cash' } },
      { id: 'orange', label: { ar: 'أورنج كاش', en: 'Orange Cash' } },
      { id: 'instapay', label: { ar: 'إنستاباي', en: 'InstaPay' }, image: '/assets/payments/instapay.webp' },
    ],
  },
  {
    title: { ar: 'الحسابات والتحويلات البنكية', en: 'Bank Accounts & Transfers' },
    methods: [
      { id: 'bank_1', label: { ar: 'بنك قطر الوطني', en: 'QNB' }, image: '/assets/payments/qnb.webp' },
      { id: 'bank_2', label: { ar: 'بنك المشرق', en: 'Mashreq' }, image: '/assets/payments/mashreq.webp' },
      { id: 'bank_3', label: { ar: 'تحويل بنكي 3', en: 'Bank Transfer 3' } },
      { id: 'bank_4', label: { ar: 'تحويل بنكي 4', en: 'Bank Transfer 4' }, image: '/assets/payments/bmp-logo1.webp' },
    ],
  },
  {
    title: { ar: 'المدفوعات الدولية والبطاقات', en: 'Global Payments & Cards' },
    methods: [
      { id: 'visa', label: { ar: 'فيزا', en: 'Visa' }, image: '/assets/payments/visa.webp' },
      { id: 'mastercard', label: { ar: 'ماستركارد', en: 'Mastercard' }, image: '/assets/payments/mastercard.webp' },
      { id: 'paypal', label: { ar: 'باي بال', en: 'PayPal' }, image: '/assets/payments/paypal.webp' },
      { id: 'applepay', label: { ar: 'أبل باي', en: 'Apple Pay' }, image: '/assets/payments/applepay.webp' },
    ],
  },
];

export function paymentMethodLabel(method: string, lang: Lang): string {
  for (const group of PAYMENT_GROUPS) {
    const found = group.methods.find((m) => m.id === method);
    if (found) return found.label[lang];
  }
  return method;
}

export type CheckoutCustomer = { name: string; phone: string };
export type CheckoutShipping = { country: string; city: string; zip: string; address: string };

export type CheckoutPayload = {
  order_id: string;
  amount: number;
  currency: string;
  payment_method: string;
  customer: CheckoutCustomer;
  shipping: CheckoutShipping;
  created_at: string;
  cart_items: { code: number; qty: number }[];
};

export type CheckoutApiPayload = {
  order_id: string;
  currency: string;
  payment_method: string;
  customer: CheckoutCustomer;
  shipping_address: CheckoutShipping;
  cart_items: { code: number; qty: number }[];
};

export function cleanText(value: unknown, max = 500): string {
  return String(value ?? '').trim().slice(0, max);
}

/** Maps the invoice payload onto the preserved POST /api/checkout contract. */
export function toCheckoutApiPayload(payload: CheckoutPayload): CheckoutApiPayload {
  return {
    order_id: payload.order_id,
    currency: payload.currency,
    payment_method: payload.payment_method,
    customer: payload.customer,
    shipping_address: payload.shipping,
    cart_items: payload.cart_items,
  };
}
