import rawCatalog from './catalog.json';
import { CATEGORIES, CATEGORY_BY_SLUG, type CategorySlug, type Lang } from './site';

export type Localized = { ar: string; en: string };

export type ProductKind = 'outlet' | 'hardware' | 'sports' | 'digital';

export type ProductInfo = Partial<{
  brand: Localized;
  spec: Localized;
  warranty: Localized;
  fabric: Localized;
  sizes: Localized;
  itemType: Localized;
  type: Localized;
  duration: Localized;
  dev: Localized;
}>;

export type Product = {
  code: number;
  name: Localized;
  category: string;
  image: string;
  kind: ProductKind;
  price: number;
  oldPrice?: number;
  info: ProductInfo;
};

type RawProduct = {
  code: number;
  name: Localized;
  category: string;
  img: string;
  type: string;
  price: number;
  oldPrice?: number;
  info: ProductInfo;
};

/**
 * The archived catalog drifts between departments: iPhones were filed under
 * "Computers", TVs under "Mobiles", and outlet jackets/TVs only under "Outlet".
 * Department pages must stay accurate, so each known product is anchored here.
 */
const DEPARTMENT_BY_NAME: Record<string, string> = {
  'desina urban jacket [outlet]': 'Fashion',
  'lg smart tv 50 inch [outlet]': 'Appliances',
  'samsung crystal uhd 55 inch': 'Appliances',
  'iphone 16 pro max 256gb': 'Mobiles',
  'apple airpods pro gen 2': 'Mobiles',
  'anker soundcore liberty 4': 'Mobiles',
  'pro compression gym t-shirt': 'Sports',
  'performance athletic shorts': 'Sports',
  'windows 11 pro genuine key': 'Computers',
  'office 365 pro plus account': 'Computers',
  'kaspersky total security': 'Computers',
  'gemini advanced premium pack': 'Computers',
  'chatgpt plus shared plan': 'Computers',
  'bitdefender total security': 'Computers',
};

function departmentFor(raw: RawProduct): string {
  return DEPARTMENT_BY_NAME[raw.name.en.trim().toLowerCase()] ?? raw.category;
}

function toProduct(raw: RawProduct): Product {
  return {
    code: raw.code,
    name: raw.name,
    category: departmentFor(raw),
    image: raw.img.startsWith('/') ? raw.img : `/${raw.img}`,
    kind: raw.type as ProductKind,
    price: raw.price,
    oldPrice: raw.oldPrice,
    info: raw.info ?? {},
  };
}

export const products: Product[] = (rawCatalog as RawProduct[]).map(toProduct);

const byCode = new Map(products.map((p) => [p.code, p]));

export const SALE_CATEGORY = 'Outlet';

export function getProduct(code: number | string): Product | undefined {
  const numeric = typeof code === 'string' ? Number(code.replace(/^code-/i, '')) : code;
  if (!Number.isFinite(numeric)) return undefined;
  return byCode.get(numeric);
}

export function parseProductCode(value: string | undefined | null): number | null {
  if (!value) return null;
  const numeric = Number(String(value).replace(/^code-/i, '').trim());
  return Number.isInteger(numeric) && numeric > 0 ? numeric : null;
}

export function productsForCategory(slug: CategorySlug): Product[] {
  if (slug === 'outlet') return dealsProducts();
  const def = CATEGORY_BY_SLUG.get(slug);
  if (!def) return [];
  return products.filter((p) => def.catalog.includes(p.category));
}

export function discountPercent(product: Product): number | null {
  if (product.kind !== 'outlet') return null;
  const base = product.oldPrice && product.oldPrice > product.price ? product.oldPrice : null;
  if (!base) return null;
  return Math.max(1, Math.round(((base - product.price) / base) * 100));
}

export function isDiscounted(product: Product): boolean {
  return Boolean(product.oldPrice && product.oldPrice > product.price);
}

export function searchProducts(query: string): Product[] {
  const term = query.trim().toLowerCase();
  if (!term) return products;
  return products.filter((p) => {
    const haystack = [`code-${p.code}`, p.name.ar, p.name.en, p.category, p.kind].join(' ').toLowerCase();
    return haystack.includes(term);
  });
}

export function dealsProducts(): Product[] {
  return products.filter(isDiscounted);
}

export function relatedProducts(product: Product, limit = 4): Product[] {
  const sameCategory = products.filter((p) => p.code !== product.code && p.category === product.category);
  const sameKind = products.filter(
    (p) => p.code !== product.code && p.category !== product.category && p.kind === product.kind,
  );
  return [...sameCategory, ...sameKind].slice(0, limit);
}

export function featuredProducts(limit = 8): Product[] {
  const seen = new Set<string>();
  const picked: Product[] = [];
  for (const product of products) {
    if (seen.has(product.name.en)) continue;
    seen.add(product.name.en);
    picked.push(product);
    if (picked.length >= limit) break;
  }
  return picked;
}

export function categoryNameForSlug(slug: CategorySlug, lang: Lang): string {
  return CATEGORY_BY_SLUG.get(slug)?.name[lang] ?? '';
}

const CATALOG_TO_SLUG = new Map<string, CategorySlug>();
for (const category of CATEGORIES) {
  for (const name of category.catalog) {
    if (!CATALOG_TO_SLUG.has(name)) CATALOG_TO_SLUG.set(name, category.slug);
  }
}

export function categorySlugFor(product: Product): CategorySlug | null {
  return CATALOG_TO_SLUG.get(product.category) ?? null;
}

export function productHref(product: Product): string {
  return `/product/${product.code}`;
}

export const SPEC_LABEL_KEYS: Record<string, string> = {
  brand: 'pdp.brand',
  spec: 'pdp.spec',
  warranty: 'pdp.warranty',
  fabric: 'pdp.fabric',
  sizes: 'pdp.sizes',
  itemType: 'pdp.type',
  type: 'pdp.license',
  duration: 'pdp.validity',
  dev: 'pdp.devices',
};

export function productSpecs(product: Product, lang: Lang): { labelKey: string; value: string }[] {
  const keys: (keyof ProductInfo)[] =
    product.kind === 'digital'
      ? ['type', 'duration', 'dev']
      : product.kind === 'sports'
        ? ['fabric', 'sizes', 'itemType']
        : ['brand', 'spec', 'warranty'];

  return keys
    .map((key) => ({ key, value: product.info[key]?.[lang]?.trim() ?? '' }))
    .filter(({ key, value }) => {
      if (!value) return false;
      // The legacy catalog reused the warranty slot for "Save N EGP" notes on some outlet rows.
      return !(key === 'warranty' && /save|وفرت/i.test(value));
    })
    .map(({ key, value }) => ({
      labelKey: SPEC_LABEL_KEYS[key] ?? key,
      value,
    }));
}

