import type { Metadata } from "next";
import { CheckoutClient } from "@/components/checkout/checkout-client";

export const metadata: Metadata = {
  title: "Secure checkout — DeSinaHub",
  description:
    "Complete your DeSinaHub order securely with mobile wallets, bank transfers, Visa, Mastercard, PayPal or Apple Pay.",
  alternates: { canonical: "/checkout" },
  robots: { index: false, follow: true },
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
