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
import getTableData from '../../Gestion/service/GestionService';

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

        console.log("props: ", props.selectedTable);
        
        const obtenerDatosTablas = async () => {
            try {
            const response = await getTableData(props.selectedTable);
            console.log("response: ", response);
            
            const data = response.data;
            console.log("data: ", data);
            
            if (data.length > 0) {
                //agregara  futuro que no traiga las que comienzen con id && !column.startsWith('id')&& !column.startsWith('Id') pero se va a precisar que aquellas que tengan una relacion traigan el dato de la misma
                columns.value = Object.keys(data[0]).filter(column => column !== 'createdAt' && column !== 'updatedAt' );
                rows.value = data.map(row => {
                const filteredRow = {};
                columns.value.forEach(column => {
                    filteredRow[column] = row[column];
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