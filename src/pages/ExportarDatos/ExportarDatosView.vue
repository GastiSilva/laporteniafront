<template>
    <div class="q-pa-lg">
        <div class="page-header">
            <div>
                <h1 class="page-title">Exportar Datos</h1>
                <p class="page-subtitle">Descargá cualquier tabla del sistema en formato Excel.</p>
            </div>
        </div>

        <div class="surface-card q-pa-lg q-mb-md">
            <div class="row q-col-gutter-md items-center">
                <div class="col-12 col-md-4">
                    <q-select
                        v-model="selectedTable"
                        :options="tables"
                        label="Seleccioná la tabla"
                        outlined
                        dense
                        bg-color="white"
                        hide-bottom-space
                    />
                </div>

                <template v-if="mostrarfecha">
                    <div class="col-6 col-md-3">
                        <q-input
                            v-model="fechaDesde"
                            label="Fecha desde"
                            type="date"
                            outlined
                            dense
                            bg-color="white"
                            hide-bottom-space
                        />
                    </div>
                    <div class="col-6 col-md-3">
                        <q-input
                            v-model="fechaHasta"
                            label="Fecha hasta"
                            type="date"
                            outlined
                            dense
                            bg-color="white"
                            hide-bottom-space
                        />
                    </div>
                </template>

                <div class="col-12 col-md-2">
                    <q-btn
                        v-if="selectedTable"
                        label="Exportar"
                        color="primary"
                        icon="download"
                        unelevated
                        no-caps
                        class="full-width"
                        :loading="exportando"
                        @click="handleExportar"
                    />
                </div>
            </div>
        </div>

        <ExportarTablasView
            v-if="selectedTable"
            :selected-table="selectedTable"
            :fecha-desde="fechaDesde"
            :fecha-hasta="fechaHasta"
        />

        <div v-else class="surface-card q-pa-xl column flex-center text-grey-6">
            <q-icon name="table_view" size="42px" class="q-mb-sm" />
            <div class="text-subtitle2">Elegí una tabla para previsualizarla</div>
        </div>
    </div>
</template>

<script>
import { computed, onMounted, ref, watch } from 'vue';
import  {   TraerTablasExport,
            GenerateExcellProduccion, GenerateExcellDevolucion, GenerateExcellVentas,
            GenerateExcellProductos, GenerateExcellIngresos, GenerateExcellClientes,
            GenerateExcellCompras, GenerateExcellEgresos
        } from './service/ExportarDatosService';
import ExportarTablasView from './components/ExportarTablasView.vue';
import { downloadBlob, MIME_XLSX } from 'src/composables/useFileDownload';
import { useQuasar } from 'quasar';

// Cada tabla exportable declara que servicio la genera y si acepta rango de fechas.
// Antes esto vivia repartido en tres if-else paralelos (mostrarFechas, handleExportar
// y ocho funciones generarExcell* identicas salvo por la llamada al servicio).
const EXPORTADORES = {
    Produccion:       { generar: GenerateExcellProduccion, porFecha: true },
    Devolucion:       { generar: GenerateExcellDevolucion, porFecha: true },
    VentasMercaderia: { generar: GenerateExcellVentas,     porFecha: true },
    Ingresos:         { generar: GenerateExcellIngresos,   porFecha: true },
    Compras:          { generar: GenerateExcellCompras,    porFecha: true },
    Egresos:          { generar: GenerateExcellEgresos,    porFecha: true },
    Productos:        { generar: GenerateExcellProductos,  porFecha: false },
    Clientes:         { generar: GenerateExcellClientes,   porFecha: false },
};

export default {
    name: 'ExportarDatosView',
    components: {
        ExportarTablasView
    },
    setup() {
        const $q = useQuasar();
        const selectedTable = ref(null);
        const tables = ref([]);
        const fechaDesde = ref(null);
        const fechaHasta = ref(null);
        const exportando = ref(false);

        const mostrarfecha = computed(
            () => EXPORTADORES[selectedTable.value]?.porFecha === true
        );

        watch(selectedTable, () => {
            fechaDesde.value = null;
            fechaHasta.value = null;
        });

        const handleExportar = async () => {
            const exportador = EXPORTADORES[selectedTable.value];
            if (!exportador) return;

            exportando.value = true;
            try {
                const response = exportador.porFecha
                    ? await exportador.generar(fechaDesde.value, fechaHasta.value)
                    : await exportador.generar();

                downloadBlob(response.data, `${selectedTable.value}.xlsx`, MIME_XLSX);

                $q.notify({
                    message: 'Datos exportados correctamente',
                    color: 'green',
                    position: 'top',
                });
            } catch (error) {
                console.error('Error al exportar:', error);
                $q.notify({
                    type: 'negative',
                    message: 'No se pudieron exportar los datos.',
                    position: 'top',
                });
            } finally {
                exportando.value = false;
            }
        };

        const tablasImport = async () => {
            try {
                const response = await TraerTablasExport();

                tables.value = response.data.map(table => table.table_name).sort((a, b) => a.localeCompare(b));
            }
            catch (error){
                console.log("Error: ", error);
            }
        };

        onMounted(() => {
            tablasImport();
        });

        return {
            selectedTable,
            tables,
            tablasImport,
            mostrarfecha,
            fechaDesde,
            fechaHasta,
            exportando,
            handleExportar
        };
    }
};
</script>
<style scoped>

</style>