import express from 'express';
import webpush from 'web-push';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// Replace these with your generated VAPID keys
const vapidKeys = {
  publicKey: 'BMv4vhQZ19oEQLrfmiixraMUpD27OeJ9LeiHtRZ-AyskMyBAZGxtekl4KpEgdGT_3a__zpR5iOxNfJNZLLtGn9M',
  privateKey: 'ViOEjp-_1fWtJrk7Q6lbpEffkqZCYLRrqxamTx-QhKg'
};

webpush.setVapidDetails(
  'mailto:your-email@example.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

// Store subscriptions (in a real app, you'd use a database)
const subscriptions = new Set();

// Store scheduled notifications
const scheduledNotifications = new Map();

// Function to send a notification
async function sendNotification({ message, type = 'MESSAGE', data = {} }) {
  const notificationConfig = notificationTypes[type];
  const payload = {
    message: `${notificationConfig.prefix}${message}`,
    ...notificationConfig,
    data: {
      ...data,
      timestamp: Date.now()
    }
  };

  const errors = [];

  for (const subscription of subscriptions) {
    try {
      await webpush.sendNotification(subscription, JSON.stringify(payload));
    } catch (error) {
      console.error('Error sending notification:', error);
      errors.push(error);
      subscriptions.delete(subscription);
    }
  }

  return {
    success: errors.length === 0,
    errors,
    recipientCount: subscriptions.size
  };
}

// Notification types with their configurations
const notificationTypes = {
  ALERT: {
    icon: '/pwa-192x192.png',
    badge: '/pwa-64x64.png',
    sound: '/sounds/alert.mp3',
    vibrate: [200, 100, 200],
    priority: 'high',
    prefix: '🚨 ',
    actions: [
      {
        action: 'respond',
        title: '🛸 Respond',
      },
      {
        action: 'investigate',
        title: '🔍 Investigate',
      }
    ]
  },
  MESSAGE: {
    icon: '/pwa-192x192.png',
    badge: '/pwa-64x64.png',
    sound: '/sounds/message.mp3',
    vibrate: [100, 50, 100],
    priority: 'normal',
    prefix: '👽 ',
    actions: [
      {
        action: 'reply',
        title: '💬 Reply',
      },
      {
        action: 'translate',
        title: '🔤 Translate',
      }
    ]
  },
  DISCOVERY: {
    icon: '/pwa-192x192.png',
    badge: '/pwa-64x64.png',
    sound: '/sounds/discovery.mp3',
    vibrate: [300, 150, 300],
    priority: 'high',
    prefix: '🌟 ',
    actions: [
      {
        action: 'explore',
        title: '🚀 Explore',
      },
      {
        action: 'analyze',
        title: '🔬 Analyze',
      }
    ]
  }
};

// Subscribe route
app.post('/subscribe', (req, res) => {
  const subscription = req.body;
  console.log('New subscription:', subscription);
  subscriptions.add(subscription);
  res.status(201).json({ message: '👽 Transmission channel established' });
});

// Enhanced broadcast with notification types
app.post('/broadcast', async (req, res) => {
  const { message, type = 'MESSAGE', data = {} } = req.body;
  const result = await sendNotification({ message, type, data });

  res.json({
    message: `🛸 ${type} transmission sent to ${result.recipientCount} receivers`,
    errors: result.errors.length ? result.errors : undefined
  });
});

// Schedule a notification
app.post('/schedule', (req, res) => {
  const { message, type = 'MESSAGE', scheduledTime, data = {} } = req.body;
  const timestamp = new Date(scheduledTime).getTime();
  
  if (timestamp <= Date.now()) {
    return res.status(400).json({ error: '⚠️ Scheduled time must be in the future' });
  }

  const id = `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  scheduledNotifications.set(id, {
    message,
    type,
    scheduledTime: timestamp,
    data
  });

  const delay = timestamp - Date.now();
  setTimeout(async () => {
    const notification = scheduledNotifications.get(id);
    if (notification) {
      await sendNotification(notification);
      scheduledNotifications.delete(id);
    }
  }, delay);

  res.json({
    message: '⏰ Transmission scheduled',
    id,
    scheduledTime: new Date(timestamp).toISOString()
  });
});

// Cancel a scheduled notification
app.delete('/schedule/:id', (req, res) => {
  const { id } = req.params;
  
  if (scheduledNotifications.has(id)) {
    scheduledNotifications.delete(id);
    res.json({ message: '❌ Scheduled transmission cancelled' });
  } else {
    res.status(404).json({ error: '⚠️ Scheduled transmission not found' });
  }
});

// List all scheduled notifications
app.get('/schedule', (req, res) => {
  const scheduled = Array.from(scheduledNotifications.entries()).map(([id, notification]) => ({
    id,
    ...notification,
    scheduledTime: new Date(notification.scheduledTime).toISOString()
  }));

  res.json({
    count: scheduled.length,
    notifications: scheduled
  });
});

// Test route
app.get('/test', (req, res) => {
  res.json({ message: '👾 Alien server operational' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`
  🛸 Alien Transmission Server
  ---------------------------
  Status: Online
  Port: ${PORT}
  Public Key: ${vapidKeys.publicKey}
  Ready to receive transmissions...
  `);
});
