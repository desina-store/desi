"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AlertCircle,
  CheckCircle2,
  CreditCard,
  Lock,
  PackageCheck,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";
import {
  PAYMENT_METHODS,
  buildGatewayUrl,
  type PaymentMethodId,
} from "@/lib/site";
import { STORAGE_KEYS, safeRead, safeWrite } from "@/lib/storage";
import {
  saveOrder,
  type StoredCustomer,
  type StoredOrder,
} from "@/lib/orders";
import { trackBeginCheckout } from "@/lib/tracking";
import { Breadcrumbs } from "@/components/page-hero";
import { InvoiceModal, type InvoiceSummary } from "@/components/invoice/invoice-modal";
import { useI18n } from "@/components/providers/i18n-provider";
import { useCart, type CartLineView } from "@/components/providers/cart-provider";
import type { Product } from "@/data/products";

type FormState = {
  name: string;
  phone: string;
  email: string;
  country: string;
  city: string;
  zip: string;
  address: string;
};

type FieldName = keyof FormState;
type FieldErrors = Partial<Record<FieldName, string>>;

const PAYMENT_GROUPS = ["wallets", "banks", "cards"] as const;

function cleanPhone(value: string): string {
  return value.replace(/[^\d]/g, "");
}

function validate(form: FormState, lang: "en" | "ar"): FieldErrors {
  const message = (en: string, ar: string) => (lang === "ar" ? ar : en);
  const errors: FieldErrors = {};
  const phone = form.phone.trim();
  const digits = cleanPhone(phone);

  if (form.name.trim().length < 2) {
    errors.name = message("Enter your full name.", "أدخل اسمك بالكامل.");
  }
  if (digits.length < 8 || digits.length > 15 || !/^\+?[\d\s().-]+$/.test(phone)) {
    errors.phone = message("Enter a valid phone number.", "أدخل رقم هاتف صحيحاً.");
  }
  if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = message("Enter a valid email address.", "أدخل بريداً إلكترونياً صحيحاً.");
  }
  if (!form.country.trim()) {
    errors.country = message("Enter your country.", "أدخل دولتك.");
  }
  if (!form.city.trim()) {
    errors.city = message("Enter your city or governorate.", "أدخل مدينتك أو محافظتك.");
  }
  if (form.address.trim().length < 5) {
    errors.address = message("Enter your detailed address.", "أدخل عنوانك بالتفصيل.");
  }

  return errors;
}

async function postCheckout(payload: Record<string, unknown>): Promise<boolean> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), 4500);
  try {
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify(payload),
    });
    if (!response.ok) return false;
    const result = (await response.json().catch(() => ({}))) as { ok?: boolean };
    return Boolean(result.ok);
  } catch {
    return false;
  } finally {
    window.clearTimeout(timer);
  }
}

export function CheckoutClient() {
  const { lang, t, tr, price } = useI18n();
  const {
    hydrated,
    items,
    lines,
    count,
    subtotal,
    orderId,
    ensureOrderId,
    clearCart,
    resetOrderRef,
  } = useCart();

  const [form, setForm] = useState<FormState>({
    name: "",
    phone: "",
    email: "",
    country: lang === "ar" ? "مصر" : "Egypt",
    city: "",
    zip: "",
    address: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [method, setMethod] = useState<PaymentMethodId>("visa");
  const [submitting, setSubmitting] = useState(false);
  const [invoice, setInvoice] = useState<InvoiceSummary | null>(null);
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const [gatewayUrl, setGatewayUrl] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [audit, setAudit] = useState<"idle" | "saving" | "saved" | "offline">("idle");

  useEffect(() => {
    const saved = safeRead<StoredCustomer>(STORAGE_KEYS.customer, {
      name: "",
      phone: "",
    });
    setForm((current) => ({
      ...current,
      name: saved.name ?? "",
      phone: saved.phone ?? "",
      email: saved.email ?? "",
      country: saved.country?.trim() || current.country,
      city: saved.city ?? "",
      zip: saved.zip ?? "",
      address: saved.address ?? "",
    }));
  }, []);

  useEffect(() => {
    if (hydrated && !orderId) ensureOrderId();
  }, [hydrated, orderId, ensureOrderId]);

  useEffect(() => {
    if (!invoiceOpen || !gatewayUrl || countdown === null) return;
    if (countdown <= 0) {
      window.location.assign(gatewayUrl);
      return;
    }
    const timer = window.setTimeout(
      () => setCountdown((current) => (current === null ? null : Math.max(0, current - 1))),
      1000,
    );
    return () => window.clearTimeout(timer);
  }, [invoiceOpen, gatewayUrl, countdown]);

  const closeInvoice = () => {
    setInvoiceOpen(false);
    setCountdown(null);
  };

  const updateField = (name: FieldName, value: string) => {
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => {
      if (!current[name]) return current;
      const next = { ...current };
      delete next[name];
      return next;
    });
    setFormError(null);
  };

  const orderRef = orderId || "—";

  const paymentGroups = useMemo(
    () =>
      PAYMENT_GROUPS.map((group) => ({
        group,
        label:
          group === "wallets"
            ? t("checkout.wallets")
            : group === "banks"
              ? t("checkout.banks")
              : t("checkout.cards"),
        methods: PAYMENT_METHODS.filter((entry) => entry.group === group),
      })),
    [t],
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting || !lines.length) return;

    const nextErrors = validate(form, lang);
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      setFormError(t("checkout.required"));
      const first = Object.keys(nextErrors)[0];
      window.requestAnimationFrame(() => {
        document.getElementById(`checkout-${first}`)?.focus();
      });
      return;
    }

    const id = orderId || ensureOrderId();
    const url = buildGatewayUrl(method, id, subtotal, "EGP");
    if (!url) {
      setFormError(tr("This payment gateway is unavailable right now.", "بوابة الدفع غير متاحة حالياً."));
      return;
    }

    setSubmitting(true);
    setFormError(null);
    setWarning(null);

    const date = new Date().toISOString();
    const customer = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      country: form.country.trim(),
      city: form.city.trim(),
      zip: form.zip.trim(),
      address: form.address.trim(),
    };

    const invoiceSnapshot: InvoiceSummary = {
      orderId: id,
      date,
      method,
      total: subtotal,
      customerName: customer.name,
      customerPhone: customer.phone,
      customerEmail: customer.email,
      city: customer.city,
      address: customer.address,
      lines: lines.map((line) => ({
        code: line.item.code,
        name: line.name,
        price: line.price,
        quantity: line.item.quantity,
        image: line.image,
      })),
    };

    const storedOrder: StoredOrder = {
      id,
      date,
      items: lines.map((line) => ({
        code: line.item.code,
        name: line.name,
        price: line.price,
        quantity: line.item.quantity,
        link: line.href,
      })),
      total: subtotal,
      currency: "EGP",
      status: "awaiting_payment",
      paymentMethod: method,
      customer,
      audit: "offline",
    };

    saveOrder(storedOrder);
    safeWrite(STORAGE_KEYS.customer, customer);

    const trackedLines = lines.filter(
      (line): line is CartLineView & { product: Product } => Boolean(line.product),
    );
    if (trackedLines.length) {
      trackBeginCheckout(
        trackedLines.map((line) => ({
          product: line.product,
          quantity: line.item.quantity,
          localizedName: line.name,
        })),
        subtotal,
        id,
        method,
        customer.phone,
      );
    }

    setInvoice(invoiceSnapshot);
    setGatewayUrl(url);
    setCountdown(6);
    setInvoiceOpen(true);
    setAudit("saving");
    clearCart();
    resetOrderRef();
    setSubmitting(false);

    const payload = {
      order_id: id,
      amount: subtotal,
      currency: "EGP",
      payment_method: method,
      customer: {
        full_name: customer.name,
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
      },
      shipping_address: {
        country: customer.country,
        city: customer.city,
        zip_code: customer.zip,
        address_details: customer.address,
      },
      shipping: {
        country: customer.country,
        city: customer.city,
        zip: customer.zip,
        address: customer.address,
      },
      cart_items: lines.map((line) => ({
        code: String(line.item.code),
        product_id: String(line.item.code),
        name: line.name,
        price: line.price,
        quantity: line.item.quantity,
      })),
    };

    void postCheckout(payload).then((ok) => {
      if (ok) {
        setAudit("saved");
        setWarning(null);
        saveOrder({ ...storedOrder, audit: "saved" });
      } else {
        setAudit("offline");
        setWarning(t("checkout.auditWarning"));
      }
    });
  }

  if (!hydrated) {
    return (
      <section className="checkout-page shell" aria-busy="true">
        <div className="empty-state">
          <span className="spinner spinner--dark" aria-hidden="true" />
          <p>{t("common.loading")}</p>
        </div>
      </section>
    );
  }

  if (invoice) {
    return (
      <>
        <section className="checkout-page shell">
          <div className="checkout-head">
            <h1>{t("checkout.successTitle")}</h1>
            <p>{t("checkout.successSub")}</p>
          </div>

          <div className="empty-state">
            <span className="empty-state__icon">
              <CheckCircle2 aria-hidden="true" />
            </span>
            <h2 dir="ltr">{invoice.orderId}</h2>
            <p>
              {invoice.lines.reduce((sum, line) => sum + line.quantity, 0)}{" "}
              {invoice.lines.reduce((sum, line) => sum + line.quantity, 0) === 1
                ? t("common.item")
                : t("common.items")}{" "}
              · {price(invoice.total)}
            </p>

            {audit === "saving" ? (
              <p className="form-note" role="status">
                <span className="spinner spinner--dark" aria-hidden="true" />
                {t("checkout.processing")}
              </p>
            ) : null}
            {audit === "offline" ? (
              <p className="form-error" role="status">
                <AlertCircle aria-hidden="true" />
                {t("checkout.auditWarning")}
              </p>
            ) : null}

            <div className="empty-state__actions">
              {gatewayUrl ? (
                <a href={gatewayUrl} className="btn btn-primary">
                  {t("checkout.goToGateway")}
                  <Lock aria-hidden="true" />
                </a>
              ) : null}
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setInvoiceOpen(true)}
              >
                {t("checkout.invoice")}
              </button>
              <Link href="/orders" className="btn btn-ghost">
                {t("orders.title")}
              </Link>
            </div>
          </div>
        </section>

        {invoiceOpen ? (
          <InvoiceModal
            invoice={invoice}
            gatewayUrl={gatewayUrl}
            countdown={countdown}
            warning={warning}
            onClose={closeInvoice}
          />
        ) : null}
      </>
    );
  }

  if (!items.length) {
    return (
      <section className="checkout-page shell">
        <Breadcrumbs items={[{ label: t("nav.checkout") }]} />
        <div className="checkout-head">
          <h1>{t("checkout.title")}</h1>
          <p>{t("checkout.subtitle")}</p>
        </div>
        <div className="empty-state">
          <span className="empty-state__icon">
            <ShoppingBag aria-hidden="true" />
          </span>
          <h2>{t("checkout.empty")}</h2>
          <p>{t("checkout.emptyHint")}</p>
          <div className="empty-state__actions">
            <Link href="/shop" className="btn btn-primary">
              {t("cart.emptyCta")}
            </Link>
            <Link href="/cart" className="btn btn-outline">
              {t("nav.cart")}
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="checkout-page shell">
      <Breadcrumbs items={[{ label: t("nav.checkout") }]} />

      <div className="checkout-head">
        <p className="eyebrow eyebrow--plain">{tr("Secure order", "طلب آمن")}</p>
        <h1>{t("checkout.title")}</h1>
        <p>{t("checkout.subtitle")}</p>
        <div className="checkout-steps" aria-label={t("checkout.title")}>
          <span className="checkout-step is-current">
            <span>1</span>
            {t("checkout.billing")}
          </span>
          <span className="checkout-step">
            <span>2</span>
            {t("checkout.payment")}
          </span>
          <span className="checkout-step">
            <span>3</span>
            {t("checkout.invoice")}
          </span>
        </div>
      </div>

      <form className="checkout-layout" onSubmit={handleSubmit} noValidate>
        <div className="checkout-card">
          <section className="checkout-section">
            <div className="checkout-section__head">
              <span aria-hidden="true">1</span>
              <h2>{t("checkout.billing")}</h2>
            </div>

            <div className="checkout-fields">
              <div className="field-row">
                <div className="field">
                  <label htmlFor="checkout-name">
                    {t("checkout.name")} <span>*</span>
                  </label>
                  <input
                    id="checkout-name"
                    className={`input ${errors.name ? "is-invalid" : ""}`}
                    value={form.name}
                    onChange={(event) => updateField("name", event.target.value)}
                    autoComplete="name"
                    required
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? "checkout-name-error" : undefined}
                  />
                  {errors.name ? (
                    <span className="field-error" id="checkout-name-error">
                      {errors.name}
                    </span>
                  ) : null}
                </div>

                <div className="field">
                  <label htmlFor="checkout-phone">
                    {t("checkout.phone")} <span>*</span>
                  </label>
                  <input
                    id="checkout-phone"
                    className={`input ${errors.phone ? "is-invalid" : ""}`}
                    value={form.phone}
                    onChange={(event) => updateField("phone", event.target.value)}
                    autoComplete="tel"
                    inputMode="tel"
                    dir="ltr"
                    required
                    aria-invalid={Boolean(errors.phone)}
                    aria-describedby={errors.phone ? "checkout-phone-error" : undefined}
                  />
                  {errors.phone ? (
                    <span className="field-error" id="checkout-phone-error">
                      {errors.phone}
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="field-row">
                <div className="field">
                  <label htmlFor="checkout-email">{t("checkout.email")}</label>
                  <input
                    id="checkout-email"
                    type="email"
                    className={`input ${errors.email ? "is-invalid" : ""}`}
                    value={form.email}
                    onChange={(event) => updateField("email", event.target.value)}
                    autoComplete="email"
                    dir="ltr"
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? "checkout-email-error" : undefined}
                  />
                  {errors.email ? (
                    <span className="field-error" id="checkout-email-error">
                      {errors.email}
                    </span>
                  ) : null}
                </div>

                <div className="field">
                  <label htmlFor="checkout-country">
                    {t("checkout.country")} <span>*</span>
                  </label>
                  <input
                    id="checkout-country"
                    className={`input ${errors.country ? "is-invalid" : ""}`}
                    value={form.country}
                    onChange={(event) => updateField("country", event.target.value)}
                    autoComplete="country-name"
                    required
                    aria-invalid={Boolean(errors.country)}
                    aria-describedby={errors.country ? "checkout-country-error" : undefined}
                  />
                  {errors.country ? (
                    <span className="field-error" id="checkout-country-error">
                      {errors.country}
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="field-row">
                <div className="field">
                  <label htmlFor="checkout-city">
                    {t("checkout.city")} <span>*</span>
                  </label>
                  <input
                    id="checkout-city"
                    className={`input ${errors.city ? "is-invalid" : ""}`}
                    value={form.city}
                    onChange={(event) => updateField("city", event.target.value)}
                    autoComplete="address-level2"
                    required
                    aria-invalid={Boolean(errors.city)}
                    aria-describedby={errors.city ? "checkout-city-error" : undefined}
                  />
                  {errors.city ? (
                    <span className="field-error" id="checkout-city-error">
                      {errors.city}
                    </span>
                  ) : null}
                </div>

                <div className="field">
                  <label htmlFor="checkout-zip">{t("checkout.zip")}</label>
                  <input
                    id="checkout-zip"
                    className="input"
                    value={form.zip}
                    onChange={(event) => updateField("zip", event.target.value)}
                    autoComplete="postal-code"
                    inputMode="numeric"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="field">
                <label htmlFor="checkout-address">
                  {t("checkout.address")} <span>*</span>
                </label>
                <textarea
                  id="checkout-address"
                  rows={3}
                  className={`textarea ${errors.address ? "is-invalid" : ""}`}
                  value={form.address}
                  onChange={(event) => updateField("address", event.target.value)}
                  autoComplete="street-address"
                  required
                  aria-invalid={Boolean(errors.address)}
                  aria-describedby={errors.address ? "checkout-address-error" : undefined}
                />
                {errors.address ? (
                  <span className="field-error" id="checkout-address-error">
                    {errors.address}
                  </span>
                ) : null}
              </div>
            </div>
          </section>

          <section className="checkout-section">
            <div className="checkout-section__head">
              <span aria-hidden="true">2</span>
              <h2>{t("checkout.payment")}</h2>
            </div>
            <p className="form-note">
              <CreditCard aria-hidden="true" />
              {t("checkout.paymentSub")}
            </p>

            <div className="payment-groups">
              {paymentGroups.map((group) => (
                <div className="payment-group" key={group.group}>
                  <p className="payment-group__label">{group.label}</p>
                  <div className="payment-grid">
                    {group.methods.map((entry) => {
                      const label = entry.label[lang];
                      const selected = method === entry.id;
                      return (
                        <label
                          key={entry.id}
                          className={`payment-option ${selected ? "is-selected" : ""}`}
                        >
                          <input
                            type="radio"
                            name="payment_method_choice"
                            value={entry.id}
                            checked={selected}
                            onChange={() => setMethod(entry.id)}
                          />
                          <span className="payment-option__check" aria-hidden="true" />
                          {entry.logo ? (
                            <span className="payment-option__logo">
                              <Image
                                src={entry.logo}
                                alt=""
                                width={44}
                                height={28}
                                sizes="44px"
                              />
                            </span>
                          ) : (
                            <span className="payment-option__logo is-fallback" aria-hidden="true">
                              {label}
                            </span>
                          )}
                          <span className="payment-option__label">
                            <strong>{label}</strong>
                            <span>{group.label}</span>
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <p className="checkout-secure">
              <ShieldCheck aria-hidden="true" />
              {t("checkout.secureNote")}
            </p>
          </section>

          {formError ? (
            <p className="form-error" role="alert">
              <AlertCircle aria-hidden="true" />
              {formError}
            </p>
          ) : null}

          <div className="checkout-submit">
            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={submitting}
            >
              {submitting ? (
                <span className="spinner" aria-hidden="true" />
              ) : (
                <Lock aria-hidden="true" />
              )}
              {submitting ? t("checkout.processing") : t("checkout.payNow")}
            </button>
            <p>{t("checkout.secureNote")}</p>
          </div>
        </div>

        <aside className="checkout-summary">
          <div className="checkout-summary__head">
            <h2>{t("checkout.orderSummary")}</h2>
            <span>
              {count} {count === 1 ? t("common.item") : t("common.items")}
            </span>
          </div>

          <div className="checkout-summary__lines">
            {lines.map((line) => (
              <div className="checkout-mini-line" key={line.item.code}>
                <span className="checkout-mini-line__media">
                  <Image
                    src={line.image}
                    alt=""
                    fill
                    sizes="46px"
                    quality={85}
                  />
                </span>
                <div className="checkout-mini-line__copy">
                  <strong>{line.name}</strong>
                  <span>
                    CODE-{line.item.code} · {line.item.quantity} × {price(line.price)}
                  </span>
                </div>
                <strong>{price(line.lineTotal)}</strong>
              </div>
            ))}
          </div>

          <div className="checkout-summary__totals">
            <div className="summary-row">
              <span>{t("cart.subtotal")}</span>
              <strong>{price(subtotal)}</strong>
            </div>
            <div className="summary-row">
              <span>{t("cart.shipping")}</span>
              <strong>{t("cart.shippingFree")}</strong>
            </div>
            <div className="summary-row summary-row--total">
              <span>
                {t("cart.total")}
                <small>{t("cart.secureNote")}</small>
              </span>
              <strong>{price(subtotal)}</strong>
            </div>
          </div>

          <div className="checkout-summary__ref">
            <Lock aria-hidden="true" />
            {t("checkout.invoiceNo")}
            <strong dir="ltr">{orderRef}</strong>
          </div>

          <div className="checkout-summary__trust">
            <div>
              <Truck aria-hidden="true" />
              {t("product.delivery")}
            </div>
            <div>
              <PackageCheck aria-hidden="true" />
              {t("product.warranty")}
            </div>
            <div>
              <RotateCcw aria-hidden="true" />
              {t("product.returns")}
            </div>
          </div>
        </aside>
      </form>
    </section>
  );
}
