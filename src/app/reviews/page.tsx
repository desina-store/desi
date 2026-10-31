import type { Metadata } from "next";
import { getServerLang } from "@/lib/i18n-server";
import { pick, translate } from "@/lib/i18n";
import { PageHero } from "@/components/page-hero";
import { ReviewsClient } from "@/components/reviews/reviews-client";

export const metadata: Metadata = {
  title: "Customer reviews — real DeSinaHub shoppers",
  description:
    "Read honest reviews from DeSinaHub customers across Egypt and share your own experience with our products, delivery and support.",
  alternates: {
    canonical: "/reviews",
    languages: {
      "ar-EG": "/reviews",
      "en-EG": "/reviews",
    },
  },
};

export default async function ReviewsPage() {
  const lang = await getServerLang();
  const t = (key: string) => translate(lang, key);

  return (
    <>
      <PageHero
        kicker={t("home.reviews.kicker")}
        title={t("reviewsPage.title")}
        subtitle={t("reviewsPage.subtitle")}
        image="/products/p8.webp"
        imageAlt={pick(lang, "DeSinaHub customer favourites", "مفضلات عملاء ديسينا هب")}
        crumbs={[{ label: t("nav.reviews") }]}
      >
        <div className="category-hero__meta">
          <span className="chip">4.8 / 5</span>
          <span className="chip">
            {pick(lang, "1,200+ happy customers", "أكثر من 1200 عميل سعيد")}
          </span>
        </div>
      </PageHero>

      <section className="section section--flush-top">
        <div className="shell">
          <ReviewsClient />
        </div>
      </section>
    </>
  );
}
