'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Menu, Search, ShoppingBag, X } from 'lucide-react';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { useCart } from '@/components/providers/CartProvider';
import { CATEGORIES } from '@/lib/site';
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
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  function closeMenu() {
    setOpen(false);
  }

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-black/5 bg-[#faf8f5]/90 backdrop-blur-xl">
        <div className="page-shell flex h-[68px] items-center justify-between gap-4">
          <div className="flex items-center gap-2 md:gap-7">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-black/5"
              aria-label={t('nav.openMenu')}
              aria-expanded={open}
              aria-controls="site-menu"
            >
              <Menu className="h-6 w-6" strokeWidth={1.8} />
            </button>

            <Link
              href="/"
              className="flex shrink-0 items-center text-[22px] font-extrabold tracking-[-1.2px]"
              style={{ direction: 'ltr' }}
              aria-label="DeSinaHub"
            >
              <span className="text-brand-red">.</span>
              <span className="text-[#374151]">DeSina</span>
              <span className="text-brand-red">Hub</span>
            </Link>
          </div>

          <nav className="hidden items-center gap-7 text-[13px] font-semibold text-[#6b7280] lg:flex" aria-label="Primary">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="transition-colors hover:text-ink">
                {t(link.labelKey)}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1.5 md:gap-3">
            <button
              type="button"
              onClick={toggleLang}
              className="rounded-full border border-black/10 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-ink transition-colors hover:border-olive hover:text-olive"
              aria-label={t('nav.language')}
            >
              {lang === 'en' ? 'AR' : 'EN'}
            </button>

            <Link
              href="/#search"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-black/5"
              aria-label={t('search.placeholder')}
            >
              <Search className="h-[19px] w-[19px]" strokeWidth={1.9} />
            </Link>

            <Link
              href="/cart"
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-black/5"
              aria-label={`${t('nav.cart')}${ready && count ? ` (${count})` : ''}`}
            >
              <ShoppingBag className="h-[19px] w-[19px]" strokeWidth={1.9} />
              {ready && count > 0 ? (
                <span className="absolute -top-0.5 end-0 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-brand-red px-1 text-[10px] font-black text-white">
                  {formatCount(count, lang)}
                </span>
              ) : null}
            </Link>
          </div>
        </div>
      </header>

      {open ? (
        <div
          id="site-menu"
          role="dialog"
          aria-modal="true"
          aria-label={t('nav.menu')}
          className="ds-fade-in fixed inset-0 z-[70] flex flex-col overflow-y-auto bg-[#1f1f1f] text-white"
        >
          <div className="page-shell flex h-[68px] shrink-0 items-center justify-between">
            <span className="text-[22px] font-extrabold tracking-[-1.2px]" style={{ direction: 'ltr' }}>
              <span className="text-brand-red">.</span>
              <span className="text-white/90">DeSina</span>
              <span className="text-brand-red">Hub</span>
            </span>
            <button
              type="button"
              onClick={closeMenu}
              aria-label={t('nav.closeMenu')}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="page-shell grid flex-1 gap-10 py-10 md:grid-cols-[1.1fr_1fr] md:items-center">
            <nav className="flex flex-col gap-4" aria-label="Site menu">
              <Link href="/" onClick={closeMenu} className="text-[26px] font-black tracking-tight transition-colors hover:text-canary">
                {t('nav.home')}
              </Link>
              <Link href="/#sections" onClick={closeMenu} className="text-[26px] font-black tracking-tight transition-colors hover:text-canary">
                {t('nav.store')}
              </Link>
              {CATEGORIES.filter((c) => c.catalog.length > 0).map((category) => (
                <Link
                  key={category.slug}
                  href={`/${category.slug}`}
                  onClick={closeMenu}
                  className="text-[21px] font-bold text-white/85 transition-colors hover:text-canary"
                >
                  {category.name[lang]}
                </Link>
              ))}
              <Link href="/offers" onClick={closeMenu} className="text-[21px] font-bold text-white/85 transition-colors hover:text-canary">
                {t('nav.offers')}
              </Link>
              <Link href="/reviews" onClick={closeMenu} className="text-[21px] font-bold text-white/85 transition-colors hover:text-canary">
                {t('nav.reviews')}
              </Link>
              <Link href="/account" onClick={closeMenu} className="text-[21px] font-bold text-white/85 transition-colors hover:text-canary">
                {t('nav.account')}
              </Link>
              <Link href="/support" onClick={closeMenu} className="text-[21px] font-bold text-white/85 transition-colors hover:text-canary">
                {t('nav.support')}
              </Link>
              <Link href="/policies" onClick={closeMenu} className="text-[21px] font-bold text-white/85 transition-colors hover:text-canary">
                {t('nav.policies')}
              </Link>
            </nav>

            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/45">{t('footer.connect')}</p>
              <div className="mt-4 flex flex-col gap-3 text-sm font-semibold">
                <Link href="/support" onClick={closeMenu} className="text-white/85 hover:text-canary">
                  {t('footer.support')}
                </Link>
                <Link href="/tracking" onClick={closeMenu} className="text-white/85 hover:text-canary">
                  {t('footer.shipping')}
                </Link>
                <Link href="/industrial" onClick={closeMenu} className="text-white/85 hover:text-canary">
                  {lang === 'ar' ? 'الخدمات الصناعية' : 'Industrial Services'}
                </Link>
                <Link href="/tourism" onClick={closeMenu} className="text-white/85 hover:text-canary">
                  {lang === 'ar' ? 'الخدمات السياحية' : 'Tourism Services'}
                </Link>
              </div>
              <button
                type="button"
                onClick={() => {
                  toggleLang();
                  closeMenu();
                }}
                className="mt-6 inline-flex items-center rounded-full bg-canary px-5 py-2.5 text-xs font-extrabold uppercase tracking-[0.16em] text-ink"
              >
                {lang === 'en' ? 'العربية' : 'English'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
