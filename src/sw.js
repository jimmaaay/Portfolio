
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches
      .open(variables.cacheName)
      // Add the initial files to the sw cache
      .then(cache => cache.addAll(variables.files))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => {
        // Removes any old caches
        if (key !== variables.cacheName) return caches.delete(key);
        return true;
      })
    ))
  );
});




self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  const { method } = event.request;

  
  if (
    method !== 'GET' // only want to capture GET requests
    // If not on jimmythompson.me or if in /project dir just fetch
    || !(url.origin === location.origin && url.pathname.indexOf('/project/') === -1)
  ) return fetch(event.request);


  console.log(url, Array.from(event.request.headers));

  // }
  
  // Network only for rest of requests
  return fetch(event.request);
});

