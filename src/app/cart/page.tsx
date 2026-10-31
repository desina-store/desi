import type { Metadata } from "next";
import { CartPageClient } from "@/components/cart/cart-page-client";

export const metadata: Metadata = {
  title: "Your cart — review your DeSinaHub order",
  description:
    "Review the products in your DeSinaHub cart, adjust quantities and continue to secure checkout.",
  alternates: { canonical: "/cart" },
  robots: { index: false, follow: true },
};

export default function CartPage() {
  return <CartPageClient />;
}
