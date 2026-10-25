import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: { root: projectRoot },
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'www.desinahub.com', pathname: '/**' },
      { protocol: 'https', hostname: 'desinahub.com', pathname: '/**' },
    ],
  },
  async redirects() {
    const legacy = [
      'index', 'cart', 'checkout', 'mobiles', 'computers', 'appliances', 'outlet',
      'sports', 'fashion', 'industrial', 'tourism', 'offers', 'support', 'policies',
      'return-policy', 'faq', 'reviews', 'tracking', 'account', 'orders', 'admin',
    ];
    return legacy.map((page) => ({
      source: `/${page}.html`,
      destination: page === 'index' ? '/' : `/${page}`,
      permanent: true,
    }));
  },
  async headers() {
    return [
      {
        source: '/sw.js',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' }],
      },
      {
        source: '/manifest.webmanifest',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=3600' }],
      },
      {
        source: '/:all*(woff|woff2|ttf|eot|otf|jpg|jpeg|png|gif|webp|avif|svg|ico)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/(.*)',
        headers: [
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Referrer-Policy', value: 'no-referrer-when-downgrade' },
        ],
      },
    ];
  },
};

export default nextConfig;
