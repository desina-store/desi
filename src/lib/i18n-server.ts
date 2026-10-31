import { cookies, headers } from "next/headers";
import type { Lang } from "./i18n";

export async function getServerLang(): Promise<Lang> {
  const cookieStore = await cookies();
  const stored = cookieStore.get("desina_lang")?.value;
  if (stored === "ar" || stored === "en") return stored;

  const acceptLanguage = (await headers()).get("accept-language") ?? "";
  return acceptLanguage.trim().toLowerCase().startsWith("ar") ? "ar" : "en";
}
