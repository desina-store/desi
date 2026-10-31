"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { ArrowUpRight, ShieldCheck, X } from "lucide-react";
import { formatDate } from "@/lib/i18n";
import { paymentMethodLabel } from "@/lib/site";
import { useI18n } from "@/components/providers/i18n-provider";

export type InvoiceLine = {
  code: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

export type InvoiceSummary = {
  orderId: string;
  date: string;
  method: string;
  total: number;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  city?: string;
  address?: string;
  lines: InvoiceLine[];
};

export function InvoiceModal({
  invoice,
  onClose,
  gatewayUrl,
  countdown,
  warning,
  subtitle,
}: {
  invoice: InvoiceSummary;
  onClose: () => void;
  gatewayUrl?: string | null;
  countdown?: number | null;
  warning?: string | null;
  subtitle?: string;
}) {
  const { lang, t, price } = useI18n();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = originalOverflow;
      previous?.focus?.();
    };
  }, [onClose]);

  const redirecting = typeof countdown === "number" && countdown > 0;
  const methodLabel = paymentMethodLabel(invoice.method, lang);
  const itemCount = invoice.lines.reduce((sum, line) => sum + line.quantity, 0);

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className="invoice-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="invoice-modal-title"
      >
        <div className="invoice-modal__top">
          <div>
            <h2 id="invoice-modal-title">{t("checkout.invoice")}</h2>
            <p>
              {redirecting
                ? `${t("checkout.redirecting")} (${countdown}s)`
                : subtitle || t("checkout.successSub")}
            </p>
          </div>
          <button
            ref={closeRef}
            type="button"
            className="invoice-modal__close"
            onClick={onClose}
            aria-label={t("common.close")}
          >
            <X aria-hidden="true" />
          </button>
        </div>

        <div className="invoice-sheet">
          <div className="invoice-meta">
            <div className="invoice-meta__block">
              <span>{t("checkout.invoiceNo")}</span>
              <strong dir="ltr">{invoice.orderId}</strong>
              <small>{formatDate(invoice.date, lang)}</small>
            </div>
            <div className="invoice-meta__block">
              <span>{t("checkout.method")}</span>
              <strong>{methodLabel}</strong>
              <small>{t("orders.awaiting")}</small>
            </div>
            <div className="invoice-meta__block">
              <span>{t("checkout.customer")}</span>
              <strong>{invoice.customerName || "—"}</strong>
              <small>{invoice.customerPhone || invoice.customerEmail || "—"}</small>
            </div>
            <div className="invoice-meta__block">
              <span>{t("checkout.date")}</span>
              <strong>{formatDate(invoice.date, lang)}</strong>
              <small>
                {itemCount} {itemCount === 1 ? t("common.item") : t("common.items")}
              </small>
            </div>
          </div>

          <div className="invoice-items">
            {invoice.lines.map((line) => (
              <div className="invoice-item" key={line.code}>
                <span className="invoice-item__media">
                  <Image
                    src={line.image || "/products/p13.webp"}
                    alt=""
                    fill
                    sizes="38px"
                    quality={85}
                  />
                </span>
                <div className="invoice-item__copy">
                  <strong>{line.name}</strong>
                  <span dir="ltr">
                    CODE-{line.code} · {price(line.price)} × {line.quantity}
                  </span>
                </div>
                <strong>{price(line.price * line.quantity)}</strong>
              </div>
            ))}
          </div>

          <div className="invoice-total">
            <div className="invoice-total__label">
              <span>{t("orders.total")}</span>
              <strong>
                {itemCount} {itemCount === 1 ? t("common.item") : t("common.items")} ·{" "}
                {t("cart.shippingFree")}
              </strong>
            </div>
            <span className="invoice-total__value">{price(invoice.total)}</span>
          </div>

          {warning ? (
            <p className="form-error invoice-warning" role="status">
              {warning}
            </p>
          ) : null}

          {gatewayUrl ? (
            <div className="invoice-redirect">
              <ShieldCheck aria-hidden="true" />
              <p>
                <strong>
                  {redirecting ? t("checkout.redirecting") : t("checkout.redirectHint")}
                </strong>
                {t("checkout.secureNote")}
              </p>
            </div>
          ) : null}

          <div className="invoice-actions">
            {gatewayUrl ? (
              <a href={gatewayUrl} className="btn btn-primary btn-block">
                {t("checkout.goToGateway")}
                <ArrowUpRight aria-hidden="true" />
              </a>
            ) : null}
            <button
              type="button"
              className="invoice-actions__ghost"
              onClick={onClose}
            >
              {t("checkout.backStore")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
