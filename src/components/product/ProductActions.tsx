'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Loader2, Minus, Plus, ShoppingBag, Zap } from 'lucide-react';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { useCart } from '@/components/providers/CartProvider';
import { prepareCheckout, toCartItem, type CartItem } from '@/lib/cart';
import type { Product } from '@/lib/products';
import { trackViewContent } from '@/lib/tracking';

export function ProductActions({ product }: { product: Product }) {
  const { lang, t } = useLanguage();
  const { add, ready, items } = useCart();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [buying, setBuying] = useState(false);

  useEffect(() => {
    trackViewContent(product.name.en, product.price, product.category, 'EGP', product.code);
  }, [product]);

  function adjust(delta: number) {
    setQuantity((current) => Math.min(99, Math.max(1, current + delta)));
  }

  function handleAdd() {
    add(product, lang, quantity);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  }

  function handleBuyNow() {
    if (!ready) return;
    setBuying(true);
    const incoming = toCartItem(product, lang, quantity);
    const existing = items.find((item) => item.code === product.code);
    const merged: CartItem[] = existing
      ? items.map((item) =>
          item.code === product.code ? { ...item, quantity: item.quantity + quantity } : item,
        )
      : [...items, incoming];
    const { href } = prepareCheckout(merged, lang);
    add(product, lang, quantity);
    router.push(href);
  }

  return (
    <div className="mt-6">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-[0.6875rem] font-extrabold uppercase tracking-[0.14em] text-muted">{t('pdp.qty')}</span>
        <div className="inline-flex items-center overflow-hidden rounded-full border border-ink/10 bg-white/85">
          <button
            type="button"
            onClick={() => adjust(-1)}
            disabled={quantity <= 1}
            className="flex h-10 w-10 items-center justify-center text-ink transition-colors hover:bg-cream disabled:opacity-40"
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-10 text-center text-sm font-extrabold tabular-nums">{quantity}</span>
          <button
            type="button"
            onClick={() => adjust(1)}
            disabled={quantity >= 99}
            className="flex h-10 w-10 items-center justify-center text-ink transition-colors hover:bg-cream disabled:opacity-40"
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <span className="text-xs font-semibold text-olive">{t('pdp.instock')}</span>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={handleAdd}
          disabled={!ready}
          className="btn-primary min-h-12 flex-1 text-sm disabled:opacity-60"
        >
          {added ? <Check className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
          {added ? t('pdp.added') : t('pdp.add')}
        </button>
        <button
          type="button"
          onClick={handleBuyNow}
          disabled={!ready || buying}
          className="btn-dark min-h-12 flex-1 text-sm disabled:opacity-60"
        >
          {buying ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4 text-canary" />}
          {t('pdp.buy')}
        </button>
      </div>

      <p className="mt-3 text-[0.6875rem] leading-relaxed text-muted">
        {product.kind === 'digital' ? t('pdp.activation') : t('pdp.delivery')} · {t('pdp.genuine')}
      </p>
    </div>
  );
}
