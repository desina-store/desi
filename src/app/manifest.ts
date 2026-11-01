import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'DeSinaHub — ديسينا ستور',
    short_name: 'DeSinaHub',
    description:
      'DeSinaHub online store: mobiles, electronics, computers, home appliances, sports wear, fashion, industrial and tourism services across Egypt.',
    id: '/',
    start_url: '/?source=pwa',
    scope: '/',
    display: 'standalone',
    display_override: ['standalone', 'minimal-ui', 'browser'],
    orientation: 'portrait-primary',
    background_color: '#F5F5DC',
    theme_color: '#F5F5DC',
    lang: 'en',
    dir: 'auto',
    categories: ['shopping', 'electronics', 'lifestyle'],
    icons: [
      { src: '/192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/splash-rounded.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icon-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    shortcuts: [
      { name: 'Store Hub', short_name: 'Store', url: '/', icons: [{ src: '/192.png', sizes: '192x192' }] },
      { name: 'Offers', short_name: 'Offers', url: '/offers', icons: [{ src: '/192.png', sizes: '192x192' }] },
      { name: 'Cart', short_name: 'Cart', url: '/cart', icons: [{ src: '/192.png', sizes: '192x192' }] },
      { name: 'Track order', short_name: 'Track', url: '/tracking', icons: [{ src: '/192.png', sizes: '192x192' }] },
    ],
  };
}
