'use client';

import { useId, useState } from 'react';
import { Search, SearchX } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { CATEGORIES } from '@/lib/site';
import { discountPercent, type Product } from '@/lib/products';
import { pick } from '@/lib/brand-copy';

type SortOrder = 'featured' | 'price-asc' | 'price-desc' | 'name';

function catalogLabel(name: string, lang: 'ar' | 'en'): string {
  const owner = CATEGORIES.find((category) => category.catalog.includes(name));
  return owner ? owner.name[lang] : name;
}

export function CategoryExplorer({ products }: { products: Product[] }) {
  const { lang, t } = useLanguage();
  const [active, setActive] = useState('all');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<SortOrder>('featured');
  const searchId = useId();
  const sortId = useId();

  const discounted = products.filter((product) => discountPercent(product) !== null);
  const filters = [
    { id: 'all', label: pick(lang, 'All', 'الكل'), count: products.length },
    ...Array.from(new Set(products.map((product) => product.category))).map((category) => ({
      id: `category:${category}`,
      label: catalogLabel(category, lang),
      count: products.filter((product) => product.category === category).length,
    })),
    ...(discounted.length
      ? [{ id: 'offers', label: pick(lang, 'On offer', 'على خصم'), count: discounted.length }]
      : []),
  ];

  const normalized = query.trim().toLowerCase();
  let visible = products.filter((product) => {
    if (active === 'offers') return discountPercent(product) !== null;
    if (active.startsWith('category:')) return product.category === active.slice(9);
    return true;
  });

  if (normalized) {
    visible = visible.filter((product) => {
      const haystack = [
        product.name.en,
        product.name.ar,
        product.info.brand?.en,
        product.info.brand?.ar,
        `code-${product.code}`,
        String(product.code),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(normalized);
    });
  }

  visible = [...visible];
  if (sort === 'price-asc') visible.sort((a, b) => a.price - b.price);
  if (sort === 'price-desc') visible.sort((a, b) => b.price - a.price);
  if (sort === 'name') {
    visible.sort((a, b) =>
      a.name[lang].localeCompare(b.name[lang], lang === 'ar' ? 'ar' : 'en', { sensitivity: 'base' }),
    );
  }

  const activeLabel = filters.find((filter) => filter.id === active)?.label ?? '';

  return (
    <div className="explorer">
      <div className="explorer__bar">
        <div className="explorer__filters" role="group" aria-label={t('sections.title')}>
          {filters.map((filter) => (
            <button
              key={filter.id}
              type="button"
              className={`filter-pill${active === filter.id ? ' is-active' : ''}`}
              aria-pressed={active === filter.id}
              onClick={() => setActive(filter.id)}
            >
              {filter.label}
              <span className="filter-pill__count">{filter.count}</span>
            </button>
          ))}
        </div>
        <div className="explorer__tools">
          <div className="explorer__search">
            <Search aria-hidden="true" />
            <label className="sr-only" htmlFor={searchId}>
              {t('home.searchTitle')}
            </label>
            <input
              id={searchId}
              type="search"
              value={query}
              placeholder={t('search.placeholder')}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <label className="sr-only" htmlFor={sortId}>
            {pick(lang, 'Sort products', 'ترتيب المنتجات')}
          </label>
          <select
            id={sortId}
            className="explorer__sort"
            value={sort}
            onChange={(event) => setSort(event.target.value as SortOrder)}
          >
            <option value="featured">{pick(lang, 'Featured', 'مميز')}</option>
            <option value="price-asc">{pick(lang, 'Price: low to high', 'السعر: من الأقل للأعلى')}</option>
            <option value="price-desc">{pick(lang, 'Price: high to low', 'السعر: من الأعلى للأقل')}</option>
            <option value="name">{pick(lang, 'Name A–Z', 'الاسم أ–ي')}</option>
          </select>
        </div>
      </div>

      <div className="explorer__meta">
        <span>
          <strong>{visible.length}</strong>{' '}
          {visible.length === 1 ? pick(lang, 'item', 'عنصر') : pick(lang, 'items', 'عنصراً')}
        </span>
        {normalized ? (
          <button type="button" className="text-link" onClick={() => setQuery('')}>
            {pick(lang, 'Clear search', 'مسح البحث')}
          </button>
        ) : (
          <span>{activeLabel}</span>
        )}
      </div>

      {visible.length ? (
        <div className="product-grid">
          {visible.map((product) => (
            <ProductCard key={product.code} product={product} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <span className="empty-state__icon">
            <SearchX aria-hidden="true" />
          </span>
          <h3>{t('search.noResults')}</h3>
          <p>{t('search.noResultsSub')}</p>
          <button
            type="button"
            className="btn btn-dark btn-sm"
            onClick={() => {
              setQuery('');
              setActive('all');
            }}
          >
            {pick(lang, 'Reset filters', 'إعادة ضبط الفلاتر')}
          </button>
        </div>
      )}
    </div>
  );
}
