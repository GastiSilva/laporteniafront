<template>
    <q-card class="q-pa-lg q-mx-auto shadow-2" style="max-width: 900px; border-radius: 12px;">
        <q-card-section>
            <div class="text-h5 text-center" style="color: #0e1d75;">Agregar Compra</div>
        </q-card-section>

        <q-separator />

        <q-card-section>
            <q-form @submit.prevent="guardarCompra">
                <!-- 🧾 Datos de la Compra -->
                <div class="text-subtitle1 text-bold text-secondary q-mb-md">Datos de la Compra</div>

                <q-input outlined v-model="compra.Fecha" label="Fecha" type="datetime-local" class="q-mb-md"  />

                <div class="row q-col-gutter-md">
                    <q-input outlined v-model.number="compra.Cantidad" label="Cantidad" type="number" class="col" />
                    <q-input outlined v-model.number="compra.PrecioUnit" label="Precio Unitario" type="number"
                        class="col" />
                </div>

                <q-input outlined v-model="compra.Factura_N" label="Factura N°" class="q-mb-md q-mt-md" />

                <q-input outlined v-model.number="compra.Importe" label="Importe" type="number" class="q-mb-md" />

                <q-select v-model="selectedEstado" :options="estadoOptions" label="Estado" outlined class="q-ma-xs" 
                clearable :error="!selectedEstado && errorIntento" />

                <!-- 🌾 Datos de Materia Prima -->
    
                <div class="text-subtitle1 text-bold text-secondary q-mb-md">Datos de Materia Prima</div>

                <q-input outlined v-model="materiaPrima.Nombre" label="Nombre" class="q-mb-md" />

                <q-input outlined v-model="materiaPrima.Fecha" label="Fecha" type="datetime-local" class="q-mb-md" />

                <q-input outlined v-model="materiaPrima.Marca" label="Marca" class="q-mb-md" />

                <div class="row q-col-gutter-md">
                    <q-input outlined v-model.number="materiaPrima.Cantidad" label="Cantidad" type="number"
                        class="col" />
                    <q-input outlined v-model.number="materiaPrima.PrecioUnitario" label="Precio Unitario" type="number"
                        class="col" />
                </div>

                <q-input outlined v-model.number="materiaPrima.PrecioTotal" label="Precio Total" type="number"
                    class="q-mb-lg q-mt-md" />

                <!-- Botones -->
                <div class="row justify-center q-gutter-md">
                    <q-btn label="Guardar" type="submit" color="primary" class="q-px-lg" />
                    <q-btn label="Cancelar" flat color="negative" @click="limpiarFormulario" />
                </div>
            </q-form>
        </q-card-section>
    </q-card>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { obtenerEstados } from 'src/components/Remitos/service/RemitosService'

export default {
    name: 'FormularioCompras',
    setup() {
        const $q = useQuasar()
        const compra = ref({
            Fecha: '',
            Cantidad: null,
            PrecioUnit: null,
            Factura_N: '',
            Importe: null,
            estado: null
        })

        const materiaPrima = ref({
            Nombre: '',
            Fecha: '',
            Marca: '',
            Cantidad: null,
            PrecioUnitario: null,
            PrecioTotal: null
        })
        const selectedEstado = ref(null);
        const estadoOptions = ref([]);

        onMounted(() => {
            cargarEstados();
        })

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

        function guardarCompra() {
            console.log('Compra:', compra.value)
            console.log('Materia Prima:', materiaPrima.value)

            $q.notify({
                type: 'positive',
                message: 'Datos guardados con éxito'
            })

            limpiarFormulario()
        }

        function limpiarFormulario() {
            compra.value = {
                Fecha: '',
                Cantidad: null,
                PrecioUnit: null,
                Factura_N: '',
                Importe: null,
                estado: null
            }

            materiaPrima.value = {
                Nombre: '',
                Fecha: '',
                Marca: '',
                Cantidad: null,
                PrecioUnitario: null,
                PrecioTotal: null
            }
        }

        return {
            compra,
            materiaPrima,
            estadoOptions,
            selectedEstado,
            guardarCompra,
            limpiarFormulario
        }
    }
}
</script>
