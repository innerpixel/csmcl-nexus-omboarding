<template>
  <Transition
    enter-active-class="transform transition duration-500 ease-out"
    enter-from-class="translate-y-full opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-active-class="transform transition duration-500 ease-in"
    leave-from-class="translate-y-0 opacity-100"
    leave-to-class="translate-y-full opacity-0"
  >
    <div
      v-if="showUpdateNotification"
      class="fixed bottom-4 right-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-lg shadow-lg z-50 max-w-md backdrop-blur-sm bg-opacity-90 border border-white/10"
    >
      <div class="flex items-center space-x-3">
        <div class="flex-shrink-0">
          <div class="animate-spin-slow">
            🛸
          </div>
        </div>
        <div class="flex-1">
          <h3 class="font-bold text-lg">New Transmission Available!</h3>
          <p class="text-white/90">
            A new version of the alien communication system is ready to deploy.
          </p>
        </div>
      </div>
      <div class="mt-4 flex justify-end space-x-3">
        <button
          @click="hideNotification"
          class="px-3 py-1 rounded-md hover:bg-white/10 transition-colors duration-200 text-white/80 hover:text-white"
        >
          Later
        </button>
        <button
          @click="updateApp"
          class="px-4 py-1 bg-white text-purple-600 rounded-md hover:bg-white/90 transition-colors duration-200 font-medium flex items-center space-x-2"
        >
          <span>Update Now</span>
          <span class="text-sm">🚀</span>
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { forceUpdate } from '../utils/serviceWorkerRegistration'

const showUpdateNotification = ref(false)

const hideNotification = () => {
  showUpdateNotification.value = false
}

const updateApp = () => {
  forceUpdate()
}

onMounted(() => {
  // Listen for service worker update events
  window.addEventListener('swUpdate', () => {
    showUpdateNotification.value = true
  })
})
</script>

<style scoped>
.animate-spin-slow {
  animation: spin 4s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
