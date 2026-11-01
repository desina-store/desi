import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  sub?: string;
  action?: { href: string; label: string };
  center?: boolean;
};

export function SectionHeading({ eyebrow, title, sub, action, center }: SectionHeadingProps) {
  return (
    <div className={`section-heading ${center ? 'section-heading--center' : ''}`}>
      <div className="section-heading__copy">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h2 className="section-title">{title}</h2>
        {sub ? <p className="section-sub">{sub}</p> : null}
      </div>
      {action ? (
        <Link href={action.href} className="section-link">
          {action.label}
          <ArrowUpRight aria-hidden="true" />
        </Link>
      ) : null}
    </div>
  );
}
