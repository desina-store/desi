import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { BadgeCheck, RotateCcw, ShieldCheck, Truck, Zap } from "lucide-react";
import {
  discountPercent,
  getProductByCode,
  products,
  relatedProducts,
  type Product,
} from "@/data/products";
import { categories, categoryLabels } from "@/data/categories";
import { getServerLang } from "@/lib/i18n-server";
import { formatPrice, pick, translate, type Lang } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";
import { JsonLd } from "@/components/json-ld";
import { Breadcrumbs } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { Stars } from "@/components/ui/stars";
import { ProductCard } from "@/components/product-card";
import { ProductPurchase } from "@/components/product/product-purchase";

type Params = Promise<{ code: string }>;

const specLabels: Record<string, { en: string; ar: string }> = {
  brand: { en: "Brand", ar: "الماركة" },
  spec: { en: "Specification", ar: "المواصفات" },
  warranty: { en: "Warranty", ar: "الضمان" },
  fabric: { en: "Fabric", ar: "الخامة" },
  sizes: { en: "Sizes", ar: "المقاسات" },
  itemType: { en: "Item type", ar: "نوع المنتج" },
  type: { en: "Type", ar: "النوع" },
  duration: { en: "Duration", ar: "المدة" },
  dev: { en: "Developer", ar: "المطوّر" },
};

function labelFor(key: string, lang: Lang): string {
  const label = specLabels[key];
  if (label) return label[lang];
  return key.replace(/([A-Z])/g, " $1").replace(/^./, (char) => char.toUpperCase());
}

function productCategory(product: Product) {
  return (
    categories.find(
      (category) => category.kind === "products" && category.sourceCategories.includes(product.category),
    ) ?? categories[0]
  );
}

export function generateStaticParams() {
  return products.map((product) => ({ code: String(product.code) }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { code } = await params;
  const product = getProductByCode(code);
  const lang = await getServerLang();
  if (!product) {
    return { title: "Product not found", robots: { index: false, follow: false } };
  }

  const name = product.name[lang];
  const category = categoryLabels[product.category]?.[lang] ?? product.category;
  return {
    title: `${name} — CODE-${product.code}`,
    description: product.description[lang],
    alternates: {
      canonical: `/product/${product.code}`,
      languages: {
        "ar-EG": `/product/${product.code}`,
        "en-EG": `/product/${product.code}`,
      },
    },
    openGraph: {
      type: "website",
      url: `${SITE_URL}/product/${product.code}`,
      title: `${name} | DeSinaHub`,
      description: `${category} — ${product.description[lang]}`.slice(0, 200),
      images: [{ url: product.img, alt: name }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} | DeSinaHub`,
      description: `${category} — CODE-${product.code}`,
      images: [product.img],
    },
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  const { code } = await params;
  const product = getProductByCode(code);
  if (!product) notFound();
  if (String(product.code) !== code) permanentRedirect(`/product/${product.code}`);

  const lang = await getServerLang();
  const t = (key: string) => translate(lang, key);
  const name = product.name[lang];
  const brand = product.info.brand?.[lang];
  const category = productCategory(product);
  const categoryLabel = categoryLabels[product.category]?.[lang] ?? product.category;
  const discount = discountPercent(product);
  const isDigital = product.type === "digital";
  const related = relatedProducts(product, 4);
  const specs = Object.entries(product.info).filter(([, value]) => value?.[lang]);

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    image: [`${SITE_URL}${product.img}`],
    description: product.description[lang],
    sku: `CODE-${product.code}`,
    mpn: `CODE-${product.code}`,
    brand: {
      "@type": "Brand",
      name: brand ?? "DeSinaHub",
    },
    category: categoryLabel,
    url: `${SITE_URL}/product/${product.code}`,
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/product/${product.code}`,
      priceCurrency: "EGP",
      price: product.price,
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: "DeSinaHub",
      },
    },
  };

  return (
    <>
      <JsonLd data={productSchema} id={`product-jsonld-${product.code}`} />

      <section className="product-page">
        <div className="shell">
          <Breadcrumbs
            items={[
              { label: t("nav.shop"), href: "/shop" },
              { label: category.name[lang], href: `/category/${category.slug}` },
              { label: name },
            ]}
          />

          <div className="product-detail">
            <div className="product-gallery">
              <div className="product-gallery__main">
                <Image
                  src={product.img}
                  alt={name}
                  fill
                  priority
                  sizes="(max-width: 900px) 100vw, 50vw"
                  quality={92}
                  style={{ objectFit: "contain", padding: "clamp(18px, 4vw, 44px)" }}
                />
                <div className="product-gallery__topline">
                  <div className="product-gallery__badges">
                    {discount > 0 ? (
                      <span className="product-gallery__tag is-accent">-{discount}%</span>
                    ) : null}
                    {isDigital ? (
                      <span className="product-gallery__tag">
                        <Zap aria-hidden="true" />
                        {pick(lang, "Digital delivery", "تسليم رقمي")}
                      </span>
                    ) : null}
                    {brand ? <span className="product-gallery__tag">{brand}</span> : null}
                  </div>
                  <span className="product-gallery__tag">
                    <BadgeCheck aria-hidden="true" />
                    {pick(lang, "Authentic", "أصلي")}
                  </span>
                </div>
              </div>
              <div className="product-gallery__foot">
                <span className="gallery-note">
                  <ShieldCheck aria-hidden="true" />
                  {t("common.secure")}
                </span>
                <span className="gallery-note">
                  <Truck aria-hidden="true" />
                  {t("product.delivery")}
                </span>
                <span className="gallery-note">
                  <RotateCcw aria-hidden="true" />
                  {t("product.returns")}
                </span>
              </div>
            </div>

            <div className="product-info">
              <div className="product-info__kicker">
                <span>CODE-{product.code}</span>
                <Link href={`/category/${category.slug}`} className="chip">
                  {categoryLabel}
                </Link>
              </div>
              <h1>{name}</h1>

              <div className="product-rating">
                <Stars
                  rating={5}
                  label={pick(lang, "Rated 4.8 out of 5", "تقييم 4.8 من 5")}
                />
                <strong>4.8</strong>
                <Link href="/reviews" className="text-link">
                  {pick(lang, "128 reviews", "128 تقييماً")}
                </Link>
              </div>

              <div className="product-price-row">
                <span className="price">{formatPrice(product.price, lang)}</span>
                {product.oldPrice ? (
                  <span className="old-price">{formatPrice(product.oldPrice, lang)}</span>
                ) : null}
                {product.oldPrice && discount > 0 ? (
                  <span className="product-save">
                    {t("product.saved")} {formatPrice(product.oldPrice - product.price, lang)}
                  </span>
                ) : null}
              </div>

              <p className="product-description">{product.description[lang]}</p>

              <ProductPurchase product={product} />

              <div className="product-trust">
                <div className="product-trust__row">
                  <Truck aria-hidden="true" />
                  <div>
                    <strong>{t("product.delivery")}</strong>
                    <span>{t("product.deliveryText")}</span>
                  </div>
                </div>
                <div className="product-trust__row">
                  <RotateCcw aria-hidden="true" />
                  <div>
                    <strong>{t("product.returns")}</strong>
                    <span>{t("product.returnsText")}</span>
                  </div>
                </div>
                <div className="product-trust__row">
                  <ShieldCheck aria-hidden="true" />
                  <div>
                    <strong>{t("product.warranty")}</strong>
                    <span>{t("product.warrantyText")}</span>
                  </div>
                </div>
              </div>

              <div className="product-panels">
                <details className="product-panel" open>
                  <summary>{t("product.details")}</summary>
                  <div className="product-panel__body">
                    <p>{product.description[lang]}</p>
                  </div>
                </details>
                <details className="product-panel">
                  <summary>{pick(lang, "Specifications", "المواصفات")}</summary>
                  <div className="product-panel__body">
                    <dl className="spec-list">
                      {specs.map(([key, value]) => (
                        <div className="spec-list__row" key={key}>
                          <dt>{labelFor(key, lang)}</dt>
                          <dd>{value[lang]}</dd>
                        </div>
                      ))}
                      <div className="spec-list__row">
                        <dt>{t("product.code")}</dt>
                        <dd>CODE-{product.code}</dd>
                      </div>
                      <div className="spec-list__row">
                        <dt>{t("product.availability")}</dt>
                        <dd>{t("product.inStock")}</dd>
                      </div>
                    </dl>
                  </div>
                </details>
                <details className="product-panel">
                  <summary>{pick(lang, "Delivery & returns", "الشحن والاسترجاع")}</summary>
                  <div className="product-panel__body">
                    <p>{t("product.deliveryText")}</p>
                    <p>{t("product.returnsText")}</p>
                    <p>{t("product.secure")}</p>
                  </div>
                </details>
              </div>
            </div>
          </div>

          <div className="related-space">
            <SectionHeading
              kicker={pick(lang, "Keep exploring", "تابع الاستكشاف")}
              title={t("product.related")}
              href={`/category/${category.slug}`}
              actionLabel={t("common.viewAll")}
            />
            <div className="product-grid">
              {related.map((item) => (
                <ProductCard key={item.code} product={item} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
