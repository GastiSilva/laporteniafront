import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from 'src/stores/auth';

const routes = [
  {
    path: '/',
    name: 'login',
    component: () => import('src/pages/Login/UserLogin.vue'),
  },
  {
    path: '/adminHome',
    component: () => import('src/pages/AdminHome/AdminHome.vue'),
    redirect: { name: 'remitos' },
    children: [
      { path: 'remitos', name: 'remitos', component: () => import('src/pages/Remitos/RemitosHome.vue') },
      { path: 'remitos/generar', name: 'remitosGenerar', component: () => import('src/pages/Remitos/GenerarRemito.vue') },
      { path: 'remitos/consultar', name: 'remitosConsultar', component: () => import('src/pages/Remitos/components/ConsultarRemito.vue') },
      { path: 'movimientos', name: 'movimientos', component: () => import('src/pages/Movimientos/MovimientosView.vue') },
      { path: 'datos', name: 'datos', component: () => import('src/pages/ExportarDatos/ExportarDatosView.vue') },
      { path: 'gestion', name: 'gestion', component: () => import('src/pages/Gestion/GestionView.vue') },
    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('src/pages/ErrorNotFound.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  const auth = useAuthStore();
  const isAdminRoute = to.matched.some((record) => record.path === '/adminHome');

  if (isAdminRoute && !auth.isAuthenticated) {
    return { name: 'login' };
  }

  if (to.name === 'login' && auth.isAuthenticated) {
    return { name: 'remitos' };
  }

  return true;
});

export default router;
