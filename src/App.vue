<template>
  <main class="min-h-screen bg-space-950 text-gray-100">
    <!-- Main Container with responsive padding -->
    <div class="p-4 sm:p-6 md:p-8 lg:p-12 xl:p-16">
      <!-- Content wrapper with max-width constraints -->
      <div class="mx-auto max-w-[95%] md:max-w-4xl lg:max-w-6xl xl:max-w-7xl">
        <!-- Header with Logo -->
        <div class="flex justify-center mb-8 sm:mb-12">
          <AlienLogo class="w-32 sm:w-40 md:w-48 lg:w-56 xl:w-64" />
        </div>

        <!-- Main Content Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:gap-12">
          <!-- Left Column -->
          <div class="space-y-4 sm:space-y-6 md:space-y-8">
            <div class="p-4 sm:p-6 md:p-8 bg-space-800/50 rounded-lg backdrop-blur-sm border border-alien-500/20">
              <h2 class="text-xl sm:text-2xl md:text-3xl font-mono text-glow-400 mb-4 sm:mb-6">Galactic Map</h2>
              <StarMap class="h-[250px] sm:h-[300px] md:h-[400px] lg:h-[500px]" />
            </div>

            <div class="p-4 sm:p-6 md:p-8 bg-space-800/50 rounded-lg backdrop-blur-sm border border-alien-500/20">
              <h2 class="text-xl sm:text-2xl md:text-3xl font-mono text-glow-400 mb-4 sm:mb-6">Alien Transmissions</h2>
              <AlienNotifications />
            </div>
          </div>

          <!-- Right Column -->
          <div class="space-y-4 sm:space-y-6 md:space-y-8">
            <div class="p-4 sm:p-6 md:p-8 bg-space-800/50 rounded-lg backdrop-blur-sm border border-alien-500/20">
              <h2 class="text-xl sm:text-2xl md:text-3xl font-mono text-glow-400 mb-4 sm:mb-6">Message Control</h2>
              <AlienMessageManager />
            </div>
          </div>
        </div>

        <!-- Footer -->
        <footer class="mt-8 sm:mt-12 md:mt-16 text-center text-sm sm:text-base text-alien-400/60">
          <p>Monitoring {{ stars.length }} star systems for alien activity</p>
        </footer>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue';
import AlienLogo from './components/AlienLogo.vue';
import AlienNotifications from './components/AlienNotifications.vue';
import AlienMessageManager from './components/AlienMessageManager.vue';
import StarMap from './components/StarMap.vue';
import PWABadge from './components/PWABadge.vue';
import SciFiButton from './components/SciFiButton.vue';

const stars = ref(Array.from({ length: Math.floor(Math.random() * 1000) + 500 }));
</script>

<style>
@keyframes glow {
  from {
    text-shadow: 0 0 20px rgba(99,102,241,0.5);
  }
  to {
    text-shadow: 0 0 30px rgba(139,92,246,0.8);
  }
}

.text-glow-400 {
  text-shadow: 0 0 10px rgba(74, 222, 128, 0.5);
}
</style>
