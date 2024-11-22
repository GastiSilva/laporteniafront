<template>
  <q-layout>
    <!-- Contenido principal -->
    <q-page-container>
      <div class="q-pa-md">
        <!-- Vista inicial con los botones -->
        <div v-if="currentView === 'main'">
          <div class="row justify-center q-gutter-md">
            <q-btn @click="setCurrentView('generar')" label="Generar Remito" color="primary" />
            <q-btn @click="setCurrentView('consultar')" label="Consultar Remito" color="secondary" />
          </div>
        </div>

        <!-- Vista de Generar Remito -->
        <div v-if="currentView === 'generar'">
          <h4 class="titulo-rem">Generar Remito</h4>
          <div class="row q-col-gutter-md">
            <div class="col-5">
              <q-select v-model="fecha" label="Fecha (Año, Mes, Día)" outlined class="q-ma-sm" :error="!fecha && errorIntento" dense>
                <template v-slot:append>
                  <q-icon name="event" />
                </template>
                <q-popup-proxy cover>
                  <q-date v-model="fecha" mask="YYYY-MM-DD" format="DD/MM/YYYY" default-view="Calendar" />
                </q-popup-proxy>
              </q-select>
            </div>
          </div>

          <div class="row q-col-gutter-md">
            <div class="col-6">
              <q-input v-model="senior" label="Señor" outlined class="q-ma-sm" :error="!senior && errorIntento" />
            </div>
            <div class="col-6">
              <q-input v-model="domicilio" label="Domicilio" outlined class="q-ma-sm" :error="!domicilio && errorIntento" />
            </div>
          </div>

          <div class="row q-col-gutter-md">
            <div class="col-2">
              <q-input v-model="codigo" label="Código" outlined class="q-ma-sm" :error="!codigo && errorIntento" />
            </div>
            <div class="col-10">
              <q-input v-model="producto" label="Producto" outlined class="q-ma-sm" :error="!producto && errorIntento" />
            </div>
          </div>

          <div class="row q-col-gutter-md">
            <div class="col-2">
              <q-input v-model="cantidad" label="Cantidad" type="number" outlined class="q-ma-sm" :error="!cantidad && errorIntento" />
            </div>
            <div class="col-5">
              <q-input v-model="precioUnitario" label="Precio Unitario" type="number" outlined class="q-ma-sm" :error="!precioUnitario && errorIntento" />
            </div>
            <div class="col-5">
              <!-- Subtotal calculado automáticamente -->
              <q-input v-model="subtotal" label="Sub Total" type="number" outlined class="q-ma-sm" readonly />
            </div>
          </div>

          <div class="row q-col-gutter-md">
            <div class="col-2">
              <q-select v-model="selectedEstado" :options="estadoOptions" label="Estado" outlined class="q-ma-sm" dense clearable :error="!selectedEstado && errorIntento" />
            </div>
          </div>

          <!-- Botón para agregar el producto a la tabla -->
          <q-btn @click="agregarProducto" label="Agregar Producto" color="primary" class="q-ma-xs" />
          <q-btn @click="downloadPDF" label="Descargar Remito PDF" color="primary" class="q-ma-xs" />
          <q-btn flat label="Volver" color="secondary" class="q-ma-md" @click="setCurrentView('main')" />

          <!-- Mostrar tabla de productos -->
          <q-table :rows="productos" :columns="columns" row-key="codigo">
            <template v-slot:body-cell-actions="props">
              <q-td align="center">
                <div style="display: flex; justify-content: flex-end;">
                  <q-btn icon="fa-solid fa-trash-can" flat dense color="negative" @click="deleteProducto(props.row.codigo)" />
                </div>
              </q-td>
            </template>
          </q-table>

          <q-banner v-if="errorMessage" color="negative">
            {{ errorMessage }}
          </q-banner>
        </div>

        <!-- Vista de Consultar Remito -->
        <div v-if="currentView === 'consultar'">
          <ConsultarRemito :setCurrentView="setCurrentView" />
        </div>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref, computed } from 'vue';
import ConsultarRemito from './components/ConsultarRemito.vue';
import { RemitoPDFAPI } from 'src/pages/AdminHome/service/AdminAPI';

export default {
  components: {
    ConsultarRemito,
  },
  setup() {
    const currentView = ref('main');
    const estadoOptions = ['Pagado', 'Adeudado', 'Pendiente'];

    // Campos principales
    const fecha = ref('');
    const senior = ref('');
    const domicilio = ref('');
    const codigo = ref('');
    const producto = ref('');
    const cantidad = ref(null);
    const precioUnitario = ref('');
    const selectedEstado = ref(null);

    // Campo subtotal calculado automáticamente
    const subtotal = computed(() => {
      console.log('Cantidad:', cantidad.value, 'Precio Unitario:', precioUnitario.value);
      return cantidad.value && precioUnitario.value
        ? parseFloat(cantidad.value) * parseFloat(precioUnitario.value)
        : 0; // Cambié el valor por defecto a 0 en lugar de ''
    });

    const errorMessage = ref('');
    const errorIntento = ref(false);

    const productos = ref([]);
    const columns = ref([
      { name: 'codigo', label: 'Código', align: 'left', field: row => row.codigo },
      { name: 'producto', label: 'Producto', align: 'left', field: row => row.producto },
      { name: 'cantidad', label: 'Cantidad', align: 'left', field: row => row.cantidad },
      { name: 'precioUnitario', label: 'Precio Unitario', align: 'left', field: row => row.precioUnitario },
      { name: 'subtotal', label: 'Sub Total', align: 'left', field: row => row.subtotal },
      { name: 'actions', label: 'Acciones', align: 'right' },
    ]);

    const setCurrentView = (view) => {
      currentView.value = view;
    };

    const validarCampos = (campos) => {
      if (campos.some(campo => !campo)) {
        errorIntento.value = true;
        errorMessage.value = 'Por favor, complete todos los campos obligatorios.';
        return false;
      }
      return true;
    };

    const agregarProducto = () => {
      if (validarCampos([codigo.value, producto.value, cantidad.value, precioUnitario.value])) {
        productos.value.push({
          codigo: codigo.value,
          producto: producto.value,
          cantidad: parseFloat(cantidad.value),
          precioUnitario: parseFloat(precioUnitario.value),
          subtotal: subtotal.value,
        });

        // Limpiar campos
        codigo.value = '';
        producto.value = '';
        cantidad.value = null;
        precioUnitario.value = '';
        errorMessage.value = '';
      }
    };

    const downloadPDF = async () => {
      if (validarCampos([senior.value, domicilio.value, fecha.value])) {
        try {
          await RemitoPDFAPI();
        } catch (error) {
          errorMessage.value = 'Error al descargar el PDF: ' + error.message;
        }
      }
    };

    const deleteProducto = (codigo) => {
      productos.value = productos.value.filter(producto => producto.codigo !== codigo);
    };

    return {
      currentView,
      setCurrentView,
      estadoOptions,
      senior,
      domicilio,
      codigo,
      producto,
      cantidad,
      fecha,
      precioUnitario,
      subtotal,
      selectedEstado,
      errorMessage,
      errorIntento,
      downloadPDF,
      productos,
      columns,
      agregarProducto,
      deleteProducto,
    };
  },
};
</script>

<style>
.titulo-rem {
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  color: #3f51b5;
}
</style>
