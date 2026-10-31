import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowDown, BadgeCheck, Mail, MessageCircle, ShieldCheck, Truck } from "lucide-react";
import {
  categories,
  getCategory,
  getOtherServiceSlug,
  serviceOfferings,
  serviceProcess,
  type CategoryDefinition,
} from "@/data/categories";
import { productsInCategories } from "@/data/products";
import { getServerLang } from "@/lib/i18n-server";
import { pick, translate, type Lang } from "@/lib/i18n";
import { SITE_URL, SOCIAL_LINKS, STORE } from "@/lib/site";
import { Breadcrumbs } from "@/components/page-hero";
import { JsonLd } from "@/components/json-ld";
import { SectionHeading } from "@/components/section-heading";
import { CategoryExplorer } from "@/components/catalog/category-explorer";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

function categoryDescription(category: CategoryDefinition, lang: Lang): string {
  return category.description[lang];
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);
  const lang = await getServerLang();
  if (!category) {
    return { title: "Category not found", robots: { index: false, follow: false } };
  }

  return {
    title: `${category.name[lang]} — ${category.tagline[lang]}`,
    description: categoryDescription(category, lang),
    alternates: {
      canonical: `/category/${category.slug}`,
      languages: {
        "ar-EG": `/category/${category.slug}`,
        "en-EG": `/category/${category.slug}`,
      },
    },
    openGraph: {
      type: "website",
      url: `${SITE_URL}/category/${category.slug}`,
      title: category.name[lang],
      description: category.description[lang],
      images: [{ url: category.image, alt: category.name[lang] }],
    },
    twitter: {
      card: "summary_large_image",
      title: category.name[lang],
      description: category.description[lang],
      images: [category.image],
    },
  };
}

export default async function CategoryPage({ params }: { params: Params }) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  const lang = await getServerLang();
  const t = (key: string) => translate(lang, key);
  const isService = category.kind === "service";
  const categoryProducts = isService ? [] : productsInCategories(category.sourceCategories);
  const offerings = isService
    ? serviceOfferings[category.slug as "industrial" | "tourism"]
    : [];
  const itemCount = isService ? offerings.length : categoryProducts.length;
  const deskEmail = category.slug === "industrial" ? STORE.salesEmail : STORE.email;
  const otherServiceSlug = isService ? getOtherServiceSlug(category.slug) : null;
  const otherService = otherServiceSlug ? getCategory(otherServiceSlug) : undefined;
  const steps = isService
    ? serviceProcess[category.slug as "industrial" | "tourism"]
    : [];

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: t("nav.shop"),
        item: `${SITE_URL}/shop`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: category.name[lang],
        item: `${SITE_URL}/category/${category.slug}`,
      },
    ],
  };

  const serviceSchema = isService
    ? {
        "@context": "https://schema.org",
        "@type": "Service",
        "@id": `${SITE_URL}/category/${category.slug}#service`,
        name: category.name.en,
        description: category.description.en,
        serviceType: category.name.en,
        url: `${SITE_URL}/category/${category.slug}`,
        areaServed: { "@type": "Country", name: "Egypt" },
        provider: {
          "@id": "https://www.desinahub.com/#store",
          "@type": "OnlineStore",
          name: STORE.name,
          url: "https://www.desinahub.com/",
        },
      }
    : null;

  return (
    <>
      <JsonLd data={breadcrumbSchema} id={`breadcrumb-jsonld-${category.slug}`} />
      {serviceSchema ? (
        <JsonLd data={serviceSchema} id={`service-jsonld-${category.slug}`} />
      ) : null}
      <section className="category-hero">
        <div className="shell">
          <Breadcrumbs
            items={[
              { label: t("nav.shop"), href: "/shop" },
              { label: category.name[lang] },
            ]}
          />
          <div
            className="category-hero__panel"
            style={{ "--tone": category.tone } as CSSProperties}
          >
            <div className="category-hero__copy">
              <p className="eyebrow">
                {isService
                  ? pick(lang, "DeSinaHub service desk", "مكتب خدمات ديسينا هب")
                  : pick(lang, "Department", "قسم")}
              </p>
              <h1>{category.name[lang]}</h1>
              <p>{category.description[lang]}</p>
              <div className="category-hero__meta">
                <span className="chip">
                  {itemCount} {isService ? t("nav.services") : itemCount === 1 ? t("common.item") : t("common.items")}
                </span>
                <span className="chip">
                  <ShieldCheck aria-hidden="true" style={{ width: 14, height: 14 }} />
                  {t("announcement.secure")}
                </span>
                <span className="chip">
                  <Truck aria-hidden="true" style={{ width: 14, height: 14 }} />
                  {t("announcement.shipping")}
                </span>
              </div>
              <div className="category-hero__actions">
                {isService ? (
                  <>
                    <a
                      href={SOCIAL_LINKS.whatsapp}
                      className="btn btn-primary"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle aria-hidden="true" />
                      {t("support.whatsapp")}
                    </a>
                    <a href={`mailto:${deskEmail}`} className="btn btn-outline">
                      <Mail aria-hidden="true" />
                      {t("support.email")}
                    </a>
                  </>
                ) : (
                  <>
                    <Link href="#catalogue" className="btn btn-primary">
                      <ArrowDown aria-hidden="true" />
                      {pick(lang, "Browse the collection", "تصفح المجموعة")}
                    </Link>
                    <Link href="/shop" className="btn btn-outline">
                      {t("nav.allProducts")}
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="category-hero__media">
              <Image
                src={category.image}
                alt={category.name[lang]}
                fill
                priority
                sizes="(max-width: 900px) 100vw, 42vw"
                quality={90}
              />
              <span className="category-hero__badge">
                <BadgeCheck aria-hidden="true" />
                {isService
                  ? pick(lang, "Tailored to your brief", "مصمّم حسب طلبك")
                  : pick(lang, "Authentic products only", "منتجات أصلية فقط")}
              </span>
            </div>
          </div>
        </div>
      </section>

      {isService ? (
        <>
          <section className="section section--tight" id="services">
            <div className="shell">
              <SectionHeading
                kicker={category.shortName[lang]}
                title={pick(lang, "What our desk handles", "ما يقدمه مكتبنا")}
                subtitle={category.tagline[lang]}
                href={otherServiceSlug ? `/category/${otherServiceSlug}` : undefined}
                actionLabel={
                  otherService
                    ? pick(
                        lang,
                        `See ${otherService.shortName.en}`,
                        `شاهد ${otherService.shortName.ar}`,
                      )
                    : undefined
                }
              />
              <div className="service-grid">
                {offerings.map((offering, index) => (
                  <article className="service-card" key={offering.title.en}>
                    <span className="service-card__index">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3>{offering.title[lang]}</h3>
                    <p>{offering.text[lang]}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="section section--tight" id="how-it-works">
            <div className="shell">
              <SectionHeading
                kicker={pick(lang, "How it works", "كيف تبدأ")}
                title={pick(lang, "Three clear steps", "ثلاث خطوات واضحة")}
                subtitle={category.description[lang]}
              />
              <div className="service-grid">
                {steps.map((step, index) => (
                  <article className="service-card" key={step.title.en}>
                    <span className="service-card__index">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3>{step.title[lang]}</h3>
                    <p>{step.text[lang]}</p>
                  </article>
                ))}
              </div>
              <div className="service-cta">
                <div>
                  <h3>
                    {category.slug === "industrial"
                      ? pick(lang, "Let us quote your next supply run.", "دعنا نُسعّر توريدك القادم.")
                      : pick(lang, "Tell us the trip. We will handle the rest.", "أخبرنا بالرحلة. ونتولى الباقي.")}
                  </h3>
                  <p>
                    {pick(
                      lang,
                      "Share your requirements on WhatsApp or email and a specialist will reply with options, timing and transparent pricing.",
                      "شاركنا متطلباتك على واتساب أو البريد وسيرد عليك مختص بالخيارات والمواعيد والأسعار بوضوح.",
                    )}
                  </p>
                </div>
                <div className="service-cta__actions">
                  <a
                    href={SOCIAL_LINKS.whatsapp}
                    className="btn btn-primary"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle aria-hidden="true" />
                    {t("support.whatsapp")}
                  </a>
                  <a href={`mailto:${deskEmail}`} className="btn btn-light">
                    <Mail aria-hidden="true" />
                    {deskEmail}
                  </a>
                </div>
              </div>
            </div>
          </section>
        </>
      ) : (
        <section className="section section--tight" id="catalogue">
          <div className="shell">
            <SectionHeading
              kicker={category.shortName[lang]}
              title={pick(lang, "Browse the collection", "تصفح المجموعة")}
              subtitle={category.tagline[lang]}
            />
            <CategoryExplorer products={categoryProducts} />
          </div>
        </section>
      )}
    </>
  );
}
