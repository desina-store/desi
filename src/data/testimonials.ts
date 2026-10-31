import type { LocalizedText } from "./products";

export type Testimonial = {
  name: string;
  city: LocalizedText;
  rating: number;
  title: LocalizedText;
  text: LocalizedText;
  product: LocalizedText;
};

export const testimonials: Testimonial[] = [
  {
    name: "Nour A.",
    city: { en: "New Cairo", ar: "القاهرة الجديدة" },
    rating: 5,
    title: { en: "Arrived faster than expected", ar: "وصل أسرع من المتوقع" },
    text: {
      en: "Ordered the iPhone on a Tuesday and it was with me the next day. The invoice matched the cart exactly and the WhatsApp updates were genuinely helpful.",
      ar: "طلبت الآيفون يوم الثلاثاء ووصلني في اليوم التالي. الفاتورة مطابقة للسلة تماماً وتحديثات واتساب كانت مفيدة فعلاً.",
    },
    product: { en: "iPhone 16 Pro Max", ar: "آيفون 16 برو ماكس" },
  },
  {
    name: "Karim S.",
    city: { en: "Alexandria", ar: "الإسكندرية" },
    rating: 5,
    title: { en: "Outlet find, zero compromises", ar: "صفقة أوت ليت بلا تنازلات" },
    text: {
      en: "The LG television was discounted but still sealed and covered by the warranty. Exactly the kind of outlet deal you hope to find.",
      ar: "شاشة LG كانت مخفضة لكنها مغلقة وبالضمان. بالضبط نوع صفقات الأوت ليت التي تتمنى إيجادها.",
    },
    product: { en: "LG Smart TV 50\"", ar: "شاشة إل جي 50 بوصة" },
  },
  {
    name: "Mariam H.",
    city: { en: "Giza", ar: "الجيزة" },
    rating: 4,
    title: { en: "Clean, quick checkout", ar: "إتمام شراء سريع وواضح" },
    text: {
      en: "Paying with a wallet worked first time and the order reference made follow-up simple. The sports set fits exactly as described.",
      ar: "الدفع بالمحفظة نجح من أول مرة ورقم الطلب سهّل المتابعة. الطقم الرياضي مقاسه مطابق للوصف.",
    },
    product: { en: "Pro Compression Gym T-Shirt", ar: "تيشيرت ضغط رياضي" },
  },
  {
    name: "Omar T.",
    city: { en: "Mansoura", ar: "المنصورة" },
    rating: 5,
    title: { en: "A real person answered", ar: "شخص حقيقي رد عليّ" },
    text: {
      en: "I had a question about a software licence before ordering. Support answered on WhatsApp within minutes and the key was delivered instantly.",
      ar: "كان لدي سؤال عن ترخيص برنامج قبل الشراء. رد الدعم على واتساب في دقائق ووصل المفتاح فوراً.",
    },
    product: { en: "Windows 11 Pro", ar: "ويندوز 11 برو" },
  },
  {
    name: "Laila M.",
    city: { en: "Sheikh Zayed", ar: "الشيخ زايد" },
    rating: 5,
    title: { en: "Packed beautifully", ar: "تغليف أنيق" },
    text: {
      en: "The jacket arrived wrapped properly, with a return slip inside. It felt considered — not like a marketplace parcel.",
      ar: "الجاكيت وصل مغلفاً بعناية ومع بوليسة إرجاع. شعرت أن التفاصيل مدروسة، وليس مجرد شحنة ماركت بليس.",
    },
    product: { en: "DeSina Urban Jacket", ar: "جاكيت ديسينا" },
  },
];
