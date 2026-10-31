import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export type Crumb = { label: string; href?: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <Link href="/">DeSinaHub</Link>
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`} className="crumb">
          <ChevronRight className="breadcrumb-sep" aria-hidden="true" />
          {item.href ? <Link href={item.href}>{item.label}</Link> : <span>{item.label}</span>}
        </span>
      ))}
    </nav>
  );
}

export function PageHero({
  kicker,
  title,
  subtitle,
  image,
  imageAlt,
  crumbs,
  children,
  compact = false,
}: {
  kicker: string;
  title: string;
  subtitle?: string;
  image?: string;
  imageAlt?: string;
  crumbs?: Crumb[];
  children?: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <section className={`page-hero ${compact ? "is-compact" : ""}`}>
      <div className="shell">
        {crumbs ? <Breadcrumbs items={crumbs} /> : null}
        <div className={`page-hero__inner ${image ? "has-art" : ""}`}>
          <div className="page-hero__copy">
            <p className="eyebrow eyebrow--plain">{kicker}</p>
            <h1>{title}</h1>
            {subtitle ? <p className="page-hero__sub">{subtitle}</p> : null}
            {children}
          </div>
          {image ? (
            <div className="page-hero__art">
              <Image
                src={image}
                alt={imageAlt ?? ""}
                fill
                sizes="(max-width: 900px) 100vw, 46vw"
                quality={90}
                priority
              />
              <span className="page-hero__glow" aria-hidden="true" />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
