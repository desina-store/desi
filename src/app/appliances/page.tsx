import { CategoryPageView } from '@/components/catalog/CategoryPageView';
import { getServerLang } from '@/lib/server';
import { categoryMetadata } from '@/lib/seo';

export const metadata = categoryMetadata('appliances');

export default async function AppliancesPage() {
  const lang = await getServerLang();
  return <CategoryPageView slug="appliances" lang={lang} />;
}
