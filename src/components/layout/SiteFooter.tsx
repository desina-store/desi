'use client';

import Link from 'next/link';
import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { PaymentMarks } from '@/components/layout/PaymentMarks';
import { FacebookIcon, InstagramIcon, TiktokIcon, YoutubeIcon } from '@/components/ui/BrandIcons';
import { CATEGORIES, HOTLINES, MAP_URL, SITE_EMAIL, SALES_EMAIL, SITE_URL, SOCIAL } from '@/lib/site';

const SHOP_LINKS = CATEGORIES.filter((category) => category.catalog.length > 0);

export function SiteFooter() {
  const { lang, t } = useLanguage();

  return (
    <footer className="mt-20 rounded-t-[40px] bg-[#1f1f1f] px-5 pb-10 pt-12 text-white md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 text-start md:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-4">
            <Link href="/" className="inline-flex text-2xl font-extrabold tracking-tighter" style={{ direction: 'ltr' }}>
              <span className="text-brand-red">.</span>
              <span className="text-white/90">DeSina</span>
              <span className="text-brand-red">Hub</span>
            </Link>
            <p className="max-w-[34ch] text-xs leading-relaxed text-white/55">{t('brand.tagline')}</p>
            <a
              href={MAP_URL}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-xs font-bold text-white/85 transition-colors hover:text-canary"
            >
              <MapPin className="h-4 w-4 text-brand-red" />
              {t('footer.map')}
            </a>
            <a
              href={SITE_URL}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-xs font-bold text-brand-red transition-colors hover:text-canary"
            >
              <span className="text-[13px]">◎</span>
              {t('footer.website')}
            </a>
            <div className="mt-1 flex items-center gap-2">
              <SocialIcon href={SOCIAL.facebook} label="Facebook">
                <FacebookIcon className="h-3.5 w-3.5" />
              </SocialIcon>
              <SocialIcon href={SOCIAL.youtube} label="YouTube">
                <YoutubeIcon className="h-3.5 w-3.5" />
              </SocialIcon>
              <SocialIcon href={SOCIAL.tiktok} label="TikTok">
                <TiktokIcon className="h-3.5 w-3.5" />
              </SocialIcon>
              <SocialIcon href={SOCIAL.instagram} label="Instagram">
                <InstagramIcon className="h-3.5 w-3.5" />
              </SocialIcon>
              <SocialIcon href={SOCIAL.whatsapp} label="WhatsApp">
                <MessageCircle className="h-4 w-4" />
              </SocialIcon>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.18em] text-brand-red">{t('footer.shop')}</h3>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 text-xs font-semibold text-white/80">
              {SHOP_LINKS.map((category) => (
                <li key={category.slug}>
                  <Link href={`/${category.slug}`} className="transition-colors hover:text-canary">
                    {category.name[lang]}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/offers" className="transition-colors hover:text-canary">
                  {t('sections.offers')}
                </Link>
              </li>
              <li>
                <Link href="/industrial" className="transition-colors hover:text-canary">
                  {lang === 'ar' ? 'الخدمات الصناعية' : 'Industrial'}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.18em] text-brand-red">{t('footer.help')}</h3>
            <ul className="mt-4 flex flex-col gap-2.5 text-xs font-semibold text-white/80">
              <li>
                <Link href="/policies" className="transition-colors hover:text-canary">
                  {t('footer.policies')}
                </Link>
              </li>
              <li>
                <Link href="/return-policy" className="transition-colors hover:text-canary">
                  {t('return.title')}
                </Link>
              </li>
              <li>
                <Link href="/faq" className="transition-colors hover:text-canary">
                  {t('faq.title')}
                </Link>
              </li>
              <li>
                <Link href="/support" className="transition-colors hover:text-canary">
                  {t('footer.care')}
                </Link>
              </li>
              <li>
                <Link href="/tracking" className="transition-colors hover:text-canary">
                  {t('footer.track')}
                </Link>
              </li>
              <li>
                <Link href="/reviews" className="transition-colors hover:text-canary">
                  {t('nav.reviews')}
                </Link>
              </li>
              <li>
                <Link href="/orders" className="transition-colors hover:text-canary">
                  {t('nav.orders')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.18em] text-brand-red">{t('footer.contact')}</h3>
            <ul className="mt-4 flex flex-col gap-3 text-xs font-semibold text-white/80">
              <li>
                <a href={`mailto:${SITE_EMAIL}`} className="flex items-center gap-2 transition-colors hover:text-canary">
                  <Mail className="h-3.5 w-3.5" /> {SITE_EMAIL}
                </a>
              </li>
              <li>
                <a href={`mailto:${SALES_EMAIL}`} className="flex items-center gap-2 transition-colors hover:text-canary">
                  <Mail className="h-3.5 w-3.5" /> {SALES_EMAIL}
                </a>
              </li>
              {HOTLINES.map((line) => (
                <li key={line.value}>
                  <a href={`tel:${line.value}`} className="flex items-center gap-2 transition-colors hover:text-canary">
                    <Phone className="h-3.5 w-3.5" /> {line.label}
                  </a>
                </li>
              ))}
              <li className="pt-1 text-[11px] font-medium text-white/45">{t('footer.care')} 24/7</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 md:flex-row md:items-center md:justify-between">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/45">{t('footer.pay')}</p>
          <PaymentMarks />
        </div>

        <div className="mt-6 flex flex-col items-center justify-between gap-3 border-t border-white/5 pt-6 text-center text-[11px] text-white/45 md:flex-row md:text-start">
          <p>{t('footer.rights')}</p>
          <p className="text-white/35">{lang === 'ar' ? 'مركز تسوق آمن — ديسينا هب' : 'Secure Shopping Hub — DeSinaHub'}</p>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/75 transition-colors hover:border-canary hover:text-canary"
    >
      {children}
    </a>
  );
}
