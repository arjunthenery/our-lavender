// Minimal service worker — its only real job is to exist, since Chrome/Android
// require one registered before offering a real "Install app" prompt.
//
// It intentionally does NOT cache or fall back to old content. This app can't
// actually be used offline anyway (signing in and syncing both require a live
// connection), so caching an old snapshot only created confusing bugs where a
// brief connection hiccup would silently serve a stale, outdated version of
// the app instead of a real error. Always just goes straight to the network.

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});
