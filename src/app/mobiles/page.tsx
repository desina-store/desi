import { CategoryPageView } from '@/components/catalog/CategoryPageView';
import { getServerLang } from '@/lib/server';
import { categoryMetadata } from '@/lib/seo';

export const metadata = categoryMetadata('mobiles');

export default async function MobilesPage() {
  const lang = await getServerLang();
  return <CategoryPageView slug="mobiles" lang={lang} />;
}
