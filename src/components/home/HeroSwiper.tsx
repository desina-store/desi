'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y, Autoplay } from 'swiper/modules';
import type { Swiper as SwiperClass } from 'swiper';
import { ArrowRight, ChevronLeft, ChevronRight, ShoppingBag, Star, Tag, Truck } from 'lucide-react';
import 'swiper/css';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { HERO_SLIDES } from '@/lib/hero';
import { discountPercent, getProduct, parseProductCode } from '@/lib/products';
import { formatPrice } from '@/lib/format';
import { Stars } from '@/components/ui/Stars';
import { HERO_COPY, pick } from '@/lib/brand-copy';

export function HeroSwiper() {
  const { lang } = useLanguage();
  const swiperRef = useRef<SwiperClass | null>(null);

  return (
    <section className="hero">
      <div className="shell">
        <div className="hero__grid">
          <div className="hero__copy">
            <p className="eyebrow">{pick(lang, HERO_COPY.eyebrow.en, HERO_COPY.eyebrow.ar)}</p>
            <h1 className="hero__title">
              {pick(lang, HERO_COPY.titleLead.en, HERO_COPY.titleLead.ar)}
              <br />
              <em>{pick(lang, HERO_COPY.titleEm.en, HERO_COPY.titleEm.ar)}</em>
            </h1>
            <p className="hero__lead">{pick(lang, HERO_COPY.lead.en, HERO_COPY.lead.ar)}</p>

            <div className="hero__actions">
              <Link href="/offers" className="btn btn-primary">
                <ShoppingBag aria-hidden="true" />
                {lang === 'ar' ? 'تسوّق كل الأقسام' : 'Shop all departments'}
              </Link>
              <Link href="/outlet" className="btn btn-outline">
                <Tag aria-hidden="true" />
                {lang === 'ar' ? 'العروض' : 'Offers'}
              </Link>
            </div>

            <div className="hero__proof">
              <div className="avatar-stack" aria-hidden="true">
                <span>MK</span>
                <span>SA</span>
                <span>NH</span>
                <span>YA</span>
              </div>
              <div className="hero__proof-copy">
                <strong>
                  <Stars
                    rating={5}
                    label={pick(lang, HERO_COPY.ratingLabel.en, HERO_COPY.ratingLabel.ar)}
                  />
                  <span>4.8 / 5</span>
                </strong>
                <span>{pick(lang, HERO_COPY.ratingNote.en, HERO_COPY.ratingNote.ar)}</span>
              </div>
            </div>
          </div>

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
                {HERO_SLIDES.map((slide, index) => {
                  const code = parseProductCode(slide.href.split('/').pop());
                  const product = code ? getProduct(code) : undefined;
                  const discount = product ? discountPercent(product) : null;
                  return (
                    <SwiperSlide key={slide.id}>
                      <Link className="hero-slide" href={slide.href}>
                        <div className="hero-slide__media">
                          <Image
                            src={slide.image}
                            alt={slide.title[lang]}
                            fill
                            priority={index === 0}
                            sizes="(max-width: 900px) 100vw, 52vw"
                            quality={92}
                          />
                        </div>
                        {discount ? (
                          <span className="hero-slide__discount">
                            −{discount}%
                            <small>{lang === 'ar' ? 'خصم' : 'OFF'}</small>
                          </span>
                        ) : null}
                        <div className="hero-slide__content">
                          <span className="hero-slide__eyebrow">{slide.kicker[lang]}</span>
                          <h2 className="hero-slide__title">{slide.title[lang]}</h2>
                          <div className="hero-slide__foot">
                            <span className="hero-slide__price">
                              {product ? (
                                <>
                                  {formatPrice(product.price, lang)}
                                  {product.oldPrice ? <del>{formatPrice(product.oldPrice, lang)}</del> : null}
                                </>
                              ) : (
                                slide.body[lang]
                              )}
                            </span>
                            <span className="hero-slide__arrow" aria-hidden="true">
                              <ArrowRight />
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
                  aria-label={pick(lang, HERO_COPY.prevSlide.en, HERO_COPY.prevSlide.ar)}
                  onClick={() => swiperRef.current?.slidePrev()}
                >
                  <ChevronLeft aria-hidden="true" />
                </button>
                <button
                  type="button"
                  aria-label={pick(lang, HERO_COPY.nextSlide.en, HERO_COPY.nextSlide.ar)}
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
                <strong>{pick(lang, HERO_COPY.floatRating.en, HERO_COPY.floatRating.ar)}</strong>
                <span>{pick(lang, HERO_COPY.floatCustomers.en, HERO_COPY.floatCustomers.ar)}</span>
              </div>
            </div>

            <div className="hero-float hero-float--ship">
              <span className="hero-float__icon">
                <Truck aria-hidden="true" />
              </span>
              <div className="hero-float__copy">
                <strong>{lang === 'ar' ? 'الشحن' : 'Shipping'}</strong>
                <span>{pick(lang, HERO_COPY.floatFreeShip.en, HERO_COPY.floatFreeShip.ar)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
