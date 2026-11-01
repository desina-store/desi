import { CategoryPageView } from '@/components/catalog/CategoryPageView';
import { getServerLang } from '@/lib/server';
import { categoryMetadata } from '@/lib/seo';

export const metadata = categoryMetadata('outlet');

export default async function OutletPage() {
  const lang = await getServerLang();
  return <CategoryPageView slug="outlet" lang={lang} />;
}
