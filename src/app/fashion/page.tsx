import { CategoryPageView } from '@/components/catalog/CategoryPageView';
import { getServerLang } from '@/lib/server';
import { categoryMetadata } from '@/lib/seo';

export const metadata = categoryMetadata('fashion');

export default async function FashionPage() {
  const lang = await getServerLang();
  return <CategoryPageView slug="fashion" lang={lang} />;
}
