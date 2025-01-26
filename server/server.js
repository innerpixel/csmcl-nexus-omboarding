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

// Subscribe route
app.post('/subscribe', (req, res) => {
  const subscription = req.body;
  console.log('New subscription:', subscription);
  subscriptions.add(subscription);
  res.status(201).json({ message: '👽 Transmission channel established' });
});

// Send notification to all subscribers
app.post('/broadcast', async (req, res) => {
  const message = req.body.message || 'Greetings, Earthling!';
  const errors = [];

  // Send to all subscriptions
  for (const subscription of subscriptions) {
    try {
      await webpush.sendNotification(subscription, message);
    } catch (error) {
      console.error('Error sending notification:', error);
      errors.push(error);
      subscriptions.delete(subscription);
    }
  }

  res.json({
    message: `🛸 Transmission sent to ${subscriptions.size} receivers`,
    errors: errors.length ? errors : undefined
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
