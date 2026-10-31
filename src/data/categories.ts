import type { LocalizedText } from "./products";

export type CategorySlug =
  | "mobiles"
  | "computers"
  | "appliances"
  | "outlet"
  | "sports"
  | "fashion"
  | "industrial"
  | "tourism";

export type CategoryDefinition = {
  slug: CategorySlug;
  name: LocalizedText;
  shortName: LocalizedText;
  tagline: LocalizedText;
  description: LocalizedText;
  image: string;
  tone: string;
  sourceCategories: string[];
  kind: "products" | "service";
  icon:
    | "smartphone"
    | "laptop"
    | "appliance"
    | "tag"
    | "dumbbell"
    | "shirt"
    | "factory"
    | "plane";
};

export const categories: CategoryDefinition[] = [
  {
    slug: "mobiles",
    name: { en: "Mobiles & Electronics", ar: "موبايلات وإلكترونيات" },
    shortName: { en: "Mobiles", ar: "موبايلات" },
    tagline: {
      en: "Flagship phones, audio and everyday tech.",
      ar: "هواتف رائدة وصوتيات وتقنية يومية.",
    },
    description: {
      en: "The latest smartphones, wireless audio and smart devices — sourced from authorised channels and ready to ship.",
      ar: "أحدث الهواتف والسماعات اللاسلكية والأجهزة الذكية — من قنوات معتمدة وجاهزة للشحن.",
    },
    image: "/products/iphone.webp",
    tone: "#F7EFE2",
    sourceCategories: ["Mobiles"],
    kind: "products",
    icon: "smartphone",
  },
  {
    slug: "computers",
    name: { en: "Computers & Accessories", ar: "كمبيوتر وإكسسوارات" },
    shortName: { en: "Computers", ar: "كمبيوتر" },
    tagline: {
      en: "Hardware, software and genuine licences.",
      ar: "هاردوير وبرامج وتراخيص أصلية.",
    },
    description: {
      en: "Laptops, accessories and genuine software licences for work, study and everything in between.",
      ar: "لابتوبات وإكسسوارات وتراخيص برامج أصلية للعمل والدراسة وكل ما بينهما.",
    },
    image: "/products/p14.webp",
    tone: "#F3ECE3",
    sourceCategories: ["Computers", "OS"],
    kind: "products",
    icon: "laptop",
  },
  {
    slug: "appliances",
    name: { en: "Home Appliances", ar: "أجهزة منزلية" },
    shortName: { en: "Appliances", ar: "أجهزة منزلية" },
    tagline: {
      en: "Screens and essentials for a smarter home.",
      ar: "شاشات ومستلزمات لمنزل أذكى.",
    },
    description: {
      en: "Smart televisions and home essentials chosen for quality, longevity and everyday comfort.",
      ar: "تلفزيونات ذكية ومستلزمات منزلية مختارة للجودة والعمر الطويل والراحة اليومية.",
    },
    image: "/products/samsung_tv.webp",
    tone: "#F8F0E6",
    sourceCategories: ["Appliances"],
    kind: "products",
    icon: "appliance",
  },
  {
    slug: "outlet",
    name: { en: "Outlet & Clearance", ar: "أوت ليت وتصفيات" },
    shortName: { en: "Outlet %", ar: "أوت ليت %" },
    tagline: {
      en: "Genuine markdowns on last-season finds.",
      ar: "تخفيضات حقيقية على قطع المواسم السابقة.",
    },
    description: {
      en: "Limited stock, real reductions. Discover end-of-line pieces before they disappear.",
      ar: "كميات محدودة وتخفيضات حقيقية. اكتشف قطع آخر الموسم قبل نفادها.",
    },
    image: "/products/lg_outlet.webp",
    tone: "#FFF1E7",
    sourceCategories: ["Outlet"],
    kind: "products",
    icon: "tag",
  },
  {
    slug: "sports",
    name: { en: "Sports Wear", ar: "ملابس رياضية" },
    shortName: { en: "Sports", ar: "رياضة" },
    tagline: {
      en: "Performance pieces for every session.",
      ar: "قطع أداء لكل حصة تدريب.",
    },
    description: {
      en: "Breathable fabrics and considered fits built for training, movement and daily wear.",
      ar: "أقمشة مسامية وقصّات مدروسة مصممة للتدريب والحركة والاستخدام اليومي.",
    },
    image: "/products/p6.webp",
    tone: "#F6EDE2",
    sourceCategories: ["Sports"],
    kind: "products",
    icon: "dumbbell",
  },
  {
    slug: "fashion",
    name: { en: "Fashion Store", ar: "متجر الأزياء" },
    shortName: { en: "Fashion", ar: "أزياء" },
    tagline: {
      en: "Elevated everyday pieces.",
      ar: "قطع يومية بمستوى أرقى.",
    },
    description: {
      en: "Soft tailoring, easy layers and statement essentials for a wardrobe that works harder.",
      ar: "قصّات مريحة وطبقات سهلة وأساسيات مميزة لخزانة تعمل لصالحك.",
    },
    image: "/products/p4.webp",
    tone: "#F8EEEA",
    sourceCategories: ["Fashion"],
    kind: "products",
    icon: "shirt",
  },
  {
    slug: "industrial",
    name: { en: "Industrial Services", ar: "خدمات صناعية" },
    shortName: { en: "Industrial", ar: "صناعي" },
    tagline: {
      en: "Sourcing, branding and business supply.",
      ar: "توريد وهوية بصرية وتوريد أعمال.",
    },
    description: {
      en: "B2B sourcing, packaging and branded merchandise delivered with DeSinaHub's standards.",
      ar: "توريد للشركات وتغليف وهدايا بعلامتك التجارية بمعايير ديسينا هب.",
    },
    image: "/products/p13.webp",
    tone: "#F1EADF",
    sourceCategories: [],
    kind: "service",
    icon: "factory",
  },
  {
    slug: "tourism",
    name: { en: "Tourism Services", ar: "خدمات سياحية" },
    shortName: { en: "Tourism", ar: "سياحة" },
    tagline: {
      en: "Concierge travel planning, made simple.",
      ar: "تخطيط رحلات بخدمة كونسيرج مبسطة.",
    },
    description: {
      en: "Curated stays, transfers and experiences across Egypt, arranged around your schedule.",
      ar: "إقامات مختارة وتنقلات وتجارب في كل أنحاء مصر، مرتبة حول جدولك.",
    },
    image: "/products/p9.webp",
    tone: "#F5EEE3",
    sourceCategories: [],
    kind: "service",
    icon: "plane",
  },
];

export const productCategories = categories.filter((category) => category.kind === "products");
export const mainCategories = categories;

export function getCategory(slug: string): CategoryDefinition | undefined {
  return categories.find((category) => category.slug === slug);
}

export const categoryLabels: Record<string, LocalizedText> = {
  Mobiles: { en: "Mobiles & Electronics", ar: "موبايلات وإلكترونيات" },
  Computers: { en: "Computers & Accessories", ar: "كمبيوتر وإكسسوارات" },
  OS: { en: "Software & Digital", ar: "برامج ورقميات" },
  Appliances: { en: "Home Appliances", ar: "أجهزة منزلية" },
  Outlet: { en: "Outlet", ar: "أوت ليت" },
  Sports: { en: "Sports Wear", ar: "ملابس رياضية" },
  Fashion: { en: "Fashion", ar: "أزياء" },
};

export const serviceOfferings: Record<
  "industrial" | "tourism",
  { title: LocalizedText; text: LocalizedText }[]
> = {
  industrial: [
    {
      title: { en: "Corporate sourcing", ar: "توريد للشركات" },
      text: {
        en: "Bulk technology, branded equipment and office essentials with clear B2B pricing.",
        ar: "تقنية بالجملة وأجهزة تحمل علامتك ومستلزمات مكتبية بأسعار أعمال واضحة.",
      },
    },
    {
      title: { en: "Branded merchandise", ar: "هدايا بعلامتك" },
      text: {
        en: "On-brand kits, print and packaging for launches, teams and client gifting.",
        ar: "حقائب وهوية وطباعة وتغليف للإطلاقات والفرق وهدايا العملاء.",
      },
    },
    {
      title: { en: "Packaging & fulfilment", ar: "تغليف وتنفيذ" },
      text: {
        en: "Presentation-ready packaging with organised delivery schedules.",
        ar: "تغليف جاهز للعرض مع جداول توصيل منظمة.",
      },
    },
    {
      title: { en: "Procurement support", ar: "دعم المشتريات" },
      text: {
        en: "A single point of contact to compare, order and follow up on supplies.",
        ar: "نقطة تواصل واحدة للمقارنة والطلب ومتابعة التوريدات.",
      },
    },
  ],
  tourism: [
    {
      title: { en: "Hotel reservations", ar: "حجوزات فنادق" },
      text: {
        en: "Selected stays in Cairo, the Red Sea and beyond, matched to your budget.",
        ar: "إقامات مختارة في القاهرة والبحر الأحمر وغيرها، تناسب ميزانيتك.",
      },
    },
    {
      title: { en: "Airport transfers", ar: "تنقلات المطار" },
      text: {
        en: "Private, punctual transfers with confirmed drivers and clean vehicles.",
        ar: "تنقلات خاصة دقيقة مع سائقين مؤكدين وسيارات نظيفة.",
      },
    },
    {
      title: { en: "Curated experiences", ar: "تجارب مختارة" },
      text: {
        en: "Guided days, dining and excursions arranged around your interests.",
        ar: "أيام مرشدة وتجارب طعام ورحلات مرتبة حول اهتماماتك.",
      },
    },
    {
      title: { en: "Trip concierge", ar: "كونسيرج الرحلة" },
      text: {
        en: "One WhatsApp thread for changes, questions and on-the-ground support.",
        ar: "محادثة واتساب واحدة للتغييرات والأسئلة والدعم على الأرض.",
      },
    },
  ],
};

/* Ported from the development reference: the service desk process, in official wording. */
export const serviceProcess: Record<
  "industrial" | "tourism",
  { title: LocalizedText; text: LocalizedText }[]
> = {
  industrial: [
    {
      title: { en: "Share your requirement", ar: "شاركنا احتياجك" },
      text: {
        en: "Send the equipment or service scope, quantities and site details on WhatsApp or email.",
        ar: "أرسل مواصفات المعدات أو نطاق الخدمة والكميات وتفاصيل الموقع عبر واتساب أو البريد.",
      },
    },
    {
      title: { en: "Receive a formal quotation", ar: "استلم عرض سعر رسمي" },
      text: {
        en: "Our desk confirms availability, lead time and pricing in one written quotation.",
        ar: "يؤكد مكتبنا التوفر ومدة التوريد والسعر في عرض سعر مكتوب واحد.",
      },
    },
    {
      title: { en: "Approve and schedule", ar: "الاعتماد والجدولة" },
      text: {
        en: "We coordinate supply, branding or maintenance around your operating schedule.",
        ar: "ننسق التوريد أو الهوية أو الصيانة بما يناسب جدول تشغيلك.",
      },
    },
  ],
  tourism: [
    {
      title: { en: "Tell us the trip", ar: "احكِ لنا عن الرحلة" },
      text: {
        en: "Share the destination, dates, group size and budget with the travel desk.",
        ar: "أرسل للوجهة والتواريخ وعدد الأفراد والميزانية إلى مكتب السفر.",
      },
    },
    {
      title: { en: "Get a tailored programme", ar: "استلم برنامجًا مخصصًا" },
      text: {
        en: "We prepare accommodation, transfers and activities as one clear itinerary.",
        ar: "نجهز الإقامة والتنقلات والأنشطة في برنامج واحد واضح.",
      },
    },
    {
      title: { en: "Confirm and travel", ar: "أكّد وسافر" },
      text: {
        en: "Approve the plan and our team handles bookings and support during the trip.",
        ar: "اعتمد الخطة وفريقنا يتولى الحجوزات والدعم طوال الرحلة.",
      },
    },
  ],
};

export function getOtherServiceSlug(slug: string): "industrial" | "tourism" | null {
  if (slug === "industrial") return "tourism";
  if (slug === "tourism") return "industrial";
  return null;
}
