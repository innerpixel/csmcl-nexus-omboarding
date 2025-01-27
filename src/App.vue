<template>
  <div class="min-h-screen bg-space-950 text-gray-100">
    <div class="p-4">
      <h1 class="text-2xl font-bold mb-4">Alien Transmissions</h1>
      <p>PWA is working!</p>
    </div>
  </div>
</template>

<script setup>
// Component logic will go here
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap');

:root {
  --color-space-950: #0a0a1f;
  --color-gray-100: #f3f4f6;
}

body {
  font-family: 'Space Mono', monospace;
  margin: 0;
  padding: 0;
}

.bg-space-950 {
  background-color: var(--color-space-950);
}

.text-gray-100 {
  color: var(--color-gray-100);
}
</style>
