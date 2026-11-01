/* DeSinaHub service worker — installability without stale storefronts. */
const VERSION = 'desinahub-v4';
const STATIC_CACHE = `${VERSION}-static`;
const PRECACHE = ['/192.png', '/icon-maskable.png', '/logo7.png'];

const OFFLINE_HTML = `<!doctype html>
<html lang="en" dir="ltr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>DeSinaHub — Offline</title>
<style>
  body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#f5f5dc;color:#111;font-family:Cairo,system-ui,-apple-system,"Segoe UI",sans-serif;padding:24px;text-align:center}
  .card{max-width:420px;background:#fffdf5;border:1px solid rgba(17,17,17,.08);border-radius:24px;padding:32px;box-shadow:0 18px 45px rgba(31,31,31,.07)}
  h1{margin:0 0 8px;font-size:22px}p{margin:0;font-size:14px;line-height:1.7;color:#6b7280}
  a{display:inline-block;margin-top:20px;background:#d9f45b;color:#111;text-decoration:none;font-weight:800;padding:12px 22px;border-radius:999px}
</style>
</head>
<body>
<div class="card" dir="auto">
  <h1>You are offline · لا يوجد اتصال</h1>
  <p>Reconnect to continue shopping. Your cart is saved on this device.<br>أعد الاتصال بالإنترنت لمتابعة التسوق. سلتك محفوظة على هذا الجهاز.</p>
  <a href="/">Reload · إعادة المحاولة</a>
</div>
</body>
</html>`;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => Promise.allSettled(PRECACHE.map((asset) => cache.add(asset))))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== STATIC_CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

function isCacheableAsset(url) {
  if (url.pathname.startsWith('/_next/static/')) return true;
  return /\.(?:css|js|mjs|woff2?|ttf|otf|png|jpe?g|webp|avif|svg|ico)$/i.test(url.pathname);
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/_next/data/')) return;

  // Never intercept RSC payloads or prefetches — the App Router owns those.
  if (request.headers.get('RSC') || request.headers.get('Next-Router-Prefetch')) return;
  if (request.headers.get('range')) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(
        () =>
          new Response(OFFLINE_HTML, {
            status: 200,
            headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
          }),
      ),
    );
    return;
  }

  if (!isCacheableAsset(url)) return;

  event.respondWith(
    caches.open(STATIC_CACHE).then(async (cache) => {
      const cached = await cache.match(request);
      if (cached) return cached;
      try {
        const response = await fetch(request);
        if (response && response.ok && response.type === 'basic') {
          cache.put(request, response.clone());
        }
        return response;
      } catch (error) {
        const fallback = await cache.match(request);
        if (fallback) return fallback;
        throw error;
      }
    }),
  );
});
