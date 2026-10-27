'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, ShoppingBag, User, Zap, type LucideIcon } from 'lucide-react';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { useCart } from '@/components/providers/CartProvider';
import { WHATSAPP } from '@/lib/site';
import { formatCount } from '@/lib/format';

export function BottomNav() {
  const { lang, t } = useLanguage();
  const { count, ready } = useCart();
  const pathname = usePathname();

  const quickMessage =
    lang === 'ar'
      ? 'مرحباً ديسينا هب، أريد الطلب سريعاً من المتجر.'
      : 'Hello DeSinaHub, I would like to place a quick order.';

  const items: {
    key: string;
    href: string;
    label: string;
    icon?: LucideIcon;
    active?: boolean;
    badge?: number;
  }[] = [
    { key: 'home', href: '/', label: t('nav.home'), icon: Home, active: pathname === '/' },
    {
      key: 'store',
      href: '/#sections',
      label: t('nav.store'),
      icon: LayoutGrid,
      active: pathname !== '/' && pathname !== '/cart' && pathname !== '/account',
    },
    { key: 'quick', href: `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(quickMessage)}`, label: t('nav.quick') },
    { key: 'cart', href: '/cart', label: t('nav.cart'), icon: ShoppingBag, active: pathname === '/cart', badge: ready ? count : 0 },
    { key: 'account', href: '/account', label: t('nav.account'), icon: User, active: pathname === '/account' },
  ];

  return (
    <nav
      aria-label="Mobile quick navigation"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-black/5 bg-white/95 pb-[calc(env(safe-area-inset-bottom,0px)+0.5rem)] shadow-[0_-8px_30px_rgba(0,0,0,0.08)] backdrop-blur-xl md:hidden"
    >
      <ul className="mx-auto grid h-[68px] w-full max-w-md grid-cols-5 items-end px-2">
        {items.map((item) => {
          if (item.key === 'quick') {
            return (
              <li key={item.key} className="flex h-full items-end justify-center">
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="-mb-1 flex h-14 w-14 flex-col items-center justify-center gap-0.5 rounded-2xl bg-brand-red text-white shadow-[0_10px_24px_rgba(255,59,48,0.35)] ring-4 ring-white transition-transform active:scale-95"
                  aria-label={item.label}
                >
                  <Zap className="h-5 w-5" strokeWidth={2.4} />
                  <span className="text-[9px] font-black leading-none">{item.label}</span>
                </a>
              </li>
            );
          }

          const Icon = item.icon;
          if (!Icon) return null;
          return (
            <li key={item.key} className="flex h-full items-end">
              <Link
                href={item.href}
                className={`group flex h-full w-full flex-col items-center justify-end gap-1 pb-1 transition-colors ${
                  item.active ? 'ds-nav-active text-brand-red' : 'text-[#6b7280] hover:text-brand-red'
                }`}
                aria-current={item.active ? 'page' : undefined}
              >
                <span className="relative">
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
                      item.active ? 'ds-nav-tile-active bg-brand-red/12 text-brand-red' : 'bg-black/[0.04] group-hover:bg-brand-red/8'
                    }`}
                  >
                    <Icon className="h-[19px] w-[19px]" strokeWidth={2} />
                  </span>
                  {item.badge ? (
                    <span className="absolute -top-1 -end-1 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-brand-red px-1 text-[9px] font-black text-white">
                      {formatCount(item.badge, lang)}
                    </span>
                  ) : null}
                </span>
                <span className="text-[10px] font-bold">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
