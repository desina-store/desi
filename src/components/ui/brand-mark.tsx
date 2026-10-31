import Link from "next/link";

export function BrandMark({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`brand-mark ${className}`} aria-label="DeSinaHub home" dir="ltr">
      DeSina<span>Hub.</span>
    </Link>
  );
}
