import type { Metadata } from "next";
import { OrdersClient } from "@/components/orders/orders-client";

export const metadata: Metadata = {
  title: "Orders & tracking — DeSinaHub",
  description:
    "Track a DeSinaHub order, review its status and retrieve an invoice using your DS order reference.",
  alternates: { canonical: "/orders" },
  robots: { index: false, follow: true },
};

export default function OrdersPage() {
  return <OrdersClient />;
}
