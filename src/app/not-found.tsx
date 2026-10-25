'use client';

import Link from 'next/link';
import { ArrowRight, Compass, Home, PackageSearch } from 'lucide-react';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { STORE_SECTIONS } from '@/lib/site';

export default function NotFound() {
  const { lang, t } = useLanguage();
  const quickLinks = STORE_SECTIONS.slice(0, 5);

  return (
    <main className="page-shell flex min-h-[62vh] flex-col items-center justify-center py-16 text-center">
      <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3.5 py-1.5 text-[0.625rem] font-extrabold uppercase tracking-[0.2em] text-olive shadow-sm">
        <Compass className="h-3.5 w-3.5" />
        404
      </span>
      <h1 className="mt-5 text-balance text-3xl font-extrabold tracking-tight text-ink md:text-5xl">
        {t('notfound.title')}
      </h1>
      <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted md:text-base">{t('notfound.sub')}</p>

      <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
        <Link href="/" className="btn-primary">
          <Home className="h-4 w-4" />
          {t('notfound.cta')}
        </Link>
        <Link href="/search" className="btn-ghost">
          <PackageSearch className="h-4 w-4" />
          {t('search.placeholder').split('(')[0].trim().replace('...', '')}
        </Link>
      </div>

      <nav aria-label={t('sections.title')} className="mt-10 flex flex-wrap items-center justify-center gap-2">
        {quickLinks.map((section) => (
          <Link
            key={section.key}
            href={section.href}
            className="inline-flex items-center gap-1.5 rounded-full border border-ink/10 bg-white/60 px-3.5 py-2 text-xs font-bold text-ink/75 transition-colors hover:border-olive hover:text-olive"
          >
            {section.label[lang]}
            <ArrowRight className="h-3 w-3 rtl-flip" />
          </Link>
        ))}
      </nav>
    </main>
  );
}
