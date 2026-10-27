'use client';

import { useState, type FormEvent } from 'react';
import { CheckCircle2, Send } from 'lucide-react';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { HOME_COPY, pick } from '@/lib/brand-copy';

export function NewsletterForm() {
  const { lang } = useLanguage();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim()) return;
    try {
      const stored = window.localStorage.getItem('desina_newsletter');
      const list = stored ? (JSON.parse(stored) as string[]) : [];
      const next = Array.isArray(list) ? list : [];
      if (!next.includes(email.trim())) next.push(email.trim());
      window.localStorage.setItem('desina_newsletter', JSON.stringify(next.slice(-50)));
    } catch {
      /* storage can be blocked; the confirmation still shows */
    }
    setSubscribed(true);
  }

  if (subscribed) {
    return (
      <div className="newsletter__success" role="status">
        <CheckCircle2 aria-hidden="true" />
        <span>{pick(lang, HOME_COPY.newsletterSuccess.en, HOME_COPY.newsletterSuccess.ar)}</span>
      </div>
    );
  }

  return (
    <div className="newsletter__form-wrap">
      <form className="newsletter__form" onSubmit={handleSubmit}>
        <label htmlFor="newsletter-email" className="sr-only">
          {pick(lang, HOME_COPY.newsletterPlaceholder.en, HOME_COPY.newsletterPlaceholder.ar)}
        </label>
        <input
          id="newsletter-email"
          type="email"
          name="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder={pick(lang, HOME_COPY.newsletterPlaceholder.en, HOME_COPY.newsletterPlaceholder.ar)}
        />
        <button type="submit" className="btn btn-primary">
          <Send aria-hidden="true" />
          {pick(lang, HOME_COPY.newsletterButton.en, HOME_COPY.newsletterButton.ar)}
        </button>
      </form>
      <p className="newsletter__hint">
        {pick(lang, HOME_COPY.newsletterHint.en, HOME_COPY.newsletterHint.ar)}
      </p>
    </div>
  );
}
