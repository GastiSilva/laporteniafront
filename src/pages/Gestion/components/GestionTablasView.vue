<template>
    <div v-if="currentView === 'gestionTablasView'">
        <q-card-actions align="right">
            <q-btn v-if="selectedTable && !permitirAgregar" label="Agregar" color="primary" icon="add" @click="consularTabla" />
            <q-btn v-if="selectedTable && !permitirEliminar" label="Eliminar" color="primary" icon="remove" @click="handleEliminar" />
            <q-btn v-if="selectedTable && !permitirModificar" label="Modificar" color="primary" icon="edit" @click="handleModificar" />
        </q-card-actions>
        <table>
            <thead>
                <tr>
                    <th v-for="(column, index) in columns" :key="index"
                        style="background-color: #0e1d75; color: white;">{{ column }}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(row, rowIndex) in rows" :key="rowIndex" :class="{ 'selected-row': isSelected(rowIndex) }"
                    @click="seleccionarFila(rowIndex)">
                    <td v-for="(column, colIndex) in columns" :key="colIndex">
                        <div v-if="esEditable(rowIndex, column)">
                            <input v-model="editValue" @blur="guardarEdit(rowIndex, column)"
                                @keyup.enter="guardarEdit(rowIndex, column)" />
                        </div>
                        <div v-else @dblclick="permitirEditar(rowIndex, column)">
                            {{ row[column] }}
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <FormularioAgregar v-if="currentView === 'formularioAgregar'" :selectedTable="selectedTable" :columns="columns"
        @submit="handleSubmit" @agregar-completado="volverAGestion" @volver="volverAGestion" />
    <FormularioCompras v-if="currentView === 'formularioCompras'" :selectedTable="selectedTable" :columns="columns"
        @submit="handleSubmit" @volver="volverAGestion" />
    <FormularioIvaVentas v-if="currentView === 'formularioIvaVentas'" :selectedTable="selectedTable" :columns="columns"
        @volver="volverAGestion" @submit="handleSubmit" />
    <FormularioIvaCompras v-if="currentView === 'formularioIvaCompras'" :selectedTable="selectedTable"
        :columns="columns" @volver="volverAGestion" />
    <FormularioEgresos v-if="currentView === 'formularioEgresos'" :selectedTable="selectedTable" :columns="columns"
        @volver="volverAGestion" />
    <FormularioGastos v-if="currentView === 'formularioGastos'" :selectedTable="selectedTable" :columns="columns"
        @volver="volverAGestion" />
</template>

<script>
import { ref, onMounted, watch, computed } from 'vue';
import { getTableData, deleteProduccion, deleteVentas, deleteCliente, deleteProveedor, deleteVendedor, deleteDevolucion, getCompraFormData, editIngreso, editEgreso } from '../service/GestionService';
import FormularioAgregar from './FormularioAgregar.vue';
import FormularioCompras from './FormularioCompras.vue';
import FormularioIvaVentas from './FormularioIvaVentas.vue';
import FormularioEgresos from './FormularioEgresos.vue';
import FormularioGastos from './FormularioGastos.vue';
import FormularioIvaCompras from './FormularioIvaCompras.vue';
import { useQuasar } from 'quasar';

export default {
    name: 'GestionTablasView',
    components: {
        FormularioAgregar,
        FormularioCompras,
        FormularioIvaVentas,
        FormularioIvaCompras,
        FormularioEgresos,
        FormularioGastos,
    },
    props: {
        selectedTable: {
            type: String,
            required: true
        }
    },
    setup(props) {
        const $q = useQuasar();
        const currentView = ref('gestionTablasView');
        const columns = ref([]);
        const rows = ref([]);
        const filaEditada = ref(null);
        const columnaEditada = ref(null);
        const editValue = ref('');
        const filaSeleccionada = ref(null);
        const mostrarFormulario = ref(false);

        const obtenerDatosTablas = async () => {
            try {
                const response = await getTableData(props.selectedTable);
                const data = response.data;

                if (data.length > 0) {
                    columns.value = Object.keys(data[0]).filter((column, index) => {
                        if (index === 0) {
                            return true;
                        }
                        if (props.selectedTable === 'Ingresos' && column.toLowerCase() === 'cuit') {
                            return false;
                        }
                        return !column.toLowerCase().startsWith('id_');
                    });

                    const columnasAFormatear = [
                        'Importe',
                        'ImporteTotal',
                        'Total',
                        'Neto',
                        'IVA21',
                        'IVA10_5',
                        'PercIVA',
                        'IngrBrutosRetEfect',
                        'ConceptosNoAgravados',
                        'Flete10_5',
                        'PercepcionesCba',
                        'PercepcionesIIBB',
                        'Retenciones',
                        'PrecioUnitario',
                        'PrecioTotal'
                    ];

                    rows.value = data.map(row => {
                        const filasFiltradas = {};
                        columns.value.forEach(column => {
                            const valor = row[column];

                            if (typeof valor === 'boolean') {
                                filasFiltradas[column] = valor ? '✔' : '✘';
                            } else if (columnasAFormatear.includes(column)) {
                                filasFiltradas[column] = new Intl.NumberFormat('es-AR', {
                                    style: 'currency',
                                    currency: 'ARS',
                                    minimumFractionDigits: 2
                                }).format(valor);
                            } else {
                                filasFiltradas[column] = valor;
                            }
                        });
                        return filasFiltradas;
                    });

                } else {
                    columns.value = data.columns.filter((column, index) => {
                        if (index === 0) {
                            return true;
                        }
                        if (props.selectedTable === 'Ingresos' && column.toLowerCase() === 'cuit') {
                            return false;
                        }
                        return !column.toLowerCase().startsWith('id_');
                    });
                    rows.value = [];
                }

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        const esEditable = (rowIndex, column) => {
            return filaEditada.value === rowIndex && columnaEditada.value === column;
        };

        const permitirEditar = (rowIndex, column) => {
            if (column.toLowerCase().startsWith('id')) {
                return;
            }
            filaEditada.value = rowIndex;
            columnaEditada.value = column;
            editValue.value = rows.value[rowIndex][column];
        };

        const guardarEdit = (rowIndex, column) => {
            rows.value[rowIndex][column] = editValue.value;
            filaEditada.value = null;
            columnaEditada.value = null;
        };

        const seleccionarFila = (rowIndex) => {
            filaSeleccionada.value = rowIndex;
        };

        const isSelected = (rowIndex) => {
            return filaSeleccionada.value === rowIndex;
        };

        const permitirAgregar = computed(() => {
            return (props.selectedTable === 'Devolucion' || props.selectedTable === 'VentasMercaderia' || props.selectedTable === 'Produccion' || props.selectedTable === 'MateriaPrima');
        });

        const permitirEliminar = computed(() => {
            return (props.selectedTable === 'Ingresos' || props.selectedTable === 'Egresos');
        });

        const permitirModificar = computed(() => {
            return (props.selectedTable === 'Devolucion' || props.selectedTable === 'VentasMercaderia' || props.selectedTable === 'Produccion' || props.selectedTable === 'MateriaPrima' 
                || props.selectedTable === 'Clientes' || props.selectedTable === 'Proveedor' || props.selectedTable === 'Vendedores'
            );
        });

        const consularTabla = () => {
            console.log('consularTabla', props.selectedTable);
            if (props.selectedTable === 'Compras') {
                currentView.value = 'formularioCompras';
            } else if (props.selectedTable === 'IVAVentas') {
                currentView.value = 'formularioIvaVentas';
            } else if (props.selectedTable === 'Egresos') {
                currentView.value = 'formularioEgresos';
            } else if (props.selectedTable === 'Gastos') {
                currentView.value = 'formularioGastos';
            } else if (props.selectedTable === 'IVACompras') {
                currentView.value = 'formularioIvaCompras';
            } else if (props.selectedTable === 'IVAVentas') {
                currentView.value = 'formularioIvaVentas';
            }
            else {
                currentView.value = 'formularioAgregar';
            }
        };

        watch(() => props.selectedTable, () => {
            obtenerDatosTablas();
            currentView.value = 'gestionTablasView';
        });

        const volverAGestion = () => {
            currentView.value = 'gestionTablasView';
            obtenerDatosTablas();
        };

        const logInitialData = async () => {
            try {
                const response = await getCompraFormData();
            } catch (error) {
                console.error('Error fetching initial data:', error);
            }
        };

        const handleEliminar = () => {
            if (props.selectedTable === 'Produccion') {
                eliminarProduccion();
            } else if (props.selectedTable === 'VentasMercaderia') {
                eliminarVentas();
            } else if (props.selectedTable === 'Clientes') {
                eliminarCliente();
            } else if (props.selectedTable === 'Proveedor') {
                eliminarProveedor();
            } else if (props.selectedTable === 'Vendedores') {
                eliminarVendedor();
            } else if (props.selectedTable === 'Devolucion') {
                eliminarDevolucion();
            } else {
                console.error('No se puede eliminar de esta tabla.');
            }
        };

        const handleModificar = () => {
            if (props.selectedTable === 'Ingresos') {
                actualizarIngreso();
            }else if(props.selectedTable === 'Egresos'){
                actualizarEgresos();
            }
            else {
                console.error('No se puede modificar esta tabla.');
            }
        };

        //METODOS ABM
        const eliminarProduccion = async () => {
            if (filaSeleccionada.value !== null) {
                const selectedRow = rows.value[filaSeleccionada.value];
                const idProduccion = selectedRow.id_Produccion;
                const cantidad = selectedRow.Cantidad;
                try {
                    await deleteProduccion(idProduccion, cantidad);
                    obtenerDatosTablas();
                } catch (error) {
                    console.error('Error eliminando produccion:', error);
                }
            } else {
                console.error('No hay fila seleccionada.');
            }
        };

        const eliminarVentas = async () => {
            if (filaSeleccionada.value !== null) {
                const selectedRow = rows.value[filaSeleccionada.value];
                const idventas = selectedRow.Id_VentaMercaderia;
                const cantidad = selectedRow.Cantidad;
                try {
                    await deleteVentas(idventas, cantidad);
                    obtenerDatosTablas();
                } catch (error) {
                    console.error('Error eliminando produccion:', error);
                }
            } else {
                console.error('No hay fila seleccionada.');
            }
        };

        const eliminarVendedor = async () => {
            if (filaSeleccionada.value !== null) {
                const selectedRow = rows.value[filaSeleccionada.value];
                const idvendedor = selectedRow.Id_Vendedor;
                try {
                    await deleteVendedor(idvendedor);
                    obtenerDatosTablas();
                } catch (error) {
                    console.error('Error eliminando proveedor:', error);
                }
            } else {
                console.error('No hay fila seleccionada.');
            }
        };

        const eliminarProveedor = async () => {
            if (filaSeleccionada.value !== null) {
                const selectedRow = rows.value[filaSeleccionada.value];
                const idproveedor = selectedRow.id_Proveedor;
                try {
                    await deleteProveedor(idproveedor);
                    obtenerDatosTablas();
                } catch (error) {
                    console.error('Error eliminando proveedor:', error);
                }
            } else {
                console.error('No hay fila seleccionada.');
            }
        };

        const eliminarCliente = async () => {
            if (filaSeleccionada.value !== null) {
                const selectedRow = rows.value[filaSeleccionada.value];
                const idcliente = selectedRow.id_Cliente;
                try {
                    await deleteCliente(idcliente);
                    obtenerDatosTablas();
                } catch (error) {
                    console.error('Error eliminando produccion:', error);
                }
            } else {
                console.error('No hay fila seleccionada.');
            }
        };

        const eliminarDevolucion = async () => {
            if (filaSeleccionada.value !== null) {
                const selectedRow = rows.value[filaSeleccionada.value];
                const idDevolucion = selectedRow.idDevolucion;
                const cantidad = selectedRow.Cantidad;
                try {
                    await deleteDevolucion(idDevolucion, cantidad);
                    obtenerDatosTablas();
                    $q.notify({
                        type: 'positive',
                        message: `Se eliminó ${cantidad} de devolucion correctamente`
                    });
                } catch (error) {
                    console.error('Error eliminando devolucion:', error);
                }
            } else {
                console.error('No hay fila seleccionada.');
            }
        };

        const actualizarIngreso = async () => {
            if (filaSeleccionada.value !== null) {
                const selectedRow = rows.value[filaSeleccionada.value];
                const idIngreso = selectedRow.id_Ingreso;
                const importe = selectedRow.Total;
                const estado = selectedRow.Estado;
                try {
                    await editIngreso(idIngreso, {
                        Total: importe,
                        Estado: estado
                    });
                    obtenerDatosTablas();
                } catch (error) {
                    console.error('Error modificando ingreso:', error);
                }
            } else {
                console.error('No hay fila seleccionada.');
            }
        };

        const actualizarEgresos = async () => {
            if (filaSeleccionada.value !== null) {
                const selectedRow = rows.value[filaSeleccionada.value];
                const idEgreso = selectedRow.Id_Egresos;
                const importeTotal = selectedRow.ImporteTotal;
                try {
                    await editEgreso(idEgreso, {ImporteTotal: importeTotal});
                    obtenerDatosTablas();
                } catch (error) {
                    console.error('Error modificando ingreso:', error);
                }
            } else {
                console.error('No hay fila seleccionada.');
            }
        };

        onMounted(() => {
            obtenerDatosTablas();
            logInitialData();
        });


        return {
            columns,
            rows,
            currentView,
            getTableData,
            consularTabla,
            esEditable,
            permitirEditar,
            permitirAgregar,
            permitirModificar,
            permitirEliminar,
            guardarEdit,
            editValue,
            filaSeleccionada,
            seleccionarFila,
            isSelected,
            volverAGestion,
            mostrarFormulario,
            //METODOS ABM
            handleModificar,
            handleEliminar,
            eliminarProduccion,
            eliminarVentas,
            eliminarCliente,
            eliminarVendedor,
            eliminarProveedor,
            eliminarDevolucion
        };
    }
};
</script>

<style scoped>
table {
    width: 100%;
    border-collapse: collapse;
}

th,
td {
    border: 1px solid #ddd;
    padding: 8px;
}

th {
    background-color: #f2f2f2;
}

.selected-row {
    background-color: #d3d3d3;
    /* Color de fondo para la fila seleccionada */
}
</style>