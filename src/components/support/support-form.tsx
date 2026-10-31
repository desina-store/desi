"use client";

import { useState, type FormEvent } from "react";
import { Send } from "lucide-react";
import { STORE } from "@/lib/site";
import { useI18n } from "@/components/providers/i18n-provider";

export function SupportForm() {
  const { t, tr } = useI18n();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const subject = `${tr("Support request", "طلب دعم")} — ${name || tr("DeSinaHub customer", "عميل ديسينا هب")}`;
    const body = [
      `${tr("Name", "الاسم")}: ${name}`,
      `${tr("Phone", "الهاتف")}: ${phone}`,
      "",
      message,
    ].join("\n");
    window.location.href = `mailto:${STORE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <form className="support-form" onSubmit={submit}>
      <div className="field">
        <label htmlFor="support-name">{t("support.formName")}</label>
        <input
          id="support-name"
          className="input"
          value={name}
          onChange={(event) => setName(event.target.value)}
          autoComplete="name"
          required
        />
      </div>
      <div className="field">
        <label htmlFor="support-phone">{t("support.formPhone")}</label>
        <input
          id="support-phone"
          className="input"
          type="tel"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          autoComplete="tel"
          required
        />
      </div>
      <div className="field">
        <label htmlFor="support-message">{t("support.formMessage")}</label>
        <textarea
          id="support-message"
          className="textarea"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          required
        />
      </div>
      <button type="submit" className="btn btn-primary">
        <Send aria-hidden="true" />
        {t("support.formSend")}
      </button>
      <p className="muted" style={{ fontSize: "0.7rem" }}>
        {t("support.formHint")}
      </p>
    </form>
  );
}
