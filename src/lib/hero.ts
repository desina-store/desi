import type { CategorySlug, Lang } from './site';

export type HeroSlide = {
  id: number;
  image: string;
  kicker: { ar: string; en: string };
  title: { ar: string; en: string };
  body: { ar: string; en: string };
  href: string;
  slug: CategorySlug;
};

/** The original 15 campaign banners from js/app.js, now wired to their real sections. */
export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 1,
    image: '/assets/p14.webp',
    kicker: { ar: 'كمبيوتر وبرمجيات', en: 'Computers & Software' },
    title: { ar: 'قوة الحوسبة بين يديك', en: 'Serious Power, Serious Value' },
    body: { ar: 'أجهزة وبرمجيات أصلية بضمان محلي ودولي.', en: 'Genuine hardware and software with local and international warranty.' },
    href: '/computers',
    slug: 'computers',
  },
  {
    id: 2,
    image: '/assets/p13.webp',
    kicker: { ar: 'منصة ديسينا', en: 'DeSina Store Hub' },
    title: { ar: 'كل الأقسام في مكان واحد', en: 'Every Department, One Hub' },
    body: { ar: 'ابدأ من هنا واكتشف كل تشكيلات المتجر.', en: 'Start here and explore every collection in the store.' },
    href: '/',
    slug: 'mobiles',
  },
  {
    id: 3,
    image: '/assets/p10.webp',
    kicker: { ar: 'خدمات صناعية', en: 'Industrial Services' },
    title: { ar: 'حلول صناعية وتشغيلية متكاملة', en: 'Integrated Industrial Solutions' },
    body: { ar: 'توريد وتشغيل وصيانة بالتنسيق المباشر مع فريقنا.', en: 'Supply, operation and maintenance coordinated directly with our team.' },
    href: '/industrial',
    slug: 'industrial',
  },
  {
    id: 4,
    image: '/assets/p11.webp',
    kicker: { ar: 'موبايلات وإلكترونيات', en: 'Mobiles & Electronics' },
    title: { ar: 'ارتقِ بتجربتك التقنية', en: 'Level Up Your Tech Game' },
    body: { ar: 'أحدث الهواتف والسماعات الذكية بضمان الوكيل.', en: 'The latest smartphones and smart audio, agent-backed.' },
    href: '/mobiles',
    slug: 'mobiles',
  },
  {
    id: 5,
    image: '/assets/p6.webp',
    kicker: { ar: 'ملابس رياضية', en: 'Sports Wear' },
    title: { ar: 'أداء أعلى في كل تمرين', en: 'Built For Every Rep' },
    body: { ar: 'خامات دراي فيت خفيفة ومسامية.', en: 'Lightweight, breathable dry-fit fabrics.' },
    href: '/sports',
    slug: 'sports',
  },
  {
    id: 6,
    image: '/assets/airpods.webp',
    kicker: { ar: 'صوت ذكي', en: 'Smart Audio' },
    title: { ar: 'أيربودز برو — عزل وصوت محيطي', en: 'AirPods Pro — Immersive Sound' },
    body: { ar: 'سماعات أبل الأصلية بضمان سنة مفعل.', en: 'Genuine Apple audio with an activated one-year warranty.' },
    href: '/product/8',
    slug: 'mobiles',
  },
  {
    id: 7,
    image: '/assets/p7.webp',
    kicker: { ar: 'أزياء يومية', en: 'Everyday Fashion' },
    title: { ar: 'أناقة يومية بلمسة ديسينا', en: 'Everyday Style, DeSina Touch' },
    body: { ar: 'تشكيلات كاجوال بخامات قطنية فاخرة.', en: 'Casual collections in premium cotton blends.' },
    href: '/fashion',
    slug: 'fashion',
  },
  {
    id: 8,
    image: '/assets/p3.webp',
    kicker: { ar: 'تصفيات كبرى', en: 'Big Clearance' },
    title: { ar: 'خصومات محسوبة على آخر سعر', en: 'Discounts Already Applied' },
    body: { ar: 'منتجات أصلية بأسعار مخفضة لفترة محدودة.', en: 'Genuine products at reduced prices for a limited time.' },
    href: '/offers',
    slug: 'outlet',
  },
  {
    id: 9,
    image: '/assets/p5.webp',
    kicker: { ar: 'الأوت ليت', en: 'The Outlet' },
    title: { ar: 'تصفيات كبرى — لفترة محدودة', en: 'Big Clearance — Limited Time' },
    body: { ar: 'فرص حقيقية على تشكيلات مختارة.', en: 'Real markdowns across selected collections.' },
    href: '/outlet',
    slug: 'outlet',
  },
  {
    id: 10,
    image: '/assets/p12.webp',
    kicker: { ar: 'أجهزة منزلية', en: 'Home Appliances' },
    title: { ar: 'شاشات ذكية بجودة عالمية', en: 'Home Screens Built to Last' },
    body: { ar: 'سامسونج وإل جي بضمان سنتين ضد عيوب الصناعة.', en: 'Samsung and LG with a two-year manufacturing warranty.' },
    href: '/appliances',
    slug: 'appliances',
  },
  {
    id: 11,
    image: '/assets/p11.webp',
    kicker: { ar: 'عروض الموبايل', en: 'Mobile Deals' },
    title: { ar: 'هاتفك القادم هنا', en: 'Your Next Phone Is Here' },
    body: { ar: 'آيفون وسامسونج وأنكر بأسعار تنافسية.', en: 'iPhone, Samsung and Anker at competitive prices.' },
    href: '/mobiles',
    slug: 'mobiles',
  },
  {
    id: 12,
    image: '/assets/p6.webp',
    kicker: { ar: 'رياضة', en: 'Sportswear' },
    title: { ar: 'جهّز حقيبة الجيم', en: 'Gear Up Your Gym Bag' },
    body: { ar: 'تيشيرتات ضغط وشورتات تدريب.', en: 'Compression tops and training shorts.' },
    href: '/sports',
    slug: 'sports',
  },
  {
    id: 13,
    image: '/assets/p4.webp',
    kicker: { ar: 'جاكيت ديسينا', en: 'DeSina Outerwear' },
    title: { ar: 'الجاكيت الكاجوال الأكثر طلباً', en: 'The Casual Jacket In Demand' },
    body: { ar: 'مزيج قطني فاخر بقصة مريحة.', en: 'Premium cotton blend in a comfortable cut.' },
    href: '/product/1',
    slug: 'fashion',
  },
  {
    id: 14,
    image: '/assets/p7.webp',
    kicker: { ar: 'متجر الملابس', en: 'Fashion Store' },
    title: { ar: 'تشكيلة الموسم الجديدة', en: 'The New Season Edit' },
    body: { ar: 'قطع مختارة تنسّقها مع كل يوم.', en: 'Selected pieces that style every day.' },
    href: '/fashion',
    slug: 'fashion',
  },
  {
    id: 15,
    image: '/assets/p9.webp',
    kicker: { ar: 'ديسينا ستايل', en: 'DeSina Style' },
    title: { ar: 'تفاصيل تصنع الفرق', en: 'Details That Make The Look' },
    body: { ar: 'قصات مدروسة وخامات مريحة تدوم.', en: 'Considered cuts and comfortable fabrics that last.' },
    href: '/fashion',
    slug: 'fashion',
  },
];

export function heroSlideText(slide: HeroSlide, lang: Lang) {
  return {
    kicker: slide.kicker[lang],
    title: slide.title[lang],
    body: slide.body[lang],
  };
}
