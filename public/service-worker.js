// This line is required for Workbox injection
self.__WB_MANIFEST

const CACHE_VERSION = 'v1.1.0';
const CACHE_NAME = `alien-transmissions-${CACHE_VERSION}`;
const APP_SHELL_CACHE = `app-shell-${CACHE_VERSION}`;
const DATA_CACHE = `data-cache-${CACHE_VERSION}`;
const NOTIFICATION_SOUNDS_CACHE = 'notification-sounds-v1';

// Base URL for the application
const BASE_URL = '/csmcl-nexus-omboarding';

// App Shell - critical resources
const APP_SHELL_RESOURCES = [
  `${BASE_URL}/`,
  `${BASE_URL}/index.html`,
  `${BASE_URL}/assets/index.js`,
  `${BASE_URL}/assets/style.css`,
  `${BASE_URL}/manifest.json`,
  `${BASE_URL}/favicon.ico`,
  `${BASE_URL}/favicon.svg`,
  `${BASE_URL}/apple-touch-icon-180x180.png`,
  `${BASE_URL}/pwa-192x192.png`,
  `${BASE_URL}/pwa-512x512.png`
];

// Security headers for fetch requests
const securityHeaders = {
  'Content-Security-Policy': "default-src 'self'; connect-src 'self' https://innerpixel.github.io https://api.your-production-domain.com http://localhost:3000; img-src 'self' data: https:; media-src 'self' https:; script-src 'self' 'unsafe-inline' 'unsafe-eval';",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin'
};

// Install event - cache app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      // Cache app shell resources
      caches.open(APP_SHELL_CACHE).then((cache) => {
        console.log('Caching app shell');
        return cache.addAll(APP_SHELL_RESOURCES);
      }),
      // Cache notification sounds
      caches.open(NOTIFICATION_SOUNDS_CACHE).then((cache) => {
        return cache.addAll([
          `${BASE_URL}/sounds/alert.mp3`,
          `${BASE_URL}/sounds/message.mp3`,
          `${BASE_URL}/sounds/discovery.mp3`
        ]);
      })
    ]).then(() => {
      // Skip waiting to activate the new service worker immediately
      self.skipWaiting();
    }).catch(error => {
      console.error('Cache installation failed:', error);
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (
              cacheName !== APP_SHELL_CACHE &&
              cacheName !== DATA_CACHE &&
              cacheName !== NOTIFICATION_SOUNDS_CACHE
            ) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Claim clients to take control immediately
      self.clients.claim()
    ])
  );
});

// Fetch event with security and caching strategy
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests and non-http(s) URLs
  if (event.request.method !== 'GET' || 
      !event.request.url.startsWith('http')) {
    return;
  }

  // Handle API requests
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Clone the response
          const clonedResponse = response.clone();

          // Cache the fresh data
          caches.open(DATA_CACHE).then((cache) => {
            cache.put(event.request, clonedResponse);
          });

          return response;
        })
        .catch(() => {
          // Return cached data if offline
          return caches.match(event.request);
        })
    );
    return;
  }

  // App shell caching strategy
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        // Return cached response
        return response;
      }

      // Clone the request
      const fetchRequest = event.request.clone();

      // Fetch and cache
      return fetch(fetchRequest).then((response) => {
        // Check if response is valid and is http(s)
        if (!response || 
            response.status !== 200 || 
            response.type !== 'basic' ||
            !fetchRequest.url.startsWith('http')) {
          return response;
        }

        // Clone the response
        const responseToCache = response.clone();

        // Add security headers
        const secureResponse = new Response(responseToCache.body, {
          status: responseToCache.status,
          statusText: responseToCache.statusText,
          headers: {
            ...Object.fromEntries(responseToCache.headers.entries()),
            ...securityHeaders
          }
        });

        // Cache the secure response
        caches.open(APP_SHELL_CACHE).then((cache) => {
          cache.put(event.request, secureResponse);
        });

        return response;
      });
    })
  );
});

// Handle push notifications
self.addEventListener('push', (event) => {
  if (!event.data) return;

  try {
    const payload = JSON.parse(event.data.text());
    const { message, icon, badge, sound, vibrate, actions, data } = payload;

    // Play notification sound if available
    if (sound) {
      const audio = new Audio(`${BASE_URL}${sound}`);
      audio.play().catch(error => console.error('Error playing sound:', error));
    }

    const options = {
      body: message,
      icon: icon ? `${BASE_URL}${icon}` : undefined,
      badge: badge ? `${BASE_URL}${badge}` : undefined,
      vibrate,
      actions,
      data: {
        ...data,
        url: self.registration.scope
      },
      tag: data.timestamp.toString(),
      renotify: true,
      silent: false,
      timestamp: data.timestamp
    };

    event.waitUntil(
      self.registration.showNotification('🛸 Alien Transmission', options)
    );
  } catch (error) {
    console.error('Error handling push notification:', error);
  }
});

// Handle periodic sync for background updates
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'update-cache') {
    event.waitUntil(
      Promise.all([
        // Update app shell cache
        caches.open(APP_SHELL_CACHE).then((cache) => {
          return Promise.all(
            APP_SHELL_RESOURCES.map((url) => {
              return fetch(url).then((response) => {
                return cache.put(url, response);
              });
            })
          );
        }),
        // Update data cache
        fetch('/api/latest-data').then((response) => {
          return caches.open(DATA_CACHE).then((cache) => {
            return cache.put('/api/latest-data', response);
          });
        })
      ])
    );
  }
});
