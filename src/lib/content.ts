export type Bilingual = { ar: string; en: string };

export type PolicyBlock = { heading?: Bilingual; body: Bilingual };
export type PolicySection = {
  id: string;
  label: Bilingual;
  title: Bilingual;
  intro: Bilingual;
  blocks: PolicyBlock[];
  footnote?: Bilingual;
};

const en = (ar: string, english: string): Bilingual => ({ ar, en: english });

/** Policies text preserved from policies.html. */
export const POLICY_SECTIONS: PolicySection[] = [
  {
    id: 'about',
    label: en('من نحن', 'About Us'),
    title: en('مرحباً بك في عالم DeSina', 'Welcome to the World of DeSina'),
    intro: en(
      'في DeSina، نحن لا نبيع مجرد منتجات، بل نقدم منظومة حياة متكاملة وأسلوباً عصرياً فريداً. انطلقنا برؤية تجارية واضحة تهدف إلى دمج الفخامة بالراحة، لنلبي احتياجات جمهورنا العام والمتنوع عبر خطوط إنتاجنا المختلفة التي تشمل الملابس والأحذية الرياضية الراقية، التشكيلات الشبابية والعائلية، إلى جانب الإلكترونيات والبرمجيات الأصلية.',
      "At DeSina, we don't just sell products; we deliver a curated lifestyle ecosystem. We started with a clear vision to merge modern luxury with absolute performance, serving a general and diverse audience across our specialized hubs—from premium sportswear and elite footwear to cutting-edge electronics and smart digital solutions.",
    ),
    blocks: [
      {
        heading: en('رسالتنا', 'Our Mission'),
        body: en(
          'تقديم منتجات أصلية ومطورة تمنحك الثقة الكاملة والأداء الفعلي في حياتك اليومية، بأسعار تنافسية مدروسة وتجربة تسوق آمنة وسلسة تحترم المستهلك أولاً.',
          'To provide genuine, highly-engineered products that empower confidence and actual performance in your daily life, offered at competitive rates with a seamless, respectful shopping experience.',
        ),
      },
      {
        heading: en('رؤيتنا', 'Our Vision'),
        body: en(
          'أن نصبح المنصة الأولى والموثوقة للتسوق الإلكتروني الشامل، محققين التوازن المثالي بين الجودة الفائقة، خيارات الدفع الرقمية المتعددة، والشحن السريع المضمون.',
          'To become the premier, most trusted multi-category destination in e-commerce, achieving the perfect equation of supreme quality, diverse financial options, and guaranteed fast dispatch.',
        ),
      },
    ],
  },
  {
    id: 'payments',
    label: en('طرق الدفع الآمنة', 'Secure Payments'),
    title: en('مركز الدفع الآمن والمعتمد', 'Secure & Certified Payment Center'),
    intro: en(
      'نوفر لك في DeSina باقة متكاملة من أحدث وأأمن وسائل الدفع الإلكتروني والنقدي لضمان مرونة كاملة وحماية لبياناتك المالية بنسبة 100%:',
      'We provide the latest and safest digital and cash payment methodologies to ensure 100% data protection and financial flexibility:',
    ),
    blocks: [
      {
        heading: en('1. حماية مشتري باي بال (PayPal)', '1. PayPal Buyer Protection'),
        body: en(
          'ادفع بحسابك العالمي بكل سهولة مع ميزة حماية المشتري المعتمدة دولياً عبر سيرفراتنا الآمنة.',
          'Pay securely using your global PayPal account with certified buyer protection protocols processed via secure servers.',
        ),
      },
      {
        heading: en('2. تطبيق إنستا باي (InstaPay)', '2. InstaPay Application'),
        body: en(
          'تحويل بنكي لحظي ومباشر عبر التطبيق إلى حساب البراند الرسمي فور تأكيد الطلب بنقرة واحدة.',
          'Direct, instant bank transfer via the official InstaPay app to our registered business account upon confirmation.',
        ),
      },
      {
        heading: en('3. البطاقات الائتمانية (Visa / MasterCard)', '3. Credit Cards (Visa/MasterCard)'),
        body: en(
          'ندعم الدفع المباشر بواسطة كروت الفيزا والماستر كارد عبر بوابة دفع مشفرة بالكامل لحماية بياناتك.',
          'We support direct checkouts via Visa and MasterCard through a fully encrypted gateway protecting your credentials.',
        ),
      },
      {
        heading: en('4. المحافظ الإلكترونية (فودافون كاش وأخواتها)', '4. E-Wallets (Vodafone Cash & More)'),
        body: en(
          'يمكنك التحويل مباشرة عبر محفظة فودافون كاش، أورنج كاش، أو اتصالات كاش لرقم حسابنا المعتمد.',
          'Transfer instantly via Vodafone Cash, Orange Cash, or Etisalat Cash to our verified business wallet numbers.',
        ),
      },
      {
        heading: en('5. الدفع النقدي عند الاستلام (COD)', '5. Cash on Delivery (COD)'),
        body: en(
          'الخيار الأكثر أماناً؛ لا تدفع أي مبالغ مالية إلا بعد وصول المندوب لبيتك، وفتح الشحنة ومعاينتها وفحص جودتها بالكامل والاطمئنان إليها.',
          'The ultimate risk-free choice; do not pay anything until the courier arrives at your door, allowing you to fully inspect the product quality first.',
        ),
      },
    ],
    footnote: en(
      'جميع المعاملات الرقمية مشفرة بالكامل عبر بروتوكولات حماية SSL وحسابات بنكية معتمدة ومسجلة رسمياً باسم مجموعة دسينا التجارية.',
      'All digital transactions are encrypted via SSL protocols and processed through official business accounts registered strictly under DeSina Group.',
    ),
  },
  {
    id: 'shipping',
    label: en('الشحن والتوصيل', 'Shipping & Delivery'),
    title: en('سياسة الشحن السريع واللوجستيات المضمونة', 'Express Shipping & Guaranteed Logistics'),
    intro: en(
      'نحن نضمن وصول شحنتك لباب منزلك بأعلى معايير الأمان والسلامة عبر شبكة شحن مخصصة لمتجرنا:',
      'We ensure your parcel arrives safely at your doorstep under the highest standards of safety via our dedicated logistics partners:',
    ),
    blocks: [
      {
        heading: en('1. مدة تجهيز وتسليم الشحنة', '1. Delivery Timeline'),
        body: en(
          'يتم تأكيد الطلب وفحصه، وتوصيله لباب منزلك خلال مدة تتراوح بين **2 إلى 4 أيام عمل** كحد أقصى لكافة محافظات جمهورية مصر العربية.',
          'Orders are verified, packed, and delivered right to your door within 2 to 4 business days maximum across all regions.',
        ),
      },
      {
        heading: en('2. تتبع حركة الشحنة الذكي', '2. Smart Order Tracking'),
        body: en(
          'عند خروج الشحنة من المخازن، يتم تزويدك برقم تتبع فريد وخاص بطلبك (مرتبط بـ كود طلباتك الذكي) يتيح لك معرفة حالة طلبك بدقة وموعد وصول المندوب.',
          'Once your package leaves our warehouse, a unique tracking code (linked to your smart order ID) is provided to monitor your delivery status.',
        ),
      },
      {
        heading: en('3. تكلفة الشحن والشفافية', '3. Shipping Fees Transparency'),
        body: en(
          'تكلفة الشحن تظهر لك بشكل واضح وصريح عند تأكيد الطلب عبر الواتساب ولا توجد أي رسوم مخفية أو إضافية يطلبها المندوب عند التوصيل.',
          'Shipping costs are calculated and clearly displayed upon order confirmation via WhatsApp; absolutely no hidden fees or extra charges at your door.',
        ),
      },
      {
        heading: en('4. آلية عدم الرد وإعادة الجدولة', '4. Unreachable Protocol'),
        body: en(
          'في حال عدم التمكن من الوصول إليك، يقوم المندوب بالمحاولة مرة أخرى في اليوم التالي وتأجيل الشحنة مجاناً لضمان عدم إلغاء طلبك تلقائياً.',
          'If you are unreachable, the courier will safely reschedule delivery for the next business day automatically for free without canceling your order.',
        ),
      },
      {
        heading: en('5. تأمين المنتجات ضد مخاطر النقل', '5. High-Value Cargo Insurance'),
        body: en(
          'جميع الشحنات والأجهزة الكبيرة (كالشاشات والموبايلات) مؤمن عليها بالكامل؛ وفي حال حدوث أي كسر أو تلف أثناء النقل، يتحمل المتجر المسؤولية كاملة ويتم استبدال المنتج فوراً دون أي تكلفة إضافية عليك.',
          'All shipments and fragile hardware (like Smart TVs and smartphones) are fully insured. Any transit damage is 100% our responsibility for an instant replacement.',
        ),
      },
    ],
  },
  {
    id: 'returns',
    label: en('الاسترجاع والاستبدال', 'Returns & Exchanges'),
    title: en('سياسة الاسترجاع والاستبدال الرسمية (5 بنود كاملة)', 'Official 14-Day Return & Exchange Policy'),
    intro: en(
      'نحن نضمن حقك القانوني والتجاري بالكامل وفقاً للوائح حماية المستهلك عبر البنود الصارمة التالية:',
      'We fully guarantee your legal and consumer rights according to consumer protection regulations through 5 strict, clear ironclad clauses:',
    ),
    blocks: [
      {
        heading: en('1. المهلة الزمنية للاسترجاع والاستبدال (14 يوماً)', '1. Official Return/Exchange Window'),
        body: en(
          'يحق للعميل طلب استبدال أو استرجاع المنتج واسترداد قيمته كاملة خلال **14 يوماً** تبدأ من اليوم التالي لتاريخ استلام الشحنة الفعلي.',
          'Customers have the right to request a product exchange or a full refund within exactly 14 days, starting from the day following actual delivery.',
        ),
      },
      {
        heading: en('2. حالة وضمان سلامة المنتج', '2. Product Condition Requirements'),
        body: en(
          'يجب أن يكون المنتج في حالته الأصلية تماماً كما تم استلامه، غير مستخدم، وغير مغسول، وبداخل العلبة أو الغلاف الأصلي المصنع له، ومع وجود كافة التاغات والعلامات الخاصة ببراند دسينا.',
          'The item must be in its absolute original condition, unused, unwashed, inside its original box/packaging, with all DeSina tags and brand labels fully intact.',
        ),
      },
      {
        heading: en('3. حق الفحص والمعاينة المجانية مع المندوب', '3. Free On-The-Spot Inspection'),
        body: en(
          'تسهيلاً عليك، نتيح لك خيار فتح الشحنة وفحص جودة الملابس أو الكوتشيات وتجربة قياس المقاس مع المندوب فور وصوله للمنزل، وفي حال عدم المناسبة أو وجود ملحوظة، يمكنك إعادتها مع المندوب فوراً في ساعتها دون دفع قيمة المنتج.',
          "For your complete peace of mind, we allow you to open the package and inspect/try your apparel or shoes with the courier on the spot. If it doesn't fit, return it instantly with the courier for free.",
        ),
      },
      {
        heading: en('4. المنتجات المستثناة من الاسترجاع لأسباب صحية', '4. Health & Hygiene Exemptions'),
        body: en(
          'وفقاً لقوانين الصحة العامة، يُستثنى من الاسترجاع أو الاستبدال الملابس الداخلية وملابس السباحة والجوارب بعد فتح غلافها الأصلي، إلا في حال وجود عيب صناعة واضح عند المعاينة الأولى.',
          'According to public health laws, innerwear, swimwear, and socks are strictly exempted from returns once opened, unless an evident factory defect is spotted during the initial inspection.',
        ),
      },
      {
        heading: en('5. آلية استرداد الأموال وتحويل المستحقات', '5. Refund Turnaround & Payouts'),
        body: en(
          'في حال تم إرجاع المنتج بعد مغادرة المندوب وفحصه في مخازننا، يتم رد المبلغ كاملاً للعميل خلال 48 ساعة عبر وسيلة الدفع التي اختارها (تحويل إنستا باي، فودافون كاش، أو استرداد لحساب باي بال الإلكتروني).',
          'Once a returned item is received and inspected at our hub, a full refund is processed within 48 hours via your preferred channel (InstaPay, Vodafone Cash, or PayPal refund).',
        ),
      },
    ],
  },
  {
    id: 'privacy',
    label: en('الخصوصية', 'Privacy Policy'),
    title: en('سياسة الخصوصية وسرية المعلومات', 'Privacy Policy & Data Confidentiality'),
    intro: en(
      'نحن في DeSina نحترم خصوصيتك بالكامل. البيانات التي يتم جمعها أثناء عملية الشراء أو التصفح (مثل الاسم، رقم الهاتف، العنوان) تُسخدم فقط لغرض توصيل الطلبات إليك وتحسين تجربة تسوقك في منظومة متاجرنا.\nتاريخ التحديث: مايو 2026',
      'At DeSina, we deeply respect your privacy. Any personal data collected during checkout or browsing (such as name, phone number, and address) is exclusively used to deliver your orders and enhance your ecosystem shopping experience.\nLast Updated: May 2026',
    ),
    blocks: [
      {
        heading: en('حماية البيانات', 'Data Protection'),
        body: en(
          'معلوماتك مشفرة بالكامل ولا يتم مشاركتها أو بيعها لأي جهة خارجية مطلقاً.',
          'Your information is fully encrypted and will never be shared, leased, or sold to any third party under any circumstances.',
        ),
      },
      {
        heading: en('ملفات الارتباط (Cookies)', 'Cookies'),
        body: en(
          'نستخدم ملفات ارتباط خفيفة لتحسين سرعة تصفح المتجر وحفظ حقيبة التسوق الخاصة بك.',
          'We utilize ultra-lightweight cookies to boost store performance, browsing speed, and maintain your active cart data securely.',
        ),
      },
      {
        heading: en('التواصل الآمن', 'Secure Channels'),
        body: en(
          'نستخدم رقم الواتساب الرسمي المسجل لتأكيد تفاصيل الشحن والطلبات الخاصة بك فقط.',
          'We only use our registered official WhatsApp channel to confirm shipment details, tracking, and order updates.',
        ),
      },
    ],
  },
];

export type ReturnClause = { title: Bilingual; body: Bilingual };

/** Return & exchange text preserved from return-policy.html. */
export const RETURN_CLAUSES: ReturnClause[] = [
  {
    title: en('١. المدد الزمنية الرسمية', '1. Official Timeframes'),
    body: en(
      'يتم قبول طلبات الاسترجاع خلال أربعة عشر يوماً، وطلبات الاستبدال الناتجة عن عيوب التصنيع خلال ثلاثين يوماً من تاريخ استلام المنتج المثبت رسمياً.',
      'Returns are accepted within 14 days. Exchanges for manufacturing defects are accepted within 30 days of delivery.',
    ),
  },
  {
    title: en('٢. معايير الرفض وسوء الاستخدام', '2. Misuse & Rejection Criteria'),
    body: en(
      'يرفض طلب الاستبدال أو الاسترجاع في حالة وجود تلف ناتج عن سوء الاستخدام، ويشمل ذلك: مخالفة تعليمات العناية الخاصة بالملابس والإكسسوارات وكافة منتجات الشركة، أو إجراء تعديلات يدوية، أو التلف العمدي الناتج عن الإهمال وسوء الاستخدام.',
      'Requests are denied for damage due to misuse, including violation of care instructions for apparel, accessories, and all company products, or personal alterations.',
    ),
  },
  {
    title: en('٣. التسويات والتحويلات المالية', '3. Financial Settlements'),
    body: en(
      'تتم معالجة مبالغ الرد عبر بوابات الدفع الإلكتروني انستا باي وباي بال أو البطاقات البنكية خلال مدة تتراوح من خمسة إلى عشرة أيام عمل. يتم خصم رسوم الشحن والرسوم الإدارية في حالات الاسترجاع غير المتعلقة بعيوب الصناعة.',
      'Refunds are processed via InstaPay, PayPal, or Bank Cards within 5-10 business days. Shipping and admin fees are non-refundable for non-defective returns.',
    ),
  },
];

export type FaqItem = { q: Bilingual; a: Bilingual };

export const FAQ_ITEMS: FaqItem[] = [
  {
    q: en('ما وسائل الدفع المتاحة في المتجر؟', 'Which payment methods are available?'),
    a: en(
      'نقبل باي بال، إنستا باي، بطاقات فيزا وماستر كارد، المحافظ الإلكترونية (فودافون كاش، أورنج كاش، اتصالات كاش)، والدفع النقدي عند الاستلام.',
      'We accept PayPal, InstaPay, Visa and MasterCard, e-wallets (Vodafone Cash, Orange Cash, Etisalat Cash), and cash on delivery.',
    ),
  },
  {
    q: en('ما مدة توصيل الطلب؟', 'How long does delivery take?'),
    a: en(
      'بعد تأكيد وفحص الطلب، يتم التوصيل خلال 2 إلى 4 أيام عمل كحد أقصى لكافة محافظات مصر.',
      'After verification and packing, delivery takes 2 to 4 business days maximum across Egypt.',
    ),
  },
  {
    q: en('هل يمكنني فحص المنتج قبل الدفع؟', 'Can I inspect the product before paying?'),
    a: en(
      'نعم، نتيح فتح الشحنة وفحصها مع المندوب فور الوصول، ويمكنك إعادتها معه مباشرة إذا لم تناسبك.',
      'Yes. You may open and inspect the shipment with the courier on arrival and return it immediately if it does not suit you.',
    ),
  },
  {
    q: en('ما مدة الاسترجاع والاستبدال؟', 'What is the return and exchange window?'),
    a: en(
      'الاسترجاع خلال 14 يوماً من اليوم التالي للاستلام، والاستبدال لعيوب التصنيع خلال 30 يوماً. المنتجات الصحية مستثناة بعد فتح الغلاف الأصلي.',
      'Returns within 14 days from the day after delivery; exchanges for manufacturing defects within 30 days. Hygiene products are exempt once the original seal is opened.',
    ),
  },
  {
    q: en('هل المنتجات أصلية وبضمان؟', 'Are products genuine and covered by warranty?'),
    a: en(
      'نعم، جميع المنتجات أصلية 100%. مدة الضمان تختلف حسب المنتج وتظهر بوضوح في صفحة تفاصيل كل منتج.',
      'Yes, all products are 100% genuine. Warranty varies per product and is shown clearly on each product detail page.',
    ),
  },
  {
    q: en('كيف أتابع شحنتي؟', 'How do I track my shipment?'),
    a: en(
      'استخدم صفحة تتبع الطلب ورقم الطلب الذي يبدأ بـ DS-HUB، أو تواصل مع خدمة العملاء عبر واتساب.',
      'Use the tracking page with the order number that starts with DS-HUB, or contact customer care on WhatsApp.',
    ),
  },
  {
    q: en('كيف تتم حماية بياناتي؟', 'How is my data protected?'),
    a: en(
      'بياناتك مشفرة بالكامل ولا تُشارك أو تُبيع لأي جهة خارجية، ونستخدم الواتساب الرسمي فقط لتأكيد الطلبات.',
      'Your information is fully encrypted and is never shared or sold. We only use the official WhatsApp channel to confirm orders.',
    ),
  },
];

export const REVIEW_STATIC = [
  {
    avatar: 'أ',
    name: en('أحمد محمد', 'Ahmed Mohamed'),
    time: en('منذ يومين', '2 days ago'),
    stars: 5,
    text: en(
      'الخدمة ممتازة جداً والتنفيذ سريع للغاية! هذا أفضل موقع تعاملت معه، التنسيق رائع وسلس.',
      'The service is very excellent and execution is extremely fast! This is the best website I have dealt with.',
    ),
  },
  {
    avatar: 'J',
    name: en('John Doe', 'John Doe'),
    time: en('منذ أسبوع', '1 week ago'),
    stars: 5,
    text: en(
      'استجابة فريق الدعم كانت سريعة جداً. خدمة عالية الجودة وتصميم موقع نظيف ومريح. أنا راضٍ تماماً!',
      'The response of the support team was very fast. High-quality service and clean web layout. I am very satisfied!',
    ),
  },
];

export const REVIEW_TAGS: Bilingual[] = [
  en('💎 جودة ممتازة', '💎 Excellent Quality'),
  en('🚚 سرعة في التوصيل', '🚚 Fast Delivery'),
  en('🎧 خدمة عملاء راقية', '🎧 Great Support'),
  en('💰 أسعار مناسبة', '💰 Reasonable Prices'),
];

/** Reviews page external destinations preserved from reviews.html. */
export const GOOGLE_REVIEW_URL = 'https://g.page/r/CWYHdB7UppmnEAE/review';
export const TRUSTPILOT_REVIEW_URL = 'https://www.trustpilot.com/evaluate/www.desinahub.com';

export type SupportChannel = {
  id: string;
  title: Bilingual;
  body: Bilingual;
  cta: Bilingual;
  href: string;
};

export function supportChannels(whatsapp: string): SupportChannel[] {
  return [
    {
      id: 'technical',
      title: en('الدعم الفني والتقني', 'Technical Support'),
      body: en(
        'تواجه مشكلة في أحد منتجاتنا؟ فريق الدعم الفني جاهز لمساعدتك في حل كافة الأعطال وضمان عمل المنتج بكفاءة عالية.',
        'Facing issues with our products? Our technical team is ready to help resolve any faults and ensure maximum performance.',
      ),
      cta: en('طلب دعم فني', 'Request Support'),
      href: `https://wa.me/${whatsapp}`,
    },
    {
      id: 'faq',
      title: en('الأسئلة الشائعة', 'FAQ'),
      body: en(
        'إجابات سريعة على أكثر الأسئلة تكراراً حول المنتجات، الشحن، وطرق الدفع لتوفير وقتك وجهدك.',
        'Quick answers to the most common questions about products, shipping, and payments to save your time.',
      ),
      cta: en('عرض الأسئلة', 'View FAQ'),
      href: '/faq',
    },
    {
      id: 'care',
      title: en('خدمة العملاء', 'Customer Care'),
      body: en(
        'لأي استفسارات عامة أو شكاوى، تواصل مباشرة مع فريق خدمة العملاء للحصول على رد سريع واحترافي.',
        'For general inquiries or complaints, contact our customer service team directly for a fast and professional response.',
      ),
      cta: en('تواصل الآن', 'Contact Now'),
      href: `https://wa.me/${whatsapp}`,
    },
  ];
}

export type ServiceCard = { title: Bilingual; body: Bilingual };

export function serviceCards(slug: 'industrial' | 'tourism'): ServiceCard[] {
  if (slug === 'industrial') {
    return [
      {
        title: en('توريد المعدات والأنظمة', 'Equipment & Systems Supply'),
        body: en(
          'توريد معدات صناعية وأنظمة تشغيل بمواصفات مطابقة، مع عروض أسعار رسمية وفواتير ضريبية.',
          'Industrial equipment and operating systems supplied to spec, with formal quotations and tax invoices.',
        ),
      },
      {
        title: en('التشغيل والصيانة', 'Operation & Maintenance'),
        body: en(
          'عقود تشغيل وصيانة دورية للحفاظ على استمرارية خطوط الإنتاج وتقليل التوقفات.',
          'Scheduled operation and maintenance contracts that keep production lines running and downtime low.',
        ),
      },
      {
        title: en('المشتريات والتوريد للمصانع', 'Factory Procurement'),
        body: en(
          'تجميع وتوريد مستلزمات المصانع من موردين معتمدين مع متابعة الشحن والتسليم.',
          'Sourcing and supplying factory consumables from approved vendors, with shipping and delivery follow-up.',
        ),
      },
      {
        title: en('استشارات فنية للشركات', 'B2B Technical Consulting'),
        body: en(
          'تقييم احتياجات التشغيل واقتراح الحلول الفنية المناسبة قبل الشراء.',
          'Operational needs assessment and technical recommendations before purchase.',
        ),
      },
    ];
  }
  return [
    {
      title: en('برامج سياحية داخل مصر', 'Domestic Travel Programmes'),
      body: en(
        'برامج سياحية داخلية تشمل الإقامة والتنقلات والأنشطة بتنسيق كامل من فريقنا.',
        'Domestic travel programmes including accommodation, transfers and activities, fully arranged by our team.',
      ),
    },
    {
      title: en('رحلات خارجية وحجوزات', 'International Trips & Bookings'),
      body: en(
        'حجوزات طيران وفنادق وبرامج خارجية بالتنسيق مع شركاء الخدمة المعتمدين.',
        'Flight, hotel and international programme bookings coordinated with approved service partners.',
      ),
    },
    {
      title: en('تنقلات واستقبال مطارات', 'Transfers & Airport Pickup'),
      body: en(
        'ترتيب تنقلات المطار والمواصلات الداخلية ضمن البرنامج السياحي.',
        'Airport transfers and local transport arranged as part of the travel programme.',
      ),
    },
    {
      title: en('برامج مخصصة للعائلات والشركات', 'Tailored Family & Corporate Trips'),
      body: en(
        'تصميم برنامج سياحي على المقاس حسب الميزانية وعدد الأفراد ومدة الرحلة.',
        'Custom itineraries designed around your budget, group size and trip duration.',
      ),
    },
  ];
}

