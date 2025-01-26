import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/csmcl-nexus-omboarding/',
  plugins: [
    vue(), 
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'public',
      filename: 'sw-push.js',
      injectRegister: 'auto',
      registerType: 'autoUpdate',
      injectManifest: {
        injectionPoint: 'self.__WB_MANIFEST',
        swSrc: 'public/sw-push.js',
        swDest: 'dist/sw-push.js',
        globDirectory: 'dist',
        globPatterns: [
          '**/*.{html,js,css,png,jpg,svg,ico}'
        ],
      },
      manifest: {
        name: 'CSMCL Nexus Onboarding',
        short_name: 'Nexus',
        description: 'CSMCL Nexus Onboarding Application',
        theme_color: '#0a0a1f',
        background_color: '#0a0a1f',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/csmcl-nexus-omboarding/',
        scope: '/csmcl-nexus-omboarding/',
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
      },
      devOptions: {
        enabled: true,
        type: 'module',
        navigateFallback: 'index.html'
      }
    })
  ]
})