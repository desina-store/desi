export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://www.desinahub.com";

export const STORE = {
  name: "DeSinaHub",
  legalName: "DeSinaHub",
  email: "info@desinahub.com",
  salesEmail: "sales@desinahub.com",
  phones: ["+20 1001283311", "+20 1105535538"],
  whatsapp: "201105535538",
  address: "Cairo, Egypt",
  mapUrl:
    "https://www.google.com/maps/place/desinahub/@30.050746,31.2039679,17z/data=!3m1!4b1!4m6!3m5!1s0x1458410060217473:0xa799a6d41e740766!8m2!3d30.0507414!4d31.201393!16s%2Fg%2F11xkx028t0?entry=ttu",
  officialSite: "https://www.desinahub.com",
};

export const SOCIAL_LINKS = {
  facebook: "https://www.facebook.com/desinahub",
  instagram: "https://www.instagram.com/desinahub/",
  tiktok: "https://tiktok.com/@desinahub",
  youtube: "https://www.youtube.com/@desinahub",
  whatsapp: `https://wa.me/${STORE.whatsapp}`,
};

export const PIXEL_IDS = {
  ga: "G-SSVGRC4H86",
  meta: "790032697153678",
  tiktok: "D98CCTRC77UEFAL2JAJG",
};

export type PaymentMethodId =
  | "vodafone"
  | "etisalat"
  | "orange"
  | "instapay"
  | "bank_1"
  | "bank_2"
  | "bank_3"
  | "bank_4"
  | "visa"
  | "mastercard"
  | "paypal"
  | "applepay";

export const GATEWAY_LINKS: Record<PaymentMethodId, string> = {
  vodafone: "https://paymob.com",
  etisalat: "https://paymob.com",
  orange: "https://paymob.com",
  instapay: "https://www.instapay.eg",
  bank_1: "https://example.com/test/bank-1",
  bank_2: "https://example.com/test/bank-2",
  bank_3: "https://example.com/test/bank-3",
  bank_4: "https://example.com/test/bank-4",
  visa: "https://stripe.com",
  mastercard: "https://stripe.com",
  paypal: "https://paypal.com",
  applepay: "https://apple.com",
};

export const PAYMENT_METHODS: {
  id: PaymentMethodId;
  label: { en: string; ar: string };
  group: "wallets" | "banks" | "cards";
  logo?: string;
}[] = [
  { id: "visa", label: { en: "Visa", ar: "فيزا" }, group: "cards", logo: "/payments/visa.webp" },
  {
    id: "mastercard",
    label: { en: "Mastercard", ar: "ماستركارد" },
    group: "cards",
    logo: "/payments/mastercard.webp",
  },
  { id: "paypal", label: { en: "PayPal", ar: "باي بال" }, group: "cards", logo: "/payments/paypal.webp" },
  {
    id: "applepay",
    label: { en: "Apple Pay", ar: "آبل باي" },
    group: "cards",
    logo: "/payments/applepay.webp",
  },
  { id: "vodafone", label: { en: "Vodafone Cash", ar: "فودافون كاش" }, group: "wallets" },
  { id: "etisalat", label: { en: "Etisalat Cash", ar: "اتصالات كاش" }, group: "wallets" },
  { id: "orange", label: { en: "Orange Cash", ar: "أورنج كاش" }, group: "wallets" },
  {
    id: "instapay",
    label: { en: "InstaPay", ar: "إنستا باي" },
    group: "wallets",
    logo: "/payments/instapay.webp",
  },
  { id: "bank_1", label: { en: "QNB transfer", ar: "تحويل QNB" }, group: "banks", logo: "/payments/qnb.webp" },
  {
    id: "bank_2",
    label: { en: "Mashreq transfer", ar: "تحويل المشرق" },
    group: "banks",
    logo: "/payments/mashreq.webp",
  },
  { id: "bank_3", label: { en: "Bank transfer", ar: "تحويل بنكي" }, group: "banks" },
  {
    id: "bank_4",
    label: { en: "Banque Misr transfer", ar: "تحويل بنك مصر" },
    group: "banks",
    logo: "/payments/bmp-logo1.webp",
  },
];

export const DIRECT_PAYMENT_BADGES = [
  { id: "visa", label: "Visa", logo: "/payments/visa.webp" },
  { id: "mastercard", label: "Mastercard", logo: "/payments/mastercard.webp" },
  { id: "meeza", label: "Meeza", logo: "/payments/meeza.svg" },
  { id: "paypal", label: "PayPal", logo: "/payments/paypal.webp" },
  { id: "fawry", label: "Fawry", logo: "/payments/fawry.svg" },
];

export function buildGatewayUrl(
  method: PaymentMethodId,
  orderId: string,
  amount: number,
  currency = "EGP",
): string | null {
  const base = GATEWAY_LINKS[method];
  if (!base) return null;
  try {
    const url = new URL(base);
    url.searchParams.set("order_id", orderId);
    url.searchParams.set("amount", String(amount));
    url.searchParams.set("currency", currency);
    url.searchParams.set("payment_method", method);
    return url.toString();
  } catch {
    const separator = base.includes("?") ? "&" : "?";
    return `${base}${separator}order_id=${encodeURIComponent(orderId)}&amount=${encodeURIComponent(
      amount,
    )}&currency=${encodeURIComponent(currency)}&payment_method=${encodeURIComponent(method)}`;
  }
}

export function paymentMethodLabel(id: string, lang: "en" | "ar"): string {
  const method = PAYMENT_METHODS.find((item) => item.id === id);
  return method ? method.label[lang] : id;
}
