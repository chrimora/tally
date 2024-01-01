const cacheName = "pagesV1";

self.addEventListener("install", () => {});

self.addEventListener("activate", () => {});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.open(cacheName).then((cache) => {
      // Return from the cache when available
      return cache.match(event.request).then((cachedResponse) => {
        // Then fetch from server and update cache
        const fetchedResponse = fetch(event.request).then((networkResponse) => {
          cache.put(event.request, networkResponse.clone());

          return networkResponse;
        });

        return cachedResponse || fetchedResponse;
      });
    }),
  );
});
