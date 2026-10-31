"use client";

import {
  createContext,
  startTransition,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  dirFor,
  formatPrice,
  pick,
  translate,
  type Lang,
} from "@/lib/i18n";
import { STORAGE_KEYS } from "@/lib/storage";

type I18nValue = {
  lang: Lang;
  dir: "ltr" | "rtl";
  isRtl: boolean;
  t: (key: string, fallback?: string) => string;
  tr: (en: string, ar: string) => string;
  price: (value: number) => string;
  setLanguage: (lang: Lang) => void;
  toggleLanguage: () => void;
};

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({
  initialLang,
  children,
}: {
  initialLang: Lang;
  children: ReactNode;
}) {
  const [lang, setLang] = useState<Lang>(initialLang);
  const router = useRouter();

  useEffect(() => {
    setLang(initialLang);
  }, [initialLang]);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dirFor(lang);
  }, [lang]);

  const setLanguage = useCallback(
    (next: Lang) => {
      setLang(next);
      document.documentElement.lang = next;
      document.documentElement.dir = dirFor(next);
      document.cookie = `desina_lang=${next}; path=/; max-age=31536000; samesite=lax`;
      try {
        window.localStorage.setItem(STORAGE_KEYS.lang, next);
      } catch {
        // Storage may be unavailable in private modes.
      }
      startTransition(() => {
        router.refresh();
      });
    },
    [router],
  );

  const toggleLanguage = useCallback(() => {
    setLanguage(lang === "ar" ? "en" : "ar");
  }, [lang, setLanguage]);

  const value = useMemo<I18nValue>(
    () => ({
      lang,
      dir: dirFor(lang),
      isRtl: lang === "ar",
      t: (key, fallback) => translate(lang, key, fallback),
      tr: (en, ar) => pick(lang, en, ar),
      price: (amount) => formatPrice(amount, lang),
      setLanguage,
      toggleLanguage,
    }),
    [lang, setLanguage, toggleLanguage],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useI18n must be used inside I18nProvider");
  return context;
}
