// Minimal service worker — its only job is to exist, since Chrome/Android
// require one registered before offering a real "Install app" prompt.
// It does a light offline cache of the app shell so the page still opens
// (though signed out) if you're briefly offline.
const CACHE_NAME = 'our-lavender-v1';
const APP_SHELL = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Network-first for everything (so you always get fresh data/UI when online),
  // falling back to cache only if the network fails.
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
