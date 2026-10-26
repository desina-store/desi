'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { ArrowRight, BadgeCheck, ShieldCheck, Sparkles, Truck } from 'lucide-react';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { HERO_SLIDES, heroSlideText } from '@/lib/hero';
import { products } from '@/lib/products';
import { formatCount } from '@/lib/format';

const TRUST = [
  {
    icon: ShieldCheck,
    en: 'Server-verified payments',
    ar: 'مدفوعات موثّقة على السيرفر',
  },
  {
    icon: Truck,
    en: 'Delivery in 2–4 business days',
    ar: 'التسليم خلال 2–4 أيام عمل',
  },
  {
    icon: BadgeCheck,
    en: '100% genuine products',
    ar: 'منتجات أصلية 100%',
  },
];

export function HeroSwiper() {
  const { lang, t } = useLanguage();
  const [active, setActive] = useState(0);
  const [mounted, setMounted] = useState(false);
  const isRtl = lang === 'ar';

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute -top-32 start-[-6rem] h-80 w-80 rounded-full bg-canary/30 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute top-32 end-[-8rem] h-96 w-96 rounded-full bg-olive/10 blur-3xl" />

      <div className="page-shell relative py-9 md:py-14">
        <div className="grid items-center gap-8 lg:grid-cols-[1.02fr_1.18fr] lg:gap-12">
          <div className="min-w-0 ds-rise">
            <span className="inline-flex items-center gap-2 rounded-full border border-olive/20 bg-white/65 px-3.5 py-1.5 text-[0.625rem] font-extrabold uppercase tracking-[0.18em] text-olive backdrop-blur">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-olive opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-olive" />
              </span>
              {t('hero.eyebrow')}
            </span>

            <h1 className="mt-5 max-w-[19ch] text-balance text-[2.35rem] font-extrabold leading-[1.08] tracking-[-0.02em] text-ink sm:text-5xl lg:text-[3.4rem]">
              {t('hero.title')}
            </h1>

            <p className="mt-5 max-w-[50ch] text-sm leading-relaxed text-muted md:text-base">{t('hero.sub')}</p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link href="/offers" className="btn-primary group">
                <Sparkles className="h-4 w-4" />
                {t('hero.cta')}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl-flip" />
              </Link>
              <a href="#sections" className="btn-ghost">
                {t('hero.browse')}
              </a>
            </div>

            <dl className="mt-8 grid max-w-md grid-cols-3 gap-3">
              <div className="rounded-2xl border border-ink/[0.06] bg-white/55 px-3 py-3 text-center backdrop-blur-sm">
                <dt className="text-[0.5625rem] font-bold uppercase tracking-[0.12em] text-muted">{lang === 'ar' ? 'منتج' : 'Products'}</dt>
                <dd className="mt-1 text-lg font-extrabold text-ink">{formatCount(products.length, lang)}+</dd>
              </div>
              <div className="rounded-2xl border border-ink/[0.06] bg-white/55 px-3 py-3 text-center backdrop-blur-sm">
                <dt className="text-[0.5625rem] font-bold uppercase tracking-[0.12em] text-muted">{lang === 'ar' ? 'أقسام' : 'Sections'}</dt>
                <dd className="mt-1 text-lg font-extrabold text-ink">{formatCount(8, lang)}</dd>
              </div>
              <div className="rounded-2xl border border-ink/[0.06] bg-white/55 px-3 py-3 text-center backdrop-blur-sm">
                <dt className="text-[0.5625rem] font-bold uppercase tracking-[0.12em] text-muted">{lang === 'ar' ? 'تقييم' : 'Rating'}</dt>
                <dd className="mt-1 text-lg font-extrabold text-ink">4.8<span className="text-xs text-muted">/5</span></dd>
              </div>
            </dl>
          </div>

          <div className="min-w-0 ds-fade-in relative">
            <div className="absolute -top-3 end-4 z-20 hidden items-center gap-2 rounded-full bg-ink px-3.5 py-1.5 text-[0.625rem] font-extrabold uppercase tracking-[0.14em] text-canary shadow-float sm:inline-flex">
              <Sparkles className="h-3.5 w-3.5" />
              {t('hero.limited')}
            </div>

            <div className="rounded-[2rem] border border-white/70 bg-white/55 p-2 shadow-float backdrop-blur-sm min-h-[360px] sm:min-h-[420px]">
              {!mounted ? (
                <div className="w-full h-full min-h-[350px] sm:min-h-[400px] rounded-[1.6rem] bg-ink/5" />
              ) : (
                <Swiper
                  modules={[Autoplay, Navigation, Pagination]}
                  slidesPerView={1}
                  spaceBetween={0}
                  loop={true}
                  speed={650}
                  autoplay={{ delay: 4600, disableOnInteraction: false, pauseOnMouseEnter: true }}
                  navigation={true}
                  pagination={{ clickable: true }}
                  observer={true}
                  observeParents={true}
                  dir={isRtl ? 'rtl' : 'ltr'}
                  onSlideChange={(swiper: SwiperType) => setActive(swiper.realIndex)}
                  className="hero-swiper overflow-hidden rounded-[1.6rem]"
                  aria-label="DeSinaHub campaigns"
                >
                  {HERO_SLIDES.map((slide) => {
                    const copy = heroSlideText(slide, lang);
                    return (
                      <SwiperSlide key={slide.id}>
                        <div className="relative aspect-[4/3] w-full sm:aspect-[16/11] lg:aspect-[16/12] bg-ink/5">
                          <Image
                            src={slide.image}
                            alt={copy.title}
                            fill
                            priority={slide.id === 1}
                            sizes="(max-width: 1024px) 100vw, 640px"
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/25 to-transparent" />
                          <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-5 pb-10 sm:p-6 sm:pb-12">
                            <span className="w-fit rounded-full bg-canary px-2.5 py-1 text-[0.5625rem] font-extrabold uppercase tracking-[0.14em] text-ink">
                              {copy.kicker}
                            </span>
                            <h2 className="max-w-[22ch] text-balance text-xl font-extrabold leading-tight text-white sm:text-2xl lg:text-[1.65rem]">
                              {copy.title}
                            </h2>
                            <p className="hidden max-w-[46ch] text-[0.8125rem] leading-relaxed text-white/75 sm:block">
                              {copy.body}
                            </p>
                            <Link
                              href={slide.href}
                              className="inline-flex w-fit items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-[0.6875rem] font-extrabold text-ink transition-colors hover:bg-canary"
                            >
                              {t('sections.view')}
                              <ArrowRight className="h-3.5 w-3.5 rtl-flip" />
                            </Link>
                          </div>
                        </div>
                      </SwiperSlide>
                    );
                  })}
                </Swiper>
              )}
            </div>

            <div className="mt-3 flex items-center justify-between px-2">
              <span className="text-[0.6875rem] font-bold tracking-[0.16em] text-muted">
                {String(active + 1).padStart(2, '0')} / {String(HERO_SLIDES.length).padStart(2, '0')}
              </span>
              <span className="text-[0.625rem] font-extrabold uppercase tracking-[0.16em] text-olive">
                {lang === 'ar' ? 'حملات ديسينا 2026' : 'DeSina campaigns 2026'}
              </span>
            </div>

            <span className="sr-only" aria-live="polite">
              {heroSlideText(HERO_SLIDES[active], lang).title}
            </span>
          </div>
        </div>

        <ul className="mt-9 grid gap-2.5 rounded-[1.5rem] border border-ink/[0.06] bg-white/45 p-3 backdrop-blur-sm sm:grid-cols-3 md:mt-12">
          {TRUST.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.en} className="flex items-center gap-2.5 rounded-xl px-3 py-2">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-canary/60 text-olive-dark">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="text-[0.75rem] font-bold text-ink/75">{isRtl ? item.ar : item.en}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
