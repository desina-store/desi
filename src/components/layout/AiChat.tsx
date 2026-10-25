'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { MessageCircle, Send, X } from 'lucide-react';
import { answerLocally, type AssistantAnswer, type AssistantLink } from '@/lib/assistant';
import { useLanguage } from '@/components/providers/LanguageProvider';

type ChatMessage = {
  id: number;
  role: 'user' | 'assistant';
  text: string;
  links?: AssistantLink[];
};

const REMOTE_FALLBACK_MARKERS = ['لم أتمكن من جلب رد', 'حدث خطأ في الاتصال'];
const SUGGESTION_KEYS = ['chat.quick.offers', 'chat.quick.track', 'chat.quick.shipping', 'chat.quick.support'];

export function AiChat() {
  const { lang, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 1, role: 'assistant', text: t('chat.welcome') },
  ]);
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages((current) =>
      current.length === 1 && current[0].role === 'assistant'
        ? [{ id: current[0].id, role: 'assistant', text: t('chat.welcome') }]
        : current,
    );
  }, [lang, t]);

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => inputRef.current?.focus(), 120);
      return () => clearTimeout(timer);
    }
  }, [open]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [messages, pending]);

  async function askRemote(message: string): Promise<string | null> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2200);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
        signal: controller.signal,
      });
      if (!response.ok) return null;
      const data = (await response.json().catch(() => null)) as { reply?: unknown } | null;
      const reply = typeof data?.reply === 'string' ? data.reply.trim() : '';
      if (!reply) return null;
      if (REMOTE_FALLBACK_MARKERS.some((marker) => reply.includes(marker))) return null;
      return reply.slice(0, 1200);
    } catch {
      return null;
    } finally {
      clearTimeout(timer);
    }
  }

  async function send(raw: string) {
    const message = raw.trim().slice(0, 500);
    if (!message || pending) return;

    const userMessage: ChatMessage = { id: Date.now(), role: 'user', text: message };
    setMessages((current) => [...current, userMessage]);
    setInput('');
    setPending(true);

    const local: AssistantAnswer = answerLocally(message, lang);
    const remote = await askRemote(message);

    setMessages((current) => [
      ...current,
      {
        id: Date.now() + 1,
        role: 'assistant',
        text: remote ?? local.text,
        links: remote ? undefined : local.links,
      },
    ]);
    setPending(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={t('chat.open')}
        aria-expanded={open}
        className={`fixed bottom-[calc(var(--mob-h)+env(safe-area-inset-bottom,0px)+0.75rem)] end-4 z-40 inline-flex h-12 w-12 items-center justify-center rounded-full bg-ink text-canary shadow-[0_14px_36px_rgba(17,17,17,0.28)] transition-transform hover:scale-[1.04] md:bottom-6 md:end-6 ${
          open ? 'md:hidden' : ''
        }`}
      >
        {open ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
      </button>

      {open ? (
        <section
          role="dialog"
          aria-modal="false"
          aria-label={t('chat.title')}
          className="ds-rise fixed bottom-[calc(var(--mob-h)+env(safe-area-inset-bottom,0px)+0.5rem)] end-3 start-3 z-50 flex h-[min(540px,calc(100dvh-var(--mob-h)-2rem))] flex-col overflow-hidden rounded-3xl border border-black/10 bg-white shadow-[0_30px_80px_rgba(17,17,17,0.28)] sm:start-auto sm:w-[380px] md:bottom-24 md:end-6"
        >
          <header className="flex items-center justify-between gap-3 bg-[#1f1f1f] px-4 py-3 text-white">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-canary text-ink">
                <MessageCircle className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-black leading-tight">{t('chat.title')}</p>
                <p className="flex items-center gap-1 text-[10px] font-semibold text-white/60">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-canary" /> {t('chat.sub')}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={t('common.close')}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto bg-[#fbfaf6] px-3 py-4">
            {messages.map((message) => (
              <div key={message.id} className={message.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                <div
                  className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                    message.role === 'user'
                      ? 'rounded-ee-md bg-ink text-white'
                      : 'rounded-es-md border border-black/5 bg-white text-ink shadow-sm'
                  }`}
                >
                  <p className="whitespace-pre-line">{message.text}</p>
                  {message.links && message.links.length > 0 ? (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {message.links.map((item) => {
                        const external = item.href.startsWith('http');
                        return external ? (
                          <a
                            key={`${message.id}-${item.href}`}
                            href={item.href}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-full border border-olive/30 bg-canary/30 px-2.5 py-1 text-[11px] font-bold text-olive-dark"
                          >
                            {item.label}
                          </a>
                        ) : (
                          <Link
                            key={`${message.id}-${item.href}`}
                            href={item.href}
                            onClick={() => setOpen(false)}
                            className="rounded-full border border-olive/30 bg-canary/30 px-2.5 py-1 text-[11px] font-bold text-olive-dark"
                          >
                            {item.label}
                          </Link>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
            {pending ? (
              <div className="flex justify-start">
                <div className="flex items-center gap-1.5 rounded-2xl rounded-es-md border border-black/5 bg-white px-3.5 py-3 shadow-sm">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-olive [animation-delay:-0.2s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-olive [animation-delay:-0.1s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-olive" />
                </div>
              </div>
            ) : null}
            <div ref={endRef} />
          </div>

          <div className="no-scrollbar flex gap-1.5 overflow-x-auto border-t border-black/5 bg-white px-3 py-2">
            {SUGGESTION_KEYS.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => send(t(key))}
                disabled={pending}
                className="shrink-0 rounded-full border border-black/10 px-3 py-1.5 text-[11px] font-bold text-[#4b5563] transition-colors hover:border-olive hover:text-olive disabled:opacity-50"
              >
                {t(key)}
              </button>
            ))}
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              void send(input);
            }}
            className="flex items-center gap-2 border-t border-black/5 bg-white p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))]"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              maxLength={500}
              placeholder={t('chat.placeholder')}
              aria-label={t('chat.placeholder')}
              className="h-11 flex-1 rounded-full border border-black/10 bg-[#fbfaf6] px-4 text-sm outline-none transition-colors placeholder:text-muted/70 focus:border-olive"
            />
            <button
              type="submit"
              disabled={pending || !input.trim()}
              aria-label={t('chat.send')}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-canary text-ink transition-colors hover:bg-canary-deep disabled:opacity-40"
            >
              <Send className="h-4 w-4 rtl:-scale-x-100" />
            </button>
          </form>
        </section>
      ) : null}
    </>
  );
}
