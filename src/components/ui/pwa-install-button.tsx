"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Download } from "lucide-react";
import { useI18n } from "@/components/providers/i18n-provider";

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

export function PwaInstallButton({ className = "btn btn-outline btn-sm" }: { className?: string }) {
  const { t } = useI18n();
  const [promptEvent, setPromptEvent] = useState<InstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    setInstalled(isStandalone());

    const onPrompt = (event: Event) => {
      event.preventDefault();
      setPromptEvent(event as InstallPromptEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setPromptEvent(null);
    };

    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const install = useCallback(async () => {
    if (!promptEvent) return;
    try {
      await promptEvent.prompt();
      const choice = await promptEvent.userChoice;
      if (choice.outcome === "accepted") setInstalled(true);
    } catch {
      // The prompt can be dismissed by the browser at any time.
    } finally {
      setPromptEvent(null);
    }
  }, [promptEvent]);

  if (installed) return null;

  if (!promptEvent) {
    return (
      <Link href="/account#install" className={`${className} install-hint`}>
        <Download aria-hidden="true" />
        {t("pwa.install")}
      </Link>
    );
  }

  return (
    <button type="button" className={className} onClick={install}>
      <Download aria-hidden="true" />
      {t("pwa.install")}
    </button>
  );
}
