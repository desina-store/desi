export const SITE_URL = 'https://www.desinahub.com';
export const SITE_NAME = 'DeSinaHub';
export const SITE_EMAIL = 'info@desinahub.com';
export const SALES_EMAIL = 'sales@desinahub.com';
export const SUPPORT_EMAIL = 'support@desinahub.com';
export const WHATSAPP = '201115680003';
export const WHATSAPP_DISPLAY = '+20 111 568 0003';
export const HOTLINES = [
  { value: '+201001283311', label: '+20 1001283311' },
  { value: '+201105535538', label: '+20 1105535538' },
];
export const MAP_URL =
  'https://www.google.com/maps/place/desinahub/@30.050746,31.2039679,17z/data=!3m1!4b1!4m6!3m5!1s0x1458410060217473:0xa799a6d41e740766!8m2!3d30.0507414!4d31.201393!16s%2Fg%2F11xkx028t0?entry=ttu';

export const SOCIAL = {
  facebook: 'https://www.facebook.com/desinahub',
  youtube: 'https://www.youtube.com/@desinahub',
  tiktok: 'https://www.tiktok.com/@desinahub',
  instagram: 'https://www.instagram.com/desinahub/',
  whatsapp: `https://wa.me/${WHATSAPP}`,
};

export type Lang = 'ar' | 'en';

export type CategorySlug =
  | 'mobiles'
  | 'computers'
  | 'appliances'
  | 'outlet'
  | 'sports'
  | 'fashion'
  | 'industrial'
  | 'tourism';

type Localized = { ar: string; en: string };

export type CategoryDef = {
  slug: CategorySlug;
  name: Localized;
  short: Localized;
  image: string;
  tint: string;
  catalog: string[];
  hero: Localized;
  intro: Localized;
};

export const CATEGORIES: CategoryDef[] = [
  {
    slug: 'mobiles',
    name: { ar: 'الموبايلات والإلكترونيات', en: 'Mobiles & Electronics' },
    short: { ar: 'موبايلات', en: 'Mobiles' },
    image: '/assets/p11.webp',
    tint: '#fdf6e3',
    catalog: ['Mobiles'],
    hero: { ar: 'ارتقِ بتجربتك التقنية', en: 'Level Up Your Tech Game' },
    intro: {
      ar: 'أحدث الهواتف الذكية والسماعات الذكية بضمان محلي ودولي من الوكيل.',
      en: 'The latest smartphones and smart audio, backed by local and international warranty.',
    },
  },
  {
    slug: 'computers',
    name: { ar: 'الكمبيوتر واكسسواراته', en: 'Computers & Accessories' },
    short: { ar: 'كمبيوتر', en: 'Computers' },
    image: '/assets/p14.webp',
    tint: '#e3f2fd',
    catalog: ['Computers', 'OS'],
    hero: { ar: 'قوة الحوسبة بين يديك', en: 'Serious Power, Serious Value' },
    intro: {
      ar: 'أجهزة وبرمجيات أصلية: ويندوز، أوفيس، حماية، واشتراكات الذكاء الاصطناعي.',
      en: 'Devices and genuine software: Windows, Office, antivirus and AI subscriptions.',
    },
  },
  {
    slug: 'appliances',
    name: { ar: 'الأجهزة الكهربائية', en: 'Home Appliances' },
    short: { ar: 'أجهزة منزلية', en: 'Appliances' },
    image: '/assets/samsung_tv.webp',
    tint: '#fff3e0',
    catalog: ['Appliances'],
    hero: { ar: 'شاشات وأجهزة منزلية بجودة عالمية', en: 'Home Screens Built to Last' },
    intro: {
      ar: 'شاشات سامسونج وإل جي الذكية بضمان سنتين ضد عيوب الصناعة.',
      en: 'Samsung and LG smart screens with a two-year manufacturing warranty.',
    },
  },
  {
    slug: 'outlet',
    name: { ar: 'التصفيات والأوت ليت', en: 'Outlet & Clearance' },
    short: { ar: 'أوت ليت %', en: 'Outlet %' },
    image: '/assets/p5.webp',
    tint: '#fff3e0',
    catalog: ['Outlet'],
    hero: { ar: 'تصفيات كبرى — لفترة محدودة', en: 'Big Clearance — Limited Time' },
    intro: {
      ar: 'منتجات أصلية بخصومات محسوبة مسبقاً على آخر سعر معروض.',
      en: 'Genuine products with discounts already applied to the final price.',
    },
  },
  {
    slug: 'sports',
    name: { ar: 'الملابس الرياضية', en: 'Sports Wear' },
    short: { ar: 'رياضة', en: 'Sports' },
    image: '/assets/p6.webp',
    tint: '#f1f8e9',
    catalog: ['Sports'],
    hero: { ar: 'أداء أعلى في كل تمرين', en: 'Built For Every Rep' },
    intro: {
      ar: 'ملابس ضغط وشورتات تدريب بخامات دراي فيت خفيفة ومسامية.',
      en: 'Compression tops and training shorts in lightweight, breathable dry-fit fabrics.',
    },
  },
  {
    slug: 'fashion',
    name: { ar: 'متجر الملابس', en: 'Fashion Store' },
    short: { ar: 'أزياء', en: 'Fashion' },
    image: '/assets/p9.webp',
    tint: '#fce4ec',
    catalog: ['Fashion'],
    hero: { ar: 'أناقة يومية بلمسة ديسينا', en: 'Everyday Style, DeSina Touch' },
    intro: {
      ar: 'تشكيلات كاجوال بخامات قطنية فاخرة وقصات مريحة.',
      en: 'Casual collections in premium cotton blends with comfortable cuts.',
    },
  },
  {
    slug: 'industrial',
    name: { ar: 'الخدمات الصناعية', en: 'Industrial Services' },
    short: { ar: 'صناعة', en: 'Industrial' },
    image: '/assets/p10.webp',
    tint: '#eceff1',
    catalog: [],
    hero: { ar: 'حلول صناعية وتشغيلية متكاملة', en: 'Integrated Industrial Solutions' },
    intro: {
      ar: 'توريد وتشغيل وصيانة للمعدات والأنظمة الصناعية بالتنسيق المباشر مع فريقنا.',
      en: 'Supply, operation and maintenance for industrial equipment and systems, coordinated directly with our team.',
    },
  },
  {
    slug: 'tourism',
    name: { ar: 'الخدمات السياحية', en: 'Tourism Services' },
    short: { ar: 'سياحة', en: 'Tourism' },
    image: '/assets/p5.webp',
    tint: '#e0f7fa',
    catalog: [],
    hero: { ar: 'رحلات وبرامج سياحية بترتيب كامل', en: 'Travel, Planned End to End' },
    intro: {
      ar: 'برامج سياحية داخل مصر وخارجها، حجوزات وتنقلات بتنسيق فريق ديسينا.',
      en: 'Domestic and international travel programmes, bookings and transfers arranged by the DeSina team.',
    },
  },
];

export const CATEGORY_BY_SLUG = new Map(CATEGORIES.map((c) => [c.slug, c]));

export const STORE_SECTIONS = [
  { key: 'all', href: '/', label: { ar: 'كل الأقسام', en: 'All Departments' }, image: '/assets/p13.webp', tint: '#DEFCF5' },
  ...CATEGORIES.filter((c) => c.slug !== 'industrial' && c.slug !== 'tourism').map((c) => ({
    key: c.slug,
    href: `/${c.slug}`,
    label: c.name,
    image: c.image,
    tint: c.tint,
  })),
  { key: 'offers', href: '/offers', label: { ar: 'العروض', en: 'Offers' }, image: '/assets/p5.webp', tint: '#fff8e1' },
];

export const PAYMENT_BRANDS = ['visa', 'mastercard', 'meeza', 'paypal', 'fawry'] as const;
