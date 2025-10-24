const CACHE_NAME = 'mtb-mobile-v25';
const ASSETS = [
  '/',
  '/mobile.html',
  '/mobile.jsx',
  '/styles.css',
  '/manifest.webmanifest'
];

self.addEventListener('install', (e) => {
  e.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(ASSETS);
    self.skipWaiting();
  })());
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)));
    self.clients.claim();
  })());
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (url.origin === location.origin) {
    e.respondWith((async () => {
      const cached = await caches.match(e.request);
      if (cached) return cached;
      try {
        const res = await fetch(e.request);
        const cache = await caches.open(CACHE_NAME);
        cache.put(e.request, res.clone());
        return res;
      } catch {
        return cached || Response.error();
      }
    })());
  }
});
