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
        opacity: star.opacity
      }"
      class="absolute w-1 h-1 bg-white rounded-full transition-all duration-1000"
      :class="{
        'animate-pulse': star.pulsing,
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
        :class="{
          'stroke-alien-500/30 md:stroke-2': true,
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
import { ref, onMounted, computed } from 'vue';
import { useAlienMessagesStore } from '../stores/alienMessages';

const store = useAlienMessagesStore();
const starMap = ref(null);
const hoveredStar = ref(null);
const alienActivity = ref(false);
const isLargeScreen = ref(window.innerWidth >= 768);

// Update isLargeScreen on window resize
onMounted(() => {
  window.addEventListener('resize', () => {
    isLargeScreen.value = window.innerWidth >= 768;
  });
});

// Generate more stars for larger screens
const baseStarCount = computed(() => isLargeScreen.value ? 75 : 50);

// Generate random stars
const stars = ref(Array.from({ length: baseStarCount.value }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 0.5 + 0.5,
  opacity: Math.random() * 0.5 + 0.5,
  pulsing: Math.random() > 0.8,
  alien: Math.random() > 0.95,
  name: `Star System ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}-${Math.floor(Math.random() * 999)}`
})));

// Generate constellations
const constellations = computed(() => {
  const result = [];
  for (let i = 0; i < 3; i++) {
    const constellationStars = [];
    const startStar = stars.value[Math.floor(Math.random() * stars.value.length)];
    constellationStars.push(startStar);
    
    for (let j = 0; j < 3; j++) {
      const lastStar = constellationStars[constellationStars.length - 1];
      const nearbyStars = stars.value.filter(s => 
        s !== lastStar && 
        Math.abs(s.x - lastStar.x) < 20 && 
        Math.abs(s.y - lastStar.y) < 20
      );
      if (nearbyStars.length) {
        constellationStars.push(nearbyStars[0]);
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
  return stars.map((star, i) => 
    `${i === 0 ? 'M' : 'L'} ${star.x} ${star.y}`
  ).join(' ');
};

// Handle star interaction
const highlightStar = (star) => {
  hoveredStar.value = star;
  if (star.alien) {
    alienActivity.value = true;
    setTimeout(() => {
      alienActivity.value = false;
    }, 3000);
    
    // Trigger alien notification
    store.addToHistory({
      type: 'DISCOVERY',
      message: `Alien activity detected in ${star.name}!`,
      timestamp: Date.now()
    });
  }
};

// Handle mouse movement
const handleMouseMove = (e) => {
  const rect = starMap.value.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * 100;
  const y = ((e.clientY - rect.top) / rect.height) * 100;
  
  // Make nearby stars pulse
  stars.value.forEach(star => {
    const distance = Math.sqrt(
      Math.pow(star.x - x, 2) + 
      Math.pow(star.y - y, 2)
    );
    if (distance < 10) {
      star.opacity = 1;
      star.pulsing = true;
    } else {
      star.opacity = star.opacity * 0.95 + 0.5 * 0.05;
      star.pulsing = false;
    }
  });
};

// Handle star click
const handleStarClick = async (e) => {
  const rect = starMap.value.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * 100;
  const y = ((e.clientY - rect.top) / rect.height) * 100;
  
  // Find clicked star
  const clickedStar = stars.value.find(star => 
    Math.abs(star.x - x) < 5 && 
    Math.abs(star.y - y) < 5
  );
  
  if (clickedStar) {
    // Add new star near clicked star
    const newStar = {
      id: stars.value.length,
      x: clickedStar.x + (Math.random() - 0.5) * 10,
      y: clickedStar.y + (Math.random() - 0.5) * 10,
      size: Math.random() * 0.5 + 0.5,
      opacity: 1,
      pulsing: true,
      alien: Math.random() > 0.8,
      name: `Star System ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}-${Math.floor(Math.random() * 999)}`
    };
    stars.value.push(newStar);
    
    // Trigger notification
    store.addToHistory({
      type: 'MESSAGE',
      message: `New star system discovered near ${clickedStar.name}!`,
      timestamp: Date.now()
    });
  }
};
</script>
