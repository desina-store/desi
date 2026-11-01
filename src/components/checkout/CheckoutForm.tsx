'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CreditCard,
  Loader2,
  LockKeyhole,
  ShieldCheck,
  ShoppingBag,
} from 'lucide-react';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { useCart } from '@/components/providers/CartProvider';
import { formatInvoiceAmount } from '@/lib/format';
import { ACCOUNT_KEY, archiveOrder } from '@/lib/cart';
import {
  DEFAULT_PAYMENT_METHOD,
  PAYMENT_GROUPS,
  buildGatewayUrl,
  cleanText,
  paymentMethodLabel,
  toCheckoutApiPayload,
  type CheckoutPayload,
} from '@/lib/checkout';
import { getProduct } from '@/lib/products';
import { beginCheckout } from '@/lib/tracking';
import type { Lang } from '@/lib/site';

type CheckoutFormProps = {
  orderId: string;
  amount: string;
  currency: string;
};

type CustomerFields = {
  name: string;
  phone: string;
  country: string;
  city: string;
  zip: string;
  address: string;
};

const EMPTY_CUSTOMER: CustomerFields = {
  name: '',
  phone: '',
  country: 'Egypt',
  city: '',
  zip: '',
  address: '',
};

const COPY: Record<Lang, {
  payTitle: string;
  payHint: string;
  bankHint: string;
  gateway: string;
  items: string;
  shipping: string;
  namePlaceholder: string;
  phonePlaceholder: string;
  cityPlaceholder: string;
  zipPlaceholder: string;
  addressPlaceholder: string;
  choosePayment: string;
  direct: string;
  itemCount: string;
}> = {
  en: {
    payTitle: 'Payment method',
    payHint: 'Select how you would like to pay. You will finish payment on the gateway.',
    bankHint: 'Bank transfer details are confirmed by our team after you place the order.',
    gateway: 'Continue to gateway',
    items: 'Invoice items',
    shipping: 'Delivery details',
    namePlaceholder: 'Your full name',
    phonePlaceholder: '01xxxxxxxxx',
    cityPlaceholder: 'e.g. Cairo',
    zipPlaceholder: 'e.g. 11511',
    addressPlaceholder: 'Street, building number, floor, apartment',
    choosePayment: 'Choose a payment method to continue.',
    direct: 'Direct, server-verified payment',
    itemCount: 'items',
  },
  ar: {
    payTitle: 'طريقة الدفع',
    payHint: 'اختر طريقة الدفع المناسبة، وسيتم إتمام العملية على بوابة الدفع.',
    bankHint: 'يتم تأكيد بيانات التحويل البنكي من فريقنا بعد إرسال الطلب.',
    gateway: 'المتابعة إلى بوابة الدفع',
    items: 'بنود الفاتورة',
    shipping: 'بيانات التوصيل',
    namePlaceholder: 'الاسم بالكامل',
    phonePlaceholder: '01xxxxxxxxx',
    cityPlaceholder: 'مثال: القاهرة',
    zipPlaceholder: 'مثال: 11511',
    addressPlaceholder: 'اسم الشارع، رقم البناية، الدور، الشقة',
    choosePayment: 'اختر طريقة الدفع للمتابعة.',
    direct: 'دفع مباشر يتم التحقق منه على السيرفر',
    itemCount: 'منتجات',
  },
};

function readSavedCustomer(): Partial<CustomerFields> {
  try {
    const raw = window.localStorage.getItem(ACCOUNT_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    return {
      name: typeof parsed.name === 'string' ? parsed.name : '',
      phone: typeof parsed.phone === 'string' ? parsed.phone : '',
    };
  } catch {
    return {};
  }
}

export function CheckoutForm({ orderId, amount, currency }: CheckoutFormProps) {
  const { lang, t } = useLanguage();
  const { items, ready, subtotal, count } = useCart();
  const [customer, setCustomer] = useState<CustomerFields>(EMPTY_CUSTOMER);
  const [paymentMethod, setPaymentMethod] = useState(DEFAULT_PAYMENT_METHOD);
  const [submitting, setSubmitting] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);

  const copy = COPY[lang];
  const parsedParam = Number.parseFloat(amount);
  const invoiceValue = Number.isFinite(parsedParam) && parsedParam > 0 ? parsedParam : subtotal;
  const invoiceAmountParam = Number.isFinite(parsedParam) && parsedParam > 0 ? amount : String(subtotal || 0);
  const invoiceCurrency = currency || 'EGP';
  const gatewayUrl = useMemo(
    () => buildGatewayUrl(paymentMethod, orderId, invoiceAmountParam, invoiceCurrency),
    [paymentMethod, orderId, invoiceAmountParam, invoiceCurrency],
  );

  useEffect(() => {
    const saved = readSavedCustomer();
    if (saved.name || saved.phone) {
      setCustomer((current) => ({ ...current, name: saved.name ?? '', phone: saved.phone ?? '' }));
    }
  }, []);

  useEffect(() => {
    if (!redirectUrl) return;
    const timer = window.setTimeout(() => {
      window.location.assign(redirectUrl);
    }, 900);
    return () => window.clearTimeout(timer);
  }, [redirectUrl]);

  function update(field: keyof CustomerFields, value: string) {
    setCustomer((current) => ({ ...current, [field]: value }));
  }

  async function notifyBackend(payload: CheckoutPayload) {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 8000);
    try {
      await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(toCheckoutApiPayload(payload)),
        signal: controller.signal,
      });
    } catch {
      // Static hosting leaves /api unavailable; the preserved gateway redirect still completes checkout.
    } finally {
      window.clearTimeout(timer);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!gatewayUrl || !items.length || submitting) return;

    const safeCustomer = {
      name: cleanText(customer.name, 120),
      phone: cleanText(customer.phone, 40),
    };
    const safeShipping = {
      country: cleanText(customer.country, 80),
      city: cleanText(customer.city, 80),
      zip: cleanText(customer.zip, 20),
      address: cleanText(customer.address, 240),
    };

    const payload: CheckoutPayload = {
      order_id: orderId,
      amount: invoiceValue,
      currency: invoiceCurrency,
      payment_method: paymentMethod,
      customer: safeCustomer,
      shipping: safeShipping,
      created_at: new Date().toISOString(),
      cart_items: items.map((item) => ({ code: item.code, qty: item.quantity })),
    };

    setSubmitting(true);
    archiveOrder({
      id: orderId,
      date: new Date().toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-GB'),
      items: items.map((item) => ({ ...item })),
      total: invoiceValue,
      currency: invoiceCurrency,
      paymentMethod,
      status: 'pending',
      customer: safeCustomer,
    });
    beginCheckout(invoiceValue, invoiceCurrency, orderId, paymentMethod);
    try {
      window.localStorage.setItem(ACCOUNT_KEY, JSON.stringify(safeCustomer));
    } catch {
      /* storage can be blocked in in-app browsers */
    }

    await notifyBackend(payload);
    setRedirectUrl(gatewayUrl);
  }

  if (ready && !items.length) {
    return (
      <div className="surface-card flex flex-col items-center justify-center px-6 py-16 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-canary/50 text-olive-dark">
          <ShoppingBag className="h-7 w-7" />
        </span>
        <h2 className="mt-5 text-xl font-extrabold text-ink">{t('co.emptyCart')}</h2>
        <Link href="/" className="btn-primary mt-6">
          {t('co.emptyCta')}
          <ArrowRight className="h-4 w-4 rtl-flip" />
        </Link>
      </div>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1.45fr_1fr] lg:items-start">
        <div className="space-y-5">
          <section className="surface-card p-5 md:p-6">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-[0.75rem] font-extrabold text-canary">
                1
              </span>
              <div>
                <h2 className="text-base font-extrabold text-ink">{t('co.step1')}</h2>
                <p className="text-[0.6875rem] text-muted">{copy.shipping}</p>
              </div>
            </div>

            <div className="mt-5 grid gap-3.5 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-[0.6875rem] font-extrabold uppercase tracking-[0.1em] text-ink/65">
                  {t('co.name')} *
                </span>
                <input
                  required
                  value={customer.name}
                  onChange={(event) => update('name', event.target.value)}
                  placeholder={copy.namePlaceholder}
                  autoComplete="name"
                  className="w-full rounded-xl border border-ink/10 bg-white/85 px-3.5 py-3 text-sm font-semibold outline-none transition-colors placeholder:font-normal placeholder:text-muted/70 focus:border-olive/60 focus:bg-white"
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-[0.6875rem] font-extrabold uppercase tracking-[0.1em] text-ink/65">
                  {t('co.phone')} *
                </span>
                <input
                  required
                  type="tel"
                  inputMode="tel"
                  value={customer.phone}
                  onChange={(event) => update('phone', event.target.value)}
                  placeholder={copy.phonePlaceholder}
                  autoComplete="tel"
                  dir="ltr"
                  className="w-full rounded-xl border border-ink/10 bg-white/85 px-3.5 py-3 text-sm font-semibold outline-none transition-colors placeholder:font-normal placeholder:text-muted/70 focus:border-olive/60 focus:bg-white"
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-[0.6875rem] font-extrabold uppercase tracking-[0.1em] text-ink/65">
                  {t('co.country')} *
                </span>
                <input
                  required
                  value={customer.country}
                  onChange={(event) => update('country', event.target.value)}
                  autoComplete="country-name"
                  className="w-full rounded-xl border border-ink/10 bg-white/85 px-3.5 py-3 text-sm font-semibold outline-none transition-colors focus:border-olive/60 focus:bg-white"
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-[0.6875rem] font-extrabold uppercase tracking-[0.1em] text-ink/65">
                  {t('co.city')} *
                </span>
                <input
                  required
                  value={customer.city}
                  onChange={(event) => update('city', event.target.value)}
                  placeholder={copy.cityPlaceholder}
                  autoComplete="address-level2"
                  className="w-full rounded-xl border border-ink/10 bg-white/85 px-3.5 py-3 text-sm font-semibold outline-none transition-colors placeholder:font-normal placeholder:text-muted/70 focus:border-olive/60 focus:bg-white"
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-[0.6875rem] font-extrabold uppercase tracking-[0.1em] text-ink/65">
                  {t('co.zip')} <span className="font-bold text-muted/70">({t('common.optional')})</span>
                </span>
                <input
                  value={customer.zip}
                  onChange={(event) => update('zip', event.target.value)}
                  placeholder={copy.zipPlaceholder}
                  autoComplete="postal-code"
                  dir="ltr"
                  className="w-full rounded-xl border border-ink/10 bg-white/85 px-3.5 py-3 text-sm font-semibold outline-none transition-colors placeholder:font-normal placeholder:text-muted/70 focus:border-olive/60 focus:bg-white"
                />
              </label>

              <label className="block sm:col-span-2">
                <span className="mb-1.5 block text-[0.6875rem] font-extrabold uppercase tracking-[0.1em] text-ink/65">
                  {t('co.address')} *
                </span>
                <textarea
                  required
                  rows={2}
                  value={customer.address}
                  onChange={(event) => update('address', event.target.value)}
                  placeholder={copy.addressPlaceholder}
                  autoComplete="street-address"
                  className="w-full resize-none rounded-xl border border-ink/10 bg-white/85 px-3.5 py-3 text-sm font-semibold outline-none transition-colors placeholder:font-normal placeholder:text-muted/70 focus:border-olive/60 focus:bg-white"
                />
              </label>
            </div>
          </section>

          <section className="surface-card p-5 md:p-6">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-[0.75rem] font-extrabold text-canary">
                2
              </span>
              <div>
                <h2 className="text-base font-extrabold text-ink">{t('co.step2')}</h2>
                <p className="text-[0.6875rem] text-muted">{copy.payHint}</p>
              </div>
            </div>

            <div className="mt-5 space-y-5">
              {PAYMENT_GROUPS.map((group) => (
                <fieldset key={group.title.en}>
                  <legend className="text-[0.625rem] font-extrabold uppercase tracking-[0.14em] text-ink/55">
                    {group.title[lang]}
                  </legend>
                  <div className="mt-2.5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                    {group.methods.map((method) => {
                      const active = paymentMethod === method.id;
                      return (
                        <label
                          key={method.id}
                          className={`relative flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border p-2.5 text-center transition-[border-color,background-color,box-shadow] ${
                            active
                              ? 'border-olive bg-canary/25 shadow-[0_0_0_2px_rgba(86,107,63,0.15)]'
                              : 'border-ink/10 bg-white/70 hover:border-olive/40'
                          }`}
                        >
                          <input
                            type="radio"
                            name="payment_method_choice"
                            value={method.id}
                            checked={active}
                            onChange={() => setPaymentMethod(method.id)}
                            className="sr-only"
                          />
                          {method.image ? (
                            <Image
                              src={method.image}
                              alt={method.label[lang]}
                              width={96}
                              height={40}
                              className="h-8 w-auto object-contain"
                            />
                          ) : (
                            <span className="flex h-8 w-10 items-center justify-center rounded-lg bg-ink/[0.05] text-ink/70">
                              <CreditCard className="h-4 w-4" />
                            </span>
                          )}
                          <span className="text-[0.625rem] font-extrabold leading-tight text-ink/80">
                            {method.label[lang]}
                          </span>
                          {active ? (
                            <span className="absolute end-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-olive text-white">
                              <Check className="h-2.5 w-2.5" />
                            </span>
                          ) : null}
                        </label>
                      );
                    })}
                  </div>
                  {group.methods.some((method) => method.id.startsWith('bank_')) ? (
                    <p className="mt-2 text-[0.625rem] text-muted">{copy.bankHint}</p>
                  ) : null}
                </fieldset>
              ))}
            </div>
          </section>
        </div>

        <aside className="surface-card sticky top-24 p-5 md:p-6">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg font-extrabold text-ink">{t('co.invoice')}</h2>
            <span className="rounded-full bg-olive/10 px-2.5 py-1 text-[0.5625rem] font-extrabold uppercase tracking-[0.1em] text-olive">
              {copy.direct}
            </span>
          </div>

          <div className="mt-4 rounded-xl border border-dashed border-ink/15 bg-cream/50 px-3.5 py-2.5">
            <p className="text-[0.5625rem] font-extrabold uppercase tracking-[0.16em] text-muted">{t('co.orderId')}</p>
            <p className="mt-0.5 font-mono text-sm font-extrabold tracking-wide text-ink" dir="ltr">
              {orderId}
            </p>
          </div>

          <div className="mt-4">
            <p className="text-[0.625rem] font-extrabold uppercase tracking-[0.14em] text-muted">
              {copy.items} ({count} {copy.itemCount})
            </p>
            <ul className="mt-2 max-h-60 space-y-2 overflow-y-auto pe-1">
              {items.map((item) => {
                const product = getProduct(item.code);
                return (
                  <li key={item.code} className="flex items-center gap-2.5">
                    {product ? (
                      <div className="product-media relative h-10 w-10 shrink-0 rounded-lg">
                        <Image src={product.image} alt={product.name[lang]} fill sizes="40px" className="object-cover" />
                      </div>
                    ) : (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-ink/5">
                        <ShoppingBag className="h-4 w-4 text-muted" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[0.6875rem] font-extrabold text-ink">
                        {product ? product.name[lang] : item.name}
                      </p>
                      <p className="text-[0.5625rem] font-semibold text-muted">
                        × {item.quantity} · {item.price} {invoiceCurrency}
                      </p>
                    </div>
                    <span className="shrink-0 text-[0.6875rem] font-extrabold text-ink">
                      {item.price * item.quantity} {invoiceCurrency}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="mt-4">
            <p className="text-[0.625rem] font-extrabold uppercase tracking-[0.14em] text-muted">{copy.shipping}</p>
            <p className="mt-1 text-[0.6875rem] leading-relaxed text-ink/70">
              {customer.name || '—'} · {customer.phone || '—'}
              <br />
              {[customer.address, customer.city, customer.country, customer.zip].filter(Boolean).join(', ') || '—'}
            </p>
          </div>

          <div className="ds-divider my-4" />

          <div className="flex items-end justify-between gap-2">
            <span className="text-sm font-extrabold text-ink">{t('co.total')}</span>
            <span className="text-xl font-extrabold text-ink">
              {formatInvoiceAmount(invoiceAmountParam, invoiceCurrency, lang)}
            </span>
          </div>
          <p className="mt-1 text-[0.625rem] leading-relaxed text-muted">{t('co.delivery')}</p>

          <div className="mt-2.5 flex items-center gap-1.5 rounded-xl bg-cream/70 px-3 py-2 text-[0.625rem] font-bold text-ink/70">
            <LockKeyhole className="h-3.5 w-3.5 text-olive" />
            {t('co.secure')}
          </div>

          <button type="submit" disabled={submitting || !ready} className="btn-primary mt-4 w-full disabled:opacity-60">
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
            {submitting ? t('co.saving') : t('co.confirm')}
          </button>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <Link href="/cart" className="inline-flex items-center gap-1.5 text-[0.6875rem] font-bold text-muted transition-colors hover:text-ink">
              <ArrowLeft className="h-3.5 w-3.5 rtl-flip" />
              {t('co.back')}
            </Link>
            <span className="text-[0.625rem] font-bold text-olive">{paymentMethodLabel(paymentMethod, lang)}</span>
          </div>
        </aside>
      </form>

      {redirectUrl ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/70 px-5 backdrop-blur-sm" role="dialog" aria-modal="true">
          <div className="ds-rise w-full max-w-sm rounded-[1.75rem] bg-cream-soft p-6 text-center shadow-float">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-canary">
              <Loader2 className="h-6 w-6 animate-spin text-ink" />
            </span>
            <h2 className="mt-4 text-lg font-extrabold text-ink">{t('co.modalTitle')}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{t('co.modalBody')}</p>
            <p className="mt-4 rounded-xl bg-white/70 px-3 py-2 font-mono text-xs font-extrabold text-ink" dir="ltr">
              {orderId} · {formatInvoiceAmount(invoiceAmountParam, invoiceCurrency, lang)}
            </p>
            <a
              href={redirectUrl}
              className="btn-primary mt-4 w-full"
              aria-label={copy.gateway}
            >
              <ArrowRight className="h-4 w-4 rtl-flip" />
              {copy.gateway}
            </a>
          </div>
        </div>
      ) : null}
    </>
  );
}
