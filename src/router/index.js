// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue' // istersen '@/views/HomePage.vue' da kullanabilirsin

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage,
  },
  // Opsiyonel: bilinmeyen yolları anasayfaya yönlendir
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
