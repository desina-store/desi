import { getProductByCode, productHref } from "@/data/products";
import { safeRead, safeReadString, safeWrite, STORAGE_KEYS } from "./storage";

export type CartLine = {
  code: number;
  name: string;
  price: number;
  quantity: number;
  link: string;
};

export type OrderStatus = "awaiting_payment" | "processing" | "shipped" | "delivered";

export type StoredCustomer = {
  name: string;
  phone: string;
  email?: string;
  country?: string;
  city?: string;
  zip?: string;
  address?: string;
};

export type StoredOrder = {
  id: string;
  date: string;
  items: CartLine[];
  total: number;
  currency: "EGP";
  status: OrderStatus;
  paymentMethod?: string;
  customer?: StoredCustomer;
  audit?: "saved" | "offline";
};

type LegacyOrder = Partial<StoredOrder> & {
  id?: string;
  orderId?: string;
  items?: CartLine[];
};

const STATUSES: OrderStatus[] = ["awaiting_payment", "processing", "shipped", "delivered"];

function normalizeOrder(order: LegacyOrder): StoredOrder | null {
  const id = order.id || order.orderId;
  if (!id) return null;

  const items = Array.isArray(order.items)
    ? order.items
        .filter((item) => Number.isFinite(Number(item?.code)) && Number(item?.quantity) > 0)
        .map((item) => ({
          code: Number(item.code),
          name: String(item.name ?? ""),
          price: Number(item.price) || 0,
          quantity: Number(item.quantity),
          link: String(item.link ?? ""),
        }))
    : [];

  return {
    id,
    date: order.date || new Date().toISOString(),
    items,
    total: Number(order.total) || 0,
    currency: "EGP",
    status: STATUSES.includes(order.status as OrderStatus)
      ? (order.status as OrderStatus)
      : "awaiting_payment",
    paymentMethod: order.paymentMethod,
    customer: order.customer,
    audit: order.audit,
  };
}

// The pre-namespacing builds stored orders under the bare "orders" key, which any other
// app on this origin could read or overwrite. Keep reading it until it has been migrated.
function readStoredList(): { raw: unknown; migrated: boolean } {
  const current = safeReadString(STORAGE_KEYS.orders);
  if (current !== null) return { raw: safeRead<LegacyOrder[]>(STORAGE_KEYS.orders, []), migrated: false };
  const legacy = safeReadString(STORAGE_KEYS.legacyOrders);
  if (legacy === null) return { raw: [], migrated: false };
  try {
    return { raw: JSON.parse(legacy) as LegacyOrder[], migrated: true };
  } catch {
    return { raw: [], migrated: true };
  }
}

function persistOrders(orders: StoredOrder[]): void {
  safeWrite(STORAGE_KEYS.orders, orders);
  if (safeReadString(STORAGE_KEYS.legacyOrders) !== null) {
    try {
      window.localStorage.removeItem(STORAGE_KEYS.legacyOrders);
    } catch {
      // Storage can be unavailable in private or in-app browser modes.
    }
  }
}

export function readOrders(): StoredOrder[] {
  const { raw, migrated } = readStoredList();
  const orders = Array.isArray(raw)
    ? raw
        .map(normalizeOrder)
        .filter((order): order is StoredOrder => Boolean(order))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    : [];
  if (migrated) persistOrders(orders);
  return orders;
}

export function saveOrder(order: StoredOrder): void {
  const existing = readOrders().filter((item) => item.id !== order.id);
  persistOrders([order, ...existing].slice(0, 50));
}

export function findOrder(orderId: string): StoredOrder | undefined {
  const needle = orderId.trim().toUpperCase();
  return readOrders().find((order) => order.id.toUpperCase() === needle);
}

export function updateOrderStatus(orderId: string, status: OrderStatus): void {
  const orders = readOrders();
  const next = orders.map((order) => (order.id === orderId ? { ...order, status } : order));
  persistOrders(next);
}

type RemoteOrderLine = { code?: number; quantity?: number };

type RemoteOrder = {
  id?: string;
  status?: string;
  date?: string;
  total?: number;
  currency?: string;
  paymentMethod?: string;
  items?: RemoteOrderLine[];
};

export type OrderLookup =
  | { kind: "found"; order: StoredOrder }
  | { kind: "not_found" }
  | { kind: "unverified" }
  | { kind: "rate_limited" }
  | { kind: "unavailable" };

function toStoredOrder(remote: RemoteOrder): StoredOrder | null {
  const id = typeof remote.id === "string" ? remote.id.trim() : "";
  if (!id) return null;

  const items: CartLine[] = Array.isArray(remote.items)
    ? remote.items
        .map((item) => {
          const code = Number(item?.code);
          if (!Number.isFinite(code) || code <= 0) return null;
          // الأسعار تُقرأ من كتالوج المتجر، لا من الاستجابة القادمة إلى المتصفح.
          const product = getProductByCode(code);
          const quantity = Math.min(Math.max(Math.round(Number(item?.quantity)) || 1, 1), 99);
          return {
            code,
            name: product?.name?.en || `CODE-${code}`,
            price: product?.price ?? 0,
            quantity,
            link: product ? productHref(product) : "",
          } satisfies CartLine;
        })
        .filter((item): item is CartLine => Boolean(item))
    : [];

  return {
    id,
    date: remote.date || new Date().toISOString(),
    items,
    total: Number(remote.total) || 0,
    currency: "EGP",
    status: STATUSES.includes(remote.status as OrderStatus)
      ? (remote.status as OrderStatus)
      : "awaiting_payment",
    paymentMethod: remote.paymentMethod,
    audit: "saved",
  };
}

/**
 * Server-side order lookup. The API verifies the reference against the contact details
 * already stored on this device, so a guessed order number alone returns nothing.
 */
export async function lookupRemoteOrder(orderId: string): Promise<OrderLookup> {
  const customer = safeRead<StoredCustomer>(STORAGE_KEYS.customer, { name: "", phone: "" });
  const contact = (customer.email || "").trim() || (customer.phone || "").trim();
  if (!contact) return { kind: "unverified" };

  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order_id: orderId, contact }),
      cache: "no-store",
      signal: controller.signal,
    });

    if (response.status === 404) return { kind: "not_found" };
    if (response.status === 429) return { kind: "rate_limited" };
    if (!response.ok) return { kind: "unavailable" };

    const payload = (await response.json().catch(() => null)) as
      | { ok?: boolean; order?: RemoteOrder }
      | null;
    if (!payload?.ok || !payload.order) return { kind: "not_found" };

    const order = toStoredOrder(payload.order);
    return order ? { kind: "found", order } : { kind: "not_found" };
  } catch {
    return { kind: "unavailable" };
  } finally {
    window.clearTimeout(timer);
  }
}
