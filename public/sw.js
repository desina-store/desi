/* DeSinaHub service worker — app shell, offline fallback and safe static caching. */
const VERSION = "ds-hub-v2";
const STATIC_CACHE = `${VERSION}-static`;
const PAGE_CACHE = `${VERSION}-pages`;
const OFFLINE_URL = "/offline";

const PRECACHE = [
  "/",
  OFFLINE_URL,
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/icon-512-maskable.png",
  "/favicon.jpg",
  "/logo.png",
  "/logo7.png",
  "/manifest.webmanifest",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(STATIC_CACHE);
      await Promise.all(
        PRECACHE.map((url) =>
          cache.add(new Request(url, { cache: "reload" })).catch(() => undefined),
        ),
      );
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  // Caches from earlier naming schemes would otherwise survive forever and keep
  // occupying the visitor's storage after this worker takes over the scope.
  const LEGACY_PREFIXES = ["ds-hub-", "desinahub-"];
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter(
            (key) =>
              LEGACY_PREFIXES.some((prefix) => key.startsWith(prefix)) &&
              key !== STATIC_CACHE &&
              key !== PAGE_CACHE,
          )
          .map((key) => caches.delete(key)),
      );
      if (self.registration.navigationPreload) {
        await self.registration.navigationPreload.enable();
      }
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") self.skipWaiting();
});

function isCacheableAsset(url) {
  return (
    url.origin === self.location.origin &&
    url.pathname.startsWith("/_next/static/") &&
    !url.pathname.endsWith(".html")
  );
}

function isImage(url) {
  return (
    url.origin === self.location.origin &&
    (/^\/products\//.test(url.pathname) ||
      /^\/brands\//.test(url.pathname) ||
      /^\/payments\//.test(url.pathname) ||
      /^\/icons\//.test(url.pathname) ||
      url.pathname.endsWith(".webp") ||
      url.pathname.endsWith(".png") ||
      url.pathname.endsWith(".jpg") ||
      url.pathname.endsWith(".svg") ||
      url.pathname.endsWith(".avif"))
  );
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/api/")) return;
  if (url.searchParams.has("_rsc")) return;

  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const preload = await event.preloadResponse;
          if (preload) return preload;
          const response = await fetch(request);
          if (response && response.status === 200) {
            const cache = await caches.open(PAGE_CACHE);
            cache.put(request, response.clone());
          }
          return response;
        } catch {
          const cached = await caches.match(request);
          if (cached) return cached;
          const offline = await caches.match(OFFLINE_URL);
          if (offline) return offline;
          return new Response("You are offline.", {
            status: 503,
            headers: { "Content-Type": "text/plain; charset=utf-8" },
          });
        }
      })(),
    );
    return;
  }

  if (isCacheableAsset(url) || isImage(url)) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(STATIC_CACHE);
        const cached = await cache.match(request);
        if (cached) {
          fetch(request)
            .then((response) => {
              if (response && response.status === 200) cache.put(request, response);
            })
            .catch(() => undefined);
          return cached;
        }
        try {
          const response = await fetch(request);
          if (response && response.status === 200) cache.put(request, response.clone());
          return response;
        } catch {
          return new Response("", { status: 504 });
        }
      })(),
    );
  }
});
