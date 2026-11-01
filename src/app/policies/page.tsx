import Link from 'next/link';
import { ArrowRight, FileText, ShieldCheck } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { RichText } from '@/components/ui/RichText';
import { POLICY_SECTIONS } from '@/lib/content';
import { translate } from '@/lib/i18n';
import { pageMetadata } from '@/lib/seo';
import { getServerLang } from '@/lib/server';
import { WHATSAPP } from '@/lib/site';

export const metadata = pageMetadata(
  'Store Policies',
  'Every DeSinaHub policy you agree to when shopping: payments, shipping, returns and privacy.',
  '/policies',
);

export default async function PoliciesPage() {
  const lang = await getServerLang();
  const tr = (key: string) => translate(lang, key);

  return (
    <div>
      <PageHeader eyebrow={tr('nav.policies')} title={tr('policies.title')} sub={tr('policies.sub')}>
        <div className="flex flex-wrap gap-2">
          {POLICY_SECTIONS.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="rounded-full border border-ink/10 bg-white/70 px-3 py-1.5 text-[0.625rem] font-extrabold text-ink/70 transition-colors hover:border-olive hover:text-ink"
            >
              {section.label[lang]}
            </a>
          ))}
        </div>
      </PageHeader>

      <div className="page-shell grid gap-6 py-8 md:py-12 lg:grid-cols-[240px_1fr] lg:items-start">
        <aside className="surface-card sticky top-24 hidden p-4 lg:block">
          <p className="text-[0.5625rem] font-extrabold uppercase tracking-[0.16em] text-muted">{tr('nav.policies')}</p>
          <nav className="mt-3 space-y-1">
            {POLICY_SECTIONS.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-bold text-ink/65 transition-colors hover:bg-cream/70 hover:text-ink"
              >
                <FileText className="h-3.5 w-3.5 text-olive" />
                {section.label[lang]}
              </a>
            ))}
          </nav>
          <div className="mt-4 rounded-xl bg-canary/30 p-3">
            <p className="flex items-center gap-1.5 text-[0.625rem] font-extrabold text-ink">
              <ShieldCheck className="h-3.5 w-3.5 text-olive" />
              {tr('pdp.genuine')}
            </p>
            <a
              href={`https://wa.me/${WHATSAPP}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex text-[0.625rem] font-bold text-olive underline decoration-canary-deep decoration-2 underline-offset-4"
            >
              {tr('support.whatsapp')}
            </a>
          </div>
        </aside>

        <div className="space-y-5">
          {POLICY_SECTIONS.map((section) => (
            <article key={section.id} id={section.id} className="surface-card scroll-mt-24 p-5 md:p-7">
              <span className="inline-flex rounded-full bg-olive/10 px-2.5 py-1 text-[0.5625rem] font-extrabold uppercase tracking-[0.14em] text-olive">
                {section.label[lang]}
              </span>
              <h2 className="mt-3 text-xl font-extrabold leading-snug text-ink md:text-2xl">{section.title[lang]}</h2>
              <RichText text={section.intro[lang]} className="mt-3 text-sm leading-relaxed text-ink/65" />

              <div className="mt-5 space-y-3">
                {section.blocks.map((block) => (
                  <div key={block.body.en} className="rounded-2xl border border-ink/[0.06] bg-cream/45 p-4">
                    {block.heading ? (
                      <h3 className="text-sm font-extrabold text-ink">{block.heading[lang]}</h3>
                    ) : null}
                    <RichText text={block.body[lang]} className="mt-1.5 text-xs leading-relaxed text-ink/65" />
                  </div>
                ))}
              </div>

              {section.footnote ? (
                <p className="mt-4 rounded-xl bg-ink/[0.04] px-3.5 py-2.5 text-[0.625rem] leading-relaxed text-muted">
                  {section.footnote[lang]}
                </p>
              ) : null}
            </article>
          ))}

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-[1.5rem] bg-ink px-5 py-5 text-white">
            <p className="text-sm font-extrabold">
              {lang === 'ar' ? 'عندك سؤال عن سياسة معينة؟' : 'A question about a specific policy?'}
            </p>
            <div className="flex flex-wrap gap-2">
              <Link href="/return-policy" className="inline-flex items-center gap-1.5 rounded-full bg-canary px-4 py-2 text-[0.6875rem] font-extrabold text-ink">
                {tr('return.title')}
                <ArrowRight className="h-3.5 w-3.5 rtl-flip" />
              </Link>
              <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center rounded-full border border-white/15 px-4 py-2 text-[0.6875rem] font-extrabold text-white/75">
                {tr('support.whatsapp')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
