import base from "@/data/translations.json";
import { extraText } from "@/data/ui-text";

export type Lang = "en" | "ar";

type Dictionary = Record<string, string>;

const dictionaries: Record<Lang, Dictionary> = {
  en: { ...(base.en as Dictionary), ...extraText.en },
  ar: { ...(base.ar as Dictionary), ...extraText.ar },
};

export function dirFor(lang: Lang): "ltr" | "rtl" {
  return lang === "ar" ? "rtl" : "ltr";
}

export function translate(lang: Lang, key: string, fallback?: string): string {
  return dictionaries[lang][key] ?? dictionaries.en[key] ?? fallback ?? key;
}

export function pick(lang: Lang, en: string, ar: string): string {
  return lang === "ar" ? ar : en;
}

const priceFormatter = new Intl.NumberFormat("en-EG", {
  maximumFractionDigits: 0,
});

export function formatNumber(value: number): string {
  return priceFormatter.format(value);
}

export function formatPrice(value: number, lang: Lang): string {
  return `${priceFormatter.format(value)} ${translate(lang, "common.egp")}`;
}

export function formatDate(value: string | number | Date, lang: Lang): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat(lang === "ar" ? "ar-EG" : "en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}
