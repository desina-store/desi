import type { Metadata } from "next";
import Link from "next/link";
import { Compass, Home, Search } from "lucide-react";
import { getServerLang } from "@/lib/i18n-server";
import { pick, translate } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default async function NotFound() {
  const lang = await getServerLang();
  const t = (key: string) => translate(lang, key);

  return (
    <div className="status-page">
      <span className="status-page__mark">
        <Compass aria-hidden="true" />
      </span>
      <span className="status-code">404 · {pick(lang, "Off the map", "خارج الخريطة")}</span>
      <h1>{t("notFound.title")}</h1>
      <p>{t("notFound.sub")}</p>
      <div className="status-page__actions">
        <Link href="/" className="btn btn-primary">
          <Home aria-hidden="true" />
          {t("notFound.cta")}
        </Link>
        <Link href="/shop" className="btn btn-outline">
          <Search aria-hidden="true" />
          {t("nav.shop")}
        </Link>
      </div>
    </div>
  );
}
