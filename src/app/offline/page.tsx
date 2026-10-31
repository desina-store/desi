import type { Metadata } from "next";
import { WifiOff } from "lucide-react";
import { getServerLang } from "@/lib/i18n-server";
import { pick, translate } from "@/lib/i18n";
import { OfflineActions } from "@/components/offline-actions";

export const metadata: Metadata = {
  title: "You are offline",
  robots: { index: false, follow: false },
};

export default async function OfflinePage() {
  const lang = await getServerLang();

  return (
    <div className="status-page">
      <span className="status-page__mark">
        <WifiOff aria-hidden="true" />
      </span>
      <span className="offline-badge">
        <WifiOff aria-hidden="true" style={{ width: 12, height: 12 }} />
        {pick(lang, "No connection", "لا يوجد اتصال")}
      </span>
      <h1>{pick(lang, "You are offline.", "أنت غير متصل.")}</h1>
      <p>
        {pick(
          lang,
          "Check your connection and try again. Your cart and saved details are still safe on this device.",
          "تحقق من اتصالك وحاول مرة أخرى. سلتك وبياناتك المحفوظة بأمان على هذا الجهاز.",
        )}
      </p>
      <OfflineActions />
      <span className="muted" style={{ fontSize: "0.7rem", marginTop: 4 }}>
        {translate(lang, "brand.tagline")}
      </span>
    </div>
  );
}
