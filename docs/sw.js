// SigloPedia — Service Worker
// Met en cache les fichiers du site pour un fonctionnement hors-ligne une
// fois l'application installée. Stratégie simple et sûre : "network first,
// cache fallback" pour les pages HTML (toujours la version la plus récente
// si le réseau répond), et "cache first" pour les ressources statiques
// (polices, images, styles) qui ne changent presque jamais.

const CACHE_NAME = "siglopedia-v1.1.0";

const APP_SHELL = [
  "./",
  "./index.html",
  "./privacy.html",
  "./terms.html",
  "./mentions-legales.html",
  "./css/style.css",
  "./js/script.js",
  "./manifest.json",
  "./assets/icon-192.png",
  "./assets/icon-512.png",
  "./assets/favicon-96.png",
  "./assets/screenshot.png",
  "./fonts/fraunces-latin-600-normal.woff2",
  "./fonts/manrope-latin-400-normal.woff2",
  "./fonts/manrope-latin-700-normal.woff2",
  "./fonts/jetbrains-mono-latin-500-normal.woff2"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const isHTML = req.mode === "navigate" || req.headers.get("accept")?.includes("text/html");

  if (isHTML) {
    // Pages : on essaie le réseau d'abord (contenu à jour), sinon on
    // retombe sur le cache (mode hors-ligne).
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then((res) => res || caches.match("./index.html")))
    );
    return;
  }

  // Ressources statiques : cache d'abord, réseau en secours.
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
        return res;
      });
    })
  );
});
