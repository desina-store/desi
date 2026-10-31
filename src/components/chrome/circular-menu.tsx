"use client";

import { useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { ArrowUpRight, MessageCircle, ShoppingBag, X } from "lucide-react";
import { categories } from "@/data/categories";
import { STORE } from "@/lib/site";
import { useI18n } from "@/components/providers/i18n-provider";
import { useCart } from "@/components/providers/cart-provider";
import { BrandMark } from "@/components/ui/brand-mark";
import { SocialIconRow } from "@/components/ui/social-icons";

export function CircularMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { lang, t, tr } = useI18n();
  const { openDrawer } = useCart();
  const closeRef = useRef<HTMLButtonElement>(null);

  const links = useMemo(() => {
    const categoryLinks = categories.map((category) => ({
      href: `/category/${category.slug}`,
      label: category.name[lang],
      tag:
        category.kind === "service"
          ? t("nav.services")
          : category.slug === "outlet"
            ? tr("Sale", "تخفيض")
            : undefined,
    }));
    return [
      { href: "/", label: t("nav.home"), tag: undefined },
      { href: "/shop", label: t("nav.allProducts"), tag: undefined },
      ...categoryLinks,
      { href: "/offers", label: t("nav.offers"), tag: tr("Deals", "عروض") },
      { href: "/orders", label: t("nav.orders"), tag: undefined },
      { href: "/support", label: t("nav.support"), tag: undefined },
      { href: "/account", label: t("nav.account"), tag: undefined },
    ];
  }, [lang, t, tr]);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  return (
    <div
      id="mobile-menu"
      className={`circular-menu ${open ? "is-open" : ""}`}
      aria-hidden={!open}
      inert={!open ? true : undefined}
    >
      <div className="circular-menu__inner">
        <div className="menu-top">
          <BrandMark />
          <button ref={closeRef} type="button" className="menu-close" onClick={onClose}>
            <X aria-hidden="true" />
            {t("common.close")}
          </button>
        </div>

        <div className="menu-body">
          <div>
            <p className="menu-kicker">{t("menu.kicker")}</p>
            <nav className="menu-nav" aria-label={t("nav.menu")}>
              {links.map((link, index) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="menu-link"
                  onClick={onClose}
                  tabIndex={open ? 0 : -1}
                >
                  <span className="menu-link__index">{String(index + 1).padStart(2, "0")}</span>
                  <span>
                    {link.label}
                    {link.tag ? <span className="menu-link__tag">{link.tag}</span> : null}
                  </span>
                  <ArrowUpRight className="menu-link__arrow" aria-hidden="true" />
                </Link>
              ))}
            </nav>
          </div>

          <aside className="menu-aside">
            <div>
              <p className="menu-aside__label">{t("menu.asideTitle")}</p>
              <p className="menu-aside__text">{t("menu.asideText")}</p>
              <div className="menu-actions" style={{ marginTop: 14 }}>
                <button
                  type="button"
                  className="menu-lang"
                  onClick={() => {
                    onClose();
                    openDrawer();
                  }}
                  tabIndex={open ? 0 : -1}
                >
                  <ShoppingBag aria-hidden="true" />
                  {t("nav.cart")}
                </button>
              </div>
            </div>

            <div>
              <p className="menu-aside__label">{t("nav.contact")}</p>
              <a className="menu-contact" href={`tel:${STORE.phones[0].replace(/\s+/g, "")}`}>
                {STORE.phones[0]}
              </a>
              <a className="menu-contact" href={`mailto:${STORE.email}`}>
                {STORE.email}
              </a>
              <a
                className="menu-contact"
                href={`https://wa.me/${STORE.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle
                  aria-hidden="true"
                  style={{ width: 15, height: 15, display: "inline", marginInlineEnd: 6 }}
                />
                WhatsApp
              </a>
            </div>

            <div>
              <p className="menu-aside__label">{t("footer.follow")}</p>
              <div className="menu-socials">
                <SocialIconRow withLabels={false} />
              </div>
            </div>
          </aside>
        </div>

        <div className="menu-foot">
          <span>
            © {new Date().getFullYear()} DeSinaHub. <em>{t("brand.tagline")}</em>
          </span>
          <span>{t("menu.foot")}</span>
        </div>
      </div>
    </div>
  );
}
