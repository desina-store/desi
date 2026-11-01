'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ChevronDown, ClipboardList, ShoppingBag } from 'lucide-react';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { formatPrice } from '@/lib/format';
import { readOrders, type ArchivedOrder } from '@/lib/cart';
import { paymentMethodLabel } from '@/lib/checkout';
import { getProduct } from '@/lib/products';

const STATUS_COPY = {
  pending: { en: 'Awaiting payment confirmation', ar: 'بانتظار تأكيد الدفع' },
  paid: { en: 'Paid — processing', ar: 'مدفوع — قيد التجهيز' },
  shipped: { en: 'Shipped', ar: 'تم الشحن' },
  delivered: { en: 'Delivered', ar: 'تم التسليم' },
};

export function OrdersList() {
  const { lang, t } = useLanguage();
  const [orders, setOrders] = useState<ArchivedOrder[] | null>(null);

  useEffect(() => {
    setOrders(readOrders().slice().reverse());
  }, []);

  if (orders === null) {
    return (
      <div className="surface-card space-y-3 p-5">
        {Array.from({ length: 2 }, (_, index) => (
          <div key={index} className="h-28 animate-pulse rounded-2xl bg-ink/[0.04]" />
        ))}
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="surface-card flex flex-col items-center justify-center px-6 py-16 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-canary/50 text-olive-dark">
          <ClipboardList className="h-7 w-7" />
        </span>
        <h2 className="mt-5 text-xl font-extrabold text-ink">{t('orders.empty')}</h2>
        <p className="mt-1 text-sm text-muted">{t('orders.emptyBody')}</p>
        <Link href="/" className="btn-primary mt-6">
          {t('orders.start')}
          <ArrowRight className="h-4 w-4 rtl-flip" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => {
        const status = STATUS_COPY[(order.status as keyof typeof STATUS_COPY) ?? 'pending'] ?? STATUS_COPY.pending;
        return (
          <details key={order.id} className="surface-card group overflow-hidden">
            <summary className="flex cursor-pointer flex-wrap items-center gap-3 p-4 sm:p-5 [&::-webkit-details-marker]:hidden">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-canary/50 text-olive-dark">
                <ShoppingBag className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-mono text-sm font-extrabold text-ink" dir="ltr">
                  {order.id}
                </p>
                <p className="mt-0.5 text-[0.6875rem] font-semibold text-muted">
                  {t('orders.date')}: {order.date} · {order.items.length} {t('cart.itemsMany')}
                  {order.paymentMethod ? ` · ${paymentMethodLabel(order.paymentMethod, lang)}` : ''}
                </p>
              </div>
              <div className="text-end">
                <p className="text-sm font-extrabold text-ink">{formatPrice(order.total, lang)}</p>
                <p className="mt-0.5 inline-flex rounded-full bg-olive/10 px-2 py-0.5 text-[0.5625rem] font-extrabold text-olive">
                  {status[lang]}
                </p>
              </div>
              <ChevronDown className="h-4 w-4 shrink-0 text-muted transition-transform group-open:rotate-180" />
            </summary>

            <div className="border-t border-ink/[0.06] bg-white/40 px-4 py-3 sm:px-5">
              <ul className="divide-y divide-ink/[0.05]">
                {order.items.map((item) => {
                  const product = getProduct(item.code);
                  return (
                    <li key={item.code} className="flex items-center gap-3 py-2.5">
                      {product ? (
                        <div className="product-media relative h-11 w-11 shrink-0 rounded-xl">
                          <Image src={product.image} alt={product.name[lang]} fill sizes="44px" className="object-cover" />
                        </div>
                      ) : (
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ink/5">
                          <ShoppingBag className="h-4 w-4 text-muted" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-extrabold text-ink">
                          {product ? product.name[lang] : item.name}
                        </p>
                        <p className="text-[0.625rem] font-semibold text-muted">
                          CODE-{item.code} · × {item.quantity}
                        </p>
                      </div>
                      <span className="text-xs font-extrabold text-ink">
                        {formatPrice(item.price * item.quantity, lang)}
                      </span>
                    </li>
                  );
                })}
              </ul>
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-ink/[0.06] pt-3">
                <Link href="/tracking" className="text-[0.6875rem] font-extrabold text-olive underline decoration-canary-deep decoration-2 underline-offset-4">
                  {t('footer.track')}
                </Link>
                <p className="text-xs font-extrabold text-ink">
                  {t('orders.total')}: {formatPrice(order.total, lang)}
                </p>
              </div>
            </div>
          </details>
        );
      })}
    </div>
  );
}
