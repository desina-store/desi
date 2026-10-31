import { categories } from "./categories";

export const primaryNav = [
  { href: "/shop", key: "nav.shop" },
  { href: "/offers", key: "nav.offers" },
  { href: "/orders", key: "nav.orders" },
  { href: "/reviews", key: "nav.reviews" },
  { href: "/support", key: "nav.support" },
] as const;

export const menuHeaderLinks = [
  { href: "/", key: "nav.home" },
  { href: "/shop", key: "nav.allProducts" },
  { href: "/offers", key: "nav.offers" },
  { href: "/reviews", key: "nav.reviews" },
  { href: "/orders", key: "nav.orders" },
  { href: "/support", key: "nav.support" },
] as const;

export const menuCategories = categories;

export const menuUtilityLinks = [
  { href: "/faq", key: "nav.faq" },
  { href: "/policies", key: "nav.policies" },
  { href: "/account", key: "nav.account" },
  { href: "/checkout", key: "nav.checkout" },
] as const;

export const footerShopLinks = [
  { href: "/shop" },
  { href: "/category/mobiles" },
  { href: "/category/computers" },
  { href: "/category/appliances" },
  { href: "/category/outlet" },
  { href: "/category/sports" },
  { href: "/category/fashion" },
];

export const footerServiceLinks = [
  { href: "/category/industrial" },
  { href: "/category/tourism" },
];

export const footerHelpLinks = [
  { href: "/orders" },
  { href: "/policies#shipping" },
  { href: "/policies#returns" },
  { href: "/policies#payment" },
  { href: "/faq" },
  { href: "/support" },
  { href: "/reviews" },
];
