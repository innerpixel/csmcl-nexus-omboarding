import { defineStore } from 'pinia';

export const useAlienMessagesStore = defineStore('alienMessages', {
  state: () => ({
    messages: [],
    customMessages: {
      ALERT: [
        "⚠️ Unidentified object approaching Earth's atmosphere!",
        "🚨 Energy surge detected in quadrant Alpha-7!",
        "⚡ Anomalous readings detected in the vicinity!",
        "🌪️ Temporal disturbance detected - prepare for contact!",
        "🔥 Warning: High-energy signatures approaching!"
      ],
      MESSAGE: [
        "👽 Greetings, Earth dweller! We come in peace.",
        "🌌 Transmission received from the Andromeda galaxy...",
        "🛸 Incoming message from the Galactic Council...",
        "🌟 Cosmic alignment favorable for communication.",
        "🔮 Ancient alien wisdom incoming..."
      ],
      DISCOVERY: [
        "🏺 Ancient alien artifacts discovered in sector 9!",
        "🧬 New alien life form detected on proxima centauri!",
        "🌍 Hidden alien structure found beneath the surface!",
        "🎯 Mysterious signal origin point located!",
        "💫 Unknown energy source detected in deep space!"
      ]
    },
    notificationHistory: [],
    scheduledMessages: []
  }),

  getters: {
    getRandomMessage: (state) => (type) => {
      const messages = state.customMessages[type];
      return messages[Math.floor(Math.random() * messages.length)];
    },
    recentNotifications: (state) => {
      return state.notificationHistory.slice().reverse().slice(0, 10);
    },
    activeScheduledMessages: (state) => {
      const now = Date.now();
      return state.scheduledMessages.filter(msg => new Date(msg.scheduledTime) > now);
    }
  },

  actions: {
    addCustomMessage(type, message) {
      if (this.customMessages[type]) {
        this.customMessages[type].push(message);
      }
    },

    removeCustomMessage(type, index) {
      if (this.customMessages[type]) {
        this.customMessages[type].splice(index, 1);
      }
    },

    addToHistory(notification) {
      this.notificationHistory.push({
        ...notification,
        timestamp: Date.now()
      });
    },

    addScheduledMessage(message) {
      this.scheduledMessages.push({
        ...message,
        id: `scheduled_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      });
    },

    removeScheduledMessage(id) {
      const index = this.scheduledMessages.findIndex(msg => msg.id === id);
      if (index !== -1) {
        this.scheduledMessages.splice(index, 1);
      }
    },

    clearHistory() {
      this.notificationHistory = [];
    }
  },

  persist: {
    enabled: true,
    strategies: [
      {
        key: 'alien-messages',
        storage: localStorage,
      },
    ],
  },
});
