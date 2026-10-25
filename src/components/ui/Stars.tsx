import { Star } from 'lucide-react';

export function Stars({ rating = 5, className = 'h-4 w-4' }: { rating?: number; className?: string }) {
  return (
    <span className="inline-flex items-center gap-0.5 text-[#f4b400]" aria-label={`${rating} / 5`}>
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          className={className}
          fill={index < Math.round(rating) ? 'currentColor' : 'none'}
          strokeWidth={1.6}
        />
      ))}
    </span>
  );
}
