<template>
  <q-layout>
    <q-page-container>
      <div class="q-pa-md">
        <div v-if="currentView === 'main'" class="q-pa-md flex flex-center">
          <div class="row justify-center q-gutter-md q-ma-xl">
            <q-btn @click="setCurrentView('generar')" color="primary" class="q-pa-lg column items-center" rounded>
              <img class="w-[80px] h-[80px] q-mb-lg q-ml-md q-mr-md" src="~assets/file-invoice-dollar-solid.svg"
                alt="iconLuz" style="filter: invert(1);" />
              <span class="text-white text-bold">Generar Remito</span>
            </q-btn>
            <q-btn @click="setCurrentView('consultar')" color="secondary" class="q-pa-lg column items-center" rounded>
              <img class="w-[80px] h-[80px] q-mb-lg q-ml-md q-mr-md" src="~assets/buscaricon.svg" alt="iconBuscar"
                style="filter: invert(1);" />
              <span class="text-white text-bold">Consultar Remito</span>
            </q-btn>
          </div>
        </div>

        <div v-if="currentView === 'generar'">
          <h4 class="titulo-rem">Generar Remito</h4>
          <div class="row q-col-gutter-md">
            <div class="col-5">
              <q-select v-model="fecha" label="Fecha (Año, Mes, Día)" outlined class="q-ma-xs mi-q-select"
                :error="!fecha && errorIntento" dense>
                <template v-slot:append>
                  <q-icon name="event" />
                </template>
                <q-popup-proxy cover>
                  <q-date v-model="fecha" mask="YYYY-MM-DD" format="DD/MM/YYYY" default-view="Calendar" />
                </q-popup-proxy>
              </q-select>
            </div>
            <div class="col-5">
              <q-select outlined v-model="selectedCliente" label="Seleccionar Cliente" :options="filteredClientes" dense
                option-label="Nombre" use-input input-debounce="300" @filter="filterClientes" class="q-mt-xs"
                clearable />
            </div>
            <div class="col-2 ">
              <q-btn label="Agregar" color="primary" icon="add" class="q-mt-xs" @click="agregarCliente" />
            </div>
          </div>

          <div class="row q-col-gutter-md">
            <div class="col-6">
              <q-input v-model="cliente.Nombre" label="Señor" outlined class="q-ma-xs" :error="!senior && errorIntento"
                dense />
            </div>
            <div class="col-6">
              <q-input v-model="domicilio" label="Domicilio" outlined class="q-ma-xs"
                :error="!domicilio && errorIntento" dense />
            </div>
          </div>

          <div class="row q-col-gutter-md">
            <div class="col-10 q-mt-xs">
              <q-select v-model="selectedProduct" :options="filteredProductsOptions" use-input option-label="label"
                option-value="value" label="Productos" @filter="filterProducts" @update:model-value="onSelectUpdate"
                outlined dense clearable class="col-5" style="background-color: white;" />
            </div>
            <div class="col-2">
              <q-input v-model="cantidad" label="Cantidad" outlined class="q-ma-xs " :error="!cantidad && errorIntento"
                dense type="number" />
            </div>
          </div>

          <div class="row q-col-gutter-md">
            <div class="col-5">
              <q-input v-model="precioUnitario" label="Precio Unitario" type="number" outlined class="q-ma-xs"
                :error="!precioUnitario && errorIntento" dense prefix="$" />
            </div>
            <div class="col-5">
              <q-input v-model="subtotal" label="Sub Total" type="number" outlined class="q-ma-xs" readonly dense
                prefix="$" />
            </div>
            <div class="col-2">
              <q-select v-model="selectedEstado" :options="estadoOptions" label="Estado" outlined class="q-ma-xs" dense
                clearable :error="!selectedEstado && errorIntento" />
            </div>
          </div>

          <q-btn @click="agregarProducto" label="Agregar Producto" color="primary" class="q-ma-xs" />
          <q-btn @click="enviarRemito" label="Descargar Remito" color="primary" class="q-ma-xs" />
          <q-btn flat label="Volver" text-color="white" class="q-ma-md" @click="setCurrentView('main')" rounded
            style="background-color:#0e1d75;" />

          <q-table :rows="productos" :columns="columns" row-key="codigo">
            <template v-slot:header="props">
              <q-tr :props="props">
                <q-th v-for="col in props.cols" :key="col.name" :props="props"
                  style="background-color: #0e1d75; color: white;">
                  {{ col.label }}
                </q-th>
              </q-tr>
            </template>
            <template v-slot:body-cell-actions="props">
              <q-td align="center">
                <div style="display: flex; justify-content: flex-end;">
                  <q-btn icon="fa-solid fa-trash-can" flat dense color="negative"
                    @click="deleteProducto(props.row.codigo)" />
                </div>
              </q-td>
            </template>
          </q-table>

          <q-banner v-if="errorMessage" color="negative">
            {{ errorMessage }}
          </q-banner>
        </div>

        <div v-if="currentView === 'consultar'">
          <ConsultarRemito :setCurrentView="setCurrentView" />
        </div>
        <div v-if="currentView === 'formularioClientes'">
          <FormularioClientes @submit="handleSubmit" @agregar-completado="volverAGestion" @volver="volverAGestion" />
        </div>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import ConsultarRemito from './components/ConsultarRemito.vue';
import { RemitoPDFAPI } from 'src/pages/AdminHome/service/AdminAPI';
import { crearRemito, obtenerEstados } from './service/RemitosService';
import { fetchProducts } from "../Tablas/service/AddDatosAPI";
import { getClientes } from 'src/pages/Gestion/service/GestionService';
import { useQuasar } from 'quasar';
import FormularioClientes from '../../pages/Gestion/components/FormularioClientes.vue';


export default {
  components: {
    ConsultarRemito,
    FormularioClientes
  },
  setup() {
    const currentView = ref('main');
    const $q = useQuasar();
    const fecha = ref('');
    const senior = ref('');
    const domicilio = ref('');
    const cantidad = ref(null);
    const precioUnitario = ref('');
    const selectedEstado = ref(null);
    const estadoOptions = ref([]);
    const subtotal = computed(() => {
      return cantidad.value && precioUnitario.value
        ? parseFloat(cantidad.value) * parseFloat(precioUnitario.value)
        : 0;
    });

    const selectedProduct = ref(null);
    const filteredProductsOptions = ref([]);
    const allProducts = ref([]);
    const loading = ref(true);

    const id_producto = ref('');
    const codigo = ref('');
    const producto = ref('');

    const cliente = ref({
      Nombre: '',
      Cuil: ''
    })
    const clientes = ref([])
    const filteredClientes = ref([])
    const selectedCliente = ref(null)
    const errorMessage = ref('');
    const errorIntento = ref(false);

    const productos = ref([]);
    const columns = ref([
      { name: 'codigo', label: 'Código', align: 'left', field: row => row.codigo },
      { name: 'producto', label: 'Producto', align: 'left', field: row => row.producto },
      { name: 'cantidad', label: 'Cantidad', align: 'center', field: row => row.cantidad },
      { name: 'precioUnitario', label: 'Precio Unitario', align: 'center', field: row => row.precioUnitario },
      { name: 'subtotal', label: 'Sub Total', align: 'left', field: row => row.subtotal },
      { name: 'actions', label: 'Acciones', align: 'center' },
    ]);

    const setCurrentView = (view) => {
      selectedCliente.value = null;
      cliente.value.Nombre = '';
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

    const agregarProducto = () => {
      if (validarCampos([codigo.value, producto.value, cantidad.value, precioUnitario.value])) {
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
      }
    };

    const downloadPDF = async (id) => {
      try {
        await RemitoPDFAPI(id);
      } catch (error) {
        errorMessage.value = 'Error al descargar el PDF: ' + error.message;
      }

    };

    const enviarRemito = async () => {
      // senior.value = cliente.value.Nombre;
      if (!validarCampos([cliente.value.Nombre, domicilio.value, fecha.value]) || productos.value.length === 0) {
        errorMessage.value = 'Por favor, complete todos los campos y agregue al menos un producto.';
        return;
      }

      const productosTransformados = productos.value.map(prod => {
        const productoEncontrado = allProducts.value.find(p => p.Codigo === prod.codigo);
        return {
          Id_Producto: productoEncontrado ? productoEncontrado.Id_Producto : null,
          Cantidad: prod.cantidad,
          PrecioUnit: prod.precioUnitario,
          PrecioTotal: prod.precioUnitario * prod.cantidad
        };
      });

      const remitoData = {
        Senior: cliente.value.Nombre,
        Domicilio: domicilio.value,
        Fecha: fecha.value,
        Id_Estado: selectedEstado.value.value,
        Productos: productosTransformados
      };



      try {
        const response = await crearRemito(remitoData);;
        $q.notify({
          type: "positive",
          message: "Remito creado con éxito.",
          position: "top",
        });

        selectedCliente.value = null;
        cliente.value.Nombre = '';
        domicilio.value = '';
        fecha.value = '';
        productos.value = [];
        selectedEstado.value = null;

        const id_remito = response.remito?.Id_Remito;
        await downloadPDF(id_remito);

      } catch (error) {
        console.error('Error al crear el remito:', error);
        errorMessage.value = 'Error al crear el remito.';
      }
    };


    const deleteProducto = (codigo) => {
      productos.value = productos.value.filter(producto => producto.codigo !== codigo);
    };

    function filterProducts(val, update) {
      update(() => {
        if (!val) {
          filteredProductsOptions.value = allProducts.value.map(function (product) {
            return {
              label: product.Nombre,
              value: product.Id_Producto
            };
          });
          return;
        }
        const search = val.toLowerCase();
        filteredProductsOptions.value = allProducts.value
          .filter(function (product) {
            return product.Nombre.toLowerCase().includes(search);
          })
          .map(function (product) {
            return {
              label: product.Nombre,
              value: product.Id_Producto
            };
          });
      });
    }

    const cargarProductos = async () => {
      try {
        loading.value = true;

        const productos = await fetchProducts();
        allProducts.value = productos;

        filteredProductsOptions.value = productos.map((product) => ({
          label: product.Nombre,
          value: product.Id_Producto,
        }));

      } catch (error) {
        console.error("Error al cargar productos:", error);
        $q.notify({
          type: "negative",
          message: "No se pudieron cargar los productos.",
          position: "top",
        });
      } finally {
        loading.value = false;
      }
    };


    watch(selectedProduct, (newVal) => {
      if (newVal) {
        const selected = allProducts.value.find(product => product.Nombre === newVal.label);
        if (selected) {
          codigo.value = selected.Codigo;
          producto.value = selected.Nombre;

          id_producto.value = selected.Id_Producto
        }
      }
    });


    const cargarClientes = async () => {
      try {
        const response = await getClientes();
        clientes.value = response || [];
        filteredClientes.value = [...clientes.value];
      } catch (error) {
        console.error('Error al cargar clientes:', error)
      }
    }

    const filterClientes = (val, update) => {
      if (!val) {
        update(() => {
          filteredClientes.value = [...clientes.value]
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        filteredClientes.value = clientes.value.filter(cliente =>
          cliente.Nombre.toLowerCase().includes(needle)
        )
      })
    }

    watch(selectedCliente, (newValue) => {
      if (newValue) {
        const clienteSeleccionado = clientes.value.find(cliente => cliente.Nombre === newValue.Nombre)
        if (clienteSeleccionado) {
          cliente.value = { ...clienteSeleccionado }
        } else {
          cliente.value = { Nombre: '', Cuil: '' }
        }
      } else {
        cliente.value = { Nombre: '', Cuil: '' }
      }
    })

    const agregarCliente = () => {
      currentView.value = 'formularioClientes';
    }

    const volverAGestion = () => {

      currentView.value = 'generar';
      cargarClientes();
    };

    onMounted(() => {
      cargarClientes();
      cargarEstados();
      cargarProductos();
    });

    return {
      currentView,
      setCurrentView,
      estadoOptions,
      cargarEstados,
      senior,
      domicilio,
      codigo,
      producto,
      id_producto,
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
      enviarRemito,
      filterProducts,
      selectedProduct,
      cargarProductos,
      filteredProductsOptions,
      cliente,
      clientes,
      filteredClientes,
      selectedCliente,
      filterClientes,
      agregarCliente,
      volverAGestion
    };
  },
};
</script>

<style>
.titulo-rem {
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  color: #3f51b5;
}

.q-input .q-field__control,
.q-select .q-field__control {
  background-color: white !important;

}
</style>
