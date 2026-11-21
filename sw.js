const CACHE_NAME = 'sinhala-font-studio-v22-bullets-gaps';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './css/style.css',
  './js/engine/unicodeToFm.js',
  './js/engine/fmToUnicode.js',
  './js/engine/unicodeToIsi.js',
  './js/engine/isiToUnicode.js',
  './js/engine/singlishToUnicode.js',
  './js/engine/mixedFontFormatter.js',
  './js/engine/docxBuilder.js',
  './js/app.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './fonts/4u-Bindumathi.woff2',
  './fonts/FM-Malithi.woff2',
  './fonts/FM-Abhaya.woff2',
  './fonts/IsiAbhaya.woff2',
  './assets/awc-letterhead.jpg',
  './assets/awc-letterhead-header.jpg',
  './assets/awc-letterhead-footer.jpg',
  './assets/signatures/gihan-dinushka.jpg',
  './assets/signatures/chamith-nanayakkara.jpg',
  './assets/signatures/thilini-gamage.jpg',
  './assets/signatures/charuka-wickramasekara.png',
  './assets/signatures/mihiri-siriwardena.png',
  './assets/signatures/aravinda-fernando.jpg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      // cache: 'reload' bypasses the browser HTTP cache, so a new
      // service worker never installs stale copies of the app code.
      for (const url of ASSETS_TO_CACHE) {
        try {
          const response = await fetch(new Request(url, { cache: 'reload' }));
          if (response.ok) await cache.put(url, response);
        } catch (err) { /* offline install: asset is cached on first fetch */ }
      }
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  const isCode = event.request.mode === 'navigate' ||
    url.pathname.endsWith('.js') || url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.html') || url.pathname.endsWith('.json');
  // App code: network first, so the latest build is always used for
  // the app itself and for Print/PDF (cache is the offline fallback).
  if (isCode) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }
  // Fonts and images are large and unchanging: cache first.
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});
