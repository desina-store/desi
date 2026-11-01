'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y, Autoplay } from 'swiper/modules';
import 'swiper/css';
import { REVIEW_STATIC } from '@/lib/content';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { Stars } from '@/components/ui/Stars';

export function TestimonialsSwiper() {
  const { lang } = useLanguage();

  return (
    <Swiper
      modules={[Autoplay, A11y]}
      className="testimonials-swiper"
      slidesPerView={1.1}
      spaceBetween={12}
      speed={650}
      watchOverflow
      autoplay={{ delay: 5600, disableOnInteraction: false, pauseOnMouseEnter: true }}
      breakpoints={{
        640: { slidesPerView: 2.1, spaceBetween: 14 },
        1024: { slidesPerView: 3.15, spaceBetween: 16 },
      }}
    >
      {REVIEW_STATIC.map((review) => (
        <SwiperSlide key={review.name.en}>
          <article className="testimonial-card">
            <div className="testimonial-card__top">
              <span className="testimonial-card__product">{review.time[lang]}</span>
              <Stars rating={review.stars} label={review.name[lang]} />
            </div>
            <p className="testimonial-card__text">{review.text[lang]}</p>
            <div className="testimonial-card__author">
              <span className="testimonial-card__avatar" aria-hidden="true">
                {review.avatar}
              </span>
              <div>
                <strong>{review.name[lang]}</strong>
                <span>{lang === 'ar' ? 'عميل موثّق' : 'Verified shopper'}</span>
              </div>
            </div>
          </article>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
