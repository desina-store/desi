'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { useCart } from '@/components/providers/CartProvider';
import { formatPrice } from '@/lib/format';
import { categorySlugFor, discountPercent, productHref, type Product } from '@/lib/products';
import { CATEGORY_BY_SLUG } from '@/lib/site';

export function ProductCard({
  product,
  priority = false,
  className = '',
}: {
  product: Product;
  priority?: boolean;
  className?: string;
}) {
  const { lang } = useLanguage();
  const { add, ready } = useCart();
  const name = product.name[lang];
  const brand = product.info.brand?.[lang];
  const slug = categorySlugFor(product);
  const category = slug ? (CATEGORY_BY_SLUG.get(slug)?.short[lang] ?? product.category) : product.category;
  const discount = discountPercent(product);
  const isDigital = product.kind === 'digital';
  const href = productHref(product);

  return (
    <article className={`product-card ${className}`}>
      <Link href={href} className="product-media" aria-label={name}>
        <Image
          src={product.image}
          alt={name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          quality={90}
          priority={priority}
          className="product-image"
        />
        {discount ? (
          <span className="product-badge">-{discount}%</span>
        ) : isDigital ? (
          <span className="product-badge is-digital">Digital</span>
        ) : null}
        <span className="product-category-chip">{category}</span>
      </Link>

      <div className="product-copy">
        <div className="product-kicker">
          <span className="product-code">CODE-{product.code}</span>
          {brand ? <span className="product-brand">{brand}</span> : null}
        </div>
        <Link href={href} className="product-title">
          {name}
        </Link>
        <div className="product-footer">
          <div className="price-block">
            <span className="price">{formatPrice(product.price, lang)}</span>
            {product.oldPrice ? <span className="old-price">{formatPrice(product.oldPrice, lang)}</span> : null}
          </div>
          <button
            type="button"
            className="quick-add"
            disabled={!ready}
            aria-label={`${name} — CODE-${product.code}`}
            onClick={() => add(product, lang)}
          >
            <Plus aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  );
}
