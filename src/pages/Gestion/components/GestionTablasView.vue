<template>
    <div v-if="currentView === 'gestionTablasView'">
        <q-card-actions align="right">
            <q-btn v-if="selectedTable" label="Agregar" color="primary" icon="add" @click="currentView = 'formularioAgregar'" :disable="permitirAgregar" />
            <q-btn v-if="selectedTable" label="Eliminar" color="primary" icon="remove" @click="handleEliminar" />
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
         @submit="handleSubmit" @agregar-completado="volverAGestion"   @volver="volverAGestion" />
</template>

<script>
import { ref, onMounted, watch, computed } from 'vue';
import { getTableData, deleteProduccion, deleteVentas, deleteCliente, deleteProveedor, deleteVendedor } from '../service/GestionService';
import FormularioAgregar from './FormularioAgregar.vue';

export default {
    name: 'GestionTablasView',
    components: {
        FormularioAgregar
    },
    props: {
        selectedTable: {
            type: String,
            required: true
        }
    },
    setup(props) {
        const currentView = ref('gestionTablas');
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
                console.log('Data:', data);
                if (data.length > 0) {
                    columns.value = Object.keys(data[0]).filter(column => column !== 'createdAt' && column !== 'updatedAt');
                    rows.value = data.map(row => {
                        const filasFiltradas = {};
                        columns.value.forEach(column => {
                            filasFiltradas[column] = row[column];
                        });
                        return filasFiltradas;
                    });
                } else {
                    // Si no hay datos, solo establece los encabezados de las columnas
                    columns.value = data.columns;
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

        watch(() => props.selectedTable, () => {
            obtenerDatosTablas();
            currentView.value = 'gestionTablasView';
        });

        const volverAGestion = () => {
            currentView.value = 'gestionTablasView';
            obtenerDatosTablas();
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


        onMounted(() => {
            obtenerDatosTablas();
        });

        return {
            columns,
            rows,
            currentView,
            getTableData,
            esEditable,
            permitirEditar,
            permitirAgregar,
            guardarEdit,
            editValue,
            filaSeleccionada,
            seleccionarFila,
            isSelected,
            volverAGestion,
            mostrarFormulario,
            //METODOS ABM
            handleEliminar,
            eliminarProduccion,
            eliminarVentas,
            eliminarCliente,
            eliminarVendedor,
            eliminarProveedor
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