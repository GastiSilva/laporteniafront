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
          <!-- Todo el contenido del template para "Generar Remito" -->
          <div class="row q-col-gutter-md">
            <div class="col-5">
              <q-select v-model="fecha" label="Fecha (Año, Mes, Dia)" outlined class="q-ma-sm"
                :error="!fecha && errorIntento" dense>
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
              <q-input v-model="domicilio" label="Domicilio" outlined class="q-ma-sm"
                :error="!domicilio && errorIntento" />
            </div>
          </div>
          <div class="row q-col-gutter-md">
            <div class="col-2">
              <q-input v-model="codigo" label="Código" outlined class="q-ma-sm" :error="!codigo && errorIntento" />
            </div>
            <div class="col-10">
              <q-input v-model="producto" label="Producto" outlined class="q-ma-sm"
                :error="!producto && errorIntento" />
            </div>
          </div>
          <div class="row q-col-gutter-md">
            <div class="col-2">
              <q-input v-model="cantidad" label="Cantidad" type="number" outlined class="q-ma-sm"
                :error="!cantidad && errorIntento" />
            </div>
            <div class="col-5">
              <q-input v-model="precioUnitario" label="Precio Unitario" type="number" outlined class="q-ma-sm"
                :error="!precioUnitario && errorIntento" />
            </div>
            <div class="col-5">
              <q-input v-model="subTotal" label="Sub Total" type="number" outlined class="q-ma-sm"
                :error="!subTotal && errorIntento" />
            </div>
          </div>
          <div class="row q-col-gutter-md">
            <div class="col-2">
              <q-select v-model="selectedEstado" :options="estadoOptions" label="Estado" outlined class="q-ma-sm" dense
                clearable :error="!selectedEstado && errorIntento" />
            </div>
          </div>

          <!-- Botón para agregar el producto a la tabla -->
          <q-btn @click="agregarProducto" label="Agregar Producto" color="primary" class="q-ma-xs" />

          <!-- Botón para descargar PDF -->
          <q-btn @click="downloadPDF" label="Descargar Remito PDF" color="primary" class="q-ma-xs" />
          <q-btn flat label="Volver" color="secondary" class="q-ma-md" @click="setCurrentView('main')" />

          <!-- Mostrar tabla de productos -->
          <q-table :rows="productos" :columns="columns" row-key="codigo" />

          <q-banner v-if="errorMessage" color="negative">
            {{ errorMessage }}
          </q-banner>
        </div>

        <!-- Vista de Consultar Remito -->
        <div v-if="currentView === 'consultar'">
          <ConsultarRemito @click="setCurrentView('main')" />
        </div>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref } from 'vue';
import ConsultarRemito from './components/ConsultarRemito.vue';


export default {
  components: {
    ConsultarRemito
  },
  setup() {
    const currentView = ref('main'); // Controla la vista actual
    const estadoOptions = ['Pagado', 'Adeudado', 'Pendiente'];
    const fecha = ref('');
    const senior = ref('');
    const domicilio = ref('');
    const codigo = ref('');
    const producto = ref('');
    const cantidad = ref(null);
    const precioUnitario = ref('');
    const subtotal = ref('');
    const selectedEstado = ref(null);

    const errorMessage = ref('');
    const errorIntento = ref(false);

    const codigoRemito = ref('');
    const resultado = ref(null);

    const productos = ref([]);
    const columns = ref([
      { name: 'codigo', label: 'Código', align: 'left', field: row => row.codigo },
      { name: 'producto', label: 'Producto', align: 'left', field: row => row.producto },
      { name: 'cantidad', label: 'Cantidad', align: 'left', field: row => row.cantidad },
      { name: 'precioUnitario', label: 'Precio Unitario', align: 'left', field: row => row.precioUnitario },
      { name: 'subtotal', label: 'Sub Total', align: 'left', field: row => row.subtotal }
    ]);

    const setCurrentView = (view) => {
      currentView.value = view;
    };

    const downloadPDF = async () => {
      errorMessage.value = '';
      errorIntento.value = false;

      if (!senior.value || !domicilio.value || !codigo.value || !producto.value || !cantidad.value || !fecha.value) {
        errorIntento.value = true;
        errorMessage.value = 'Por favor, complete todos los campos obligatorios.';
        return;
      }

      try {
        // Lógica para descargar PDF (pendiente)
      } catch (error) {
        errorMessage.value = 'Error al descargar el PDF: ' + error.message;
      }
    };

    const buscarRemito = () => {
      resultado.value = `Detalles del remito con código ${codigoRemito.value}`;
    };

    const agregarProducto = () => {
      if (codigo.value && producto.value && cantidad.value && precioUnitario.value) {
        const nuevoProducto = {
          codigo: codigo.value,
          producto: producto.value,
          cantidad: cantidad.value,
          precioUnitario: precioUnitario.value,
          subtotal: cantidad.value * precioUnitario.value
        };
        productos.value.push(nuevoProducto);

        // Limpiar los campos después de agregar el producto
        codigo.value = '';
        producto.value = '';
        cantidad.value = null;
        precioUnitario.value = '';
        subtotal.value = '';
      } else {
        errorMessage.value = 'Por favor, complete todos los campos antes de agregar el producto.';
      }
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
      codigoRemito,
      resultado,
      buscarRemito,
      productos,
      columns,
      agregarProducto
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
