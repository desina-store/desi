"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Check, Copy, Lock, Minus, Plus, ShoppingBag, Trash2, Truck, X } from "lucide-react";
import { getProductByCode } from "@/data/products";
import { copyText } from "@/lib/clipboard";
import { useI18n } from "@/components/providers/i18n-provider";
import { useCart } from "@/components/providers/cart-provider";

function specsFor(
  product: ReturnType<typeof getProductByCode>,
  lang: "en" | "ar",
): string[] {
  if (!product) return [];
  return Object.entries(product.info)
    .filter(([key]) => key !== "brand")
    .slice(0, 2)
    .map(([, entry]) => entry[lang])
    .filter(Boolean);
}

export function CartDrawer() {
  const { lang, t, price } = useI18n();
  const {
    lines,
    count,
    subtotal,
    items,
    isDrawerOpen,
    closeDrawer,
    setQuantity,
    removeItem,
    clearCart,
    orderId,
    ensureOrderId,
  } = useCart();
  const closeRef = useRef<HTMLButtonElement>(null);
  const [copied, setCopied] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    closeDrawer();
  }, [pathname, closeDrawer]);

  useEffect(() => {
    if (!isDrawerOpen) return;
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeDrawer();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previous?.focus?.();
    };
  }, [isDrawerOpen, closeDrawer]);

  useEffect(() => {
    if (isDrawerOpen && !orderId) ensureOrderId();
  }, [isDrawerOpen, orderId, ensureOrderId]);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const copyReference = async () => {
    if (!orderId) return;
    const ok = await copyText(orderId);
    if (ok) setCopied(true);
  };

  return (
    <>
      <div
        className={`drawer-backdrop ${isDrawerOpen ? "is-open" : ""}`}
        onClick={closeDrawer}
        aria-hidden="true"
      />
      <aside
        className={`cart-drawer ${isDrawerOpen ? "is-open" : ""}`}
        aria-hidden={!isDrawerOpen}
        aria-label={t("cart.title")}
        inert={!isDrawerOpen ? true : undefined}
      >
        <div className="cart-panel" role="dialog" aria-modal="true" aria-label={t("cart.title")}>
          <div className="cart-panel__head">
            <p className="cart-panel__title">
              {t("cart.title")} <span>{count}</span>
            </p>
            <button
              ref={closeRef}
              type="button"
              className="drawer-close"
              onClick={closeDrawer}
              aria-label={t("common.close")}
            >
              <X aria-hidden="true" />
            </button>
          </div>

          {items.length === 0 ? (
            <div className="cart-panel__empty">
              <span className="empty-state__icon">
                <ShoppingBag aria-hidden="true" />
              </span>
              <h2>{t("cart.empty")}</h2>
              <p>{t("cart.emptyHint")}</p>
              <Link href="/shop" className="btn btn-primary" onClick={closeDrawer}>
                {t("cart.emptyCta")}
              </Link>
            </div>
          ) : (
            <>
              <div className="cart-ship">
                <Truck aria-hidden="true" />
                {t("cart.freeShipping")}
              </div>

              <div className="cart-panel__scroll">
                <div className="cart-panel__lines">
                  {lines.map((line) => (
                    <article key={line.item.code} className="cart-line">
                      <Link
                        href={line.href}
                        className="cart-line__media"
                        onClick={closeDrawer}
                        aria-label={line.name}
                      >
                        <Image
                          src={line.image}
                          alt={line.name}
                          fill
                          sizes="82px"
                          quality={90}
                        />
                      </Link>
                      <div className="cart-line__body">
                        <div className="cart-line__top">
                          <Link href={line.href} className="cart-line__name" onClick={closeDrawer}>
                            {line.name}
                          </Link>
                          <button
                            type="button"
                            className="cart-line__remove"
                            aria-label={`${t("cart.remove")} — ${line.name}`}
                            onClick={() => removeItem(line.item.code)}
                          >
                            <X aria-hidden="true" />
                          </button>
                        </div>
                        <div className="cart-line__meta">
                          <span>CODE-{line.item.code}</span>
                          {line.product?.info.brand ? (
                            <span>{line.product.info.brand[lang]}</span>
                          ) : null}
                          {specsFor(line.product, lang).map((spec) => (
                            <span key={spec}>{spec}</span>
                          ))}
                        </div>
                        <div className="cart-line__foot">
                          <div className="qty-control qty-control--sm">
                            <button
                              type="button"
                              onClick={() => setQuantity(line.item.code, line.item.quantity - 1)}
                              aria-label={`${t("common.quantity")} − ${line.name}`}
                            >
                              <Minus aria-hidden="true" />
                            </button>
                            <span aria-live="polite">{line.item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => setQuantity(line.item.code, line.item.quantity + 1)}
                              aria-label={`${t("common.quantity")} + ${line.name}`}
                              disabled={line.item.quantity >= 20}
                            >
                              <Plus aria-hidden="true" />
                            </button>
                          </div>
                          <span className="cart-line__price">
                            {price(line.lineTotal)}
                            <small>
                              {price(line.price)} × {line.item.quantity}
                            </small>
                          </span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                {orderId ? (
                  <div className="cart-ref">
                    <span className="cart-ref__label">{t("cart.orderId")}</span>
                    <span className="cart-ref__value" dir="ltr">
                      {orderId}
                    </span>
                    <button
                      type="button"
                      className="cart-ref__copy"
                      onClick={copyReference}
                      aria-label={copied ? t("common.copied") : t("common.copy")}
                    >
                      {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
                      {copied ? t("common.copied") : t("common.copy")}
                    </button>
                  </div>
                ) : null}
              </div>

              <div className="cart-panel__foot">
                <div className="summary-row">
                  <span>
                    {t("cart.subtotal")} · {count} {count === 1 ? t("common.item") : t("common.items")}
                  </span>
                  <strong>{price(subtotal)}</strong>
                </div>
                <div className="summary-row">
                  <span>{t("cart.shipping")}</span>
                  <strong>{t("cart.shippingFree")}</strong>
                </div>
                <div className="summary-row summary-row--total">
                  <span>
                    {t("cart.total")}
                    <small>{t("cart.secureNote")}</small>
                  </span>
                  <strong>{price(subtotal)}</strong>
                </div>
                <div className="cart-panel__actions">
                  <Link href="/checkout" className="btn btn-primary" onClick={closeDrawer}>
                    {t("cart.checkout")}
                    <Lock aria-hidden="true" />
                  </Link>
                  <Link href="/cart" className="btn btn-outline" onClick={closeDrawer}>
                    {t("cart.viewCart")}
                  </Link>
                  <button type="button" className="cart-panel__continue" onClick={clearCart}>
                    <Trash2
                      aria-hidden="true"
                      style={{ width: 12, height: 12, display: "inline", marginInlineEnd: 5 }}
                    />
                    {t("cart.clear")}
                  </button>
                </div>
                <p className="cart-panel__note">
                  <Lock aria-hidden="true" />
                  {t("cart.secureNote")}
                </p>
              </div>
            </>
          )}
        </div>
      </aside>
    </>
  );
}

export function CartToast() {
  const { lang, t, price } = useI18n();
  const { toast, dismissToast, openDrawer } = useCart();
  const product = toast ? getProductByCode(toast.code) : undefined;

  if (!toast || !product) return null;

  return (
    <div className="toast" role="status" aria-live="polite" key={toast.nonce}>
      <span className="toast__media">
        <Image src={product.img} alt="" fill sizes="48px" quality={85} />
      </span>
      <div className="toast__copy">
        <span>{t("product.added")}</span>
        <strong>{product.name[lang]}</strong>
        <button
          type="button"
          onClick={() => {
            dismissToast();
            openDrawer();
          }}
          style={{
            background: "none",
            border: 0,
            padding: 0,
            cursor: "pointer",
            textAlign: "inherit",
            font: "inherit",
            color: "var(--ink-soft)",
            textDecoration: "underline",
          }}
        >
          {t("product.viewCart")} · {price(product.price)}
        </button>
      </div>
      <button
        type="button"
        className="toast__close"
        onClick={dismissToast}
        aria-label={t("common.close")}
      >
        <X aria-hidden="true" />
      </button>
    </div>
  );
}
