// This line is required for Workbox injection
self.__WB_MANIFEST

// Cache for notification sounds
const NOTIFICATION_SOUNDS_CACHE = 'notification-sounds-v1';

// Pre-cache notification sounds
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(NOTIFICATION_SOUNDS_CACHE).then((cache) => {
      return cache.addAll([
        '/sounds/alert.mp3',
        '/sounds/message.mp3',
        '/sounds/discovery.mp3'
      ]);
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
      const audio = new Audio(sound);
      audio.play().catch(error => console.error('Error playing sound:', error));
    }

    const options = {
      body: message,
      icon,
      badge,
      vibrate,
      actions,
      data: {
        ...data,
        url: self.registration.scope
      },
      tag: data.timestamp.toString(), // Use timestamp as tag to group notifications
      renotify: true, // Always notify even if using the same tag
      silent: false,
      timestamp: data.timestamp
    };

    event.waitUntil(
      self.registration.showNotification('🛸 Alien Transmission', options)
    );
  } catch (error) {
    console.error('Error handling push event:', error);
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  // Handle different actions
  switch (event.action) {
    case 'respond':
    case 'reply':
      event.waitUntil(
        clients.openWindow(`${event.notification.data.url}#respond`)
      );
      break;
    
    case 'investigate':
    case 'analyze':
      event.waitUntil(
        clients.openWindow(`${event.notification.data.url}#investigate`)
      );
      break;
    
    case 'explore':
      event.waitUntil(
        clients.openWindow(`${event.notification.data.url}#explore`)
      );
      break;
    
    case 'translate':
      event.waitUntil(
        clients.openWindow(`${event.notification.data.url}#translate`)
      );
      break;
    
    default:
      // If no action was clicked, open the app
      event.waitUntil(
        clients.openWindow(event.notification.data.url)
      );
  }
});
