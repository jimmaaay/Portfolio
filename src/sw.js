
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches
      .open(variables.cacheName)
      // Add the initial files to the sw cache
      .then(cache => cache.addAll(variables.files))
  );
});

// Remove any old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => {
        if (key !== variables.cacheName) return caches.delete(key);
        return true;
      })
    ))
  );
});



// self.addEventListener('fetch', event => {
//   const url = new URL(event.request.url);
  
//   // Browser sync requests
//   if (url.pathname.indexOf('/browser-sync/') === 0) return fetch(event.request);
//   // console.log(url);
//   return fetch(event.request);
// });

