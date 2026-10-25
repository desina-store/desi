import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Boxes,
  ShieldCheck,
  Sparkles,
  Tag,
  Truck,
  Zap,
} from 'lucide-react';
import { JsonLd } from '@/components/ui/JsonLd';
import { ProductActions } from '@/components/product/ProductActions';
import { ProductGrid } from '@/components/catalog/ProductGrid';
import { Stars } from '@/components/ui/Stars';
import { getServerLang } from '@/lib/server';
import { translate } from '@/lib/i18n';
import { breadcrumbSchema, productSchema } from '@/lib/store-schema';
import { categorySlugFor, getProduct, isDiscounted, parseProductCode, productSpecs, relatedProducts } from '@/lib/products';
import { formatPrice } from '@/lib/format';
import { CATEGORY_BY_SLUG, SITE_URL } from '@/lib/site';

type ProductPageProps = { params: Promise<{ code: string }> };

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { code } = await params;
  const numeric = parseProductCode(code);
  const product = numeric ? getProduct(numeric) : undefined;
  if (!product) return { title: 'Product not found' };

  const title = product.name.en;
  const description = `${product.name.en} (${product.name.ar}) at DeSinaHub — ${formatPrice(product.price, 'en')}. Code CODE-${product.code}. Secure payment and nationwide delivery.`;
  const url = `/product/${product.code}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      title: `${title} | DeSinaHub`,
      description,
      url: `${SITE_URL}${url}`,
      images: [{ url: product.image, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [product.image],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { code } = await params;
  const numeric = parseProductCode(code);
  const product = numeric ? getProduct(numeric) : undefined;
  if (!product) notFound();

  const lang = await getServerLang();
  const tr = (key: string) => translate(lang, key);
  const categorySlug = categorySlugFor(product);
  const category = categorySlug ? CATEGORY_BY_SLUG.get(categorySlug) : undefined;
  const specs = productSpecs(product, lang);
  const related = relatedProducts(product, 4);
  const discounted = isDiscounted(product);
  const saving = discounted && product.oldPrice ? product.oldPrice - product.price : 0;
  const shareText = encodeURIComponent(
    `${product.name[lang]} — ${formatPrice(product.price, lang)}\n${SITE_URL}/product/${product.code}`,
  );

  const crumbs = [
    { name: lang === 'ar' ? 'الرئيسية' : 'Home', path: '/' },
    ...(categorySlug && category ? [{ name: category.name[lang], path: `/${categorySlug}` }] : []),
    { name: product.name[lang], path: `/product/${product.code}` },
  ];

  return (
    <div className="page-shell py-7 md:py-10">
      <JsonLd data={productSchema(product, categorySlug)} />
      <JsonLd data={breadcrumbSchema(crumbs)} />

      <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-1.5 text-[0.625rem] font-bold text-ink/45">
        {crumbs.map((crumb, index) => (
          <span key={crumb.path} className="flex items-center gap-1.5">
            {index > 0 ? <span aria-hidden>/</span> : null}
            {index === crumbs.length - 1 ? (
              <span className="line-clamp-1 max-w-[16rem] text-ink/70">{crumb.name}</span>
            ) : (
              <Link href={crumb.path} className="transition-colors hover:text-ink">
                {crumb.name}
              </Link>
            )}
          </span>
        ))}
      </nav>

      <div className="grid gap-6 lg:grid-cols-[1.02fr_1fr] lg:items-start lg:gap-10">
        <div className="lg:sticky lg:top-24">
          <div className="rounded-[2rem] border border-ink/[0.07] bg-white/60 p-2.5 shadow-card backdrop-blur-sm">
            <div className="product-media relative aspect-square rounded-[1.5rem]">
              <Image
                src={product.image}
                alt={product.name[lang]}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 560px"
                className="object-cover"
              />
              <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
                {discounted ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-brand-red px-3 py-1.5 text-[0.625rem] font-extrabold uppercase tracking-[0.08em] text-white">
                    <Tag className="h-3 w-3" />
                    {lang === 'ar' ? 'عرض الأوت ليت' : 'Outlet deal'}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1.5 text-[0.625rem] font-extrabold uppercase tracking-[0.08em] text-olive backdrop-blur">
                    <BadgeCheck className="h-3 w-3" />
                    {tr('pdp.genuine')}
                  </span>
                )}
                <span className="rounded-full bg-ink/85 px-2.5 py-1.5 font-mono text-[0.625rem] font-bold text-white/90 backdrop-blur">
                  CODE-{product.code}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2">
            <span className="flex flex-col items-center gap-1 rounded-xl border border-ink/[0.06] bg-white/55 px-2 py-2.5 text-center">
              <Truck className="h-4 w-4 text-olive" />
              <span className="text-[0.5625rem] font-bold leading-tight text-ink/60">{tr('pdp.delivery')}</span>
            </span>
            <span className="flex flex-col items-center gap-1 rounded-xl border border-ink/[0.06] bg-white/55 px-2 py-2.5 text-center">
              <ShieldCheck className="h-4 w-4 text-olive" />
              <span className="text-[0.5625rem] font-bold leading-tight text-ink/60">{tr('pdp.genuine')}</span>
            </span>
            <span className="flex flex-col items-center gap-1 rounded-xl border border-ink/[0.06] bg-white/55 px-2 py-2.5 text-center">
              <Zap className="h-4 w-4 text-olive" />
              <span className="text-[0.5625rem] font-bold leading-tight text-ink/60">
                {product.kind === 'digital' ? tr('pdp.activation') : tr('pdp.instock')}
              </span>
            </span>
          </div>
        </div>

        <div>
          {category && categorySlug ? (
            <Link
              href={`/${categorySlug}`}
              className="inline-flex items-center gap-1.5 rounded-full bg-olive/10 px-3 py-1 text-[0.5625rem] font-extrabold uppercase tracking-[0.14em] text-olive transition-colors hover:bg-olive/15"
            >
              <Boxes className="h-3 w-3" />
              {category.name[lang]}
            </Link>
          ) : null}

          <h1 className="mt-3 text-balance text-2xl font-extrabold leading-[1.16] tracking-tight text-ink md:text-4xl">
            {product.name[lang]}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <Stars rating={4.8} />
            <span className="text-[0.6875rem] font-bold text-muted">
              4.8 · {lang === 'ar' ? '1200+ تقييم' : '1,200+ reviews'}
            </span>
            <Link href="/reviews" className="text-[0.6875rem] font-extrabold text-olive underline decoration-canary-deep decoration-2 underline-offset-4">
              {lang === 'ar' ? 'شارك تقييمك' : 'Write a review'}
            </Link>
          </div>

          <div className="mt-5 flex flex-wrap items-end gap-3">
            <span className="text-3xl font-extrabold tracking-tight text-ink md:text-4xl">
              {formatPrice(product.price, lang)}
            </span>
            {discounted && product.oldPrice ? (
              <span className="pb-1 text-sm font-bold text-muted line-through">{formatPrice(product.oldPrice, lang)}</span>
            ) : null}
            {saving > 0 ? (
              <span className="mb-1 inline-flex items-center gap-1 rounded-full bg-canary px-2.5 py-1 text-[0.625rem] font-extrabold text-ink">
                <Sparkles className="h-3 w-3" />
                {tr('pdp.youSave')} {formatPrice(saving, lang)}
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-[0.6875rem] font-semibold text-muted">{tr('pdp.instock')}</p>

          <ProductActions product={product} />

          <div className="mt-6 rounded-[1.5rem] border border-ink/[0.07] bg-white/55 p-4">
            <h2 className="text-sm font-extrabold text-ink">{tr('pdp.specs')}</h2>
            <dl className="mt-3 grid gap-2 sm:grid-cols-2">
              {specs.map((spec) => (
                <div key={spec.labelKey} className="rounded-xl bg-cream/60 px-3 py-2.5">
                  <dt className="text-[0.5625rem] font-extrabold uppercase tracking-[0.12em] text-muted">
                    {tr(spec.labelKey)}
                  </dt>
                  <dd className="mt-0.5 text-xs font-extrabold leading-snug text-ink">{spec.value}</dd>
                </div>
              ))}
              <div className="rounded-xl bg-cream/60 px-3 py-2.5">
                <dt className="text-[0.5625rem] font-extrabold uppercase tracking-[0.12em] text-muted">
                  {tr('pdp.code')}
                </dt>
                <dd className="mt-0.5 font-mono text-xs font-extrabold leading-snug text-ink">CODE-{product.code}</dd>
              </div>
              <div className="rounded-xl bg-cream/60 px-3 py-2.5">
                <dt className="text-[0.5625rem] font-extrabold uppercase tracking-[0.12em] text-muted">
                  {tr('pdp.category')}
                </dt>
                <dd className="mt-0.5 text-xs font-extrabold leading-snug text-ink">
                  {category ? category.name[lang] : product.category}
                </dd>
              </div>
            </dl>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <a
              href={`https://wa.me/?text=${shareText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost text-xs"
            >
              {tr('pdp.share')}
              <ArrowRight className="h-3.5 w-3.5 rtl-flip" />
            </a>
            <Link href={categorySlug ? `/${categorySlug}` : '/'} className="btn-ghost text-xs">
              <ArrowLeft className="h-3.5 w-3.5 rtl-flip" />
              {tr('pdp.back')} {category ? category.short[lang] : tr('nav.store')}
            </Link>
          </div>

          <p className="mt-4 rounded-xl bg-canary/25 px-3.5 py-2.5 text-[0.625rem] leading-relaxed text-ink/65">
            {tr('co.secure')} {product.kind === 'digital' ? tr('pdp.activation') : tr('co.delivery')}
          </p>
        </div>
      </div>

      {related.length ? (
        <section className="mt-14">
          <div className="mb-5 flex items-end justify-between gap-3">
            <div>
              <span className="text-[0.625rem] font-extrabold uppercase tracking-[0.18em] text-olive">
                {lang === 'ar' ? 'من نفس القسم' : 'Same department'}
              </span>
              <h2 className="mt-1 text-xl font-extrabold text-ink md:text-2xl">{tr('pdp.related')}</h2>
            </div>
            {categorySlug ? (
              <Link href={`/${categorySlug}`} className="text-[0.6875rem] font-extrabold text-olive underline decoration-canary-deep decoration-2 underline-offset-4">
                {tr('common.viewAll')}
              </Link>
            ) : null}
          </div>
          <ProductGrid items={related} />
        </section>
      ) : null}
    </div>
  );
}
