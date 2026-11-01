import type { Lang } from '@/lib/site';

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  sub: string;
  tone?: 'cream' | 'dark' | 'canary';
  children?: React.ReactNode;
};

const TONES = {
  cream: 'from-cream-soft via-cream to-cream-deep text-ink',
  canary: 'from-canary/70 via-cream to-cream text-ink',
  dark: 'from-ink via-[#242424] to-olive-dark text-white',
};

export function PageHeader({ eyebrow, title, sub, tone = 'cream', children }: PageHeaderProps) {
  const isDark = tone === 'dark';
  return (
    <section className={`relative overflow-hidden border-b border-ink/5 bg-gradient-to-br ${TONES[tone]}`}>
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 end-[-4rem] h-64 w-64 rounded-full bg-canary/35 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[-6rem] start-[-3rem] h-56 w-56 rounded-full bg-olive/15 blur-3xl"
      />
      <div className="page-shell relative py-12 md:py-16">
        <span
          className={`inline-flex items-center gap-2 text-[0.6875rem] font-extrabold uppercase tracking-[0.24em] ${
            isDark ? 'text-canary' : 'text-olive'
          }`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-canary-deep" />
          {eyebrow}
        </span>
        <h1 className="mt-4 max-w-3xl text-balance text-3xl font-extrabold leading-[1.12] tracking-tight md:text-5xl">
          {title}
        </h1>
        <p className={`mt-4 max-w-2xl text-sm leading-relaxed md:text-base ${isDark ? 'text-white/70' : 'text-muted'}`}>
          {sub}
        </p>
        {children ? <div className="mt-7">{children}</div> : null}
      </div>
    </section>
  );
}
