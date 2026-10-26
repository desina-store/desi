import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  BadgeCheck,
  Headphones,
  ShieldCheck,
  Sparkles,
  Truck,
} from 'lucide-react';
import { getServerLang } from '@/lib/server';
import { translate } from '@/lib/i18n';
import { STORE_SCHEMA } from '@/lib/store-schema';
import { REVIEW_STATIC, serviceCards } from '@/lib/content';
import { WHATSAPP, CATEGORY_BY_SLUG } from '@/lib/site';
import { formatPrice } from '@/lib/format';
import { discountPercent, getProduct, type Product } from '@/lib/products';
import { JsonLd } from '@/components/ui/JsonLd';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Stars } from '@/components/ui/Stars';
import { HeroSwiper } from '@/components/home/HeroSwiper';
import { CategoryRail } from '@/components/home/CategoryRail';
import { ProductSwiper } from '@/components/home/ProductSwiper';
import { ProductGrid } from '@/components/catalog/ProductGrid';
import { LiveSearch } from '@/components/search/LiveSearch';

const FEATURED_CODES = [1, 2, 3, 5, 8, 17, 4, 11];
const TRENDING_CODES = [9, 18, 19, 20, 21, 12, 14, 28];
const BRANDS = ['Apple', 'Samsung', 'LG', 'Anker', 'Microsoft', 'Kaspersky', 'Google', 'OpenAI', 'DeSina'];

function pickUnique(codes: number[]): Product[] {
  const seen = new Set<string>();
  const picked: Product[] = [];
  for (const code of codes) {
    const product = getProduct(code);
    if (!product || seen.has(product.name.en)) continue;
    seen.add(product.name.en);
    picked.push(product);
  }
  return picked;
}

export default async function HomePage() {
  const lang = await getServerLang();
  const tr = (key: string) => translate(lang, key);
  const featured = pickUnique(FEATURED_CODES);
  const trending = pickUnique(TRENDING_CODES);
  const dealOne = getProduct(1);
  const dealTwo = getProduct(11);
  const industrial = CATEGORY_BY_SLUG.get('industrial');
  const tourism = CATEGORY_BY_SLUG.get('tourism');
  const features = [
    { icon: ShieldCheck, title: tr('feature.pay'), body: tr('feature.payBody') },
    { icon: BadgeCheck, title: tr('feature.warranty'), body: tr('feature.warrantyBody') },
    { icon: Truck, title: tr('feature.delivery'), body: tr('feature.deliveryBody') },
    { icon: Headphones, title: tr('feature.support'), body: tr('feature.supportBody') },
  ];

  return (
    <>
      <JsonLd data={STORE_SCHEMA} />
      <HeroSwiper />

      <div className="page-shell">
        <section id="search" className="scroll-mt-24">
          <div className="overflow-hidden rounded-[1.75rem] border border-ink/[0.07] bg-white/55 p-4 shadow-card backdrop-blur-sm md:p-5">
            <div className="grid gap-3 lg:grid-cols-[0.72fr_1.4fr] lg:items-center lg:gap-6">
              <div className="px-1">
                <span className="inline-flex items-center gap-2 text-[0.625rem] font-extrabold uppercase tracking-[0.2em] text-olive">
                  <Sparkles className="h-3.5 w-3.5" />
                  {lang === 'ar' ? 'بحث فوري' : 'Live search'}
                </span>
                <h2 className="mt-1.5 text-lg font-extrabold tracking-tight text-ink md:text-xl">
                  {tr('home.searchTitle')}
                </h2>
                <p className="mt-1 text-xs text-muted">{tr('home.searchSub')}</p>
              </div>
              <LiveSearch mode="home" aria-label="بحث في المتجر" />
            </div>
          </div>
        </section>

        <div className="mt-11 md:mt-14">
          <CategoryRail />
        </div>
      </div>

      <section className="page-shell mt-12 md:mt-16">
        <SectionHeading
          eyebrow={lang === 'ar' ? 'مختارات ديسينا' : 'DeSina selection'}
          title={tr('home.featuredTitle')}
          sub={tr('home.featuredSub')}
          action={{ href: '/offers', label: tr('common.viewAll') }}
        />
        <ProductGrid items={featured} />
      </section>

      <section className="mt-14 border-y border-ink/5 bg-cream-deep/45 py-12 md:mt-20 md:py-16">
        <div className="page-shell">
          <SectionHeading
            eyebrow={lang === 'ar' ? 'تصفيات الأوت ليت' : 'Outlet markdowns'}
            title={tr('home.dealsTitle')}
            sub={tr('home.dealsSub')}
            action={{ href: '/offers', label: tr('hero.cta') }}
          />
          <div className="grid gap-4 md:grid-cols-2">
            {[dealOne, dealTwo].map((deal, index) =>
              deal ? (
                <article
                  key={deal.code}
                  className={`group relative overflow-hidden rounded-[2rem] border border-ink/[0.06] p-2 shadow-card ${
                    index === 0 ? 'bg-[#fdf6e3]' : 'bg-[#e8f0e0]'
                  }`}
                >
                  <div className="grid gap-3 sm:grid-cols-[1.05fr_1fr] sm:items-center">
                    <Link href={`/product/${deal.code}`} className="product-media relative aspect-[4/3] rounded-[1.5rem]">
                      <Image
                        src={deal.image}
                        alt={deal.name[lang]}
                        fill
                        sizes="(max-width: 640px) 90vw, 300px"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      />
                      {discountPercent(deal) ? (
                        <span className="absolute start-3 top-3 rounded-full bg-brand-red px-2.5 py-1 text-[0.625rem] font-extrabold uppercase tracking-[0.08em] text-white">
                          −{discountPercent(deal)}% {tr('card.off')}
                        </span>
                      ) : null}
                    </Link>
                    <div className="flex flex-col gap-2 p-2 sm:p-3">
                      <span className="w-fit rounded-full bg-white/80 px-2.5 py-1 text-[0.5625rem] font-extrabold uppercase tracking-[0.12em] text-olive">
                        {lang === 'ar' ? 'عرض محدود' : 'Limited offer'}
                      </span>
                      <h3 className="line-clamp-2 text-lg font-extrabold leading-snug text-ink">
                        {deal.name[lang]}
                      </h3>
                      <p className="line-clamp-2 text-[0.6875rem] leading-relaxed text-muted">
                        {deal.info.brand?.[lang] ?? ''} · {deal.info.spec?.[lang] ?? deal.info.type?.[lang] ?? ''}
                      </p>
                      <div className="mt-1 flex flex-wrap items-end gap-2">
                        <span className="text-xl font-extrabold text-ink">{formatPrice(deal.price, lang)}</span>
                        {deal.oldPrice ? (
                          <span className="text-xs font-bold text-muted line-through">
                            {formatPrice(deal.oldPrice, lang)}
                          </span>
                        ) : null}
                      </div>
                      <Link
                        href={`/product/${deal.code}`}
                        className="mt-1 inline-flex w-fit items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-[0.6875rem] font-extrabold text-white transition-colors hover:bg-olive-dark"
                      >
                        {tr('card.buy')}
                        <ArrowRight className="h-3.5 w-3.5 rtl-flip" />
                      </Link>
                    </div>
                  </div>
                </article>
              ) : null,
            )}
          </div>
        </div>
      </section>

      <section className="page-shell mt-12 md:mt-16">
        <ProductSwiper
          title={lang === 'ar' ? 'الأكثر رواجاً الآن' : 'Trending right now'}
          sub={
            lang === 'ar'
              ? 'أجهزة وبرمجيات يطلبها عملاؤنا هذا الأسبوع.'
              : 'Hardware and software our clients keep asking for this week.'
          }
          items={trending}
          action={{ href: '/search', label: tr('common.viewAll') }}
        />
      </section>

      <section className="mt-14 overflow-hidden border-y border-ink/5 bg-white/35 py-9 md:mt-20">
        <div className="page-shell mb-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <span className="text-[0.625rem] font-extrabold uppercase tracking-[0.2em] text-olive">
                {lang === 'ar' ? 'ماركات موثوقة' : 'Brand shelf'}
              </span>
              <h2 className="mt-1 text-xl font-extrabold text-ink md:text-2xl">{tr('home.brandsTitle')}</h2>
            </div>
            <p className="max-w-md text-xs text-muted">{tr('home.brandsSub')}</p>
          </div>
        </div>
        <div className="relative flex overflow-hidden">
          <div className="ds-marquee flex min-w-max items-center gap-3">
            {[...BRANDS, ...BRANDS].map((brand, index) => (
              <span
                key={`${brand}-${index}`}
                className="flex h-16 min-w-[9.5rem] items-center justify-center rounded-2xl border border-ink/[0.06] bg-white/70 px-6 text-base font-extrabold tracking-tight text-ink/65 shadow-sm"
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="page-shell mt-14 md:mt-20">
        <SectionHeading
          eyebrow={lang === 'ar' ? 'خدمات ديسينا' : 'DeSina services'}
          title={tr('home.servicesTitle')}
          sub={tr('home.servicesSub')}
        />
        <div className="grid gap-4 md:grid-cols-2">
          {[industrial, tourism].map((category) => {
            if (!category) return null;
            const cards = serviceCards(category.slug as 'industrial' | 'tourism');
            return (
              <Link
                key={category.slug}
                href={`/${category.slug}`}
                className="group relative overflow-hidden rounded-[2rem] shadow-card"
              >
                <div className="relative aspect-[16/11] w-full sm:aspect-[16/9]">
                  <Image
                    src={category.image}
                    alt={category.name[lang]}
                    fill
                    sizes="(max-width: 768px) 100vw, 600px"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/10" />
                  <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                    <span className="rounded-full bg-canary px-2.5 py-1 text-[0.5625rem] font-extrabold uppercase tracking-[0.14em] text-ink">
                      {category.short[lang]}
                    </span>
                    <h3 className="mt-3 max-w-[22ch] text-balance text-xl font-extrabold leading-tight text-white md:text-2xl">
                      {category.hero[lang]}
                    </h3>
                    <ul className="mt-3 hidden space-y-1 text-xs text-white/65 sm:block">
                      {cards.slice(0, 2).map((card) => (
                        <li key={card.title.en} className="flex items-center gap-1.5">
                          <span className="h-1 w-1 rounded-full bg-canary" />
                          {card.title[lang]}
                        </li>
                      ))}
                    </ul>
                    <span className="mt-4 inline-flex items-center gap-2 text-[0.6875rem] font-extrabold text-canary">
                      {tr('sections.view')}
                      <ArrowRight className="h-3.5 w-3.5 rtl-flip" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="page-shell mt-14 md:mt-20">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <article key={feature.title} className="surface-card flex items-start gap-3 p-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-canary/55 text-olive-dark">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-sm font-extrabold text-ink">{feature.title}</h3>
                  <p className="mt-1 text-[0.6875rem] leading-relaxed text-muted">{feature.body}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="page-shell mt-14 md:mt-20">
        <SectionHeading
          eyebrow={lang === 'ar' ? 'تقييمات موثقة' : 'Verified feedback'}
          title={tr('home.reviewsTitle')}
          sub={tr('home.reviewsSub')}
          action={{ href: '/reviews', label: tr('common.viewAll') }}
        />
        <div className="grid gap-3 md:grid-cols-3">
          {REVIEW_STATIC.map((review) => (
            <article key={review.name.en} className="surface-card flex flex-col gap-3 p-5">
              <div className="flex items-center justify-between gap-2">
                <Stars rating={review.stars} />
                <span className="text-[0.625rem] font-bold text-muted">{review.time[lang]}</span>
              </div>
              <p className="text-sm leading-relaxed text-ink/75">&ldquo;{review.text[lang]}&rdquo;</p>
              <div className="mt-auto flex items-center gap-2 pt-1">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-olive/10 text-xs font-extrabold text-olive">
                  {review.avatar}
                </span>
                <span className="text-xs font-extrabold text-ink">{review.name[lang]}</span>
              </div>
            </article>
          ))}
          <article className="flex flex-col justify-between gap-4 rounded-[1.625rem] bg-ink p-5 text-white shadow-card">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-canary/15 px-2.5 py-1 text-[0.5625rem] font-extrabold uppercase tracking-[0.12em] text-canary">
                <Sparkles className="h-3 w-3" />
                {lang === 'ar' ? 'تقييم عام' : 'Aggregate'}
              </span>
              <p className="mt-4 text-4xl font-extrabold text-white">4.8</p>
              <p className="mt-1 text-xs text-white/55">
                {lang === 'ar' ? 'من 1200+ تقييم موثق' : 'from 1,200+ verified reviews'}
              </p>
            </div>
            <Link
              href="/reviews"
              className="inline-flex w-fit items-center gap-2 rounded-full bg-canary px-4 py-2 text-[0.6875rem] font-extrabold text-ink transition-colors hover:bg-canary-deep"
            >
              {tr('reviews.submit')}
              <ArrowRight className="h-3.5 w-3.5 rtl-flip" />
            </Link>
          </article>
        </div>
      </section>

      <section className="page-shell mt-14 mb-14 md:mt-20 md:mb-20">
        <div className="relative overflow-hidden rounded-[2rem] bg-ink px-6 py-9 text-white shadow-float md:px-10 md:py-12">
          <div aria-hidden className="pointer-events-none absolute -top-20 end-0 h-64 w-64 rounded-full bg-canary/15 blur-3xl" />
          <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[0.5625rem] font-extrabold uppercase tracking-[0.16em] text-canary">
                <Sparkles className="h-3.5 w-3.5" />
                {lang === 'ar' ? 'فريق ديسينا' : 'DeSina team'}
              </span>
              <h2 className="mt-3 text-balance text-2xl font-extrabold leading-tight md:text-3xl">
                {tr('home.ctaTitle')}
              </h2>
              <p className="mt-2 max-w-lg text-sm leading-relaxed text-white/65">{tr('home.ctaBody')}</p>
            </div>
            <a
              href={`https://wa.me/${WHATSAPP}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full bg-canary px-5 py-3 text-sm font-extrabold text-ink transition-colors hover:bg-canary-deep"
            >
              {tr('home.ctaButton')}
              <ArrowRight className="h-4 w-4 rtl-flip" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
