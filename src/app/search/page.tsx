import type { Metadata } from 'next';
import { LiveSearch } from '@/components/search/LiveSearch';
import { PageHeader } from '@/components/ui/PageHeader';
import { translate } from '@/lib/i18n';
import { pageMetadata } from '@/lib/seo';
import { getServerLang } from '@/lib/server';

export const metadata: Metadata = {
  ...pageMetadata('Search', 'Search DeSinaHub by product name, product code or department.', '/search'),
  robots: { index: false, follow: true },
};

type SearchPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const lang = await getServerLang();
  const tr = (key: string) => translate(lang, key);
  const rawQuery = Array.isArray(params.q) ? params.q[0] : params.q;
  const initialQuery = (rawQuery ?? '').slice(0, 120);

  return (
    <div>
      <PageHeader
        eyebrow={tr('home.searchTitle')}
        title={tr('home.searchTitle')}
        sub={tr('home.searchSub')}
      />
      <div className="page-shell py-8 md:py-10">
        <LiveSearch mode="page" initialQuery={initialQuery} />
      </div>
    </div>
  );
}
