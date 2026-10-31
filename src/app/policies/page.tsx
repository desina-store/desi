import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import {
  BadgeCheck,
  FileText,
  Lock,
  MessageCircle,
  RotateCcw,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { getServerLang } from "@/lib/i18n-server";
import { pick, translate, type Lang } from "@/lib/i18n";
import { SOCIAL_LINKS } from "@/lib/site";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = {
  title: "Policies — shipping, returns, payments and privacy",
  description:
    "DeSinaHub customer policies: free nationwide shipping, 14-day returns, secure payment gateways, privacy commitments, warranty and terms of service.",
  alternates: {
    canonical: "/policies",
    languages: {
      "ar-EG": "/policies",
      "en-EG": "/policies",
    },
  },
};

type PolicySection = {
  id: string;
  titleKey: string;
  icon: ReactNode;
  body: (lang: Lang) => ReactNode;
};

const sections: PolicySection[] = [
  {
    id: "shipping",
    titleKey: "policies.shipping",
    icon: <Truck aria-hidden="true" />,
    body: (lang) => (
      <>
        <p>
          {pick(
            lang,
            "Delivery is free on every order placed through desinahub.com. Orders are usually prepared and dispatched within 24 business hours.",
            "التوصيل مجاني على كل طلب عبر desinahub.com. تُجهَّز الطلبات وتُشحن عادةً خلال 24 ساعة عمل.",
          )}
        </p>
        <h3>{pick(lang, "Typical delivery windows", "مدد التوصيل المعتادة")}</h3>
        <ul>
          <li>
            {pick(lang, "Cairo & Giza: 1–3 business days.", "القاهرة والجيزة: 1–3 أيام عمل.")}
          </li>
          <li>
            {pick(
              lang,
              "Alexandria, Delta and canal governorates: 2–4 business days.",
              "الإسكندرية والدلتا ومحافظات القناة: 2–4 أيام عمل.",
            )}
          </li>
          <li>
            {pick(
              lang,
              "Upper Egypt, Sinai and remote areas: 3–5 business days.",
              "الصعيد وسيناء والمناطق البعيدة: 3–5 أيام عمل.",
            )}
          </li>
        </ul>
        <p>
          {pick(
            lang,
            "You will receive a DS order reference to follow up. Digital licences are delivered to the contact details you provide, usually within the same business day after payment confirmation.",
            "ستستلم رقم طلب DS للمتابعة. تُسلَّم التراخيص الرقمية على بيانات التواصل التي قدمتها، عادةً في نفس يوم العمل بعد تأكيد الدفع.",
          )}
        </p>
        <div className="policy-callout">
          <MessageCircle aria-hidden="true" />
          <p>
            {pick(
              lang,
              "For a delivery update, send your DS reference on WhatsApp. Any exceptional heavy-item delivery is quoted and confirmed before dispatch.",
              "لتحديث التوصيل، أرسل رقم DS على واتساب. أي توصيل استثنائي للقطع الثقيلة يُسعَّر ويُؤكَّد قبل الشحن.",
            )}
          </p>
        </div>
      </>
    ),
  },
  {
    id: "returns",
    titleKey: "policies.returns",
    icon: <RotateCcw aria-hidden="true" />,
    body: (lang) => (
      <>
        <p>
          {pick(
            lang,
            "Eligible items can be returned or exchanged within 14 days of delivery, provided they are unused, in original condition and include all packaging, accessories and the invoice.",
            "يمكن إرجاع أو استبدال المنتجات المؤهلة خلال 14 يوماً من الاستلام، بشرط أن تكون غير مستخدمة وبحالتها الأصلية مع كل التغليف والملحقات والفاتورة.",
          )}
        </p>
        <h3>{pick(lang, "What is excluded", "ما لا يشمله الإرجاع")}</h3>
        <ul>
          <li>
            {pick(
              lang,
              "Activated software keys, digital subscriptions and gift cards.",
              "مفاتيح البرامج المفعّلة والاشتراكات الرقمية وبطاقات الهدايا.",
            )}
          </li>
          <li>
            {pick(
              lang,
              "Personal-use items such as opened audio accessories, for hygiene reasons.",
              "مستلزمات الاستخدام الشخصي مثل سماعات الأذن المفتوحة، لأسباب صحية.",
            )}
          </li>
          <li>
            {pick(lang, "Final-sale clearance pieces marked as non-returnable.", "قطع التصفية النهائية المعلّمة كغير قابلة للإرجاع.")}
          </li>
        </ul>
        <h3>{pick(lang, "How to start a return", "كيف تبدأ الإرجاع")}</h3>
        <p>
          {pick(
            lang,
            "Message us on WhatsApp with your DS reference, the product code and a short description of the issue. Our team confirms eligibility and arranges collection or drop-off instructions.",
            "راسلنا على واتساب برقم DS وكود المنتج ووصف موجز للمشكلة. يؤكد فريقنا الأهلية ويرتب تعليمات الاستلام أو التسليم.",
          )}
        </p>
        <div className="policy-callout">
          <RotateCcw aria-hidden="true" />
          <p>
            {pick(
              lang,
              "Refunds are returned through the original payment method after inspection. Bank processing times may take 5–10 business days.",
              "تُعاد المبالغ عبر وسيلة الدفع الأصلية بعد الفحص. قد تستغرق معالجة البنك من 5 إلى 10 أيام عمل.",
            )}
          </p>
        </div>
      </>
    ),
  },
  {
    id: "payment",
    titleKey: "policies.payment",
    icon: <ShieldCheck aria-hidden="true" />,
    body: (lang) => (
      <>
        <p>
          {pick(
            lang,
            "We accept Visa, Mastercard, Meeza, PayPal and Fawry, plus InstaPay, mobile wallets and direct bank transfers. Every payment is completed on the secure gateway of your chosen provider.",
            "نقبل فيزا وماستركارد وميزة وباي بال وفوري، بالإضافة إلى إنستا باي والمحافظ الإلكترونية والتحويلات البنكية المباشرة. يتم كل دفع على البوابة الآمنة للمزوّد المختار.",
          )}
        </p>
        <h3>{pick(lang, "Your card data", "بيانات بطاقتك")}</h3>
        <p>
          {pick(
            lang,
            "Card details are entered directly on the provider's encrypted page. DeSinaHub never sees, stores or processes card credentials. Payment confirmation reaches us through verified webhooks.",
            "تُدخل بيانات البطاقة مباشرة على صفحة المزوّد المشفرة. لا ترى ديسينا هب بيانات البطاقة ولا تحفظها ولا تعالجها. يصلنا تأكيد الدفع عبر ويب هوك موثّق.",
          )}
        </p>
        <h3>{pick(lang, "Invoices", "الفواتير")}</h3>
        <p>
          {pick(
            lang,
            "A unique DS invoice reference is generated for every order before payment and is shown again after confirmation. Keep it for warranty claims and support follow-up.",
            "يُولَّد رقم فاتورة DS فريد لكل طلب قبل الدفع ويظهر مرة أخرى بعد التأكيد. احفظه لمطالبات الضمان ومتابعة الدعم.",
          )}
        </p>
        <div className="policy-callout">
          <ShieldCheck aria-hidden="true" />
          <p>
            {pick(
              lang,
              "If a gateway confirmation is delayed, do not pay twice. Contact support with your DS reference and we will verify the status.",
              "لو تأخر تأكيد البوابة، لا تدفع مرتين. تواصل مع الدعم برقم DS وسنتحقق من الحالة.",
            )}
          </p>
        </div>
      </>
    ),
  },
  {
    id: "privacy",
    titleKey: "policies.privacy",
    icon: <Lock aria-hidden="true" />,
    body: (lang) => (
      <>
        <p>
          {pick(
            lang,
            "We collect only what is needed to fulfil your order and support you afterwards: name, phone number, optional email, delivery address and order details.",
            "نجمع فقط ما يلزم لتنفيذ طلبك ودعمك بعده: الاسم ورقم الهاتف والبريد الاختياري وعنوان التوصيل وتفاصيل الطلب.",
          )}
        </p>
        <h3>{pick(lang, "Saved on your device", "المحفوظ على جهازك")}</h3>
        <p>
          {pick(
            lang,
            "Your cart, saved checkout details, order history, language choice and any reviews you publish are stored in this browser's local storage. You can clear them at any time from your browser settings.",
            "تُحفظ سلتك وبيانات الدفع المحفوظة وسجل الطلبات واختيار اللغة وأي تقييمات تنشرها في التخزين المحلي لهذا المتصفح. يمكنك مسحها في أي وقت من إعدادات المتصفح.",
          )}
        </p>
        <h3>{pick(lang, "Measurement tools", "أدوات القياس")}</h3>
        <p>
          {pick(
            lang,
            "We use Google Analytics and approved advertising pixels to understand site performance and improve your experience. These tools do not receive your card data.",
            "نستخدم Google Analytics وبكسلات إعلانية معتمدة لفهم أداء الموقع وتحسين تجربتك. لا تتلقى هذه الأدوات بيانات بطاقتك.",
          )}
        </p>
        <p>
          {pick(
            lang,
            "For privacy questions or deletion requests, email info@desinahub.com with the subject “Privacy”.",
            "لأسئلة الخصوصية أو طلبات الحذف، راسل info@desinahub.com بعنوان «Privacy».",
          )}
        </p>
      </>
    ),
  },
  {
    id: "terms",
    titleKey: "policies.terms",
    icon: <FileText aria-hidden="true" />,
    body: (lang) => (
      <>
        <p>
          {pick(
            lang,
            "By placing an order you confirm that the details you provide are accurate and that you are authorised to use the chosen payment method.",
            "بإتمام الطلب تؤكد أن البيانات المقدمة صحيحة وأنك مخوّل باستخدام وسيلة الدفع المختارة.",
          )}
        </p>
        <h3>{pick(lang, "Pricing & availability", "الأسعار والتوفر")}</h3>
        <p>
          {pick(
            lang,
            "Prices are shown in Egyptian pounds and include applicable taxes. In the rare event of a pricing or stock error, we will contact you before dispatch to confirm or cancel the order.",
            "تُعرض الأسعار بالجنيه المصري وتشمل الضرائب المطبقة. في الحالات النادرة لخطأ في السعر أو المخزون، سنتواصل معك قبل الشحن للتأكيد أو الإلغاء.",
          )}
        </p>
        <h3>{pick(lang, "Acceptable use", "الاستخدام المقبول")}</h3>
        <p>
          {pick(
            lang,
            "Content, images and branding on this site belong to DeSinaHub or their respective owners and may not be reused commercially without permission.",
            "محتوى وصور وعلامات هذا الموقع مملوكة لديسينا هب أو لأصحابها وقد لا يُعاد استخدامها تجارياً دون إذن.",
          )}
        </p>
        <p>
          {pick(
            lang,
            "These terms are governed by Egyptian law. Questions can be sent to info@desinahub.com.",
            "تخضع هذه الشروط للقانون المصري. يمكن إرسال الأسئلة إلى info@desinahub.com.",
          )}
        </p>
      </>
    ),
  },
  {
    id: "warranty",
    titleKey: "policies.warranty",
    icon: <BadgeCheck aria-hidden="true" />,
    body: (lang) => (
      <>
        <p>
          {pick(
            lang,
            "All products are sourced through authorised channels. The warranty duration and coverage are shown on the product page and on your invoice.",
            "كل المنتجات من قنوات معتمدة. مدة الضمان وتغطيته موضحان في صفحة المنتج وعلى فاتورتك.",
          )}
        </p>
        <h3>{pick(lang, "Making a claim", "تقديم مطالبة")}</h3>
        <ul>
          <li>
            {pick(lang, "Keep the DS invoice — it is your proof of purchase.", "احفظ فاتورة DS — فهي إثبات الشراء.")}
          </li>
          <li>
            {pick(
              lang,
              "Contact support with the product code, DS reference and a description of the issue.",
              "تواصل مع الدعم بكود المنتج ورقم DS ووصف المشكلة.",
            )}
          </li>
          <li>
            {pick(
              lang,
              "We coordinate with the authorised service partner and keep you updated.",
              "ننسّق مع مركز الخدمة المعتمد ونطلعك على المستجدات.",
            )}
          </li>
        </ul>
        <p>
          {pick(
            lang,
            "Accidental damage, liquid damage and unauthorised repairs are not covered by the standard warranty. Activated software is covered by the licence terms of its publisher.",
            "الأضرار العرضية وأضرار السوائل والإصلاحات غير المعتمدة غير مشمولة بالضمان القياسي. البرامج المفعّلة تخضع لشروط ترخيص ناشرها.",
          )}
        </p>
        <div className="policy-callout">
          <BadgeCheck aria-hidden="true" />
          <p>
            <strong>{pick(lang, "Buy with confidence.", "اشترِ بثقة.")}</strong>{" "}
            {pick(
              lang,
              "Genuine products, clear warranties and a team that follows up.",
              "منتجات أصلية وضمانات واضحة وفريق يتابع معك.",
            )}
          </p>
        </div>
      </>
    ),
  },
];

export default async function PoliciesPage() {
  const lang = await getServerLang();
  const t = (key: string) => translate(lang, key);

  return (
    <div className="policy-page">
      <PageHero
        kicker={pick(lang, "Clear by design", "وضوح من البداية")}
        title={t("policies.title")}
        subtitle={t("policies.subtitle")}
        crumbs={[{ label: t("nav.policies") }]}
        compact
      >
        <div className="hero__actions">
          <a
            href={SOCIAL_LINKS.whatsapp}
            className="btn btn-primary btn-sm"
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle aria-hidden="true" />
            {pick(lang, "Ask a question", "اسأل سؤالاً")}
          </a>
          <Link href="/faq" className="btn btn-outline btn-sm">
            {t("nav.faq")}
          </Link>
        </div>
      </PageHero>

      <div className="shell">
        <div className="policy-layout">
          <nav className="policy-nav" aria-label={t("nav.policies")}>
            {sections.map((section) => (
              <a key={section.id} href={`#${section.id}`}>
                {t(section.titleKey)}
              </a>
            ))}
          </nav>

          <div className="policy-content">
            {sections.map((section) => (
              <article className="policy-card" id={section.id} key={section.id}>
                <h2>
                  <span>{section.icon}</span>
                  {t(section.titleKey)}
                </h2>
                {section.body(lang)}
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
