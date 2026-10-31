"use client";

import { useEffect, useState } from "react";
import { Check, Copy, Smartphone, X } from "lucide-react";
import { copyText } from "@/lib/clipboard";
import { useI18n } from "@/components/providers/i18n-provider";

const IN_APP_PATTERN =
  /(FBAN|FBAV|FB_IAB|Instagram|Line\/|Twitter|TikTok|musical_ly|MicroMessenger|Snapchat|LinkedInApp|Pinterest|GSA\/)/i;

const DISMISS_KEY = "desina_inapp_dismissed";

function isInAppBrowser(): boolean {
  if (typeof navigator === "undefined") return false;
  return IN_APP_PATTERN.test(navigator.userAgent);
}

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

export function InAppNotice() {
  const { t } = useI18n();
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isInAppBrowser() || isStandalone()) return;
    try {
      if (window.sessionStorage.getItem(DISMISS_KEY) === "1") return;
    } catch {
      // Session storage can be blocked in embedded webviews.
    }
    const timer = window.setTimeout(() => setVisible(true), 1800);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2200);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const dismiss = () => {
    setVisible(false);
    try {
      window.sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // Ignore storage failures.
    }
  };

  const copy = async () => {
    const ok = await copyText(window.location.href);
    if (ok) setCopied(true);
  };

  return (
    <div className={`inapp-notice ${visible ? "is-visible" : ""}`} role="status" aria-live="polite">
      <span className="inapp-notice__icon">
        <Smartphone aria-hidden="true" />
      </span>
      <div className="inapp-notice__copy">
        <strong>{t("inapp.title")}</strong>
        <span>{t("inapp.text")}</span>
      </div>
      <div className="inapp-notice__actions">
        <button type="button" className="inapp-notice__copy-btn" onClick={copy}>
          {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
          {copied ? t("common.copied") : t("inapp.copy")}
        </button>
        <button
          type="button"
          className="inapp-notice__close"
          onClick={dismiss}
          aria-label={t("inapp.dismiss")}
        >
          <X aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
