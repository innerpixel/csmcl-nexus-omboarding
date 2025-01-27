import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './style.css'

// Create app instance
const app = createApp(App)

// Use Pinia for state management
app.use(createPinia())

// Mount the app
app.mount('#app')
