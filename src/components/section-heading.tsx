import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function SectionHeading({
  kicker,
  title,
  subtitle,
  href,
  actionLabel,
  align = "start",
}: {
  kicker: string;
  title: string;
  subtitle?: string;
  href?: string;
  actionLabel?: string;
  align?: "start" | "center";
}) {
  return (
    <div
      className={`section-heading ${align === "center" ? "section-heading--center" : ""}`}
    >
      <div className="section-heading__copy">
        <p className="eyebrow">{kicker}</p>
        <h2 className="section-title">{title}</h2>
        {subtitle ? <p className="section-sub">{subtitle}</p> : null}
      </div>
      {href && actionLabel ? (
        <Link href={href} className="section-link">
          {actionLabel}
          <ArrowUpRight aria-hidden="true" />
        </Link>
      ) : null}
    </div>
  );
}
