const OPENING_MAIN_TAG_LENGTH = 6;

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

  if (
    method !== 'GET' // only want to capture GET requests
    // If not on jimmythompson.me or if in /project dir just fetch
    || !(url.origin === location.origin && url.pathname.indexOf('/project/') === -1)
  ) return fetch(event.request);


  // page request
  if (url.pathname[url.pathname.length -1] === '/') {
    let requestURI;
    let addTemplate = false;

    // Request the partial instead
    if (url.pathname.indexOf('/partials/') !== 0) {
      const newUrl = new URL(url.href);
      newUrl.pathname = `/partials${url.pathname}`;
      requestURI = newUrl.href;
      addTemplate = true;
    } else {
      requestURI = url.href;
    }

    return event.respondWith(
      caches.match(requestURI).then(r => {

        // If requesting a partial that is cached returns it here
        if (r && addTemplate === false) return r;

        /* 
         * If requesting a page that can request a partial instead do that
         * and then append to the template
         */
        else if (addTemplate === true) {
          let header;
          let footer;

          return caches
            .match('/template/') // Get template
            .then(res => {
              if (res == null) throw new Error('NO_TEMPLATE'); // Go to fallback catch
              return res.text();
            })
            .then(html => {
              header = html.slice(0, html.indexOf('<main>') + OPENING_MAIN_TAG_LENGTH);
              footer = html.slice(html.indexOf('</main>'));

              // TODO: revalidate `r` if not undefined & add item to cache if fetching
              return r || fetch(requestURI);
            })
            .then(_ => _.text())
            .then(response => {
              // TODO: edit classNames of pages from .page-variables script tag
              const html = header + response + footer;
              return new Response(html, {
                headers: new Headers({
                  'Content-Type': 'text/html',
                }),
              });
            })
            .catch((err) => fetch(event.request)); // fallback to normal request
        
        } else return fetch(event.request);
      })
    )

  }

  return event.respondWith(
    caches.match(event.request).then(r => r || fetch(event.request))
  );
});

