import { dealProducts, searchProducts, discountPercent } from "@/data/products";
import { categories } from "@/data/categories";
import { formatPrice } from "@/lib/i18n";
import { normalizeText } from "@/lib/text";
import type { Lang } from "@/data/products";

type ChatContext = {
  cartCount: number;
  cartTotal: number;
  orderId?: string;
};

// Short Latin keywords are matched as whole words so "hi" cannot hit "shirt".
function has(message: string, words: string[]): boolean {
  return words.some((word) => {
    const needle = normalizeText(word);
    if (!needle) return false;
    if (/^[\x00-\x7F]+$/.test(needle) && needle.length <= 3) {
      return new RegExp(`(^|\\s)${needle.replace(/[.*+?^${}()|[\]\\-]/g, "\\$&")}(\\s|$)`).test(message);
    }
    return message.includes(needle);
  });
}

export function localChatReply(rawMessage: string, lang: Lang, context: ChatContext): string {
  const message = normalizeText(rawMessage);
  const ar = lang === "ar";
  const money = (value: number) => formatPrice(value, lang);

  if (!message) {
    return ar ? "كيف أساعدك اليوم؟" : "How can I help you today?";
  }

  if (has(message, ["hello", "hi ", "hey", "مرحبا", "أهلا", "اهلا", "السلام"])) {
    return ar
      ? "أهلاً بك في ديسينا هب. يمكنني مساعدتك في المنتجات والشحن والدفع والاسترجاع وتتبع الطلب. اسألني مباشرة."
      : "Welcome to DeSinaHub. I can help with products, shipping, payment, returns and order tracking. Ask away.";
  }

  if (has(message, ["offer", "discount", "sale", "deal", "خصم", "عرض", "عروض", "تخفيض"])) {
    const deals = dealProducts(4);
    if (!deals.length) {
      return ar
        ? "تابع صفحة العروض باستمرار — نضيف تخفيضات جديدة بشكل دوري: /offers"
        : "Keep an eye on the offers page — new markdowns land regularly: /offers";
    }
    const lines = deals
      .map(
        (product) =>
          `• ${product.name[lang]} — ${money(product.price)} (−${discountPercent(product)}%) — /product/${product.code}`,
      )
      .join("\n");
    return ar
      ? `أفضل عروض الأوت ليت حالياً:\n${lines}\nاطلبها من صفحة العروض: /offers`
      : `Current outlet highlights:\n${lines}\nBrowse them all at /offers`;
  }

  if (has(message, ["ship", "deliver", "delivery", "شحن", "توصيل", "الشحن"])) {
    return ar
      ? "نوصل لكل محافظات مصر. يتم تجهيز الطلبات خلال 24 ساعة في أيام العمل، ويستغرق التوصيل عادة من 2 إلى 5 أيام عمل. الشحن مجاني على كل الطلبات، وستجد حالة الطلب في صفحة طلباتي."
      : "We deliver to every governorate in Egypt. Orders are prepared within 24 hours on business days and delivery usually takes 2–5 working days. Shipping is free on every order, and you can follow progress from the orders page.";
  }

  if (has(message, ["return", "refund", "exchange", "استرجاع", "إرجاع", "ارجاع", "استبدال"])) {
    return ar
      ? "يمكنك إرجاع المنتجات المؤهلة خلال 14 يوماً من الاستلام بشرط أن تكون بحالتها الأصلية وبكامل ملحقاتها. راسلنا على واتساب برقم طلبك وسنرتب الاسترجاع. المنتجات الرقمية غير قابلة للاسترجاع بعد التفعيل."
      : "Eligible items can be returned within 14 days of delivery, in original condition with all accessories. Send us your order reference on WhatsApp and we will arrange the return. Digital products are non-returnable once activated.";
  }

  if (has(message, ["pay", "visa", "mastercard", "meeza", "paypal", "fawry", "wallet", "دفع", "فيزا", "ماستر", "باي بال", "فوري", "انستا"])) {
    return ar
      ? "نقبل فيزا وماستركارد وميزة وباي بال وفوري، بالإضافة إلى المحافظ الإلكترونية مثل فودافون كاش وإنستا باي، والتحويل البنكي. يتم إتمام الدفع على بوابة مزود الخدمة الآمنة، ولا نحتفظ ببيانات البطاقة."
      : "We accept Visa, Mastercard, Meeza, PayPal and Fawry, plus mobile wallets such as Vodafone Cash and InstaPay, and bank transfers. Payment is completed on the provider's secure gateway — we never store card details.";
  }

  if (has(message, ["track", "order", "status", "تتبع", "طلبي", "طلب", "أوردر"])) {
    const reference = context.orderId ? `\n${ar ? "رقم مرجعك" : "Your reference"}: ${context.orderId}` : "";
    return ar
      ? `يمكنك تتبع طلبك من صفحة طلباتي: /orders\nأدخل رقم الطلب الذي يبدأ بـ DS-HUB.${reference}\nحالة الطلبات الجديدة تكون «بانتظار الدفع» حتى تأكيد الدفع.`
      : `You can track your order at /orders\nEnter the reference that starts with DS-HUB.${reference}\nNew orders show as “Awaiting payment” until payment is confirmed.`;
  }

  if (has(message, ["cart", "basket", "سلة", "سلتي", "عربة"])) {
    if (!context.cartCount) {
      return ar
        ? "سلتك فارغة حالياً. تصفح الأقسام أو العروض وأضف ما يعجبك — ستبقى مختاراتك محفوظة في هذا المتصفح."
        : "Your cart is empty right now. Browse the departments or the offers and add something you like — your picks stay saved in this browser.";
    }
    return ar
      ? `لديك ${context.cartCount} قطعة في السلة بإجمالي ${money(context.cartTotal)}. راجع السلة ثم أكمل الدفع بأمان: /checkout`
      : `You have ${context.cartCount} item${context.cartCount === 1 ? "" : "s"} in the cart totalling ${money(context.cartTotal)}. Review the cart and check out securely: /checkout`;
  }

  if (has(message, ["categor", "department", "أقسام", "اقسام", "الأقسام"])) {
    const list = categories
      .map((category) => `• ${category.name[lang]} — /category/${category.slug}`)
      .join("\n");
    return ar ? `أقسامنا الرئيسية:\n${list}` : `Our departments:\n${list}`;
  }

  if (has(message, ["contact", "support", "human", "whatsapp", "phone", "تواصل", "دعم", "واتساب", "هاتف"])) {
    return ar
      ? "فريقنا متاح السبت – الخميس من 10:00 إلى 20:00 بتوقيت مصر.\nواتساب: wa.me/201105535538\nاتصال: +20 1001283311\nبريد: info@desinahub.com"
      : "Our team is here Saturday–Thursday, 10:00–20:00 EET.\nWhatsApp: wa.me/201105535538\nCall: +20 1001283311\nEmail: info@desinahub.com";
  }

  if (has(message, ["industrial", "tourism", "corporate", "hotel", "سياح", "صناع", "فندق", "شركات"])) {
    return ar
      ? "لدينا مكتب للخدمات الصناعية (توريد الشركات والهدايا بعلامتك التجارية والتغليف) ومكتب للخدمات السياحية (حجوزات الفنادق والتنقلات والتجارب). راسلنا على واتساب لترتيب التفاصيل."
      : "We run an industrial desk (corporate sourcing, branded merchandise and packaging) and a tourism desk (hotel bookings, transfers and curated experiences). Message us on WhatsApp to plan the details.";
  }

  if (message.length >= 3) {
    const matches = searchProducts(message).slice(0, 3);
    if (matches.length) {
      const list = matches
        .map(
          (product) =>
            `• ${product.name[lang]} — ${money(product.price)}${product.oldPrice ? ` (${ar ? "بدلاً من" : "was"} ${money(product.oldPrice)})` : ""} — /product/${product.code}`,
        )
        .join("\n");
      return ar
        ? `وجدت هذه المنتجات:\n${list}\nافتح رابط المنتج لإضافته إلى السلة.`
        : `I found these products:\n${list}\nOpen a product link to add it to the cart.`;
    }
  }

  return ar
    ? "يمكنني مساعدتك في: المنتجات والعروض، الشحن، الاسترجاع، وسائل الدفع، تتبع الطلب، الأقسام، أو التواصل مع الفريق. اكتب سؤالك بكلمات بسيطة."
    : "I can help with products and offers, shipping, returns, payment methods, order tracking, departments, or contacting the team. Ask in a few simple words.";
}
