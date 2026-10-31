"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SearchX } from "lucide-react";
import { featuredProducts, searchProducts } from "@/data/products";
import { useI18n } from "@/components/providers/i18n-provider";
import { ProductCard } from "@/components/product-card";

const popularSearches = ["iPhone", "AirPods", "Samsung", "Windows 11", "Jacket", "ChatGPT"];

export function SearchClient() {
  const { t, tr } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams?.get("q") ?? "");
  const trimmed = query.trim();
  const results = trimmed ? searchProducts(trimmed) : [];
  const popular = featuredProducts(4);

  useEffect(() => {
    setQuery(searchParams?.get("q") ?? "");
  }, [searchParams]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const current = searchParams?.get("q") ?? "";
      if (current === trimmed) return;
      const params = new URLSearchParams(searchParams?.toString() ?? "");
      if (trimmed) params.set("q", trimmed);
      else params.delete("q");
      const next = params.toString();
      router.replace(next ? `/search?${next}` : "/search", { scroll: false });
    }, 420);
    return () => window.clearTimeout(timer);
  }, [trimmed, router, searchParams]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    if (trimmed) params.set("q", trimmed);
    else params.delete("q");
    const next = params.toString();
    router.replace(next ? `/search?${next}` : "/search", { scroll: false });
  }

  return (
    <>
      <form className="search-page__form" role="search" onSubmit={submit}>
        <div className="search-page__field">
          <Search aria-hidden="true" />
          <label className="sr-only" htmlFor="search-page-input">
            {t("search.title")}
          </label>
          <input
            id="search-page-input"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("search.placeholder")}
            autoComplete="off"
            autoFocus
          />
        </div>
        <button type="submit" className="btn btn-primary">
          {t("nav.search")}
        </button>
      </form>

      <div className="search-page__suggestions">
        <span className="muted" style={{ fontSize: "0.73rem", fontWeight: 700 }}>
          {t("search.suggestions")}:
        </span>
        {popularSearches.map((term) => (
          <Link key={term} href={`/search?q=${encodeURIComponent(term)}`} className="filter-pill">
            {term}
          </Link>
        ))}
      </div>

      {trimmed ? (
        <div className="search-page__results">
          <div className="search-page__results-head" aria-live="polite">
            <span>
              {t("search.results")} <strong>“{trimmed}”</strong>
            </span>
            <span>
              <strong>{results.length}</strong>{" "}
              {results.length === 1 ? t("common.item") : t("common.items")}
            </span>
          </div>
          {results.length ? (
            <div className="product-grid">
              {results.map((product) => (
                <ProductCard key={product.code} product={product} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <span className="empty-state__icon">
                <SearchX aria-hidden="true" />
              </span>
              <h2>{t("search.noResults")}</h2>
              <p>{t("search.noResultsHint")}</p>
              <Link href="/shop" className="btn btn-dark btn-sm">
                {t("nav.allProducts")}
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="search-page__results">
          <div className="search-page__results-head">
            <span>{tr("Popular right now", "الأكثر رواجاً الآن")}</span>
            <Link href="/shop" className="text-link">
              {t("common.viewAll")}
            </Link>
          </div>
          <div className="product-grid">
            {popular.map((product) => (
              <ProductCard key={product.code} product={product} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
