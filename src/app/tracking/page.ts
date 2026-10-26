import { PageHeader } from '@/components/ui/PageHeader';
import { TrackingLookup } from '@/components/tracking/TrackingLookup';
import { translate } from '@/lib/i18n';
import { pageMetadata } from '@/lib/seo';
import { getServerLang } from '@/lib/server';

export const metadata = pageMetadata(
  'Track Your Shipment',
  'Track a DeSinaHub retail order saved on your device or a wholesale shipment with our team.',
  '/tracking',
);

export default async function TrackingPage() {
  const lang = await getServerLang();
  const tr = (key: string) => translate(lang, key);

  return (
    <div>
      <PageHeader eyebrow={tr('footer.help')} title={tr('tracking.title')} sub={tr('tracking.sub')} />
      <div className="page-shell py-8 md:py-10">
        <TrackingLookup />
      </div>
    </div>
  );
}
