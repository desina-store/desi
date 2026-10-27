import Link from 'next/link';

export function BrandMark({ className = '' }: { className?: string }) {
  return (
    <Link href="/" className={`brand-mark ${className}`.trim()} aria-label="DeSinaHub home" dir="ltr">
      DeSina<span>Hub.</span>
    </Link>
  );
}
