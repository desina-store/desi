"use client";

import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Search, X } from "lucide-react";
import { searchProducts } from "@/data/products";
import { useI18n } from "@/components/providers/i18n-provider";

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { lang, t, price } = useI18n();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const wasOpenRef = useRef(false);
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  const suggestions =
    lang === "ar"
      ? ["آيفون", "AirPods", "سامسونج", "ويندوز", "أنكر", "جيم"]
      : ["iPhone", "AirPods", "Samsung", "Windows", "Anker", "Gym"];

  const results = useMemo(
    () => searchProducts(deferredQuery).slice(0, 8),
    [deferredQuery],
  );

  // Keyboard and screen-reader users must land back on the control that opened the
  // panel. Only the open/closed transition is watched, because onClose is recreated
  // on every header render and an effect cleanup would fire while the panel is open.
  useEffect(() => {
    if (open && !wasOpenRef.current) {
      openerRef.current = document.activeElement as HTMLElement | null;
    }
    if (!open && wasOpenRef.current) {
      const opener = openerRef.current;
      if (opener && document.contains(opener)) opener.focus();
      openerRef.current = null;
    }
    wasOpenRef.current = open;
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => inputRef.current?.focus(), 120);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    onClose();
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <div
      className={`search-overlay ${open ? "is-open" : ""}`}
      aria-hidden={!open}
      inert={!open ? true : undefined}
    >
      <div className="search-dialog" role="dialog" aria-modal="true" aria-label={t("search.title")}>
        <div className="search-dialog__top">
          <p className="search-dialog__label">{t("search.title")}</p>
          <button type="button" className="search-close" onClick={onClose} aria-label={t("common.close")}>
            <X aria-hidden="true" />
          </button>
        </div>

        <form className="search-box" role="search" onSubmit={submit}>
          <Search aria-hidden="true" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("search.placeholder")}
            autoComplete="off"
            enterKeyHint="search"
            aria-label={t("nav.search")}
          />
        </form>

        <div className="search-suggestions">
          <span className="search-suggestions__label">{t("search.suggestions")}</span>
          {suggestions.map((item) => (
            <button
              key={item}
              type="button"
              className="search-chip"
              onClick={() => setQuery(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="search-body">
          {!query.trim() ? (
            <div className="search-hint">
              <Search aria-hidden="true" />
              <p>{t("search.typeToSearch")}</p>
            </div>
          ) : results.length === 0 ? (
            <div className="search-hint">
              <Search aria-hidden="true" />
              <p>{t("search.noResults")}</p>
              <p>{t("search.noResultsHint")}</p>
            </div>
          ) : (
            <>
              <div className="search-meta">
                <span>
                  {results.length} {results.length === 1 ? t("common.item") : t("common.items")}
                </span>
                <Link href={`/search?q=${encodeURIComponent(query.trim())}`} className="section-link" onClick={onClose}>
                  <span>{t("search.viewAllFor")} “{query.trim()}”</span>
                  <ArrowRight aria-hidden="true" />
                </Link>
              </div>
              <div className="search-results">
                {results.map((product) => (
                  <Link
                    key={product.code}
                    href={`/product/${product.code}`}
                    className="search-result"
                    onClick={onClose}
                  >
                    <span className="search-result__media">
                      <Image
                        src={product.img}
                        alt={product.name[lang]}
                        fill
                        sizes="64px"
                        quality={85}
                      />
                    </span>
                    <span className="search-result__copy">
                      <strong>{product.name[lang]}</strong>
                      <span>
                        CODE-{product.code}
                        {product.info.brand ? ` · ${product.info.brand[lang]}` : ""}
                      </span>
                      <em>{price(product.price)}</em>
                    </span>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
