import type { Metadata } from 'next';
import { PageHeader } from '@/components/ui/PageHeader';
import { CartView } from '@/components/cart/CartView';
import { getServerLang } from '@/lib/server';
import { translate } from '@/lib/i18n';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = {
  ...pageMetadata('Shopping Cart', 'Review the products in your DeSinaHub cart before checking out.', '/cart'),
  robots: { index: false, follow: true },
};

export default async function CartPage() {
  const lang = await getServerLang();
  const tr = (key: string) => translate(lang, key);

  return (
    <div>
      <PageHeader
        eyebrow={tr('nav.cart')}
        title={tr('cart.title')}
        sub={tr('cart.sub')}
      />
      <div className="page-shell py-8 md:py-10">
        <CartView />
      </div>
    </div>
  );
}
