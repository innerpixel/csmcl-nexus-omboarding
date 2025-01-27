// This line is required for Workbox injection
self.__WB_MANIFEST

const CACHE_VERSION = 'v1.1.0';
const CACHE_NAME = `alien-transmissions-${CACHE_VERSION}`;
const APP_SHELL_CACHE = `app-shell-${CACHE_VERSION}`;
const DATA_CACHE = `data-cache-${CACHE_VERSION}`;

// Base URL for the application
const BASE_URL = '/csmcl-nexus-omboarding';

// App Shell - critical resources
const APP_SHELL_RESOURCES = [
  `${BASE_URL}/`,
  `${BASE_URL}/index.html`,
  `${BASE_URL}/assets/`,
  `${BASE_URL}/manifest.json`,
  `${BASE_URL}/favicon.ico`,
  `${BASE_URL}/favicon.svg`,
  `${BASE_URL}/apple-touch-icon-180x180.png`,
  `${BASE_URL}/pwa-192x192.png`,
  `${BASE_URL}/pwa-512x512.png`
];

// Security headers for fetch requests
const securityHeaders = {
  'Content-Security-Policy': `
    default-src 'self';
    script-src 'self' 'wasm-unsafe-eval' 'unsafe-inline';
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    font-src 'self' https://fonts.gstatic.com;
    img-src 'self' data: blob:;
    media-src 'self';
    connect-src 'self' http://localhost:* https://innerpixel.github.io ws://localhost:* wss://localhost:*;
    worker-src 'self';
    manifest-src 'self';
    base-uri 'self';
    form-action 'self';
    object-src 'none';
  `,
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin'
};

// Install event - cache critical resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(APP_SHELL_CACHE).then((cache) => {
      return cache.addAll(APP_SHELL_RESOURCES);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            return (
              cacheName.startsWith('alien-transmissions-') &&
              cacheName !== APP_SHELL_CACHE &&
              cacheName !== DATA_CACHE
            );
          })
          .map((cacheName) => {
            return caches.delete(cacheName);
          })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - handle requests
self.addEventListener('fetch', (event) => {
  // Skip dev server requests
  if (event.request.url.includes('localhost:5173') || 
      event.request.url.includes('@vite') ||
      event.request.url.includes('vite-plugin-pwa')) {
    return;
  }

  // Handle API requests
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const clonedResponse = response.clone();
          caches.open(DATA_CACHE).then((cache) => {
            cache.put(event.request, clonedResponse);
          });
          return response;
        })
        .catch(() => {
          return caches.match(event.request);
        })
    );
    return;
  }

  // Handle other requests with cache-first strategy
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const clonedResponse = response.clone();
        caches.open(APP_SHELL_CACHE).then((cache) => {
          cache.put(event.request, clonedResponse);
        });
        return response;
      });
    })
  );
});

// Push event - handle notifications
self.addEventListener('push', (event) => {
  try {
    const data = event.data.json();
    const options = {
      body: data.message || 'New alien transmission received!',
      icon: `${BASE_URL}/pwa-192x192.png`,
      badge: `${BASE_URL}/pwa-192x192.png`,
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1,
        url: data.url || '/'
      },
      actions: [
        {
          action: 'explore',
          title: 'View Message',
          icon: `${BASE_URL}/pwa-192x192.png`
        }
      ]
    };

    event.waitUntil(
      self.registration.showNotification('Alien Transmissions', options)
    );
  } catch (error) {
    console.error('Error handling push notification:', error);
  }
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  }
});

// Message event - handle client messages
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
