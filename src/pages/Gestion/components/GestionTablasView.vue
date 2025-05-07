<template>
    <div v-if="currentView === 'gestionTablasView'">
        <q-card-actions align="right">
            <q-input v-if="selectedTable && !permitirFiltrar" v-model="fechaDesde" type="date" label="Fecha Desde"
                outlined dense class="q-mr-lg" />
            <q-input v-if="selectedTable && !permitirFiltrar" v-model="fechaHasta" type="date" label="Fecha Hasta"
                outlined dense class="q-mr-lg" />
            <q-btn v-if="selectedTable && !permitirAgregar" label="Agregar" color="primary" icon="add"
                @click="consularTabla" />
            <q-btn v-if="selectedTable && !permitirEliminar" label="Eliminar" color="primary" icon="remove"
                @click="handleEliminar" />
            <q-btn v-if="selectedTable && !permitirModificar" label="Modificar" color="primary" icon="edit"
                @click="handleModificar" />
            <q-btn v-if="selectedTable && !verHistorial" label="Ver historial" color="primary" icon="history" @click="abrirHistorial"/>
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
    <FormularioMateriaPrimaPorProducto v-if="currentView === 'formularioMateriaPrimaPorProducto'"
        :selectedTable="selectedTable" :columns="columns" @volver="volverAGestion" />
    <FormularioIngresos v-if="currentView === 'formularioIngresos'" :selectedTable="selectedTable" :columns="columns"
        @volver="volverAGestion" />
    <HistorialStock v-if="currentView === 'historialStock'" :selectedTable="selectedTable"  @volver="volverAGestion"/>
</template>

<script>
import { ref, onMounted, watch, computed } from 'vue';
import {
    getTableData, getCompraFormData, getStock, deleteCliente, deleteProveedor, deleteVendedor, deleteUsuario,
    editIngreso, editEgreso, editIvaVentas, editventasMercaderia, editGastos, editIvaCompras, editDevolucion, editProduccion, editCompras
} from '../service/GestionService';
import FormularioAgregar from './FormularioAgregar.vue';
import FormularioCompras from './FormularioCompras.vue';
import FormularioIvaVentas from './FormularioIvaVentas.vue';
import FormularioEgresos from './FormularioEgresos.vue';
import FormularioGastos from './FormularioGastos.vue';
import FormularioIvaCompras from './FormularioIvaCompras.vue';
import FormularioMateriaPrimaPorProducto from './FormularioMPxP.vue';
import FormularioIngresos from './FormularioIngresos.vue';
import HistorialStock from './HistorialStock.vue';
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
        FormularioMateriaPrimaPorProducto,
        FormularioIngresos,
        HistorialStock
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
        const fechaDesde = ref(null);
        const fechaHasta = ref(null);
        const rowDatas = ref([]);

        const obtenerDatosTablas = async () => {
            try {
                const response = await getTableData(props.selectedTable, fechaDesde.value, fechaHasta.value);
                let data = response.data;
                rowDatas.value = data;
                console.log('Response:', response.data);
                if (['Produccion', 'Devolucion', 'VentasMercaderia'].includes(props.selectedTable)) {
                    const agrupado = {};

                    for (const item of data) {
                        const key = item.Nombre;
                        if (!agrupado[key]) {
                            agrupado[key] = { ...item };
                        } else {
                            agrupado[key].Cantidad += item.Cantidad;


                            const fechaActual = new Date(agrupado[key].Fecha);
                            const fechaNueva = new Date(item.Fecha);
                            if (fechaNueva < fechaActual) {
                                agrupado[key].Fecha = item.Fecha;
                            }
                        }
                    }
                    data = Object.values(agrupado);
                }

                if (data.length > 0) {
                    columns.value = Object.keys(data[0]).filter((column, index) => {
                        if (index === 0) return true;
                        if (props.selectedTable === 'Ingresos' && column.toLowerCase() === 'cuit') return false;
                        if (column.toLowerCase() === 'contrasenia') return false;
                        return !column.toLowerCase().startsWith('id_');
                    });

                    const columnasAFormatear = [
                        'Importe', 'ImporteTotal', 'Total', 'Neto', 'IVA21', 'IVA10_5',
                        'PercIVA', 'IngrBrutosRetEfect', 'ConceptosNoAgravados', 'Flete10_5',
                        'PercepcionesCba', 'PercepcionesIIBB', 'PercepcionIVA',
                        'PercepcionesMuniCba', 'Flete', 'Retenciones', 'PrecioUnitario', 'PrecioTotal'
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

                    if (props.selectedTable === 'MateriaPrima') {
                        columns.value.push('Stock');
                        const stockData = await getStock();
                        rows.value.forEach(row => {
                            const stockItem = stockData.data.find(stock => stock.id_MateriaPrima === row.id_MateriaPrima);
                            row.Stock = stockItem ? Number(stockItem.totalCantidad) : 0;
                        });
                    }

                } else {
                    columns.value = data.columns.filter((column, index) => {
                        if (index === 0) return true;
                        if (props.selectedTable === 'Ingresos' && column.toLowerCase() === 'cuit') return false;
                        if (column.toLowerCase() === 'contrasenia') return false;
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
            return (props.selectedTable === 'Compras' || props.selectedTable === 'Produccion' || props.selectedTable === 'VentasMercaderia' || props.selectedTable === 'MateriaPrima' ||
                props.selectedTable === 'Ingresos' || props.selectedTable === 'Egresos' || props.selectedTable === 'IVAVentas' || props.selectedTable === 'Productos' ||
                props.selectedTable === 'IVACompras' || props.selectedTable === 'Gastos' || props.selectedTable === 'Devolucion' || props.selectedTable === 'MateriaPrimaPorProducto');
        });

        const permitirModificar = computed(() => {
            return (props.selectedTable === 'MateriaPrima' || props.selectedTable === 'MateriaPrimaPorProducto'|| 
            props.selectedTable === 'Clientes' || props.selectedTable === 'Proveedor' || props.selectedTable === 'Vendedores' || props.selectedTable === 'Productos' || props.selectedTable === 'Usuarios' 
            );
        });

        const permitirFiltrar = computed(() => {
            return (props.selectedTable === 'Clientes' || props.selectedTable === 'MateriaPrimaPorProducto' || props.selectedTable === 'Proveedor' || props.selectedTable === 'Vendedores' || props.selectedTable === 'Gastos' || props.selectedTable === 'Usuarios' || props.selectedTable === 'MateriaPrima');
        });

        const verHistorial = computed(() => {
            return (props.selectedTable === 'Productos' || props.selectedTable === 'Clientes' || props.selectedTable === 'MateriaPrimaPorProducto' || props.selectedTable === 'Proveedor' || props.selectedTable === 'Ingresos' ||
             props.selectedTable === 'Vendedores' || props.selectedTable === 'Gastos' || props.selectedTable === 'Usuarios' || props.selectedTable === 'MateriaPrima' 
             || props.selectedTable === 'Compras' || props.selectedTable === 'Egresos' || props.selectedTable === 'IVAVentas' || props.selectedTable === 'IVACompras' 
            );
        });

        const abrirHistorial = () => {
            if(props.selectedTable === 'Produccion' || props.selectedTable === 'Devolucion' || props.selectedTable === 'VentasMercaderia') {
                currentView.value = 'historialStock';
            } 
        }

        const consularTabla = () => {
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
            } else if (props.selectedTable === 'MateriaPrimaPorProducto') {
                currentView.value = 'formularioMateriaPrimaPorProducto';
            } else if (props.selectedTable === 'Ingresos') {
                currentView.value = 'formularioIngresos';
            } else if(props.selectedTable === 'Produccion' || props.selectedTable === 'Devolucion' || props.selectedTable === 'VentasMercaderia') {
                currentView.value = 'historialStock';
            } 
            else {
                currentView.value = 'formularioAgregar';
            }
        };

        watch(() => props.selectedTable, () => {
            fechaDesde.value = null;
            fechaHasta.value = null;
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
            if (props.selectedTable === 'Clientes') {
                eliminarCliente();
            } else if (props.selectedTable === 'Proveedor') {
                eliminarProveedor();
            } else if (props.selectedTable === 'Vendedores') {
                eliminarVendedor();
            } else if (props.selectedTable === 'Usuarios') {
                eliminarUsuario();
            }
            else {
                console.error('No se puede eliminar de esta tabla.');
            }
        };

        const handleModificar = () => {
            if (props.selectedTable === 'Ingresos') {
                actualizarIngreso();
            } else if (props.selectedTable === 'Egresos') {
                actualizarEgresos();
            } else if (props.selectedTable === 'IVAVentas') {
                actualizarIVAVentas();
            } else if (props.selectedTable === 'VentasMercaderia') {
                actualizarVentasMercaderia();
            } else if (props.selectedTable === 'Gastos') {
                actualizarGastos();
            } else if (props.selectedTable === 'IVACompras') {
                actualizarIVACompras();
            } else if (props.selectedTable === 'Devolucion') {
                actualizarDevolucion();
            } else if (props.selectedTable === 'Produccion') {
                actualizarProduccion();
            } else if (props.selectedTable === 'Compras') {
                actualizarCompras();
            }
            else {
                console.error('No se puede modificar esta tabla.');
            }
        };

        //METODOS ABM
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
                    console.error('Error eliminando clientes:', error);
                }
            } else {
                console.error('No hay fila seleccionada.');
            }
        };

        const eliminarUsuario = async () => {
            if (filaSeleccionada.value !== null) {
                const selectedRow = rows.value[filaSeleccionada.value];
                const idusuario = selectedRow.id_Usuario;
                try {
                    await deleteUsuario(idusuario);
                    obtenerDatosTablas();
                } catch (error) {
                    console.error('Error eliminando usuarios:', error);
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
                    $q.notify({
                        type: 'positive',
                        message: `Se modificó  correctamente`
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
                    await editEgreso(idEgreso, { ImporteTotal: importeTotal });
                    $q.notify({
                        type: 'positive',
                        message: `Se modificó  correctamente`
                    });
                    obtenerDatosTablas();
                } catch (error) {
                    console.error('Error modificando ingreso:', error);
                }
            } else {
                console.error('No hay fila seleccionada.');
            }
        };

        const actualizarIVAVentas = async () => {
            if (filaSeleccionada.value !== null) {
                const selectedRow = rows.value[filaSeleccionada.value];
                const idIvaventas = selectedRow.Id_IvaVentas;
                const factura = selectedRow.Factura;
                const facturaN = selectedRow.Factura_N;
                const neto = selectedRow.Neto;
                const iva21 = selectedRow.IVA21;
                const iva10_5 = selectedRow.IVA10_5;
                const retenciones = selectedRow.Retenciones;
                const importetotal = selectedRow.ImporteTotal;
                try {
                    await editIvaVentas(idIvaventas, {
                        Factura: factura,
                        Factura_N: facturaN,
                        Neto: neto,
                        IVA21: iva21,
                        IVA10_5: iva10_5,
                        Retenciones: retenciones,
                        ImporteTotal: importetotal
                    });
                    obtenerDatosTablas();
                } catch (error) {
                    console.error('Error modificando ingreso:', error);
                }
            } else {
                console.error('No hay fila seleccionada.');
            }
        };

        const actualizarIVACompras = async () => {
            if (filaSeleccionada.value !== null) {
                const selectedRow = rows.value[filaSeleccionada.value];
                const idIvaCompras = selectedRow.Id_IvaCompras;
                const factura = selectedRow.Factura;
                const facturaN = selectedRow.Factura_N;
                const neto = selectedRow.Neto;
                const iva21 = selectedRow.IVA21;
                const iva10_5 = selectedRow.IVA10_5;
                const percIva = selectedRow.PercIVA;
                const ingrBrutosRetEfect = selectedRow.IngrBrutosRetEfect;
                const conceptosNoAgravados = selectedRow.ConceptosNoAgravados;
                const flete10_5 = selectedRow.Flete10_5;
                const percepcionesCba = selectedRow.PercepcionesCba;
                const percepcionesIIBB = selectedRow.PercepcionesIIBB;
                const importetotal = selectedRow.ImporteTotal;
                try {
                    await editIvaCompras(idIvaCompras, {
                        Factura: factura,
                        Factura_N: facturaN,
                        Neto: neto,
                        IVA21: iva21,
                        IVA10_5: iva10_5,
                        PercIVA: percIva,
                        IngrBrutosRetEfect: ingrBrutosRetEfect,
                        ConceptosNoAgravados: conceptosNoAgravados,
                        Flete10_5: flete10_5,
                        PercepcionesCba: percepcionesCba,
                        PercepcionesIIBB: percepcionesIIBB,
                        ImporteTotal: importetotal
                    });
                    obtenerDatosTablas();
                } catch (error) {
                    console.error('Error modificando ingreso:', error);
                }
            } else {
                console.error('No hay fila seleccionada.');
            }
        };

        const actualizarVentasMercaderia = async () => {
            if (filaSeleccionada.value !== null) {
                const selectedRow = rows.value[filaSeleccionada.value];
                const idVentasMercaderia = selectedRow.Id_VentaMercaderia;
                const cantidad = selectedRow.Cantidad;
                try {
                    await editventasMercaderia(idVentasMercaderia, { nuevaCantidad: Number(cantidad) });
                    $q.notify({
                        type: 'positive',
                        message: `Se modificó  correctamente`
                    });
                    obtenerDatosTablas();
                } catch (error) {
                    console.error('Error modificando ventas:', error);
                }
            } else {
                console.error('No hay fila seleccionada.');
            }
        }

        const actualizarGastos = async () => {
            if (filaSeleccionada.value !== null) {
                const selectedRow = rows.value[filaSeleccionada.value];
                const idGasto = selectedRow.Id_Gastos;
                const importe = selectedRow.Importe;
                try {
                    await editGastos(idGasto, { Importe: importe });
                    $q.notify({
                        type: 'positive',
                        message: `Se modificó  correctamente`
                    });
                    obtenerDatosTablas();
                } catch (error) {
                    console.error('Error modificando ingreso:', error);
                }
            } else {
                console.error('No hay fila seleccionada.');
            }
        };

        const actualizarDevolucion = async () => {
            if (filaSeleccionada.value !== null) {
                const selectedRow = rows.value[filaSeleccionada.value];
                const idDevolucion = selectedRow.id_Devolucion;
                const cantidad = selectedRow.Cantidad;
                try {
                    await editDevolucion(idDevolucion, { nuevaCantidad: Number(cantidad) });
                    $q.notify({
                        type: 'positive',
                        message: `Se modificó  correctamente`
                    });
                    obtenerDatosTablas();
                } catch (error) {
                    console.error('Error modificando devolucion:', error);
                }
            } else {
                console.error('No hay fila seleccionada.');
            }
        };

        const actualizarProduccion = async () => {
            if (filaSeleccionada.value !== null) {
                const selectedRow = rows.value[filaSeleccionada.value];
                const idProduccion = selectedRow.id_Produccion;
                const cantidad = selectedRow.Cantidad;
                try {
                    await editProduccion(idProduccion, { nuevaCantidad: Number(cantidad) });
                    $q.notify({
                        type: 'positive',
                        message: `Se modificó  correctamente`
                    });
                    obtenerDatosTablas();
                } catch (error) {
                    console.error('Error modificando devolucion:', error);
                }
            } else {
                console.error('No hay fila seleccionada.');
            }
        };

        const actualizarCompras = async () => {
            if (filaSeleccionada.value !== null) {
                const selectedRow = rows.value[filaSeleccionada.value];
                const estado = selectedRow.Estado;
                const idCompras = selectedRow.Id_Compras;
                const importe = selectedRow.Importe;
                const iva21 = selectedRow.IVA21;
                const iva10_5 = selectedRow.IVA10_5;
                const percIva = selectedRow.PercepcionIVA;
                const flete = selectedRow.Flete;
                const percepcionesMuniCba = selectedRow.PercepcionesMuniCba;
                try {
                    await editCompras({
                        idCompra: idCompras,
                        compra: {
                            Importe: importe,
                            IVA21: iva21,
                            IVA10_5: iva10_5,
                            PercepcionIVA: percIva,
                            PercepcionesMuniCba: percepcionesMuniCba,
                            Flete: flete,
                        },
                        estadoId: estado
                    });

                    $q.notify({
                        type: 'positive',
                        message: `Se modificó  correctamente`
                    });
                    obtenerDatosTablas();
                } catch (error) {
                    console.error('Error modificando ingreso:', error);
                }
            } else {
                console.error('No hay fila seleccionada.');
            }
        };

        watch([fechaDesde, fechaHasta], ([newFechaDesde, newFechaHasta]) => {
            obtenerDatosTablas();
        });

        onMounted(() => {
            obtenerDatosTablas();
            logInitialData();
        });


        return {
            columns,
            rows,
            rowDatas,
            currentView,
            getTableData,
            consularTabla,
            esEditable,
            permitirEditar,
            permitirAgregar,
            permitirModificar,
            permitirEliminar,
            permitirFiltrar,
            verHistorial,
            abrirHistorial,
            guardarEdit,
            editValue,
            filaSeleccionada,
            seleccionarFila,
            isSelected,
            volverAGestion,
            mostrarFormulario,
            fechaDesde,
            fechaHasta,
            //METODOS ABM
            handleModificar,
            handleEliminar,
            eliminarCliente,
            eliminarVendedor,
            eliminarProveedor,
            eliminarUsuario
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