import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  BadgeCheck,
  RotateCcw,
  ShieldCheck,
  Truck,
  Zap,
} from 'lucide-react';
import { JsonLd } from '@/components/ui/JsonLd';
import { ProductActions } from '@/components/product/ProductActions';
import { ProductGrid } from '@/components/catalog/ProductGrid';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Stars } from '@/components/ui/Stars';
import { Breadcrumbs } from '@/components/ui/PageHero';
import { getServerLang } from '@/lib/server';
import { translate } from '@/lib/i18n';
import { breadcrumbSchema, productSchema } from '@/lib/store-schema';
import {
  categorySlugFor,
  discountPercent,
  getProduct,
  isDiscounted,
  parseProductCode,
  productSpecs,
  relatedProducts,
} from '@/lib/products';
import { formatPrice } from '@/lib/format';
import { CATEGORY_BY_SLUG, SITE_URL } from '@/lib/site';
import { PDP_COPY, pick } from '@/lib/brand-copy';

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
  const name = product.name[lang];
  const brand = product.info.brand?.[lang];
  const categorySlug = categorySlugFor(product);
  const category = categorySlug ? CATEGORY_BY_SLUG.get(categorySlug) : undefined;
  const specs = productSpecs(product, lang);
  const related = relatedProducts(product, 4);
  const discount = discountPercent(product);
  const discounted = isDiscounted(product);
  const saving = discounted && product.oldPrice ? product.oldPrice - product.price : 0;
  const isDigital = product.kind === 'digital';
  const description = category?.intro[lang] ?? name;

  const crumbs = [
    { name: lang === 'ar' ? 'الرئيسية' : 'Home', path: '/' },
    ...(categorySlug && category ? [{ name: category.name[lang], path: `/${categorySlug}` }] : []),
    { name, path: `/product/${product.code}` },
  ];

  return (
    <div className="product-page">
      <JsonLd data={productSchema(product, categorySlug)} />
      <JsonLd data={breadcrumbSchema(crumbs)} />

      <div className="shell">
        <Breadcrumbs
          items={[
            { label: category ? category.name[lang] : tr('nav.store'), href: categorySlug ? `/${categorySlug}` : '/' },
            { label: name },
          ]}
        />

        <div className="product-detail">
          <div className="product-gallery">
            <div className="product-gallery__main">
              <Image
                src={product.image}
                alt={name}
                fill
                priority
                sizes="(max-width: 900px) 100vw, 50vw"
                quality={92}
                style={{ objectFit: 'contain', padding: 'clamp(18px, 4vw, 44px)' }}
              />
              <div className="product-gallery__topline">
                <div className="product-gallery__badges">
                  {discount ? <span className="product-gallery__tag is-accent">−{discount}%</span> : null}
                  {isDigital ? (
                    <span className="product-gallery__tag">
                      <Zap aria-hidden="true" />
                      {pick(lang, PDP_COPY.digitalDelivery.en, PDP_COPY.digitalDelivery.ar)}
                    </span>
                  ) : null}
                  {brand ? <span className="product-gallery__tag">{brand}</span> : null}
                </div>
                <span className="product-gallery__tag">
                  <BadgeCheck aria-hidden="true" />
                  {pick(lang, PDP_COPY.authentic.en, PDP_COPY.authentic.ar)}
                </span>
              </div>
            </div>
            <div className="product-gallery__foot">
              <span className="gallery-note">
                <ShieldCheck aria-hidden="true" />
                {tr('co.secure')}
              </span>
              <span className="gallery-note">
                <Truck aria-hidden="true" />
                {tr('pdp.delivery')}
              </span>
              <span className="gallery-note">
                <RotateCcw aria-hidden="true" />
                {pick(lang, PDP_COPY.returns.en, PDP_COPY.returns.ar)}
              </span>
            </div>
          </div>

          <div className="product-info">
            <div className="product-info__kicker">
              <span>CODE-{product.code}</span>
              {category ? (
                <Link href={`/${categorySlug}`} className="chip">
                  {category.name[lang]}
                </Link>
              ) : null}
            </div>
            <h1>{name}</h1>

            <div className="product-rating">
              <Stars rating={4.8} label={pick(lang, PDP_COPY.reviews.en, PDP_COPY.reviews.ar)} />
              <strong>4.8</strong>
              <Link href="/reviews" className="text-link">
                {pick(lang, PDP_COPY.reviews.en, PDP_COPY.reviews.ar)}
              </Link>
            </div>

            <div className="product-price-row">
              <span className="price">{formatPrice(product.price, lang)}</span>
              {product.oldPrice ? <span className="old-price">{formatPrice(product.oldPrice, lang)}</span> : null}
              {saving > 0 ? (
                <span className="product-save">
                  {tr('pdp.youSave')} {formatPrice(saving, lang)}
                </span>
              ) : null}
            </div>

            <p className="product-description">{description}</p>

            <ProductActions product={product} />

            <div className="product-trust">
              <div className="product-trust__row">
                <Truck aria-hidden="true" />
                <div>
                  <strong>{tr('pdp.delivery')}</strong>
                  <span>{pick(lang, PDP_COPY.deliveryText.en, PDP_COPY.deliveryText.ar)}</span>
                </div>
              </div>
              <div className="product-trust__row">
                <RotateCcw aria-hidden="true" />
                <div>
                  <strong>{pick(lang, PDP_COPY.returns.en, PDP_COPY.returns.ar)}</strong>
                  <span>{pick(lang, PDP_COPY.returnsText.en, PDP_COPY.returnsText.ar)}</span>
                </div>
              </div>
              <div className="product-trust__row">
                <ShieldCheck aria-hidden="true" />
                <div>
                  <strong>{tr('pdp.warranty')}</strong>
                  <span>{pick(lang, PDP_COPY.warrantyText.en, PDP_COPY.warrantyText.ar)}</span>
                </div>
              </div>
            </div>

            <div className="product-panels">
              <details className="product-panel" open>
                <summary>{pick(lang, PDP_COPY.details.en, PDP_COPY.details.ar)}</summary>
                <div className="product-panel__body">
                  <p>{description}</p>
                  <p>{tr('co.secure')}</p>
                </div>
              </details>

              <details className="product-panel">
                <summary>{pick(lang, PDP_COPY.specifications.en, PDP_COPY.specifications.ar)}</summary>
                <div className="product-panel__body">
                  <dl className="spec-list">
                    {specs.map((spec) => (
                      <div className="spec-list__row" key={spec.labelKey}>
                        <dt>{tr(spec.labelKey)}</dt>
                        <dd>{spec.value}</dd>
                      </div>
                    ))}
                    <div className="spec-list__row">
                      <dt>{tr('pdp.code')}</dt>
                      <dd>CODE-{product.code}</dd>
                    </div>
                    <div className="spec-list__row">
                      <dt>{tr('pdp.category')}</dt>
                      <dd>{category ? category.name[lang] : product.category}</dd>
                    </div>
                  </dl>
                </div>
              </details>

              <details className="product-panel">
                <summary>{pick(lang, PDP_COPY.deliveryReturns.en, PDP_COPY.deliveryReturns.ar)}</summary>
                <div className="product-panel__body">
                  <p>{pick(lang, PDP_COPY.deliveryText.en, PDP_COPY.deliveryText.ar)}</p>
                  <p>{pick(lang, PDP_COPY.warrantyText.en, PDP_COPY.warrantyText.ar)}</p>
                  <p>{pick(lang, PDP_COPY.returnsText.en, PDP_COPY.returnsText.ar)}</p>
                </div>
              </details>
            </div>
          </div>
        </div>

        {related.length ? (
          <div className="related-space">
            <SectionHeading
              eyebrow={pick(lang, PDP_COPY.keepExploring.en, PDP_COPY.keepExploring.ar)}
              title={tr('pdp.related')}
              action={
                categorySlug
                  ? { href: `/${categorySlug}`, label: tr('common.viewAll') }
                  : undefined
              }
            />
            <ProductGrid items={related} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
