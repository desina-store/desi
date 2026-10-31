import type { LocalizedText } from "./products";

export type HeroSlide = {
  id: string;
  image: string;
  href: string;
  kicker: LocalizedText;
  title: LocalizedText;
  price: number;
  oldPrice?: number;
  badge: LocalizedText;
  focus?: string;
};

export const heroSlides: HeroSlide[] = [
  {
    id: "fashion",
    image: "/products/hero.jpg",
    href: "/category/fashion",
    kicker: { en: "Fashion · New season", ar: "أزياء · موسم جديد" },
    title: { en: "The new season has landed.", ar: "الموسم الجديد وصل." },
    price: 1000,
    badge: { en: "NEW", ar: "جديد" },
    focus: "center 26%",
  },
  {
    id: "software",
    image: "/products/p11.webp",
    href: "/category/computers",
    kicker: { en: "Software & AI", ar: "برامج وذكاء اصطناعي" },
    title: {
      en: "Genuine software. Delivered instantly.",
      ar: "برامج أصلية. تُسلَّم فوراً.",
    },
    price: 1000,
    badge: { en: "DIGITAL", ar: "رقمي" },
    focus: "center 40%",
  },
  {
    id: "sports",
    image: "/products/p7.webp",
    href: "/category/sports",
    kicker: { en: "Sports wear", ar: "ملابس رياضية" },
    title: { en: "Built for every session.", ar: "مصمّم لكل حصة." },
    price: 1000,
    badge: { en: "NEW", ar: "جديد" },
    focus: "center 42%",
  },
  {
    id: "outlet",
    image: "/products/p12.webp",
    href: "/product/10",
    kicker: { en: "Outlet & clearance", ar: "أوت ليت وتصفيات" },
    title: {
      en: "Outlet prices. Zero compromises.",
      ar: "أسعار أوت ليت. بلا تنازلات.",
    },
    price: 1000,
    oldPrice: 1500,
    badge: { en: "-33%", ar: "-33%" },
    focus: "center 50%",
  },
];

export type EditorialCard = {
  id: string;
  image: string;
  href: string;
  kicker: LocalizedText;
  title: LocalizedText;
  text: LocalizedText;
  cta: LocalizedText;
  light?: boolean;
};

export const editorialCards: EditorialCard[] = [
  {
    id: "fashion",
    image: "/products/p3.webp",
    href: "/category/fashion",
    kicker: { en: "The fashion store", ar: "متجر الأزياء" },
    title: { en: "Everyday fashion, elevated", ar: "أزياء يومية بمستوى أرقى" },
    text: {
      en: "Comfort-first pieces and statement basics, chosen for the way you actually live.",
      ar: "قطع مريحة وأساسيات مميزة، مختارة لتناسب حياتك اليومية.",
    },
    cta: { en: "Shop fashion", ar: "تسوّق الأزياء" },
    light: true,
  },
  {
    id: "tech",
    image: "/products/p14.webp",
    href: "/category/computers",
    kicker: { en: "Computers & software", ar: "كمبيوتر وبرامج" },
    title: { en: "Level up your setup", ar: "ارتقِ بتجهيزاتك" },
    text: {
      en: "From flagship phones to genuine software keys — the upgrade you have been waiting for.",
      ar: "من الهواتف الرائدة إلى مفاتيح البرامج الأصلية — الترقية التي تنتظرها.",
    },
    cta: { en: "Shop computers", ar: "تسوّق الكمبيوتر" },
  },
];

export type PromiseItem = {
  id: string;
  icon: "truck" | "shield" | "returns" | "headset";
  titleKey: string;
  textKey: string;
};

export const promises: PromiseItem[] = [
  { id: "shipping", icon: "truck", titleKey: "home.promise.shipping.title", textKey: "home.promise.shipping.text" },
  { id: "secure", icon: "shield", titleKey: "home.promise.secure.title", textKey: "home.promise.secure.text" },
  { id: "returns", icon: "returns", titleKey: "home.promise.returns.title", textKey: "home.promise.returns.text" },
  { id: "support", icon: "headset", titleKey: "home.promise.support.title", textKey: "home.promise.support.text" },
];

export const storyContent = {
  images: {
    main: "/products/hero.jpg",
    small: "/products/p13.webp",
  },
  stats: [
    { value: "27", labelKey: "home.story.stat1" },
    { value: "12+", labelKey: "home.story.stat2" },
    { value: "7d", labelKey: "home.story.stat3" },
  ],
};
