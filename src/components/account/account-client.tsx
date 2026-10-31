"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { BadgeCheck, LifeBuoy, ShieldCheck } from "lucide-react";
import { formatDate } from "@/lib/i18n";
import { readOrders, type StoredCustomer, type StoredOrder } from "@/lib/orders";
import { STORAGE_KEYS, safeRead, safeWrite } from "@/lib/storage";
import { PwaInstallButton } from "@/components/ui/pwa-install-button";
import { useI18n } from "@/components/providers/i18n-provider";

type AccountForm = {
  name: string;
  phone: string;
  email: string;
};

export function AccountClient() {
  const { lang, t, tr } = useI18n();
  const [form, setForm] = useState<AccountForm>({ name: "", phone: "", email: "" });
  const [saved, setSaved] = useState(false);
  const [orders, setOrders] = useState<StoredOrder[]>([]);

  useEffect(() => {
    const customer = safeRead<StoredCustomer>(STORAGE_KEYS.customer, {
      name: "",
      phone: "",
    });
    setForm({
      name: customer.name ?? "",
      phone: customer.phone ?? "",
      email: customer.email ?? "",
    });
    setOrders(readOrders().slice(0, 4));
  }, []);

  useEffect(() => {
    if (!saved) return;
    const timer = window.setTimeout(() => setSaved(false), 4200);
    return () => window.clearTimeout(timer);
  }, [saved]);

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const existing = safeRead<StoredCustomer>(STORAGE_KEYS.customer, {
      name: "",
      phone: "",
    });
    const customer: StoredCustomer = {
      ...existing,
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
    };
    safeWrite(STORAGE_KEYS.customer, customer);
    setSaved(true);
  }

  return (
    <section className="account-page shell">
      <header className="orders-hero">
        <p className="eyebrow eyebrow--plain">{tr("Private space", "مساحتك الخاصة")}</p>
        <h1>{t("account.title")}</h1>
        <p>{t("account.subtitle")}</p>
      </header>

      <div className="account-layout">
        <div className="account-card">
          <h2>{t("account.details")}</h2>
          <p>{t("account.privacy")}</p>

          <form className="account-form" onSubmit={save}>
            <div className="field">
              <label htmlFor="account-name">{t("account.name")}</label>
              <input
                id="account-name"
                className="input"
                value={form.name}
                onChange={(event) =>
                  setForm((current) => ({ ...current, name: event.target.value }))
                }
                autoComplete="name"
              />
            </div>

            <div className="field-row">
              <div className="field">
                <label htmlFor="account-phone">{t("account.phone")}</label>
                <input
                  id="account-phone"
                  className="input"
                  value={form.phone}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, phone: event.target.value }))
                  }
                  autoComplete="tel"
                  inputMode="tel"
                  dir="ltr"
                />
              </div>

              <div className="field">
                <label htmlFor="account-email">{t("account.email")}</label>
                <input
                  id="account-email"
                  type="email"
                  className="input"
                  value={form.email}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, email: event.target.value }))
                  }
                  autoComplete="email"
                  dir="ltr"
                />
              </div>
            </div>

            {saved ? (
              <p className="review-success" role="status">
                <BadgeCheck aria-hidden="true" />
                {t("account.saved")}
              </p>
            ) : null}

            <button type="submit" className="btn btn-primary">
              <BadgeCheck aria-hidden="true" />
              {t("account.save")}
            </button>

            <p className="form-note">
              <ShieldCheck aria-hidden="true" />
              {t("account.privacy")}
            </p>
          </form>
        </div>

        <aside className="account-side">
          <div className="account-card">
            <h2>{t("account.orders")}</h2>
            <p>{t("account.privacy")}</p>

            <div className="account-orders">
              {orders.length ? (
                orders.map((order) => (
                  <Link
                    key={order.id}
                    href={`/orders?id=${encodeURIComponent(order.id)}`}
                    className="account-order-row"
                  >
                    <strong dir="ltr">{order.id}</strong>
                    <span>{formatDate(order.date, lang)}</span>
                  </Link>
                ))
              ) : (
                <p>{t("account.noOrders")}</p>
              )}
            </div>

            <Link href="/orders" className="btn btn-outline btn-sm">
              {t("account.viewOrders")}
            </Link>
          </div>

          <div className="account-card account-mini install-card" id="install">
            <h3>{t("account.install.title")}</h3>
            <p>{t("account.install.text")}</p>
            <PwaInstallButton className="btn btn-light btn-sm" />
            <p>{t("account.install.ios")}</p>
          </div>

          <div className="account-mini">
            <h3>{t("orders.help")}</h3>
            <p>{t("orders.helpText")}</p>
            <Link href="/support" className="btn btn-outline btn-sm">
              <LifeBuoy aria-hidden="true" />
              {t("orders.contact")}
            </Link>
          </div>
        </aside>
      </div>
    </section>
  );
}
