import type { Lang } from './site';
import { CATEGORY_BY_SLUG, HOTLINES, WHATSAPP, type CategorySlug } from './site';
import { dealsProducts, getProduct, parseProductCode, products, productsForCategory, type Product } from './products';

export type AssistantLink = { href: string; label: string };
export type AssistantAnswer = { text: string; links: AssistantLink[] };

function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/[\u064B-\u0652\u0670]/g, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/[^\p{L}\p{N}\s-]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function price(product: Product, lang: Lang): string {
  return lang === 'ar' ? `${product.price} ج.م` : `${product.price} EGP`;
}

function productLine(product: Product, lang: Lang): string {
  return `CODE-${product.code} · ${product.name[lang]} · ${price(product, lang)}`;
}

function productLinks(items: Product[], lang: Lang): AssistantLink[] {
  return items.slice(0, 3).map((product) => ({
    href: `/product/${product.code}`,
    label: lang === 'ar' ? `عرض CODE-${product.code}` : `View CODE-${product.code}`,
  }));
}

function link(href: string, label: string): AssistantLink {
  return { href, label };
}

const STOP_WORDS = new Set(['من', 'في', 'على', 'عن', 'الى', 'الي', 'عايز', 'عاوز', 'محتاج', 'هل', 'هو', 'هي', 'the', 'a', 'an', 'i', 'want', 'need', 'for', 'to', 'is', 'are', 'do', 'you', 'have']);

function matchProducts(query: string): Product[] {
  const tokens = normalize(query)
    .split(' ')
    .filter((token) => token.length > 1 && !STOP_WORDS.has(token));
  if (tokens.length === 0) return [];
  const scored = products
    .map((product) => {
      const haystack = normalize(`${product.name.ar} ${product.name.en} ${product.category} code-${product.code}`);
      let score = 0;
      for (const token of tokens) {
        if (haystack.includes(token)) score += token.length >= 4 ? 2 : 1;
      }
      return { product, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score);

  const seen = new Set<string>();
  const result: Product[] = [];
  for (const entry of scored) {
    if (seen.has(entry.product.name.en)) continue;
    seen.add(entry.product.name.en);
    result.push(entry.product);
    if (result.length === 5) break;
  }
  return result;
}

const CATEGORY_HINTS: { terms: string[]; slug: CategorySlug }[] = [
  { terms: ['موبايل', 'هاتف', 'تليفون', 'ايفون', 'سماعه', 'سماعات', 'mobile', 'phone', 'iphone', 'airpods', 'headphone'], slug: 'mobiles' },
  { terms: ['كمبيوتر', 'لابتوب', 'برنامج', 'ويندوز', 'اوفيس', 'انتي فيرس', 'computer', 'laptop', 'software', 'windows', 'office', 'antivirus', 'chatgpt', 'gemini'], slug: 'computers' },
  { terms: ['شاشه', 'تلفزيون', 'اجهزه', 'منزلي', 'غساله', 'appliance', 'tv', 'screen', 'samsung'], slug: 'appliances' },
  { terms: ['رياضه', 'جيم', 'شورت', 'تيشيرت', 'sport', 'gym', 'shorts'], slug: 'sports' },
  { terms: ['ملابس', 'جاكيت', 'ازياء', 'موضه', 'fashion', 'jacket', 'clothes'], slug: 'fashion' },
  { terms: ['اوتفيت', 'تصفيات', 'خصم', 'outlet', 'clearance'], slug: 'outlet' },
  { terms: ['صناعي', 'مصانع', 'industrial'], slug: 'industrial' },
  { terms: ['سياحه', 'رحله', 'فندق', 'tourism', 'travel', 'hotel'], slug: 'tourism' },
];

export function answerLocally(message: string, lang: Lang): AssistantAnswer {
  const text = normalize(message);
  const ar = lang === 'ar';

  const explicitCode = text.match(/(?:code|كود)\s*[-#]?\s*(\d{1,3})/);
  const bareCode = /^\d{1,3}$/.test(text) ? text : null;
  const numeric = parseProductCode(explicitCode?.[1] ?? bareCode);
  if (numeric) {
    const product = getProduct(numeric);
    if (product) {
      const specs: string[] = [];
      if (product.info.brand) specs.push(`${ar ? 'الماركة' : 'Brand'}: ${product.info.brand[lang]}`);
      if (product.info.spec) specs.push(`${ar ? 'المواصفات' : 'Specs'}: ${product.info.spec[lang]}`);
      if (product.info.warranty) specs.push(`${ar ? 'الضمان' : 'Warranty'}: ${product.info.warranty[lang]}`);
      if (product.info.fabric) specs.push(`${ar ? 'الخامة' : 'Fabric'}: ${product.info.fabric[lang]}`);
      if (product.info.sizes) specs.push(`${ar ? 'المقاسات' : 'Sizes'}: ${product.info.sizes[lang]}`);
      return {
        text: `${productLine(product, lang)}${specs.length ? `\n${specs.join('\n')}` : ''}${
          product.oldPrice ? `\n${ar ? 'السعر قبل الخصم' : 'Was'}: ${product.oldPrice} ${ar ? 'ج.م' : 'EGP'}` : ''
        }`,
        links: [link(`/product/${product.code}`, ar ? 'افتح صفحة المنتج' : 'Open product page')],
      };
    }
    return {
      text: ar
        ? `لم أجد منتجاً بالكود CODE-${numeric}. جرّب كوداً آخر أو اكتب اسم المنتج.`
        : `I couldn't find CODE-${numeric}. Try another code or type the product name.`,
      links: [link('/#sections', ar ? 'تصفح كل الأقسام' : 'Browse all sections')],
    };
  }

  if (/(شحن|توصيل|شحنه|متى يوصل|shipping|delivery|deliver|arrive)/.test(text)) {
    return {
      text: ar
        ? 'التوصيل يتم خلال 2 إلى 4 أيام عمل كحد أقصى لكل محافظات مصر. تقدر تفتح الشحنة وتفحصها مع المندوب قبل الدفع، وإذا لم تناسبك ترجعها معه فوراً.'
        : 'Delivery takes 2 to 4 business days maximum across Egypt. You can open and inspect the shipment with the courier before paying, and return it on the spot if it does not suit you.',
      links: [
        link('/tracking', ar ? 'تتبع طلبك' : 'Track your order'),
        link('/policies', ar ? 'سياسة الشحن' : 'Shipping policy'),
      ],
    };
  }

  if (/(دفع|ادفع|فيزا|ماستر|فودافون كاش|اتصالات|اورنج|انستاباي|باي بال|كاش|payment|pay|visa|mastercard|paypal|instapay|wallet|cod)/.test(text)) {
    return {
      text: ar
        ? 'وسائل الدفع المتاحة: باي بال، إنستا باي، فيزا وماستركارد، محافظ فودافون كاش وأورنج كاش واتصالات كاش، والدفع النقدي عند الاستلام. كل المعاملات الرقمية مشفرة عبر SSL.'
        : 'Available payments: PayPal, InstaPay, Visa and MasterCard, Vodafone/Orange/Etisalat wallets, and cash on delivery. All digital transactions are SSL encrypted.',
      links: [link('/checkout', ar ? 'صفحة الدفع' : 'Checkout'), link('/policies', ar ? 'مركز الدفع الآمن' : 'Secure payments')],
    };
  }

  if (/(ارجاع|استرجاع|استبدال|استرداد|return|refund|exchange)/.test(text)) {
    return {
      text: ar
        ? 'الاسترجاع خلال 14 يوماً من اليوم التالي للاستلام، والاستبدال لعيوب التصنيع خلال 30 يوماً. المنتجات الصحية مستثناة بعد فتح الغلاف، والمبلغ يُرد عبر إنستا باي أو باي بال أو البطاقات.'
        : 'Returns within 14 days from the day after delivery, and exchanges for manufacturing defects within 30 days. Hygiene items are exempt after opening. Refunds go back via InstaPay, PayPal or cards.',
      links: [link('/return-policy', ar ? 'سياسة الاسترجاع الكاملة' : 'Full return policy')],
    };
  }

  if (/(تتبع|طلبي|طلبى|شحنتي|track|order status|where is my)/.test(text)) {
    return {
      text: ar
        ? 'تقدر تتابع طلبك من صفحة تتبع الطلب برقم الطلب الذي يبدأ بـ DS-HUB، أو راسلنا على واتساب وسيتأكد الفريق من آخر حالة للشحنة.'
        : 'Track your order on the tracking page with the order ID that starts with DS-HUB, or message us on WhatsApp and the team will confirm the latest status.',
      links: [
        link('/tracking', ar ? 'تتبع الطلب' : 'Track order'),
        link(`https://wa.me/${WHATSAPP}`, ar ? 'واتساب' : 'WhatsApp'),
      ],
    };
  }

  if (/(دعم|شكوى|مشكله|عطل|help|support|complaint|problem|broken)/.test(text)) {
    return {
      text: ar
        ? `فريق الدعم جاهز لمساعدتك. راسلنا على واتساب أو اتصل على ${HOTLINES[0].label}، ولو المشكلة في منتج اذكر الكود ورقم الطلب لتسريع الحل.`
        : `Our support team is ready. Message us on WhatsApp or call ${HOTLINES[0].label}. For product issues, include the product code and order ID to speed things up.`,
      links: [link('/support', ar ? 'مركز الدعم' : 'Support center'), link(`https://wa.me/${WHATSAPP}`, 'WhatsApp')],
    };
  }

  if (/(عرض|عروض|خصومات|اوفر|offer|deal|discount|sale)/.test(text)) {
    const deals = dealsProducts();
    return {
      text: ar
        ? `عندنا ${deals.length} منتج في التصفيات والعروض، والخصم مطبق بالفعل على السعر النهائي. تقدر تشوفهم كلهم في صفحة العروض.`
        : `We have ${deals.length} products in outlet and offers, with the discount already applied to the final price. You can see them all on the offers page.`,
      links: [link('/offers', ar ? 'تصفح العروض' : 'Browse offers'), ...productLinks(deals, lang)],
    };
  }

  const found = matchProducts(message);
  if (text.length > 2 && found.length > 0) {
    return {
      text: ar ? 'وجدت هذه المنتجات القريبة من بحثك:' : 'Here are the products closest to your search:',
      links: productLinks(found, lang),
    };
  }

  const categoryHint = CATEGORY_HINTS.find((hint) => hint.terms.some((term) => text.includes(term)));
  if (categoryHint) {
    const category = CATEGORY_BY_SLUG.get(categoryHint.slug);
    if (category) {
      if (category.catalog.length === 0) {
        return {
          text: ar
            ? `${category.name.ar}: ${category.intro.ar}`
            : `${category.name.en}: ${category.intro.en}`,
          links: [link(`/${category.slug}`, ar ? 'تفاصيل الخدمة' : 'Service details'), link(`https://wa.me/${WHATSAPP}`, 'WhatsApp')],
        };
      }
      const categoryItems = productsForCategory(category.slug);
      const items = categoryItems.slice(0, 3);
      return {
        text: ar
          ? `قسم ${category.name.ar} فيه ${categoryItems.length} منتجاً. أمثلة:`
          : `${category.name.en} has ${categoryItems.length} products. Examples:`,
        links: [link(`/${category.slug}`, ar ? 'افتح القسم' : 'Open section'), ...productLinks(items, lang)],
      };
    }
  }

  if (/(مرحبا|هلا|اهلا|السلام|هاي|hello|hi|hey|good morning|good evening)/.test(text)) {
    return {
      text: ar
        ? 'أهلاً بك في DeSinaHub 👋 أقدر أساعدك في البحث عن منتج بالكود أو الاسم، الشحن، الدفع، الاسترجاع، أو تتبع الطلب. اكتب سؤالك.'
        : 'Welcome to DeSinaHub 👋 I can help you find a product by code or name, shipping, payment, returns, or order tracking. Type your question.',
      links: [link('/#sections', ar ? 'تصفح الأقسام' : 'Browse sections'), link('/offers', ar ? 'العروض' : 'Offers')],
    };
  }

  if (/(من انت|من انتم|about|who are you|desina)/.test(text)) {
    return {
      text: ar
        ? 'DeSinaHub متجر إلكتروني متعدد الأقسام: موبايلات وإلكترونيات، كمبيوتر وبرمجيات أصلية، أجهزة منزلية، تصفيات، ملابس رياضية وأزياء، وخدمات صناعية وسياحية. الدفع آمن والمنتجات أصلية 100%.'
        : 'DeSinaHub is a multi-department store: mobiles and electronics, computers and genuine software, home appliances, outlet, sportswear and fashion, plus industrial and tourism services. Payments are secure and all products are 100% genuine.',
      links: [link('/policies', ar ? 'من نحن' : 'About us')],
    };
  }

  return {
    text: ar
      ? 'أقدر أساعدك في: البحث عن منتج (اكتب الكود أو الاسم)، الشحن والتوصيل، طرق الدفع، الاسترجاع والاستبدال، تتبع الطلب، والعروض. اكتب سؤالك أو اختر من الاقتراحات.'
      : 'I can help with: finding a product (type a code or name), shipping, payment methods, returns, order tracking, and offers. Type your question or pick a suggestion.',
    links: [
      link('/#sections', ar ? 'تصفح الأقسام' : 'Browse sections'),
      link('/offers', ar ? 'العروض' : 'Offers'),
      link('/tracking', ar ? 'تتبع الطلب' : 'Track order'),
      link('/support', ar ? 'الدعم' : 'Support'),
    ],
  };
}
