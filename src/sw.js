/** copy-pasted from original sw **/
self.addEventListener("message", event => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

workbox.core.clientsClaim();

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerNavigationRoute(
  workbox.precaching.getCacheKeyForURL("/index.html"),
  {
    blacklist: [/^\/_/, /\/[^/?]+\.[^/]+$/]
  }
);

/**  CUSTOM CODE **/

this.addEventListener("install", event => {
  console.log("Installing Service Worker");
  event.waitUntil(this.skipWaiting());
});

this.addEventListener("activate", event => {
  event.waitUntil(this.clients.claim());
});

this.addEventListener("fetch", event => {
  if (event.request.url.includes("&cache-only=true")) {
    // return GET requests "cache-only": fetch only if cached request is missing
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return caches.open("requests").then(cache => {
          return fetch(event.request).then(response => {
            if (event.request.method === "GET") {
              // Put a copy of the response in the runtime cache.
              return cache.put(event.request, response.clone()).then(() => {
                return response;
              });
            } else {
              return response;
            }
          });
        });
      })
    );
  } else {
    const isMapboxTileRequest =
      event.request.url.includes("api.mapbox.com") &&
      event.request.url.includes("vector.pbf");

    // return GET requests "cache-first"
    event.respondWith(
      caches
        .match(
          event.request,
          isMapboxTileRequest
            ? {
                ignoreSearch: true,
                ignoreVary: true
              }
            : undefined
        )
        .then(cachedResponse => {
          const newRequest = fetch(event.request).then(response => {
            if (event.request.method === "GET") {
              // update cached response for next time
              return caches.open("requests").then(cache => {
                return cache
                  .put(event.request.url, response.clone())
                  .then(() => {
                    return response;
                  });
              });
            }
          });

          return cachedResponse || newRequest;
        })
    );
  }
});
