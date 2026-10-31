"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, type CSSProperties } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y } from "swiper/modules";
import type { Swiper as SwiperClass } from "swiper";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import "swiper/css";
import { categories } from "@/data/categories";
import { products, productsInCategories } from "@/data/products";
import { useI18n } from "@/components/providers/i18n-provider";

export function CategorySwiper() {
  const { lang, t, tr } = useI18n();
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
        {categories.map((category) => {
          const count =
            category.kind === "service" ? 0 : productsInCategories(category.sourceCategories).length;
          const label =
            category.kind === "service"
              ? t("nav.services")
              : `${count} ${count === 1 ? t("common.item") : t("common.items")}`;

          return (
            <SwiperSlide key={category.slug}>
              <Link
                href={`/category/${category.slug}`}
                className="category-card"
                style={{ "--tone": category.tone } as CSSProperties}
              >
                <div className="category-card__media">
                  <Image
                    src={category.image}
                    alt={category.name[lang]}
                    fill
                    sizes="(max-width: 640px) 88vw, (max-width: 1200px) 32vw, 24vw"
                    quality={88}
                  />
                  <span className="category-card__tag">{label}</span>
                </div>
                <div className="category-card__body">
                  <div className="category-card__copy">
                    <h3>{category.name[lang]}</h3>
                    <span>{category.tagline[lang]}</span>
                  </div>
                  <span className="category-card__arrow" aria-hidden="true">
                    <ArrowUpRight />
                  </span>
                </div>
              </Link>
            </SwiperSlide>
          );
        })}

        <SwiperSlide>
          <Link
            href="/shop"
            className="category-card category-card--all"
            aria-label={t("nav.allProducts")}
          >
            <div className="category-card__media">
              <Image
                src="/products/p12.webp"
                alt=""
                fill
                sizes="(max-width: 640px) 88vw, (max-width: 1200px) 32vw, 24vw"
                quality={88}
              />
              <span className="category-card__tag">{tr("Full catalogue", "الكتالوج الكامل")}</span>
            </div>
            <div className="category-card__body">
              <div className="category-card__copy">
                <h3>{t("nav.allProducts")}</h3>
                <span>
                  {products.length} {t("common.items")}
                </span>
              </div>
              <span className="category-card__arrow" aria-hidden="true">
                <ArrowUpRight />
              </span>
            </div>
          </Link>
        </SwiperSlide>
      </Swiper>

      <div className="category-swiper-nav">
        <button
          type="button"
          className="rail-btn"
          aria-label={tr("Previous categories", "الأقسام السابقة")}
          onClick={() => swiperRef.current?.slidePrev()}
        >
          <ChevronLeft aria-hidden="true" />
        </button>
        <button
          type="button"
          className="rail-btn"
          aria-label={tr("Next categories", "الأقسام التالية")}
          onClick={() => swiperRef.current?.slideNext()}
        >
          <ChevronRight aria-hidden="true" />
        </button>
      </div>
    </>
  );
}
