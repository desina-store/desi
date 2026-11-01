'use client';

import { useState } from 'react';
import { Check, Copy, ExternalLink, Star } from 'lucide-react';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { GOOGLE_REVIEW_URL, REVIEW_TAGS, TRUSTPILOT_REVIEW_URL } from '@/lib/content';

export function ReviewComposer() {
  const { lang, t } = useLanguage();
  const [rating, setRating] = useState(5);
  const [tags, setTags] = useState<string[]>([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(false);

  function toggleTag(tag: string) {
    setTags((current) => (current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag]));
  }

  async function share() {
    const lines = [
      `DeSinaHub review — ${rating}/5`,
      name ? `From: ${name}` : '',
      message,
      tags.length ? tags.join(' · ') : '',
    ].filter(Boolean);

    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      setCopied(false);
    }
    window.open(GOOGLE_REVIEW_URL, '_blank', 'noopener,noreferrer');
  }

  return (
    <div className="surface-card p-5 md:p-7">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-extrabold text-ink">{t('reviews.share')}</h2>
        <span className="hidden rounded-full bg-canary/60 px-3 py-1 text-[0.625rem] font-extrabold uppercase tracking-[0.12em] text-olive-dark sm:inline-flex">
          Google · Trustpilot
        </span>
      </div>

      <div className="mt-4">
        <p className="text-[0.6875rem] font-extrabold uppercase tracking-[0.12em] text-muted">{t('reviews.tags')}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {REVIEW_TAGS.map((tag) => {
            const label = tag[lang];
            const active = tags.includes(label);
            return (
              <button
                key={label}
                type="button"
                onClick={() => toggleTag(label)}
                className={`rounded-full border px-3 py-1.5 text-[0.6875rem] font-bold transition-colors ${
                  active
                    ? 'border-olive bg-canary/40 text-ink'
                    : 'border-ink/10 bg-white/70 text-ink/70 hover:border-olive/40'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-1">
        {Array.from({ length: 5 }, (_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setRating(index + 1)}
            aria-label={`${index + 1} stars`}
            className="p-0.5 text-[#f4b400]"
          >
            <Star className="h-6 w-6" fill={index < rating ? 'currentColor' : 'none'} strokeWidth={1.5} />
          </button>
        ))}
        <span className="ms-2 text-xs font-extrabold text-muted">{rating}/5</span>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-[0.6875rem] font-extrabold uppercase tracking-[0.1em] text-ink/65">
            {t('reviews.name')}
          </span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-xl border border-ink/10 bg-white/85 px-3.5 py-3 text-sm font-semibold outline-none transition-colors focus:border-olive/60 focus:bg-white"
          />
        </label>
        <div className="hidden sm:block" />
        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-[0.6875rem] font-extrabold uppercase tracking-[0.1em] text-ink/65">
            {t('reviews.message')}
          </span>
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            rows={3}
            className="w-full resize-none rounded-xl border border-ink/10 bg-white/85 px-3.5 py-3 text-sm font-semibold outline-none transition-colors focus:border-olive/60 focus:bg-white"
          />
        </label>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button type="button" onClick={share} className="btn-primary">
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {t('reviews.submit')}
        </button>
        <a href={TRUSTPILOT_REVIEW_URL} target="_blank" rel="noopener noreferrer" className="btn-ghost text-xs">
          Trustpilot
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
      <p className="mt-3 text-[0.6875rem] leading-relaxed text-muted">
        {copied ? t('reviews.copied') : t('reviews.note')}
      </p>
    </div>
  );
}
