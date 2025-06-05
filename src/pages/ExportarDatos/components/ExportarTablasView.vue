<template>
  <div>
    <table>
      <thead>
        <tr>
          <th v-for="(column, index) in columns" :key="index" style="background-color: #0e1d75; color: white;">{{ column
            }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, rowIndex) in rows" :key="rowIndex">
          <td v-for="(column, colIndex) in columns" :key="colIndex">{{ row[column] }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import { getTableData } from '../../Gestion/service/GestionService.js'; // Ajusta la ruta según tu estructura de carpetas
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

    const obtenerDatosTablas = async () => {
      try {
        const response = await getTableData(props.selectedTable, props.fechaDesde, props.fechaHasta);
        const data = response.data;

        if (data.length > 0) {
          columns.value = Object.keys(data[0]).filter(column => column !== 'createdAt' && column !== 'updatedAt');

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
            'PercepcionIVA',
            'PercepcionesMuniCba',
            'Flete',
            'Retenciones',
            'PrecioUnitario',
            'PrecioTotal'
          ];

          rows.value = data.map(row => {
            const filteredRow = {};
            columns.value.forEach(column => {
              const valor = row[column];

              if (typeof valor === 'boolean') {
                filteredRow[column] = valor ? '✔' : '✘';
              } else if (columnasAFormatear.includes(column)) {
                filteredRow[column] = new Intl.NumberFormat('es-AR', {
                  style: 'currency',
                  currency: 'ARS',
                  minimumFractionDigits: 2
                }).format(valor);
              } else {
                filteredRow[column] = valor;
              }
            });
            return filteredRow;
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    watch(() => props.selectedTable, () => {
      obtenerDatosTablas();
    });


    watch(() => props.fechaDesde, () => {
      obtenerDatosTablas();
    });

    watch(() => props.fechaHasta, () => {
      obtenerDatosTablas();
    });


    onMounted(() => {
      obtenerDatosTablas();
    });

    return {
      columns,
      rows,
      getTableData
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
</style>