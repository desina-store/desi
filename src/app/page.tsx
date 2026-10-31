import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Headphones,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Tag,
  Truck,
} from "lucide-react";
import homeSchema from "@/data/home-schema.json";
import { editorialCards, promises, storyContent } from "@/data/home-content";
import { dealProducts, featuredProducts, newArrivals } from "@/data/products";
import { getServerLang } from "@/lib/i18n-server";
import { pick, translate } from "@/lib/i18n";
import { JsonLd } from "@/components/json-ld";
import { ProductCard } from "@/components/product-card";
import { SectionHeading } from "@/components/section-heading";
import { Stars } from "@/components/ui/stars";
import { HeroSlider } from "@/components/home/hero-slider";
import { CategorySwiper } from "@/components/home/category-swiper";
import { DealsTimer } from "@/components/home/deals-timer";
import { TestimonialsSwiper } from "@/components/home/testimonials-swiper";
import { NewsletterForm } from "@/components/home/newsletter-form";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

const brands = [
  { name: "Samsung", src: "/brands/brand-01.png" },
  { name: "DeFacto", src: "/brands/brand-02.png" },
  { name: "Apple", src: "/brands/brand-03.png" },
  { name: "essence", src: "/brands/brand-04.png" },
  { name: "Xiaomi", src: "/brands/brand-05.png" },
  { name: "Casio", src: "/brands/brand-06.png" },
];

const promiseIcons = {
  truck: Truck,
  shield: ShieldCheck,
  returns: RotateCcw,
  headset: Headphones,
} as const;

export default async function HomePage() {
  const lang = await getServerLang();
  const t = (key: string) => translate(lang, key);
  const featured = featuredProducts(8);
  const deals = dealProducts(4);
  const arrivals = newArrivals(4);
  const promoColumns = deals.length < 4 ? 4 - deals.length : 0;

  return (
    <>
      <JsonLd data={homeSchema} id="home-jsonld" />

      <section className="hero">
        <div className="shell">
          <div className="hero__grid">
            <div className="hero__copy">
              <p className="eyebrow">
                {pick(lang, "DeSinaHub · The everything store", "ديسينا هب · متجر كل شيء")}
              </p>
              <h1 className="hero__title">
                {lang === "ar" ? (
                  <>
                    متجر واحد.
                    <br />
                    <em>كل شيء.</em>
                  </>
                ) : (
                  <>
                    One store.
                    <br />
                    <em>Everything.</em>
                  </>
                )}
              </h1>
              <p className="hero__lead">
                {pick(
                  lang,
                  "Mobiles, computers, home appliances, outlet finds, sportswear and fashion — plus industrial and tourism desks. Genuine products, transparent prices and secure checkout.",
                  "موبايلات، كمبيوتر، أجهزة منزلية، أوت ليت، ملابس رياضية وأزياء — بالإضافة إلى مكتبي الخدمات الصناعية والسياحية. منتجات أصلية وأسعار واضحة ودفع آمن.",
                )}
              </p>
              <div className="hero__actions">
                <Link href="/shop" className="btn btn-primary">
                  <ShoppingBag aria-hidden="true" />
                  {t("nav.allProducts")}
                </Link>
                <Link href="/offers" className="btn btn-outline">
                  <Tag aria-hidden="true" />
                  {t("nav.offers")}
                </Link>
              </div>
              <div className="hero__proof">
                <div className="avatar-stack" aria-hidden="true">
                  <span>MK</span>
                  <span>SA</span>
                  <span>NH</span>
                  <span>YA</span>
                </div>
                <div className="hero__proof-copy">
                  <strong>
                    <Stars rating={5} label={pick(lang, "Rated 4.8 out of 5", "تقييم 4.8 من 5")} />
                    <span>4.8 / 5</span>
                  </strong>
                  <span>
                    {pick(
                      lang,
                      "Loved by 1,200+ shoppers across Egypt",
                      "أكثر من 1200 عميل في كل أنحاء مصر",
                    )}
                  </span>
                </div>
              </div>
            </div>

            <HeroSlider />
          </div>
        </div>
      </section>

      <section className="category-section" id="categories">
        <div className="shell">
          <SectionHeading
            kicker={t("home.categories.kicker")}
            title={t("home.categories.title")}
            subtitle={t("home.categories.sub")}
            href="/shop"
            actionLabel={t("common.viewAll")}
          />
          <CategorySwiper />
        </div>
      </section>

      <section className="section section--tight">
        <div className="shell">
          <SectionHeading
            kicker={t("home.featured.kicker")}
            title={t("home.featured.title")}
            subtitle={t("home.featured.sub")}
            href="/shop"
            actionLabel={t("common.viewAll")}
          />
          <div className="showcase">
            <div className="product-grid">
              {featured.map((product, index) => (
                <ProductCard key={product.code} product={product} priority={index < 2} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section section--tight">
        <div className="shell">
          <div className="editorial-grid">
            {editorialCards.map((card) => (
              <Link
                key={card.id}
                href={card.href}
                className={`editorial-card ${card.light ? "editorial-card--light" : ""}`}
              >
                <Image
                  src={card.image}
                  alt=""
                  fill
                  sizes="(max-width: 900px) 100vw, 55vw"
                  quality={88}
                />
                <span className="editorial-card__kicker">{card.kicker[lang]}</span>
                <h3>{card.title[lang]}</h3>
                <p className="editorial-card__text">{card.text[lang]}</p>
                <span className="editorial-card__link">
                  {card.cta[lang]}
                  <ArrowUpRight aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--tight">
        <div className="shell">
          <div className="deals-shell">
            <div className="deals-head">
              <div className="deals-head__copy">
                <p className="eyebrow">{t("home.deals.kicker")}</p>
                <h2 className="section-title">{t("home.deals.title")}</h2>
                <p className="section-sub">{t("home.deals.sub")}</p>
                <DealsTimer />
              </div>
              <Link href="/offers" className="deals-link">
                {t("nav.offers")}
                <ArrowUpRight aria-hidden="true" />
              </Link>
            </div>
            <div className="deals-grid">
              {deals.map((product, index) => (
                <ProductCard key={product.code} product={product} priority={index === 0} />
              ))}
              {promoColumns > 0 ? (
                <Link
                  href="/category/outlet"
                  className={`editorial-card deals-promo ${
                    promoColumns === 1 ? "deals-promo--single" : ""
                  }`}
                >
                  <Image
                    src="/products/p5.webp"
                    alt=""
                    fill
                    sizes="(max-width: 900px) 100vw, 40vw"
                    quality={86}
                  />
                  <span className="editorial-card__kicker">
                    {pick(lang, "Outlet & clearance", "أوت ليت وتصفيات")}
                  </span>
                  <h3>
                    {pick(lang, "Extra markdowns, while stock lasts.", "تخفيضات إضافية حتى نفاد الكمية.")}
                  </h3>
                  <p className="editorial-card__text">
                    {pick(
                      lang,
                      "Last-season favourites at their lowest price of the season.",
                      "مفضلات المواسم السابقة بأقل سعر لها هذا الموسم.",
                    )}
                  </p>
                  <span className="editorial-card__link">
                    {pick(lang, "Shop outlet", "تسوّق الأوت ليت")}
                    <ArrowUpRight aria-hidden="true" />
                  </span>
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="section section--tight">
        <div className="shell">
          <SectionHeading
            kicker={t("home.arrivals.kicker")}
            title={t("home.arrivals.title")}
            subtitle={t("home.arrivals.sub")}
            href="/shop"
            actionLabel={t("common.viewAll")}
          />
          <div className="product-grid">
            {arrivals.map((product) => (
              <ProductCard key={product.code} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="brand-section">
        <div className="shell">
          <SectionHeading
            kicker={t("home.brands.kicker")}
            title={t("home.brands.title")}
            subtitle={t("home.brands.sub")}
            align="center"
          />
        </div>
        <div className="brand-marquee">
          <div className="brand-track">
            {brands.map((brand) => (
              <span className="brand-chip" key={brand.name}>
                <Image
                  src={brand.src}
                  alt={brand.name}
                  width={176}
                  height={82}
                  sizes="176px"
                  loading="lazy"
                />
              </span>
            ))}
            {brands.map((brand) => (
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
            kicker={pick(lang, "Our promise", "وعدنا")}
            title={t("home.promise.title")}
            subtitle={t("home.promise.sub")}
            align="center"
          />
          <div className="promise-grid">
            {promises.map((promise) => {
              const Icon = promiseIcons[promise.icon];
              return (
                <article className="promise-card" key={promise.id}>
                  <span className="promise-card__icon">
                    <Icon aria-hidden="true" />
                  </span>
                  <h3>{t(promise.titleKey)}</h3>
                  <p>{t(promise.textKey)}</p>
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
                  src={storyContent.images.main}
                  alt={pick(lang, "The DeSinaHub lifestyle collection", "مجموعة ديسينا هب")}
                  fill
                  sizes="(max-width: 900px) 100vw, 42vw"
                  quality={88}
                />
              </div>
              <div className="story__media-small">
                <Image
                  src={storyContent.images.small}
                  alt=""
                  fill
                  sizes="(max-width: 900px) 45vw, 20vw"
                  quality={85}
                />
              </div>
              <span className="story__badge">
                <BadgeCheck aria-hidden="true" />
                {pick(lang, "Authentic, always", "أصالة دائمة")}
              </span>
            </div>
            <div className="story__copy">
              <p className="eyebrow eyebrow--light">{t("home.story.kicker")}</p>
              <h2>{t("home.story.title")}</h2>
              <p>{t("home.story.text")}</p>
              <div className="story__stats">
                {storyContent.stats.map((stat) => (
                  <div className="story__stat" key={stat.labelKey}>
                    <strong>{stat.value}</strong>
                    <span>{t(stat.labelKey)}</span>
                  </div>
                ))}
              </div>
              <div>
                <Link href="/shop" className="btn btn-light btn-sm">
                  {t("home.story.cta")}
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
            kicker={t("home.reviews.kicker")}
            title={t("home.reviews.title")}
            subtitle={t("home.reviews.sub")}
            href="/reviews"
            actionLabel={t("home.reviews.cta")}
          />
          <TestimonialsSwiper />
        </div>
      </section>

      <section className="newsletter">
        <div className="shell">
          <div className="newsletter__panel">
            <div className="newsletter__copy">
              <p className="eyebrow eyebrow--light">
                {pick(lang, "Stay in the loop", "ابقَ على اطلاع")}
              </p>
              <h2>{t("home.newsletter.title")}</h2>
              <p>{t("home.newsletter.text")}</p>
            </div>
            <NewsletterForm />
          </div>
        </div>
      </section>
    </>
  );
}
