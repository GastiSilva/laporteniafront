<template>
    <div class="q-pa-lg">
        <div class="page-header">
            <div>
                <h1 class="page-title">Consultar Remito</h1>
                <p class="page-subtitle">
                    {{ totalResultados }} {{ totalResultados === 1 ? 'remito' : 'remitos' }}
                    {{ hayFiltros ? 'según los filtros aplicados' : 'en total' }}
                </p>
            </div>
            <q-btn
                outline
                no-caps
                rounded
                icon="arrow_back"
                label="Volver"
                color="primary"
                :to="{ name: 'remitos' }"
            />
        </div>

        <div class="surface-card q-pa-md q-mb-md">
            <div class="row q-col-gutter-md items-center">
                <div class="col-12 col-md-5">
                    <q-input
                        v-model="filter"
                        label="Buscar por cliente, número o estado"
                        outlined
                        dense
                        clearable
                        bg-color="white"
                    >
                        <template #prepend>
                            <q-icon name="search" color="grey-6" />
                        </template>
                    </q-input>
                </div>
                <div class="col-12 col-sm-6 col-md-3">
                    <q-input v-model="fechaDesde" type="date" label="Fecha desde" outlined dense bg-color="white" />
                </div>
                <div class="col-12 col-sm-6 col-md-3">
                    <q-input v-model="fechaHasta" type="date" label="Fecha hasta" outlined dense bg-color="white" />
                </div>
                <div class="col-12 col-md-1 flex justify-center">
                    <q-btn
                        flat
                        dense
                        round
                        color="grey-7"
                        icon="filter_alt_off"
                        :disable="!hayFiltros"
                        @click="limpiarFiltros"
                    >
                        <q-tooltip>Limpiar filtros</q-tooltip>
                    </q-btn>
                </div>
            </div>
        </div>

        <q-table
            class="data-table"
            :rows="paginatedRemitos"
            :columns="columns"
            row-key="Id_Remito"
            flat
            :loading="cargando"
            hide-pagination
            :rows-per-page-options="[0]"
        >
            <template v-slot:no-data>
                <div class="full-width column flex-center q-pa-xl text-grey-6">
                    <q-icon name="inbox" size="42px" class="q-mb-sm" />
                    <div class="text-subtitle2">
                        {{ hayFiltros ? 'No hay remitos con esos filtros' : 'Todavía no hay remitos cargados' }}
                    </div>
                    <div v-if="hayFiltros" class="text-caption q-mt-xs">
                        Probá ajustando la búsqueda o el rango de fechas.
                    </div>
                </div>
            </template>

            <template v-slot:body-cell-numero="props">
                <q-td :props="props">
                    <span class="text-weight-medium">#{{ props.row.Id_Remito }}</span>
                </q-td>
            </template>

            <template v-slot:body-cell-total="props">
                <q-td :props="props" class="cell-numeric text-weight-medium">
                    {{ formatearMoneda(props.row.Total) }}
                </q-td>
            </template>

            <template v-slot:body-cell-estado="props">
                <q-td :props="props">
                    <q-badge
                        :color="colorEstado(props.row.Estado)"
                        :label="props.row.Estado"
                        class="q-px-sm q-py-xs rounded-full text-weight-medium"
                    />
                </q-td>
            </template>

            <template v-slot:body-cell-actions="props">
                <q-td :props="props" class="cell-actions text-right">
                    <q-btn
                        icon="download"
                        flat
                        dense
                        round
                        size="sm"
                        color="primary"
                        @click="downloadRemito(props.row.Id_Remito)"
                    >
                        <q-tooltip>Descargar PDF</q-tooltip>
                    </q-btn>
                    <q-btn
                        icon="delete_outline"
                        flat
                        dense
                        round
                        size="sm"
                        color="negative"
                        @click="deleteRemito(props.row.Id_Remito)"
                    >
                        <q-tooltip>Eliminar</q-tooltip>
                    </q-btn>
                </q-td>
            </template>
        </q-table>

        <div v-if="pagesNumber > 1" class="row justify-between items-center q-mt-md">
            <div class="text-caption text-grey-6">
                Mostrando {{ paginatedRemitos.length }} de {{ totalResultados }}
            </div>
            <q-pagination
                v-model="pagination.page"
                :max="pagesNumber"
                :max-pages="6"
                color="primary"
                direction-links
                boundary-numbers
                size="sm"
            />
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted, watch } from "vue";
import { useQuasar } from 'quasar';
import { obtenerRemitos, obtenerPDFRemitos, eliminarRemito } from "../service/RemitosService";
import { formatearFecha } from "src/composables/useFecha";

// Cada estado del remito se muestra como badge de color, para poder escanear la
// tabla de un vistazo en vez de leer texto plano en mayusculas.
const COLORES_ESTADO = {
    'PAGO TOTAL': 'positive',
    'ADEUDADO': 'negative',
    'PENDIENTE DE PAGO': 'warning',
};

const formatoMoneda = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
});

export default {
    name: 'ConsultarRemito',
    setup() {
        const $q = useQuasar();
        const remitos = ref([]);
        const filter = ref("");
        const cargando = ref(false);
        const pagination = ref({ page: 1, rowsPerPage: 8 });
        const columns = [
            { name: "numero", label: "Nro Remito", align: "left", field: "Id_Remito" },
            { name: "cliente", label: "Cliente", align: "left", field: "Senior" },
            { name: "fecha", label: "Fecha", align: "left", field: "Fecha" },
            { name: "total", label: "Total", align: "right", field: "Total" },
            { name: "estado", label: "Estado", align: "left", field: "Estado" },
            { name: "actions", label: "", align: "right" },
        ];
        const fechaDesde = ref(null);
        const fechaHasta = ref(null);

        const colorEstado = (estado) => COLORES_ESTADO[estado] || 'grey-6';
        const formatearMoneda = (valor) => formatoMoneda.format(Number(valor) || 0);

        const hayFiltros = computed(
            () => Boolean(filter.value || fechaDesde.value || fechaHasta.value)
        );

        const obtenerRemitosData = async () => {
            cargando.value = true;
            try {
                const response = await obtenerRemitos(fechaDesde.value, fechaHasta.value);
                remitos.value = response.map(remito => ({
                    Id_Remito: remito.Id_Remito,
                    Senior: remito.Senior,
                    Fecha: formatearFecha(remito.Fecha),
                    Estado: remito.Estado.Estado,
                    Total: remito.Total,
                }));
            } catch (error) {
                console.error("Error al obtener los remitos:", error);
                $q.notify({
                    type: 'negative',
                    message: 'No se pudieron cargar los remitos.',
                    position: 'top',
                });
            } finally {
                cargando.value = false;
            }
        };

        const deleteRemito = async (id) => {
            $q.dialog({
                title: '¿Deseás eliminar este remito?',
                message: `Se va a eliminar el remito #${id}. Esta acción no se puede deshacer.`,
                ok: { label: 'Sí, eliminar', color: 'negative', unelevated: true, noCaps: true },
                cancel: { label: 'Cancelar', color: 'grey-8', flat: true, noCaps: true },
                persistent: true
            }).onOk(async () => {
                try {
                    await eliminarRemito(id);
                    $q.notify({
                        type: 'positive',
                        message: 'Remito eliminado.',
                        position: 'top',
                    });
                    obtenerRemitosData();
                } catch (error) {
                    console.error("Error al eliminar el remito:", error);
                    $q.notify({
                        type: 'negative',
                        message: 'No se pudo eliminar el remito.',
                        position: 'top',
                    });
                }
            });
        };

        const limpiarFiltros = () => {
            filter.value = "";
            fechaDesde.value = null;
            fechaHasta.value = null;
            obtenerRemitosData();
        };

        const downloadRemito = async (id) => {
            try {
                await obtenerPDFRemitos(id);
            } catch {
                $q.notify({
                    type: 'negative',
                    message: 'No se pudo descargar el PDF.',
                    position: 'top',
                });
            }
        };

        const filteredRemitos = computed(() => {
            const query = (filter.value || '').toLowerCase();
            if (!query) return remitos.value;

            return remitos.value.filter(
                (remito) =>
                    remito.Id_Remito.toString().includes(query) ||
                    remito.Senior.toLowerCase().includes(query) ||
                    remito.Fecha.toLowerCase().includes(query) ||
                    remito.Total.toString().includes(query) ||
                    remito.Estado.toLowerCase().includes(query)
            );
        });

        const totalResultados = computed(() => filteredRemitos.value.length);

        const pagesNumber = computed(() =>
            Math.ceil(filteredRemitos.value.length / pagination.value.rowsPerPage)
        );

        const paginatedRemitos = computed(() => {
            const start = (pagination.value.page - 1) * pagination.value.rowsPerPage;
            return filteredRemitos.value.slice(start, start + pagination.value.rowsPerPage);
        });

        watch([fechaDesde, fechaHasta], () => {
            obtenerRemitosData();
        });

        // Al filtrar, volver a la primera pagina: si estabas en la pagina 3 y el
        // filtro deja menos resultados, la tabla quedaba vacia sin explicacion.
        watch(filter, () => {
            pagination.value.page = 1;
        });

        onMounted(() => {
            obtenerRemitosData();
        });

        return {
            columns,
            filter,
            cargando,
            paginatedRemitos,
            pagination,
            pagesNumber,
            totalResultados,
            hayFiltros,
            colorEstado,
            formatearMoneda,
            deleteRemito,
            downloadRemito,
            fechaDesde,
            fechaHasta,
            limpiarFiltros,
        };
    },
};
</script>
