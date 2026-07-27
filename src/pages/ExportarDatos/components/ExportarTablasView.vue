<template>
  <q-table
    class="data-table"
    :rows="rows"
    :columns="tableColumns"
    :loading="cargando"
    row-key="__rowIndex"
    flat
    :rows-per-page-options="[10, 25, 50, 0]"
    :pagination="{ rowsPerPage: 10 }"
    rows-per-page-label="Filas por página"
  >
    <template v-slot:no-data>
      <div class="full-width column flex-center q-pa-xl text-grey-6">
        <q-icon name="inbox" size="42px" class="q-mb-sm" />
        <div class="text-subtitle2">No hay datos para mostrar</div>
        <div class="text-caption q-mt-xs">
          La tabla «{{ selectedTable }}» no devolvió resultados con los filtros actuales.
        </div>
      </div>
    </template>
  </q-table>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import { getTableData } from '../../Gestion/service/GestionService.js';

// Columnas que representan importes y se muestran como moneda.
const COLUMNAS_MONEDA = [
  'Importe', 'ImporteTotal', 'Total', 'Neto', 'IVA21', 'IVA10_5', 'PercIVA',
  'IngrBrutosRetEfect', 'ConceptosNoAgravados', 'Flete10_5', 'PercepcionesCba',
  'PercepcionesIIBB', 'PercepcionIVA', 'PercepcionesMuniCba', 'Flete',
  'Retenciones', 'PrecioUnitario', 'PrecioTotal',
];

// Los ids (Id_Cliente, id_Producto, etc.) no aportan nada visualmente en un
// listado para exportar, asi que se ocultan igual que createdAt/updatedAt.
const esColumnaOculta = (columna) => {
  const nombre = columna.toLowerCase();
  return nombre === 'createdat' || nombre === 'updatedat' || nombre.startsWith('id_');
};

const formatoMoneda = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  minimumFractionDigits: 2,
});

export default {
  name: 'ExportarTablasView',
  props: {
    selectedTable: {
      type: String,
      required: true
    },
    fechaDesde: {
      type: String,
      default: null
    },
    fechaHasta: {
      type: String,
      default: null
    }
  },
  setup(props) {
    const columns = ref([]);
    const rows = ref([]);
    const cargando = ref(false);

    const tableColumns = computed(() =>
      columns.value.map(nombre => ({
        name: nombre,
        label: nombre,
        field: nombre,
        align: COLUMNAS_MONEDA.includes(nombre) ? 'right' : 'left',
        sortable: true,
        classes: COLUMNAS_MONEDA.includes(nombre) ? 'cell-numeric' : '',
      }))
    );

    const obtenerDatosTablas = async () => {
      cargando.value = true;
      try {
        const response = await getTableData(props.selectedTable, props.fechaDesde, props.fechaHasta);
        const data = response.data;

        // Cuando no hay filas el backend puede devolver { columns: [...] } en vez
        // de un array. Antes eso dejaba en pantalla los datos de la tabla anterior.
        if (!Array.isArray(data) || data.length === 0) {
          columns.value = Array.isArray(data?.columns)
            ? data.columns.filter(c => !esColumnaOculta(c))
            : [];
          rows.value = [];
          return;
        }

        columns.value = Object.keys(data[0]).filter(c => !esColumnaOculta(c));

        rows.value = data.map((row, indice) => {
          const fila = { __rowIndex: indice };
          columns.value.forEach(column => {
            const valor = row[column];

            if (typeof valor === 'boolean') {
              fila[column] = valor ? '✔' : '✘';
            } else if (COLUMNAS_MONEDA.includes(column)) {
              fila[column] = formatoMoneda.format(Number(valor) || 0);
            } else {
              fila[column] = valor;
            }
          });
          return fila;
        });
      } catch (error) {
        console.error('Error fetching data:', error);
        columns.value = [];
        rows.value = [];
      } finally {
        cargando.value = false;
      }
    };

    watch(
      () => [props.selectedTable, props.fechaDesde, props.fechaHasta],
      () => obtenerDatosTablas()
    );

    onMounted(() => {
      obtenerDatosTablas();
    });

    return {
      tableColumns,
      rows,
      cargando,
    };
  }
};
</script>
