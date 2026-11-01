import type { Lang } from './site';
import { SITE_URL } from './site';
import type { Product } from './products';

export const CART_KEY = 'desina_cart';
export const ORDERS_KEY = 'orders';
export const ACCOUNT_KEY = 'desina_account';
export const CURRENCY = 'EGP';

/** Legacy shape from js/app.js — kept exactly so old carts keep working. */
export type CartItem = {
  code: number;
  name: string;
  price: number;
  quantity: number;
  link: string;
};

export type ArchivedOrder = {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  currency?: string;
  paymentMethod?: string;
  status?: string;
  customer?: { name: string; phone: string };
};

function safeItems(value: unknown): CartItem[] {
  if (!Array.isArray(value)) return [];
  const seen = new Map<number, CartItem>();
  for (const raw of value) {
    if (!raw || typeof raw !== 'object') continue;
    const item = raw as Record<string, unknown>;
    const code = Number(item.code);
    if (!Number.isInteger(code) || code <= 0) continue;
    const price = Number(item.price);
    const quantity = Number(item.quantity);
    const normalized: CartItem = {
      code,
      name: String(item.name ?? `CODE-${code}`),
      price: Number.isFinite(price) ? price : 0,
      quantity: Number.isFinite(quantity) ? Math.max(1, Math.floor(quantity)) : 1,
      link: String(item.link ?? `${SITE_URL}/product/${code}`),
    };
    const existing = seen.get(code);
    if (existing) {
      existing.quantity += normalized.quantity;
    } else {
      seen.set(code, normalized);
    }
  }
  return [...seen.values()];
}

export function readCartStorage(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    return safeItems(JSON.parse(window.localStorage.getItem(CART_KEY) || '[]'));
  } catch {
    return [];
  }
}

export function writeCartStorage(items: CartItem[]): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function readOrders(): ArchivedOrder[] {
  if (typeof window === 'undefined') return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(ORDERS_KEY) || '[]');
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((order): order is Record<string, unknown> => Boolean(order) && typeof order === 'object')
      .map((order) => ({
        id: String(order.id ?? ''),
        date: String(order.date ?? ''),
        items: safeItems(order.items),
        total: Number(order.total) || 0,
        currency: typeof order.currency === 'string' ? order.currency : 'EGP',
        paymentMethod: typeof order.paymentMethod === 'string' ? order.paymentMethod : undefined,
        status: typeof order.status === 'string' ? order.status : undefined,
        customer:
          order.customer && typeof order.customer === 'object'
            ? {
                name: String((order.customer as Record<string, unknown>).name ?? ''),
                phone: String((order.customer as Record<string, unknown>).phone ?? ''),
              }
            : undefined,
      }))
      .filter((order) => order.id);
  } catch {
    return [];
  }
}

export function archiveOrder(order: ArchivedOrder): void {
  if (typeof window === 'undefined') return;
  try {
    const orders = readOrders();
    if (!orders.some((entry) => entry.id === order.id)) {
      orders.push(order);
      window.localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    }
  } catch (error) {
    console.error('DeSinaHub order archive error:', error);
  }
}

export function cartTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function cartCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function toCartItem(product: Product, lang: Lang, quantity = 1): CartItem {
  return {
    code: product.code,
    name: product.name[lang],
    price: product.price,
    quantity: Math.max(1, Math.floor(quantity)),
    link: `${SITE_URL}/product/${product.code}`,
  };
}

/** Archives the pending order before leaving for checkout, exactly like cart.html. */
export function prepareCheckout(items: CartItem[], lang: Lang) {
  const orderId = 'DS-HUB-' + Math.floor(100000 + Math.random() * 900000);
  const total = cartTotal(items);
  archiveOrder({
    id: orderId,
    date: new Date().toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-GB'),
    items: items.map((item) => ({ ...item })),
    total,
    currency: CURRENCY,
    status: 'pending',
  });
  return {
    orderId,
    total,
    href: `/checkout?orderId=${encodeURIComponent(orderId)}&amount=${encodeURIComponent(total)}&currency=${CURRENCY}`,
  };
}
