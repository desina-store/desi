import type { LocalizedText } from "./products";

export type FaqItem = {
  question: LocalizedText;
  answer: LocalizedText;
};

export const faqs: FaqItem[] = [
  {
    question: { en: "How long does delivery take?", ar: "كم يستغرق التوصيل؟" },
    answer: {
      en: "Orders are usually dispatched within 24 business hours. Cairo and Giza typically arrive in 1–3 business days, other governorates in 2–5. You will receive the order reference beginning with DS to follow up.",
      ar: "عادة يتم شحن الطلبات خلال 24 ساعة عمل. القاهرة والجيزة غالباً من 1–3 أيام عمل، وباقي المحافظات من 2–5 أيام. ستستلم رقم طلب يبدأ بـ DS للمتابعة.",
    },
  },
  {
    question: { en: "Which payment methods do you accept?", ar: "ما وسائل الدفع المتاحة؟" },
    answer: {
      en: "Visa, Mastercard, Meeza, PayPal, Fawry, InstaPay, mobile wallets and direct bank transfers. Card data is entered on the payment provider's secure gateway, never stored by DeSinaHub.",
      ar: "فيزا وماستركارد وميزة وباي بال وفوري وإنستا باي والمحافظ الإلكترونية والتحويلات البنكية المباشرة. تُدخل بيانات البطاقة على بوابة المزوّد الآمنة ولا تحفظها ديسينا هب.",
    },
  },
  {
    question: { en: "Can I return or exchange an item?", ar: "هل يمكنني الإرجاع أو الاستبدال؟" },
    answer: {
      en: "Eligible items can be returned within 14 days of delivery in original, unused condition with all packaging. Personal use items, activated software and final-sale clearance pieces are excluded.",
      ar: "يمكن إرجاع المنتجات المؤهلة خلال 14 يوماً من الاستلام بحالتها الأصلية غير المستخدمة وبكل التغليف. تُستثنى مستلزمات الاستخدام الشخصي والبرامج المفعّلة وقطع التصفيات النهائية.",
    },
  },
  {
    question: { en: "Are the products genuine and under warranty?", ar: "هل المنتجات أصلية وبضمان؟" },
    answer: {
      en: "Yes. We source through authorised channels. Warranty length and coverage are shown on each product page and on your invoice; keep the invoice for any claim.",
      ar: "نعم. نوفر المنتجات من قنوات معتمدة. مدة الضمان وتغطيته موضحان في صفحة كل منتج وعلى فاتورتك؛ احفظ الفاتورة لأي مطالبة.",
    },
  },
  {
    question: { en: "How do I track my order?", ar: "كيف أتتبع طلبي؟" },
    answer: {
      en: "Use the Orders & tracking page in the footer or account menu and enter your DS order reference. For cross-device orders, message support on WhatsApp with the same reference.",
      ar: "استخدم صفحة الطلبات والتتبع في الفوتر أو قائمة الحساب وأدخل رقم طلبك الذي يبدأ بـ DS. لطلبات جهاز آخر، راسل الدعم على واتساب بنفس الرقم.",
    },
  },
  {
    question: { en: "Do you charge for delivery?", ar: "هل هناك رسوم توصيل؟" },
    answer: {
      en: "Delivery is free on all orders placed through desinahub.com. Any exceptional furniture or heavy-item delivery will be quoted and confirmed before dispatch.",
      ar: "التوصيل مجاني على كل الطلبات عبر desinahub.com. أي توصيل استثنائي للأثاث أو القطع الثقيلة يتم تسعيره وتأكيده قبل الشحن.",
    },
  },
  {
    question: { en: "Is my payment secure?", ar: "هل الدفع آمن؟" },
    answer: {
      en: "Every payment is completed on the chosen provider's gateway over an encrypted connection. DeSinaHub receives confirmation through verified webhooks and never stores card credentials.",
      ar: "يتم كل دفع على بوابة المزوّد المختار عبر اتصال مشفر. تستلم ديسينا هب التأكيد عبر ويب هوك موثّق ولا تحفظ بيانات البطاقات.",
    },
  },
  {
    question: { en: "Can I order for a business?", ar: "هل يمكنني الطلب لشركة؟" },
    answer: {
      en: "Yes. Our industrial desk handles bulk technology, branded merchandise, packaging and procurement. Contact sales@desinahub.com with quantities and timelines.",
      ar: "نعم. يخدم مكتب الخدمات الصناعية التوريد بالجملة والهدايا بعلامتك والتغليف والمشتريات. راسل sales@desinahub.com بالكميات والمواعيد.",
    },
  },
];
