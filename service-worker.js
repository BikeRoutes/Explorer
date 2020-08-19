importScripts("/Explorer/precache-manifest.641c0b1629001d34a12ceda857c564b1.js", "https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

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

this.addEventListener("install", function(event) {
  console.log("Installing Service Worker");
  event.waitUntil(this.skipWaiting());
});

this.addEventListener("activate", function(event) {
  event.waitUntil(this.clients.claim());
});

this.addEventListener("fetch", function(event) {
  var url = event.request.url;

  if (
    url.startsWith("https://") &&
    (url.includes("tiles.mapbox.com") || url.includes("api.mapbox.com"))
  ) {
    caches.open("mapbox").then(cache => console.log(cache));

    event.respondWith(
      caches.match(event.request).then(function(resp) {
        console.log(resp ? "FROM CACHE: " : "FETCHING: ", url);
        return (
          resp ||
          fetch(event.request).then(function(response) {
            var cacheResponse = response.clone();
            caches.open("mapbox").then(function(cache) {
              cache.put(event.request, cacheResponse);
            });
            return response;
          })
        );
      })
    );
  }
});

