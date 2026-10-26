'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y, Autoplay } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { ProductCard } from '@/components/catalogss/ProductCard';
import { useLanguage } from '@/components/providers/LanguageProvider';
import type { Product } from '@/lib/products';

type ProductSwiperProps = {
  title: string;
  sub?: string;
  items: Product[];
  action?: { href: string; label: string };
};

export function ProductSwiper({ title, sub, items, action }: ProductSwiperProps) {
  const { t } = useLanguage();
  const [swiper, setSwiper] = useState<SwiperType | null>(null);

  return (
    <section className="relative">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-xl">
          <span className="mb-2 inline-flex items-center gap-2 text-[0.625rem] font-extrabold uppercase tracking-[0.2em] text-olive">
            <span className="h-1.5 w-1.5 rounded-full bg-canary-deep" />
            {t('hero.limited')}
          </span>
          <h2 className="text-2xl font-extrabold tracking-tight text-ink md:text-[2rem]">{title}</h2>
          {sub ? <p className="mt-1.5 text-sm text-muted">{sub}</p> : null}
        </div>
        <div className="flex items-center gap-2">
          {action ? (
            <Link
              href={action.href}
              className="hidden rounded-full border border-ink/10 bg-white/70 px-4 py-2 text-xs font-extrabold text-ink transition-colors hover:border-olive hover:bg-white sm:inline-flex"
            >
              {action.label}
            </Link>
          ) : null}
          <button
            type="button"
            onClick={() => swiper?.slidePrev()}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/10 bg-white/70 text-ink transition-colors hover:border-olive hover:bg-white"
            aria-label="Previous products"
          >
            <ArrowLeft className="h-4 w-4 rtl-flip" />
          </button>
          <button
            type="button"
            onClick={() => swiper?.slideNext()}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/10 bg-white/70 text-ink transition-colors hover:border-olive hover:bg-white"
            aria-label="Next products"
          >
            <ArrowRight className="h-4 w-4 rtl-flip" />
          </button>
        </div>
      </div>

      <Swiper
        onSwiper={setSwiper}
        modules={[Autoplay, A11y]}
        spaceBetween={14}
        slidesPerView={1.15}
        autoplay={{ delay: 5200, disableOnInteraction: true, pauseOnMouseEnter: true }}
        breakpoints={{
          640: { slidesPerView: 2.15, spaceBetween: 16 },
          1024: { slidesPerView: 3.2, spaceBetween: 18 },
          1280: { slidesPerView: 4, spaceBetween: 20 },
        }}
        className="!pb-1"
      >
        {items.map((product) => (
          <SwiperSlide key={`${product.code}-${product.name.en}`} className="h-auto">
            <ProductCard product={product} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
