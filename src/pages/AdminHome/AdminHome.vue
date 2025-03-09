<template>
  <AdminLayout>
    <div class="all-container">
      <!-- Splitter para el layout principal -->
      <q-splitter v-model="splitterModel" class="custom-splitter" style="height: 100vh; background-color: #ffffed;" :limits="[5, 30]">

        <!-- Menú lateral con colores personalizados -->
        <template v-slot:before>
          <div :style="menuCollapsed ? 'width: 60%;' : 'width: 45%;'" class="menu-lateral q-pa-md">
            <!-- Botón para colapsar/expandir el menú -->
            <q-btn icon="menu" flat round dense @click="toggleMenu" class="q-mb-md text-white" />
            <q-tabs v-model="tab" vertical class="tabs-lateral text-white"
              :style="menuCollapsed ? 'width: 50px;' : 'width: 100%;'">
              <!-- Tabs con íconos y etiquetas -->
                <q-tab name="remitos" icon="fa-solid fa-file-invoice-dollar" :label="!menuCollapsed ? 'Remitos' : ''"
                class="tab-item">
                <q-tooltip anchor="top middle" self="bottom middle">
                  Remitos
                </q-tooltip>
                </q-tab>
                <q-tab name="movimientos" icon="fa-solid fa-table-list" :label="!menuCollapsed ? 'Movimientos' : ''"
                class="tab-item">
                <q-tooltip anchor="top middle" self="bottom middle">
                  Movimientos
                </q-tooltip>
                </q-tab>
                <q-tab name="datos" icon="fa-solid fa-print" :label="!menuCollapsed ? 'Datos' : ''" class="tab-item">
                <q-tooltip anchor="top middle" self="bottom middle">
                  Datos
                </q-tooltip>
                </q-tab>
                <q-tab v-if="false" name="consultarCV" icon="fa-solid fa-folder" :label="!menuCollapsed ? 'Consultar CV' : ''"
                class="tab-item">
                </q-tab>
            </q-tabs>
          </div>
        </template>

        <!-- Contenido dinámico -->
        <template v-slot:after>
          <q-tab-panels v-model="tab" animated swipeable vertical transition-prev="jump-up" transition-next="jump-up"
  class="q-pa-md tab-content">

            class="q-pa-md">
            <q-tab-panel name="remitos">
              <RemitosView :menuCollapsed="menuCollapsed" @toggleMenu="toggleMenu" />
            </q-tab-panel>

            <q-tab-panel name="movimientos">
              <TablasView />
            </q-tab-panel>

            <q-tab-panel name="datos">
              <ExportarDatosView />
            </q-tab-panel>

            <q-tab-panel name="consultarCV">
              <div class="text-h4 q-mb-md">Consultar CV</div>
              <p>Herramienta para consultar currículums y perfiles.</p>
            </q-tab-panel>
          </q-tab-panels>
        </template>
      </q-splitter>
    </div>
  </AdminLayout>
</template>

<script>
import { ref, watch } from 'vue';
import RemitosView from '../../components/Remitos/RemitosVIew.vue';
import TablasView from '../../components/Tablas/TablasView.vue';
import ExportarDatosView from '../ExportarDatos/ExportarDatosView.vue';

export default {
  components: {
    RemitosView,
    TablasView,
    ExportarDatosView
  },
  setup() {
    const splitterModel = ref(20); // Ancho inicial del panel izquierdo
    const tab = ref('remitos');    // Pestaña seleccionada por defecto
    const menuCollapsed = ref(false); // Estado para determinar si el menú está colapsado o no

    // Colapsar el menú cuando se selecciona una nueva pestaña
    watch(tab, () => {
      setTimeout(() => {
        menuCollapsed.value = true;
        splitterModel.value = 5; // Colapsar el menú al 5% de ancho
      }, 300);
    });

    // Función para alternar entre colapsar y expandir el menú
    const toggleMenu = () => {
      if (menuCollapsed.value) {
        splitterModel.value = 20; // Restaurar el tamaño original del menú
        menuCollapsed.value = false;
      } else {
        splitterModel.value = 5;  // Colapsar el menú
        menuCollapsed.value = true;
      }
    };

    return {
      splitterModel,
      tab,
      menuCollapsed,
      toggleMenu
    };
  }
};
</script>


<style scoped>

/* Estilos personalizados para el menú lateral */
.menu-lateral {
  background-color: #0e1d75;
  /* Color de fondo */
  color: white;
  /* Color del texto en el menú lateral */
  height: 100%;
  /* Asegura que el fondo ocupe toda la altura del panel */
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}

.tabs-lateral .q-tab__button {
  color: black;

}

/* Estilo para la pestaña activa */
.tab-item.q-tab--active .q-tab__button {
  background-color: #1e88e5;
  color: white;
}

/* Efecto hover en las tabs */
.tabs-lateral .q-tab__button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

::v-deep .q-splitter__separator-area {
  background-color: #3f51b5 !important;
  
}

::v-deep .q-splitter__separator {
  background-color: transparent !important;
  border: none !important;
  width: 0 !important;
  display: none !important;
}

.q-splitterpanel q-splitterbefore{
  width: 100%;
}

.tab-content {
  background-color: #ffffed;
  min-height: 100vh;
}

::v-deep .q-splitter__panel--after {
  background-color: #ffffed;
}

</style>