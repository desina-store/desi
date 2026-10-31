"use client";

import { useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Copy,
  Lock,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  Truck,
} from "lucide-react";
import { copyText } from "@/lib/clipboard";
import type { Product } from "@/data/products";
import { Breadcrumbs } from "@/components/page-hero";
import { useI18n } from "@/components/providers/i18n-provider";
import { useCart } from "@/components/providers/cart-provider";

function specsFor(product: Product | undefined, lang: "en" | "ar"): string[] {
  if (!product) return [];
  return Object.entries(product.info)
    .filter(([key]) => key !== "brand")
    .slice(0, 2)
    .map(([, entry]) => entry[lang])
    .filter(Boolean);
}

export function CartPageClient() {
  const { lang, t, price } = useI18n();
  const {
    hydrated,
    items,
    lines,
    count,
    subtotal,
    orderId,
    ensureOrderId,
    setQuantity,
    removeItem,
    clearCart,
  } = useCart();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (hydrated && !orderId) ensureOrderId();
  }, [hydrated, orderId, ensureOrderId]);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const copyReference = async () => {
    if (!orderId) return;
    if (await copyText(orderId)) setCopied(true);
  };

  if (!hydrated) {
    return (
      <section className="cart-page shell" aria-busy="true">
        <div className="empty-state">
          <span className="spinner spinner--dark" aria-hidden="true" />
          <p>{t("common.loading")}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="cart-page shell">
      <Breadcrumbs items={[{ label: t("nav.cart") }]} />

      <div className="cart-page__head">
        <div>
          <h1>{t("cart.title")}</h1>
          <p>
            {items.length
              ? `${count} ${count === 1 ? t("common.item") : t("common.items")} · ${t("cart.freeShipping")}`
              : t("cart.emptyHint")}
          </p>
        </div>
        <Link href="/shop" className="btn btn-outline btn-sm">
          {t("cart.continue")}
          <ArrowRight aria-hidden="true" />
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <span className="empty-state__icon">
            <ShoppingBag aria-hidden="true" />
          </span>
          <h2>{t("cart.empty")}</h2>
          <p>{t("cart.emptyHint")}</p>
          <Link href="/shop" className="btn btn-primary">
            {t("cart.emptyCta")}
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-main-card">
            <div className="cart-main-card__head">
              <h2>
                {t("cart.items")} · {count}
              </h2>
              <button type="button" onClick={clearCart}>
                {t("cart.clear")}
              </button>
            </div>

            <div className="cart-page__lines">
              {lines.map((line) => (
                <article key={line.item.code} className="cart-line cart-line--page">
                  <Link
                    href={line.href}
                    className="cart-line__media"
                    aria-label={line.name}
                  >
                    <Image
                      src={line.image}
                      alt={line.name}
                      fill
                      sizes="108px"
                      quality={90}
                    />
                  </Link>

                  <div className="cart-line__body">
                    <div className="cart-line__top">
                      <Link href={line.href} className="cart-line__name">
                        {line.name}
                      </Link>
                      <button
                        type="button"
                        className="cart-line__remove"
                        onClick={() => removeItem(line.item.code)}
                        aria-label={`${t("cart.remove")} — ${line.name}`}
                      >
                        <Trash2 aria-hidden="true" />
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
                          onClick={() =>
                            setQuantity(line.item.code, line.item.quantity - 1)
                          }
                          aria-label={`${t("common.quantity")} − ${line.name}`}
                        >
                          <Minus aria-hidden="true" />
                        </button>
                        <span aria-live="polite">{line.item.quantity}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setQuantity(line.item.code, line.item.quantity + 1)
                          }
                          aria-label={`${t("common.quantity")} + ${line.name}`}
                          disabled={line.item.quantity >= 20}
                        >
                          <Plus aria-hidden="true" />
                        </button>
                      </div>
                      <span className="cart-line__price">
                        {price(line.price)}
                        <small>
                          {t("cart.subtotal")}: {price(line.lineTotal)}
                        </small>
                      </span>
                    </div>
                  </div>

                  <div className="cart-line__line-total">
                    <strong>{price(line.lineTotal)}</strong>
                    <form
                      onSubmit={(event: FormEvent<HTMLFormElement>) => {
                        event.preventDefault();
                        removeItem(line.item.code);
                      }}
                    >
                      <button type="submit">
                        <Trash2 aria-hidden="true" />
                        {t("cart.remove")}
                      </button>
                    </form>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="cart-summary">
            <div className="cart-summary__head">
              <ShoppingBag aria-hidden="true" />
              {t("checkout.orderSummary")}
            </div>

            <div className="summary-row">
              <span>
                {t("cart.subtotal")} · {count}{" "}
                {count === 1 ? t("common.item") : t("common.items")}
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

            <Link href="/checkout" className="btn btn-primary">
              {t("cart.checkout")}
              <Lock aria-hidden="true" />
            </Link>
            <Link href="/shop" className="btn btn-outline">
              {t("cart.continue")}
            </Link>

            <p className="cart-summary__note">
              <Truck aria-hidden="true" />
              {t("cart.freeShipping")} · {t("cart.orderIdHint")}
            </p>
            <p className="cart-summary__note">
              <Lock aria-hidden="true" />
              {t("cart.secureNote")}
            </p>
          </aside>
        </div>
      )}
    </section>
  );
}
