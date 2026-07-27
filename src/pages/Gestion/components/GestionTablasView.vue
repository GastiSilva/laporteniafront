<template>
    <div>
        <div v-if="currentView !== 'historialStock'" class="surface-card q-pa-md q-mb-md">
            <div class="row q-col-gutter-md items-center justify-between">
                <div v-if="selectedTable && !permitirFiltrar" class="col-12 col-md-6">
                    <div class="row q-col-gutter-sm">
                        <div class="col-6">
                            <q-input v-model="fechaDesde" type="date" label="Fecha desde" outlined dense
                                bg-color="white" hide-bottom-space />
                        </div>
                        <div class="col-6">
                            <q-input v-model="fechaHasta" type="date" label="Fecha hasta" outlined dense
                                bg-color="white" hide-bottom-space />
                        </div>
                    </div>
                </div>

                <div class="col-12 col-md-auto flex gap-2 justify-end">
                    <q-btn v-if="selectedTable && !permitirAgregar" label="Agregar" color="primary" icon="add"
                        unelevated no-caps @click="mostrarFormularioAlta = true" />
                    <q-btn v-if="selectedTable && !permitirModificar" label="Modificar" color="primary" icon="edit"
                        outline no-caps :disable="filaSeleccionada === null" @click="abrirModalModificar" />
                    <q-btn v-if="selectedTable && !permitirEliminar" label="Eliminar" color="negative"
                        icon="delete_outline" outline no-caps :disable="filaSeleccionada === null"
                        @click="handleEliminar" />
                    <q-btn v-if="selectedTable && !verHistorial" label="Ver historial" color="grey-8" icon="history"
                        flat no-caps @click="abrirHistorial" />
                </div>
            </div>

            <div class="text-caption text-grey-6 q-mt-sm">
                Hacé clic en una fila para seleccionarla y usar las acciones de arriba.
            </div>
        </div>

        <HistorialStock v-if="currentView === 'historialStock'" :selectedTable="selectedTable"
            @volver="volverAGestion" />

        <div v-else class="data-table tabla-scroll">
            <table class="tabla-gestion">
                <thead>
                    <tr>
                        <th v-for="(column, index) in displayColumns" :key="index">{{ column }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(row, rowIndex) in rows" :key="rowIndex"
                        :class="{ 'selected-row': isSelected(rowIndex) }" @click="seleccionarFila(rowIndex)">
                        <td v-for="(column, colIndex) in displayColumns" :key="colIndex">{{ row[column] }}</td>
                    </tr>
                    <tr v-if="rows.length === 0">
                        <td :colspan="displayColumns.length || 1" class="celda-vacia">
                            No hay registros para mostrar.
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Popup de alta: un solo dialog, el formulario que muestra depende de la tabla elegida. -->
        <q-dialog v-model="mostrarFormularioAlta" @hide="obtenerDatosTablas">
            <q-card class="dialog-formulario">
                <component :is="componenteFormularioActivo" :selected-table="selectedTable"
                    @agregar-completado="mostrarFormularioAlta = false" @volver="mostrarFormularioAlta = false" />
            </q-card>
        </q-dialog>

        <!-- Popup de modificar: los campos dependen de la tabla seleccionada (ver CAMPOS_MODIFICAR). -->
        <q-dialog v-model="mostrarModalModificar">
            <q-card class="dialog-formulario">
                <q-card-section class="row items-center justify-between">
                    <div>
                        <div class="text-subtitle1 text-weight-semibold">Modificar registro</div>
                        <div class="text-caption text-grey-6">{{ selectedTable }}</div>
                    </div>
                    <q-btn icon="close" flat round dense v-close-popup />
                </q-card-section>

                <q-card-section class="q-pt-none">
                    <div class="row q-col-gutter-md">
                        <div v-for="campo in camposModificar" :key="campo.key" class="col-12 col-sm-6">
                            <q-select v-if="campo.tipo === 'estado'" v-model="modeloModificar[campo.key]"
                                :options="estadoOptions" option-label="label" :label="campo.label" outlined dense
                                bg-color="white" hide-bottom-space />
                            <q-input v-else v-model.number="modeloModificar[campo.key]"
                                :type="campo.tipo === 'texto' ? 'text' : 'number'"
                                :prefix="campo.tipo === 'moneda' ? '$' : undefined" :label="campo.label" outlined
                                dense bg-color="white" hide-bottom-space />
                        </div>
                    </div>
                </q-card-section>

                <q-card-actions align="right">
                    <q-btn flat no-caps label="Cancelar" v-close-popup />
                    <q-btn unelevated no-caps color="primary" label="Guardar" :loading="guardandoModificar"
                        @click="guardarModificar" />
                </q-card-actions>
            </q-card>
        </q-dialog>
    </div>
</template>

<script>
import { ref, onMounted, watch, computed } from 'vue';
import {
    getTableData, getStock, deleteCliente, deleteProveedor, deleteVendedor, deleteUsuario,
    editIngreso, editEgreso, editIvaVentas, editventasMercaderia, editGastos, editIvaCompras, editDevolucion, editProduccion, editCompras
} from '../service/GestionService';
import { obtenerEstados } from 'src/pages/Remitos/service/RemitosService';
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

// Que formulario de alta corresponde a cada tabla. Las tablas que no aparecen
// aca (Clientes, Proveedor, Vendedores, Usuarios, Productos, MateriaPrima) usan
// el formulario generico FormularioAgregar.
const FORMULARIOS_ALTA = {
    Compras: FormularioCompras,
    IVAVentas: FormularioIvaVentas,
    Egresos: FormularioEgresos,
    Gastos: FormularioGastos,
    IVACompras: FormularioIvaCompras,
    MateriaPrimaPorProducto: FormularioMateriaPrimaPorProducto,
    Ingresos: FormularioIngresos,
};

// Que campos se editan en el popup de "Modificar" para cada tabla, y como se
// arma el payload hacia el backend. Reemplaza las 9 funciones actualizar* que
// antes leian los valores de la celda editada a mano dentro de la fila.
// `idField` es la columna que identifica al registro (viene oculta, ver
// displayColumns). Los campos tipo 'estado' guardan la opcion completa
// {label, value} elegida en el select, igual que en FormularioCompras.vue.
function crearConfigModificar({ $q }) {
    const notificarExito = () => $q.notify({ type: 'positive', message: 'Se modificó correctamente.' });

    return {
        Ingresos: {
            idField: 'id_Ingreso',
            campos: [
                { key: 'Total', label: 'Total', tipo: 'moneda' },
                { key: 'Estado', label: 'Estado', tipo: 'estado' },
            ],
            valorInicial: (row, estadoOptions) => ({
                Total: parsearMoneda(row.Total),
                // El backend de Ingresos guarda el Estado como texto (no como id),
                // asi que acá se busca la opción cuyo label coincide con lo mostrado.
                Estado: estadoOptions.find(o => o.label === row.Estado) || null,
            }),
            guardar: async (id, modelo) => {
                await editIngreso(id, { Total: modelo.Total, Estado: modelo.Estado?.label });
                notificarExito();
            },
        },
        Egresos: {
            idField: 'Id_Egresos',
            campos: [{ key: 'ImporteTotal', label: 'Importe Total', tipo: 'moneda' }],
            valorInicial: (row) => ({ ImporteTotal: parsearMoneda(row.ImporteTotal) }),
            guardar: async (id, modelo) => {
                await editEgreso(id, { ImporteTotal: modelo.ImporteTotal });
                notificarExito();
            },
        },
        IVAVentas: {
            idField: 'Id_IvaVentas',
            campos: [
                { key: 'Factura', label: 'Factura', tipo: 'texto' },
                { key: 'Factura_N', label: 'Factura N°', tipo: 'texto' },
                { key: 'Neto', label: 'Neto', tipo: 'moneda' },
                { key: 'IVA21', label: 'IVA 21%', tipo: 'moneda' },
                { key: 'IVA10_5', label: 'IVA 10,5%', tipo: 'moneda' },
                { key: 'Retenciones', label: 'Retenciones', tipo: 'moneda' },
                { key: 'ImporteTotal', label: 'Importe Total', tipo: 'moneda' },
            ],
            valorInicial: (row) => ({
                Factura: row.Factura,
                Factura_N: row.Factura_N,
                Neto: parsearMoneda(row.Neto),
                IVA21: parsearMoneda(row.IVA21),
                IVA10_5: parsearMoneda(row.IVA10_5),
                Retenciones: parsearMoneda(row.Retenciones),
                ImporteTotal: parsearMoneda(row.ImporteTotal),
            }),
            guardar: async (id, modelo) => {
                await editIvaVentas(id, modelo);
                notificarExito();
            },
        },
        IVACompras: {
            idField: 'Id_IvaCompras',
            campos: [
                { key: 'Factura', label: 'Factura', tipo: 'texto' },
                { key: 'Factura_N', label: 'Factura N°', tipo: 'texto' },
                { key: 'Neto', label: 'Neto', tipo: 'moneda' },
                { key: 'IVA21', label: 'IVA 21%', tipo: 'moneda' },
                { key: 'IVA10_5', label: 'IVA 10,5%', tipo: 'moneda' },
                { key: 'PercIVA', label: 'Percepción IVA', tipo: 'moneda' },
                { key: 'IngrBrutosRetEfect', label: 'Ingresos Brutos Ret.', tipo: 'moneda' },
                { key: 'ConceptosNoAgravados', label: 'Conceptos no Gravados', tipo: 'moneda' },
                { key: 'Flete10_5', label: 'Flete 10,5%', tipo: 'moneda' },
                { key: 'PercepcionesCba', label: 'Percepciones Córdoba', tipo: 'moneda' },
                { key: 'PercepcionesIIBB', label: 'Percepciones IIBB', tipo: 'moneda' },
                { key: 'ImporteTotal', label: 'Importe Total', tipo: 'moneda' },
            ],
            valorInicial: (row) => ({
                Factura: row.Factura,
                Factura_N: row.Factura_N,
                Neto: parsearMoneda(row.Neto),
                IVA21: parsearMoneda(row.IVA21),
                IVA10_5: parsearMoneda(row.IVA10_5),
                PercIVA: parsearMoneda(row.PercIVA),
                IngrBrutosRetEfect: parsearMoneda(row.IngrBrutosRetEfect),
                ConceptosNoAgravados: parsearMoneda(row.ConceptosNoAgravados),
                Flete10_5: parsearMoneda(row.Flete10_5),
                PercepcionesCba: parsearMoneda(row.PercepcionesCba),
                PercepcionesIIBB: parsearMoneda(row.PercepcionesIIBB),
                ImporteTotal: parsearMoneda(row.ImporteTotal),
            }),
            guardar: async (id, modelo) => {
                await editIvaCompras(id, modelo);
                notificarExito();
            },
        },
        VentasMercaderia: {
            idField: 'Id_VentaMercaderia',
            campos: [{ key: 'Cantidad', label: 'Cantidad', tipo: 'numero' }],
            valorInicial: (row) => ({ Cantidad: Number(row.Cantidad) }),
            guardar: async (id, modelo) => {
                await editventasMercaderia(id, { nuevaCantidad: Number(modelo.Cantidad) });
                notificarExito();
            },
        },
        Gastos: {
            idField: 'Id_Gastos',
            campos: [{ key: 'Importe', label: 'Importe', tipo: 'moneda' }],
            valorInicial: (row) => ({ Importe: parsearMoneda(row.Importe) }),
            guardar: async (id, modelo) => {
                await editGastos(id, { Importe: modelo.Importe });
                notificarExito();
            },
        },
        Devolucion: {
            idField: 'id_Devolucion',
            campos: [{ key: 'Cantidad', label: 'Cantidad', tipo: 'numero' }],
            valorInicial: (row) => ({ Cantidad: Number(row.Cantidad) }),
            guardar: async (id, modelo) => {
                await editDevolucion(id, { nuevaCantidad: Number(modelo.Cantidad) });
                notificarExito();
            },
        },
        Produccion: {
            idField: 'id_Produccion',
            campos: [{ key: 'Cantidad', label: 'Cantidad', tipo: 'numero' }],
            valorInicial: (row) => ({ Cantidad: Number(row.Cantidad) }),
            guardar: async (id, modelo) => {
                await editProduccion(id, Number(modelo.Cantidad));
                notificarExito();
            },
        },
        Compras: {
            idField: 'Id_Compras',
            campos: [
                { key: 'Estado', label: 'Estado', tipo: 'estado' },
                { key: 'Importe', label: 'Importe', tipo: 'moneda' },
                { key: 'IVA21', label: 'IVA 21%', tipo: 'moneda' },
                { key: 'IVA10_5', label: 'IVA 10,5%', tipo: 'moneda' },
                { key: 'PercepcionIVA', label: 'Percepción IVA', tipo: 'moneda' },
                { key: 'Flete', label: 'Flete', tipo: 'moneda' },
                { key: 'PercepcionesMuniCba', label: 'Percepciones Municipales', tipo: 'moneda' },
            ],
            valorInicial: (row, estadoOptions) => ({
                // El registro original guarda estadoId como el LABEL del estado (bug:
                // editCompras espera un id). Con el select ahora se manda el id real.
                Estado: estadoOptions.find(o => o.label === row.Estado) || null,
                Importe: parsearMoneda(row.Importe),
                IVA21: parsearMoneda(row.IVA21),
                IVA10_5: parsearMoneda(row.IVA10_5),
                PercepcionIVA: parsearMoneda(row.PercepcionIVA),
                Flete: parsearMoneda(row.Flete),
                PercepcionesMuniCba: parsearMoneda(row.PercepcionesMuniCba),
            }),
            guardar: async (id, modelo) => {
                await editCompras({
                    idCompra: id,
                    compra: {
                        Importe: modelo.Importe,
                        IVA21: modelo.IVA21,
                        IVA10_5: modelo.IVA10_5,
                        PercepcionIVA: modelo.PercepcionIVA,
                        PercepcionesMuniCba: modelo.PercepcionesMuniCba,
                        Flete: modelo.Flete,
                    },
                    estadoId: modelo.Estado?.value,
                });
                notificarExito();
            },
        },
    };
}

// "$ 1.234,56" (formato es-AR) -> 1234.56. Los valores ya vienen formateados en
// `rows` porque `obtenerDatosTablas` los formatea para mostrarlos en la tabla.
function parsearMoneda(valor) {
    if (typeof valor === 'number') return valor;
    if (!valor) return 0;
    return Number(String(valor).replace(/^\$\s?/, '').replace(/\./g, '').replace(',', '.')) || 0;
}

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
        const allColumns = ref([]);
        const rows = ref([]);
        const filaSeleccionada = ref(null);
        const fechaDesde = ref(null);
        const fechaHasta = ref(null);

        const mostrarFormularioAlta = ref(false);
        const mostrarModalModificar = ref(false);
        const modeloModificar = ref({});
        const guardandoModificar = ref(false);
        const estadoOptions = ref([]);

        // Columnas que se muestran en la tabla: sin ids ni campos sensibles/ruidosos.
        // `allColumns` sigue teniendo el id de cada fila (siempre viene primero en
        // los datos), asi que las acciones (editar/eliminar) que leen
        // `selectedRow.id_Cliente`, `selectedRow.Id_Compras`, etc. siguen funcionando
        // aunque esa columna ya no se pinte.
        const displayColumns = computed(() => allColumns.value.filter(column => {
            const nombre = column.toLowerCase();
            if (props.selectedTable === 'Ingresos' && nombre === 'cuit') return false;
            if (nombre === 'contrasenia') return false;
            return !nombre.startsWith('id_');
        }));

        const configModificar = crearConfigModificar({ $q });
        const camposModificar = computed(() => configModificar[props.selectedTable]?.campos || []);

        const obtenerDatosTablas = async () => {
            try {
                const response = await getTableData(props.selectedTable, fechaDesde.value, fechaHasta.value);
                let data = response.data;

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
                    allColumns.value = Object.keys(data[0]);

                    const columnasAFormatear = [
                        'Importe', 'ImporteTotal', 'Total', 'Neto', 'IVA21', 'IVA10_5',
                        'PercIVA', 'IngrBrutosRetEfect', 'ConceptosNoAgravados', 'Flete10_5',
                        'PercepcionesCba', 'PercepcionesIIBB', 'PercepcionIVA',
                        'PercepcionesMuniCba', 'Flete', 'Retenciones', 'PrecioUnitario', 'PrecioTotal'
                    ];

                    rows.value = data.map(row => {
                        const filasFiltradas = {};
                        allColumns.value.forEach(column => {
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
                        allColumns.value = [...allColumns.value, 'Stock'];
                        const stockData = await getStock();
                        rows.value.forEach(row => {
                            const stockItem = stockData.data.find(stock => stock.id_MateriaPrima === row.id_MateriaPrima);
                            row.Stock = stockItem ? Number(stockItem.totalCantidad) : 0;
                        });
                    }

                } else {
                    allColumns.value = data.columns || [];
                    rows.value = [];
                }

                filaSeleccionada.value = null;
            } catch (error) {
                console.error('Error fetching data:', error);
            }
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

        // Solo las tablas con una entrada en configModificar tienen edicion real
        // implementada en el backend; el resto (Clientes, Proveedor, Vendedores,
        // Productos, Usuarios, MateriaPrima, MateriaPrimaPorProducto) no la tiene,
        // asi que el boton de Modificar se mantiene oculto para esas.
        const permitirModificar = computed(() => !configModificar[props.selectedTable]);

        const permitirFiltrar = computed(() => {
            return (props.selectedTable === 'Clientes' || props.selectedTable === 'Productos'|| props.selectedTable === 'MateriaPrimaPorProducto' || props.selectedTable === 'Proveedor' || props.selectedTable === 'Vendedores' || props.selectedTable === 'Gastos' || props.selectedTable === 'Usuarios' || props.selectedTable === 'MateriaPrima');
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

        const componenteFormularioActivo = computed(() => FORMULARIOS_ALTA[props.selectedTable] || FormularioAgregar);

        watch(() => props.selectedTable, () => {
            fechaDesde.value = null;
            fechaHasta.value = null;
            currentView.value = 'gestionTablasView';
            obtenerDatosTablas();
        });

        const volverAGestion = () => {
            currentView.value = 'gestionTablasView';
            obtenerDatosTablas();
        };

        const handleEliminar = () => {
            if (filaSeleccionada.value === null) return;

            const eliminarPorTabla = {
                Clientes: () => deleteCliente(rows.value[filaSeleccionada.value].id_Cliente),
                Proveedor: () => deleteProveedor(rows.value[filaSeleccionada.value].id_Proveedor),
                Vendedores: () => deleteVendedor(rows.value[filaSeleccionada.value].Id_Vendedor),
                Usuarios: () => deleteUsuario(rows.value[filaSeleccionada.value].id_Usuario),
            };

            const eliminar = eliminarPorTabla[props.selectedTable];
            if (!eliminar) {
                console.error('No se puede eliminar de esta tabla.');
                return;
            }

            $q.dialog({
                title: '¿Eliminar este registro?',
                message: 'Esta acción no se puede deshacer.',
                ok: { label: 'Sí, eliminar', color: 'negative', unelevated: true, noCaps: true },
                cancel: { label: 'Cancelar', color: 'grey-8', flat: true, noCaps: true },
                persistent: true,
            }).onOk(async () => {
                try {
                    await eliminar();
                    $q.notify({ type: 'positive', message: 'Registro eliminado.' });
                    obtenerDatosTablas();
                } catch (error) {
                    console.error('Error eliminando:', error);
                    $q.notify({ type: 'negative', message: 'No se pudo eliminar el registro.' });
                }
            });
        };

        const abrirModalModificar = async () => {
            if (filaSeleccionada.value === null) return;

            const config = configModificar[props.selectedTable];
            if (!config) return;

            if (config.campos.some(c => c.tipo === 'estado') && estadoOptions.value.length === 0) {
                try {
                    const estados = await obtenerEstados();
                    estadoOptions.value = estados.map(estado => ({
                        label: estado.Estado,
                        value: estado.Id_Estado,
                    }));
                } catch (error) {
                    console.error('Error al cargar los estados:', error);
                }
            }

            const row = rows.value[filaSeleccionada.value];
            modeloModificar.value = config.valorInicial(row, estadoOptions.value);
            mostrarModalModificar.value = true;
        };

        const guardarModificar = async () => {
            const config = configModificar[props.selectedTable];
            if (!config || filaSeleccionada.value === null) return;

            const row = rows.value[filaSeleccionada.value];
            const id = row[config.idField];

            guardandoModificar.value = true;
            try {
                await config.guardar(id, modeloModificar.value);
                mostrarModalModificar.value = false;
                obtenerDatosTablas();
            } catch (error) {
                console.error('Error modificando el registro:', error);
                $q.notify({ type: 'negative', message: 'No se pudo modificar el registro.' });
            } finally {
                guardandoModificar.value = false;
            }
        };

        watch([fechaDesde, fechaHasta], () => {
            obtenerDatosTablas();
        });

        onMounted(() => {
            obtenerDatosTablas();
        });

        return {
            displayColumns,
            rows,
            currentView,
            permitirAgregar,
            permitirModificar,
            permitirEliminar,
            permitirFiltrar,
            verHistorial,
            abrirHistorial,
            filaSeleccionada,
            seleccionarFila,
            isSelected,
            volverAGestion,
            fechaDesde,
            fechaHasta,
            obtenerDatosTablas,
            handleEliminar,
            mostrarFormularioAlta,
            componenteFormularioActivo,
            mostrarModalModificar,
            modeloModificar,
            guardandoModificar,
            estadoOptions,
            camposModificar,
            abrirModalModificar,
            guardarModificar,
        };
    }
};
</script>

<style scoped>
/* Las tablas de gestion son anchas (una columna por campo del modelo), asi que
   el scroll horizontal vive en el contenedor y no empuja el layout del panel. */
.tabla-scroll {
    overflow-x: auto;
    background: var(--color-surface-raised);
}

.tabla-gestion {
    width: 100%;
    border-collapse: collapse;
    white-space: nowrap;
}

.tabla-gestion th {
    background: #fafbfc;
    color: var(--color-ink-muted);
    font-size: 0.6875rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    text-align: left;
    padding: 0.875rem 0.75rem;
    border-bottom: 1px solid var(--color-border-subtle);
    position: sticky;
    top: 0;
    z-index: 1;
}

.tabla-gestion td {
    font-size: 0.875rem;
    color: var(--color-ink);
    padding: 0.625rem 0.75rem;
    border-bottom: 1px solid #f1f3f7;
}

.tabla-gestion tbody tr {
    cursor: pointer;
    transition: background-color 0.12s ease;
}

.tabla-gestion tbody tr:hover {
    background: #f9fafc;
}

.selected-row {
    background: color-mix(in srgb, var(--color-brand-accent) 12%, white) !important;
    box-shadow: inset 3px 0 0 var(--color-brand-accent);
}

.celda-vacia {
    text-align: center;
    padding: 2.5rem 0.75rem;
    color: var(--color-ink-muted);
}

.dialog-formulario {
    width: 100%;
    max-width: 720px;
    max-height: 90vh;
    overflow-y: auto;
}
</style>
