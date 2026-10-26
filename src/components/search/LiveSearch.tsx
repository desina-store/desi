'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Search, X } from 'lucide-react';
import { ProductGrid } from '@/components/catalog/ProductGrid';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { formatPrice } from '@/lib/format';
import { categorySlugFor, productHref, searchProducts } from '@/lib/products';
import { CATEGORY_BY_SLUG } from '@/lib/site';

type LiveSearchProps = {
  mode?: 'home' | 'page';
  initialQuery?: string;
};

const SUGGESTIONS = {
  en: ['iPhone', 'Samsung', 'AirPods', 'Windows 11', 'shorts', 'jacket'],
  ar: ['آيفون', 'سامسونج', 'أيربودز', 'ويندوز', 'شورت', 'جاكيت'],
};

const SHORTCUTS = [
  { href: '/mobiles', en: 'Mobiles', ar: 'موبايلات' },
  { href: '/computers', en: 'Computers', ar: 'كمبيوتر' },
  { href: '/appliances', en: 'Appliances', ar: 'أجهزة منزلية' },
  { href: '/outlet', en: 'Outlet', ar: 'أوت ليت' },
  { href: '/sports', en: 'Sports', ar: 'رياضة' },
  { href: '/fashion', en: 'Fashion', ar: 'أزياء' },
];

export function LiveSearch({ mode = 'home', initialQuery = '' }: LiveSearchProps) {
  const { lang, t } = useLanguage();
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);

  const trimmed = query.trim();
  const results = useMemo(() => (trimmed ? searchProducts(trimmed) : []), [trimmed]);
  const homeResults = results.slice(0, 6);
  const quickTerms = SUGGESTIONS[lang];
  const isHome = mode === 'home';

  return (
    <div className={isHome ? 'surface-card p-3 md:p-4' : ''}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          router.push(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : '/search');
        }}
        className="relative"
        role="search"
      >
        <Search className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 text-muted start-4" />
        <input
          type="search"
          name="q"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t('search.placeholder')}
          aria-label={t('search.placeholder')}
          autoComplete="off"
          className="w-full rounded-2xl border border-ink/[0.06] bg-white/80 py-3.5 pe-24 ps-11 text-sm font-semibold text-ink shadow-sm outline-none transition-[border-color,box-shadow] placeholder:font-medium placeholder:text-muted/80 focus:border-olive/50 focus:bg-white focus:shadow-card"
        />
        <div className="absolute top-1/2 flex -translate-y-1/2 items-center gap-1 end-2">
          {query ? (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors hover:bg-ink/5 hover:text-ink"
              aria-label={t('search.clear')}
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
          <button
            type="submit"
            aria-label={lang === 'ar' ? 'بحث' : 'Search'}
            className="flex h-9 items-center gap-1.5 rounded-full bg-canary px-3.5 text-[0.6875rem] font-extrabold text-ink transition-colors hover:bg-canary-deep"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{lang === 'ar' ? 'بحث' : 'Search'}</span>
          </button>
        </div>
      </form>

      {!trimmed ? (
        <div className="mt-3 flex flex-wrap items-center gap-2 px-1">
          <span className="text-[0.625rem] font-extrabold uppercase tracking-[0.14em] text-muted">
            {lang === 'ar' ? 'الأكثر بحثاً' : 'Popular'}
          </span>
          {quickTerms.map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => setQuery(term)}
              className="rounded-full border border-ink/10 bg-white/70 px-2.5 py-1 text-[0.6875rem] font-bold text-ink/70 transition-colors hover:border-olive hover:text-ink"
            >
              {term}
            </button>
          ))}
          <span className="mx-1 hidden h-4 w-px bg-ink/10 sm:block" />
          {SHORTCUTS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full bg-ink/[0.04] px-2.5 py-1 text-[0.6875rem] font-bold text-ink/70 transition-colors hover:bg-canary/60 hover:text-ink"
            >
              {item[lang]}
            </Link>
          ))}
        </div>
      ) : null}

      {trimmed && isHome ? (
        <div className="mt-4 overflow-hidden rounded-2xl border border-ink/[0.06] bg-white/70">
          <div className="flex items-center justify-between gap-3 border-b border-ink/[0.06] px-4 py-2.5">
            <p className="text-[0.6875rem] font-bold text-muted">
              {results.length} {t('search.count')} · {t('search.results')} &ldquo;{trimmed}&rdquo;
            </p>
            <Link href={`/search?q=${encodeURIComponent(trimmed)}`} className="inline-flex items-center gap-1 text-[0.6875rem] font-extrabold text-olive">
              {t('common.viewAll')}
              <ArrowRight className="h-3.5 w-3.5 rtl-flip" />
            </Link>
          </div>
          {homeResults.length ? (
            <ul className="divide-y divide-ink/[0.05]">
              {homeResults.map((product) => {
                const slug = categorySlugFor(product);
                return (
                  <li key={`${product.code}-${product.name.en}`}>
                    <Link href={productHref(product)} className="flex items-center gap-3 px-3 py-2.5 transition-colors hover:bg-cream/60">
                      <div className="product-media relative h-12 w-12 shrink-0 rounded-xl">
                        <Image src={product.image} alt={product.name[lang]} fill sizes="48px" className="object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-extrabold text-ink">{product.name[lang]}</p>
                        <p className="mt-0.5 text-[0.625rem] font-semibold text-muted">
                          CODE-{product.code}
                          {slug ? ` · ${CATEGORY_BY_SLUG.get(slug)?.short[lang] ?? ''}` : ''}
                        </p>
                      </div>
                      <span className="shrink-0 text-xs font-extrabold text-ink">{formatPrice(product.price, lang)}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="px-5 py-8 text-center">
              <p className="text-sm font-extrabold text-ink">{t('search.noResults')}</p>
              <p className="mt-1 text-xs text-muted">{t('search.noResultsSub')}</p>
            </div>
          )}
        </div>
      ) : null}

      {trimmed && !isHome ? (
        <div className="mt-7">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-bold text-ink">
              {results.length} {t('search.count')} {t('search.results')} &ldquo;{trimmed}&rdquo;
            </p>
            <button
              type="button"
              onClick={() => setQuery('')}
              className="text-xs font-extrabold text-olive underline decoration-canary-deep decoration-2 underline-offset-4"
            >
              {t('search.clear')}
            </button>
          </div>
          <ProductGrid items={results} emptyTitle={t('search.noResults')} emptySub={t('search.noResultsSub')} />
        </div>
      ) : null}

      {!trimmed && !isHome ? (
        <div className="mt-8 rounded-[1.5rem] border border-ink/[0.06] bg-white/50 p-6 text-center">
          <p className="text-sm font-bold text-ink">{lang === 'ar' ? 'ابحث بالاسم أو الكود أو القسم' : 'Search by name, product code or department'}</p>
          <p className="mt-1 text-xs text-muted">{t('search.noResultsSub')}</p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {quickTerms.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => setQuery(term)}
                className="rounded-full border border-ink/10 bg-white px-3 py-1.5 text-xs font-bold text-ink/75 transition-colors hover:border-olive"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
