<template>
  <div class="admin-shell">
    <aside class="sidebar" :class="{ 'sidebar--collapsed': menuCollapsed }">
      <div class="sidebar__brand">
        <img src="~assets/laportenialogo.png" alt="La Porteña" class="sidebar__logo" />
        <q-btn
          flat
          round
          dense
          size="sm"
          :icon="menuCollapsed ? 'chevron_right' : 'chevron_left'"
          class="sidebar__toggle"
          @click="toggleMenu"
        >
          <q-tooltip anchor="center right" self="center left">
            {{ menuCollapsed ? 'Expandir menú' : 'Contraer menú' }}
          </q-tooltip>
        </q-btn>
      </div>

      <nav class="sidebar__nav">
        <router-link
          v-for="item in navItems"
          :key="item.nombre"
          :to="{ name: item.nombre }"
          class="nav-item"
          active-class="nav-item--active"
        >
          <q-icon :name="item.icono" size="20px" class="nav-item__icon" />
          <span v-if="!menuCollapsed" class="nav-item__label">{{ item.label }}</span>
          <q-tooltip v-if="menuCollapsed" anchor="center right" self="center left">
            {{ item.label }}
          </q-tooltip>
        </router-link>
      </nav>

      <div class="sidebar__footer">
        <button class="nav-item nav-item--logout" type="button" @click="cerrarSesion">
          <q-icon name="logout" size="20px" class="nav-item__icon" />
          <span v-if="!menuCollapsed" class="nav-item__label">Cerrar sesión</span>
          <q-tooltip v-if="menuCollapsed" anchor="center right" self="center left">
            Cerrar sesión
          </q-tooltip>
        </button>
      </div>
    </aside>

    <main class="admin-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useAuthStore } from 'src/stores/auth';

export default {
  name: 'AdminHome',
  setup() {
    const router = useRouter();
    const $q = useQuasar();
    const auth = useAuthStore();

    // Arranca contraido en pantallas chicas para no comerse el ancho util.
    const menuCollapsed = ref($q.screen.lt.md);

    const navItems = [
      { nombre: 'remitos', label: 'Remitos', icono: 'receipt_long' },
      { nombre: 'movimientos', label: 'Movimientos', icono: 'inventory_2' },
      { nombre: 'datos', label: 'Exportar', icono: 'file_download' },
      { nombre: 'gestion', label: 'Gestionar', icono: 'tune' },
    ];

    const toggleMenu = () => {
      menuCollapsed.value = !menuCollapsed.value;
    };

    const cerrarSesion = () => {
      $q.dialog({
        title: 'Cerrar sesión',
        message: '¿Querés salir del sistema?',
        ok: { label: 'Salir', color: 'primary', unelevated: true, noCaps: true },
        cancel: { label: 'Cancelar', color: 'grey-8', flat: true, noCaps: true },
      }).onOk(() => {
        auth.logout();
        router.push({ name: 'login' });
      });
    };

    return {
      menuCollapsed,
      navItems,
      toggleMenu,
      cerrarSesion,
    };
  },
};
</script>

<style scoped>
.admin-shell {
  display: flex;
  min-height: 100vh;
  background: var(--color-surface);
}

/* --- Sidebar --- */
.sidebar {
  width: 232px;
  flex-shrink: 0;
  background: var(--color-brand-secondary);
  color: #fff;
  display: flex;
  flex-direction: column;
  transition: width 0.2s ease;
}

.sidebar--collapsed {
  width: 68px;
}

.sidebar__brand {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 1rem 0.75rem;
  border-bottom: 1px solid rgb(255 255 255 / 0.1);
  min-height: 72px;
}

.sidebar__logo {
  max-height: 40px;
  max-width: 120px;
  object-fit: contain;
  background: #fff;
  border-radius: 8px;
  padding: 4px 6px;
}

.sidebar--collapsed .sidebar__logo {
  display: none;
}

.sidebar__toggle {
  color: rgb(255 255 255 / 0.75);
  margin-left: auto;
}

.sidebar__nav {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 0.75rem 0.5rem;
  flex: 1;
}

.sidebar__footer {
  padding: 0.75rem 0.5rem;
  border-top: 1px solid rgb(255 255 255 / 0.1);
}

/* --- Items de navegacion --- */
.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 0.75rem;
  border-radius: 8px;
  color: rgb(255 255 255 / 0.72);
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: background-color 0.15s ease, color 0.15s ease;
  /* reset para el <button> del logout */
  width: 100%;
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
  text-align: left;
}

.nav-item:hover {
  background: rgb(255 255 255 / 0.08);
  color: #fff;
}

.nav-item--active {
  background: rgb(255 255 255 / 0.14);
  color: #fff;
}

.nav-item__icon {
  flex-shrink: 0;
}

.nav-item__label {
  white-space: nowrap;
  overflow: hidden;
}

.nav-item--logout:hover {
  background: rgb(239 68 68 / 0.18);
  color: #fecaca;
}

.sidebar--collapsed .nav-item {
  justify-content: center;
  padding-inline: 0;
}

/* --- Contenido --- */
.admin-content {
  flex: 1;
  min-width: 0; /* permite que las tablas anchas hagan scroll en vez de empujar el layout */
  overflow-x: auto;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
