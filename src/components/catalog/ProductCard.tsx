'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Tag } from 'lucide-react';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { useCart } from '@/components/providers/CartProvider';
import { formatPrice } from '@/lib/format';
import {
  categorySlugFor,
  discountPercent,
  isDiscounted,
  productHref,
  productSpecs,
  type Product,
} from '@/lib/products';
import { CATEGORY_BY_SLUG } from '@/lib/site';

export function ProductCard({ product }: { product: Product }) {
  const { lang, t } = useLanguage();
  const { add, ready } = useCart();
  const discount = discountPercent(product);
  const sale = isDiscounted(product);
  const slug = categorySlugFor(product);
  const categoryLabel = slug ? `${CATEGORY_BY_SLUG.get(slug)?.short[lang] ?? ''}` : product.category;
  const specs = productSpecs(product, lang).slice(0, 2);
  const href = productHref(product);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.6rem] border border-ink/[0.07] bg-white/85 p-2 shadow-card backdrop-blur-sm transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-olive/30 hover:shadow-float">
      <Link href={href} className="product-media relative block aspect-[4/3] rounded-[1.25rem]" aria-label={product.name[lang]}>
        <Image
          src={product.image}
          alt={product.name[lang]}
          fill
          sizes="(max-width: 640px) 48vw, (max-width: 1024px) 30vw, 280px"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-x-2 top-2 flex items-start justify-between gap-2">
          {discount ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-brand-red px-2.5 py-1 text-[0.625rem] font-extrabold uppercase tracking-[0.08em] text-white">
              <Tag className="h-3 w-3" />
              {discount}% {t('card.off')}
            </span>
          ) : (
            <span className="rounded-full bg-white/90 px-2.5 py-1 text-[0.625rem] font-extrabold uppercase tracking-[0.08em] text-olive backdrop-blur">
              {product.kind === 'digital' ? 'DIGITAL' : categoryLabel}
            </span>
          )}
          <span className="rounded-full bg-ink/80 px-2 py-1 text-[0.5625rem] font-bold tracking-[0.08em] text-white/90 backdrop-blur">
            CODE-{product.code}
          </span>
        </div>
      </Link>

      <div className="flex flex-1 flex-col px-2 pb-2 pt-3">
        <p className="text-[0.625rem] font-extrabold uppercase tracking-[0.16em] text-olive/80">{categoryLabel}</p>
        <Link href={href} className="mt-1">
          <h3 className="line-clamp-2 text-sm font-extrabold leading-snug text-ink md:text-[0.9375rem]">
            {product.name[lang]}
          </h3>
        </Link>
        {specs.length ? (
          <p className="mt-1.5 line-clamp-1 text-[0.6875rem] leading-relaxed text-muted">
            {t(specs[0].labelKey)}: {specs[0].value}
          </p>
        ) : null}

        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <div className="min-w-0">
            <p className="truncate text-base font-extrabold text-ink md:text-lg">{formatPrice(product.price, lang)}</p>
            {sale && product.oldPrice ? (
              <p className="text-[0.6875rem] font-semibold text-muted line-through">{formatPrice(product.oldPrice, lang)}</p>
            ) : null}
          </div>
          <button
            type="button"
            disabled={!ready}
            onClick={() => add(product, lang)}
            className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full bg-canary px-3 text-[0.6875rem] font-extrabold text-ink transition-colors hover:bg-canary-deep disabled:opacity-60 md:px-4"
            aria-label={`${t('card.add')} — ${product.name[lang]}`}
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden sm:inline">{t('card.add')}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
