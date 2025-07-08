// Service Worker básico para PWA - Estrategia Network Falling Back to Cache

const CACHE_NAME = 'astromistica-cache-v1';

// Este Service Worker no precachea nada en la instalación.
// Cacheará los recursos dinámicamente a medida que se soliciten.
self.addEventListener('install', event => {
  console.log('Service Worker: Instalado');
  // Forzar la activación inmediata del nuevo Service Worker
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', event => {
  console.log('Service Worker: Activado');
  // Limpiar cachés antiguas si es necesario
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Limpiando caché antigua', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  // Tomar el control de las páginas abiertas inmediatamente
  return self.clients.claim();
});


self.addEventListener('fetch', event => {
  // Solo manejar peticiones GET
  if (event.request.method !== 'GET') {
    return;
  }
  
  event.respondWith(
    // 1. Intentar obtener el recurso de la red
    fetch(event.request)
      .then(res => {
        // Si la respuesta de la red es exitosa
        return caches.open(CACHE_NAME).then(cache => {
          // Guardar una copia de la respuesta en el caché
          console.log('Service Worker: Cacheando nuevo recurso: ', event.request.url);
          cache.put(event.request.url, res.clone());
          // Devolver la respuesta original de la red
          return res;
        });
      })
      .catch(err => {
        // 2. Si la red falla, intentar obtener el recurso del caché
        console.log('Service Worker: Buscando en caché: ', event.request.url);
        return caches.match(event.request).then(response => {
          // Devolver la respuesta del caché si se encuentra
          // Si no está en el caché, la promesa se resuelve en 'undefined'
          // y el navegador manejará el error de red como lo haría normalmente.
          return response;
        });
      })
  );
});
