import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { dirFor } from "@/lib/i18n";
import { getServerLang } from "@/lib/i18n-server";
import { SITE_URL } from "@/lib/site";
import { I18nProvider } from "@/components/providers/i18n-provider";
import { CartProvider } from "@/components/providers/cart-provider";
import { SiteChrome } from "@/components/chrome/site-chrome";
import { Analytics } from "@/components/analytics";
import { ServiceWorkerRegister } from "@/components/service-worker-register";
import "./globals.css";

const cairo = localFont({
  src: "./fonts/Cairo-VariableFont_slnt,wght.woff2",
  variable: "--font-cairo",
  display: "swap",
  weight: "200 1000",
  style: "normal",
  preload: true,
  fallback: ["Cairo", "Segoe UI", "Tahoma", "Arial", "sans-serif"],
});

const title =
  "DeSinaHub — ديسينا هب | Mobiles, Computers, Appliances, Outlet, Sports & Fashion";
const description =
  "DeSinaHub is Egypt's premium lifestyle store for mobiles, computers, home appliances, outlet deals, sportswear, fashion, industrial services and tourism. Secure checkout, fast delivery and real customer care.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: title,
    template: "%s | DeSinaHub",
  },
  description,
  applicationName: "DeSinaHub",
  keywords: [
    "DeSinaHub",
    "DeSina",
    "ديسينا هب",
    "مobiles Egypt",
    "iPhone Egypt",
    "laptops Egypt",
    "home appliances Egypt",
    "outlet Egypt",
    "sports wear",
    "fashion Egypt",
    "صناعة",
    "سياحة",
    "online store Egypt",
  ],
  authors: [{ name: "DeSinaHub", url: SITE_URL }],
  creator: "DeSinaHub",
  publisher: "DeSinaHub",
  category: "shopping",
  alternates: {
    canonical: "/",
    languages: {
      "ar-EG": "/",
      "en-EG": "/",
    },
  },
  openGraph: {
    type: "website",
    siteName: "DeSinaHub",
    locale: "ar_EG",
    alternateLocale: ["en_EG"],
    url: "/",
    title: "DeSinaHub",
    description: "DeSinaHub E-Commerce Ecosystem",
    images: [
      {
        url: "/logo7.png",
        width: 1200,
        height: 630,
        alt: "DeSinaHub",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DeSinaHub",
    description: "DeSinaHub E-Commerce Ecosystem",
    images: ["/logo7.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.jpg", type: "image/jpeg" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/favicon.jpg",
    apple: "/icons/icon-192.png",
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "DeSinaHub",
    statusBarStyle: "black-translucent",
    startupImage: ["/splash-rounded.png"],
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  verification: {
    google: "X-fwFque7CEQ0T2Vrh6nimM3vDej5STSHL6hXf9S77Q",
    other: {
      "msvalidate.01": "886ACF06EC010EC5377A50703BBC6DB7",
      "facebook-domain-verification": "fdhlgi26ac8d3imxxha6bulwx6d23m",
      "trustpilot-one-time-domain-verification-id": "602d32f3-2318-4831-8eb1-1ea33f0da83c",
      "p:domain_verify": "24b44997610ac39babf05a6d4620fa9f",
      "mcp-tool":
        "search-products: description='Search for products in the store using keywords; البحث عن منتجات في المتجر باستخدام الكلمات المفتاحية'",
    },
  },
  other: {
    google: "notranslate",
    distribution: "global",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "auto",
  colorScheme: "light",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#EDE6D6" },
    { media: "(prefers-color-scheme: dark)", color: "#EDE6D6" },
  ],
}; 

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const lang = await getServerLang();

  return (
    <html lang={lang} dir={dirFor(lang)} className={cairo.variable} suppressHydrationWarning>
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />

        <link
  rel="preload"
  as="image"
  href="/_next/image?url=%2Fproducts%2Fhero.jpg&w=3840&q=75"
  imageSizes="(max-width: 900px) 100vw, 52vw"
  imageSrcSet="/_next/image?url=%2Fproducts%2Fhero.jpg&w=384&q=75 384w, /_next/image?url=%2Fproducts%2Fhero.jpg&w=640&q=75 640w, /_next/image?url=%2Fproducts%2Fhero.jpg&w=750&q=75 750w, /_next/image?url=%2Fproducts%2Fhero.jpg&w=828&q=75 828w, /_next/image?url=%2Fproducts%2Fhero.jpg&w=1080&q=75 1080w, /_next/image?url=%2Fproducts%2Fhero.jpg&w=1200&q=75 1200w, /_next/image?url=%2Fproducts%2Fhero.jpg&w=1920&q=75 1920w, /_next/image?url=%2Fproducts%2Fhero.jpg&w=2048&q=75 2048w, /_next/image?url=%2Fproducts%2Fhero.jpg&w=3840&q=75 3840w"
  fetchPriority="high"
/>
           
    <link 
  rel="preload" 
  href="/fonts/Cairo-VariableFont_slnt,wght.woff2" 
  as="font" 
  type="font/woff2" 
  crossOrigin="anonymous" 
/>
    

             {/* 2. الاتصالات الخفيفة للسوشيال ميديا (DNS Prefetch) */}
     <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
     <link rel="dns-prefetch" href="https://vercel.live" />
     <link rel="dns-prefetch" href="https://connect.facebook.net" />
     <link rel="dns-prefetch" href="https://analytics.tiktok.com" />
</head>
      <body>
        <I18nProvider initialLang={lang}>
          <CartProvider>
            <SiteChrome>{children}</SiteChrome>
          </CartProvider>
        </I18nProvider>
        <Analytics />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
