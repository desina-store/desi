import type { Metadata } from 'next';
import { CATEGORY_BY_SLUG, SITE_URL, type CategorySlug } from './site';

export function categoryMetadata(slug: CategorySlug): Metadata {
  const def = CATEGORY_BY_SLUG.get(slug);
  if (!def) return {};
  return {
    title: def.name.en,
    description: def.intro.en,
    alternates: { canonical: `/${slug}` },
    openGraph: {
      title: `${def.name.en} | DeSinaHub`,
      description: def.intro.en,
      url: `${SITE_URL}/${slug}`,
      images: [{ url: def.image, alt: def.name.en }],
    },
  };
}

export function pageMetadata(title: string, description: string, path: string): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} | DeSinaHub`,
      description,
      url: `${SITE_URL}${path}`,
      images: [{ url: '/logo7.png', alt: 'DeSinaHub' }],
    },
  };
}
