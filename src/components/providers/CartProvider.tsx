'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { Product } from '@/lib/products';
import type { Lang } from '@/lib/site';
import {
  CART_KEY,
  cartCount,
  cartTotal,
  readCartStorage,
  toCartItem,
  writeCartStorage,
  type CartItem,
} from '@/lib/cart';
import { trackAddToCart } from '@/lib/tracking';

type CartNotice = {
  key: number;
  name: string;
  quantity: number;
  code: number;
};

type CartContextValue = {
  items: CartItem[];
  ready: boolean;
  count: number;
  subtotal: number;
  notice: CartNotice | null;
  add: (product: Product, lang: Lang, quantity?: number) => void;
  setQuantity: (code: number, quantity: number) => void;
  remove: (code: number) => void;
  clear: () => void;
  dismissNotice: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);
  const [notice, setNotice] = useState<CartNotice | null>(null);
  const noticeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setItems(readCartStorage());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    writeCartStorage(items);
  }, [items, ready]);

  useEffect(() => {
    function onStorage(event: StorageEvent) {
      if (event.key === CART_KEY) setItems(readCartStorage());
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => {
    return () => {
      if (noticeTimer.current) clearTimeout(noticeTimer.current);
    };
  }, []);

  const showNotice = useCallback((noticeValue: CartNotice) => {
    setNotice(noticeValue);
    if (noticeTimer.current) clearTimeout(noticeTimer.current);
    noticeTimer.current = setTimeout(() => setNotice(null), 2600);
  }, []);

  const add = useCallback(
    (product: Product, lang: Lang, quantity = 1) => {
      const delta = Math.max(1, Math.floor(quantity));
      setItems((current) => {
        const existing = current.find((item) => item.code === product.code);
        if (existing) {
          return current.map((item) =>
            item.code === product.code ? { ...item, quantity: item.quantity + delta } : item,
          );
        }
        return [...current, toCartItem(product, lang, delta)];
      });
      showNotice({ key: Date.now(), name: product.name[lang], quantity: delta, code: product.code });
      trackAddToCart(product.name.en, product.price, product.category, delta, 'EGP', product.code);
    },
    [showNotice],
  );

  const setQuantity = useCallback((code: number, quantity: number) => {
    const safeQuantity = Math.max(1, Math.min(99, Math.floor(quantity)));
    setItems((current) => current.map((item) => (item.code === code ? { ...item, quantity: safeQuantity } : item)));
  }, []);

  const remove = useCallback((code: number) => {
    setItems((current) => current.filter((item) => item.code !== code));
  }, []);

  const clear = useCallback(() => setItems([]), []);
  const dismissNotice = useCallback(() => setNotice(null), []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      ready,
      count: cartCount(items),
      subtotal: cartTotal(items),
      notice,
      add,
      setQuantity,
      remove,
      clear,
      dismissNotice,
    }),
    [items, ready, notice, add, setQuantity, remove, clear, dismissNotice],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used inside CartProvider');
  return context;
}
