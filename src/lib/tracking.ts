declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: ((...args: unknown[]) => void) & { queue?: unknown[][] };
    ttq?: { track?: (...args: unknown[]) => void; page?: () => void };
  }
}

function numberValue(value: unknown): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function textValue(value: unknown, max = 500): string {
  return String(value ?? '').trim().slice(0, max);
}

function currencyValue(value = 'EGP'): string {
  return textValue(value).toUpperCase() || 'EGP';
}

export function trackViewContent(
  productName: string,
  price: number,
  category: string,
  currency = 'EGP',
  productId: string | number | null = null,
) {
  if (typeof window === 'undefined') return;
  const safePrice = numberValue(price);
  const safeCurrency = currencyValue(currency);
  const safeName = textValue(productName);
  const safeCategory = textValue(category);
  const safeId = textValue(productId, 100);

  window.gtag?.('event', 'view_item', {
    currency: safeCurrency,
    value: safePrice,
    items: [
      {
        item_id: safeId || undefined,
        item_name: safeName,
        item_category: safeCategory,
        price: safePrice,
        quantity: 1,
      },
    ],
  });

  window.fbq?.('track', 'ViewContent', {
    content_ids: safeId ? [safeId] : undefined,
    content_name: safeName,
    content_category: safeCategory,
    value: safePrice,
    currency: safeCurrency,
  });

  window.ttq?.track?.('ViewContent', {
    contents: [
      {
        ...(safeId ? { content_id: safeId } : {}),
        content_name: safeName,
        content_category: safeCategory,
        price: safePrice,
        quantity: 1,
      },
    ],
    value: safePrice,
    currency: safeCurrency,
  });
}

export function trackAddToCart(
  productName: string,
  price: number,
  category: string,
  quantity = 1,
  currency = 'EGP',
  productId: string | number | null = null,
) {
  if (typeof window === 'undefined') return;
  const safePrice = numberValue(price);
  const safeQuantity = Math.max(1, numberValue(quantity));
  const safeCurrency = currencyValue(currency);
  const safeName = textValue(productName);
  const safeCategory = textValue(category);
  const safeId = textValue(productId, 100);
  const totalValue = safePrice * safeQuantity;

  window.gtag?.('event', 'add_to_cart', {
    currency: safeCurrency,
    value: totalValue,
    items: [
      {
        item_id: safeId || undefined,
        item_name: safeName,
        item_category: safeCategory,
        price: safePrice,
        quantity: safeQuantity,
      },
    ],
  });

  window.fbq?.('track', 'AddToCart', {
    content_ids: safeId ? [safeId] : undefined,
    content_name: safeName,
    content_category: safeCategory,
    value: totalValue,
    currency: safeCurrency,
  });

  window.ttq?.track?.('AddToCart', {
    contents: [
      {
        ...(safeId ? { content_id: safeId } : {}),
        content_name: safeName,
        content_category: safeCategory,
        price: safePrice,
        quantity: safeQuantity,
      },
    ],
    value: totalValue,
    currency: safeCurrency,
  });
}

export function beginCheckout(
  totalCartValue: number,
  currency = 'EGP',
  orderId: string | null = null,
  paymentMethod: string | null = null,
) {
  if (typeof window === 'undefined') return;
  const safeValue = numberValue(totalCartValue);
  const safeCurrency = currencyValue(currency);
  const parameters: Record<string, unknown> = {
    currency: safeCurrency,
    value: safeValue,
  };
  if (orderId) parameters.transaction_id = textValue(orderId, 100);
  if (paymentMethod) parameters.payment_type = textValue(paymentMethod, 100);

  window.gtag?.('event', 'begin_checkout', parameters);

  window.fbq?.('track', 'InitiateCheckout', {
    value: safeValue,
    currency: safeCurrency,
    ...(orderId ? { order_id: textValue(orderId, 100) } : {}),
  });

  window.ttq?.track?.('InitiateCheckout', {
    value: safeValue,
    currency: safeCurrency,
    ...(orderId ? { order_id: textValue(orderId, 100) } : {}),
  });
}

export const DESINAHUB_TRACKING_CONFIG = {
  GOOGLE_ANALYTICS_ID: 'G-SSVGRC4H86',
  FACEBOOK_PIXEL_ID: '790032697153678',
  TIKTOK_PIXEL_ID: 'D98CCTRC77UEFAL2JAJG',
};
