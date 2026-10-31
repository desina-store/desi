"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { getProductByCode, type Product } from "@/data/products";
import { generateOrderId, safeRead, safeWrite, STORAGE_KEYS } from "@/lib/storage";
import { useI18n } from "./i18n-provider";

export type CartItem = {
  code: number;
  quantity: number;
  name: string;
  price: number;
  link: string;
};

export type CartLineView = {
  item: CartItem;
  product: Product | undefined;
  name: string;
  price: number;
  lineTotal: number;
  href: string;
  image: string;
};

type ToastState = { code: number; nonce: number } | null;

type CartContextValue = {
  items: CartItem[];
  lines: CartLineView[];
  count: number;
  subtotal: number;
  hydrated: boolean;
  orderId: string;
  isDrawerOpen: boolean;
  toast: ToastState;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (code: number) => void;
  setQuantity: (code: number, quantity: number) => void;
  clearCart: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  dismissToast: () => void;
  ensureOrderId: () => string;
  resetOrderRef: () => string;
};

const CartContext = createContext<CartContextValue | null>(null);

const MAX_QUANTITY = 20;

function normalizeStoredCart(raw: unknown): CartItem[] {
  if (!Array.isArray(raw)) return [];
  const merged = new Map<number, CartItem>();

  for (const entry of raw) {
    if (!entry || typeof entry !== "object") continue;
    const record = entry as Record<string, unknown>;
    const product = getProductByCode(Number(record.code));
    if (!product) continue;
    const quantity = Math.max(
      1,
      Math.min(MAX_QUANTITY, Number(record.quantity) || 1),
    );
    const existing = merged.get(product.code);
    if (existing) {
      existing.quantity = Math.max(
        1,
        Math.min(MAX_QUANTITY, existing.quantity + quantity),
      );
    } else {
      merged.set(product.code, {
        code: product.code,
        quantity,
        name: typeof record.name === "string" ? record.name : product.name.en,
        price: Number(record.price) || product.price,
        link: typeof record.link === "string" ? record.link : `/product/${product.code}`,
      });
    }
  }

  return [...merged.values()];
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { lang } = useI18n();
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setItems(normalizeStoredCart(safeRead<unknown>(STORAGE_KEYS.cart, [])));

    const storedRef =
      typeof window !== "undefined"
        ? window.localStorage.getItem(STORAGE_KEYS.orderRef)
        : null;
    if (storedRef && /^DS-HUB-\d{6}$/.test(storedRef)) {
      setOrderId(storedRef);
    } else {
      const generated = generateOrderId();
      setOrderId(generated);
      try {
        window.localStorage.setItem(STORAGE_KEYS.orderRef, generated);
      } catch {
        // Ignore storage failures.
      }
    }

    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    safeWrite(STORAGE_KEYS.cart, items);
  }, [items, hydrated]);

  // Keep the drawer, badge and cart page in step when another tab changes the cart.
  useEffect(() => {
    if (!hydrated) return;
    const onStorage = (event: StorageEvent) => {
      if (event.key !== null && event.key !== STORAGE_KEYS.cart) return;
      setItems(normalizeStoredCart(safeRead<unknown>(STORAGE_KEYS.cart, [])));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [hydrated]);

  useEffect(() => {
    if (!isDrawerOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [isDrawerOpen]);

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  const showToast = useCallback((code: number) => {
    setToast({ code, nonce: Date.now() });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3600);
  }, []);

  const addItem = useCallback(
    (product: Product, quantity = 1) => {
      const safeQuantity = Math.max(1, Math.min(MAX_QUANTITY, Math.round(quantity)));
      setItems((current) => {
        const existing = current.find((item) => item.code === product.code);
        if (existing) {
          return current.map((item) =>
            item.code === product.code
              ? {
                  ...item,
                  quantity: Math.min(MAX_QUANTITY, item.quantity + safeQuantity),
                  price: product.price,
                  name: product.name[lang],
                }
              : item,
          );
        }
        return [
          ...current,
          {
            code: product.code,
            quantity: safeQuantity,
            name: product.name[lang],
            price: product.price,
            link: `/product/${product.code}`,
          },
        ];
      });
      showToast(product.code);
    },
    [lang, showToast],
  );

  const removeItem = useCallback((code: number) => {
    setItems((current) => current.filter((item) => item.code !== code));
  }, []);

  const setQuantity = useCallback((code: number, quantity: number) => {
    const safeQuantity = Math.max(0, Math.min(MAX_QUANTITY, Math.round(quantity)));
    setItems((current) =>
      safeQuantity === 0
        ? current.filter((item) => item.code !== code)
        : current.map((item) =>
            item.code === code ? { ...item, quantity: safeQuantity } : item,
          ),
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    safeWrite(STORAGE_KEYS.cart, []);
  }, []);

  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);
  const dismissToast = useCallback(() => setToast(null), []);

  const ensureOrderId = useCallback(() => {
    if (orderId) return orderId;
    const generated = generateOrderId();
    setOrderId(generated);
    try {
      window.localStorage.setItem(STORAGE_KEYS.orderRef, generated);
    } catch {
      // Ignore storage failures.
    }
    return generated;
  }, [orderId]);

  const resetOrderRef = useCallback(() => {
    const generated = generateOrderId();
    setOrderId(generated);
    try {
      window.localStorage.setItem(STORAGE_KEYS.orderRef, generated);
    } catch {
      // Ignore storage failures.
    }
    return generated;
  }, []);

  const lines = useMemo<CartLineView[]>(
    () =>
      items.map((item) => {
        const product = getProductByCode(item.code);
        const price = product?.price ?? item.price;
        return {
          item,
          product,
          name: product ? product.name[lang] : item.name,
          price,
          lineTotal: price * item.quantity,
          href: `/product/${item.code}`,
          image: product?.img ?? "/products/p13.webp",
        };
      }),
    [items, lang],
  );

  const subtotal = useMemo(
    () => lines.reduce((sum, line) => sum + line.lineTotal, 0),
    [lines],
  );
  const count = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      lines,
      count,
      subtotal,
      hydrated,
      orderId,
      isDrawerOpen,
      toast,
      addItem,
      removeItem,
      setQuantity,
      clearCart,
      openDrawer,
      closeDrawer,
      dismissToast,
      ensureOrderId,
      resetOrderRef,
    }),
    [
      items,
      lines,
      count,
      subtotal,
      hydrated,
      orderId,
      isDrawerOpen,
      toast,
      addItem,
      removeItem,
      setQuantity,
      clearCart,
      openDrawer,
      closeDrawer,
      dismissToast,
      ensureOrderId,
      resetOrderRef,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
