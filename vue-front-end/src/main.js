import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import authStore from './stores/auth';
import App from './App.vue'
import router from './router'

const initApp = async () => {
  const app = createApp(App)
  app.use(createPinia())
  app.use(router)

  if (localStorage.getItem('token')) {
    try {
      await authStore.checkAuth();
    } catch (error) {
      console.error('Failed to check authentication status:', error);
    }
  }

  app.mount('#app')
}

initApp();
