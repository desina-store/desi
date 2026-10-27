'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef, type CSSProperties } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y } from 'swiper/modules';
import type { Swiper as SwiperClass } from 'swiper';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import 'swiper/css';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { STORE_SECTIONS, type CategorySlug } from '@/lib/site';
import { dealsProducts, products, productsForCategory } from '@/lib/products';
import { CATEGORY_COPY, pick } from '@/lib/brand-copy';

const SWIPABLE = new Set<CategorySlug>([
  'mobiles',
  'computers',
  'appliances',
  'outlet',
  'sports',
  'fashion',
]);

function sectionCount(key: string): number | null {
  if (key === 'all') return products.length;
  if (key === 'offers') return dealsProducts().length;
  if ((SWIPABLE as Set<string>).has(key)) return productsForCategory(key as CategorySlug).length;
  return null;
}

export function CategoryRail() {
  const { lang } = useLanguage();
  const swiperRef = useRef<SwiperClass | null>(null);

  return (
    <>
      <Swiper
        modules={[A11y]}
        slidesPerView={1.15}
        spaceBetween={12}
        watchOverflow
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
        {STORE_SECTIONS.map((section) => {
          const isAll = section.key === 'all';
          const count = sectionCount(section.key);
          const label =
            count === null
              ? pick(lang, 'Limited stock', 'لفترة محدودة')
              : `${count} ${pick(lang, count === 1 ? CATEGORY_COPY.product.en : CATEGORY_COPY.products.en, count === 1 ? CATEGORY_COPY.product.ar : CATEGORY_COPY.products.ar)}`;

          return (
            <SwiperSlide key={section.key}>
              <Link
                href={section.href}
                className={`category-card${isAll ? ' category-card--all' : ''}`}
                style={{ '--tone': section.tint } as CSSProperties}
              >
                <div className="category-card__media">
                  <Image
                    src={section.image}
                    alt={section.label[lang]}
                    fill
                    sizes="(max-width: 640px) 88vw, (max-width: 1200px) 32vw, 24vw"
                    quality={88}
                  />
                  <span className="category-card__tag">{label}</span>
                </div>
                <div className="category-card__body">
                  <div className="category-card__copy">
                    <h3>{section.label[lang]}</h3>
                    <span>{pick(lang, CATEGORY_COPY.browseAll.en, CATEGORY_COPY.browseAll.ar)}</span>
                  </div>
                  <span className="category-card__arrow" aria-hidden="true">
                    <ArrowUpRight />
                  </span>
                </div>
              </Link>
            </SwiperSlide>
          );
        })}
      </Swiper>

      <div className="category-swiper-nav">
        <button
          type="button"
          className="rail-btn"
          aria-label={pick(lang, 'Previous categories', 'الأقسام السابقة')}
          onClick={() => swiperRef.current?.slidePrev()}
        >
          <ChevronLeft aria-hidden="true" />
        </button>
        <button
          type="button"
          className="rail-btn"
          aria-label={pick(lang, 'Next categories', 'الأقسام التالية')}
          onClick={() => swiperRef.current?.slideNext()}
        >
          <ChevronRight aria-hidden="true" />
        </button>
      </div>
    </>
  );
}
