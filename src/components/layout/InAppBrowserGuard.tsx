'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useLanguage } from '@/components/providers/LanguageProvider';

export function InAppBrowserGuard() {
  const { lang } = useLanguage();
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent || navigator.vendor || '';
    const isInApp = /FBAN|FBAV|Instagram|TikTok/i.test(ua);
    if (!isInApp) return;

    const isAndroid = /Android/i.test(ua);
    const isIOS = /iPhone|iPad|iPod/i.test(ua);
    const cleanUrl = window.location.host + window.location.pathname + window.location.search;
    const fullUrl = window.location.protocol + '//' + cleanUrl;

    if (isAndroid) {
      window.location.href =
        'intent://' +
        cleanUrl +
        '#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=' +
        encodeURIComponent(fullUrl) +
        ';end';
      return;
    }

    if (isIOS) {
      const tried = window.sessionStorage.getItem('desina_redirected');
      if (!tried && !window.location.search.includes('open_external')) {
        window.sessionStorage.setItem('desina_redirected', '1');
        const separator = window.location.search ? '&' : '?';
        window.location.href = fullUrl + separator + 'open_external=1';
      } else {
        setShowBanner(true);
      }
    }
  }, []);

  if (!showBanner) return null;

  return (
    <div
      role="status"
      className="fixed inset-x-0 top-0 z-[80] flex items-start justify-center gap-3 bg-[#0f172a] px-4 py-2.5 text-center text-[12px] font-semibold leading-relaxed text-white shadow-lg"
    >
      <p>
        {lang === 'ar'
          ? 'لفتح السلة وإكمال الشراء بنجاح، اضغط على (•••) أعلى الشاشة واختر «فتح في Safari».'
          : 'To complete checkout, tap (•••) at the top of the screen and choose “Open in Safari”.'}
      </p>
      <button
        type="button"
        onClick={() => setShowBanner(false)}
        aria-label={lang === 'ar' ? 'إغلاق التنبيه' : 'Dismiss notice'}
        className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/15"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
