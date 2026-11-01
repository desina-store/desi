'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { ArrowRight, Lock, Minus, Plus, ShoppingBag, Trash2, Truck, X } from 'lucide-react';
import { useCart } from '@/components/providers/CartProvider';
import { useCartDrawer } from '@/components/providers/CartDrawerProvider';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { prepareCheckout } from '@/lib/cart';
import { formatPrice } from '@/lib/format';
import { getProduct } from '@/lib/products';
import { beginCheckout } from '@/lib/tracking';
import { DRAWER_COPY, pick } from '@/lib/brand-copy';

export function CartDrawer() {
  const { lang, t } = useLanguage();
  const { items, ready, count, subtotal, setQuantity, remove, clear } = useCart();
  const { isOpen, closeDrawer } = useCartDrawer();
  const closeRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    closeDrawer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) return;
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeDrawer();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      previous?.focus?.();
    };
  }, [isOpen, closeDrawer]);

  function checkout() {
    if (!items.length) return;
    const { orderId, href } = prepareCheckout(items, lang);
    beginCheckout(subtotal, 'EGP', orderId);
    closeDrawer();
    router.push(href);
  }

  return (
    <>
      <div
        className={`drawer-backdrop${isOpen ? ' is-open' : ''}`}
        onClick={closeDrawer}
        aria-hidden="true"
      />
      <aside
        className={`cart-drawer${isOpen ? ' is-open' : ''}`}
        aria-hidden={!isOpen}
        aria-label={t('cart.title')}
        inert={!isOpen}
      >
        <div className="cart-panel" role="dialog" aria-modal="true" aria-label={t('cart.title')}>
          <div className="cart-panel__head">
            <p className="cart-panel__title">
              {t('cart.title')} <span>{count}</span>
            </p>
            <button
              ref={closeRef}
              type="button"
              className="drawer-close"
              onClick={closeDrawer}
              aria-label={t('common.close')}
            >
              <X aria-hidden="true" />
            </button>
          </div>

          {!ready || items.length === 0 ? (
            <div className="cart-panel__empty">
              <span className="empty-state__icon">
                <ShoppingBag aria-hidden="true" />
              </span>
              <h2>{t('cart.empty')}</h2>
              <p>{pick(lang, DRAWER_COPY.emptyHint.en, DRAWER_COPY.emptyHint.ar)}</p>
              <Link href="/#sections" className="btn btn-primary" onClick={closeDrawer}>
                {t('cart.start')}
              </Link>
            </div>
          ) : (
            <>
              <div className="cart-ship">
                <Truck aria-hidden="true" />
                {pick(lang, DRAWER_COPY.freeShipping.en, DRAWER_COPY.freeShipping.ar)}
              </div>

              <div className="cart-panel__scroll">
                <div className="cart-panel__lines">
                  {items.map((item) => {
                    const product = getProduct(item.code);
                    const name = product ? product.name[lang] : item.name;
                    const lineTotal = item.price * item.quantity;
                    const brand = product?.info.brand?.[lang];
                    return (
                      <article key={item.code} className="cart-line">
                        <Link
                          href={`/product/${item.code}`}
                          className="cart-line__media"
                          onClick={closeDrawer}
                          aria-label={name}
                        >
                          {product ? (
                            <Image src={product.image} alt={name} fill sizes="82px" quality={90} />
                          ) : null}
                        </Link>
                        <div className="cart-line__body">
                          <div className="cart-line__top">
                            <Link href={`/product/${item.code}`} className="cart-line__name" onClick={closeDrawer}>
                              {name}
                            </Link>
                            <button
                              type="button"
                              className="cart-line__remove"
                              aria-label={`${t('cart.remove')} — ${name}`}
                              onClick={() => remove(item.code)}
                            >
                              <X aria-hidden="true" />
                            </button>
                          </div>
                          <div className="cart-line__meta">
                            <span>CODE-{item.code}</span>
                            {brand ? <span>{brand}</span> : null}
                          </div>
                          <div className="cart-line__foot">
                            <div className="qty-control qty-control--sm">
                              <button
                                type="button"
                                onClick={() => setQuantity(item.code, item.quantity - 1)}
                                aria-label={`${name} −`}
                              >
                                <Minus aria-hidden="true" />
                              </button>
                              <span aria-live="polite">{item.quantity}</span>
                              <button
                                type="button"
                                onClick={() => setQuantity(item.code, item.quantity + 1)}
                                disabled={item.quantity >= 20}
                                aria-label={`${name} +`}
                              >
                                <Plus aria-hidden="true" />
                              </button>
                            </div>
                            <span className="cart-line__price">
                              {formatPrice(lineTotal, lang)}
                              <small>
                                {formatPrice(item.price, lang)} × {item.quantity}
                              </small>
                            </span>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>

              <div className="cart-panel__foot">
                <div className="summary-row">
                  <span>
                    {t('cart.subtotal')} · {count}{' '}
                    {count === 1 ? t('cart.itemsOne') : t('cart.itemsMany')}
                  </span>
                  <strong>{formatPrice(subtotal, lang)}</strong>
                </div>
                <div className="summary-row">
                  <span>{t('cart.shipping')}</span>
                  <strong>{pick(lang, 'On request', 'عند الطلب')}</strong>
                </div>
                <div className="summary-row summary-row--total">
                  <span>
                    {t('cart.total')}
                    <small>{pick(lang, DRAWER_COPY.secureNote.en, DRAWER_COPY.secureNote.ar)}</small>
                  </span>
                  <strong>{formatPrice(subtotal, lang)}</strong>
                </div>
                <div className="cart-panel__actions">
                  <button type="button" className="btn btn-primary" onClick={checkout}>
                    {t('cart.checkout')}
                    <Lock aria-hidden="true" />
                  </button>
                  <Link href="/cart" className="btn btn-outline" onClick={closeDrawer}>
                    {pick(lang, DRAWER_COPY.viewCart.en, DRAWER_COPY.viewCart.ar)}
                    <ArrowRight aria-hidden="true" />
                  </Link>
                  <button type="button" className="cart-panel__continue" onClick={clear}>
                    <Trash2 aria-hidden="true" />
                    {t('cart.clear')}
                  </button>
                </div>
                <p className="cart-panel__note">
                  <Lock aria-hidden="true" />
                  {t('cart.shippingNote')}
                </p>
              </div>
            </>
          )}
        </div>
      </aside>
    </>
  );
}
