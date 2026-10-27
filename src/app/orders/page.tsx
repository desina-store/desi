import { PageHeader } from '@/components/ui/PageHeader';
import { OrdersList } from '@/components/orders/OrdersList';
import { translate } from '@/lib/i18n';
import { pageMetadata } from '@/lib/seo';
import { getServerLang } from '@/lib/server';

export const metadata = {
  ...pageMetadata('My Orders', 'Every DeSinaHub order archived on this device.', '/orders'),
  robots: { index: false, follow: true },
};

export default async function OrdersPage() {
  const lang = await getServerLang();
  const tr = (key: string) => translate(lang, key);

  return (
    <div>
      <PageHeader eyebrow={tr('nav.orders')} title={tr('orders.title')} sub={tr('orders.sub')} />
      <div className="page-shell py-8 md:py-10">
        <OrdersList />
      </div>
    </div>
  );
}
