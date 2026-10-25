import { CategoryPageView } from '@/components/catalog/CategoryPageView';
import { getServerLang } from '@/lib/server';
import { categoryMetadata } from '@/lib/seo';

export const metadata = categoryMetadata('computers');

export default async function ComputersPage() {
  const lang = await getServerLang();
  return <CategoryPageView slug="computers" lang={lang} />;
}
