<template>
    <div>
        <table>
            <thead>
                <tr>
                    <th v-for="(column, index) in columns" :key="index" style="background-color: #0e1d75; color: white;">{{ column }}</th>
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
        }
    },
    setup(props) {
        const columns = ref([]);
        const rows = ref([]);

        const obtenerDatosTablas = async () => {
            try {
            const response = await getTableData(props.selectedTable);
            const data = response.data;         
            if (data.length > 0) {
                columns.value = Object.keys(data[0]).filter(column => column !== 'createdAt' && column !== 'updatedAt');
                rows.value = data.map(row => {
                const filteredRow = {};
                columns.value.forEach(column => {
                    if (typeof row[column] === 'boolean') {
                    filteredRow[column] = row[column] ? '✔' : '✘';
                    } else {
                    filteredRow[column] = row[column];
                    }
                });
                return filteredRow;
                });

                // Ordenar por la columna "Fecha" si existe
                // if (columns.value.includes('Fecha')) {
                // rows.value.sort((a, b) => new Date(b.Fecha) - new Date(a.Fecha));
                // }
            }
            } catch (error) {
            console.error('Error fetching data:', error);
            }
        };

        watch(() => props.selectedTable, () => {
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

th, td {
    border: 1px solid #ddd;
    padding: 8px;
}

th {
    background-color: #f2f2f2;
}
</style>