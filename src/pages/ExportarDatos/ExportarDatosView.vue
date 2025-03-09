<template>
    <div class="exportar-datos-page">
        <h5 class="q-mb-md q-mt-md">Exportar Datos</h5>
        <div class="row">
            <div class="col-3">
                <q-card-section>
                    <q-select
                        v-model="selectedTable"
                        :options="tables"
                        label="Seleccione la tabla"
                        outlined
                        dense
                    />
                </q-card-section>
            </div>
            <div class="col-3">
                <q-card-section>
                    <q-input
                        v-model="startDate"
                        type="date"
                        label="Fecha de inicio"
                        outlined
                        dense
                    />
                </q-card-section>
            </div>
            <div class="col-3">
                <q-card-section>
                    <q-input
                        v-model="endDate"
                        type="date"
                        label="Fecha de fin"
                        outlined
                        dense
                    />
                </q-card-section>
            </div>
            
            <q-card-actions align="right">
                <q-btn label="Consultar" color="primary"  />
            </q-card-actions>
            
        </div>
    </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import { TraerTablas } from './service/ExportarDatosService';

export default {
    name: 'ExportarDatosView',
    setup() {
        const selectedTable = ref(null);
        const startDate = ref(null);
        const endDate = ref(null);
        const tables = ref([]);

        const exportData = () => {
            // Lógica para exportar datos
            console.log(`Exportando datos de ${selectedTable.value} desde ${startDate.value} hasta ${endDate.value}`);
        };

        const tablasImport = async () => {
            try {
                const response = await TraerTablas();
                console.log("respuesta: ", response);
                tables.value = response.data.map(table => table.table_name);
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
            startDate,
            endDate,
            tables,
            exportData,
            tablasImport
        };
    }
};
</script>
<style scoped>
/* .exportar-datos-page {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
} */
</style>