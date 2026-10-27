import type { MetadataRoute } from 'next';
import { CATEGORIES, SITE_URL } from '@/lib/site';
import { products } from '@/lib/products';

const STATIC_ROUTES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
  { path: '/', priority: 1, changeFrequency: 'daily' },
  { path: '/offers', priority: 0.9, changeFrequency: 'daily' },
  { path: '/industrial', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/tourism', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/reviews', priority: 0.6, changeFrequency: 'weekly' },
  { path: '/support', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/faq', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/policies', priority: 0.5, changeFrequency: 'yearly' },
  { path: '/return-policy', priority: 0.5, changeFrequency: 'yearly' },
  { path: '/tracking', priority: 0.5, changeFrequency: 'monthly' },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const shops = CATEGORIES.filter((category) => category.catalog.length > 0);

  return [
    ...STATIC_ROUTES.map((route) => ({
      url: `${SITE_URL}${route.path}`,
      lastModified,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...shops.map((category) => ({
      url: `${SITE_URL}/${category.slug}`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    })),
    ...products.map((product) => ({
      url: `${SITE_URL}/product/${product.code}`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
      images: [`${SITE_URL}${product.image}`],
    })),
  ];
}
