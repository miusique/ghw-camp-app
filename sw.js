const CACHE = 'ghw-camp-v1';
const OFFLINE_URLS = ['./index.html', './manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(OFFLINE_URLS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Firebase-Requests immer live
  if(e.request.url.includes('firebase') || e.request.url.includes('gstatic')) return;
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
