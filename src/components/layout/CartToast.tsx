'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Check, X } from 'lucide-react';
import { useCart } from '@/components/providers/CartProvider';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { getProduct } from '@/lib/products';

export function CartToast() {
  const { notice, dismissNotice } = useCart();
  const { t, lang } = useLanguage();

  if (!notice) return null;
  const product = getProduct(notice.code);

  return (
    <div
      role="status"
      aria-live="polite"
      className="ds-rise fixed inset-x-4 bottom-[calc(var(--mob-h)+env(safe-area-inset-bottom,0px)+0.75rem)] z-[60] md:inset-x-auto md:bottom-6 md:end-6 md:w-[360px]"
    >
      <div className="flex items-center gap-3 rounded-2xl border border-black/5 bg-white p-3 shadow-[0_18px_50px_rgba(17,17,17,0.18)]">
        {product ? (
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-black/5">
            <Image src={product.image} alt={product.name[lang]} fill sizes="56px" className="object-cover" />
          </div>
        ) : (
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-canary">
            <Check className="h-6 w-6" />
          </span>
        )}
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-olive">
            <Check className="h-3 w-3" strokeWidth={3} /> {t('pdp.added')}
          </p>
          <p className="mt-0.5 truncate text-sm font-bold text-ink">{notice.name}</p>
          <Link
            href="/cart"
            onClick={dismissNotice}
            className="mt-1 inline-block text-[11px] font-bold text-olive underline underline-offset-2"
          >
            {t('nav.cart')} ({notice.quantity})
          </Link>
        </div>
        <button
          type="button"
          onClick={dismissNotice}
          aria-label={t('common.close')}
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-black/5"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
