const CACHE_NAME = "sticker-collection-v1";

// URLs essenciais que devem ser armazenadas em cache
const urlsToCache = [
  "/",
  "/index.html",
  "/vite.svg",
  "/favicon.ico",
  "/icon-192.png",
  "/icon-512.png",
  // Adiciona mais URLs das imagens ou outros assets importantes
];

// -----------------------------
// INSTALL (cache inicial)
// -----------------------------
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("SW: Cache aberto");
      return cache.addAll(urlsToCache);
    })
  );
});

// -----------------------------
// FETCH (usar cache primeiro, depois rede)
// -----------------------------
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Retorna a resposta do cache, ou tenta buscar na rede
      return cachedResponse || fetch(event.request).then((response) => {
        // Cache a nova resposta
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, response.clone());
          return response;
        });
      });
    })
  );
});

// -----------------------------
// ACTIVATE (limpar caches antigos)
// -----------------------------
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME]; // lista de caches válidos
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            // Se o cache não for da lista válida, apaga-o
            console.log("SW: Cache deletado", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});