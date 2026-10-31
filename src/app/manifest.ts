import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/?source=pwa",
    name: "deSinahub — ديسينا ستور",
    short_name: "DeSinaHub",
    description:
      "DeSinaHub — mobiles, computers, home appliances, outlet, sports, fashion, industrial and tourism services. Secure checkout and fast delivery across Egypt.",
    lang: "ar",
    dir: "rtl",
    start_url: "/?source=pwa",
    scope: "/",
    display: "standalone",
    display_override: ["standalone", "minimal-ui"],
    orientation: "portrait-primary",
    background_color: "#EDE6D6",
    theme_color: "#EDE6D6",
    categories: ["shopping", "business"],
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Shop",
        short_name: "Shop",
        description: "Browse every DeSinaHub department",
        url: "/shop?source=pwa",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "Offers",
        short_name: "Offers",
        description: "Outlet deals and limited-time prices",
        url: "/offers?source=pwa",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "Orders",
        short_name: "Orders",
        description: "Track a DS-prefixed order",
        url: "/orders?source=pwa",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "Support",
        short_name: "Support",
        description: "Talk to the DeSinaHub team",
        url: "/support?source=pwa",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
    ],
  };
}
