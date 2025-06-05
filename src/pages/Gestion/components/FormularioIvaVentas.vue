<template>
    <q-card class="q-pa-lg q-mx-auto shadow-2" style="max-width: 900px; border-radius: 12px;">
        <q-btn label="Volver" flat rounded style="background-color: #0e1d75; color: white;" @click="$emit('volver')" />
        <q-card-section>
            <div class="text-h5 text-center" style="color: #0e1d75;">Agregar IVA Ventas</div>
        </q-card-section>
        <q-card-section>
            <q-form @submit.prevent="guardarIVAVenta">
                <!-- 🧾 Datos de IVA Ventas -->
                <div class="text-subtitle1 text-bold text-secondary q-mb-md">Datos de IVA Ventas</div>

                <q-input outlined v-model="ivaVenta.Fecha" label="Fecha" type="date" class="q-mb-md" />
                <q-input outlined v-model="ivaVenta.Factura" label="Factura" class="q-mb-md" />
                <q-input outlined v-model.number="ivaVenta.Factura_N" label="Factura N°" type="number"
                    class="q-mb-md" />
                <q-input outlined v-model="ivaVenta.CondicionIva" label="Condición IVA" class="q-mb-md" />
                <q-input outlined v-model.number="ivaVenta.Neto" label="Neto" type="number" class="q-mb-md" prefix="$"/>
                <q-input outlined v-model.number="ivaVenta.IVA21" label="IVA 21%" type="number" class="q-mb-md" prefix="$"/>
                <q-input outlined v-model.number="ivaVenta.IVA10_5" label="IVA 10.5%" type="number" class="q-mb-md" prefix="$"/>
                <q-input outlined v-model.number="ivaVenta.Retenciones" label="Retenciones" type="number" class="q-mb-md" prefix="$"/>
                <q-input outlined v-model.number="ivaVenta.ImporteTotal" label="Importe Total" type="number" class="q-mb-md" prefix="$"/>

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
                    <q-btn label="Guardar" type="submit" color="primary" class="q-px-lg" />
                    <q-btn label="Cancelar" flat color="negative" @click="limpiarFormulario" />
                </div>
            </q-form>
        </q-card-section>
    </q-card>
</template>

<script>
import { onMounted, ref, watch } from 'vue'
import { useQuasar } from 'quasar'
import { getClientes, getProveedores, addIvaVentas } from '../service/GestionService'

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
        const ivaVenta = ref({
            Fecha: '',
            Factura: '',
            Factura_N: null,
            CondicionIva: '',
            Neto: null,
            IVA21: null,
            IVA10_5: null,
            Retenciones: null,
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

        function guardarIVAVenta() {
            const payload = {
                ivaVenta: ivaVenta.value,
                cliente: cliente.value && cliente.value.id_Cliente ? cliente.value : null,
                proveedor: proveedor.value && proveedor.value.id_Proveedor ? proveedor.value : null
            }

            addIvaVentas(payload)
                .then(() => {
                    $q.notify({
                        type: 'positive',
                        message: 'IVA Venta guardada con éxito'
                    })
                    limpiarFormulario()
                })
                .catch(error => {
                    console.error('Error al guardar la IVA Venta:', error)
                    $q.notify({
                        type: 'negative',
                        message: 'Ocurrió un error al guardar la IVA Venta'
                    })
                });
        }

        function limpiarFormulario() {
            ivaVenta.value = {
                Fecha: '',
                Factura: '',
                Factura_N: null,
                CondicionIva: '',
                Neto: null,
                IVA21: null,
                IVA10_5: null,
                Retenciones: null,
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
            ivaVenta,
            cliente,
            filterClientes,
            filteredClientes,
            selectedCliente,
            filterProveedores,
            filteredProveedores,
            selectedProveedor,
            proveedor,
            guardarIVAVenta,
            limpiarFormulario
        }
    }
}
</script>