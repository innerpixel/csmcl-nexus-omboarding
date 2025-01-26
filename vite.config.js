import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/csmcl-nexus-omboarding/' : '/',
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json,vue,txt,woff2}']
      },
      manifest: {
        name: 'Alien Transmissions PWA',
        short_name: 'Alien PWA',
        description: 'An alien-themed PWA with push notifications',
        theme_color: '#0a0a1f',
        background_color: '#0a0a1f',
        display: 'standalone',
        orientation: 'portrait',
        start_url: process.env.NODE_ENV === 'production' ? '/csmcl-nexus-omboarding/' : '/',
        scope: process.env.NODE_ENV === 'production' ? '/csmcl-nexus-omboarding/' : '/',
        icons: [
          {
            src: 'pwa-64x64.png',
            sizes: '64x64',
            type: 'image/png'
          },
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      }
    })
  ]
})