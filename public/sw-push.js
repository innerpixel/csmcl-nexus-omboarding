// This line is required for Workbox injection
self.__WB_MANIFEST

self.addEventListener('push', (event) => {
  const options = {
    body: event.data.text(),
    icon: '/pwa-192x192.png',
    badge: '/pwa-64x64.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: '👽 Investigate',
        icon: '/pwa-64x64.png'
      },
      {
        action: 'close',
        title: '❌ Ignore',
        icon: '/pwa-64x64.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('🛸 Alien Transmission Received', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});
