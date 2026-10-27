'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y, Autoplay } from 'swiper/modules';
import type { Swiper as SwiperClass } from 'swiper';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import 'swiper/css';
import { ProductCard } from '@/components/catalog/ProductCard';
import { useLanguage } from '@/components/providers/LanguageProvider';
import type { Product } from '@/lib/products';

type ProductSwiperProps = {
  title: string;
  sub?: string;
  items: Product[];
  action?: { href: string; label: string };
};

export function ProductSwiper({ title, sub, items, action }: ProductSwiperProps) {
  const { lang } = useLanguage();
  const swiperRef = useRef<SwiperClass | null>(null);

  return (
    <section className="section section--tight">
      <div className="shell">
        <div className="section-heading">
          <div className="section-heading__copy">
            <p className="eyebrow">
              {lang === 'ar' ? 'الأكثر رواجاً' : 'Trending now'}
            </p>
            <h2 className="section-title">{title}</h2>
            {sub ? <p className="section-sub">{sub}</p> : null}
          </div>
          {action ? (
            <Link href={action.href} className="section-link">
              {action.label}
              <ArrowUpRight aria-hidden="true" />
            </Link>
          ) : null}
        </div>

        <Swiper
          modules={[Autoplay, A11y]}
          slidesPerView={1.15}
          spaceBetween={12}
          speed={650}
          watchOverflow
          autoplay={{ delay: 5600, disableOnInteraction: true, pauseOnMouseEnter: true }}
          breakpoints={{
            560: { slidesPerView: 2.1, spaceBetween: 12 },
            900: { slidesPerView: 3.15, spaceBetween: 14 },
            1200: { slidesPerView: 4.25, spaceBetween: 18 },
          }}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          className="category-swiper"
        >
          {items.map((product, index) => (
            <SwiperSlide key={`${product.code}-${product.name.en}`}>
              <ProductCard product={product} priority={index < 2} />
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="category-swiper-nav">
          <button
            type="button"
            className="rail-btn"
            aria-label={lang === 'ar' ? 'المنتجات السابقة' : 'Previous products'}
            onClick={() => swiperRef.current?.slidePrev()}
          >
            <ChevronLeft aria-hidden="true" />
          </button>
          <button
            type="button"
            className="rail-btn"
            aria-label={lang === 'ar' ? 'المنتجات التالية' : 'Next products'}
            onClick={() => swiperRef.current?.slideNext()}
          >
            <ChevronRight aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
