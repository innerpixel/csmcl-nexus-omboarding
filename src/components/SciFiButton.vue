<script setup>
defineProps({
  text: {
    type: String,
    required: true
  }
})
</script>

<template>
  <button class="relative px-8 py-3 bg-space-800 text-glow-400 rounded-lg overflow-hidden group hover:bg-space-700 transition-all duration-300">
    <span class="relative z-10 font-mono tracking-wider">{{ text }}</span>
    <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <div class="w-full h-px bg-gradient-to-r from-transparent via-glow-400 to-transparent animate-pulse"></div>
    </div>
  </button>
</template>
