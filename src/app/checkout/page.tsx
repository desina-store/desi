import type { Metadata } from 'next';
import { CheckoutForm } from '@/components/checkout/CheckoutForm';
import { PageHeader } from '@/components/ui/PageHeader';
import { generateOrderId } from '@/lib/checkout';
import { translate } from '@/lib/i18n';
import { pageMetadata } from '@/lib/seo';
import { getServerLang } from '@/lib/server';

export const metadata: Metadata = {
  ...pageMetadata('Secure Checkout', 'Complete your DeSinaHub order and continue to the secure payment gateway.', '/checkout'),
  robots: { index: false, follow: false },
};

type CheckoutPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function firstValue(value: string | string[] | undefined): string {
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value[0] ?? '';
  return '';
}

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const params = await searchParams;
  const lang = await getServerLang();
  const tr = (key: string) => translate(lang, key);

  const rawOrderId = firstValue(params.orderId).trim();
  const orderId = rawOrderId ? rawOrderId.slice(0, 60) : generateOrderId();
  const amount = firstValue(params.amount).trim().slice(0, 32);
  const rawCurrency = firstValue(params.currency).trim().toUpperCase();
  const currency = /^[A-Z]{3}$/.test(rawCurrency) ? rawCurrency : 'EGP';

  return (
    <div>
      <PageHeader eyebrow={tr('co.title')} title={tr('co.title')} sub={tr('co.sub')} tone="dark">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[0.625rem] font-extrabold text-white/75">
          <span className="h-1.5 w-1.5 rounded-full bg-canary" />
          {tr('co.secure')}
        </span>
      </PageHeader>
      <div className="page-shell py-8 md:py-10">
        <CheckoutForm orderId={orderId} amount={amount} currency={currency} />
      </div>
    </div>
  );
}
