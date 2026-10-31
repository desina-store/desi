"use client";

import Link from "next/link";
import { Home, RefreshCw } from "lucide-react";
import { useI18n } from "@/components/providers/i18n-provider";

export function OfflineActions() {
  const { t, tr } = useI18n();

  return (
    <div className="status-page__actions">
      <button type="button" className="btn btn-primary" onClick={() => window.location.reload()}>
        <RefreshCw aria-hidden="true" />
        {tr("Try again", "حاول مرة أخرى")}
      </button>
      <Link href="/" className="btn btn-outline">
        <Home aria-hidden="true" />
        {t("notFound.cta")}
      </Link>
    </div>
  );
}
