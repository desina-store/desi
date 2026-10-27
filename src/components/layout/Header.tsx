'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Headphones, MapPin, Menu, Search, ShieldCheck, ShoppingBag, Truck } from 'lucide-react';
import { BrandMark } from '@/components/ui/BrandMark';
import { CircularMenu } from '@/components/layout/CircularMenu';
import { useCart } from '@/components/providers/CartProvider';
import { useCartDrawer } from '@/components/providers/CartDrawerProvider';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { formatCount } from '@/lib/format';

const NAV_LINKS = [
  { href: '/#sections', labelKey: 'nav.store' },
  { href: '/offers', labelKey: 'nav.offers' },
  { href: '/reviews', labelKey: 'nav.reviews' },
  { href: '/account', labelKey: 'nav.account' },
];

export function Header() {
  const { lang, t, toggleLang } = useLanguage();
  const { count, ready } = useCart();
  const { openDrawer } = useCartDrawer();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [menuOpen]);

  return (
    <>
      <div className="announcement">
        <div className="announcement__inner shell">
          <div className="announcement__group">
            <span className="announcement__item">
              <Truck aria-hidden="true" />
              <strong>{t('feature.delivery')}</strong>
            </span>
            <span className="announcement__item">
              <ShieldCheck aria-hidden="true" />
              {t('pdp.genuine')}
            </span>
            <span className="announcement__item">
              <Headphones aria-hidden="true" />
              {t('footer.support')}
            </span>
          </div>
          <div className="announcement__meta">
            <MapPin aria-hidden="true" />
            <span>{t('footer.map')}</span>
            <span aria-hidden="true">·</span>
            <span>{lang === 'ar' ? 'العربية' : 'English'}</span>
          </div>
        </div>
      </div>

      <header className={`site-header ds-header${scrolled ? ' is-scrolled' : ''}`}>
        <div className="header-inner shell">
          <BrandMark />

          <nav className="primary-nav" aria-label={t('nav.menu')}>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={link.href === '/offers' ? 'is-sale' : undefined}
                aria-current={pathname === link.href ? 'page' : undefined}
              >
                {t(link.labelKey)}
              </Link>
            ))}
          </nav>

          <div className="header-actions">
            <Link
              href="/#search"
              className="icon-button icon-button--bordered"
              aria-label={t('search.placeholder')}
            >
              <Search aria-hidden="true" />
            </Link>
            <button
              type="button"
              className="lang-toggle"
              onClick={toggleLang}
              aria-label={t('nav.language')}
            >
              {lang === 'ar' ? 'EN' : 'عربي'}
            </button>
            <button
              type="button"
              className="cart-trigger"
              aria-label={`${t('nav.cart')}${ready && count ? ` (${count})` : ''}`}
              onClick={openDrawer}
            >
              <ShoppingBag aria-hidden="true" />
              <span>{t('nav.cart')}</span>
              {ready && count > 0 ? (
                <span className="cart-trigger__badge">{formatCount(count, lang)}</span>
              ) : null}
            </button>
            <button
              type="button"
              className="menu-toggle"
              aria-label={t('nav.openMenu')}
              aria-expanded={menuOpen}
              aria-controls="site-menu"
              onClick={() => setMenuOpen(true)}
            >
              <Menu aria-hidden="true" />
              <span>{t('nav.menu')}</span>
            </button>
          </div>
        </div>
      </header>

      <CircularMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
