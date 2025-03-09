import { createRouter, createWebHistory } from 'vue-router';
import Home from 'src/pages/home/home.vue'; // Página de inicio
import Login from 'src/pages/Login/UserLogin.vue'; // Componente de login
import Admin from 'src/pages/AdminHome/AdminHome.vue'

const routes = [
  {
    path: '/',
    name: 'LoginPage',
    component: Login, // Ruta para el login
  },
  {
    path: '/adminHome',
    name: 'AdminHome',
    component: Admin, // Ruta para Home administrativo
  },

  // Otras rutas...
];

const router = createRouter({
  history: createWebHistory(), // Usar historial sin hash
  routes,
});

export default router;
