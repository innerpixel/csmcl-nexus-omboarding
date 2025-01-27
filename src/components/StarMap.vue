<template>
  <div 
    ref="starMap" 
    class="relative w-full h-full bg-space-950 rounded-lg overflow-hidden border border-alien-500/20 transition-all duration-300"
    @mousemove="handleMouseMove"
    @click="handleStarClick"
  >
    <!-- Dynamic Stars -->
    <div 
      v-for="star in stars" 
      :key="star.id"
      :style="{
        left: `${star.x}%`,
        top: `${star.y}%`,
        transform: `scale(${star.size * (isLargeScreen ? 1.5 : 1)})`,
        opacity: star.baseOpacity
      }"
      class="absolute w-1 h-1 bg-white rounded-full transition-transform duration-300"
      :class="{
        'star-pulse': star.pulsing,
        'bg-alien-400': star.alien,
        'sm:w-1.5 sm:h-1.5 md:w-2 md:h-2': star.size > 0.8
      }"
      @mouseenter="highlightStar(star)"
    />

    <!-- Constellations -->
    <svg class="absolute inset-0 w-full h-full pointer-events-none">
      <path 
        v-for="constellation in constellations" 
        :key="constellation.id"
        :d="getConstellationPath(constellation.stars)"
        class="stroke-alien-500/30 md:stroke-2 transition-all duration-300"
        :class="{
          'hover:stroke-alien-400/50': isLargeScreen
        }"
        fill="none"
        stroke-width="1"
      />
    </svg>

    <!-- Hover Info -->
    <div 
      v-if="hoveredStar"
      :style="{
        left: `${hoveredStar.x}%`,
        top: `${hoveredStar.y}%`,
        transform: 'translate(-50%, -150%)'
      }"
      class="absolute z-10 px-3 py-1 text-xs sm:text-sm md:text-base font-mono bg-space-900/90 text-alien-300 rounded border border-alien-500/30"
    >
      {{ hoveredStar.name }}
    </div>

    <!-- Alien Activity Indicator -->
    <div 
      v-if="alienActivity"
      class="absolute bottom-4 left-4 flex items-center space-x-2 px-3 py-1 bg-alien-900/50 text-alien-300 rounded-full text-xs sm:text-sm md:text-base font-mono border border-alien-500/30 transform transition-all duration-300 hover:scale-105"
    >
      <span class="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 bg-alien-400 rounded-full animate-pulse"></span>
      <span>Alien Activity Detected</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onBeforeUnmount } from 'vue';
import { useAlienMessagesStore } from '../stores/alienMessages';

const store = useAlienMessagesStore();
const starMap = ref(null);
const hoveredStar = ref(null);
const alienActivity = ref(false);
const isLargeScreen = ref(window.innerWidth >= 768);

// Resize handler with debounce
let resizeTimeout;
const handleResize = () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    isLargeScreen.value = window.innerWidth >= 768;
  }, 250);
};

// Lifecycle hooks for event listeners
onMounted(() => {
  window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
  clearTimeout(resizeTimeout);
});

// Generate stars with stable properties
const baseStarCount = computed(() => isLargeScreen.value ? 75 : 50);

const generateStars = () => {
  return Array.from({ length: baseStarCount.value }, (_, i) => {
    const size = Math.random() * 0.5 + 0.5;
    return {
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size,
      baseOpacity: Math.random() * 0.3 + 0.7, // Higher base opacity
      pulsing: Math.random() > 0.8,
      alien: Math.random() > 0.95,
      name: `Star System ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}-${Math.floor(Math.random() * 999)}`
    };
  });
};

const stars = ref(generateStars());

// Generate constellations
const constellations = computed(() => {
  const result = [];
  const starCount = Math.min(5, Math.floor(stars.value.length * 0.2));
  
  for (let i = 0; i < 3; i++) {
    const constellationStars = [];
    for (let j = 0; j < starCount; j++) {
      const randomStar = stars.value[Math.floor(Math.random() * stars.value.length)];
      if (!constellationStars.includes(randomStar)) {
        constellationStars.push(randomStar);
      }
    }
    result.push({
      id: i,
      stars: constellationStars
    });
  }
  return result;
});

// Get SVG path for constellation
const getConstellationPath = (stars) => {
  if (!stars.length) return '';
  return stars.reduce((path, star, i) => {
    return `${path}${i === 0 ? 'M' : 'L'}${star.x} ${star.y}`;
  }, '');
};

// Handle star interaction with debounce
let highlightTimeout;
const highlightStar = (star) => {
  clearTimeout(highlightTimeout);
  highlightTimeout = setTimeout(() => {
    hoveredStar.value = star;
    if (star.alien) {
      alienActivity.value = true;
      setTimeout(() => {
        alienActivity.value = false;
      }, 3000);
    }
  }, 50);
};

// Handle mouse movement with throttle
let lastMove = 0;
const handleMouseMove = (e) => {
  const now = Date.now();
  if (now - lastMove < 50) return; // 50ms throttle
  lastMove = now;

  if (!starMap.value) return;
  const rect = starMap.value.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * 100;
  const y = ((e.clientY - rect.top) / rect.height) * 100;

  stars.value.forEach(star => {
    const dx = x - star.x;
    const dy = y - star.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < 10) {
      star.size = Math.min(1.5, 1 + (10 - distance) / 10);
    } else {
      star.size = 1;
    }
  });
};

// Handle star click with debounce
let clickTimeout;
const handleStarClick = (e) => {
  if (clickTimeout) return;
  clickTimeout = setTimeout(() => {
    clickTimeout = null;
    
    if (!starMap.value) return;
    const rect = starMap.value.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const clickedStar = stars.value.find(star => {
      const dx = x - star.x;
      const dy = y - star.y;
      return Math.sqrt(dx * dx + dy * dy) < 5;
    });

    if (clickedStar?.alien) {
      store.addAlienMessage({
        id: Date.now(),
        timestamp: new Date(),
        system: clickedStar.name,
        message: `Signal detected from ${clickedStar.name}...`,
        type: 'discovery'
      });
    }
  }, 300);
};
</script>

<style scoped>
.star-pulse {
  animation: starPulse 2s ease-in-out infinite;
}

@keyframes starPulse {
  0%, 100% { opacity: var(--base-opacity, 0.7); }
  50% { opacity: 0.3; }
}
</style>
