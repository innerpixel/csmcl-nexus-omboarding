<template>
  <div class="animate-float">
    <svg class="w-32 h-32" viewBox="0 0 512 512">
      <defs>
        <linearGradient id="alien-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" class="text-alien-500" style="stop-color:currentColor"/>
          <stop offset="100%" class="text-alien-600" style="stop-color:currentColor"/>
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <circle cx="256" cy="256" r="240" fill="url(#alien-grad)" filter="url(#glow)"/>
      <ellipse cx="186" cy="200" rx="60" ry="90" fill="#000" transform="rotate(-15 186 200)"/>
      <ellipse cx="326" cy="200" rx="60" ry="90" fill="#000" transform="rotate(15 326 200)"/>
      <circle cx="186" cy="200" r="20" fill="#fff" filter="url(#glow)" class="animate-pulse-slow"/>
      <circle cx="326" cy="200" r="20" fill="#fff" filter="url(#glow)" class="animate-pulse-slow"/>
      <path d="M176 320 Q256 380 336 320" stroke="#000" stroke-width="12" fill="none"/>
    </svg>
  </div>
</template>
