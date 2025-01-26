<script setup>
import { ref, onMounted } from 'vue';
import { useAlienMessagesStore } from '../stores/alienMessages';
import SciFiButton from './SciFiButton.vue';

const store = useAlienMessagesStore();
const notificationStatus = ref('checking');
const subscription = ref(null);
const scheduledNotifications = ref([]);

const VAPID_PUBLIC_KEY = 'BMv4vhQZ19oEQLrfmiixraMUpD27OeJ9LeiHtRZ-AyskMyBAZGxtekl4KpEgdGT_3a__zpR5iOxNfJNZLLtGn9M';

const checkNotificationPermission = async () => {
  if (!('Notification' in window)) {
    notificationStatus.value = 'unsupported';
    return;
  }

  if (Notification.permission === 'granted') {
    notificationStatus.value = 'granted';
    await subscribeToNotifications();
  } else if (Notification.permission === 'denied') {
    notificationStatus.value = 'denied';
  } else {
    notificationStatus.value = 'default';
  }
};

const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

const subscribeToNotifications = async () => {
  try {
    const registration = await navigator.serviceWorker.ready;
    const existingSubscription = await registration.pushManager.getSubscription();
    
    if (existingSubscription) {
      subscription.value = existingSubscription;
      return;
    }

    const newSubscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
    });
    
    subscription.value = newSubscription;
    
    // Send subscription to server
    await fetch('http://localhost:3000/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscription.value)
    });

    console.log('Push Subscription:', JSON.stringify(subscription.value));
  } catch (error) {
    console.error('Error subscribing to push notifications:', error);
  }
};

const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    notificationStatus.value = permission;
    if (permission === 'granted') {
      await subscribeToNotifications();
    }
  } catch (error) {
    console.error('Error requesting notification permission:', error);
  }
};

// Test notification functions for different types
const sendTestNotification = async (type = 'MESSAGE') => {
  try {
    const message = store.getRandomMessage(type);
    const response = await fetch('http://localhost:3000/broadcast', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type,
        message,
        data: {
          testData: true,
          timestamp: Date.now()
        }
      })
    });
    const result = await response.json();
    console.log('Broadcast result:', result);
    
    // Add to notification history
    store.addToHistory({
      type,
      message,
      success: true
    });
  } catch (error) {
    console.error('Error sending test notification:', error);
    store.addToHistory({
      type,
      message: 'Error sending notification',
      success: false,
      error: error.message
    });
  }
};

// Schedule a notification
const scheduleNotification = async () => {
  try {
    const type = 'DISCOVERY';
    const message = store.getRandomMessage(type);
    const scheduledTime = new Date(Date.now() + 60000).toISOString(); // 1 minute from now

    const response = await fetch('http://localhost:3000/schedule', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type,
        message,
        scheduledTime,
        data: {
          scheduled: true,
          timestamp: Date.now()
        }
      })
    });
    const result = await response.json();
    console.log('Schedule result:', result);
    
    // Add to scheduled messages
    store.addScheduledMessage({
      type,
      message,
      scheduledTime,
      id: result.id
    });
    
    await loadScheduledNotifications();
  } catch (error) {
    console.error('Error scheduling notification:', error);
  }
};

// Load scheduled notifications
const loadScheduledNotifications = async () => {
  try {
    const response = await fetch('http://localhost:3000/schedule');
    const result = await response.json();
    scheduledNotifications.value = result.notifications;
  } catch (error) {
    console.error('Error loading scheduled notifications:', error);
  }
};

// Cancel a scheduled notification
const cancelScheduledNotification = async (id) => {
  try {
    await fetch(`http://localhost:3000/schedule/${id}`, {
      method: 'DELETE'
    });
    await loadScheduledNotifications();
  } catch (error) {
    console.error('Error canceling scheduled notification:', error);
  }
};

onMounted(() => {
  checkNotificationPermission();
  loadScheduledNotifications();
});
</script>

<template>
  <div class="space-y-4">
    <!-- Notification Status -->
    <div class="relative p-4 bg-space-800 rounded-lg border border-alien-500/30 overflow-hidden group">
      <!-- Glowing border effect -->
      <div class="absolute inset-0 border border-alien-500/50 rounded-lg blur opacity-50"></div>
      
      <!-- Status content -->
      <div class="relative z-10">
        <h3 class="text-glow-400 font-mono mb-2">Transmission Status:</h3>
        <div class="flex items-center space-x-2">
          <div :class="{
            'w-3 h-3 rounded-full': true,
            'bg-red-500': notificationStatus === 'denied',
            'bg-yellow-500': notificationStatus === 'default',
            'bg-green-500 animate-pulse': notificationStatus === 'granted',
            'bg-gray-500': notificationStatus === 'unsupported'
          }"></div>
          <span class="text-sm font-mono text-gray-300">
            {{ {
              'checking': 'Scanning...',
              'unsupported': 'Communications Unavailable',
              'denied': 'Access Denied',
              'default': 'Awaiting Authorization',
              'granted': 'Channel Open'
            }[notificationStatus] }}
          </span>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="space-y-2">
      <SciFiButton 
        v-if="notificationStatus === 'default'"
        text="REQUEST ACCESS" 
        @click="requestNotificationPermission" 
      />
      
      <!-- Test Notification Buttons -->
      <div v-if="notificationStatus === 'granted'" class="space-y-2">
        <SciFiButton 
          text="🚨 SEND ALERT" 
          @click="() => sendTestNotification('ALERT')"
          class="bg-red-900/50 hover:bg-red-800/50"
        />
        <SciFiButton 
          text="👽 SEND MESSAGE" 
          @click="() => sendTestNotification('MESSAGE')"
        />
        <SciFiButton 
          text="🌟 SEND DISCOVERY" 
          @click="() => sendTestNotification('DISCOVERY')"
          class="bg-purple-900/50 hover:bg-purple-800/50"
        />
        <SciFiButton 
          text="⏰ SCHEDULE TRANSMISSION" 
          @click="scheduleNotification"
          class="bg-blue-900/50 hover:bg-blue-800/50"
        />
      </div>
    </div>

    <!-- Scheduled Notifications -->
    <div v-if="scheduledNotifications.length > 0" class="mt-6">
      <h3 class="text-glow-400 font-mono mb-2">Scheduled Transmissions:</h3>
      <div class="space-y-2">
        <div v-for="notification in scheduledNotifications" 
             :key="notification.id" 
             class="relative p-3 bg-space-900 rounded border border-alien-500/20">
          <div class="flex justify-between items-center">
            <div>
              <span class="text-sm font-mono text-gray-300">
                {{ new Date(notification.scheduledTime).toLocaleString() }}
              </span>
              <p class="text-sm text-gray-400">{{ notification.message }}</p>
            </div>
            <button 
              @click="() => cancelScheduledNotification(notification.id)"
              class="text-red-500 hover:text-red-400 transition-colors"
            >
              ❌
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
