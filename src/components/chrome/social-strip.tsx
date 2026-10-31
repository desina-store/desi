"use client";

import { useI18n } from "@/components/providers/i18n-provider";
import { SocialIconRow } from "@/components/ui/social-icons";

export function SocialStrip() {
  const { t, tr } = useI18n();

  return (
    <section className="social-strip shell min-h-[120px] w-full" aria-label={t("footer.follow")}>
      <div className="social-strip__inner">
        <p className="social-strip__kicker">{t("footer.follow")}</p>
        <SocialIconRow />
        <p className="social-strip__note">
          {tr(
            "New drops, outlet alerts and real customer care — every day.",
            "جديد المنتجات وتنبيهات الأوت ليت وخدمة عملاء حقيقية — كل يوم.",
          )}
        </p>
      </div>
    </section>
  );
}
