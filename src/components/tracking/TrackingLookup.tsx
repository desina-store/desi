'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, PackageSearch, Search } from 'lucide-react';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { formatPrice } from '@/lib/format';
import { readOrders, type ArchivedOrder } from '@/lib/cart';
import { paymentMethodLabel } from '@/lib/checkout';
import { HOTLINES, WHATSAPP } from '@/lib/site';

export function TrackingLookup() {
  const { lang, t } = useLanguage();
  const [orders, setOrders] = useState<ArchivedOrder[]>([]);
  const [query, setQuery] = useState('');
  const [bulkId, setBulkId] = useState('');
  const [result, setResult] = useState<ArchivedOrder | null | undefined>(undefined);

  useEffect(() => {
    setOrders(readOrders());
  }, []);

  function track(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const term = query.trim().toUpperCase();
    const found = orders.find((order) => order.id.toUpperCase() === term) ?? null;
    setResult(found);
  }

  function trackBulk(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message =
      lang === 'ar'
        ? `مرحباً DeSinaHub، أرجو تتبع شحنة الجملة رقم ${bulkId || '—'}.`
        : `Hello DeSinaHub, please track the wholesale shipment ${bulkId || '—'}.`;
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  }

  return (
    <div className="grid gap-5 md:grid-cols-2">
      <section className="surface-card p-5 md:p-6">
        <span className="inline-flex items-center gap-2 rounded-full bg-canary/50 px-2.5 py-1 text-[0.5625rem] font-extrabold uppercase tracking-[0.14em] text-olive-dark">
          <PackageSearch className="h-3.5 w-3.5" />
          {t('tracking.retail')}
        </span>
        <h2 className="mt-3 text-lg font-extrabold text-ink">{t('tracking.title')}</h2>
        <p className="mt-1 text-xs leading-relaxed text-muted">{t('tracking.retailBody')}</p>

        <form onSubmit={track} className="mt-4 flex gap-2">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 text-muted start-3.5" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t('tracking.orderPlaceholder')}
              className="w-full rounded-xl border border-ink/10 bg-white/85 py-3 pe-3 ps-10 text-sm font-semibold outline-none transition-colors focus:border-olive/60 focus:bg-white"
            />
          </div>
          <button type="submit" className="btn-primary shrink-0 text-xs">
            {t('tracking.track')}
          </button>
        </form>

        {result ? (
          <div className="mt-4 rounded-2xl border border-olive/20 bg-canary/20 p-4">
            <div className="flex items-center gap-2 text-sm font-extrabold text-ink">
              <CheckCircle2 className="h-4 w-4 text-olive" />
              {result.id}
            </div>
            <dl className="mt-2.5 space-y-1.5 text-xs">
              <div className="flex justify-between gap-2">
                <dt className="text-muted">{t('orders.date')}</dt>
                <dd className="font-bold text-ink">{result.date}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-muted">{t('orders.total')}</dt>
                <dd className="font-bold text-ink">{formatPrice(result.total, lang)}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-muted">{lang === 'ar' ? 'الحالة' : 'Status'}</dt>
                <dd className="font-bold capitalize text-olive">{result.status ?? 'pending'}</dd>
              </div>
              {result.paymentMethod ? (
                <div className="flex justify-between gap-2">
                  <dt className="text-muted">{lang === 'ar' ? 'طريقة الدفع' : 'Payment'}</dt>
                  <dd className="font-bold text-ink">{paymentMethodLabel(result.paymentMethod, lang)}</dd>
                </div>
              ) : null}
            </dl>
            <p className="mt-3 text-[0.625rem] text-muted">
              {lang === 'ar'
                ? 'الحالة النهائية يتم تأكيدها من فريقنا على الواتساب بعد شحن الطلب.'
                : 'Final delivery status is confirmed by our team on WhatsApp once dispatched.'}
            </p>
          </div>
        ) : result === null ? (
          <div className="mt-4 rounded-2xl border border-dashed border-ink/15 bg-white/60 p-4">
            <p className="text-sm font-extrabold text-ink">
              {lang === 'ar' ? 'لم نجد هذا الطلب على هذا الجهاز.' : 'We could not find that order on this device.'}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted">
              {t('tracking.localHint')} {lang === 'ar' ? 'أو تواصل معنا:' : 'Or contact us:'}{' '}
              <a
                href={`https://wa.me/${WHATSAPP}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-extrabold text-olive underline decoration-canary-deep decoration-2 underline-offset-4"
              >
                {t('tracking.help')}
              </a>
            </p>
          </div>
        ) : null}

        {orders.length ? (
          <div className="mt-4">
            <p className="text-[0.625rem] font-extrabold uppercase tracking-[0.12em] text-muted">
              {lang === 'ar' ? 'طلبات محفوظة' : 'Saved orders'}
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {orders.slice(-4).reverse().map((order) => (
                <button
                  key={order.id}
                  type="button"
                  onClick={() => {
                    setQuery(order.id);
                    setResult(order);
                  }}
                  className="rounded-full border border-ink/10 bg-white/80 px-2.5 py-1 font-mono text-[0.625rem] font-bold text-ink/70 hover:border-olive"
                >
                  {order.id}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </section>

      <section className="surface-card flex flex-col p-5 md:p-6">
        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-ink px-2.5 py-1 text-[0.5625rem] font-extrabold uppercase tracking-[0.14em] text-canary">
          {t('tracking.wholesale')}
        </span>
        <h2 className="mt-3 text-lg font-extrabold text-ink">{t('tracking.wholesale')}</h2>
        <p className="mt-1 text-xs leading-relaxed text-muted">{t('tracking.wholesaleBody')}</p>

        <form onSubmit={trackBulk} className="mt-4 flex flex-col gap-2">
          <input
            value={bulkId}
            onChange={(event) => setBulkId(event.target.value)}
            placeholder={t('tracking.bulkPlaceholder')}
            className="w-full rounded-xl border border-ink/10 bg-white/85 px-3.5 py-3 text-sm font-semibold outline-none transition-colors focus:border-olive/60 focus:bg-white"
          />
          <button type="submit" className="btn-dark text-xs">
            {t('tracking.track')}
          </button>
        </form>

        <div className="mt-auto rounded-2xl bg-cream/70 p-4">
          <p className="text-sm font-extrabold text-ink">{t('tracking.help')}</p>
          <p className="mt-1 text-xs leading-relaxed text-muted">{t('tracking.helpBody')}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer" className="btn-primary text-xs">
              {t('support.whatsapp')}
            </a>
            <Link href="/support" className="btn-ghost text-xs">
              {t('nav.support')}
            </Link>
          </div>
          <p className="mt-3 text-[0.625rem] font-bold text-muted" dir="ltr">
            {HOTLINES.map((line) => line.label).join(' · ')}
          </p>
        </div>
      </section>
    </div>
  );
}
