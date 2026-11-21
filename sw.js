const CACHE_NAME = 'sinhala-font-studio-v5-fonts';
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
  './fonts/IsiAbhaya.woff2'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
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
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});
