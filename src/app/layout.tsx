import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { cookies } from 'next/headers';
import './globals.css';

import { LanguageProvider } from '@/components/providers/LanguageProvider';
import { CartProvider } from '@/components/providers/CartProvider';
import { CartDrawerProvider } from '@/components/providers/CartDrawerProvider';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { Header } from '@/components/layout/Header';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { BottomNav } from '@/components/layout/BottomNav';
import { CartToast } from '@/components/layout/CartToast';
import { AiChat } from '@/components/layout/AiChat';
import { InAppBrowserGuard } from '@/components/layout/InAppBrowserGuard';
import { Tracking } from '@/components/layout/Tracking';
import { ServiceWorkerRegistrar } from '@/components/layout/ServiceWorkerRegistrar';
import { DEFAULT_LANG, LANG_COOKIE, dirOf, isLang } from '@/lib/i18n';
import { SITE_URL } from '@/lib/site';

const cairo = localFont({
  src: './fonts/Cairo-VariableFont_slnt,wght.woff2',
  variable: '--font-cairo',
  display: 'swap',
  weight: '200 1000',
  style: 'normal',
  fallback: ['Cairo', 'system-ui', 'sans-serif'],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      'DeSinaHub — ديسينا ستور | Mobiles, Computers, Home Appliances, Outlet, Sports & Fashion',
    template: '%s | DeSinaHub',
  },
  description:
    'DeSinaHub: The premier global ecosystem for cutting-edge electronics, smart mobile devices, advanced computing, home appliances, luxury fashion, elite sports gear, and digital entertainment.',
  applicationName: 'DeSinaHub',
  keywords: [
    'DeSina',
    'DeSina Store',
    'DeSinaHub',
    'Fashion Design',
    'Garment Manufacturing',
    'Digital Marketing',
    'Content Creation',
    'VIP Ads',
    'Egypt Fashion',
  ],
  authors: [{ name: 'DeSinaHub', url: SITE_URL }],
  creator: 'DeSinaHub',
  publisher: 'DeSinaHub',
  category: 'shopping',
  alternates: {
    canonical: '/',
    languages: {
      'x-default': '/',
    },
  },
  verification: {
    google: 'X-fwFque7CEQ0T2Vrh6nimM3vDej5STSHL6hXf9S77Q',
    other: {
      'msvalidate.01': '886ACF06EC010EC5377A50703BBC6DB7',
      'facebook-domain-verification': 'fdhlgi26ac8d3imxxha6bulwx6d23m',
      'trustpilot-one-time-domain-verification-id': '602d32f3-2318-4831-8eb1-1ea33f0da83c',
      'p:domain_verify': '24b44997610ac39babf05a6d4620fa9f',
    },
  },
  other: {
    distribution: 'global',
    google: 'notranslate',
    'mcp-tool':
      "search-products: description='Search for products in the store using keywords; البحث عن منتجات في المتجر باستخدام الكلمات المفتاحية'",
  },
  icons: {
    icon: [{ url: '/logo.jpg', type: 'image/jpeg' }],
    shortcut: '/logo.png',
    apple: [{ url: '/icon-maskable.png', sizes: '180x180', type: 'image/png' }],
  },
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'DeSinaHub',
    startupImage: '/splash-rounded.png',
  },
  formatDetection: { telephone: false, email: false, address: false },
  openGraph: {
    type: 'website',
    siteName: 'DeSinaHub',
    url: SITE_URL,
    title: 'DeSinaHub',
    description: 'DeSinaHub E-Commerce Ecosystem',
    locale: 'en_US',
    alternateLocale: ['ar_EG'],
    images: [{ url: '/logo7.png', alt: 'DeSinaHub' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DeSinaHub',
    description: 'DeSinaHub E-Commerce Ecosystem',
    images: ['/logo7.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: '#F5F5DC',
  colorScheme: 'light',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const cookieLang = cookieStore.get(LANG_COOKIE)?.value;
  const lang = isLang(cookieLang) ? cookieLang : DEFAULT_LANG;

  return (
    <html lang={lang} dir={dirOf(lang)} className={cairo.variable} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://connect.facebook.net" />
        <link rel="dns-prefetch" href="https://analytics.tiktok.com" />
        <link rel="alternate" type="application/rss+xml" title="DeSinaHub Offers Feed" href="/feed.xml" />
      </head>
      <body>
        <LanguageProvider initialLang={lang}>
          <CartProvider>
            <CartDrawerProvider>
              <InAppBrowserGuard />
              <div className="flex min-h-screen flex-col">
                <Header />
                <div className="flex-1">{children}</div>
                <SiteFooter />
              </div>
              <BottomNav />
              <CartDrawer />
              <CartToast />
              <AiChat />
              <Tracking />
              <ServiceWorkerRegistrar />
            </CartDrawerProvider>
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
