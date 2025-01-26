<template>
  <div class="space-y-6">
    <!-- Message Type Tabs -->
    <div class="flex space-x-2 bg-space-900/50 p-2 rounded-lg">
      <button 
        v-for="type in ['ALERT', 'MESSAGE', 'DISCOVERY']" 
        :key="type"
        @click="selectedType = type"
        :class="{
          'px-4 py-2 rounded-md transition-all font-mono text-sm': true,
          'bg-red-900/50 text-red-100': selectedType === type && type === 'ALERT',
          'bg-alien-900/50 text-alien-100': selectedType === type && type === 'MESSAGE',
          'bg-purple-900/50 text-purple-100': selectedType === type && type === 'DISCOVERY',
          'bg-space-800/50 text-gray-400': selectedType !== type
        }"
      >
        {{ type }}
      </button>
    </div>

    <!-- Custom Messages List -->
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-glow-400 font-mono">Custom Messages</h3>
        <button 
          @click="showAddForm = true"
          class="px-3 py-1 bg-alien-900/30 hover:bg-alien-800/30 text-alien-300 rounded text-sm transition-colors"
        >
          + Add Message
        </button>
      </div>

      <!-- Messages List -->
      <div class="space-y-2">
        <div 
          v-for="(message, index) in store.customMessages[selectedType]" 
          :key="index"
          class="group flex items-center justify-between p-3 bg-space-900/50 rounded-lg border border-alien-500/10 hover:border-alien-500/30 transition-all"
        >
          <span class="font-mono text-sm text-gray-300">{{ message }}</span>
          <button 
            @click="store.removeCustomMessage(selectedType, index)"
            class="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-400 transition-all"
          >
            ❌
          </button>
        </div>
      </div>
    </div>

    <!-- Add Message Form -->
    <div 
      v-if="showAddForm"
      class="fixed inset-0 bg-black/80 flex items-center justify-center p-4"
    >
      <div class="bg-space-900 p-6 rounded-lg w-full max-w-md border border-alien-500/30">
        <h3 class="text-glow-400 font-mono mb-4">Add New {{ selectedType }} Message</h3>
        
        <div class="space-y-4">
          <div>
            <textarea
              v-model="newMessage"
              class="w-full h-24 bg-space-800 text-gray-300 p-3 rounded-lg border border-alien-500/20 focus:border-alien-500/50 outline-none font-mono"
              placeholder="Enter your alien message..."
            ></textarea>
          </div>

          <div class="flex justify-end space-x-3">
            <button 
              @click="showAddForm = false"
              class="px-4 py-2 bg-space-800 text-gray-400 rounded hover:bg-space-700 transition-colors"
            >
              Cancel
            </button>
            <button 
              @click="addMessage"
              class="px-4 py-2 bg-alien-900/50 text-alien-300 rounded hover:bg-alien-800/50 transition-colors"
              :disabled="!newMessage.trim()"
            >
              Add Message
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Notification History -->
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-glow-400 font-mono">Recent Transmissions</h3>
        <button 
          @click="store.clearHistory"
          class="px-3 py-1 bg-red-900/30 hover:bg-red-800/30 text-red-300 rounded text-sm transition-colors"
        >
          Clear History
        </button>
      </div>

      <div class="space-y-2">
        <div 
          v-for="notification in store.recentNotifications" 
          :key="notification.timestamp"
          class="p-3 bg-space-900/50 rounded-lg border border-alien-500/10"
        >
          <div class="flex items-center justify-between">
            <span class="font-mono text-sm text-gray-400">
              {{ new Date(notification.timestamp).toLocaleString() }}
            </span>
            <span 
              class="text-xs px-2 py-1 rounded"
              :class="{
                'bg-red-900/50 text-red-200': notification.type === 'ALERT',
                'bg-alien-900/50 text-alien-200': notification.type === 'MESSAGE',
                'bg-purple-900/50 text-purple-200': notification.type === 'DISCOVERY'
              }"
            >
              {{ notification.type }}
            </span>
          </div>
          <p class="mt-2 font-mono text-sm text-gray-300">{{ notification.message }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAlienMessagesStore } from '../stores/alienMessages';

const store = useAlienMessagesStore();
const selectedType = ref('MESSAGE');
const showAddForm = ref(false);
const newMessage = ref('');

function addMessage() {
  if (newMessage.value.trim()) {
    store.addCustomMessage(selectedType.value, newMessage.value.trim());
    newMessage.value = '';
    showAddForm.value = false;
  }
}
</script>
