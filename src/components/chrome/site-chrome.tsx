"use client";

import { usePathname } from "next/navigation";
import { useI18n } from "@/components/providers/i18n-provider";
import { Header } from "./header";
import { SocialStrip } from "./social-strip";
import { SiteFooter } from "./site-footer";
import { BottomNav } from "./bottom-nav";
import { CartDrawer, CartToast } from "./cart-drawer";
import { ChatWidget } from "./chat-widget";
import { InAppNotice } from "./in-app-notice";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const { tr } = useI18n();
  const pathname = usePathname();
  const hideChat = pathname?.startsWith("/checkout") ?? false;

  return (
    <>
      <a className="skip-link" href="#main-content">
        {tr("Skip to content", "تخطي إلى المحتوى")}
      </a>
      <Header />
      <main id="main-content">{children}</main>
      <SocialStrip />
      <SiteFooter />
      <BottomNav />
      <CartDrawer />
      <CartToast />
      {hideChat ? null : <ChatWidget />}
      <InAppNotice />
    </>
  );
}
