# DeSinaHub — Full-Stack Store & PWA

متجر **DeSinaHub** بنسخته الجديدة: واجهة عربية/إنجليزية مبنية بـ **Next.js App Router** مع سلة وشراء كاملين، فواتير ديناميكية، بوابات دفع، PWA، وSEO. الموقع المباشر: [www.desinahub.com](https://www.desinahub.com).

## Stack

- Next.js 16 (App Router, Turbopack) + React 19 + TypeScript strict
- CSS design system خاص (بدون Tailwind utilities) وخط Cairo Variable محلي
- Swiper للعروض والأقسام والتقييمات، lucide-react للأيقونات
- MongoDB + Stripe + Gemini API عبر الباك إند الأصلي المحفوظ
- PWA: `manifest.ts` + `public/sw.js` + تسجيل الإنتاج فقط

## Quick start

```bash
npm install
cp .env.example .env.local   # املأ المتغيرات المطلوبة
npm run dev                  # http://localhost:3000
```

| Script | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint (flat config) |
| `npm run typecheck` | `tsc --noEmit` |

> Node.js **20.9+** مطلوب. بدون `MONGODB_URI` صالح تعمل الواجهة والسلة بالكامل، لكن `/api/checkout` يرفض إنشاء الطلب بخطأ خادم (المجموع يُحسب دائماً من قاعدة البيانات، وليس من المتصفح).

## Environment

انسخ [`.env.example`](./.env.example) إلى `.env.local` ولا ترفع ملف الأسرار إلى Git.

- **الحد الأدنى للتشغيل المحلي الكامل:** `MONGODB_URI`, `MONGODB_DATABASE`
- **الدفع:** مفاتيح Stripe/PayPal/Paymob/Fawry وسر Webhook الخاص بكل بوابة
- **الشات:** `GEMINI_API_KEY`
- **SEO/PWA:** `NEXT_PUBLIC_SITE_URL` (اختياري، الافتراضي `https://www.desinahub.com`)

## Architecture

```
src/app/                 صفحات App Router (الرئيسية، المتجر، الأقسام، المنتج، السلة، الدفع، الطلبات…)
src/components/          عناصر الواجهة (Chrome, Cart, Checkout, Home, Product, Orders, PWA)
src/components/providers قواعد السلة واللغة
src/data/                كتالوج المنتجات، الأقسام، محتوى الصفحات، JSON-LD الأصلي
src/lib/                 i18n، عملة/تواريخ، إعدادات الموقع، أدوات الشراء
src/styles/              tokens/base/chrome/home/catalog/commerce/pages
src/pages/api/           جسور رقيقة إلى معالجات `api/` الأصلية (للتشغيل عبر next start)
public/                  صور المنتجات والماركات والدفع، الأيقونات، الخط، service worker
api/                     ★ الباك إند الأصلي (بدون أي تعديل)
lib/mongodb.js           ★ اتصال MongoDB الأصلي (بدون تعديل)
workers/paymentworker.js ★ عامل الدفع الأصلي (بدون تعديل)
vercel.json              ★ إعداد Vercel الأصلي (بدون تعديل)
```

### الباك إند المحفوظ

هذه الملفات منقولة **حرفياً** من المشروع الأصلي ولم تتغير بايت واحداً:

`api/a2a.js`, `api/chat.js`, `api/checkout.js`, `api/webhook.js`, `api/webhook-supabase.js`, `api/worker.js`, `lib/mongodb.js`, `workers/paymentworker.js`, `vercel.json`.

- نفس مسارات `/api/*`، نفس MongoDB والمجموعات، نفس مفاتيح Stripe/PayPal/Paymob/Fawry وWebhooks.
- نفس ترتيب حسابات الشحن والضريبة داخل `checkout.js`، ويُعاد حساب المجموع دائماً على السيرفر.
- جسور `src/pages/api/*` تستدعي نفس المعالجات حتى تعمل محلياً عبر `next start`؛ دون تكرار أي منطق أعمال.
- حماية Webhook من التعديل: تمرير الجسم الخام (raw body) في `src/pages/api/webhook.js` للحفاظ على توقيع Stripe.

### دورة الشراء

1. السلة والكميات في `localStorage` (`desina_cart` + `orders`).
2. رقم مرجعي عشوائي بصيغة `DS-HUB-######` لكل طلب.
3. صفحة دفع ببيانات العميل و**12 طريقة دفع**، مع تحقق ورسائل خطأ واضحة.
4. `POST /api/checkout` (الباك إند) يتحقق من المنتجات ويحسب الإجمالي ثم يعيد رابط بوابة الدفع.
5. فاتورة داخل الموقع (Modal) برقم الطلب والتفاصيل والإجمالي، ثم تحويل تلقائي للبوابة عبر رابط دفع يحتفظ بـ `order_id` و`amount` و`currency`.
6. أرشفة الطلب محلياً، صفحة نجاح، وتتبّع الطلب من `/orders` أو `/account`.

### الهوية البصرية

رخام فاتح، بطاقات بيضاء، داكن `#1C1C1C`، ولمسة حمراء برتقالية واحدة `#FF3B30` لكل الأزرار والتفاعلات. لا أخضر في أزرار أو خلفيات أو عناصر تفاعلية. الهيدر/الفوتر مشتركان، قائمة الدائرة الأصلية محفوظة، وشريط السوشيال فوق الفوتر بألوانه الأصلية.

### i18n

العربية هي الافتراضية مع `dir="rtl"`، والتبديل الفوري EN/AR يحفظ الاختيار في كوكي `desina_lang` و`localStorage`. تُترجم الواجهة والمنتجات والتواريخ والعملة والجداول.

### SEO

- `robots.ts` و`sitemap.ts` ديناميكيان لكل الأقسام والمنتجات.
- JSON-LD الرئيسي محفوظ كما هو في `src/data/home-schema.json` ويُطابق كتلة الموقع الأصلي.
- JSON-LD لكل منتج (Offer بالجنيه المصري)، FAQPage، BreadcrumbList، وOpen Graph/Twitter cards.
- خطوات الدفع والطلبات والحساب مستبعدة من الفهرسة.

### PWA والتبكسل

- `viewport-fit=cover` + أبعاد `100dvh`، خط Cairo محلي لتقليل الاختلاف بين المتصفحات.
- `manifest.ts` بأيقونات 192/512/maskable، `apple-mobile-web-app` وsplash، وتسجيل `sw.js` في الإنتاج فقط مع استراتيجية network-first للصفحات وcache-first للأصول.
- التطبيق standalone، وشاشة `/offline` عند انقطاع الشبكة.
- لا يوجد أي تحجيم `transform: scale` للواجهة، ما يمنع التبكسل في متصفحات فيسبوك/إنستجرام/تيك توك المدمجة.

### Pixels

GA `G-SSVGRC4H86` وMeta `790032697153678` وTikTok `D98CCTRC77UEFAL2JAJG`، مع أحداث view/add-to-cart/begin-checkout. لا يُرسل حدث Purchase من الواجهة؛ التحويلات تُدار عبر Webhooks الدفع الأصلية.

## Deploy on Vercel

1. ارفع المشروع إلى GitHub ثم Import في Vercel (Framework: Next.js).
2. أضف متغيرات البيئة من `.env.example` في Project Settings → Environment Variables.
3. في MongoDB Atlas اسمح لعناوين Vercel (أو `0.0.0.0/0`) وحدّد `MONGODB_URI` بقاعدة الإنتاج.
4. أضف روابط Webhook لكل بوابة إلى المسار `/api/webhook` مع نفس الأسرار.
5. Deploy. يعمل `vercel.json` المحفوظ كما هو بما فيه Cron اليومي لـ `/api/worker`.

## Checks

```bash
npm run typecheck && npm run lint && npm run build
```

هذه الأوامر تمر بدون أخطاء على هذه النسخة. تم اختبار المسار الكامل (الرئيسية → السلة → الدفع → الفاتورة → بوابة الدفع → الطلبات → الحساب → البحث → الأقسام → العربية/RTL → PWA) عبر Chrome/CDP.
