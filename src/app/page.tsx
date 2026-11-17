import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Headphones,
  MessageCircle,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import { getServerLang } from '@/lib/server';
import { translate } from '@/lib/i18n';
import { STORE_SCHEMA } from '@/lib/store-schema';
import { serviceCards } from '@/lib/content';
import { CATEGORY_BY_SLUG, WHATSAPP } from '@/lib/site';
import { dealsProducts, getProduct, products, type Product } from '@/lib/products';
import { JsonLd } from '@/components/ui/JsonLd';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Stars } from '@/components/ui/Stars';
import { ProductCard } from '@/components/catalog/ProductCard';
import { ProductGrid } from '@/components/catalog/ProductGrid';
import { HeroSwiper } from '@/components/home/HeroSwiper';
import { CategoryRail } from '@/components/home/CategoryRail';
import { ProductSwiper } from '@/components/home/ProductSwiper';
import { DealsTimer } from '@/components/home/DealsTimer';
import { TestimonialsSwiper } from '@/components/home/TestimonialsSwiper';
import { NewsletterForm } from '@/components/home/NewsletterForm';
import { LiveSearch } from '@/components/search/LiveSearch';
import { HOME_COPY, PROMISES, pick } from '@/lib/brand-copy';

const FEATURED_CODES = [1, 2, 3, 5, 8, 17, 4, 11];
const TRENDING_CODES = [9, 18, 19, 20, 21, 12, 14, 28];

const BRANDS = [
  { name: 'Samsung', src: '/brands/brand-01.png' },
  { name: 'DeFacto', src: '/brands/brand-02.png' },
  { name: 'Apple', src: '/brands/brand-03.png' },
  { name: 'essence', src: '/brands/brand-04.png' },
  { name: 'Xiaomi', src: '/brands/brand-05.png' },
  { name: 'Casio', src: '/brands/brand-06.png' },
];

const PROMISE_ICONS = {
  truck: Truck,
  shield: ShieldCheck,
  badge: BadgeCheck,
  headset: Headphones,
} as const;

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
  const deals = dealsProducts().slice(0, 4);
  const promoColumns = deals.length < 4 ? 4 - deals.length : 0;
  const industrial = CATEGORY_BY_SLUG.get('industrial');
  const tourism = CATEGORY_BY_SLUG.get('tourism');
  const stats = [
    { value: `${products.length}+`, labelKey: 'statProducts' as const },
    { value: '8', labelKey: 'statDepartments' as const },
    { value: '4.8', labelKey: 'statRating' as const },
  ];

  return (
    <>
      <JsonLd data={STORE_SCHEMA} />

      <HeroSwiper />

      <section className="section section--tight">
        <div className="shell">
          <SectionHeading
            eyebrow={pick(lang, 'Live search', 'بحث فوري')}
            title={tr('home.searchTitle')}
            sub={tr('home.searchSub')}
          />
          <div className="showcase">
            <LiveSearch mode="home" aria-label="بحث في المتجر" />
          </div>
        </div>
      </section>

      <section className="category-section" id="sections">
        <div className="shell">
          <SectionHeading
            eyebrow={pick(lang, HOME_COPY.categoriesKicker.en, HOME_COPY.categoriesKicker.ar)}
            title={tr('sections.title')}
            sub={tr('sections.sub')}
            action={{ href: '/offers', label: tr('common.viewAll') }}
          />
          <CategoryRail />
        </div>
      </section>

      <section className="section section--tight">
        <div className="shell">
          <SectionHeading
            eyebrow={pick(lang, HOME_COPY.featuredKicker.en, HOME_COPY.featuredKicker.ar)}
            title={tr('home.featuredTitle')}
            sub={tr('home.featuredSub')}
            action={{ href: '/offers', label: tr('common.viewAll') }}
          />
          <ProductGrid items={featured} showcase />
        </div>
      </section>

      <section className="section section--tight">
        <div className="shell">
          <div className="deals-shell">
            <div className="deals-head">
              <div className="deals-head__copy">
                <p className="eyebrow">{pick(lang, HOME_COPY.dealsKicker.en, HOME_COPY.dealsKicker.ar)}</p>
                <h2 className="section-title">{tr('home.dealsTitle')}</h2>
                <p className="section-sub">{tr('home.dealsSub')}</p>
                <DealsTimer variant="light" />
              </div>
              <Link href="/offers" className="deals-link">
                {tr('nav.offers')}
                <ArrowUpRight aria-hidden="true" />
              </Link>
            </div>
            <div className="deals-grid">
              {deals.map((product, index) => (
                <ProductCard key={product.code} product={product} priority={index === 0} />
              ))}
              {promoColumns > 0 && industrial ? (
                <Link
                  href="/outlet"
                  className={`editorial-card deals-promo${promoColumns === 1 ? ' deals-promo--single' : ''}`}
                >
                  <Image src="/assets/p5.webp" alt="" fill sizes="(max-width: 900px) 100vw, 40vw" quality={86} />
                  <span className="editorial-card__kicker">
                    {pick(lang, 'Outlet & clearance', 'أوت ليت وتصفيات')}
                  </span>
                  <h3>{pick(lang, HOME_COPY.outletExtra.en, HOME_COPY.outletExtra.ar)}</h3>
                  <p className="editorial-card__text">{pick(lang, HOME_COPY.outletText.en, HOME_COPY.outletText.ar)}</p>
                  <span className="editorial-card__link">
                    {pick(lang, HOME_COPY.outletCta.en, HOME_COPY.outletCta.ar)}
                    <ArrowUpRight aria-hidden="true" />
                  </span>
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <ProductSwiper
        title={pick(lang, HOME_COPY.trendingTitle.en, HOME_COPY.trendingTitle.ar)}
        sub={pick(lang, HOME_COPY.trendingSub.en, HOME_COPY.trendingSub.ar)}
        items={trending}
        action={{ href: '/search', label: tr('common.viewAll') }}
      />

      <section className="brand-section">
        <div className="shell">
          <SectionHeading
            eyebrow={pick(lang, HOME_COPY.brandsKicker.en, HOME_COPY.brandsKicker.ar)}
            title={tr('home.brandsTitle')}
            sub={tr('home.brandsSub')}
            center
          />
        </div>
        <div className="brand-marquee">
          <div className="brand-track">
            {BRANDS.map((brand) => (
              <span className="brand-chip" key={brand.name}>
                <Image src={brand.src} alt={brand.name} width={176} height={82} sizes="176px" loading="lazy" />
              </span>
            ))}
            {BRANDS.map((brand) => (
              <span className="brand-chip" key={`${brand.name}-repeat`} aria-hidden="true">
                <Image src={brand.src} alt="" width={176} height={82} sizes="176px" loading="lazy" />
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="promise-section">
        <div className="shell">
          <SectionHeading
            eyebrow={pick(lang, HOME_COPY.promiseKicker.en, HOME_COPY.promiseKicker.ar)}
            title={pick(lang, HOME_COPY.promiseTitle.en, HOME_COPY.promiseTitle.ar)}
            sub={pick(lang, HOME_COPY.promiseSub.en, HOME_COPY.promiseSub.ar)}
            center
          />
          <div className="promise-grid">
            {PROMISES.map((promise) => {
              const Icon = PROMISE_ICONS[promise.icon];
              return (
                <article className="promise-card" key={promise.id}>
                  <span className="promise-card__icon">
                    <Icon aria-hidden="true" />
                  </span>
                  <h3>{promise.title[lang]}</h3>
                  <p>{promise.text[lang]}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section section--tight">
        <div className="shell">
          <div className="story">
            <div className="story__media">
              <div className="story__media-main">
                <Image
                  src="/assets/p13.webp"
                  alt={pick(lang, 'The DeSinaHub store hub', 'منصة ديسينا هب')}
                  fill
                  sizes="(max-width: 900px) 100vw, 42vw"
                  quality={88}
                />
              </div>
              <div className="story__media-small">
                <Image src="/assets/p9.webp" alt="" fill sizes="(max-width: 900px) 45vw, 20vw" quality={85} />
              </div>
              <span className="story__badge">
                <BadgeCheck aria-hidden="true" />
                {pick(lang, HOME_COPY.storyAuthentic.en, HOME_COPY.storyAuthentic.ar)}
              </span>
            </div>
            <div className="story__copy">
              <p className="eyebrow eyebrow--light">{pick(lang, HOME_COPY.storyKicker.en, HOME_COPY.storyKicker.ar)}</p>
              <h2>{pick(lang, HOME_COPY.storyTitle.en, HOME_COPY.storyTitle.ar)}</h2>
              <p>{pick(lang, HOME_COPY.storyText.en, HOME_COPY.storyText.ar)}</p>
              <div className="story__stats">
                {stats.map((stat) => (
                  <div className="story__stat" key={stat.labelKey}>
                    <strong>{stat.value}</strong>
                    <span>{pick(lang, HOME_COPY[stat.labelKey].en, HOME_COPY[stat.labelKey].ar)}</span>
                  </div>
                ))}
              </div>
              <div>
                <Link href="/#sections" className="btn btn-light btn-sm">
                  {pick(lang, HOME_COPY.storyCta.en, HOME_COPY.storyCta.ar)}
                  <ArrowRight aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--tight">
        <div className="shell">
          <SectionHeading
            eyebrow={pick(lang, HOME_COPY.servicesKicker.en, HOME_COPY.servicesKicker.ar)}
            title={tr('home.servicesTitle')}
            sub={tr('home.servicesSub')}
          />
          <div className="editorial-grid">
            {[industrial, tourism].map((category) => {
              if (!category) return null;
              const cards = serviceCards(category.slug as 'industrial' | 'tourism');
              return (
                <Link key={category.slug} href={`/${category.slug}`} className="editorial-card">
                  <Image src={category.image} alt="" fill sizes="(max-width: 900px) 100vw, 55vw" quality={88} />
                  <span className="editorial-card__kicker">{category.short[lang]}</span>
                  <h3>{category.hero[lang]}</h3>
                  <p className="editorial-card__text">{cards[0]?.title[lang] ?? category.intro[lang]}</p>
                  <span className="editorial-card__link">
                    {tr('sections.view')}
                    <ArrowUpRight aria-hidden="true" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section section--tight">
        <div className="shell">
          <SectionHeading
            eyebrow={pick(lang, HOME_COPY.reviewsKicker.en, HOME_COPY.reviewsKicker.ar)}
            title={tr('home.reviewsTitle')}
            sub={tr('home.reviewsSub')}
            action={{ href: '/reviews', label: tr('reviews.submit') }}
          />
          <TestimonialsSwiper />
        </div>
      </section>

      <section className="newsletter">
        <div className="shell">
          <div className="newsletter__panel">
            <div className="newsletter__copy">
              <p className="eyebrow eyebrow--light">
                {pick(lang, HOME_COPY.newsletterKicker.en, HOME_COPY.newsletterKicker.ar)}
              </p>
              <h2>{pick(lang, HOME_COPY.newsletterTitle.en, HOME_COPY.newsletterTitle.ar)}</h2>
              <p>{pick(lang, HOME_COPY.newsletterText.en, HOME_COPY.newsletterText.ar)}</p>
            </div>
            <NewsletterForm />
          </div>
        </div>
      </section>

      <section className="section section--tight">
        <div className="shell">
          <div className="deals-shell">
            <div className="deals-head">
              <div className="deals-head__copy">
                <p className="eyebrow">{tr('home.ctaTitle')}</p>
                <h2 className="section-title">{tr('home.ctaBody')}</h2>
                <div className="hero__proof">
                  <Stars rating={5} label={pick(lang, 'Rated 4.8 out of 5', 'تقييم 4.8 من 5')} />
                  <span className="section-sub">{pick(lang, '1,200+ verified reviews', 'أكثر من 1200 تقييم موثق')}</span>
                </div>
              </div>
              <a
                href={`https://wa.me/${WHATSAPP}`}
                target="_blank"
                rel="noopener noreferrer"
                className="deals-link"
              >
                <MessageCircle aria-hidden="true" />
                {tr('home.ctaButton')}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
