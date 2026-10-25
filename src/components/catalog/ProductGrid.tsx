import { ProductCard } from './ProductCard';
import type { Product } from '@/lib/products';

type ProductGridProps = {
  items: Product[];
  emptyTitle?: string;
  emptySub?: string;
};

export function ProductGrid({ items, emptyTitle, emptySub }: ProductGridProps) {
  if (!items.length) {
    return (
      <div className="surface-card flex flex-col items-center justify-center px-6 py-16 text-center">
        <p className="text-lg font-extrabold text-ink">{emptyTitle ?? 'No products found'}</p>
        {emptySub ? <p className="mt-2 max-w-md text-sm text-muted">{emptySub}</p> : null}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3.5 md:grid-cols-3 md:gap-5 xl:grid-cols-4">
      {items.map((product) => (
        <ProductCard key={`${product.code}-${product.name.en}`} product={product} />
      ))}
    </div>
  );
}
