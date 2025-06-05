<template>
    <q-card class="q-pa-lg q-mx-auto shadow-2" style="max-width: 900px; border-radius: 12px;">
        <q-btn label="Volver" flat rounded style="background-color: #0e1d75; color: white;" @click="$emit('volver')" />
        <q-card-section>
            <div class="text-h5 text-center" style="color: #0e1d75;">Agregar Compra</div>
        </q-card-section>
        <q-card-section>
            <q-form @submit.prevent="guardarCompra">
                <!-- 🧾 Datos de la Compra -->
                <div class="text-subtitle1 text-bold text-secondary q-mb-md">Datos de la Compra</div>
                <q-input outlined v-model="compra.Fecha" label="Fecha" type="date" class="q-mb-md" />

                <div class="row q-mb-md q-mt-md">
                    <q-input outlined v-model="compra.Factura_N" label="Factura N°" class="col-4 q-mr-md " />
                    <q-input outlined v-model.number="compra.Importe" label="Importe" type="number" class="col-7" 
                        prefix="$" :decimals="2" />
                </div>

                <q-input outlined v-model="compra.Marca" label="Marca" class="q-mb-md q-mt-md col-11" />

                <div class="row q-mb-md">
                    <q-input outlined v-model.number="compra.IVA21" label="IVA 21%" type="number"
                        class="col-3 q-mr-md" prefix="$" />
                    <q-input outlined v-model.number="compra.IVA10_5" label="IVA 10.5%" type="number"
                        class="col-4 q-mr-md" prefix="$"/>
                    <q-input outlined v-model.number="compra.PercepcionIVA" label="Percepciones IVA" type="number"
                        class="col-4" prefix="$"/>
                </div>

                <div class="row q-mb-md">
                    <q-input outlined v-model.number="compra.PercepcionesMuniCba"
                        label="Percepciones Municipales Córdoba" type="number" class="col-6 q-mr-md" prefix="$"/>
                    <q-input outlined v-model.number="compra.Flete" label="Flete" type="number" class="col-5"  prefix="$"/>
                </div>

                <q-select v-model="selectedEstado" :options="estadoOptions" label="Estado" outlined clearable
                    :error="!selectedEstado && errorIntento" />

                <div class="text-subtitle1 text-bold text-secondary q-mb-md q-mt-md">Datos de Materia Prima</div>

                <q-select v-model="selectedMateriaPrima" :options="materiaPrimaOptions" label="Materia Prima"
                outlined clearable :error="!selectedMateriaPrima && errorIntento" class="col-6 q-mr-md" />
                <div class="row q-mt-md">
                    
                    <q-input v-model.number="nuevaMateriaPrima.Cantidad" outlined label="Cantidad" type="number"
                        class="col-3 q-mr-md" />
                    <q-input v-model.number="nuevaMateriaPrima.PrecioUnitario" outlined label="Precio Unitario" type="number"
                        class="col-3" prefix="$"/>
                    <q-btn label="Agregar" color="primary" @click="agregarMateriaPrima" dense rounded
                        class="col-2 q-ml-md q-pa-xs" />
                </div>
                <q-list bordered separator v-if="materiasPrimas.length" class="q-mt-md">
                    <q-item v-for="(mp, index) in materiasPrimas" :key="index">
                        <q-item-section>{{ mp.Nombre }} - Cantidad: {{ mp.Cantidad }} - Precio Unitario: ${{mp.PrecioUnitario}}</q-item-section>
                        <q-item-section side>
                            <q-btn icon="delete" flat color="negative" @click="eliminarMateriaPrima(index)" />
                        </q-item-section>
                    </q-item>
                </q-list>
                <!-- Botones -->
                <div class="row justify-center q-gutter-m q-mt-md">
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
import { addCompra, getMateriaPrimas } from '../service/GestionService'

export default {
    name: 'FormularioCompras',
    emits: ['volver'],
    setup() {
        const $q = useQuasar()

        const compra = ref({
            Fecha: '',
            Factura_N: '',
            Importe: null,
            Marca: '',
            IVA21: null,
            IVA10_5: null,
            PercepcionIVA: null,
            PercepcionesMuniCba: null,
            Flete: null
        })

        const nuevaMateriaPrima = ref({
            Nombre: '',
            Cantidad: null,
            PrecioUnitario: null,
        })

        const materiasPrimas = ref([])
        const selectedEstado = ref(null)
        const selectedMateriaPrima = ref(null)
        const estadoOptions = ref([])
        const materiaPrimaOptions = ref([])

        onMounted(() => {
            cargarEstados();
            cargarMateriaPrimas();
        })

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

        const cargarMateriaPrimas = async () => {
            try {
                const response = await getMateriaPrimas()
                const materiasPrimas = response.data
                materiaPrimaOptions.value = materiasPrimas.map(materia => ({
                    label: materia.Nombre,
                    value: materia.id_MateriaPrima,
                }))
            } catch (error) {
                console.error('Error al cargar las materias primas:', error)
            }
        }

        const agregarMateriaPrima = () => {
            if (!selectedMateriaPrima.value || !nuevaMateriaPrima.value.Cantidad) {
                $q.notify({ type: 'warning', message: 'Completá los datos de materia prima' })
                return
            }
            materiasPrimas.value.push({
                id_MateriaPrima: selectedMateriaPrima.value.value,
                Nombre: selectedMateriaPrima.value.label,
                Cantidad: nuevaMateriaPrima.value.Cantidad,
                PrecioUnitario: nuevaMateriaPrima.value.PrecioUnitario,
            });
            nuevaMateriaPrima.value.Cantidad = null;
            nuevaMateriaPrima.value.PrecioUnitario = null;
            selectedMateriaPrima.value = null;
        }

        const eliminarMateriaPrima = (index) => {
            materiasPrimas.value.splice(index, 1)
        }

        const guardarCompra = () => {
            if (!selectedEstado.value) {
                $q.notify({
                    type: 'warning',
                    message: 'Seleccioná un estado antes de guardar'
                })
                return
            }

            if (materiasPrimas.value.length === 0) {
                $q.notify({
                    type: 'warning',
                    message: 'Agregá al menos una materia prima'
                })
                return
            }

            const payload = {
                compra: {
                    Fecha: compra.value.Fecha,
                    Factura_N: compra.value.Factura_N,
                    Importe: compra.value.Importe,
                    Marca: compra.value.Marca,
                    IVA21: compra.value.IVA21,
                    IVA10_5: compra.value.IVA10_5,
                    PercepcionIVA: compra.value.PercepcionIVA,
                    PercepcionesMuniCba: compra.value.PercepcionesMuniCba,
                    Flete: compra.value.Flete
                },
                materiasPrimas: materiasPrimas.value,
                estadoId: selectedEstado.value.value
            }
            addCompra(payload)
                .then(() => {
                    $q.notify({ type: 'positive', message: 'Compra guardada con éxito' })
                    limpiarFormulario()
                })
                .catch(error => {
                    console.error('Error al guardar la compra:', error)
                    $q.notify({ type: 'negative', message: 'Error al guardar la compra' })
                })
        }

        const limpiarFormulario = () => {
            compra.value = {
                Fecha: '',
                Factura_N: '',
                Importe: null,
                Marca: '',
                IVA21: null,
                IVA10_5: null,
                PercepcionIVA: null,
                PercepcionesMuniCba: null,
                Flete: null
            }
            nuevaMateriaPrima.value = {
                Nombre: '',
                Cantidad: null,
                PrecioUnitario: null,
                Fecha: ''
            }
            materiasPrimas.value = []
        }

        return {
            compra,
            nuevaMateriaPrima,
            materiasPrimas,
            selectedEstado,
            selectedMateriaPrima,
            estadoOptions,
            materiaPrimaOptions,
            agregarMateriaPrima,
            eliminarMateriaPrima,
            guardarCompra,
            limpiarFormulario
        }
    }
}
</script>
