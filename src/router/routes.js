const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('src/pages/Login/UserLogin.vue') },
      { path: '/adminHome', component: () => import('src/pages/AdminHome/AdminHome.vue') },
      { path: '/remitosView', component: () => import('src/components/Remitos/RemitosVIew.vue') },
      { path: '/remitosConsultarView', component: () => import('src/components/Remitos/components/ConsultarRemito.vue') },
      { path: '/gestionView', component: () => import('src/pages/Gestion/GestionView.vue') },
      { path: '/movimientosView', component: () => import('src/components/Tablas/TablasView.vue') },
      { path: '/exportarView', component: () => import('src/pages/ExportarDatos/ExportarView.vue') },      
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
