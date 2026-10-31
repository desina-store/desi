import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  
  // تفعيل ضغط السيرفر أوتوماتيك لسرعة استجابة خارقة
  compress: true,
  reactStrictMode: true,

  turbopack: {
    root: path.resolve(import.meta.dirname),
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },

  // دمج صيغ الصور المتقدمة من ملفك القديم مع الحماية الشاملة للـ Remote Patterns
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.desinahub.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co', // مضاف لدعم جلب صور المنتجات من Supabase Storage بكفاءة
        pathname: '/**',
      },
    ],
  },

  // دمج إعدادات الأمان القوية والـ Security & Cache Headers من ملفك القديم
  // كل الترويسات في مكان واحد: vercel.json لا يعيد تعريفها حتى لا تتضاعف القيم.
  async headers() {
    return [
      {
        // ملف خدمة العامل يجب أن يُجلب دائمًا بأحدث نسخة، وإلا بقي الزوار على إصدار قديم.
        // Next.js already sends immutable caching for /_next/static on its own, so that route is left untouched.
        source: '/:all(sw.js|service-worker.js)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' },
        ],
      },
      {
        source: '/manifest.webmanifest',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=3600' }],
      },
      {
        source: '/:all(icons|products|brands|payments|fonts)/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' },
        ],
      },
      {
        // بيانات الطلبات والأسعار ديناميكية: لا تُخزَّن في وسيط أو متصفح.
        source: '/api/:path*',
        headers: [{ key: 'Cache-Control', value: 'no-store, max-age=0' }],
      },
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'no-referrer-when-downgrade' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },

  // دمج خريطة الروابط وإعادة التوجيه (Redirects) كاملة بدون نقص
  async redirects() {
    return [
      { source: "/index", destination: "/", permanent: true },
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/mobilas", destination: "/category/mobiles", permanent: true },
      { source: "/mobiles", destination: "/category/mobiles", permanent: true },
      { source: "/mobiles.html", destination: "/category/mobiles", permanent: true },
      { source: "/computers", destination: "/category/computers", permanent: true },
      { source: "/computers.html", destination: "/category/computers", permanent: true },
      { source: "/appliances", destination: "/category/appliances", permanent: true },
      { source: "/appliances.html", destination: "/category/appliances", permanent: true },
      { source: "/outlet", destination: "/category/outlet", permanent: true },
      { source: "/outlet.html", destination: "/category/outlet", permanent: true },
      { source: "/sports", destination: "/category/sports", permanent: true },
      { source: "/sports.html", destination: "/category/sports", permanent: true },
      { source: "/fashion", destination: "/category/fashion", permanent: true },
      { source: "/fashion.html", destination: "/category/fashion", permanent: true },
      { source: "/industrial", destination: "/category/industrial", permanent: true },
      { source: "/industrial.html", destination: "/category/industrial", permanent: true },
      { source: "/tourism", destination: "/category/tourism", permanent: true },
      { source: "/tourism.html", destination: "/category/tourism", permanent: true },
      { source: "/products", destination: "/shop", permanent: true },
      { source: "/services", destination: "/shop", permanent: true },
      { source: "/product.html", destination: "/shop", permanent: true },
      { source: "/shop.html", destination: "/shop", permanent: true },
      { source: "/cart.html", destination: "/cart", permanent: true },
      { source: "/checkout.html", destination: "/checkout", permanent: true },
      { source: "/orders.html", destination: "/orders", permanent: true },
      { source: "/account.html", destination: "/account", permanent: true },
      { source: "/faq.html", destination: "/faq", permanent: true },
      { source: "/policies.html", destination: "/policies", permanent: true },
      { source: "/reviews.html", destination: "/reviews", permanent: true },
      { source: "/support.html", destination: "/support", permanent: true },
      { source: "/offers.html", destination: "/offers", permanent: true },
      { source: "/return-policy", destination: "/policies", permanent: true },
      { source: "/return-policy.html", destination: "/policies", permanent: true },
      { source: "/tracking", destination: "/orders", permanent: true },
      { source: "/tracking.html", destination: "/orders", permanent: true },
      { source: "/404", destination: "/", permanent: true },
      { source: "/404.html", destination: "/", permanent: true },
      { source: "/manifest.json", destination: "/manifest.webmanifest", permanent: true },
      { source: "/track-order", destination: "/orders", permanent: true },
      { source: "/tracking-order", destination: "/orders", permanent: true },
      { source: "/new-order", destination: "/shop", permanent: false },
      { source: "/payment", destination: "/checkout", permanent: false },
      { source: "/invoice", destination: "/orders", permanent: false },
    ];
  },
};

export default nextConfig;
