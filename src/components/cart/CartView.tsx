'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Minus, Plus, ShieldCheck, ShoppingBag, Trash2, Truck } from 'lucide-react';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { useCart } from '@/components/providers/CartProvider';
import { formatMoney, formatPrice } from '@/lib/format';
import { prepareCheckout } from '@/lib/cart';
import { getProduct, productHref, productSpecs } from '@/lib/products';
import { beginCheckout } from '@/lib/tracking';
import { WHATSAPP } from '@/lib/site';

export function CartView() {
  const { lang, t } = useLanguage();
  const { items, ready, subtotal, count, setQuantity, remove, clear } = useCart();
  const router = useRouter();

  function checkout() {
    if (!items.length) return;
    const { orderId, href } = prepareCheckout(items, lang);
    beginCheckout(subtotal, 'EGP', orderId);
    router.push(href);
  }

  if (!ready) {
    return (
      <div className="surface-card space-y-3 p-6">
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="h-24 animate-pulse rounded-2xl bg-ink/[0.04]" />
        ))}
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="surface-card flex flex-col items-center justify-center px-6 py-16 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-canary/50 text-olive-dark">
          <ShoppingBag className="h-7 w-7" />
        </span>
        <h2 className="mt-5 text-xl font-extrabold text-ink">{t('cart.empty')}</h2>
        <p className="mt-1 text-sm text-muted">{t('cart.emptySub')}</p>
        <Link href="/" className="btn-primary mt-6">
          {t('cart.start')}
          <ArrowRight className="h-4 w-4 rtl-flip" />
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.55fr_1fr] lg:items-start">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 px-1">
          <p className="text-xs font-bold text-muted">
            {count} {count === 1 ? t('cart.itemsOne') : t('cart.itemsMany')}
          </p>
          <button
            type="button"
            onClick={clear}
            className="inline-flex items-center gap-1.5 text-[0.6875rem] font-extrabold text-brand-red/90 transition-colors hover:text-brand-red"
          >
            <Trash2 className="h-3.5 w-3.5" />
            {t('cart.clear')}
          </button>
        </div>

        {items.map((item) => {
          const product = getProduct(item.code);
          const specs = product ? productSpecs(product, lang) : [];
          const name = product ? product.name[lang] : item.name;
          const lineTotal = item.price * item.quantity;

          return (
            <article
              key={item.code}
              className="surface-card flex gap-3 p-3 sm:gap-4 sm:p-4"
            >
              {product ? (
                <Link
                  href={productHref(product)}
                  className="product-media relative h-24 w-24 shrink-0 rounded-2xl sm:h-28 sm:w-28"
                >
                  <Image
                    src={product.image}
                    alt={name}
                    fill
                    sizes="112px"
                    className="object-cover"
                  />
                </Link>
              ) : (
                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-ink/5 sm:h-28 sm:w-28">
                  <ShoppingBag className="h-7 w-7 text-muted" />
                </div>
              )}

              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[0.5625rem] font-extrabold uppercase tracking-[0.14em] text-olive">
                      {t('pdp.code')} {item.code}
                    </p>
                    {product ? (
                      <Link href={productHref(product)}>
                        <h3 className="mt-0.5 line-clamp-2 text-sm font-extrabold leading-snug text-ink sm:text-base">
                          {name}
                        </h3>
                      </Link>
                    ) : (
                      <h3 className="mt-0.5 line-clamp-2 text-sm font-extrabold leading-snug text-ink">{name}</h3>
                    )}
                    {specs.length ? (
                      <ul className="mt-1.5 space-y-0.5">
                        {specs.map((spec) => (
                          <li key={spec.labelKey} className="line-clamp-1 text-[0.6875rem] text-muted">
                            <span className="font-bold text-ink/65">{t(spec.labelKey)}:</span> {spec.value}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(item.code)}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-brand-red/10 hover:text-brand-red"
                    aria-label={`${t('cart.remove')} ${name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-auto flex flex-wrap items-end justify-between gap-2 pt-3">
                  <div className="inline-flex items-center overflow-hidden rounded-full border border-ink/10 bg-white">
                    <button
                      type="button"
                      onClick={() => setQuantity(item.code, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="flex h-8 w-8 items-center justify-center text-ink transition-colors hover:bg-cream disabled:opacity-40"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-extrabold tabular-nums">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(item.code, item.quantity + 1)}
                      disabled={item.quantity >= 99}
                      className="flex h-8 w-8 items-center justify-center text-ink transition-colors hover:bg-cream disabled:opacity-40"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="text-end">
                    <p className="text-sm font-extrabold text-ink">{formatPrice(lineTotal, lang)}</p>
                    <p className="text-[0.625rem] font-semibold text-muted">
                      {formatPrice(item.price, lang)} {t('cart.unit')}
                    </p>
                  </div>
                </div>
              </div>
            </article>
          );
        })}

        <div className="flex flex-wrap items-center justify-between gap-3 px-1 pt-2">
          <Link href="/" className="btn-ghost text-xs">
            <ArrowLeft className="h-4 w-4 rtl-flip" />
            {t('cart.continue')}
          </Link>
          <span className="inline-flex items-center gap-1.5 text-[0.6875rem] font-bold text-muted">
            <ShieldCheck className="h-4 w-4 text-olive" />
            {t('co.secure')}
          </span>
        </div>
      </div>

      <aside className="surface-card sticky top-24 p-5 md:p-6">
        <h2 className="text-lg font-extrabold text-ink">{t('cart.summary')}</h2>

        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex items-center justify-between gap-2">
            <dt className="text-muted">{t('cart.subtotal')}</dt>
            <dd className="font-extrabold text-ink">
              {formatMoney(subtotal, lang)} <span className="text-[0.625rem] font-bold text-muted">{t('common.currency')}</span>
            </dd>
          </div>
          <div className="flex items-start justify-between gap-2">
            <dt className="text-muted">{t('cart.shipping')}</dt>
            <dd className="max-w-[16rem] text-end text-[0.6875rem] font-semibold text-muted">{t('cart.shippingNote')}</dd>
          </div>
          <div className="ds-divider" />
          <div className="flex items-center justify-between gap-2">
            <dt className="text-base font-extrabold text-ink">{t('cart.total')}</dt>
            <dd className="text-xl font-extrabold text-ink">
              {formatMoney(subtotal, lang)} <span className="text-[0.6875rem] font-bold text-muted">{t('common.currency')}</span>
            </dd>
          </div>
        </dl>

        <button type="button" onClick={checkout} className="btn-primary mt-5 w-full">
          {t('cart.checkout')}
          <ArrowRight className="h-4 w-4 rtl-flip" />
        </button>

        <div className="mt-4 rounded-2xl bg-cream/70 p-3.5">
          <p className="flex items-center gap-2 text-[0.6875rem] font-extrabold text-ink">
            <Truck className="h-4 w-4 text-olive" />
            {t('cart.supportTitle')}
          </p>
          <a
            href={`https://wa.me/${WHATSAPP}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex text-[0.6875rem] font-bold text-olive underline decoration-canary-deep decoration-2 underline-offset-4"
          >
            {t('support.whatsapp')}
          </a>
        </div>
      </aside>
    </div>
  );
}
