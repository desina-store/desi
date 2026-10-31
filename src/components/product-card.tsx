"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { categoryLabels } from "@/data/categories";
import { discountPercent, type Product } from "@/data/products";
import { trackAddToCart } from "@/lib/tracking";
import { useCart } from "@/components/providers/cart-provider";
import { useI18n } from "@/components/providers/i18n-provider";

export function ProductCard({
  product,
  priority = false,
  className = "",
}: {
  product: Product;
  priority?: boolean;
  className?: string;
}) {
  const { lang, t, price } = useI18n();
  const { addItem } = useCart();
  const name = product.name[lang];
  const brand = product.info.brand?.[lang];
  const category = categoryLabels[product.category]?.[lang] ?? product.category;
  const discount = discountPercent(product);
  const isDigital = product.type === "digital";

  return (
    <article className={`product-card ${className}`}>
      <Link href={`/product/${product.code}`} className="product-media" aria-label={name}>
        <Image
          src={product.img}
          alt={name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          quality={90}
          priority={priority}
          className="product-image"
        />
        {discount > 0 ? (
          <span className="product-badge">-{discount}%</span>
        ) : isDigital ? (
          <span className="product-badge is-digital">{`${t("common.secure")} · Digital`}</span>
        ) : null}
        <span className="product-category-chip">{category}</span>
      </Link>

      <div className="product-copy">
        <div className="product-kicker">
          <span className="product-code">CODE-{product.code}</span>
          {brand ? <span className="product-brand">{brand}</span> : null}
        </div>
        <Link href={`/product/${product.code}`} className="product-title">
          {name}
        </Link>
        <div className="product-footer">
          <div className="price-block">
            <span className="price">{price(product.price)}</span>
            {product.oldPrice ? (
              <span className="old-price">{price(product.oldPrice)}</span>
            ) : null}
          </div>
          <button
            type="button"
            className="quick-add"
            aria-label={`${t("product.addToCart")} — ${name}`}
            onClick={() => {
              addItem(product, 1);
              trackAddToCart({ product, localizedName: name });
            }}
          >
            <Plus aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  );
}
