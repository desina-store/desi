import type { Metadata } from "next";
import { AccountClient } from "@/components/account/account-client";

export const metadata: Metadata = {
  title: "Your account — DeSinaHub",
  description:
    "Save your delivery details for a faster DeSinaHub checkout, review recent orders and install the store app.",
  alternates: { canonical: "/account" },
  robots: { index: false, follow: true },
};

export default function AccountPage() {
  return <AccountClient />;
}
