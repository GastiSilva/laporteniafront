<template>
  <q-card class="q-pa-lg q-mx-auto shadow-2" style="max-width: 900px; border-radius: 12px;">
    <q-btn label="Volver" flat rounded style="background-color: #0e1d75; color: white;" @click="$emit('volver')" />

    <q-card-section>
      <div class="text-h5 text-center text-secondary">Agregar Ingreso</div>
    </q-card-section>

    <q-card-section>
      <q-form @submit.prevent="guardarIngreso">
        <div class="text-subtitle1 text-bold text-secondary q-mb-md">Datos del Ingreso</div>

        <q-input outlined v-model="ingreso.Fecha" label="Fecha" type="date" class="q-mb-md" />
        <q-input outlined v-model="ingreso.Nombre" label="Nombre" class="q-mb-md" />
        <q-input outlined v-model="ingreso.Detalle" label="Detalle" class="q-mb-md" />
        <q-input outlined v-model="ingreso.NroComprobante" label="Nro Comprobante" type="number" class="q-mb-md" />
        <q-input outlined v-model.number="ingreso.Total" label="Total" type="number" class="q-mb-md" prefix="$" />

        <q-select v-model="selectedEstado" :options="estadoOptions" label="Estado" outlined clearable
          :error="!selectedEstado && errorIntento" />

        <div class="text-subtitle1 text-bold text-secondary q-mb-md">Datos del Vendedor</div>
        <q-select outlined v-model="selectedVendedor" label="Seleccionar Vendedor" :options="filteredVendedores"
          option-label="Nombre" use-input input-debounce="300" @filter="filterVendedores" class="q-mb-md" />

        <q-input outlined v-model="vendedor.Nombre" label="Nombre" class="q-mb-md" />
        <q-input outlined v-model="vendedor.Cuit" label="CUIT" class="q-mb-md" />


        <div class="row q-col-gutter-md">
          <q-checkbox v-model="ingreso.Cheque" label="Cheque" />
          <q-checkbox v-model="ingreso.Efectivo" label="Efectivo" />
          <q-checkbox v-model="ingreso.Transferencia" label="Transferencia" />
        </div>

        <div class="row justify-center q-gutter-md q-mt-lg">
          <q-btn label="Guardar" type="submit" color="primary" class="q-px-lg" />
          <q-btn label="Cancelar" flat color="negative" @click="limpiarFormulario" />
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script>
import { ref, onMounted, watch } from "vue";
import { useQuasar } from "quasar";
import { addIngresos, getVendedores } from "../service/GestionService";
import { obtenerEstados } from 'src/components/Remitos/service/RemitosService'


export default {
  name: "FormularioIngresos",
  setup() {
    const $q = useQuasar();

    const ingreso = ref({
      Fecha: "",
      Nombre: "",
      Detalle: "",
      NroComprobante: null,
      Total: null,
      Id_Vendedor: null,
      Id_Estado: null,
      Cheque: false,
      Efectivo: false,
      Transferencia: false
    });

    const vendedor = ref({
      Nombre: '',
      Cuit: ''
    })

    const vendedores = ref([]);
    const filteredVendedores = ref([])
    const selectedVendedor = ref(null)
    const estadoOptions = ref([])
    const selectedEstado = ref(null)


    const cargarEstados = async () => {
      try {
        const estados = await obtenerEstados()
        estadoOptions.value = estados.map(estado => ({
          label: estado.Estado,
          value: estado.Id_Estado,
        }))
      } catch (error) {
        console.error('Error al cargar los estados:', error)
      }
    }


    const cargarVendores = async () => {
      try {
        const response = await getVendedores();
        vendedores.value = response || [];
        filteredVendedores.value = [...vendedores.value];
      } catch (error) {
        console.error('Error al cargar vendedores:', error)
      }
    }


    const filterVendedores = (val, update) => {
      if (!val) {
        update(() => {
          filteredVendedores.value = [...vendedores.value]
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        filteredVendedores.value = vendedores.value.filter(vendedor =>
          vendedor.Nombre.toLowerCase().includes(needle)
        )
      })
    }

    watch(selectedVendedor, (newValue) => {
      if (newValue) {
        const vendedorSeleccionado = vendedores.value.find(vendedor => vendedor.Nombre === newValue.Nombre)
        if (vendedorSeleccionado) {
          vendedor.value = { ...vendedorSeleccionado }
        } else {
          vendedor.value = { Nombre: '', Cuit: '' }
        }
      } else {
        vendedor.value = { Nombre: '', Cuit: '' }
      }
    })

    const guardarIngreso = async () => {
      try {
        const metodoPago = [];
        if (ingreso.value.Cheque) metodoPago.push("Cheque");
        if (ingreso.value.Efectivo) metodoPago.push("Efectivo");
        if (ingreso.value.Transferencia) metodoPago.push("Transferencia");

        const payload = {
          Fecha: ingreso.value.Fecha,
          Nombre: ingreso.value.Nombre,
          Detalle: ingreso.value.Detalle,
          NroComprobante: ingreso.value.NroComprobante,
          Total: ingreso.value.Total,
          Id_Vendedor: selectedVendedor.value?.Id_Vendedor,
          Id_Estado: selectedEstado.value.value,
          MetodoPago: metodoPago
        };

        const response = await addIngresos(payload);
        $q.notify({ type: "positive", message: "Ingreso guardado correctamente" });
        limpiarFormulario();
      } catch (error) {
        $q.notify({ type: "negative", message: error.response?.data?.error || "Error al guardar el ingreso." });
      }
    };

    const limpiarFormulario = () => {
      ingreso.value = {
        Fecha: "",
        Nombre: "",
        Detalle: "",
        NroComprobante: null,
        Total: null,
        Cheque: false,
        Efectivo: false,
        Transferencia: false
      };
      vendedor.value = {
        Nombre: "",
        Cuit: ""
      };
      selectedVendedor.value = null;
      selectedEstado.value = null;
    };

    onMounted(() => {
      cargarEstados();
      cargarVendores();
    });

    return {
      ingreso,
      vendedores,
      vendedor,
      filterVendedores,
      filteredVendedores,
      selectedVendedor,
      selectedEstado,
      estadoOptions,
      guardarIngreso,
      limpiarFormulario
    };
  }
};
</script>

<style scoped>
.text-secondary {
  color: #0e1d75;
}
</style>