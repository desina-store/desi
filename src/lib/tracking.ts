import type { Product } from "@/data/products";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
    ttq?: {
      track: (event: string, payload?: Record<string, unknown>) => void;
      identify: (payload: Record<string, unknown>) => void;
      page: () => void;
      load: (id: string) => void;
    };
  }
}

type TrackItem = {
  product: Product;
  quantity?: number;
  localizedName: string;
};

export function trackViewContent(item: TrackItem): void {
  try {
    const { product, localizedName } = item;
    window.gtag?.("event", "view_item", {
      currency: "EGP",
      value: product.price,
      items: [
        {
          item_id: `CODE-${product.code}`,
          item_name: localizedName,
          item_category: product.category,
          price: product.price,
          quantity: 1,
        },
      ],
    });
    window.fbq?.("track", "ViewContent", {
      content_name: localizedName,
      content_category: product.category,
      content_ids: [`CODE-${product.code}`],
      value: product.price,
      currency: "EGP",
    });
    window.ttq?.track("ViewContent", {
      contents: [
        {
          content_name: localizedName,
          content_category: product.category,
          price: product.price,
          quantity: 1,
        },
      ],
      value: product.price,
      currency: "EGP",
    });
  } catch {
    // Tracking failures must never block shopping.
  }
}

export function trackAddToCart(item: TrackItem): void {
  try {
    const { product, quantity = 1, localizedName } = item;
    window.gtag?.("event", "add_to_cart", {
      currency: "EGP",
      value: product.price * quantity,
      items: [
        {
          item_id: `CODE-${product.code}`,
          item_name: localizedName,
          item_category: product.category,
          price: product.price,
          quantity,
        },
      ],
    });
    window.fbq?.("track", "AddToCart", {
      content_name: localizedName,
      content_category: product.category,
      content_ids: [`CODE-${product.code}`],
      value: product.price * quantity,
      currency: "EGP",
    });
    window.ttq?.track("AddToCart", {
      contents: [
        {
          content_name: localizedName,
          content_category: product.category,
          price: product.price,
          quantity,
        },
      ],
      value: product.price * quantity,
      currency: "EGP",
    });
  } catch {
    // Tracking failures must never block shopping.
  }
}

export function trackBeginCheckout(
  lines: { product: Product; quantity: number; localizedName: string }[],
  total: number,
  orderId: string,
  paymentMethod: string,
  phone?: string,
): void {
  try {
    window.gtag?.("event", "begin_checkout", {
      currency: "EGP",
      value: total,
      transaction_id: orderId,
      items: lines.map((line) => ({
        item_id: `CODE-${line.product.code}`,
        item_name: line.localizedName,
        item_category: line.product.category,
        price: line.product.price,
        quantity: line.quantity,
      })),
    });

    if (phone) {
      window.fbq?.("init", "790032697153678", { ph: phone });
    }
    window.fbq?.("track", "InitiateCheckout", {
      value: total,
      currency: "EGP",
      content_ids: lines.map((line) => `CODE-${line.product.code}`),
      num_items: lines.reduce((sum, line) => sum + line.quantity, 0),
    });

    if (phone) {
      window.ttq?.identify({ phone_number: phone });
    }
    window.ttq?.track("InitiateCheckout", {
      value: total,
      currency: "EGP",
      contents: lines.map((line) => ({
        content_name: line.localizedName,
        content_category: line.product.category,
        price: line.product.price,
        quantity: line.quantity,
      })),
    });
  } catch {
    // Tracking failures must never block checkout.
  }
}
