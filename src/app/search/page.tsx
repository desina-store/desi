import type { Metadata } from "next";
import { Suspense } from "react";
import { getServerLang } from "@/lib/i18n-server";
import { translate } from "@/lib/i18n";
import { SearchClient } from "@/components/search/search-client";

export const metadata: Metadata = {
  title: "Search the DeSinaHub store",
  description:
    "Search DeSinaHub by product name, brand or product code to find mobiles, computers, appliances, fashion, sportswear, outlet deals and digital licences.",
  alternates: {
    canonical: "/search",
    languages: {
      "ar-EG": "/search",
      "en-EG": "/search",
    },
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function SearchPage() {
  const lang = await getServerLang();
  const t = (key: string) => translate(lang, key);

  return (
    <section className="search-page">
      <div className="shell">
        <div className="search-page__head">
          <p className="eyebrow eyebrow--plain">{t("nav.search")}</p>
          <h1>{t("search.title")}</h1>
          <p>{t("search.subtitle")}</p>
        </div>
        <Suspense
          fallback={
            <p className="muted" role="status">
              {t("common.loading")}
            </p>
          }
        >
          <SearchClient />
        </Suspense>
      </div>
    </section>
  );
}
