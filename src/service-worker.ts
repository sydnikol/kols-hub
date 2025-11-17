// Simple PWA service worker for offline caching
const CACHE = "kolhub-v3";

// Type assertion for service worker context
const sw = self as any;

sw.addEventListener("install", (event: any) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) =>
      cache.addAll(["/", "/index.html", "/manifest.json", "/favicon.ico"])
    )
  );
  sw.skipWaiting();
});

sw.addEventListener("activate", (event: any) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => key !== CACHE && caches.delete(key)))
    )
  );
});

sw.addEventListener("fetch", (event: any) => {
  event.respondWith(
    caches.match(event.request).then(
      (resp) =>
        resp ||
        fetch(event.request).then((r) => {
          const copy = r.clone();
          caches.open(CACHE).then((cache) => cache.put(event.request, copy));
          return r;
        })
    )
  );
});
