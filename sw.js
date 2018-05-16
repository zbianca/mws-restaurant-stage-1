// Set a name for the current cache
const cacheName = 'v1';

// Default files to always cache
const cacheFiles = [
  './',
  './index.html',
  './restaurant.html',
  './css/styles.css',
  './js/main.js',
  './js/dbhelper.js',
  './js/restaurant_info.js',
  './data/restaurants.json',
  './img/1.jpg',
  './img/2.jpg',
  './img/3.jpg',
  './img/4.jpg',
  './img/5.jpg',
  './img/6.jpg',
  './img/7.jpg',
  './img/8.jpg',
  './img/9.jpg',
  './img/10.jpg'
];

self.addEventListener('install', function (event) {
  console.log('[SW] Installed');

  event.waitUntil(
    caches.open(cacheName).then(function (cache) {
      return cache.addAll(cacheFiles);
    })
  );
});

self.addEventListener('fetch', function (event) {

  event.respondWith(
    // Timeout time cannot be too short
    fromNetwork(event.request, 10000)
      .catch(function () {
        console.log('[SW] Timeout');
        return fromCache(event.request);
      })
  );
});

function fromNetwork(request, timeout) {
  console.log('[SW] From network');
  return new Promise(function (fulfill, reject) {

    const timeoutId = setTimeout(reject, timeout);

    fetch(request).then(function (response) {
      clearTimeout(timeoutId);
      fulfill(response);
    }, reject);
  });
}

function fromCache(request) {
  console.log('[SW] From cache');
  return caches.open(cacheName).then(function (cache) {
    return cache.match(request).then(function (matching) {
      return matching || Promise.reject('no-match');
    });
  });
}