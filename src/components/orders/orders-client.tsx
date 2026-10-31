"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ExternalLink,
  MessageCircle,
  Package,
  ReceiptText,
  Search,
  SearchX,
} from "lucide-react";
import { getProductByCode } from "@/data/products";
import { formatDate } from "@/lib/i18n";
import {
  findOrder,
  lookupRemoteOrder,
  readOrders,
  type OrderLookup,
  type OrderStatus,
  type StoredOrder,
} from "@/lib/orders";
import {
  PAYMENT_METHODS,
  SOCIAL_LINKS,
  buildGatewayUrl,
  paymentMethodLabel,
  type PaymentMethodId,
} from "@/lib/site";
import { InvoiceModal, type InvoiceSummary } from "@/components/invoice/invoice-modal";
import { useI18n } from "@/components/providers/i18n-provider";

const STATUS: Record<OrderStatus, { className: string; key: string }> = {
  awaiting_payment: { className: "order-status order-status--awaiting", key: "orders.awaiting" },
  processing: { className: "order-status order-status--processing", key: "orders.processing" },
  shipped: { className: "order-status order-status--shipped", key: "orders.shipped" },
  delivered: { className: "order-status order-status--delivered", key: "orders.delivered" },
};

function isPaymentMethodId(value: string | undefined): value is PaymentMethodId {
  return Boolean(value && PAYMENT_METHODS.some((entry) => entry.id === value));
}

function orderGateway(order: StoredOrder): string | null {
  if (order.status !== "awaiting_payment") return null;
  if (!isPaymentMethodId(order.paymentMethod)) return null;
  return buildGatewayUrl(order.paymentMethod, order.id, order.total, order.currency);
}

function toInvoice(order: StoredOrder): InvoiceSummary {
  return {
    orderId: order.id,
    date: order.date,
    method: order.paymentMethod || "—",
    total: order.total,
    customerName: order.customer?.name,
    customerPhone: order.customer?.phone,
    customerEmail: order.customer?.email,
    city: order.customer?.city,
    address: order.customer?.address,
    lines: order.items.map((item) => ({
      code: item.code,
      name: item.name || `CODE-${item.code}`,
      price: item.price,
      quantity: item.quantity,
      image: getProductByCode(item.code)?.img,
    })),
  };
}

export function OrdersClient() {
  const { lang, t, tr, price } = useI18n();
  const [orders, setOrders] = useState<StoredOrder[]>([]);
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);
  const [result, setResult] = useState<StoredOrder | null>(null);
  const [activeOrder, setActiveOrder] = useState<StoredOrder | null>(null);
  const [remote, setRemote] = useState<"idle" | "loading" | OrderLookup["kind"]>("idle");
  const lookupSeq = useRef(0);

  const resolve = useCallback(async (reference: string) => {
    const trimmed = reference.trim();
    if (!trimmed) return;

    const sequence = ++lookupSeq.current;
    setSearched(true);
    setRemote("idle");

    const local = findOrder(trimmed) ?? null;
    setResult(local);
    if (local) return;

    setRemote("loading");
    const outcome = await lookupRemoteOrder(trimmed);
    // A newer lookup superseded this one; drop the stale answer instead of painting it.
    if (sequence !== lookupSeq.current) return;
    setRemote(outcome.kind);
    setResult(outcome.kind === "found" ? outcome.order : null);
  }, []);

  useEffect(() => {
    const list = readOrders();
    setOrders(list);

    const params = new URLSearchParams(window.location.search);
    const requested = (
      params.get("id") ||
      params.get("order_id") ||
      params.get("orderId") ||
      ""
    ).trim();

    if (requested) {
      setQuery(requested);
      void resolve(requested);
    }
  }, [resolve]);

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void resolve(query);
  }

  const activeGateway = activeOrder ? orderGateway(activeOrder) : null;
  const savedOrders = result
    ? orders.filter((order) => order.id !== result.id)
    : orders;
  const activeSubtitle = activeOrder
    ? activeOrder.status === "awaiting_payment"
      ? t("checkout.successSub")
      : tr(
          "Your order is recorded. Keep this invoice for your records.",
          "طلبك مسجل. احتفظ بهذه الفاتورة لسجلاتك.",
        )
    : undefined;

  const renderOrder = (order: StoredOrder) => {
    const status = STATUS[order.status];
    const gateway = orderGateway(order);
    const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
    const method = order.paymentMethod
      ? paymentMethodLabel(order.paymentMethod, lang)
      : "—";

    return (
      <article className="order-card" key={order.id}>
        <div className="order-card__head">
          <div className="order-card__id">
            <strong dir="ltr">{order.id}</strong>
            <span>{formatDate(order.date, lang)}</span>
          </div>
          <span className={status.className}>{t(status.key)}</span>
        </div>

        <div className="order-card__body">
          <div className="order-lines">
            {order.items.slice(0, 8).map((item) => {
              const product = getProductByCode(item.code);
              return (
                <span className="order-line-thumb" key={`${order.id}-${item.code}`}>
                  <Image
                    src={product?.img ?? "/products/p13.webp"}
                    alt={item.name || `CODE-${item.code}`}
                    fill
                    sizes="42px"
                    quality={85}
                  />
                  <span>{item.quantity}</span>
                </span>
              );
            })}
          </div>

          <div className="order-kpis">
            <div>
              <strong>{itemCount}</strong>
              {itemCount === 1 ? t("common.item") : t("common.items")}
            </div>
            <div>
              <strong>{price(order.total)}</strong>
              {t("orders.total")}
            </div>
            <div>
              <strong>{method}</strong>
              {t("orders.payment")}
            </div>
          </div>
        </div>

        <div className="order-card__foot">
          <p className="order-card__footnote">
            {t("orders.status")}: {t(status.key)}
          </p>
          <div className="order-card__actions">
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => setActiveOrder(order)}
            >
              <ReceiptText aria-hidden="true" />
              {t("checkout.invoice")}
            </button>
            {gateway ? (
              <a href={gateway} className="btn btn-primary btn-sm">
                {t("checkout.goToGateway")}
                <ExternalLink aria-hidden="true" />
              </a>
            ) : null}
          </div>
        </div>
      </article>
    );
  };

  return (
    <>
      <section className="orders-page shell">
        <header className="orders-hero">
          <p className="eyebrow eyebrow--plain">{tr("Order desk", "متابعة الطلبات")}</p>
          <h1>{t("orders.title")}</h1>
          <p>{t("orders.subtitle")}</p>
        </header>

        <form
          className="orders-search-card"
          onSubmit={handleSearch}
          role="search"
          aria-busy={remote === "loading"}
        >
          <div className="orders-search-card__field">
            <Search aria-hidden="true" />
            <label htmlFor="order-search" className="sr-only">
              {t("orders.search")}
            </label>
            <input
              id="order-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("orders.searchPlaceholder")}
              autoComplete="off"
              aria-describedby="order-status"
              dir="ltr"
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={remote === "loading"}>
            {t("orders.find")}
          </button>
        </form>

        {searched && remote === "loading" ? (
          <p className="form-note orders-error" id="order-status" role="status" aria-live="polite">
            <span className="spinner spinner--dark" aria-hidden="true" />
            {tr("Checking the order desk…", "جارٍ التحقق من مكتب الطلبات…")}
          </p>
        ) : null}

        {searched && !result && remote !== "loading" ? (
          <p className="form-error orders-error" id="order-status" role="status">
            <SearchX aria-hidden="true" />
            {remote === "rate_limited"
              ? tr(
                  "Too many attempts from this device. Please try again in a minute.",
                  "محاولات كثيرة من هذا الجهاز. أعد المحاولة بعد دقيقة.",
                )
              : remote === "unavailable"
                ? tr(
                    "Order records are unreachable right now. Orders saved on this device still appear below.",
                    "سجل الطلبات غير متاح حالياً. الطلبات المحفوظة على هذا الجهاز تظهر بالأسفل.",
                  )
                : remote === "unverified"
                  ? tr(
                      "We could not verify that reference online. Open the order from the device used at checkout, or contact the order desk.",
                      "لم نتمكن من التحقق من هذا الرقم عبر الإنترنت. افتح الطلب من الجهاز الذي أتممت به الشراء أو تواصل مع مكتب الطلبات.",
                    )
                  : t("orders.notFound")}
          </p>
        ) : null}

        {searched && result ? (
          <section className="orders-list" aria-label={t("orders.search")}>
            <div className="orders-list__head">
              <strong>{t("orders.search")}</strong>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => {
                  lookupSeq.current += 1;
                  setSearched(false);
                  setResult(null);
                  setQuery("");
                  setRemote("idle");
                }}
              >
                {t("common.close")}
              </button>
            </div>
            {renderOrder(result)}
          </section>
        ) : null}

        {orders.length === 0 && !result && remote !== "loading" ? (
          <div className="empty-state orders-error">
            <span className="empty-state__icon">
              <Package aria-hidden="true" />
            </span>
            <h2>{t("orders.empty")}</h2>
            <p>
              {tr(
                "Place your first order and its journey will appear here on this device.",
                "أتمم أول طلب وستظهر رحلته هنا على هذا الجهاز.",
              )}
            </p>
            <Link href="/shop" className="btn btn-primary">
              {t("cart.emptyCta")}
            </Link>
          </div>
        ) : null}

        {savedOrders.length > 0 ? (
          <section className="orders-list" aria-label={t("orders.saved")}>
            <div className="orders-list__head">
              <strong>{t("orders.saved")}</strong>
              <span>
                {tr(
                  `${savedOrders.length} saved order${savedOrders.length === 1 ? "" : "s"}`,
                  `${savedOrders.length} طلب محفوظ`,
                )}
              </span>
            </div>
            {savedOrders.map(renderOrder)}
          </section>
        ) : null}

        <div className="order-help">
          <div>
            <h2>{t("orders.help")}</h2>
            <p>{t("orders.helpText")}</p>
          </div>
          <a
            href={SOCIAL_LINKS.whatsapp}
            target="_blank"
            rel="noreferrer"
            className="btn btn-light"
          >
            <MessageCircle aria-hidden="true" />
            {t("orders.contact")}
          </a>
        </div>
      </section>

      {activeOrder ? (
        <InvoiceModal
          invoice={toInvoice(activeOrder)}
          gatewayUrl={activeGateway}
          subtitle={activeSubtitle}
          onClose={() => setActiveOrder(null)}
        />
      ) : null}
    </>
  );
}
