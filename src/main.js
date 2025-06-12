import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'

// Styles
import './assets/css/global.css'

// Plugins
import axios from './plugins/axios'

const app = createApp(App)

// Install plugins
app.use(createPinia())
app.use(router)
app.config.globalProperties.$http = axios

// Global error handler
app.config.errorHandler = (error, instance, info) => {
  console.error('Global error:', error)
  console.error('Error info:', info)
}

app.mount('#app')