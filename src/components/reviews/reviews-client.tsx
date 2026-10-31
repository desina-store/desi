"use client";

import { useEffect, useState, type FormEvent } from "react";
import { BadgeCheck, Star } from "lucide-react";
import { testimonials, type Testimonial } from "@/data/testimonials";
import { formatDate } from "@/lib/i18n";
import { safeRead, safeWrite, STORAGE_KEYS } from "@/lib/storage";
import { useI18n } from "@/components/providers/i18n-provider";
import { Stars } from "@/components/ui/stars";

type StoredReview = {
  id: string;
  name: string;
  rating: number;
  text: string;
  date: string;
};

function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function ReviewsClient() {
  const { lang, t, tr } = useI18n();
  const [stored, setStored] = useState<StoredReview[]>([]);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");
  const [published, setPublished] = useState(false);

  useEffect(() => {
    setStored(safeRead<StoredReview[]>(STORAGE_KEYS.reviews, []));
  }, []);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim() || !message.trim()) return;
    const review: StoredReview = {
      id: `review-${Date.now()}`,
      name: name.trim(),
      rating,
      text: message.trim(),
      date: new Date().toISOString(),
    };
    const next = [review, ...stored].slice(0, 30);
    setStored(next);
    safeWrite(STORAGE_KEYS.reviews, next);
    setName("");
    setMessage("");
    setRating(5);
    setPublished(true);
  }

  return (
    <div className="reviews-layout">
      <div>
        <div className="reviews-grid">
          {stored.map((review) => (
            <article className="review-card" key={review.id}>
              <div className="review-card__top">
                <span className="testimonial-card__product">{t("reviewsPage.verified")}</span>
                <Stars rating={review.rating} />
              </div>
              <p className="review-card__text">{review.text}</p>
              <div className="review-card__author">
                <span className="review-card__avatar" aria-hidden="true">
                  {initials(review.name)}
                </span>
                <div>
                  <strong>{review.name}</strong>
                  <span>{formatDate(review.date, lang)}</span>
                </div>
              </div>
            </article>
          ))}

          {testimonials.map((testimonial: Testimonial) => (
            <article className="review-card" key={testimonial.name}>
              <div className="review-card__top">
                <span className="testimonial-card__product">{testimonial.product[lang]}</span>
                <Stars rating={testimonial.rating} label={testimonial.title[lang]} />
              </div>
              <h3>{testimonial.title[lang]}</h3>
              <p className="review-card__text">{testimonial.text[lang]}</p>
              <div className="review-card__author">
                <span className="review-card__avatar" aria-hidden="true">
                  {initials(testimonial.name)}
                </span>
                <div>
                  <strong>{testimonial.name}</strong>
                  <span>
                    {testimonial.city[lang]} · {t("reviewsPage.verified")}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <form className="review-form" onSubmit={submit}>
        <h2>{t("reviewsPage.formTitle")}</h2>
        <p>{tr("Reviews are saved on this device.", "تُحفظ التقييمات على هذا الجهاز.")}</p>

        <div className="field">
          <label htmlFor="review-name">{t("reviewsPage.formName")}</label>
          <input
            id="review-name"
            className="input"
            value={name}
            onChange={(event) => setName(event.target.value)}
            autoComplete="name"
            required
          />
        </div>

        <div className="field">
          <span className="field-label">{t("reviewsPage.formRating")}</span>
          <div className="rating-input" role="group" aria-label={t("reviewsPage.formRating")}>
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                className={value <= rating ? "is-active" : ""}
                aria-label={tr(`${value} star${value > 1 ? "s" : ""}`, `${value} نجوم`)}
                aria-pressed={value === rating}
                onClick={() => setRating(value)}
              >
                <Star aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>

        <div className="field">
          <label htmlFor="review-message">{t("reviewsPage.formMessage")}</label>
          <textarea
            id="review-message"
            className="textarea"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary btn-block">
          <BadgeCheck aria-hidden="true" />
          {t("reviewsPage.formSubmit")}
        </button>

        {published ? (
          <p className="review-success" role="status">
            <BadgeCheck aria-hidden="true" />
            {t("reviewsPage.formSuccess")}
          </p>
        ) : null}
      </form>
    </div>
  );
}
