import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { getServerLang } from "@/lib/i18n-server";
import { pick, translate } from "@/lib/i18n";
import { SOCIAL_LINKS, STORE } from "@/lib/site";
import { PageHero } from "@/components/page-hero";
import { SupportForm } from "@/components/support/support-form";

export const metadata: Metadata = {
  title: "Support hub — we are here before and after your order",
  description:
    "Contact DeSinaHub support by phone, WhatsApp or email. Help with product questions, orders, delivery, returns and business supply across Egypt.",
  alternates: {
    canonical: "/support",
    languages: {
      "ar-EG": "/support",
      "en-EG": "/support",
    },
  },
};

export default async function SupportPage() {
  const lang = await getServerLang();
  const t = (key: string) => translate(lang, key);
  const primaryPhone = STORE.phones[0].replace(/\s/g, "");

  return (
    <div className="support-page">
      <PageHero
        kicker={pick(lang, "DeSinaHub care", "عناية ديسينا هب")}
        title={t("support.title")}
        subtitle={t("support.subtitle")}
        image="/products/p10.webp"
        imageAlt={pick(lang, "DeSinaHub customer support", "دعم عملاء ديسينا هب")}
        crumbs={[{ label: t("nav.support") }]}
      />

      <div className="shell">
        <div className="support-contact-grid">
          <a href={`tel:${primaryPhone}`} className="support-tile">
            <span className="support-tile__icon">
              <Phone aria-hidden="true" />
            </span>
            <span>{pick(lang, "Fastest response", "أسرع استجابة")}</span>
            <h2>{t("support.call")}</h2>
            <p dir="ltr">{STORE.phones[0]}</p>
            <span className="support-tile__link">
              {pick(lang, "Call now", "اتصل الآن")}
              <ArrowUpRight aria-hidden="true" />
            </span>
          </a>

          <a
            href={SOCIAL_LINKS.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="support-tile"
          >
            <span className="support-tile__icon">
              <MessageCircle aria-hidden="true" />
            </span>
            <span>{pick(lang, "Chat with a human", "تحدث مع شخص")}</span>
            <h2>{t("support.whatsapp")}</h2>
            <p dir="ltr">+{STORE.whatsapp}</p>
            <span className="support-tile__link">
              {pick(lang, "Open WhatsApp", "افتح واتساب")}
              <ArrowUpRight aria-hidden="true" />
            </span>
          </a>

          <a href={`mailto:${STORE.email}`} className="support-tile">
            <span className="support-tile__icon">
              <Mail aria-hidden="true" />
            </span>
            <span>{pick(lang, "Detailed enquiries", "استفسارات مفصلة")}</span>
            <h2>{t("support.email")}</h2>
            <p dir="ltr">{STORE.email}</p>
            <span className="support-tile__link">
              {pick(lang, "Send an email", "أرسل بريداً")}
              <ArrowUpRight aria-hidden="true" />
            </span>
          </a>
        </div>

        <div className="support-layout">
          <div className="support-form-card">
            <h2>{t("support.form")}</h2>
            <p>{pick(lang, "Tell us what you need and we will reply as soon as possible.", "أخبرنا بما تحتاجه وسنرد عليك في أقرب وقت.")}</p>
            <SupportForm />
          </div>

          <aside className="support-side">
            <div className="support-hours">
              <h3>{pick(lang, "Opening hours", "ساعات العمل")}</h3>
              <p>
                <Clock aria-hidden="true" style={{ width: 13, height: 13, display: "inline", marginInlineEnd: 6 }} />
                {t("support.hours")}
              </p>
              <a
                href={STORE.mapUrl}
                className="support-map"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MapPin aria-hidden="true" />
                {t("footer.address")}
              </a>
            </div>

            <div className="support-side-note">
              <strong>{t("orders.help")}</strong>
              {t("orders.helpText")}
              <div style={{ marginTop: 12 }}>
                <Link href="/orders" className="btn btn-outline btn-sm">
                  {t("orders.find")}
                </Link>
              </div>
            </div>

            <div className="support-side-note">
              <strong>{t("support.faq")}</strong>
              {pick(lang, "Quick answers on delivery, payments, returns and warranty.", "إجابات سريعة عن التوصيل والدفع والاسترجاع والضمان.")}
              <div style={{ marginTop: 12 }}>
                <Link href="/faq" className="btn btn-outline btn-sm">
                  {t("nav.faq")}
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
