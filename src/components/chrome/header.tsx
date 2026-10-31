"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Headphones, MapPin, Menu, Search, ShieldCheck, ShoppingBag, Truck } from "lucide-react";
import { primaryNav } from "@/data/navigation";
import { useI18n } from "@/components/providers/i18n-provider";
import { useCart } from "@/components/providers/cart-provider";
import { BrandMark } from "@/components/ui/brand-mark";
import { CircularMenu } from "./circular-menu";
import { SearchOverlay } from "./search-overlay";

export function Header() {
  const { lang, isRtl, t, toggleLanguage } = useI18n();
  const { count, openDrawer } = useCart();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen && !searchOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [menuOpen, searchOpen]);

  const closeMenu = () => setMenuOpen(false);
  const closeSearch = () => setSearchOpen(false);

  return (
    <>
      <div className="announcement">
        <div className="announcement__inner shell">
          <div className="announcement__group">
            <span className="announcement__item">
              <Truck aria-hidden="true" />
              <strong>{t("announcement.shipping")}</strong>
            </span>
            <span className="announcement__item">
              <ShieldCheck aria-hidden="true" />
              {t("announcement.secure")}
            </span>
            <span className="announcement__item">
              <Headphones aria-hidden="true" />
              {t("announcement.support")}
            </span>
          </div>
          <div className="announcement__meta">
            <MapPin aria-hidden="true" style={{ width: 12, height: 12 }} />
            <span>{t("footer.address")}</span>
            <span aria-hidden="true">·</span>
            <span>{lang === "ar" ? "العربية" : "English"}</span>
          </div>
        </div>
      </div>

      <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
        <div className="header-inner shell">
          <BrandMark />

          <nav className="primary-nav" aria-label={t("nav.menu")}>
            {primaryNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={item.href === "/offers" ? "is-sale" : undefined}
                aria-current={pathname === item.href ? "page" : undefined}
              >
                {t(item.key)}
              </Link>
            ))}
          </nav>

          <div className="header-actions">
            <button
              type="button"
              className="icon-button icon-button--bordered"
              aria-label={t("nav.search")}
              onClick={() => setSearchOpen(true)}
            >
              <Search aria-hidden="true" />
            </button>
            <button
              type="button"
              className="lang-toggle"
              onClick={toggleLanguage}
              aria-label={t("common.language")}
            >
              {isRtl ? "EN" : "عربي"}
            </button>
            <button
              type="button"
              className="cart-trigger"
              aria-label={`${t("nav.cart")} (${count})`}
              onClick={openDrawer}
            >
              <ShoppingBag aria-hidden="true" />
              <span>{t("nav.cart")}</span>
              {count > 0 ? <span className="cart-trigger__badge">{count}</span> : null}
            </button>
            <button
              type="button"
              className="menu-toggle"
              aria-label={t("nav.menu")}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen(true)}
            >
              <Menu aria-hidden="true" />
              <span>{t("nav.menu")}</span>
            </button>
          </div>
        </div>
      </header>

      <CircularMenu open={menuOpen} onClose={closeMenu} />
      <SearchOverlay open={searchOpen} onClose={closeSearch} />
    </>
  );
}
