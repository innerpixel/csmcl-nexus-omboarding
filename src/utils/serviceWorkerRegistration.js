// Check if service worker and required APIs are supported
const isSupported = () => {
  return 'serviceWorker' in navigator && 
         'PeriodicSyncManager' in window &&
         'Notification' in window;
};

// Register the service worker
export const registerServiceWorker = async () => {
  if (!isSupported()) {
    console.log('Service Worker is not supported');
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register('/csmcl-nexus-omboarding/service-worker.js', {
      scope: '/csmcl-nexus-omboarding/'
    });
    
    // Set up periodic sync for background updates
    if ('periodicSync' in registration) {
      const status = await navigator.permissions.query({
        name: 'periodic-background-sync',
      });

      if (status.state === 'granted') {
        try {
          await registration.periodicSync.register('update-cache', {
            minInterval: 24 * 60 * 60 * 1000, // 24 hours
          });
        } catch (error) {
          console.log('Periodic sync could not be registered:', error);
        }
      }
    }

    // Handle service worker updates
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      
      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed') {
          if (navigator.serviceWorker.controller) {
            // New content is available, notify the user
            dispatchEvent(new CustomEvent('swUpdate'));
          }
        }
      });
    });

    console.log('Service Worker registered successfully');
    return registration;
  } catch (error) {
    console.error('Service Worker registration failed:', error);
  }
};

// Check for service worker updates
export const checkForUpdates = async () => {
  if (!isSupported()) return;

  const registration = await navigator.serviceWorker.ready;
  try {
    await registration.update();
    console.log('Service Worker update check completed');
  } catch (error) {
    console.error('Service Worker update check failed:', error);
  }
};

// Force reload the page to activate new service worker
export const forceUpdate = () => {
  window.location.reload();
};
