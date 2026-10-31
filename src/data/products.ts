import raw from "./products.json";
import { normalizeText, tokenize } from "@/lib/text";

export type Lang = "en" | "ar";
export type LocalizedText = { en: string; ar: string };

export type Product = {
  code: number;
  allCodes: number[];
  name: LocalizedText;
  category: string;
  categories: string[];
  img: string;
  type: string;
  price: number;
  oldPrice?: number;
  info: Record<string, LocalizedText>;
  description: LocalizedText;
};

export const products = raw as unknown as Product[];

const byCode = new Map<number, Product>();
for (const product of products) {
  for (const code of product.allCodes) {
    byCode.set(code, product);
  }
}

export function getProductByCode(code: number | string): Product | undefined {
  const parsed = typeof code === "string" ? Number.parseInt(code, 10) : code;
  if (!Number.isFinite(parsed)) return undefined;
  return byCode.get(parsed);
}

export function isCanonicalCode(code: number): boolean {
  return products.some((product) => product.code === code);
}

export function productHref(product: Product): string {
  return `/product/${product.code}`;
}

export function discountPercent(product: Product): number {
  if (!product.oldPrice || product.oldPrice <= product.price) return 0;
  return Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);
}

export function productsInCategories(sourceCategories: readonly string[]): Product[] {
  return products.filter((product) =>
    product.categories.some((category) => sourceCategories.includes(category)),
  );
}

export function featuredProducts(limit = 8): Product[] {
  const preferred = [2, 8, 9, 10, 12, 11, 21, 17, 5, 18, 13, 121];
  const picked = preferred
    .map((code) => products.find((product) => product.code === code))
    .filter((product): product is Product => Boolean(product));
  for (const product of products) {
    if (picked.length >= limit) break;
    if (!picked.some((item) => item.code === product.code)) picked.push(product);
  }
  return picked.slice(0, limit);
}

export function dealProducts(limit = 6): Product[] {
  return products
    .filter((product) => discountPercent(product) > 0)
    .sort((a, b) => discountPercent(b) - discountPercent(a))
    .slice(0, limit);
}

export function newArrivals(limit = 4): Product[] {
  return [...products].sort((a, b) => b.code - a.code).slice(0, limit);
}

export function relatedProducts(product: Product, limit = 4): Product[] {
  const sameCategory = products.filter(
    (candidate) =>
      candidate.code !== product.code &&
      candidate.categories.some((category) => product.categories.includes(category)),
  );
  const others = products.filter(
    (candidate) =>
      candidate.code !== product.code && !sameCategory.some((item) => item.code === candidate.code),
  );
  return [...sameCategory, ...others].slice(0, limit);
}

type SearchDocument = {
  product: Product;
  nameEn: string;
  nameAr: string;
  names: string;
  facets: string;
  codes: Set<string>;
};

const searchIndex: SearchDocument[] = products.map((product) => {
  const nameEn = normalizeText(product.name.en);
  const nameAr = normalizeText(product.name.ar);
  const facets = normalizeText(
    [
      product.category,
      product.categories.join(" "),
      product.type,
      product.description?.en,
      product.description?.ar,
      ...Object.values(product.info).flatMap((value) => [value.en, value.ar]),
    ]
      .filter(Boolean)
      .join(" "),
  );
  const codes = new Set<string>();
  for (const code of product.allCodes.length ? product.allCodes : [product.code]) {
    codes.add(String(code));
    codes.add(`code-${code}`);
  }
  return { product, nameEn, nameAr, names: `${nameEn} ${nameAr}`, facets, codes };
});

function scoreDocument(
  document: SearchDocument,
  query: string,
  tokens: string[],
  codeQuery: string | null,
): number {
  let score = 0;

  if (codeQuery && document.codes.has(codeQuery)) score += 140;
  if (document.nameEn === query || document.nameAr === query) score += 200;
  else if (document.names.includes(query)) score += 55;
  if (nameStartsWith(document, query)) score += 35;

  for (const token of tokens) {
    if (document.nameEn.includes(token) || document.nameAr.includes(token)) {
      score += token.length >= 4 ? 9 : 5;
    } else if (document.facets.includes(token)) {
      score += token.length >= 4 ? 4 : 2;
    }
  }
  return score;
}

function nameStartsWith(document: SearchDocument, query: string): boolean {
  return Boolean(query) && (document.nameEn.startsWith(query) || document.nameAr.startsWith(query));
}

export function searchProducts(query: string): Product[] {
  const normalized = normalizeText(query);
  if (!normalized) return [];
  const tokens = tokenize(normalized);
  const codeQuery = /^(?:code\s*-?\s*)?(\d{1,4})$/.exec(normalized)?.[1] ?? null;
  if (!tokens.length && !codeQuery) return [];

  const scored = searchIndex.map((document, index) => ({
    index,
    product: document.product,
    score: scoreDocument(document, normalized, tokens, codeQuery),
  }));

  // Multi-word queries must agree on more than one incidental facet hit.
  const floor = tokens.length > 1 ? 3 : 1;

  return scored
    .filter((entry) => entry.score >= floor)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map((entry) => entry.product);
}

export function allBrands(): string[] {
  const brands = new Set<string>();
  for (const product of products) {
    const brand = product.info.brand?.en;
    if (brand) brands.add(brand);
  }
  return [...brands].sort((a, b) => a.localeCompare(b));
}

export function lowestPrice(categoryProducts: Product[]): number | null {
  if (!categoryProducts.length) return null;
  return Math.min(...categoryProducts.map((product) => product.price));
}
