"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Minus, Plus, Share2, ShoppingBag, Zap } from "lucide-react";
import type { Product } from "@/data/products";
import { copyText } from "@/lib/clipboard";
import { trackAddToCart } from "@/lib/tracking";
import { useCart } from "@/components/providers/cart-provider";
import { useI18n } from "@/components/providers/i18n-provider";

const MAX_QUANTITY = 20;

export function ProductPurchase({ product }: { product: Product }) {
  const { lang, t, tr } = useI18n();
  const { addItem } = useCart();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [copied, setCopied] = useState(false);
  const name = product.name[lang];

  function add(goToCheckout = false) {
    addItem(product, quantity);
    trackAddToCart({ product, quantity, localizedName: name });
    if (goToCheckout) router.push("/checkout");
  }

  async function share() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: name, url });
        return;
      }
    } catch {
      // The user dismissed the native share sheet.
      return;
    }
    const ok = await copyText(url);
    if (ok) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    }
  }

  return (
    <>
      <div className="product-quantity">
        <span className="product-quantity__label">{t("common.quantity")}</span>
        <div className="qty-control">
          <button
            type="button"
            aria-label={tr("Decrease quantity", "تقليل الكمية")}
            disabled={quantity <= 1}
            onClick={() => setQuantity((current) => Math.max(1, current - 1))}
          >
            <Minus aria-hidden="true" />
          </button>
          <span aria-live="polite">{quantity}</span>
          <button
            type="button"
            aria-label={tr("Increase quantity", "زيادة الكمية")}
            disabled={quantity >= MAX_QUANTITY}
            onClick={() => setQuantity((current) => Math.min(MAX_QUANTITY, current + 1))}
          >
            <Plus aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="product-actions">
        <button type="button" className="btn btn-primary" onClick={() => add(false)}>
          <ShoppingBag aria-hidden="true" />
          {t("product.addToCart")}
        </button>
        <button type="button" className="btn btn-dark" onClick={() => add(true)}>
          <Zap aria-hidden="true" />
          {t("product.buyNow")}
        </button>
      </div>

      <div className="product-share-row">
        <span className="product-stock">{t("product.inStock")}</span>
        <button type="button" className="product-share-btn" onClick={share}>
          {copied ? <Check aria-hidden="true" /> : <Share2 aria-hidden="true" />}
          {copied ? t("common.copied") : t("product.share")}
        </button>
      </div>
    </>
  );
}
