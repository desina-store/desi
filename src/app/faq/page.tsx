import Link from 'next/link';
import { ArrowRight, ChevronDown, Headset } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { FAQ_ITEMS } from '@/lib/content';
import { translate } from '@/lib/i18n';
import { pageMetadata } from '@/lib/seo';
import { getServerLang } from '@/lib/server';
import { HOTLINES, WHATSAPP } from '@/lib/site';

export const metadata = pageMetadata(
  'Frequently Asked Questions',
  'Fast answers on DeSinaHub payments, shipping, inspections, returns and warranty.',
  '/faq',
);

export default async function FaqPage() {
  const lang = await getServerLang();
  const tr = (key: string) => translate(lang, key);

  return (
    <div>
      <PageHeader eyebrow={tr('support.faq')} title={tr('faq.title')} sub={tr('faq.sub')}>
        <div className="flex flex-wrap gap-2">
          <a
            href={`https://wa.me/${WHATSAPP}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-xs font-extrabold text-canary"
          >
            {tr('support.whatsapp')}
            <ArrowRight className="h-3.5 w-3.5 rtl-flip" />
          </a>
          <a href={`tel:${HOTLINES[1].value}`} className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-white/70 px-4 py-2 text-xs font-extrabold text-ink" dir="ltr">
            {HOTLINES[1].label}
          </a>
        </div>
      </PageHeader>

      <div className="page-shell grid gap-6 py-8 md:py-12 lg:grid-cols-[1.5fr_0.7fr] lg:items-start">
        <div className="space-y-2.5">
          {FAQ_ITEMS.map((item, index) => (
            <details
              key={item.q.en}
              className="surface-card group overflow-hidden"
              open={index === 0}
            >
              <summary className="flex cursor-pointer items-center gap-3 px-4 py-4 md:px-5 [&::-webkit-details-marker]:hidden">
                <span className="font-mono text-[0.625rem] font-extrabold text-olive">{String(index + 1).padStart(2, '0')}</span>
                <h2 className="flex-1 text-sm font-extrabold text-ink md:text-[0.9375rem]">{item.q[lang]}</h2>
                <ChevronDown className="h-4 w-4 shrink-0 text-muted transition-transform group-open:rotate-180" />
              </summary>
              <p className="border-t border-ink/[0.05] px-4 py-3.5 text-xs leading-relaxed text-ink/65 md:px-5">
                {item.a[lang]}
              </p>
            </details>
          ))}
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24">
          <section className="overflow-hidden rounded-[1.625rem] bg-ink p-5 text-white">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-canary text-ink">
              <Headset className="h-5 w-5" />
            </span>
            <h2 className="mt-3 text-base font-extrabold text-white">{tr('support.care')}</h2>
            <p className="mt-1.5 text-xs leading-relaxed text-white/60">
              {lang === 'ar'
                ? 'لسه عندك سؤال؟ فريقنا يجاوبك على الواتساب أو الخط الساخن.'
                : 'Still have a question? Our team answers on WhatsApp or the hotline.'}
            </p>
            <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer" className="btn-primary mt-4 w-full text-xs">
              {tr('support.contact')}
              <ArrowRight className="h-3.5 w-3.5 rtl-flip" />
            </a>
            <p className="mt-3 text-[0.625rem] font-bold text-white/45" dir="ltr">
              {HOTLINES.map((line) => line.label).join(' · ')}
            </p>
          </section>
          <Link href="/policies" className="surface-card flex items-center justify-between gap-3 p-4 text-xs font-extrabold text-ink transition-colors hover:border-olive/40">
            {tr('policies.title')}
            <ArrowRight className="h-4 w-4 rtl-flip" />
          </Link>
          <Link href="/return-policy" className="surface-card flex items-center justify-between gap-3 p-4 text-xs font-extrabold text-ink transition-colors hover:border-olive/40">
            {tr('return.title')}
            <ArrowRight className="h-4 w-4 rtl-flip" />
          </Link>
        </aside>
      </div>
    </div>
  );
}
