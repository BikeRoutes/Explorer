importScripts("/Explorer/precache-manifest.ef51ffc1b6054a06c31eb29550e66a52.js", "https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

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
  workbox.precaching.getCacheKeyForURL("/Explorer/index.html"),
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
  // return any GET request "cache-first"
  event.respondWith(
    caches.match(event.request).then(resp => {
      const newRequest = fetch(event.request).then(response => {
        if (event.request.method === "GET") {
          const cacheResponse = response.clone();

          caches.open("requests").then(cache => {
            cache.put(event.request, cacheResponse);
          });
        }

        return response;
      });

      return resp || newRequest;
    })
  );
});

