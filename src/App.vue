<script setup>
import AlienLogo from './components/AlienLogo.vue'
import SciFiButton from './components/SciFiButton.vue'
import PWABadge from './components/PWABadge.vue'
import AlienNotifications from './components/AlienNotifications.vue'
import AlienMessageManager from './components/AlienMessageManager.vue'
</script>

<template>
  <div class="min-h-screen bg-space-900 text-white flex flex-col items-center justify-center p-4">
    <!-- Background effect -->
    <div class="fixed inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.15),transparent_70%)]"></div>
    
    <!-- Stars effect -->
    <div class="fixed inset-0" aria-hidden="true">
      <div class="absolute inset-0 bg-space-900" 
           style="background-image: radial-gradient(white 1px, transparent 1px); background-size: 50px 50px; opacity: 0.2;"></div>
    </div>

    <!-- Content -->
    <div class="relative z-10 text-center max-w-md w-full">
      <AlienLogo />
      
      <h1 class="mt-8 text-4xl md:text-6xl font-bold bg-gradient-to-r from-alien-500 to-alien-600 text-transparent bg-clip-text animate-glow">
        NEXUS PORTAL
      </h1>
      
      <p class="mt-4 text-lg md:text-xl text-gray-400 font-mono max-w-md mx-auto">
        Welcome to the future of onboarding
      </p>
      
      <div class="mt-12 space-y-8">
        <SciFiButton text="ENTER PORTAL" />
        
        <!-- Notification Section -->
        <div class="p-6 bg-space-800/50 rounded-lg backdrop-blur-sm border border-alien-500/20">
          <h2 class="text-xl font-mono text-alien-500 mb-4">Alien Transmissions</h2>
          <AlienNotifications />
        </div>
        
        <!-- Message Manager Section -->
        <div class="p-6 bg-space-800/50 rounded-lg backdrop-blur-sm border border-alien-500/20">
          <h2 class="text-xl font-mono text-alien-500 mb-4">Message Control</h2>
          <AlienMessageManager />
        </div>
      </div>

      <div class="mt-8">
        <PWABadge />
      </div>
    </div>
  </div>
</template>

<style>
@keyframes glow {
  from {
    text-shadow: 0 0 20px rgba(99,102,241,0.5);
  }
  to {
    text-shadow: 0 0 30px rgba(139,92,246,0.8);
  }
}
</style>
