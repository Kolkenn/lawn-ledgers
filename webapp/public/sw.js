const CACHE_NAME = "lawn-ledgers-cache-v1";
const urlsToCache = [
  "/",
  "/app", // Add other important routes
  // Add paths to your assets (JS, CSS, images) that you want to cache
  // The build process in Remix will generate fingerprinted assets,
  // so you might need a more dynamic way to get these filenames.
  // For now, we'll focus on the main routes.
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => response || fetch(event.request))
  );
});
