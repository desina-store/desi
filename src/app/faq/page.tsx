import type { Metadata } from "next";
import Link from "next/link";
import { HelpCircle, MessageCircle } from "lucide-react";
import { faqs } from "@/data/faq";
import { getServerLang } from "@/lib/i18n-server";
import { pick, translate } from "@/lib/i18n";
import { SITE_URL, SOCIAL_LINKS } from "@/lib/site";
import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = {
  title: "FAQs — delivery, payments, returns and warranty",
  description:
    "Answers to the most common DeSinaHub questions: delivery times across Egypt, payment methods, returns, order tracking, product authenticity and business orders.",
  alternates: {
    canonical: "/faq",
    languages: {
      "ar-EG": "/faq",
      "en-EG": "/faq",
    },
  },
};

export default async function FaqPage() {
  const lang = await getServerLang();
  const t = (key: string) => translate(lang, key);
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE_URL}/faq#faq`,
    url: `${SITE_URL}/faq`,
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.question[lang],
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer[lang],
      },
    })),
  };

  return (
    <>
      <JsonLd data={faqSchema} id="faq-jsonld" />
      <PageHero
        kicker={pick(lang, "Help centre", "مركز المساعدة")}
        title={t("support.faq")}
        subtitle={pick(
          lang,
          "Clear answers on delivery, payments, returns, warranty and ordering for a business. If your question is not here, our team is one message away.",
          "إجابات واضحة عن التوصيل والدفع والاسترجاع والضمان والطلب للشركات. لو سؤالك غير موجود، فريقنا على بعد رسالة واحدة.",
        )}
        crumbs={[{ label: t("nav.faq") }]}
      >
        <div className="hero__actions">
          <a
            href={SOCIAL_LINKS.whatsapp}
            className="btn btn-primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle aria-hidden="true" />
            {t("support.whatsapp")}
          </a>
          <Link href="/support" className="btn btn-outline">
            {t("nav.support")}
          </Link>
        </div>
      </PageHero>

      <section className="faq-section">
        <div className="shell">
          <div className="faq-list">
            {faqs.map((item, index) => (
              <details className="faq-item" key={item.question.en} open={index === 0}>
                <summary>{item.question[lang]}</summary>
                <p className="faq-item__answer">{item.answer[lang]}</p>
              </details>
            ))}
          </div>

          <div className="support-side-note" style={{ marginTop: 24, maxWidth: 860 }}>
            <strong>
              <HelpCircle
                aria-hidden="true"
                style={{ width: 14, height: 14, display: "inline", marginInlineEnd: 6 }}
              />
              {t("orders.help")}
            </strong>
            {t("orders.helpText")}
            <div style={{ marginTop: 12 }}>
              <Link href="/support" className="btn btn-outline btn-sm">
                {t("orders.contact")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
