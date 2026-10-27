import { cookies } from 'next/headers';
import { DEFAULT_LANG, LANG_COOKIE, isLang } from './i18n';
import type { Lang } from './site';

export async function getServerLang(): Promise<Lang> {
  const store = await cookies();
  const value = store.get(LANG_COOKIE)?.value;
  return isLang(value) ? value : DEFAULT_LANG;
}
