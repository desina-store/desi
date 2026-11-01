'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Crown, PackageCheck, Save, UserRound } from 'lucide-react';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { ACCOUNT_KEY, readOrders } from '@/lib/cart';
import { WHATSAPP } from '@/lib/site';

type Identity = { name: string; phone: string };

export function AccountPanels() {
  const { lang, t } = useLanguage();
  const [identity, setIdentity] = useState<Identity>({ name: '', phone: '' });
  const [saved, setSaved] = useState(false);
  const [ordersCount, setOrdersCount] = useState(0);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(ACCOUNT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Record<string, unknown>;
        setIdentity({
          name: typeof parsed.name === 'string' ? parsed.name : '',
          phone: typeof parsed.phone === 'string' ? parsed.phone : '',
        });
      }
    } catch {
      /* storage can be disabled */
    }
    setOrdersCount(readOrders().length);
  }, []);

  function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      window.localStorage.setItem(ACCOUNT_KEY, JSON.stringify(identity));
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2400);
    } catch {
      setSaved(false);
    }
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr] lg:items-start">
      <form onSubmit={save} className="surface-card p-5 md:p-6">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-canary/55 text-olive-dark">
            <UserRound className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-base font-extrabold text-ink">{t('account.identity')}</h2>
            <p className="text-[0.6875rem] text-muted">{t('account.sub')}</p>
          </div>
        </div>

        <div className="mt-5 grid gap-3.5 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-[0.6875rem] font-extrabold uppercase tracking-[0.1em] text-ink/65">
              {t('account.name')}
            </span>
            <input
              value={identity.name}
              onChange={(event) => setIdentity((current) => ({ ...current, name: event.target.value }))}
              autoComplete="name"
              className="w-full rounded-xl border border-ink/10 bg-white/85 px-3.5 py-3 text-sm font-semibold outline-none transition-colors focus:border-olive/60 focus:bg-white"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[0.6875rem] font-extrabold uppercase tracking-[0.1em] text-ink/65">
              {t('account.phone')}
            </span>
            <input
              value={identity.phone}
              onChange={(event) => setIdentity((current) => ({ ...current, phone: event.target.value }))}
              type="tel"
              dir="ltr"
              autoComplete="tel"
              className="w-full rounded-xl border border-ink/10 bg-white/85 px-3.5 py-3 text-sm font-semibold outline-none transition-colors focus:border-olive/60 focus:bg-white"
            />
          </label>
        </div>

        <button type="submit" className="btn-primary mt-4 text-xs">
          {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          {t('account.save')}
        </button>
        <p className="mt-3 text-[0.6875rem] text-muted">{saved ? t('account.saved') : lang === 'ar' ? 'بياناتك تُحفظ على هذا الجهاز فقط لتسريع إتمام الطلب.' : 'Your details are stored only on this device to speed up checkout.'}</p>
      </form>

      <div className="space-y-4">
        <section className="surface-card flex items-center gap-4 p-5">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-ink text-canary">
            <PackageCheck className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-extrabold text-ink">{t('account.history')}</h2>
            <p className="mt-0.5 text-[0.6875rem] leading-relaxed text-muted">{t('account.historyBody')}</p>
          </div>
          <Link
            href="/orders"
            className="inline-flex shrink-0 items-center gap-1 rounded-full border border-ink/10 bg-white/75 px-3 py-1.5 text-[0.625rem] font-extrabold text-ink hover:border-olive"
          >
            {ordersCount}
            <ArrowRight className="h-3 w-3 rtl-flip" />
          </Link>
        </section>

        <section className="overflow-hidden rounded-[1.625rem] bg-ink p-5 text-white shadow-card">
          <span className="inline-flex items-center gap-2 rounded-full bg-canary/15 px-2.5 py-1 text-[0.5625rem] font-extrabold uppercase tracking-[0.14em] text-canary">
            <Crown className="h-3.5 w-3.5" />
            {t('account.vip')}
          </span>
          <h2 className="mt-3 text-lg font-extrabold text-white">{t('account.vip')}</h2>
          <p className="mt-2 text-xs leading-relaxed text-white/65">{t('account.vipBody')}</p>
          <a
            href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent('DESINA2026 — VIP support')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-canary px-4 py-2 text-[0.6875rem] font-extrabold text-ink transition-colors hover:bg-canary-deep"
          >
            {t('account.open')}
            <ArrowRight className="h-3.5 w-3.5 rtl-flip" />
          </a>
          <p className="mt-4 font-mono text-[0.625rem] tracking-[0.18em] text-white/40">DESINA2026</p>
        </section>
      </div>
    </div>
  );
}
