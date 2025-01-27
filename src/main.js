import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router/index.js'
import App from './App.vue'
import './style.css'
import { registerServiceWorker, checkForUpdates } from './utils/serviceWorkerRegistration'

// Create app instance
const app = createApp(App)

// Use Pinia for state management
app.use(createPinia())

// Use router
app.use(router)

// Register service worker
registerServiceWorker()

// Check for updates periodically
setInterval(checkForUpdates, 60 * 60 * 1000) // Check every hour

// Mount the app
app.mount('#app')
