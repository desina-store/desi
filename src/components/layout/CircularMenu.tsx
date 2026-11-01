'use client';

import { useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { ArrowUpRight, MessageCircle, Search, ShoppingBag, X } from 'lucide-react';
import { BrandMark } from '@/components/ui/BrandMark';
import { useCartDrawer } from '@/components/providers/CartDrawerProvider';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { FacebookIcon, InstagramIcon, TiktokIcon, YoutubeIcon } from '@/components/ui/BrandIcons';
import { CATEGORIES, HOTLINES, SITE_EMAIL, SOCIAL, WHATSAPP } from '@/lib/site';
import { pick } from '@/lib/brand-copy';

export function CircularMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { lang, t, toggleLang } = useLanguage();
  const { openDrawer } = useCartDrawer();
  const closeRef = useRef<HTMLButtonElement>(null);

  const links = useMemo(() => {
    const categoryLinks = CATEGORIES.map((category) => ({
      href: `/${category.slug}`,
      label: category.name[lang],
      tag:
        category.catalog.length === 0
          ? pick(lang, 'Service desk', 'مكتب خدمات')
          : category.slug === 'outlet'
            ? pick(lang, 'Sale', 'تخفيض')
            : undefined,
    }));
    return [
      { href: '/', label: t('nav.home'), tag: undefined as string | undefined },
      ...categoryLinks,
      { href: '/offers', label: t('nav.offers'), tag: pick(lang, 'Deals', 'عروض') },
      { href: '/orders', label: t('nav.orders'), tag: undefined },
      { href: '/support', label: t('nav.support'), tag: undefined },
      { href: '/account', label: t('nav.account'), tag: undefined },
      { href: '/policies', label: t('nav.policies'), tag: undefined },
    ];
  }, [lang, t]);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  return (
    <div
      id="site-menu"
      className={`circular-menu${open ? ' is-open' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label={t('nav.menu')}
      aria-hidden={!open}
      inert={!open}
    >
      <div className="circular-menu__inner">
        <div className="menu-top">
          <BrandMark />
          <button ref={closeRef} type="button" className="menu-close" onClick={onClose}>
            <X aria-hidden="true" />
            {t('common.close')}
          </button>
        </div>

        <div className="menu-body">
          <div>
            <p className="menu-kicker">{pick(lang, 'Where to next?', 'إلى أين نتجه؟')}</p>
            <nav className="menu-nav" aria-label={t('nav.menu')}>
              {links.map((link, index) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="menu-link"
                  onClick={onClose}
                  tabIndex={open ? 0 : -1}
                >
                  <span className="menu-link__index">{String(index + 1).padStart(2, '0')}</span>
                  <span>
                    {link.label}
                    {link.tag ? <span className="menu-link__tag">{link.tag}</span> : null}
                  </span>
                  <ArrowUpRight className="menu-link__arrow" aria-hidden="true" />
                </Link>
              ))}
            </nav>
          </div>

          <aside className="menu-aside">
            <div>
              <p className="menu-aside__label">{pick(lang, 'Quick actions', 'إجراءات سريعة')}</p>
              <p className="menu-aside__text">{t('brand.tagline')}</p>
              <div className="menu-actions">
                <Link
                  href="/#search"
                  className="menu-lang"
                  onClick={onClose}
                  tabIndex={open ? 0 : -1}
                >
                  <Search aria-hidden="true" />
                  {t('home.searchTitle')}
                </Link>
                <button
                  type="button"
                  className="menu-lang"
                  onClick={() => {
                    onClose();
                    openDrawer();
                  }}
                  tabIndex={open ? 0 : -1}
                >
                  <ShoppingBag aria-hidden="true" />
                  {t('nav.cart')}
                </button>
                <button
                  type="button"
                  className="menu-lang"
                  onClick={() => {
                    toggleLang();
                    onClose();
                  }}
                  tabIndex={open ? 0 : -1}
                >
                  {lang === 'ar' ? 'English' : 'العربية'}
                </button>
              </div>
            </div>

            <div>
              <p className="menu-aside__label">{t('footer.contact')}</p>
              <a className="menu-contact" href={`tel:${HOTLINES[0].value}`} dir="ltr">
                {HOTLINES[0].label}
              </a>
              <a className="menu-contact" href={`mailto:${SITE_EMAIL}`}>
                {SITE_EMAIL}
              </a>
              <a
                className="menu-contact"
                href={`https://wa.me/${WHATSAPP}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle aria-hidden="true" />
                WhatsApp
              </a>
            </div>

            <div>
              <p className="menu-aside__label">{t('footer.connect')}</p>
              <div className="menu-socials">
                <a className="social-link" href={SOCIAL.facebook} target="_blank" rel="noreferrer" aria-label="Facebook">
                  <FacebookIcon aria-hidden="true" />
                </a>
                <a className="social-link" href={SOCIAL.youtube} target="_blank" rel="noreferrer" aria-label="YouTube">
                  <YoutubeIcon aria-hidden="true" />
                </a>
                <a className="social-link" href={SOCIAL.tiktok} target="_blank" rel="noreferrer" aria-label="TikTok">
                  <TiktokIcon aria-hidden="true" />
                </a>
                <a className="social-link" href={SOCIAL.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
                  <InstagramIcon aria-hidden="true" />
                </a>
              </div>
            </div>
          </aside>
        </div>

        <div className="menu-foot">
          <span>
            © {new Date().getFullYear()} DeSinaHub. <em>{t('brand.tagline')}</em>
          </span>
          <span>{pick(lang, 'Cairo · Egypt', 'القاهرة · مصر')}</span>
        </div>
      </div>
    </div>
  );
}
