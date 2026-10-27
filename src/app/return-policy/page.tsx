import Link from 'next/link';
import { ArrowRight, Clock, RotateCcw, ShieldCheck, Wallet } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { RichText } from '@/components/ui/RichText';
import { RETURN_CLAUSES } from '@/lib/content';
import { translate } from '@/lib/i18n';
import { pageMetadata } from '@/lib/seo';
import { getServerLang } from '@/lib/server';
import { WHATSAPP } from '@/lib/site';

export const metadata = pageMetadata(
  'Return & Exchange Policy',
  'Official DeSinaHub return and exchange timeframes, product condition criteria and refund settlements.',
  '/return-policy',
);

const HIGHLIGHTS = [
  { icon: Clock, en: '14-day returns', ar: 'استرجاع خلال 14 يوماً' },
  { icon: RotateCcw, en: '30-day defect exchange', ar: 'استبدال عيوب الصناعة 30 يوماً' },
  { icon: Wallet, en: 'Refund via your payment channel', ar: 'الاسترداد بنفس وسيلة الدفع' },
  { icon: ShieldCheck, en: 'Inspection at your door', ar: 'معاينة عند الاستلام' },
];

export default async function ReturnPolicyPage() {
  const lang = await getServerLang();
  const tr = (key: string) => translate(lang, key);

  return (
    <div>
      <PageHeader eyebrow={tr('footer.policies')} title={tr('return.title')} sub={tr('return.sub')} tone="canary">
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {HIGHLIGHTS.map((item) => {
            const Icon = item.icon;
            return (
              <span key={item.en} className="flex items-center gap-2 rounded-xl border border-white/50 bg-white/55 px-3 py-2 text-[0.6875rem] font-extrabold text-ink/75">
                <Icon className="h-4 w-4 text-olive" />
                {lang === 'ar' ? item.ar : item.en}
              </span>
            );
          })}
        </div>
      </PageHeader>

      <div className="page-shell grid gap-6 py-8 md:py-12 lg:grid-cols-[1.45fr_0.8fr] lg:items-start">
        <div className="space-y-4">
          {RETURN_CLAUSES.map((clause, index) => (
            <article key={clause.title.en} className="surface-card p-5 md:p-6">
              <div className="flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink font-mono text-xs font-extrabold text-canary">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="text-base font-extrabold leading-snug text-ink md:text-lg">{clause.title[lang]}</h2>
                  <RichText text={clause.body[lang]} className="mt-2 text-xs leading-relaxed text-ink/65" />
                </div>
              </div>
            </article>
          ))}
        </div>

        <aside className="surface-card sticky top-24 p-5">
          <h2 className="text-sm font-extrabold text-ink">{tr('cart.supportTitle')}</h2>
          <p className="mt-1.5 text-xs leading-relaxed text-muted">
            {lang === 'ar'
              ? 'لأي طلب استرجاع أو استبدال، جهّز رقم الطلب وكود المنتج وتواصل معنا.'
              : 'For any return or exchange, have your order ID and product code ready and contact us.'}
          </p>
          <a
            href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(lang === 'ar' ? 'طلب استرجاع/استبدال — DeSinaHub' : 'Return/exchange request — DeSinaHub')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary mt-4 w-full text-xs"
          >
            {tr('support.whatsapp')}
            <ArrowRight className="h-3.5 w-3.5 rtl-flip" />
          </a>
          <div className="mt-3 flex flex-col gap-2">
            <Link href="/policies" className="btn-ghost text-xs">
              {tr('policies.title')}
            </Link>
            <Link href="/faq" className="btn-ghost text-xs">
              {tr('faq.title')}
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
