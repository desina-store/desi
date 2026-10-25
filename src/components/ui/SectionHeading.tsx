import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  sub?: string;
  action?: { href: string; label: string };
  center?: boolean;
};

export function SectionHeading({ eyebrow, title, sub, action, center }: SectionHeadingProps) {
  return (
    <div
      className={`mb-7 flex flex-col gap-4 sm:flex-row sm:items-end ${
        center ? 'items-center text-center sm:flex-col sm:text-center' : 'sm:justify-between'
      }`}
    >
      <div className={center ? 'max-w-2xl' : 'max-w-2xl'}>
        {eyebrow ? (
          <span className="mb-3 inline-flex items-center gap-2 text-[0.6875rem] font-extrabold uppercase tracking-[0.2em] text-olive">
            <span className="h-1.5 w-1.5 rounded-full bg-canary-deep" />
            {eyebrow}
          </span>
        ) : null}
        <h2 className="text-balance text-2xl font-extrabold tracking-tight text-ink md:text-[2rem] md:leading-[1.15]">
          {title}
        </h2>
        {sub ? <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">{sub}</p> : null}
      </div>
      {action ? (
        <Link
          href={action.href}
          className="group inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-ink/10 bg-white/70 px-4 py-2 text-xs font-extrabold text-ink transition-colors hover:border-olive hover:bg-white sm:self-auto"
        >
          {action.label}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 rtl-flip" />
        </Link>
      ) : null}
    </div>
  );
}
