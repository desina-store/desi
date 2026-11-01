import { PageHeader } from '@/components/ui/PageHeader';
import { AccountPanels } from '@/components/account/AccountPanels';
import { translate } from '@/lib/i18n';
import { pageMetadata } from '@/lib/seo';
import { getServerLang } from '@/lib/server';

export const metadata = pageMetadata(
  'My Account',
  'Save your DeSinaHub delivery details on your device for faster checkout.',
  '/account',
);

export default async function AccountPage() {
  const lang = await getServerLang();
  const tr = (key: string) => translate(lang, key);

  return (
    <div>
      <PageHeader eyebrow={tr('nav.account')} title={tr('account.title')} sub={tr('account.sub')} />
      <div className="page-shell py-8 md:py-10">
        <AccountPanels />
      </div>
    </div>
  );
}
