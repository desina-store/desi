export function generateOrderId(): string {
  let value: number;
  if (typeof crypto !== "undefined" && "getRandomValues" in crypto) {
    const buffer = new Uint32Array(1);
    crypto.getRandomValues(buffer);
    value = 100000 + (buffer[0] % 900000);
  } else {
    value = Math.floor(100000 + Math.random() * 900000);
  }
  return `DS-HUB-${value}`;
}

export function safeRead<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function safeWrite(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage can be unavailable in private or in-app browser modes.
  }
}

export function safeReadString(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function safeWriteString(key: string, value: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Ignore quota or privacy-mode failures.
  }
}

export const STORAGE_KEYS = {
  cart: "desina_cart",
  lang: "desina_lang",
  orders: "desina_orders",
  legacyOrders: "orders",
  orderRef: "desina_order_ref",
  customer: "desina_customer",
  reviews: "desina_reviews",
} as const;
