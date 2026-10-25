import { CategoryPageView } from '@/components/catalog/CategoryPageView';
import { getServerLang } from '@/lib/server';
import { categoryMetadata } from '@/lib/seo';

export const metadata = categoryMetadata('sports');

export default async function SportsPage() {
  const lang = await getServerLang();
  return <CategoryPageView slug="sports" lang={lang} />;
}
