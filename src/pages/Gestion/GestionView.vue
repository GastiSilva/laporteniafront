<template>
    <div class="exportar-datos-page">
        <h5 class="q-mb-md q-mt-md">Gestionar Datos</h5>
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
            <q-card-actions align="right">
                <q-btn label="Consultar" color="primary"  />
            </q-card-actions>
            
        </div>
    </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import { TraerTablas } from '../ExportarDatos/service/ExportarDatosService';

export default {
    name: 'GestionView',
    setup() {
        const selectedTable = ref(null);
        const tables = ref([]);
        console.log("gestiion");
        
        const exportData = () => {
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
            tables,
            exportData,
            tablasImport
        };
    }
};
</script>
<style scoped>

</style>