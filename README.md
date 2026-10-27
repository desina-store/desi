# DeSinaHub — دليل التركيب والتشغيل

هذا الملف يشرح مشروع متجر **DeSinaHub** بعد دمج تصميم واجهة المتجر الجديد داخل كود الموقع الحالي، وكيفية تشغيله ونشره على Vercel، والمتغيرات التي يجب ضبطها.

---

## 1) فكرة المشروع وكيفية بنائه

### التقنيات المستخدمة

| العنصر | الإصدار | ملاحظة |
|---|---|---|
| Next.js (App Router) | 16.4.3 | تصيير ديناميكي للصفحات + Server Components |
| React | 19.3.1 | |
| TypeScript | 5.9.x | وضع `strict` مفعّل |
| Tailwind CSS | 4.3.3 | عبر `@tailwindcss/postcss` |
| Swiper | 14.3.0 | للسلايدرات (الهيرو، العروض، التقييمات) |
| lucide-react | 1.61.0 | الأيقونات |
| mongodb | 7.5.0 | يُستخدم فقط داخل دوال Vercel في مجلد `api/` |
| stripe | 22.3.2 | تأكيد مدفوعات Stripe داخل `api/` |

### طبقات المشروع

1. **طبقة العرض (الواجهة)** — `src/app` + `src/components`
   - كل صفحة هي ملف `page.tsx` داخل مجلد المسار.
   - المكوّنات مقسّمة حسب الوظيفة: `layout` (الرأس، الشريط السفلي، الدردشة، درج السلة)، `catalog` (كروت المنتجات والشبكات)، `home` (السلايدرات والأقسام)، `cart` / `checkout` / `orders` / `product` / `search` / `reviews` / `tracking` / `account` / `services`، و`ui` (عناوين الأقسام، النجوم، Breadcrumbs، JsonLd).

2. **طبقة الأنماط** — `src/styles` (يُستورد كل منها من `src/app/globals.css`)
   - `tokens.css` : متغيرات الألوان والخطوط والمسافات (`--ink`, `--accent`, `--canary` …).
   - `base.css` : إعادة الضبط، الأزرار، الحقول، الكلاسات المشتركة.
   - `chrome.css` : الرأس، الشريط السفلي، القائمة الدائرية، الذيل.
   - `home.css` : أقسام الصفحة الرئيسية والهيرو والسلايدرات.
   - `catalog.css` : كروت المنتجات، شبكة الفئات، وصفحة تفاصيل المنتج (المعرض + الأكورديون).
   - `commerce.css` : السلة، درج السلة، الدفع، الطلبات، التتبع.
   - `pages.css` : بقية الصفحات (الأسئلة، السياسات، الدعم، المراجعات، الصفحات الخدمية).
   - `src/app/globals.css` : يستورد طبقات Tailwind وملفات الأنماط أعلاه، ويحتوي على عدد قليل من الكلاسات المكمّلة.

3. **طبقة البيانات والمنطق** — `src/lib`
   - `catalog.json` : قاعدة بيانات المنتجات (المرجع الوحيد للمنتجات).
   - `products.ts` : قراءة الكتالوج، البحث، التصنيف، الخصومات، المنتجات ذات الصلة.
   - `content.ts` : النصوص الثابتة (الأقسام، الأسئلة الشائعة، السياسات، التقييمات…).
   - `i18n.ts` : قاموس الترجمة العربي/الإنجليزي + اسم كوكي اللغة `desina_lang`.
   - `site.ts` : **رابط الموقع `SITE_URL`، رقم واتساب، ألوان الهوية، روابط السوشيال**.
   - `cart.ts` + `components/providers/CartProvider.tsx` : حالة السلة المحفوظة في `localStorage`.
   - `checkout.ts` : التحقق من الطلب وإرساله إلى `/api/checkout`.
   - `store-schema.ts` : بيانات Schema.org (JSON-LD) لتحسين الظهور في محركات البحث.
   - `server.ts` : قراءة لغة الزائر من الكوكي على السيرفر.

4. **طبقة السيرفر (دوال Vercel)** — `api/`, `lib/`, `workers/`
   - `api/checkout.js` : إنشاء الطلب والتحقق من السلة وأسعارها على السيرفر.
   - `api/webhook.js` : مستقبل إشعارات الدفع (Stripe / PayPal / Paymob / Fawry / بنكي) وتوزيع الأحداث.
   - `api/webhook-supabase.js` : مسار بديل لتسجيل الأحداث في Supabase.
   - `api/worker.js` : عامل مجدول (Cron) لمعالجة مهام الدفع المعلّقة.
   - `api/chat.js` : مساعد الدردشة الذكي.
   - `api/a2a.js` : نقطة نهاية Agent-to-Agent.
   - `lib/mongodb.js` : اتصال MongoDB المشترك لدوال السيرفر.
   - `workers/paymentworker.js` : منطق إعادة محاولة مهام الدفع.

> ملاحظة مهمة: ملفات `api/` **لا تعمل** عند تشغيل `next start` محليًا؛ لأنها دوال Vercel مستقلة. لتجربتها محليًا استخدم `vercel dev` أو انشر على Vercel.

### أوامر التشغيل

```bash
npm install        # تثبيت الاعتماديات
npm run dev        # تشغيل خادم التطوير على http://localhost:3000
npm run build      # بناء نسخة الإنتاج
npm run start      # تشغيل نسخة الإنتاج
```

---

## 2) شجرة الملفات وكيفية ترتيبها

الملفات داخل هذا الأرشيف موجودة **في جذر الأرشيف مباشرة**، أي أن فك الضغط يعطيك محتويات المشروع جاهزة.

### الترتيب المطلوب

1. افتح مجلد مشروعك (الذي يحتوي أصلًا على `package.json`).
2. انسخ كل محتويات هذا الأرشيف إلى **جذر المشروع** مباشرة (وليس داخل مجلد فرعي).
3. عند السؤال عن الاستبدال اختر **استبدال/دمج (Replace)** للملفات المكررة.

النتيجة المتوقعة:

```text
مشروعك/
├── api/
│   ├── a2a.js
│   ├── chat.js
│   ├── checkout.js
│   ├── webhook.js
│   ├── webhook-supabase.js
│   └── worker.js
├── lib/
│   └── mongodb.js
├── workers/
│   └── paymentworker.js
├── public/
│   ├── assets/            ← صور المنتجات والأيقونات والشعارات
│   │   ├── Lucide/  comp/  icon/  mark/  now/  payments/
│   ├── brands/  payments/  webfonts/
│   ├── .well-known/       ← a2a-agent-card.json و assetlinks.json
│   ├── sw.js              ← Service Worker
│   ├── manifest / أيقونات PWA (192.png, icon-maskable.*, splash-rounded.*)
│   ├── llms.txt, llms-full.txt, llms.xml, feed.xml, feed.js, ai-catalog.json
│   └── desinahub.svg, logo*.png/jpg/webp, googlee*.html
├── src/
│   ├── app/
│   │   ├── page.tsx                     ← الصفحة الرئيسية
│   │   ├── layout.tsx                   ← الهيكل العام + الخطوط + RTL
│   │   ├── globals.css                  ← يستورد كل طبقات الأنماط
│   │   ├── manifest.ts  robots.ts  sitemap.ts  not-found.tsx
│   │   ├── fonts/                       ← خط Cairo المتغيّر
│   │   ├── [الفئات]/page.tsx             ← mobiles, computers, appliances,
│   │   │                                    fashion, sports, outlet
│   │   ├── industrial/page.tsx           ← صفحة الخدمات الصناعية
│   │   ├── tourism/page.tsx              ← صفحة الخدمات السياحية
│   │   ├── product/[code]/page.tsx       ← صفحة تفاصيل المنتج
│   │   ├── cart/  checkout/  orders/  account/  offers/  search/
│   │   ├── reviews/  faq/  policies/  return-policy/  support/  tracking/
│   ├── components/
│   │   ├── layout/     (Header, BottomNav, SiteFooter, AiChat, CartToast,
│   │   │                CircularMenu, PaymentMarks, Tracking, ServiceWorkerRegistrar,
│   │   │                InAppBrowserGuard)
│   │   ├── cart/       (CartDrawer, CartView)
│   │   ├── catalog/    (ProductCard, ProductGrid, CategoryPageView, CategoryExplorer)
│   │   ├── home/       (HeroSwiper, CategoryRail, ProductSwiper, DealsTimer,
│   │   │                TestimonialsSwiper, NewsletterForm)
│   │   ├── product/    (ProductActions)
│   │   ├── checkout/   (CheckoutForm)
│   │   ├── orders/     (OrdersList)
│   │   ├── reviews/    (ReviewComposer)
│   │   ├── search/     (LiveSearch)
│   │   ├── services/   (ServicePageView)
│   │   ├── tracking/   (TrackingLookup)
│   │   ├── account/    (AccountPanels)
│   │   ├── providers/  (CartProvider, CartDrawerProvider, LanguageProvider)
│   │   └── ui/         (PageHero, PageHeader, SectionHeading, Stars, JsonLd,
│   │                    RichText, BrandMark, BrandIcons)
│   ├── lib/            (products.ts, catalog.json, content.ts, i18n.ts, site.ts,
│   │                    cart.ts, checkout.ts, format.ts, hero.ts, seo.ts,
│   │                    server.ts, store-schema.ts, tracking.ts, assistant.ts,
│   │                    brand-copy.ts)
│   └── styles/         (tokens.css, base.css, chrome.css, home.css,
│                        catalog.css, commerce.css, pages.css)
├── config.js              ← ملف تراثي غير مستخدم (راجع البند 4)
├── next.config.mjs        ← إعدادات Next (الصور، إعادة التوجيهات، الترويسات)
├── postcss.config.mjs     ← إضافة Tailwind 4
├── tailwind.config.js     ← إعداد Tailwind التراثي (راجع البند 4)
├── tsconfig.json
├── vercel.json            ← Crons + ترويسات الكاش والأمان
├── package.json
├── package-lock.json
├── .gitignore
└── README.md              ← هذا الملف
```

### ترتيب الاستيراد (كيف يترابط الكود)

```text
src/app/layout.tsx
   └─ يستورد src/app/globals.css
         └─ يستورد tailwindcss + src/styles/{tokens,base,chrome,home,catalog,commerce,pages}.css
   └─ يغلّف الصفحات بـ CartProvider + CartDrawerProvider + LanguageProvider
   └─ يضع Header + BottomNav + CartDrawer + AiChat + SiteFooter

src/app/page.tsx  ──►  components/home/*  ──►  src/lib/products.ts  ──►  src/lib/catalog.json
src/app/product/[code]/page.tsx  ──►  ProductActions + ProductGrid + PageHero(Breadcrumbs)
src/app/checkout/page.tsx  ──►  CheckoutForm  ──►  src/lib/checkout.ts  ──►  POST /api/checkout
/api/webhook.js  ──►  lib/mongodb.js  ──►  workers/paymentworker.js
```

---

## 3) المتغيرات والإعدادات التي يجب ضبطها

### 3.1 إعدادات داخل الكود (وليست متغيرات بيئة)

| الملف | السطر | ما يجب تعديله |
|---|---|---|
| `src/lib/site.ts` | `SITE_URL` | رابط الموقع الحالي `https://www.desinahub.com` — يُستخدم في SEO وJSON-LD وsitemap وروابط المشاركة |
| `src/lib/site.ts` | `WHATSAPP` / `WHATSAPP_DISPLAY` | رقم واتساب المتجر بصيغة دولية بدون `+` |
| `next.config.mjs` | `images.remotePatterns` | نطاقات الصور المسموح بها (أضف نطاقك إن اختلف) |
| `public/sw.js` | أسماء الكاش | يُفضّل تغيير رقم إصدار الكاش عند كل نشر لتفادي تقديم ملفات قديمة للزوار |

### 3.2 متغيرات البيئة على Vercel

افتح: **Vercel → Project → Settings → Environment Variables** وأضف القيم التالية.
أضفها لثلاثة بيئة: `Production` و `Preview` و `Development`.

#### إلزامية (بدونها لا يعمل حفظ الطلبات)

| المتغير | الوصف | مثال |
|---|---|---|
| `MONGODB_URI` | نص اتصال MongoDB (يُفضّل `mongodb+srv://`) | `mongodb+srv://user:pass@cluster.mongodb.net` |
| `MONGODB_DATABASE` | اسم قاعدة البيانات | `desinahub` |
| `MONGODB_ORDERS_COLLECTION` | مجموعة الطلبات | `orders` |
| `MONGODB_WEBHOOK_COLLECTION` | مجموعة سجل الإشعارات | `webhook_events` |
| `MONGODB_JOBS_COLLECTION` | مجموعة مهام إعادة المحاولة | `payment_jobs` |
| `MONGODB_DLQ_COLLECTION` | مجموعة الرسائل المرفوضة (Dead Letter) | `dlq` |
| `CRON_SECRET` | مفتاح عشوائي لحماية `/api/worker` من الاستدعاء الخارجي | أي قيمة طويلة عشوائية |

> ⚠️ ملف `lib/mongodb.js` يحتوي على **نص اتصال احتياطي مكتوب داخل الكود** (به كلمة مرور وهمية `<db_password>` واسم كلاستر `desinahub-data.g7in3ky.mongodb.net`). إن نسيت ضبط `MONGODB_URI` فلن تحصل على رسالة خطأ واضحة، بل سيفشل الاتصال عند أول طلب.
> يُنصح بحذف هذا الاحتياطي وجعل الملف يفشل صراحةً:
> ```js
> const uri = process.env.MONGODB_URI;
> if (!uri) throw new Error('MONGODB_URI is required');
> ```
> كما أن اسم قاعدة البيانات الافتراضي هو `DeSinaHubDB` إن لم تضبط `MONGODB_DATABASE`.

#### بوابات الدفع (أضف ما تستخدمه فعليًا)

| المتغير | الوصف |
|---|---|
| `STRIPE_SECRET_KEY` | المفتاح السري لـ Stripe (`sk_live_…` أو `sk_test_…`) |
| `STRIPE_WEBHOOK_SECRET` | سر الـ webhook من لوحة Stripe (`whsec_…`) |
| `PAYPAL_CLIENT_ID` / `PAYPAL_CLIENT_SECRET` | بيانات تطبيق PayPal |
| `PAYPAL_WEBHOOK_ID` | معرّف الـ webhook في PayPal (إلزامي للتحقق من التوقيع) |
| `PAYPAL_API_BASE` | `https://api-m.paypal.com` للإنتاج، و`https://api-m.sandbox.paypal.com` للتجربة |
| `PAYMOB_WEBHOOK_SECRET` | سر إشعارات Paymob |
| `FAWRY_WEBHOOK_SECRET` | سر إشعارات Fawry |
| `BANK_WEBHOOK_SECRET` | سر إشعارات البنك (إن وُجد) |
| `WEBHOOK_SECRET` | سر عام للتحقق من `/api/webhook-supabase` |

⚠️ إذا لم تُضف أسرار الـ webhook الخاصة ببوابة معيّنة، فإن الإشعارات الواردة من تلك البوابة **تُرفض** (وهذا سلوك مقصود للأمان).

#### التحليلات والتسويق (اختيارية — غييبها يوقف الإرسال فقط)

| المتغير | الغرض |
|---|---|
| `GA_MEASUREMENT_ID` + `GA_API_SECRET` | إرسال أحداث الشراء إلى Google Analytics 4 (Measurement Protocol) |
| `FB_PIXEL_ID` + `FB_ACCESS_TOKEN` | Meta / Facebook Conversions API |
| `TIKTOK_PIXEL_ID` + `TIKTOK_ACCESS_TOKEN` | TikTok Conversions API |
| `MIXPANEL_TOKEN` | Mixpanel |
| `HUBSPOT_API_KEY` + `HUBSPOT_PIPELINE` + `HUBSPOT_OWNER_ID` + `HUBSPOT_CLOSED_WON_STAGE` | تحويل الطلبات إلى صفقات HubSpot |
| `SALESFORCE_LOGIN_URL` + `SALESFORCE_CLIENT_ID` + `SALESFORCE_CLIENT_SECRET` + `SALESFORCE_USERNAME` + `SALESFORCE_PASSWORD` + `SALESFORCE_SECURITY_TOKEN` | مزامنة العملاء مع Salesforce |
| `TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHAT_ID` | إشعار المبيعات على تيليجرام |
| `CUSTOMER_EMAIL_WEBHOOK_URL` + `CUSTOMER_EMAIL_API_KEY` | إرسال بريد تأكيد للعميل |
| `GEMINI_API_KEY` | تشغيل مساعد الدردشة في `/api/chat` (بدونه تظهر رسالة خطأ في الشات فقط) |

#### Supabase (اختياري — للمسار البديل `api/webhook-supabase.js`)

| المتغير | الغرض |
|---|---|
| `SUPABASE_URL` | رابط المشروع |
| `SUPABASE_SERVICE_ROLE_KEY` | مفتاح service role (يُقرأ أيضًا من `NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY`) |
| `SUPABASE_WEBHOOK_TABLE` | اسم الجدول، افتراضيًا `webhook_events` |
| `SUPABASE_KEY` | مستخدم فقط في `config.js` غير المستخدم |

>  لا تضع مفاتيح حساسة باسم يبدأ بـ `NEXT_PUBLIC_`؛ لأنها تُضمَّن في كود المتصفح. استخدم `SUPABASE_SERVICE_ROLE_KEY` فقط.

#### ضبط أداء العامل والحد من الطلبات (اختياري — توجد قيم افتراضية)

| المتغير | الافتراضي | الغرض |
|---|---|---|
| `WORKER_CONCURRENCY` | 5 | عدد المهام المتوازية في العامل |
| `WORKER_BATCH_SIZE` | 5 | حجم دفعة المهام |
| `WORKER_MAX_ATTEMPTS` | — | أقصى عدد محاولات |
| `WORKER_LEASE_SECONDS` | — | مدة حجز المهمة |
| `WORKER_POLL_INTERVAL_MS` | — | فترة الاستطلاع |
| `WORKER_RETRY_BASE_MS` / `WORKER_RETRY_MAX_MS` | — | حدود إعادة المحاولة |
| `WORKER_ID` | اسم الجهاز | معرّف العامل |
| `MAX_JOB_ATTEMPTS` / `JOB_BATCH_SIZE` / `JOB_LEASE_SECONDS` | داخل `api/webhook.js` | نفس المفهوم من جهة الـ webhook |
| `CHECKOUT_RATE_LIMIT_MAX` / `CHECKOUT_RATE_LIMIT_WINDOW_MS` | داخل `api/checkout.js` | الحد من تكرار طلبات الدفع |

### 3.3 ملف `.env.local` للتجربة المحلية

أنشئ ملفًا باسم `.env.local` في جذر المشروع (وهو مستثنى بالفعل من Git عبر `.gitignore`):

```bash
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net
MONGODB_DATABASE=desinahub
MONGODB_ORDERS_COLLECTION=orders
MONGODB_WEBHOOK_COLLECTION=webhook_events
MONGODB_JOBS_COLLECTION=payment_jobs
MONGODB_DLQ_COLLECTION=dlq
CRON_SECRET=ضع-قيمة-عشوائية-طويلة
GEMINI_API_KEY=مفتاح-جيميني
```

### 3.4 إعدادات النشر على Vercel

- **Framework Preset**: Next.js — لا تحتاج أي إعداد يدوي.
- **Build Command**: `npm run build` — **Output**: تلقائي.
- **Node Version**: 20 أو أحدث.
- **Cron Jobs**: معرّفة مسبقًا في `vercel.json` وتشغّل `/api/worker` يوميًا (`0 0 * * *`).
  إن أردت تشغيلًا كل ساعة استخدم `0 * * * *`.
- **Domain**: اربط النطاق ثم حدّث `SITE_URL` في `src/lib/site.ts` ليطابقه تمامًا (مع أو بدون `www`).

---

## 4) ملاحظات وتحذيرات معروفة

1. **تحذيران أثناء `npm run build` (غير مؤثرين، لكن يمكن تنظيفهما):**
   - `tailwind.config.js` مكتوب بصيغة CommonJS (`module.exports`) بينما `package.json` يحمل `"type": "module"`.
   - نفس الملف يشير إلى الإضافة `tailwindcss-animate` وهي **غير مثبّتة** في `package.json`.
   - المشروع يعمل بشكل سليم لأن Tailwind 4 يعتمد على `@tailwindcss/postcss` وملفات CSS، وملف `tailwind.config.js` تراثي من النسخة القديمة.
   - **للتخلص من التحذيرين** نفّذ أحد الخيارين:
     - الخيار أ (الأسهل): احذف `tailwind.config.js` من الجذر (لا يُقرأ في Tailwind 4).
     - الخيار ب: ثبّت الإضافة وحوّل الملف إلى ESM:
       ```bash
       npm i -D tailwindcss-animate
       ```
       ثم اجعل محتوى الملف `export default { ... }` بدل `module.exports = { ... }`.

2. **`config.js` ملف تراثي غير مستورد من أي مكان** في المشروع، ويعتمد على الحزمة `@supabase/supabase-js` وهي **غير مثبّتة**. إن لم تكن تستخدمه فاحذفه؛ وإن أردت استخدامه نفّذ `npm i @supabase/supabase-js` واضبط `SUPABASE_URL` و`SUPABASE_KEY`.

3. **`api/webhook-supabase.js` يحتوي على روابط بديلة غير مكتملة** من النسخة الأصلية (مثل `https://telegram.org{...}` و`https://tiktok.com`). هذه المسارات لا تُرسل إشعارات فعلية. إن أردت استخدام هذا الملف بدل `api/webhook.js` فيجب تصحيح الروابط إلى:
   - `https://api.telegram.org/bot<TOKEN>/sendMessage`
   - `https://analytics.tiktok.com/api/v2/pixel/activate`

4. **`/api/chat` يعيد 404 محليًا** عند التشغيل بـ `next start`؛ لأن دوال `api/` تُنفَّذ على Vercel فقط. استخدم `vercel dev` أو النشر للتجربة.

5. **المنتجات كلها من ملف واحد**: `src/lib/catalog.json`. أي تعديل على الأسعار أو الصور أو الخصومات يتم هناك، ولا توجد قاعدة بيانات للمنتجات.

6. **اللغة**: التبديل يتم عبر كوكي `desina_lang` بقيمة `ar` أو `en`، والاتجاه `dir` يُضبط على مستوى `<html>` في `src/app/layout.tsx`. كل نصوص الواجهة تمر عبر `src/lib/i18n.ts`.

7. **الصفحتان `/industrial` و`/tourism`** تحتفظان بتصميمهما الخاص (هوية الخدمات) داخل نفس الرأس والشريط السفلي الجديدين — هذا مقصود ولا يجب توحيدهما مع صفحات المنتجات.

8. **سلة المشتريات** تُخزَّن في `localStorage` بمفتاح خاص بالمتجر؛ لذلك لا توجد سلة مشتركة بين الأجهزة، والتأكيد النهائي يتم عبر السيرفر في `/api/checkout`.

---

## 5) قائمة تحقق سريعة قبل النشر

- [ ] `npm install` ثم `npm run build` ينجح بدون أخطاء.
- [ ] ضبط متغيرات MongoDB السبعة + `CRON_SECRET` على Vercel.
- [ ] ضبط مفاتيح بوابة الدفع المستخدمة + أسرار الـ webhook الخاصة بها.
- [ ] تحديث `SITE_URL` و`WHATSAPP` في `src/lib/site.ts`.
- [ ] ربط النطاق والتأكد أن `next.config.mjs` يسمح بنطاقات الصور الصحيحة.
- [ ] تجربة مسار كامل: إضافة منتج → فتح درج السلة → الدفع → وصول إشعار إلى `/api/webhook`.
- [ ] اختبار الصفحة بالعربية (RTL) وبالإنجليزية (LTR) على الموبايل والديسكتوب.
