'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { STORE_SECTIONS } from '@/lib/site';

export function CategoryRail() {
  const { lang, dir, t } = useLanguage();
  const trackRef = useRef<HTMLDivElement>(null);

  function scroll(direction: -1 | 1) {
    const node = trackRef.current;
    if (!node) return;
    const amount = Math.min(node.clientWidth * 0.8, 560);
    node.scrollBy({ left: dir === 'rtl' ? -direction * amount : direction * amount, behavior: 'smooth' });
  }

  return (
    <section id="sections" className="scroll-mt-24">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <span className="mb-2 inline-flex items-center gap-2 text-[0.625rem] font-extrabold uppercase tracking-[0.2em] text-olive">
            <span className="h-1.5 w-1.5 rounded-full bg-canary-deep" />
            {t('sections.title')}
          </span>
          <h2 className="text-xl font-extrabold tracking-tight text-ink md:text-2xl">{t('hero.browse')}</h2>
          <p className="mt-1 text-xs text-muted md:text-sm">{t('sections.sub')}</p>
        </div>
        <div className="hidden items-center gap-2 sm:flex">
          <button
            type="button"
            onClick={() => scroll(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/10 bg-white/70 text-ink transition-colors hover:border-olive hover:bg-white"
            aria-label="Scroll sections back"
          >
            <ArrowLeft className="h-4 w-4 rtl-flip" />
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/10 bg-white/70 text-ink transition-colors hover:border-olive hover:bg-white"
            aria-label="Scroll sections forward"
          >
            <ArrowRight className="h-4 w-4 rtl-flip" />
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 md:-mx-8 md:px-8"
      >
        {STORE_SECTIONS.map((section) => (
          <Link
            key={section.key}
            href={section.href}
            className="group flex w-[220px] shrink-0 snap-start flex-col gap-3 rounded-[1.5rem] border border-ink/[0.06] p-3 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-card sm:w-[248px]"
            style={{ backgroundColor: section.tint }}
          >
            <div className="product-media relative aspect-[4/3] w-full rounded-[1.1rem]">
              <Image
                src={section.image}
                alt={section.label[lang]}
                fill
                sizes="248px"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              />
            </div>
            <div className="flex items-center justify-between gap-2 px-1 pb-1">
              <span className="line-clamp-2 text-[0.8125rem] font-extrabold leading-tight text-ink">
                {section.label[lang]}
              </span>
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/80 text-ink transition-colors group-hover:bg-ink group-hover:text-canary">
                <ArrowRight className="h-3.5 w-3.5 rtl-flip" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
