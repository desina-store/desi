import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Boxes, ShieldCheck, Truck } from 'lucide-react';
import { formatCount } from '@/lib/format';
import { productsForCategory } from '@/lib/products';
import { CATEGORIES, CATEGORY_BY_SLUG, WHATSAPP, type CategorySlug, type Lang } from '@/lib/site';
import { translate } from '@/lib/i18n';
import { ProductGrid } from './ProductGrid';

type CategoryPageViewProps = {
  slug: CategorySlug;
  lang: Lang;
};

export function CategoryPageView({ slug, lang }: CategoryPageViewProps) {
  const def = CATEGORY_BY_SLUG.get(slug);
  if (!def) return null;
  const items = productsForCategory(slug);
  const tr = (key: string) => translate(lang, key);
  const tabs = CATEGORIES.filter((category) => category.slug !== 'industrial' && category.slug !== 'tourism');

  return (
    <div>
      <section className="relative overflow-hidden border-b border-ink/5" style={{ backgroundColor: def.tint }}>
        <div aria-hidden className="pointer-events-none absolute -top-24 end-[-6rem] h-72 w-72 rounded-full bg-canary/30 blur-3xl" />
        <div className="page-shell relative py-10 md:py-14">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[0.625rem] font-bold text-ink/50">
            <Link href="/" className="transition-colors hover:text-ink">{tr('nav.home')}</Link>
            <span aria-hidden>/</span>
            <span className="text-ink/75">{def.short[lang]}</span>
          </nav>

          <div className="mt-5 grid items-center gap-7 lg:grid-cols-[1.25fr_0.75fr]">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/60 px-3 py-1 text-[0.5625rem] font-extrabold uppercase tracking-[0.18em] text-olive backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-canary-deep" />
                {def.name[lang]}
              </span>
              <h1 className="mt-4 max-w-[22ch] text-balance text-3xl font-extrabold leading-[1.12] tracking-tight text-ink md:text-5xl">
                {def.hero[lang]}
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink/60 md:text-base">{def.intro[lang]}</p>

              <div className="mt-6 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/75 px-3 py-1.5 text-[0.6875rem] font-extrabold text-ink/70">
                  <Boxes className="h-3.5 w-3.5 text-olive" />
                  {formatCount(items.length, lang)} {tr('category.products')}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/75 px-3 py-1.5 text-[0.6875rem] font-extrabold text-ink/70">
                  <ShieldCheck className="h-3.5 w-3.5 text-olive" />
                  {tr('pdp.genuine')}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/75 px-3 py-1.5 text-[0.6875rem] font-extrabold text-ink/70">
                  <Truck className="h-3.5 w-3.5 text-olive" />
                  {tr('pdp.delivery')}
                </span>
              </div>
            </div>

            <Link href="/offers" className="group relative mx-auto block w-full max-w-sm">
              <div className="product-media relative aspect-[5/4] rounded-[2rem] border border-white/70 shadow-float">
                <Image
                  src={def.image}
                  alt={def.name[lang]}
                  fill
                  priority
                  sizes="(max-width: 1024px) 80vw, 380px"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
                <span className="absolute bottom-3 start-3 inline-flex items-center gap-1.5 rounded-full bg-ink/85 px-3 py-1.5 text-[0.625rem] font-extrabold text-canary backdrop-blur">
                  {tr('hero.cta')}
                  <ArrowRight className="h-3 w-3 rtl-flip" />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <div className="page-shell py-8 md:py-12">
        <div className="no-scrollbar -mx-5 mb-7 flex gap-2 overflow-x-auto px-5 md:mx-0 md:flex-wrap md:px-0">
          {tabs.map((category) => {
            const active = category.slug === slug;
            return (
              <Link
                key={category.slug}
                href={`/${category.slug}`}
                className={`shrink-0 rounded-full border px-3.5 py-2 text-[0.6875rem] font-extrabold transition-colors ${
                  active
                    ? 'border-ink bg-ink text-canary'
                    : 'border-ink/10 bg-white/70 text-ink/70 hover:border-olive hover:text-ink'
                }`}
              >
                {category.name[lang]}
              </Link>
            );
          })}
          <Link
            href="/offers"
            className="shrink-0 rounded-full border border-brand-red/20 bg-brand-red/5 px-3.5 py-2 text-[0.6875rem] font-extrabold text-brand-red transition-colors hover:bg-brand-red/10"
          >
            {tr('nav.offers')}
          </Link>
        </div>

        <ProductGrid items={items} emptyTitle={tr('category.empty')} emptySub={tr('category.emptyBody')} />

        <section className="mt-12 rounded-[1.75rem] border border-ink/[0.07] bg-white/55 p-5 md:p-6">
          <p className="text-[0.625rem] font-extrabold uppercase tracking-[0.18em] text-olive">{tr('category.other')}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {CATEGORIES.filter((category) => category.slug !== slug).map((category) => (
              <Link
                key={category.slug}
                href={`/${category.slug}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-ink/10 bg-white/80 px-3 py-1.5 text-[0.6875rem] font-bold text-ink/70 transition-colors hover:border-olive hover:text-ink"
              >
                {category.name[lang]}
                <ArrowRight className="h-3 w-3 rtl-flip" />
              </Link>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-ink/[0.06] pt-4">
            <p className="text-xs text-muted">
              {lang === 'ar' ? 'محتاج مساعدة في الاختيار؟' : 'Need help choosing?'}
            </p>
            <a
              href={`https://wa.me/${WHATSAPP}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost text-xs"
            >
              {tr('support.whatsapp')}
              <ArrowRight className="h-3.5 w-3.5 rtl-flip" />
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
