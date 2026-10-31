"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Autoplay } from "swiper/modules";
import "swiper/css";
import { testimonials } from "@/data/testimonials";
import { useI18n } from "@/components/providers/i18n-provider";
import { Stars } from "@/components/ui/stars";

function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function TestimonialsSwiper() {
  const { lang } = useI18n();

  return (
    <Swiper
      modules={[Autoplay, A11y]}
      className="testimonials-swiper"
      slidesPerView={1.1}
      spaceBetween={12}
      speed={650}
      loop
      autoplay={{ delay: 5600, disableOnInteraction: false, pauseOnMouseEnter: true }}
      breakpoints={{
        640: { slidesPerView: 2.1, spaceBetween: 14 },
        1024: { slidesPerView: 3.15, spaceBetween: 16 },
      }}
    >
      {testimonials.map((testimonial) => (
        <SwiperSlide key={testimonial.name}>
          <article className="testimonial-card">
            <div className="testimonial-card__top">
              <span className="testimonial-card__product">{testimonial.product[lang]}</span>
              <Stars rating={testimonial.rating} label={testimonial.title[lang]} />
            </div>
            <p className="testimonial-card__text">{testimonial.text[lang]}</p>
            <div className="testimonial-card__author">
              <span className="testimonial-card__avatar" aria-hidden="true">
                {initials(testimonial.name)}
              </span>
              <div>
                <strong>{testimonial.name}</strong>
                <span>{testimonial.city[lang]}</span>
              </div>
            </div>
          </article>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
