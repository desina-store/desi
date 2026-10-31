import { Star } from "lucide-react";

export function Stars({ rating, label }: { rating: number; label?: string }) {
  return (
    <span className="stars" aria-label={label ?? `${rating} out of 5`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          aria-hidden="true"
          className={index < Math.round(rating) ? "is-filled" : ""}
        />
      ))}
    </span>
  );
}
