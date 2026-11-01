import { ServicePageView } from '@/components/services/ServicePageView';
import { getServerLang } from '@/lib/server';
import { categoryMetadata } from '@/lib/seo';

export const metadata = categoryMetadata('tourism');

export default async function TourismPage() {
  const lang = await getServerLang();
  return <ServicePageView slug="tourism" lang={lang} />;
}
