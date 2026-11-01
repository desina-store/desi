import Link from 'next/link';
import { ArrowRight, Headset, LifeBuoy, Mail, MapPin, Phone, Wrench } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { supportChannels } from '@/lib/content';
import { translate } from '@/lib/i18n';
import { pageMetadata } from '@/lib/seo';
import { getServerLang } from '@/lib/server';
import { HOTLINES, MAP_URL, SITE_EMAIL, WHATSAPP, WHATSAPP_DISPLAY } from '@/lib/site';

export const metadata = pageMetadata(
  'Support Hub',
  'Technical support, customer care and a knowledge base for every DeSinaHub order.',
  '/support',
);

const ICONS = [Wrench, LifeBuoy, Headset];

export default async function SupportPage() {
  const lang = await getServerLang();
  const tr = (key: string) => translate(lang, key);
  const channels = supportChannels(WHATSAPP);

  return (
    <div>
      <PageHeader eyebrow={tr('nav.support')} title={tr('support.title')} sub={tr('support.sub')} tone="canary">
        <div className="flex flex-wrap gap-2">
          <a
            href={`https://wa.me/${WHATSAPP}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-xs font-extrabold text-canary transition-colors hover:bg-olive-dark"
          >
            {tr('support.whatsapp')}
            <ArrowRight className="h-3.5 w-3.5 rtl-flip" />
          </a>
          <a href={`tel:${HOTLINES[0].value}`} className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-white/70 px-4 py-2 text-xs font-extrabold text-ink">
            <Phone className="h-3.5 w-3.5" />
            {HOTLINES[0].label}
          </a>
        </div>
      </PageHeader>

      <div className="page-shell py-8 md:py-12">
        <div className="grid gap-4 md:grid-cols-3">
          {channels.map((channel, index) => {
            const Icon = ICONS[index] ?? Headset;
            const external = channel.href.startsWith('http');
            return (
              <article key={channel.id} className="surface-card flex h-full flex-col p-5">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-canary/55 text-olive-dark">
                  <Icon className="h-5 w-5" />
                </span>
                <h2 className="mt-4 text-base font-extrabold text-ink">{channel.title[lang]}</h2>
                <p className="mt-1.5 text-xs leading-relaxed text-muted">{channel.body[lang]}</p>
                {external ? (
                  <a
                    href={channel.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto inline-flex items-center gap-1.5 pt-4 text-[0.6875rem] font-extrabold text-olive"
                  >
                    {channel.cta[lang]}
                    <ArrowRight className="h-3.5 w-3.5 rtl-flip" />
                  </a>
                ) : (
                  <Link href={channel.href} className="mt-auto inline-flex items-center gap-1.5 pt-4 text-[0.6875rem] font-extrabold text-olive">
                    {channel.cta[lang]}
                    <ArrowRight className="h-3.5 w-3.5 rtl-flip" />
                  </Link>
                )}
              </article>
            );
          })}
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="surface-card p-5 md:p-6">
            <h2 className="text-lg font-extrabold text-ink">{tr('footer.contact')}</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl bg-cream/65 px-3.5 py-3 transition-colors hover:bg-cream">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-olive">
                  <Headset className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-[0.625rem] font-extrabold uppercase tracking-[0.1em] text-muted">WhatsApp</p>
                  <p className="text-xs font-extrabold text-ink" dir="ltr">{WHATSAPP_DISPLAY}</p>
                </div>
              </a>
              <a href={`mailto:${SITE_EMAIL}`} className="flex items-center gap-3 rounded-xl bg-cream/65 px-3.5 py-3 transition-colors hover:bg-cream">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-olive">
                  <Mail className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-[0.625rem] font-extrabold uppercase tracking-[0.1em] text-muted">Email</p>
                  <p className="text-xs font-extrabold text-ink">{SITE_EMAIL}</p>
                </div>
              </a>
              {HOTLINES.map((line) => (
                <a key={line.value} href={`tel:${line.value}`} className="flex items-center gap-3 rounded-xl bg-cream/65 px-3.5 py-3 transition-colors hover:bg-cream">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-olive">
                    <Phone className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-[0.625rem] font-extrabold uppercase tracking-[0.1em] text-muted">{lang === 'ar' ? 'خط ساخن' : 'Hotline'}</p>
                    <p className="text-xs font-extrabold text-ink" dir="ltr">{line.label}</p>
                  </div>
                </a>
              ))}
              <a href={MAP_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl bg-cream/65 px-3.5 py-3 transition-colors hover:bg-cream">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-olive">
                  <MapPin className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-[0.625rem] font-extrabold uppercase tracking-[0.1em] text-muted">{lang === 'ar' ? 'المقر' : 'Headquarters'}</p>
                  <p className="text-xs font-extrabold text-ink">{tr('footer.map')}</p>
                </div>
              </a>
            </div>
          </section>

          <section className="flex flex-col justify-between gap-4 overflow-hidden rounded-[1.625rem] bg-ink p-5 text-white">
            <div>
              <span className="inline-flex rounded-full bg-white/10 px-2.5 py-1 text-[0.5625rem] font-extrabold uppercase tracking-[0.14em] text-canary">
                {lang === 'ar' ? 'قبل ما تسأل' : 'Quick answers'}
              </span>
              <h2 className="mt-3 text-lg font-extrabold text-white">{tr('support.faq')}</h2>
              <p className="mt-1.5 text-xs leading-relaxed text-white/60">
                {lang === 'ar'
                  ? 'كل إجابات الشحن والدفع والاسترجاع متاحة في قاعدة المعرفة.'
                  : 'Shipping, payment and return answers are all in the knowledge base.'}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/faq" className="inline-flex items-center gap-1.5 rounded-full bg-canary px-4 py-2 text-[0.6875rem] font-extrabold text-ink">
                {tr('support.faq')}
                <ArrowRight className="h-3.5 w-3.5 rtl-flip" />
              </Link>
              <Link href="/return-policy" className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-[0.6875rem] font-extrabold text-white/75">
                {tr('return.title')}
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
