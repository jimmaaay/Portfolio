
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


// https://stackoverflow.com/a/47767860
const getUrlExtension = url => url.split(/\#|\?/)[0].split('.').pop().trim();


self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  const { method } = event.request;

  // 
  if (
    method !== 'GET' // only want to capture GET requests
    // If not on jimmythompson.me or if in /project dir just fetch
    || !(url.origin === location.origin && url.pathname.indexOf('/project/') === -1)
  ) return fetch(event.request);


  // page request
  if (url.pathname[url.pathname.length -1] === '/') {
    let requestURI;
    let addTemplate = false;

    // Request the partial instead???
    if (url.pathname.indexOf('/partials/') !== 0) {
      // const newURL = `/partials${url.pathname}`;
      const newUrl = new URL(url.href);
      newUrl.pathname = `/partials${url.pathname}`;
      // const request = new Request(newUrl.href, Object.assign({}, event.request));
      // request.url = newUrl.href;
      requestURI = newUrl.href;
      addTemplate = true;
    } else {
      requestURI = url.href;
    }

    console.log(requestURI, addTemplate);

    return event.respondWith(
      caches.match(requestURI).then(r => {
        if (r && addTemplate === false) return r;
        else if (r && addTemplate === true) {
          // Add template to response
          console.log('ADD TEMPLATE TO RESPONSE');
          return r;
        } else fetch(event.request);
      })
    )

  }


  event.respondWith(
    caches.match(event.request).then(r => r || fetch(event.request))
  );
});

