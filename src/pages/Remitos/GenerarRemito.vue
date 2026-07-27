<template>
  <div class="q-pa-lg">
    <div class="page-header">
      <div>
        <h1 class="page-title">Generar Remito</h1>
        <p class="page-subtitle">Completá los datos del cliente y agregá los productos.</p>
      </div>
      <q-btn
        outline
        rounded
        no-caps
        label="Volver"
        icon="arrow_back"
        color="primary"
        :to="{ name: 'remitos' }"
      />
    </div>

    <q-form @submit.prevent="enviarRemito">
      <div class="surface-card q-pa-lg q-mb-md">
        <div class="seccion-titulo">Datos del remito</div>

        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-4">
            <q-select
              v-model="fecha"
              label="Fecha"
              outlined
              dense
              bg-color="white"
              hide-bottom-space
              :error="!fecha && errorIntento"
            >
              <template v-slot:append>
                <q-icon name="event" />
              </template>
              <q-popup-proxy cover>
                <q-date v-model="fecha" mask="YYYY-MM-DD" format="DD/MM/YYYY" default-view="Calendar" />
              </q-popup-proxy>
            </q-select>
          </div>
          <div class="col-12 col-md-5">
            <q-select
              v-model="selectedCliente"
              label="Seleccionar cliente"
              :options="filteredClientes"
              option-label="Nombre"
              outlined
              dense
              bg-color="white"
              use-input
              input-debounce="300"
              clearable
              hide-bottom-space
              @filter="filterClientes"
            />
          </div>
          <div class="col-12 col-md-3">
            <q-btn
              label="Nuevo cliente"
              color="primary"
              outline
              icon="person_add"
              no-caps
              class="full-width"
              @click="mostrarFormularioCliente = true"
            />
          </div>
        </div>

        <div class="row q-col-gutter-md q-mt-xs">
          <div class="col-12 col-md-6">
            <q-input
              v-model="cliente.Nombre"
              label="Señor"
              outlined
              dense
              bg-color="white"
              hide-bottom-space
              :error="!cliente.Nombre && errorIntento"
            />
          </div>
          <div class="col-12 col-md-4">
            <q-input
              v-model="domicilio"
              label="Domicilio"
              outlined
              dense
              bg-color="white"
              hide-bottom-space
              :error="!domicilio && errorIntento"
            />
          </div>
          <div class="col-12 col-md-2">
            <q-select
              v-model="selectedEstado"
              :options="estadoOptions"
              label="Estado"
              outlined
              dense
              bg-color="white"
              clearable
              hide-bottom-space
              :error="!selectedEstado && errorIntento"
            />
          </div>
        </div>
      </div>

      <div class="surface-card q-pa-lg q-mb-md">
        <div class="seccion-titulo">Agregar producto</div>

        <div class="row q-col-gutter-md items-center">
          <div class="col-12 col-md-5">
            <q-select
              v-model="selectedProduct"
              :options="filteredProductsOptions"
              label="Producto"
              option-label="label"
              option-value="value"
              outlined
              dense
              bg-color="white"
              use-input
              clearable
              hide-bottom-space
              :loading="cargandoProductos"
              @filter="filterProducts"
            />
          </div>
          <div class="col-6 col-md-2">
            <q-input
              v-model="cantidad"
              label="Cantidad"
              type="number"
              outlined
              dense
              bg-color="white"
              hide-bottom-space
              :error="!cantidad && errorIntento"
            />
          </div>
          <div class="col-6 col-md-2">
            <q-input
              v-model="precioUnitario"
              label="Precio unit."
              type="number"
              outlined
              dense
              bg-color="white"
              prefix="$"
              hide-bottom-space
              :error="!precioUnitario && errorIntento"
            />
          </div>
          <div class="col-6 col-md-2">
            <q-input
              :model-value="formatearMoneda(subtotal)"
              label="Subtotal"
              outlined
              dense
              readonly
              bg-color="grey-2"
              hide-bottom-space
            />
          </div>
          <div class="col-6 col-md-1">
            <q-btn color="primary" icon="add" unelevated class="full-width" @click="agregarProducto">
              <q-tooltip>Agregar producto</q-tooltip>
            </q-btn>
          </div>
        </div>
      </div>

      <q-banner v-if="errorMessage" class="bg-red-1 text-negative q-mb-md rounded-borders" dense>
        <template v-slot:avatar>
          <q-icon name="error_outline" color="negative" />
        </template>
        {{ errorMessage }}
      </q-banner>

      <q-table
        class="data-table q-mb-md"
        :rows="productos"
        :columns="columns"
        row-key="codigo"
        flat
        hide-pagination
        :rows-per-page-options="[0]"
      >
        <template v-slot:no-data>
          <div class="full-width column flex-center q-pa-xl text-grey-6">
            <q-icon name="add_shopping_cart" size="42px" class="q-mb-sm" />
            <div class="text-subtitle2">Todavía no agregaste productos</div>
            <div class="text-caption q-mt-xs">Elegí un producto arriba y tocá el botón +.</div>
          </div>
        </template>

        <template v-slot:body-cell-precioUnitario="props">
          <q-td :props="props" class="cell-numeric">
            {{ formatearMoneda(props.row.precioUnitario) }}
          </q-td>
        </template>

        <template v-slot:body-cell-subtotal="props">
          <q-td :props="props" class="cell-numeric text-weight-medium">
            {{ formatearMoneda(props.row.subtotal) }}
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="cell-actions text-right">
            <q-btn
              icon="delete_outline"
              flat
              dense
              round
              size="sm"
              color="negative"
              @click="deleteProducto(props.row.codigo)"
            >
              <q-tooltip>Quitar</q-tooltip>
            </q-btn>
          </q-td>
        </template>

        <template v-if="productos.length" v-slot:bottom-row>
          <q-tr class="fila-total">
            <q-td colspan="4" class="text-right text-weight-medium">Total del remito</q-td>
            <q-td class="cell-numeric text-weight-bold">{{ formatearMoneda(totalRemito) }}</q-td>
            <q-td />
          </q-tr>
        </template>
      </q-table>

      <div class="flex justify-end">
        <q-btn
          label="Generar y descargar remito"
          icon="download"
          color="primary"
          unelevated
          no-caps
          type="submit"
          :loading="enviando"
          :disable="productos.length === 0"
        />
      </div>
    </q-form>

    <q-dialog v-model="mostrarFormularioCliente">
      <q-card class="w-full max-w-[600px]">
        <q-card-section class="q-pa-none">
          <FormularioClientes
            @agregar-completado="onClienteAgregado"
            @volver="mostrarFormularioCliente = false"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import { useQuasar } from 'quasar';
import { crearRemito, obtenerEstados, generarPDFRemito } from './service/RemitosService';
import { fetchProducts } from 'src/pages/Movimientos/service/MovimientosService';
import { getClientes } from 'src/pages/Gestion/service/GestionService';
import FormularioClientes from 'src/pages/Gestion/components/FormularioClientes.vue';

const formatoMoneda = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
});

export default {
  name: 'GenerarRemito',
  components: {
    FormularioClientes,
  },
  setup() {
    const $q = useQuasar();

    const fecha = ref('');
    const domicilio = ref('');
    const cantidad = ref(null);
    const precioUnitario = ref('');
    const selectedEstado = ref(null);
    const estadoOptions = ref([]);
    const enviando = ref(false);
    const mostrarFormularioCliente = ref(false);

    const formatearMoneda = (valor) => formatoMoneda.format(Number(valor) || 0);

    const subtotal = computed(() =>
      cantidad.value && precioUnitario.value
        ? parseFloat(cantidad.value) * parseFloat(precioUnitario.value)
        : 0
    );

    const selectedProduct = ref(null);
    const filteredProductsOptions = ref([]);
    const allProducts = ref([]);
    const cargandoProductos = ref(false);

    const codigo = ref('');
    const producto = ref('');

    const cliente = ref({ Nombre: '', Cuil: '' });
    const clientes = ref([]);
    const filteredClientes = ref([]);
    const selectedCliente = ref(null);

    const errorMessage = ref('');
    const errorIntento = ref(false);

    const productos = ref([]);
    const totalRemito = computed(() =>
      productos.value.reduce((acc, p) => acc + p.subtotal, 0)
    );

    const columns = [
      { name: 'codigo', label: 'Código', align: 'left', field: row => row.codigo },
      { name: 'producto', label: 'Producto', align: 'left', field: row => row.producto },
      { name: 'cantidad', label: 'Cantidad', align: 'center', field: row => row.cantidad },
      { name: 'precioUnitario', label: 'Precio Unitario', align: 'right', field: row => row.precioUnitario },
      { name: 'subtotal', label: 'Sub Total', align: 'right', field: row => row.subtotal },
      { name: 'actions', label: '', align: 'right' },
    ];

    const validarCampos = (campos) => {
      if (campos.some(campo => !campo)) {
        errorIntento.value = true;
        errorMessage.value = 'Por favor, complete todos los campos obligatorios.';
        return false;
      }
      return true;
    };

    const cargarEstados = async () => {
      try {
        const estados = await obtenerEstados();
        estadoOptions.value = estados.map(estado => ({
          label: estado.Estado,
          value: estado.Id_Estado,
        }));
      } catch (error) {
        console.error('Error al cargar los estados:', error);
        errorMessage.value = 'Error al cargar los estados.';
      }
    };

    const cargarProductos = async () => {
      cargandoProductos.value = true;
      try {
        const resultado = await fetchProducts();
        allProducts.value = resultado || [];
        filteredProductsOptions.value = allProducts.value.map(p => ({
          label: p.Nombre,
          value: p.Id_Producto,
        }));
      } catch (error) {
        console.error('Error al cargar productos:', error);
        $q.notify({
          type: 'negative',
          message: 'No se pudieron cargar los productos.',
          position: 'top',
        });
      } finally {
        cargandoProductos.value = false;
      }
    };

    const cargarClientes = async () => {
      try {
        const response = await getClientes();
        clientes.value = response || [];
        filteredClientes.value = [...clientes.value];
      } catch (error) {
        console.error('Error al cargar clientes:', error);
      }
    };

    const filterProducts = (val, update) => {
      update(() => {
        const lista = val
          ? allProducts.value.filter(p => p.Nombre.toLowerCase().includes(val.toLowerCase()))
          : allProducts.value;

        filteredProductsOptions.value = lista.map(p => ({
          label: p.Nombre,
          value: p.Id_Producto,
        }));
      });
    };

    const filterClientes = (val, update) => {
      update(() => {
        filteredClientes.value = val
          ? clientes.value.filter(c => c.Nombre.toLowerCase().includes(val.toLowerCase()))
          : [...clientes.value];
      });
    };

    watch(selectedProduct, (newVal) => {
      if (!newVal) {
        codigo.value = '';
        producto.value = '';
        return;
      }
      const seleccionado = allProducts.value.find(p => p.Id_Producto === newVal.value);
      if (seleccionado) {
        codigo.value = seleccionado.Codigo;
        producto.value = seleccionado.Nombre;
      }
    });

    watch(selectedCliente, (newValue) => {
      cliente.value = newValue ? { ...newValue } : { Nombre: '', Cuil: '' };
    });

    const agregarProducto = () => {
      if (!validarCampos([codigo.value, producto.value, cantidad.value, precioUnitario.value])) {
        return;
      }

      productos.value.push({
        codigo: codigo.value,
        producto: producto.value,
        cantidad: parseFloat(cantidad.value),
        precioUnitario: parseFloat(precioUnitario.value),
        subtotal: subtotal.value,
      });

      selectedProduct.value = null;
      cantidad.value = null;
      precioUnitario.value = '';
      errorMessage.value = '';
    };

    const deleteProducto = (codigoProducto) => {
      productos.value = productos.value.filter(p => p.codigo !== codigoProducto);
    };

    const onClienteAgregado = () => {
      mostrarFormularioCliente.value = false;
      cargarClientes();
    };

    const enviarRemito = async () => {
      // selectedEstado va en la validacion: mas abajo se lee selectedEstado.value.value
      // y sin esto reventaba con un TypeError en vez de mostrar el mensaje de error.
      if (!validarCampos([cliente.value.Nombre, domicilio.value, fecha.value, selectedEstado.value])) {
        return;
      }

      if (productos.value.length === 0) {
        errorIntento.value = true;
        errorMessage.value = 'Agregue al menos un producto al remito.';
        return;
      }

      const productosTransformados = productos.value.map(prod => {
        const encontrado = allProducts.value.find(p => p.Codigo === prod.codigo);
        return {
          Id_Producto: encontrado ? encontrado.Id_Producto : null,
          Cantidad: prod.cantidad,
          PrecioUnit: prod.precioUnitario,
          PrecioTotal: prod.precioUnitario * prod.cantidad,
        };
      });

      enviando.value = true;
      try {
        const response = await crearRemito({
          Senior: cliente.value.Nombre,
          Domicilio: domicilio.value,
          Fecha: fecha.value,
          Id_Estado: selectedEstado.value.value,
          Productos: productosTransformados,
        });

        $q.notify({
          type: 'positive',
          message: 'Remito creado con éxito.',
          position: 'top',
        });

        selectedCliente.value = null;
        cliente.value = { Nombre: '', Cuil: '' };
        domicilio.value = '';
        fecha.value = '';
        productos.value = [];
        selectedEstado.value = null;
        errorIntento.value = false;
        errorMessage.value = '';

        await generarPDFRemito(response.remito?.Id_Remito);
      } catch (error) {
        console.error('Error al crear el remito:', error);
        errorMessage.value = 'Error al crear el remito.';
      } finally {
        enviando.value = false;
      }
    };

    onMounted(() => {
      cargarClientes();
      cargarEstados();
      cargarProductos();
    });

    return {
      fecha,
      domicilio,
      cantidad,
      precioUnitario,
      subtotal,
      totalRemito,
      selectedEstado,
      estadoOptions,
      selectedProduct,
      filteredProductsOptions,
      cargandoProductos,
      cliente,
      filteredClientes,
      selectedCliente,
      errorMessage,
      errorIntento,
      enviando,
      mostrarFormularioCliente,
      productos,
      columns,
      formatearMoneda,
      filterProducts,
      filterClientes,
      agregarProducto,
      deleteProducto,
      onClienteAgregado,
      enviarRemito,
    };
  },
};
</script>

<style scoped>
.seccion-titulo {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-ink-muted);
  margin-bottom: 1rem;
}

.fila-total :deep(td) {
  background: #fafbfc;
  border-top: 1px solid var(--color-border-subtle);
}
</style>
