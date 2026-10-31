import type { Metadata } from "next";
import { BadgeCheck, Layers } from "lucide-react";
import { products } from "@/data/products";
import { categories } from "@/data/categories";
import { getServerLang } from "@/lib/i18n-server";
import { pick, translate } from "@/lib/i18n";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { CategoryExplorer } from "@/components/catalog/category-explorer";

export const metadata: Metadata = {
  title: "Shop all products — every DeSinaHub department",
  description:
    "Browse every product at DeSinaHub: mobiles, computers, home appliances, outlet finds, sportswear, fashion and genuine software licences. Filter by department, price and offers.",
  alternates: {
    canonical: "/shop",
    languages: {
      "ar-EG": "/shop",
      "en-EG": "/shop",
    },
  },
};

export default async function ShopPage() {
  const lang = await getServerLang();
  const t = (key: string) => translate(lang, key);

  return (
    <>
      <PageHero
        kicker={pick(lang, "The full catalogue", "الكتالوج الكامل")}
        title={t("nav.allProducts")}
        subtitle={pick(
          lang,
          "Every department in one place — flagship technology, home essentials, outlet markdowns, performance wear, fashion and genuine digital licences.",
          "كل الأقسام في مكان واحد — تقنية رائدة، مستلزمات منزلية، تخفيضات أوت ليت، ملابس أداء، أزياء وتراخيص رقمية أصلية.",
        )}
        image="/products/p13.webp"
        imageAlt={pick(lang, "DeSinaHub product collection", "مجموعة منتجات ديسينا هب")}
        crumbs={[{ label: t("nav.shop") }]}
      >
        <div className="category-hero__meta">
          <span className="chip">
            <Layers aria-hidden="true" style={{ width: 14, height: 14 }} />
            {products.length} {t("common.items")}
          </span>
          <span className="chip">
            <BadgeCheck aria-hidden="true" style={{ width: 14, height: 14 }} />
            {pick(lang, "Authentic products", "منتجات أصلية")}
          </span>
          <span className="chip">
            {categories.filter((category) => category.kind === "products").length}{" "}
            {pick(lang, "departments", "أقسام")}
          </span>
        </div>
      </PageHero>

      <section className="section section--flush-top">
        <div className="shell">
          <SectionHeading
            kicker={pick(lang, "Find your next favourite", "اعثر على اختيارك القادم")}
            title={pick(lang, "Filter the entire store", "فلتر المتجر بالكامل")}
            subtitle={pick(
              lang,
              "Search by name or code, filter by department or offers, then sort by price.",
              "ابحث بالاسم أو الكود، وفلتر بالقسم أو العروض، ثم رتب بالسعر.",
            )}
          />
          <CategoryExplorer products={products} />
        </div>
      </section>
    </>
  );
}
