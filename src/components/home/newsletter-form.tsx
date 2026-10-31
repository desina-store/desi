"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { useI18n } from "@/components/providers/i18n-provider";

export function NewsletterForm() {
  const { t, tr } = useI18n();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim()) return;
    try {
      const stored = window.localStorage.getItem("desina_newsletter");
      const list = stored ? (JSON.parse(stored) as string[]) : [];
      const next = Array.isArray(list) ? list : [];
      if (!next.includes(email.trim())) next.push(email.trim());
      window.localStorage.setItem("desina_newsletter", JSON.stringify(next.slice(-50)));
    } catch {
      // Subscription confirmation still shows if storage is unavailable.
    }
    setSubscribed(true);
  }

  if (subscribed) {
    return (
      <div className="newsletter__success" role="status">
        <CheckCircle2 aria-hidden="true" />
        <span>{t("home.newsletter.success")}</span>
      </div>
    );
  }

  return (
    <div className="newsletter__form-wrap">
      <form className="newsletter__form" onSubmit={handleSubmit}>
        <label htmlFor="newsletter-email" className="sr-only">
          {t("home.newsletter.placeholder")}
        </label>
        <input
          id="newsletter-email"
          type="email"
          name="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder={t("home.newsletter.placeholder")}
        />
        <button type="submit" className="btn btn-primary">
          <Send aria-hidden="true" />
          {t("home.newsletter.button")}
        </button>
      </form>
      <p className="newsletter__hint">
        {tr(
          "No spam — just new arrivals and subscriber-only offers.",
          "بلا رسائل مزعجة — فقط الإضافات الجديدة وعروض المشتركين.",
        )}
      </p>
    </div>
  );
}
