"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Autoplay } from "swiper/modules";
import type { Swiper as SwiperClass } from "swiper";
import { ChevronLeft, ChevronRight, Star, Truck } from "lucide-react";
import "swiper/css";
import { heroSlides } from "@/data/home-content";
import { useI18n } from "@/components/providers/i18n-provider";

export function HeroSlider() {
  const { lang, t, price, tr } = useI18n();
  const swiperRef = useRef<SwiperClass | null>(null);

  return (
    <div className="hero__visual">
      <div className="hero-swiper">
        <Swiper
          modules={[Autoplay, A11y]}
          loop
          speed={800}
          autoplay={{ delay: 6500, disableOnInteraction: false, pauseOnMouseEnter: true }}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
        >
          {heroSlides.map((slide, index) => {
            const isProduct = slide.href.startsWith("/product/");
            return (
              <SwiperSlide key={slide.id}>
                <Link className="hero-slide" href={slide.href}>
                  <div className="hero-slide__media">
                    <Image
                      src={slide.image}
                      alt={slide.title[lang]}
                      fill
                      priority={index === 0}
                      fetchPriority="high"
                      sizes="(max-width: 900px) 100vw, 52vw"
                      quality={92}
                      style={{ objectPosition: slide.focus ?? "center" }}
                    />
                  </div>
                  <span className="hero-slide__discount">
                    {slide.badge[lang]}
                    {slide.oldPrice ? <small>{t("common.off")}</small> : null}
                  </span>
                  <div className="hero-slide__content">
                    <span className="hero-slide__eyebrow">{slide.kicker[lang]}</span>
                    <h2 className="hero-slide__title">{slide.title[lang]}</h2>
                    <div className="hero-slide__foot">
                      <span className="hero-slide__price">
                        {isProduct ? null : `${t("common.from")} `}
                        {price(slide.price)}
                        {slide.oldPrice ? <del>{price(slide.oldPrice)}</del> : null}
                      </span>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>

        <div className="hero-controls">
          <button
            type="button"
            aria-label={tr("Previous slide", "الشريحة السابقة")}
            onClick={() => swiperRef.current?.slidePrev()}
          >
            <ChevronLeft aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label={tr("Next slide", "الشريحة التالية")}
            onClick={() => swiperRef.current?.slideNext()}
          >
            <ChevronRight aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="hero-float hero-float--rating">
        <span className="hero-float__icon">
          <Star aria-hidden="true" />
        </span>
        <div className="hero-float__copy">
          <strong>{tr("4.8/5 store rating", "تقييم المتجر 4.8/5")}</strong>
          <span>{tr("1,200+ happy customers", "أكثر من 1200 عميل سعيد")}</span>
        </div>
      </div>

      <div className="hero-float hero-float--ship">
        <span className="hero-float__icon">
          <Truck aria-hidden="true" />
        </span>
        <div className="hero-float__copy">
          <strong>{t("product.delivery")}</strong>
          <span>{tr("Free on every order", "مجاناً على كل الطلبات")}</span>
        </div>
      </div>
    </div>
  );
}
