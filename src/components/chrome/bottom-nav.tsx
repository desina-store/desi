"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, Package, ShoppingBag, Zap } from "lucide-react";
import { useI18n } from "@/components/providers/i18n-provider";
import { useCart } from "@/components/providers/cart-provider";

export function BottomNav() {
  const { t } = useI18n();
  const { count, openDrawer } = useCart();
  const pathname = usePathname();

  const isCurrent = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || Boolean(pathname?.startsWith(`${href}/`));

  return (
    <nav className="bottom-nav" aria-label={t("nav.menu")}>
      <div className="bottom-nav__inner">
        <Link
          href="/"
          className="bottom-nav__item"
          aria-current={isCurrent("/") ? "page" : undefined}
        >
          <span className="bottom-nav__icon">
            <Home aria-hidden="true" />
          </span>
          <span>{t("nav.home")}</span>
        </Link>

        <Link
          href="/shop"
          className="bottom-nav__item"
          aria-current={isCurrent("/shop") ? "page" : undefined}
        >
          <span className="bottom-nav__icon">
            <LayoutGrid aria-hidden="true" />
          </span>
          <span>{t("nav.shop")}</span>
        </Link>

        <Link href="/checkout" className="bottom-nav__item bottom-nav__quick">
          <span className="bottom-nav__icon">
            <Zap aria-hidden="true" />
          </span>
          <span>{t("nav.quickOrder")}</span>
        </Link>

        <button
          type="button"
          className="bottom-nav__item"
          onClick={openDrawer}
          aria-label={`${t("nav.cart")} (${count})`}
        >
          <span className="bottom-nav__icon">
            <ShoppingBag aria-hidden="true" />
            {count > 0 ? <span className="bottom-nav__cart-badge">{count}</span> : null}
          </span>
          <span>{t("nav.cart")}</span>
        </button>

        <Link
          href="/orders"
          className="bottom-nav__item"
          aria-current={isCurrent("/orders") ? "page" : undefined}
        >
          <span className="bottom-nav__icon">
            <Package aria-hidden="true" />
          </span>
          <span>{t("nav.orders")}</span>
        </Link>
      </div>
    </nav>
  );
}
