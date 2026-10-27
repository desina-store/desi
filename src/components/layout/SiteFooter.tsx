'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUp, ChevronRight, Clock, Mail, MapPin, Phone } from 'lucide-react';
import { BrandMark } from '@/components/ui/BrandMark';
import { useLanguage } from '@/components/providers/LanguageProvider';
import {
  CATEGORIES,
  HOTLINES,
  MAP_URL,
  SALES_EMAIL,
  SITE_EMAIL,
  SITE_URL,
} from '@/lib/site';
import { pick } from '@/lib/brand-copy';

const PAYMENT_BADGES = [
  { id: 'visa', label: 'Visa', logo: '/payments/visa.webp' },
  { id: 'mastercard', label: 'Mastercard', logo: '/payments/mastercard.webp' },
  { id: 'meeza', label: 'Meeza', logo: '/payments/meeza.svg' },
  { id: 'paypal', label: 'PayPal', logo: '/payments/paypal.webp' },
  { id: 'fawry', label: 'Fawry', logo: '/payments/fawry.svg' },
];

const HELP_LINKS = [
  { href: '/orders', key: 'nav.orders' },
  { href: '/tracking', key: 'footer.track' },
  { href: '/return-policy', key: 'return.title' },
  { href: '/faq', key: 'faq.title' },
  { href: '/support', key: 'footer.support' },
  { href: '/reviews', key: 'nav.reviews' },
];

export function SiteFooter() {
  const { lang, t } = useLanguage();
  const shopLinks = CATEGORIES.filter((category) => category.catalog.length > 0);
  const serviceLinks = CATEGORIES.filter((category) => category.catalog.length === 0);

  return (
    <footer className="site-footer" id="site-footer">
      <div className="site-footer__inner">
        <div className="footer-grid">
          <div className="footer-brand">
            <BrandMark />
            <p className="footer-tagline">{t('brand.tagline')}</p>
            <a className="footer-map-link" href={MAP_URL} target="_blank" rel="noopener noreferrer">
              <MapPin aria-hidden="true" />
              {t('footer.map')}
            </a>
            <a className="footer-map-link" href={SITE_URL} target="_blank" rel="noopener noreferrer">
              {t('footer.website')}
            </a>
            <span className="footer-hours">
              <Clock aria-hidden="true" />
              {pick(lang, 'Customer care 24/7 · Cairo, Egypt', 'خدمة العملاء 24/7 · القاهرة، مصر')}
            </span>
          </div>

          <div className="footer-col">
            <h3>{t('footer.shop')}</h3>
            <div className="footer-links">
              <Link href="/#sections">
                <ChevronRight aria-hidden="true" />
                {t('sections.all')}
              </Link>
              {shopLinks.map((category) => (
                <Link key={category.slug} href={`/${category.slug}`}>
                  <ChevronRight aria-hidden="true" />
                  {category.short[lang]}
                </Link>
              ))}
              <Link href="/offers">
                <ChevronRight aria-hidden="true" />
                {t('sections.offers')}
              </Link>
            </div>
          </div>

          <div className="footer-col">
            <h3>{t('footer.help')}</h3>
            <div className="footer-links">
              {HELP_LINKS.map((link) => (
                <Link key={link.href} href={link.href}>
                  <ChevronRight aria-hidden="true" />
                  {t(link.key)}
                </Link>
              ))}
            </div>
          </div>

          <div className="footer-col">
            <h3>{t('footer.company')}</h3>
            <div className="footer-links">
              {serviceLinks.map((category) => (
                <Link key={category.slug} href={`/${category.slug}`}>
                  <ChevronRight aria-hidden="true" />
                  {category.name[lang]}
                </Link>
              ))}
              <Link href="/account">
                <ChevronRight aria-hidden="true" />
                {t('nav.account')}
              </Link>
              <Link href="/policies">
                <ChevronRight aria-hidden="true" />
                {t('footer.policies')}
              </Link>
            </div>
            <div className="footer-contact-block">
              <span className="footer-contact-label">{t('footer.contact')}</span>
              {HOTLINES.map((line) => (
                <a key={line.value} href={`tel:${line.value}`} dir="ltr">
                  <Phone aria-hidden="true" />
                  {line.label}
                </a>
              ))}
              <a href={`mailto:${SITE_EMAIL}`}>
                <Mail aria-hidden="true" />
                {SITE_EMAIL}
              </a>
              <a href={`mailto:${SALES_EMAIL}`}>
                <Mail aria-hidden="true" />
                {SALES_EMAIL}
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-legal">
            <span>{t('footer.rights')}</span>
            <span aria-hidden="true">·</span>
            <span>{pick(lang, 'Secure shopping hub', 'مركز تسوق آمن')}</span>
          </div>

          <div className="footer-payments" aria-label={t('footer.pay')}>
            <span className="footer-payments__label">{t('footer.pay')}</span>
            {PAYMENT_BADGES.map((badge) => (
              <span key={badge.id} className="pay-badge">
                <Image
                  src={badge.logo}
                  alt={badge.label}
                  width={54}
                  height={18}
                  unoptimized={badge.logo.endsWith('.svg')}
                />
              </span>
            ))}
          </div>

          <button
            type="button"
            className="footer-top-btn"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <ArrowUp aria-hidden="true" />
            {pick(lang, 'Back to top', 'إلى الأعلى')}
          </button>
        </div>
      </div>
    </footer>
  );
}
