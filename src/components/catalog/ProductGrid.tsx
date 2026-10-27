import { ShoppingBag } from 'lucide-react';
import { ProductCard } from './ProductCard';
import type { Product } from '@/lib/products';

type ProductGridProps = {
  items: Product[];
  emptyTitle?: string;
  emptySub?: string;
  columns?: 2 | 3 | 4;
  showcase?: boolean;
};

export function ProductGrid({ items, emptyTitle, emptySub, columns = 4, showcase = false }: ProductGridProps) {
  if (!items.length) {
    return (
      <div className="empty-state">
        <span className="empty-state__icon">
          <ShoppingBag aria-hidden="true" />
        </span>
        <h3>{emptyTitle ?? 'No products found'}</h3>
        {emptySub ? <p>{emptySub}</p> : null}
      </div>
    );
  }

  const grid = (
    <div className={`product-grid ${columns === 3 ? 'product-grid--3' : columns === 2 ? 'product-grid--2' : ''}`}>
      {items.map((product, index) => (
        <ProductCard key={`${product.code}-${product.name.en}`} product={product} priority={index < 2} />
      ))}
    </div>
  );

  if (!showcase) return grid;
  return <div className="showcase">{grid}</div>;
}
