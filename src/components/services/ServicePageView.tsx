import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Headset, Phone } from 'lucide-react';
import { JsonLd } from '@/components/ui/JsonLd';
import { RichText } from '@/components/ui/RichText';
import { serviceCards } from '@/lib/content';
import { translate } from '@/lib/i18n';
import { CATEGORY_BY_SLUG, HOTLINES, MAP_URL, SITE_EMAIL, SITE_URL, WHATSAPP, type Lang } from '@/lib/site';

type ServicePageViewProps = {
  slug: 'industrial' | 'tourism';
  lang: Lang;
};

const STEPS = {
  industrial: {
    en: [
      { title: 'Share your requirement', body: 'Send the equipment or service scope, quantities and site details on WhatsApp.' },
      { title: 'Receive a formal quotation', body: 'Our team confirms availability, lead time and pricing with a tax-ready quotation.' },
      { title: 'Approve and schedule', body: 'We coordinate supply, commissioning or maintenance around your operating schedule.' },
    ],
    ar: [
      { title: 'شاركنا احتياجك', body: 'ابعت مواصفات المعدات أو نطاق الخدمة والكميات وتفاصيل الموقع على الواتساب.' },
      { title: 'استلم عرض سعر رسمي', body: 'فريقنا يؤكد التوفر ومدة التوريد والسعر بعرض سعر رسمي قابل للفواتير الضريبية.' },
      { title: 'الاعتماد والجدولة', body: 'ننسق التوريد أو التشغيل أو الصيانة بما يناسب جدول تشغيلك.' },
    ],
  },
  tourism: {
    en: [
      { title: 'Tell us the trip', body: 'Share destination, dates, group size and budget on WhatsApp.' },
      { title: 'Get a tailored programme', body: 'We prepare accommodation, transfers and activities as one clear itinerary.' },
      { title: 'Confirm and travel', body: 'Approve the plan and our team handles the bookings and on-trip coordination.' },
    ],
    ar: [
      { title: 'احكيلنا عن الرحلة', body: 'ابعت الوجهة والتواريخ وعدد الأفراد والميزانية على الواتساب.' },
      { title: 'استلم برنامجاً مخصصاً', body: 'نجهز الإقامة والتنقلات والأنشطة في برنامج واحد واضح.' },
      { title: 'أكد وسافر', body: 'اعتمد الخطة وفريقنا يتابع الحجوزات والتنسيق طوال الرحلة.' },
    ],
  },
};

export function ServicePageView({ slug, lang }: ServicePageViewProps) {
  const def = CATEGORY_BY_SLUG.get(slug);
  if (!def) return null;
  const tr = (key: string) => translate(lang, key);
  const cards = serviceCards(slug);
  const steps = STEPS[slug][lang];
  const otherSlug = slug === 'industrial' ? 'tourism' : 'industrial';
  const other = CATEGORY_BY_SLUG.get(otherSlug);
  const whatsappText = encodeURIComponent(
    lang === 'ar' ? `استفسار ${def.name.ar} — DeSinaHub` : `${def.name.en} enquiry — DeSinaHub`,
  );

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: def.name.en,
    description: def.intro.en,
    serviceType: def.name.en,
    provider: { '@id': 'https://www.desinahub.com/#store' },
    areaServed: 'EG',
    url: `${SITE_URL}/${slug}`,
  };

  return (
    <div>
      <JsonLd data={serviceSchema} />
      <section className="relative overflow-hidden">
        <div className="relative min-h-[26rem] md:min-h-[30rem]">
          <Image
            src={def.image}
            alt={def.name[lang]}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/20" />
          <div className="page-shell relative flex min-h-[26rem] flex-col justify-end py-10 md:min-h-[30rem] md:py-14">
            <nav aria-label="Breadcrumb" className="mb-auto flex items-center gap-1.5 text-[0.625rem] font-bold text-white/50">
              <Link href="/" className="hover:text-white">{tr('nav.home')}</Link>
              <span aria-hidden>/</span>
              <span className="text-white/80">{def.short[lang]}</span>
            </nav>
            <span className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-canary px-3 py-1.5 text-[0.5625rem] font-extrabold uppercase tracking-[0.16em] text-ink">
              <span className="h-1.5 w-1.5 rounded-full bg-ink" />
              {def.name[lang]}
            </span>
            <h1 className="mt-4 max-w-[24ch] text-balance text-3xl font-extrabold leading-[1.12] tracking-tight text-white md:text-5xl">
              {def.hero[lang]}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/70 md:text-base">{def.intro[lang]}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              <a
                href={`https://wa.me/${WHATSAPP}?text=${whatsappText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-canary px-5 py-2.5 text-xs font-extrabold text-ink transition-colors hover:bg-canary-deep"
              >
                {tr('category.request')}
                <ArrowRight className="h-3.5 w-3.5 rtl-flip" />
              </a>
              <a href={`tel:${HOTLINES[0].value}`} className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-xs font-extrabold text-white backdrop-blur">
                <Phone className="h-3.5 w-3.5" />
                <span dir="ltr">{HOTLINES[0].label}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="page-shell py-10 md:py-14">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card, index) => (
            <article key={card.title.en} className="surface-card flex h-full flex-col p-5">
              <span className="font-mono text-[0.6875rem] font-extrabold text-olive/60">{String(index + 1).padStart(2, '0')}</span>
              <h2 className="mt-2 text-sm font-extrabold leading-snug text-ink">{card.title[lang]}</h2>
              <RichText text={card.body[lang]} className="mt-1.5 text-xs leading-relaxed text-muted" />
            </article>
          ))}
        </div>

        <section className="mt-10 grid gap-5 lg:grid-cols-[1.3fr_0.7fr] lg:items-start">
          <div>
            <span className="text-[0.625rem] font-extrabold uppercase tracking-[0.18em] text-olive">
              {lang === 'ar' ? 'كيف تبدأ' : 'How it works'}
            </span>
            <h2 className="mt-1 text-xl font-extrabold text-ink md:text-2xl">
              {lang === 'ar' ? 'ثلاث خطوات واضحة' : 'Three clear steps'}
            </h2>
            <div className="mt-4 space-y-2.5">
              {steps.map((step, index) => (
                <div key={step.title} className="surface-card flex items-start gap-3 p-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-canary/55 text-xs font-extrabold text-olive-dark">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="text-sm font-extrabold text-ink">{step.title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-muted">{step.body}</p>
                  </div>
                  <CheckCircle2 className="ms-auto h-4 w-4 shrink-0 text-olive/40" />
                </div>
              ))}
            </div>
          </div>

          <aside className="space-y-4">
            <section className="rounded-[1.625rem] bg-ink p-5 text-white">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-canary text-ink">
                <Headset className="h-5 w-5" />
              </span>
              <h2 className="mt-3 text-base font-extrabold text-white">{lang === 'ar' ? 'تحدث مع فريق ديسينا' : 'Talk to the DeSina team'}</h2>
              <p className="mt-1.5 text-xs leading-relaxed text-white/60">
                {lang === 'ar'
                  ? 'نرد على استفسارات الشركات والبرامج السياحية من خلال الواتساب أو البريد الرسمي.'
                  : 'We answer B2B and travel enquiries through WhatsApp or our official email.'}
              </p>
              <div className="mt-4 space-y-2 text-xs font-bold">
                <a href={`https://wa.me/${WHATSAPP}?text=${whatsappText}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between rounded-xl bg-white/10 px-3 py-2.5 text-canary">
                  WhatsApp
                  <ArrowRight className="h-3.5 w-3.5 rtl-flip" />
                </a>
                <a href={`mailto:${SITE_EMAIL}`} className="flex items-center justify-between rounded-xl bg-white/10 px-3 py-2.5 text-white/75">
                  {SITE_EMAIL}
                  <ArrowRight className="h-3.5 w-3.5 rtl-flip" />
                </a>
                <a href={MAP_URL} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between rounded-xl bg-white/10 px-3 py-2.5 text-white/75">
                  {tr('footer.map')}
                  <ArrowRight className="h-3.5 w-3.5 rtl-flip" />
                </a>
              </div>
            </section>

            {other ? (
              <Link href={`/${otherSlug}`} className="group block overflow-hidden rounded-[1.625rem] bg-white/65 shadow-card">
                <div className="product-media relative aspect-[16/8] rounded-none">
                  <Image src={other.image} alt={other.name[lang]} fill sizes="380px" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                </div>
                <div className="flex items-center justify-between gap-3 p-4">
                  <div>
                    <p className="text-[0.5625rem] font-extrabold uppercase tracking-[0.14em] text-olive">{lang === 'ar' ? 'خدمة أخرى' : 'Other service'}</p>
                    <p className="mt-1 text-sm font-extrabold text-ink">{other.name[lang]}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-ink rtl-flip" />
                </div>
              </Link>
            ) : null}
          </aside>
        </section>
      </div>
    </div>
  );
}
