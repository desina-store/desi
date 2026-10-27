import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BadgePercent, Sparkles } from 'lucide-react';
import { ProductGrid } from '@/components/catalog/ProductGrid';
import { PageHeader } from '@/components/ui/PageHeader';
import { discountPercent, dealsProducts } from '@/lib/products';
import { formatCount } from '@/lib/format';
import { translate } from '@/lib/i18n';
import { pageMetadata } from '@/lib/seo';
import { getServerLang } from '@/lib/server';
import { WHATSAPP } from '@/lib/site';

export const metadata = pageMetadata(
  'Offers & Clearance',
  'Every discounted DeSinaHub product with the markdown already applied to the final price.',
  '/offers',
);

export default async function OffersPage() {
  const lang = await getServerLang();
  const tr = (key: string) => translate(lang, key);
  const deals = [...dealsProducts()].sort((a, b) => (discountPercent(b) ?? 0) - (discountPercent(a) ?? 0));
  const best = deals[0];
  const bestDiscount = best ? discountPercent(best) : null;

  return (
    <div>
      <PageHeader eyebrow={tr('nav.offers')} title={tr('offers.title')} sub={tr('offers.sub')} tone="canary">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-ink px-3 py-1.5 text-[0.625rem] font-extrabold text-canary">
            <BadgePercent className="h-3.5 w-3.5" />
            {formatCount(deals.length, lang)} {tr('category.products')}
          </span>
          {bestDiscount ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 text-[0.625rem] font-extrabold text-ink/75">
              <Sparkles className="h-3.5 w-3.5 text-olive" />
              {lang === 'ar' ? `أعلى خصم ${bestDiscount}%` : `Up to ${bestDiscount}% off`}
            </span>
          ) : null}
          <Link href="/outlet" className="inline-flex items-center gap-1.5 rounded-full border border-ink/10 bg-white/60 px-3 py-1.5 text-[0.625rem] font-extrabold text-ink/70 transition-colors hover:bg-white">
            {tr('nav.offers')} · Outlet
            <ArrowRight className="h-3 w-3 rtl-flip" />
          </Link>
        </div>
      </PageHeader>

      <div className="page-shell py-8 md:py-12">
        {best ? (
          <div className="mb-8 overflow-hidden rounded-[2rem] border border-ink/[0.07] bg-white/65 p-2.5 shadow-card md:p-3">
            <div className="grid items-center gap-4 md:grid-cols-[0.85fr_1.15fr]">
              <div className="product-media relative aspect-[4/3] rounded-[1.5rem]">
                <Image
                  src={best.image}
                  alt={best.name[lang]}
                  fill
                  sizes="(max-width: 768px) 90vw, 420px"
                  className="object-cover"
                />
              </div>
              <div className="p-3 md:p-5">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-red px-2.5 py-1 text-[0.5625rem] font-extrabold uppercase tracking-[0.12em] text-white">
                  <BadgePercent className="h-3 w-3" />
                  {lang === 'ar' ? 'أقوى عرض' : 'Best deal'}
                </span>
                <h2 className="mt-3 text-xl font-extrabold leading-snug text-ink md:text-2xl">{best.name[lang]}</h2>
                <p className="mt-1.5 text-xs leading-relaxed text-muted">
                  {best.info.brand?.[lang] ?? best.info.fabric?.[lang] ?? best.info.type?.[lang] ?? ''}
                  {best.info.spec?.[lang] ? ` · ${best.info.spec[lang]}` : ''}
                </p>
                <div className="mt-3 flex flex-wrap items-end gap-2">
                  <span className="text-2xl font-extrabold text-ink">{best.price} {lang === 'ar' ? 'ج.م' : 'EGP'}</span>
                  {best.oldPrice ? (
                    <span className="pb-1 text-xs font-bold text-muted line-through">{best.oldPrice} {lang === 'ar' ? 'ج.م' : 'EGP'}</span>
                  ) : null}
                  {bestDiscount ? (
                    <span className="mb-1 rounded-full bg-canary px-2 py-0.5 text-[0.625rem] font-extrabold text-ink">
                      −{bestDiscount}%
                    </span>
                  ) : null}
                </div>
                <Link href={`/product/${best.code}`} className="btn-primary mt-4 text-xs">
                  {tr('card.buy')}
                  <ArrowRight className="h-3.5 w-3.5 rtl-flip" />
                </Link>
              </div>
            </div>
          </div>
        ) : null}

        <ProductGrid items={deals} emptyTitle={tr('search.noResults')} emptySub={tr('search.noResultsSub')} />

        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 rounded-[1.5rem] bg-ink px-5 py-5 text-white">
          <div>
            <p className="text-sm font-extrabold">{lang === 'ar' ? 'عايز تعرف أحدث العروض أولاً؟' : 'Want first access to new markdowns?'}</p>
            <p className="mt-1 text-xs text-white/55">{lang === 'ar' ? 'تواصل معنا على الواتساب وهنبعتلك العروض الجديدة.' : 'Message us on WhatsApp and we will share new offers first.'}</p>
          </div>
          <a
            href={`https://wa.me/${WHATSAPP}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-canary px-4 py-2 text-xs font-extrabold text-ink transition-colors hover:bg-canary-deep"
          >
            {tr('home.ctaButton')}
            <ArrowRight className="h-3.5 w-3.5 rtl-flip" />
          </a>
        </div>
      </div>
    </div>
  );
}
