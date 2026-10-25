import type { Lang } from './site';

export const CURRENCY = 'EGP';

export function formatPrice(amount: number, lang: Lang): string {
  const safe = Number.isFinite(amount) ? amount : 0;
  return `${safe} ${lang === 'ar' ? 'ج.م' : CURRENCY}`;
}

/** Cart totals, matching the legacy cart.html Intl formatting. */
export function formatMoney(amount: number, lang: Lang): string {
  const safe = Number.isFinite(amount) ? amount : 0;
  return new Intl.NumberFormat(lang === 'ar' ? 'ar-EG' : 'en-EG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(safe);
}

/** The dynamic checkout invoice format, preserved exactly from checkout.html. */
export function formatInvoiceAmount(amount: number | string, currency: string, lang: Lang): string {
  const numeric = typeof amount === 'number' ? amount : Number.parseFloat(amount);
  const safe = Number.isFinite(numeric) ? numeric : 0;
  return lang === 'ar' ? `${safe.toFixed(2)} ج.م` : `${currency} ${safe.toFixed(2)}`;
}

export function formatDate(value: string | number | Date, lang: Lang): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat(lang === 'ar' ? 'ar-EG' : 'en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

export function formatCount(value: number, lang: Lang): string {
  return new Intl.NumberFormat(lang === 'ar' ? 'ar-EG' : 'en-EG').format(value);
}
