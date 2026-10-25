'use client';

import { createContext, useCallback, useContext, useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import type { Lang } from '@/lib/site';
import { LANG_COOKIE, dirOf, translate } from '@/lib/i18n';

type LanguageContextValue = {
  lang: Lang;
  dir: 'rtl' | 'ltr';
  t: (key: string) => string;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ initialLang, children }: { initialLang: Lang; children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang);
  const [, startTransition] = useTransition();
  const router = useRouter();

  const setLang = useCallback(
    (next: Lang) => {
      setLangState(next);
      document.cookie = `${LANG_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
      try {
        window.localStorage.setItem(LANG_COOKIE, next);
      } catch {
        /* storage can be blocked in private in-app browsers */
      }
      document.documentElement.lang = next;
      document.documentElement.dir = dirOf(next);
      startTransition(() => router.refresh());
    },
    [router],
  );

  const toggleLang = useCallback(() => {
    setLang(lang === 'ar' ? 'en' : 'ar');
  }, [lang, setLang]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      lang,
      dir: dirOf(lang),
      t: (key: string) => translate(lang, key),
      setLang,
      toggleLang,
    }),
    [lang, setLang, toggleLang],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used inside LanguageProvider');
  return context;
}
