import { Star } from 'lucide-react';

export function Stars({
  rating = 5,
  className = '',
  label,
}: {
  rating?: number;
  className?: string;
  label?: string;
}) {
  return (
    <span className={`stars ${className}`} aria-label={label ?? `${rating} / 5`}>
      {Array.from({ length: 5 }, (_, index) => (
        <Star key={index} aria-hidden="true" className={index < Math.round(rating) ? 'is-filled' : 'is-empty'} />
      ))}
    </span>
  );
}
