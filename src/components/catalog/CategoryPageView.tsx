import type { CSSProperties } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowDown, ArrowRight, BadgeCheck, ShieldCheck, Truck } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/PageHero';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { CategoryExplorer } from './CategoryExplorer';
import { formatCount } from '@/lib/format';
import { productsForCategory } from '@/lib/products';
import { CATEGORIES, CATEGORY_BY_SLUG, WHATSAPP, type CategorySlug, type Lang } from '@/lib/site';
import { translate } from '@/lib/i18n';
import { pick } from '@/lib/brand-copy';

type CategoryPageViewProps = {
  slug: CategorySlug;
  lang: Lang;
};

export function CategoryPageView({ slug, lang }: CategoryPageViewProps) {
  const def = CATEGORY_BY_SLUG.get(slug);
  if (!def) return null;
  const items = productsForCategory(slug);
  const tr = (key: string) => translate(lang, key);
  const tabs = CATEGORIES.filter((category) => category.catalog.length > 0);

  return (
    <>
      <section className="category-hero">
        <div className="shell">
          <Breadcrumbs items={[{ label: tr('sections.all'), href: '/#sections' }, { label: def.name[lang] }]} />
          <div className="category-hero__panel" style={{ '--tone': def.tint } as CSSProperties}>
            <div className="category-hero__copy">
              <p className="eyebrow">{pick(lang, 'Department', 'قسم')}</p>
              <h1>{def.name[lang]}</h1>
              <p>{def.intro[lang]}</p>
              <div className="category-hero__meta">
                <span className="chip">
                  {formatCount(items.length, lang)} {tr('category.products')}
                </span>
                <span className="chip">
                  <ShieldCheck aria-hidden="true" />
                  {tr('pdp.genuine')}
                </span>
                <span className="chip">
                  <Truck aria-hidden="true" />
                  {tr('feature.delivery')}
                </span>
              </div>
              <div className="category-hero__actions">
                {items.length ? (
                  <Link href="#catalogue" className="btn btn-primary">
                    <ArrowDown aria-hidden="true" />
                    {pick(lang, 'Browse the collection', 'تصفح المجموعة')}
                  </Link>
                ) : (
                  <a
                    href={`https://wa.me/${WHATSAPP}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                  >
                    {tr('category.request')}
                  </a>
                )}
                <Link href="/offers" className="btn btn-outline">
                  {tr('nav.offers')}
                </Link>
              </div>
            </div>
            <div className="category-hero__media">
              <Image
                src={def.image}
                alt={def.name[lang]}
                fill
                priority
                sizes="(max-width: 900px) 100vw, 42vw"
                quality={90}
              />
              <span className="category-hero__badge">
                <BadgeCheck aria-hidden="true" />
                {pick(lang, 'Authentic products only', 'منتجات أصلية فقط')}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--tight" id="catalogue">
        <div className="shell">
          <SectionHeading
            eyebrow={def.short[lang]}
            title={pick(lang, 'Browse the collection', 'تصفح المجموعة')}
            sub={def.hero[lang]}
          />
          {items.length ? (
            <CategoryExplorer products={items} />
          ) : (
            <div className="empty-state">
              <span className="empty-state__icon">
                <BadgeCheck aria-hidden="true" />
              </span>
              <h3>{tr('category.empty')}</h3>
              <p>{tr('category.emptyBody')}</p>
              <a
                href={`https://wa.me/${WHATSAPP}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-dark btn-sm"
              >
                {tr('support.whatsapp')}
              </a>
            </div>
          )}

          <div className="explorer__meta" style={{ marginTop: 28 }}>
            <span>{tr('category.other')}</span>
          </div>
          <div className="category-hero__meta">
            {tabs
              .filter((category) => category.slug !== slug)
              .map((category) => (
                <Link key={category.slug} href={`/${category.slug}`} className="chip">
                  {category.name[lang]}
                  <ArrowRight aria-hidden="true" />
                </Link>
              ))}
          </div>
        </div>
      </section>
    </>
  );
}
