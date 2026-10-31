"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowUp,
  ChevronRight,
  Clock,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { categories, productCategories } from "@/data/categories";
import { DIRECT_PAYMENT_BADGES, STORE } from "@/lib/site";
import { footerHelpLinks, footerServiceLinks } from "@/data/navigation";
import { useI18n } from "@/components/providers/i18n-provider";
import { BrandMark } from "@/components/ui/brand-mark";
import { PwaInstallButton } from "@/components/ui/pwa-install-button";

export function SiteFooter() {
  const { lang, t, tr } = useI18n();

  const helpLabels = [
    t("nav.orders"),
    t("policies.shipping"),
    t("policies.returns"),
    t("policies.payment"),
    t("nav.faq"),
    t("nav.support"),
    t("nav.reviews"),
  ];

  const companyLinks = [
    { href: "/reviews", label: t("nav.reviews") },
    { href: "/account", label: t("nav.account") },
    ...footerServiceLinks.map((link) => {
      const category = categories.find((item) => `/category/${item.slug}` === link.href);
      return {
        href: link.href,
        label: category
          ? category.name[lang]
          : link.href.includes("industrial")
            ? tr("Industrial Services", "خدمات صناعية")
            : tr("Tourism Services", "خدمات سياحية"),
      };
    }),
    { href: "/policies", label: t("nav.policies") },
  ];

  return (
    <footer className="site-footer" id="site-footer">
      <div className="site-footer__inner">
        <div className="footer-grid">
          <div className="footer-brand">
            <BrandMark />
            <p className="footer-tagline">{t("brand.tagline")}</p>
            <a
              className="footer-map-link"
              href={STORE.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MapPin aria-hidden="true" />
              {t("footer.address")}
            </a>
            <span className="footer-hours">
              <Clock aria-hidden="true" />
              {t("footer.hoursText")}
            </span>
          </div>

          <div className="footer-col">
            <h3>{t("footer.shopTitle")}</h3>
            <div className="footer-links">
              <Link href="/shop">
                <ChevronRight aria-hidden="true" />
                {t("nav.allProducts")}
              </Link>
              {productCategories.map((category) => (
                <Link key={category.slug} href={`/category/${category.slug}`}>
                  <ChevronRight aria-hidden="true" />
                  {category.shortName[lang]}
                </Link>
              ))}
            </div>
          </div>

          <div className="footer-col">
            <h3>{t("footer.helpTitle")}</h3>
            <div className="footer-links">
              {footerHelpLinks.map((link, index) => (
                <Link key={link.href} href={link.href}>
                  <ChevronRight aria-hidden="true" />
                  {helpLabels[index]}
                </Link>
              ))}
            </div>
          </div>

          <div className="footer-col">
            <h3>{t("footer.companyTitle")}</h3>
            <div className="footer-links">
              {companyLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <ChevronRight aria-hidden="true" />
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="footer-contact-block" style={{ marginTop: 20 }}>
              <span className="footer-contact-label">{t("nav.contact")}</span>
              <a href={`tel:${STORE.phones[0].replace(/\s+/g, "")}`}>
                <Phone aria-hidden="true" />
                {STORE.phones[0]}
              </a>
              <a href={`tel:${STORE.phones[1].replace(/\s+/g, "")}`}>
                <Phone aria-hidden="true" />
                {STORE.phones[1]}
              </a>
              <a href={`mailto:${STORE.email}`}>
                <Mail aria-hidden="true" />
                {STORE.email}
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-legal">
            <span>
              © {new Date().getFullYear()} {t("brand.name")}. {t("footer.rights")}
            </span>
            <span aria-hidden="true">·</span>
            <span>{t("footer.built")}</span>
            <PwaInstallButton className="footer-top-btn" />
          </div>

          <div className="footer-payments" aria-label={t("footer.securePayments")}>
            <span className="footer-payments__label">{t("footer.securePayments")}</span>
            {DIRECT_PAYMENT_BADGES.map((badge) => (
              <span key={badge.id} className="pay-badge">
                <Image
                  src={badge.logo}
                  alt={badge.label}
                  width={54}
                  height={18}
                  unoptimized={badge.logo.endsWith(".svg")}
                />
              </span>
            ))}
          </div>

          <button
            type="button"
            className="footer-top-btn"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <ArrowUp aria-hidden="true" />
            {t("footer.backTop")}
          </button>
        </div>
      </div>
    </footer>
  );
}
