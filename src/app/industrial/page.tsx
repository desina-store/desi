import { ServicePageView } from '@/components/services/ServicePageView';
import { getServerLang } from '@/lib/server';
import { categoryMetadata } from '@/lib/seo';

export const metadata = categoryMetadata('industrial');

export default async function IndustrialPage() {
  const lang = await getServerLang();
  return <ServicePageView slug="industrial" lang={lang} />;
}
