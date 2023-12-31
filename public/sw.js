// Change the cache version on asset changes
const CACHE = "v1";

self.addEventListener("install", () => {});

self.addEventListener("activate", () => {
  // TODO; Cleanup previous version cache
});

const cacheClone = async (e) => {
  const res = await fetch(e.request);
  const resClone = res.clone();

  const cache = await caches.open(CACHE);
  await cache.put(e.request, resClone);
  return res;
};

self.addEventListener("fetch", (e) => {
  e.respondWith(
    cacheClone(e)
      .catch(() => caches.match(e.request))
      .then((res) => res),
  );
});
