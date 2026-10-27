import { CATEGORY_BY_SLUG, SITE_URL, type CategorySlug } from './site';
import type { Product } from './products';

/**
 * The original store graph from index.html, preserved verbatim.
 * Do not restructure, rename @ids, or drop properties: search engines and
 * the archived rich results are bound to these exact identifiers.
 */
export const STORE_SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'OnlineStore',
      '@id': 'https://www.desinahub.com/#store',
      name: 'DeSinaHub',
      alternateName: 'desinahub',
      url: 'https://www.desinahub.com/',
      logo: {
        '@type': 'ImageObject',
        '@id': 'https://www.desinahub.com/#logo',
        url: 'https://www.desinahub.com/logo.png',
        contentUrl: 'https://www.desinahub.com/logo.png',
      },
      image: {
        '@id': 'https://www.desinahub.com/#logo',
      },
      description:
        'DeSinaHub is an online shopping platform offering mobiles and electronics, computers and accessories, home appliances, outlet products, sports wear, fashion, industrial services and tourism services.',
      email: 'info@desinahub.com',
      telephone: ['+20 1001283311', '+20 1105535538'],
      sameAs: [
        'https://www.facebook.com/desinahub',
        'https://www.instagram.com/desinahub',
        'https://www.tiktok.com/@desinahub',
        'https://www.youtube.com/@desinahub',
        'https://x.com/desinahub',
        'https://www.google.com/maps/place/desinahub/@30.050746,31.2039679,17z/data=!3m1!4b1!4m6!3m5!1s0x1458410060217473:0xa799a6d41e740766!8m2!3d30.0507414!4d31.201393!16s%2Fg%2F11xkx028t0?entry=ttu',
        'https://www.pinterest.com/desinahub',
      ],
      contactPoint: [
        {
          '@type': 'ContactPoint',
          contactType: 'customer support',
          email: 'info@desinahub.com',
          telephone: '+20 1001283311',
          availableLanguage: ['Arabic', 'English'],
        },
        {
          '@type': 'ContactPoint',
          contactType: 'customer support',
          telephone: '+20 1105535538',
          availableLanguage: ['Arabic', 'English'],
        },
      ],
      knowsAbout: [
        'Mobiles & Electronics',
        'Computers & Accessories',
        'Home Appliances',
        'Outlet Products',
        'Sports Wear',
        'Fashion',
        'Industrial Services',
        'Tourism Services',
        'Online Shopping',
      ],
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        reviewCount: '1200',
      },
    },
    {
      '@type': 'WebSite',
      '@id': 'https://www.desinahub.com/#website',
      url: 'https://www.desinahub.com/',
      name: 'DeSinaHub',
      alternateName: 'desinahub',
      publisher: {
        '@id': 'https://www.desinahub.com/#store',
      },
      inLanguage: ['ar', 'en'],
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://www.desinahub.com/search?q={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'WebPage',
      '@id': 'https://www.desinahub.com/#homepage',
      url: 'https://www.desinahub.com/',
      name: 'DeSinaHub — Online Store',
      isPartOf: {
        '@id': 'https://www.desinahub.com/#website',
      },
      about: {
        '@id': 'https://www.desinahub.com/#store',
      },
      publisher: {
        '@id': 'https://www.desinahub.com/#store',
      },
      primaryImageOfPage: {
        '@id': 'https://www.desinahub.com/#logo',
      },
      inLanguage: ['ar', 'en'],
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://www.desinahub.com/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Mobiles & Electronics',
          item: 'https://www.desinahub.com/mobiles-electronics',
        },
      ],
    },
  ],
} as const;

export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

export function productSchema(product: Product, categorySlug: CategorySlug | null) {
  const availability = 'https://schema.org/InStock';
  const url = `${SITE_URL}/product/${product.code}`;
  const category = categorySlug ? CATEGORY_BY_SLUG.get(categorySlug) : undefined;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${url}#product`,
    sku: `CODE-${product.code}`,
    mpn: `CODE-${product.code}`,
    name: product.name.en,
    alternateName: product.name.ar,
    image: `${SITE_URL}${product.image}`,
    url,
    description:
      product.kind === 'digital'
        ? `${product.name.en} — genuine digital licence delivered via WhatsApp by DeSinaHub.`
        : `${product.name.en} — available at DeSinaHub with verified specifications and secure delivery across Egypt.`,
    brand: {
      '@type': 'Brand',
      name: product.info.brand?.en ?? 'DeSinaHub',
    },
    category: category?.name.en ?? product.category,
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency: 'EGP',
      price: product.price,
      availability,
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@id': 'https://www.desinahub.com/#store',
      },
    },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}
