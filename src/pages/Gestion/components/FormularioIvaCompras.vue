<template>
    <q-card class="q-pa-lg q-mx-auto shadow-2" style="max-width: 900px; border-radius: 12px;">
        <q-btn label="Volver" flat rounded style="background-color: #0e1d75; color: white;" @click="$emit('volver')" />
        <q-card-section>
            <div class="text-h5 text-center" style="color: #0e1d75;">Agregar IVA Compras</div>
        </q-card-section>
        <q-card-section>
            <q-form @submit.prevent="guardarIVACompras">
                <!-- 🧾 Datos de IVA Ventas -->
                <div class="text-subtitle1 text-bold text-secondary q-mb-md">Datos de IVA Ventas</div>

                <div class="row q-col-gutter-md">
                    <div class="col-6">
                        <q-input outlined v-model="ivaCompras.Fecha" label="Fecha" type="date" class="q-mb-md" :rules="[val => !!val || 'Este campo es obligatorio']" />
                        <q-input outlined v-model="ivaCompras.Factura" label="Factura" class="q-mb-md" :rules="[val => !!val || 'Este campo es obligatorio']" />
                        <q-input outlined v-model.number="ivaCompras.Factura_N" label="Factura N°" type="number" class="q-mb-md" :rules="[val => !!val || 'Este campo es obligatorio']" />
                        <q-input outlined v-model="ivaCompras.CondicionIva" label="Condición IVA" type="text" class="q-mb-md" :rules="[val => !!val || 'Este campo es obligatorio']" />
                        <q-input outlined v-model.number="ivaCompras.Neto" label="Neto" type="number" class="q-mb-md" :rules="[val => !!val || 'Este campo es obligatorio']" />
                        <q-input outlined v-model.number="ivaCompras.IVA21" label="IVA 21%" type="number" class="q-mb-md" />
                    </div>
                    <div class="col-6">
                        <q-input outlined v-model.number="ivaCompras.IVA10_5" label="IVA 10.5%" type="number" class="q-mb-md" />
                        <q-input outlined v-model.number="ivaCompras.PercIVA" label="PercIVA" type="number" class="q-mb-md"  />
                        <q-input outlined v-model.number="ivaCompras.ConceptosNoAgravados" label="Conceptos No Agravados" type="number" class="q-mb-md" />
                        <q-input outlined v-model.number="ivaCompras.Flete10_5" label="Flete 10.5%" type="number" class="q-mb-md" />
                        <q-input outlined v-model.number="ivaCompras.PercepcionesCba" label="Percepciones Cba" type="number" class="q-mb-md" />
                        <q-input outlined v-model.number="ivaCompras.PercepcionesIIBB" label="Percepciones IIBB" type="number" class="q-mb-md" />
                        <q-input outlined v-model.number="ivaCompras.ImporteTotal" label="Importe Total" type="number" class="q-mb-md" />
                    </div>
                </div>

                <!-- 🌟 Datos del Cliente -->
                <div class="text-subtitle1 text-bold text-secondary q-mb-md">Datos del Cliente</div>
                <q-select outlined v-model="selectedCliente" label="Seleccionar Cliente" :options="filteredClientes"
                    option-label="Nombre" use-input input-debounce="300" @filter="filterClientes" class="q-mb-md" />

                <q-input outlined v-model="cliente.Nombre" label="Nombre" class="q-mb-md" />
                <q-input outlined v-model="cliente.Cuil" label="CUIL" class="q-mb-md" />

                <!-- 🏢 Datos del Proveedor -->
                <div class="text-subtitle1 text-bold text-secondary q-mb-md">Datos del Proveedor</div>
                <q-select outlined v-model="selectedProveedor" label="Seleccionar Proveedor"
                    :options="filteredProveedores" option-label="Nombre" use-input input-debounce="300"
                    @filter="filterProveedores" class="q-mb-md" />

                <q-input outlined v-model="proveedor.Nombre" label="Nombre" class="q-mb-md" />
                <q-input outlined v-model="proveedor.Cuit" label="CUIT" class="q-mb-md" />

                <!-- Botones -->
                <div class="row justify-center q-gutter-md">
                    <q-btn label="Guardar" type="submit" color="primary" class="q-px-lg" :disable="isGuardarDisabled"/>
                    <q-btn label="Cancelar" flat color="negative" @click="limpiarFormulario" />
                </div>
            </q-form>
        </q-card-section>
    </q-card>
</template>

<script>
import { onMounted, ref, watch , computed} from 'vue'
import { useQuasar } from 'quasar'
import { getClientes, getProveedores, addIvaCompras } from '../service/GestionService'

export default {
    name: 'FormularioIVAVentas', 
    emits: ['volver'],
    setup() {
        const $q = useQuasar()
        const clientes = ref([])
        const filteredClientes = ref([])
        const selectedCliente = ref(null)
        const proveedores = ref([])
        const filteredProveedores = ref([])
        const selectedProveedor = ref(null)
        const ivaCompras = ref({
            Fecha: '',
            Factura: '',
            Factura_N: null,
            CondicionIva: '',
            Neto: null,
            IVA21: null,
            IVA10_5: null,
            PercIVA: null,
            ConceptosNoAgravados: null,
            Flete10_5: null,
            PercepcionesCba: null,
            PercepcionesIIBB: null,
            ImporteTotal: null
        })

        const cliente = ref({
            Nombre: '',
            Cuil: ''
        })

        const proveedor = ref({
            Nombre: '',
            Cuit: ''
        })

        function guardarIVACompras() {
            const payload = {
                ivaCompras: ivaCompras.value,
                cliente: cliente.value && cliente.value.id_Cliente ? cliente.value : null,
                proveedor: proveedor.value && proveedor.value.id_Proveedor ? proveedor.value : null
            }
            console.log('Payload a enviar:', payload)
            addIvaCompras(payload)
                .then(() => {
                    $q.notify({
                        type: 'positive',
                        message: 'IVA Compra guardada con éxito'
                    })
                    limpiarFormulario()
                })
                .catch(error => {
                    console.error('Error al guardar la IVA Compra:', error)
                    $q.notify({
                        type: 'negative',
                        message: 'Ocurrió un error al guardar la IVA Compra'
                    })
                });
        }


        const isGuardarDisabled = computed(() => {
            return !ivaCompras.value.Fecha || 
                   !ivaCompras.value.Factura || 
                   ivaCompras.value.Factura_N === null || 
                   !ivaCompras.value.CondicionIva || 
                   ivaCompras.value.Neto === null;
        });

        function limpiarFormulario() {
            ivaCompras.value = {
                Fecha: '',
                Factura: '',
                Factura_N: null,
                CondicionIva: '',
                Neto: null,
                IVA21: null,
                IVA10_5: null,
                PercIVA: null,
                ConceptosNoAgravados: null, 
                Flete10_5: null,
                PercepcionesCba: null,  
                PercepcionesIIBB: null,
                ImporteTotal: null
            }

            cliente.value = {
                Nombre: '',
                Cuil: ''
            }

            proveedor.value = {
                Nombre: '',
                Cuit: ''
            }
        }

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

        const cargarProveedores = async () => {
            try {
                const response = await getProveedores();
                proveedores.value = response || [];
                filteredProveedores.value = [...proveedores.value];
            } catch (error) {
                console.error('Error al cargar proveedores:', error)
            }
        }

        const filterProveedores = (val, update) => {
            if (!val) {
                update(() => {
                    filteredProveedores.value = [...proveedores.value]
                })
                return
            }

            update(() => {
                const needle = val.toLowerCase()
                filteredProveedores.value = proveedores.value.filter(proveedor =>
                    proveedor.Nombre.toLowerCase().includes(needle)
                )
            })
        }

        watch(selectedProveedor, (newValue) => {
            if (newValue) {
                const proveedorSeleccionado = proveedores.value.find(proveedor => proveedor.Nombre === newValue.Nombre)
                if (proveedorSeleccionado) {
                    proveedor.value = { ...proveedorSeleccionado }
                } else {
                    proveedor.value = { Nombre: '', Cuit: '' }
                }
            } else {
                proveedor.value = { Nombre: '', Cuit: '' }
            }
        })

        onMounted(() => {
            cargarClientes();
            cargarProveedores();
        });

        return {
            ivaCompras,
            cliente,
            filterClientes,
            filteredClientes,
            selectedCliente,
            filterProveedores,
            filteredProveedores,
            selectedProveedor,
            proveedor,
            guardarIVACompras,
            limpiarFormulario,
            isGuardarDisabled
        }
    }
}
</script>