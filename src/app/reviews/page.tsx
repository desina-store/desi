import Link from 'next/link';
import { ArrowRight, ExternalLink, Sparkles } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { ReviewComposer } from '@/components/reviews/ReviewComposer';
import { Stars } from '@/components/ui/Stars';
import { REVIEW_STATIC, REVIEW_TAGS, GOOGLE_REVIEW_URL, TRUSTPILOT_REVIEW_URL } from '@/lib/content';
import { translate } from '@/lib/i18n';
import { pageMetadata } from '@/lib/seo';
import { getServerLang } from '@/lib/server';

export const metadata = pageMetadata(
  'Client Reviews',
  'Read and share verified DeSinaHub reviews on Google and Trustpilot.',
  '/reviews',
);

export default async function ReviewsPage() {
  const lang = await getServerLang();
  const tr = (key: string) => translate(lang, key);

  return (
    <div>
      <PageHeader eyebrow={tr('nav.reviews')} title={tr('reviews.title')} sub={tr('reviews.sub')}>
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-full bg-ink px-3.5 py-1.5 text-[0.625rem] font-extrabold text-canary">
            4.8 / 5
            <span className="text-white/50">· 1,200+</span>
          </span>
          <a href={GOOGLE_REVIEW_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 bg-white/70 px-3.5 py-1.5 text-[0.625rem] font-extrabold text-ink">
            Google
            <ExternalLink className="h-3 w-3" />
          </a>
          <a href={TRUSTPILOT_REVIEW_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 bg-white/70 px-3.5 py-1.5 text-[0.625rem] font-extrabold text-ink">
            Trustpilot
            <ExternalLink className="h-3 w-3" />
          </a>
          <Link href="/product/2" className="inline-flex items-center gap-1.5 rounded-full bg-canary px-3.5 py-1.5 text-[0.625rem] font-extrabold text-ink">
            {tr('cart.start')}
            <ArrowRight className="h-3 w-3 rtl-flip" />
          </Link>
        </div>
      </PageHeader>

      <div className="page-shell py-8 md:py-12">
        <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr] lg:items-start">
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              {REVIEW_STATIC.map((review) => (
                <article key={review.name.en} className="surface-card flex h-full flex-col p-5">
                  <div className="flex items-center justify-between gap-2">
                    <Stars rating={review.stars} />
                    <span className="text-[0.625rem] font-bold text-muted">{review.time[lang]}</span>
                  </div>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-ink/75">&ldquo;{review.text[lang]}&rdquo;</p>
                  <div className="mt-4 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-olive/10 text-xs font-extrabold text-olive">
                      {review.avatar}
                    </span>
                    <span className="text-xs font-extrabold text-ink">{review.name[lang]}</span>
                  </div>
                </article>
              ))}
            </div>

            <div className="surface-card p-5">
              <p className="flex items-center gap-2 text-[0.625rem] font-extrabold uppercase tracking-[0.16em] text-olive">
                <Sparkles className="h-3.5 w-3.5" />
                {tr('reviews.tags')}
              </p>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {REVIEW_TAGS.map((tag) => (
                  <span key={tag.en} className="rounded-full border border-ink/10 bg-white/75 px-3 py-1.5 text-[0.6875rem] font-bold text-ink/70">
                    {tag[lang]}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <a href={GOOGLE_REVIEW_URL} target="_blank" rel="noopener noreferrer" className="surface-card flex items-center justify-between gap-3 p-4 text-sm font-extrabold text-ink transition-colors hover:border-olive/40">
                Google Reviews
                <ExternalLink className="h-4 w-4 text-olive" />
              </a>
              <a href={TRUSTPILOT_REVIEW_URL} target="_blank" rel="noopener noreferrer" className="surface-card flex items-center justify-between gap-3 p-4 text-sm font-extrabold text-ink transition-colors hover:border-olive/40">
                Trustpilot
                <ExternalLink className="h-4 w-4 text-olive" />
              </a>
            </div>
          </div>

          <ReviewComposer />
        </div>
      </div>
    </div>
  );
}
