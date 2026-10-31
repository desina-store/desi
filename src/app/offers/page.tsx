import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, RotateCcw, ShieldCheck, Tag, Truck } from "lucide-react";
import {
  dealProducts,
  discountPercent,
  featuredProducts,
  products,
} from "@/data/products";
import { getServerLang } from "@/lib/i18n-server";
import { pick, translate } from "@/lib/i18n";
import { Breadcrumbs } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { ProductCard } from "@/components/product-card";
import { DealsTimer } from "@/components/home/deals-timer";

export const metadata: Metadata = {
  title: "Offers & outlet — genuine markdowns at DeSinaHub",
  description:
    "Shop live DeSinaHub offers and outlet markdowns on authentic products. Limited stock, transparent prices, fast free delivery across Egypt.",
  alternates: {
    canonical: "/offers",
    languages: {
      "ar-EG": "/offers",
      "en-EG": "/offers",
    },
  },
};

export default async function OffersPage() {
  const lang = await getServerLang();
  const t = (key: string) => translate(lang, key);
  const deals = dealProducts(4);
  const popular = featuredProducts(4);
  const bestDiscount = deals.reduce((best, product) => Math.max(best, discountPercent(product)), 0);
  const outletSize = products.filter((product) => product.categories.includes("Outlet")).length;

  return (
    <>
      <div className="shell">
        <Breadcrumbs items={[{ label: t("nav.offers") }]} />
        <div className="offers-banner">
          <div className="offers-banner__copy">
            <p className="eyebrow eyebrow--light">{pick(lang, "Limited-time pricing", "أسعار لفترة محدودة")}</p>
            <h1>
              {lang === "ar" ? (
                <>
                  أفضل القطع، <em>بأسعار أقل.</em>
                </>
              ) : (
                <>
                  The good stuff, <em>marked down.</em>
                </>
              )}
            </h1>
            <p>{t("offers.subtitle")}</p>
            <div className="hero__actions">
              <Link href="#live-deals" className="btn btn-primary">
                <Tag aria-hidden="true" />
                {pick(lang, "Shop live deals", "تسوّق العروض الحالية")}
              </Link>
              <Link href="/category/outlet" className="btn btn-light">
                {pick(lang, "Visit the outlet", "زور الأوت ليت")}
              </Link>
            </div>
            <div className="offers-banner__stats">
              <div className="offers-stat">
                <strong>{deals.length}</strong>
                <span>{pick(lang, "Live offers", "عرض متاح")}</span>
              </div>
              <div className="offers-stat">
                <strong>{bestDiscount}%</strong>
                <span>{pick(lang, "Top markdown", "أعلى خصم")}</span>
              </div>
              <div className="offers-stat">
                <strong>{outletSize}</strong>
                <span>{pick(lang, "Outlet pieces", "قطعة أوت ليت")}</span>
              </div>
            </div>
          </div>
          <div className="offers-banner__art">
            <Image
              src="/products/p5.webp"
              alt=""
              fill
              priority
              sizes="(max-width: 900px) 55vw, 30vw"
              quality={88}
            />
          </div>
        </div>

        <div className="offers-strip">
          <div className="offers-strip__cell">
            <Truck aria-hidden="true" />
            {t("cart.freeShipping")}
          </div>
          <div className="offers-strip__cell">
            <ShieldCheck aria-hidden="true" />
            {t("announcement.secure")}
          </div>
          <div className="offers-strip__cell">
            <RotateCcw aria-hidden="true" />
            {t("home.promise.returns.title")}
          </div>
        </div>
      </div>

      <section className="section section--tight" id="live-deals">
        <div className="shell">
          <SectionHeading
            kicker={t("home.deals.kicker")}
            title={t("offers.title")}
            subtitle={t("home.deals.sub")}
            href="/category/outlet"
            actionLabel={pick(lang, "All outlet pieces", "كل قطع الأوت ليت")}
          />
          <div style={{ marginBottom: 18 }}>
            <DealsTimer variant="light" />
          </div>
          {deals.length ? (
            <div className="deals-grid">
              {deals.map((product) => (
                <ProductCard key={product.code} product={product} />
              ))}
              <Link href="/category/outlet" className="editorial-card deals-promo">
                <Image
                  src="/products/p55.webp"
                  alt=""
                  fill
                  sizes="(max-width: 900px) 100vw, 44vw"
                  quality={86}
                />
                <span className="editorial-card__kicker">
                  {pick(lang, "Outlet & clearance", "أوت ليت وتصفيات")}
                </span>
                <h3>{pick(lang, "More pieces. Lower prices.", "قطع أكثر. أسعار أقل.")}</h3>
                <p className="editorial-card__text">
                  {pick(
                    lang,
                    "Explore end-of-season favourites before the last sizes disappear.",
                    "اكتشف مفضلات آخر الموسم قبل نفاد المقاسات الأخيرة.",
                  )}
                </p>
                <span className="editorial-card__link">
                  {pick(lang, "Shop outlet", "تسوّق الأوت ليت")}
                  <ArrowUpRight aria-hidden="true" />
                </span>
              </Link>
            </div>
          ) : (
            <div className="empty-state">
              <span className="empty-state__icon">
                <Tag aria-hidden="true" />
              </span>
              <h3>{t("offers.empty")}</h3>
              <Link href="/shop" className="btn btn-dark btn-sm">
                {t("nav.allProducts")}
              </Link>
            </div>
          )}
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
          <div className="product-grid">
            {popular.map((product) => (
              <ProductCard key={product.code} product={product} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
