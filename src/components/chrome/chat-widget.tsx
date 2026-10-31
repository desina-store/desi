"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MessageCircle, Send, Sparkles, X } from "lucide-react";
import { localChatReply } from "@/lib/chat-fallback";
import { useI18n } from "@/components/providers/i18n-provider";
import { useCart } from "@/components/providers/cart-provider";

type ChatMessage = {
  id: string;
  role: "bot" | "user";
  text: string;
  time: string;
};

function timeNow(lang: "en" | "ar"): string {
  try {
    return new Date().toLocaleTimeString(lang === "ar" ? "ar-EG" : "en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

export function ChatWidget() {
  const { lang, t } = useI18n();
  const { count, subtotal, orderId } = useCart();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const counter = useRef(0);

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => inputRef.current?.focus(), 120);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    setMessages((current) => {
      const welcome: ChatMessage = {
        id: "welcome",
        role: "bot",
        text: t("chat.greeting"),
        time: timeNow(lang),
      };
      if (!current.length) return [welcome];
      return current.map((message) =>
        message.id === "welcome" ? { ...message, text: t("chat.greeting"), time: timeNow(lang) } : message,
      );
    });
    // The welcome bubble follows the active language exactly once per open.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, lang]);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, thinking, open]);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  const send = useCallback(
    async (raw: string) => {
      const text = raw.trim();
      if (!text || thinking) return;

      counter.current += 1;
      const id = counter.current;
      setMessages((current) => [
        ...current,
        { id: `u-${id}`, role: "user", text, time: timeNow(lang) },
      ]);
      setInput("");
      setThinking(true);

      const fallback = localChatReply(text, lang, {
        cartCount: count,
        cartTotal: subtotal,
        orderId: orderId || undefined,
      });

      let reply = fallback;
      const controller = new AbortController();
      abortRef.current?.abort();
      abortRef.current = controller;
      const timer = window.setTimeout(() => controller.abort(), 6500);

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text }),
          signal: controller.signal,
        });
        if (response.ok) {
          const data = (await response.json()) as { reply?: unknown };
          if (
            typeof data.reply === "string" &&
            data.reply.trim().length > 0 &&
            !data.reply.includes("لم أتمكن من جلب رد")
          ) {
            reply = data.reply.trim();
          }
        }
      } catch {
        // Keep the local bilingual answer when the AI endpoint is unreachable.
      } finally {
        window.clearTimeout(timer);
        abortRef.current = null;
      }

      setMessages((current) => [
        ...current,
        { id: `b-${id}`, role: "bot", text: reply, time: timeNow(lang) },
      ]);
      setThinking(false);
    },
    [count, lang, orderId, subtotal, thinking],
  );

  const quickKeys = [
    "chat.quick.offers",
    "chat.quick.track",
    "chat.quick.shipping",
    "chat.quick.returns",
    "chat.quick.payment",
    "chat.quick.contact",
    "chat.quick.cart",
    "chat.quick.categories",
  ];

  return (
    <>
      {!open ? (
        <button
          type="button"
          className="chat-fab"
          onClick={() => setOpen(true)}
          aria-label={t("chat.title")}
        >
          <span className="chat-fab__icon">
            <MessageCircle aria-hidden="true" />
            <span className="chat-fab__dot" aria-hidden="true" />
          </span>
          <span>{t("chat.title")}</span>
        </button>
      ) : (
        <section className="chat-panel" aria-label={t("chat.title")}>
          <header className="chat-head">
            <span className="chat-head__avatar">
              <Sparkles aria-hidden="true" />
            </span>
            <div className="chat-head__copy">
              <strong>{t("chat.title")}</strong>
              <span>{t("chat.online")}</span>
            </div>
            <button
              type="button"
              className="chat-head__close"
              onClick={() => setOpen(false)}
              aria-label={t("common.close")}
            >
              <X aria-hidden="true" />
            </button>
          </header>

          <div className="chat-body" ref={bodyRef} aria-live="polite">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`chat-msg ${message.role === "user" ? "chat-msg--user" : "chat-msg--bot"}`}
              >
                <p>{message.text}</p>
                <span className="chat-msg__time">{message.time}</span>
              </div>
            ))}

            {thinking ? (
              <div className="chat-typing">
                <span className="loading-dots" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </span>
                {t("chat.thinking")}
              </div>
            ) : (
              <div className="chat-quick">
                {quickKeys.map((key) => (
                  <button key={key} type="button" onClick={() => void send(t(key))}>
                    {t(key)}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form
            className="chat-foot"
            onSubmit={(event) => {
              event.preventDefault();
              void send(input);
            }}
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={t("chat.placeholder")}
              aria-label={t("chat.placeholder")}
              autoComplete="off"
              enterKeyHint="send"
            />
            <button
              type="submit"
              className="chat-send"
              aria-label={t("chat.send")}
              disabled={!input.trim() || thinking}
            >
              <Send aria-hidden="true" />
            </button>
          </form>
        </section>
      )}
    </>
  );
}
