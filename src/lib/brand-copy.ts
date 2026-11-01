import type { Lang } from './site';

export type BrandCopy = { en: string; ar: string };

/** Pick a bilingual string for the active language. */
export function pick(lang: Lang, en: string, ar: string): string {
  return lang === 'ar' ? ar : en;
}

export const HERO_COPY = {
  eyebrow: { en: 'DeSinaHub · The everything store', ar: 'ديسينا هب · متجر كل شيء' },
  titleLead: { en: 'One store.', ar: 'متجر واحد.' },
  titleEm: { en: 'Everything.', ar: 'كل شيء.' },
  lead: {
    en: 'Mobiles, computers, home appliances, outlet finds, sportswear and fashion — plus industrial and tourism desks. Genuine products, transparent prices and secure checkout.',
    ar: 'موبايلات، كمبيوتر، أجهزة منزلية، أوت ليت، ملابس رياضية وأزياء — بالإضافة إلى مكتبي الخدمات الصناعية والسياحية. منتجات أصلية وأسعار واضحة ودفع آمن.',
  },
  ratingLabel: { en: 'Rated 4.8 out of 5', ar: 'تقييم 4.8 من 5' },
  ratingNote: { en: 'Loved by 1,200+ shoppers across Egypt', ar: 'أكثر من 1200 عميل في كل أنحاء مصر' },
  floatRating: { en: '4.8/5 store rating', ar: 'تقييم المتجر 4.8/5' },
  floatCustomers: { en: '1,200+ happy customers', ar: 'أكثر من 1200 عميل سعيد' },
  floatFreeShip: { en: 'Free on every order', ar: 'مجاناً على كل الطلبات' },
  prevSlide: { en: 'Previous slide', ar: 'الشريحة السابقة' },
  nextSlide: { en: 'Next slide', ar: 'الشريحة التالية' },
  from: { en: 'from', ar: 'ابتداءً من' },
  view: { en: 'View offer', ar: 'شاهد العرض' },
  campaigns: { en: 'DeSina campaigns 2026', ar: 'حملات ديسينا 2026' },
} satisfies Record<string, BrandCopy>;

export const CATEGORY_COPY = {
  all: { en: 'Full catalogue', ar: 'الكتالوج الكامل' },
  products: { en: 'products', ar: 'منتج' },
  product: { en: 'product', ar: 'منتج' },
  browseAll: { en: 'Browse all departments', ar: 'تصفح كل الأقسام' },
  items: { en: 'items', ar: 'عنصراً' },
  item: { en: 'item', ar: 'عنصر' },
} satisfies Record<string, BrandCopy>;

export const DRAWER_COPY = {
  freeShipping: { en: 'Free shipping on every order', ar: 'الشحن مجاني على كل الطلبات' },
  secureNote: { en: 'Secure checkout · server-verified payment', ar: 'دفع آمن · مدفوعات موثّقة على السيرفر' },
  viewCart: { en: 'View full cart', ar: 'عرض السلة كاملة' },
  continueShopping: { en: 'Keep shopping', ar: 'متابعة التسوّق' },
  added: { en: 'Added to cart', ar: 'أُضيف إلى السلة' },
  emptyHint: { en: 'Your cart is empty — start with a department or a deal.', ar: 'سلتك فارغة — ابدأ من قسم أو من العروض.' },
  orderId: { en: 'Order reference', ar: 'رقم الطلب' },
  copy: { en: 'Copy', ar: 'نسخ' },
  copied: { en: 'Copied', ar: 'تم النسخ' },
} satisfies Record<string, BrandCopy>;

export const PDP_COPY = {
  details: { en: 'Product details', ar: 'تفاصيل المنتج' },
  specifications: { en: 'Specifications', ar: 'المواصفات' },
  deliveryReturns: { en: 'Delivery & warranty', ar: 'الشحن والضمان' },
  availability: { en: 'Availability', ar: 'التوفر' },
  inStock: { en: 'In stock', ar: 'متوفر' },
  authentic: { en: 'Authentic', ar: 'أصلي' },
  digitalDelivery: { en: 'Digital delivery', ar: 'تسليم رقمي' },
  returns: { en: 'Easy returns', ar: 'استرجاع سهل' },
  returnsText: {
    en: '14-day return window on sealed items, coordinated by the DeSina support desk.',
    ar: 'إمكانية الاسترجاع خلال 14 يوماً على المنتجات المغلقة، بتنسيق من فريق دعم ديسينا.',
  },
  warrantyText: {
    en: 'Local and international warranty through the authorised agent, verified on the invoice.',
    ar: 'ضمان محلي ودولي عبر الوكيل المعتمد، موثّق على الفاتورة.',
  },
  deliveryText: {
    en: 'Dispatch within 24 hours, delivery across Egypt in 2–4 business days.',
    ar: 'الشحن خلال 24 ساعة والتوصيل لجميع المحافظات خلال 2–4 أيام عمل.',
  },
  reviews: { en: '1,200+ reviews', ar: '1200+ تقييماً' },
  keepExploring: { en: 'Keep exploring', ar: 'تابع الاستكشاف' },
  sameDepartment: { en: 'Same department', ar: 'من نفس القسم' },
} satisfies Record<string, BrandCopy>;

export const HOME_COPY = {
  categoriesKicker: { en: 'Departments', ar: 'أقسام المتجر' },
  featuredKicker: { en: 'DeSina selection', ar: 'مختارات ديسينا' },
  dealsKicker: { en: 'Outlet markdowns', ar: 'تصفيات الأوت ليت' },
  trendingKicker: { en: 'Hot right now', ar: 'الأكثر طلباً' },
  trendingTitle: { en: 'Trending right now', ar: 'الأكثر رواجاً الآن' },
  trendingSub: {
    en: 'Hardware and software our clients keep asking for this week.',
    ar: 'أجهزة وبرمجيات يطلبها عملاؤنا هذا الأسبوع.',
  },
  brandsKicker: { en: 'Brand shelf', ar: 'ماركات موثوقة' },
  promiseKicker: { en: 'Our promise', ar: 'وعدنا' },
  promiseTitle: { en: 'Four things we never compromise on', ar: 'أربعة أمور لا نتنازل عنها' },
  promiseSub: {
    en: 'The DeSinaHub standard applies to every department, from mobiles to tourism.',
    ar: 'معيار ديسينا هب يسري على كل الأقسام، من الموبايلات إلى السياحة.',
  },
  storyKicker: { en: 'The DeSinaHub way', ar: 'طريقة ديسينا هب' },
  storyTitle: { en: 'One hub for tech, home, sport and style', ar: 'منصة واحدة للتقنية والمنزل والرياضة والأناقة' },
  storyText: {
    en: 'We stock agent-backed hardware, genuine software licences and our own fashion cuts, then ship them with the same care.',
    ar: 'نوفّر الأجهزة بضمان الوكيل، والتراخيص الأصلية، وقصّات ديسينا الخاصة، ثم نشحنها بنفس العناية.',
  },
  storyCta: { en: 'Start browsing', ar: 'ابدأ التسوّق' },
  storyAuthentic: { en: 'Authentic, always', ar: 'أصالة دائمة' },
  statProducts: { en: 'Products in the catalogue', ar: 'منتج في الكتالوج' },
  statDepartments: { en: 'Departments', ar: 'قسم' },
  statRating: { en: 'Average rating', ar: 'متوسط التقييم' },
  newsletterKicker: { en: 'Stay in the loop', ar: 'ابقَ على اطلاع' },
  newsletterTitle: { en: 'New drops, first', ar: 'الجديد أولاً بأول' },
  newsletterText: {
    en: 'Leave your email and we will send new arrivals and subscriber-only offers. No spam.',
    ar: 'اترك بريدك لنرسل لك الإضافات الجديدة وعروض المشتركين فقط. بلا رسائل مزعجة.',
  },
  newsletterButton: { en: 'Subscribe', ar: 'اشترك' },
  newsletterPlaceholder: { en: 'your@email.com', ar: 'بريدك@الإلكتروني.com' },
  newsletterSuccess: { en: 'You are on the list. Welcome to DeSinaHub.', ar: 'تم تسجيلك في القائمة. أهلاً بك في ديسينا هب.' },
  newsletterHint: {
    en: 'No spam — just new arrivals and subscriber-only offers.',
    ar: 'بلا رسائل مزعجة — فقط الإضافات الجديدة وعروض المشتركين.',
  },
  servicesKicker: { en: 'DeSina services', ar: 'خدمات ديسينا' },
  outletExtra: { en: 'Extra markdowns, while stock lasts.', ar: 'تخفيضات إضافية حتى نفاد الكمية.' },
  outletText: {
    en: 'Last-season favourites at their lowest price of the season.',
    ar: 'مفضلات المواسم السابقة بأقل سعر لها هذا الموسم.',
  },
  outletCta: { en: 'Shop outlet', ar: 'تسوّق الأوت ليت' },
  reviewsKicker: { en: 'Verified feedback', ar: 'تقييمات موثقة' },
} satisfies Record<string, BrandCopy>;

export const PROMISES: { id: string; icon: 'truck' | 'shield' | 'badge' | 'headset'; title: BrandCopy; text: BrandCopy }[] = [
  {
    id: 'delivery',
    icon: 'truck',
    title: { en: 'Fast delivery', ar: 'توصيل سريع' },
    text: { en: 'Dispatch within 24h, delivery across Egypt in 2–4 business days.', ar: 'شحن خلال 24 ساعة وتوصيل خلال 2–4 أيام عمل.' },
  },
  {
    id: 'genuine',
    icon: 'shield',
    title: { en: 'Genuine only', ar: 'أصلي دائماً' },
    text: { en: 'Agent-backed hardware and licensed software, verified on every invoice.', ar: 'أجهزة بضمان الوكيل وبرمجيات مرخّقة، موثّقة في كل فاتورة.' },
  },
  {
    id: 'warranty',
    icon: 'badge',
    title: { en: 'Covered warranty', ar: 'ضمان معتمد' },
    text: { en: 'Local and international warranty handled directly by the DeSina desk.', ar: 'ضمان محلي ودولي يتابعه فريق ديسينا مباشرة.' },
  },
  {
    id: 'support',
    icon: 'headset',
    title: { en: 'Human support', ar: 'دعم بشري' },
    text: { en: 'WhatsApp and hotlines answered by the same team that packs your order.', ar: 'واتساب وخطوط ساخنة يرد عليها فريقك الذي جهّز طلبك.' },
  },
];
