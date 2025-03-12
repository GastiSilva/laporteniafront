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
    
            
            <q-card-actions align="right">
                <q-btn label="Consultar" color="primary"  />
                <q-btn v-if="selectedTable" label="Exportar" color="primary" icon="download" @click="showExportModal = true" />
                <q-dialog v-model="showExportModal">
                    <q-card>
                        <q-card-section>
                            <div class="text-h6 q-mb-md">Seleccione el formato de exportación</div>
                        </q-card-section>
                        <q-separator />
                        <q-card-section class="row justify-center">
                            <q-btn class="q-ma-sm" label="PDF" color="primary" @click="exportData('pdf')" />
                            <q-btn class="q-ma-sm" label="Excel (XLSX)" color="primary" @click="exportData('xlsx')" />
                            <q-btn class="q-ma-sm" label="Word" color="primary" @click="exportData('word')" />
                        </q-card-section>
                        <q-separator />
                        <q-card-actions align="right">
                            <q-btn flat label="Cancelar" color="primary" v-close-popup />
                        </q-card-actions>
                    </q-card>
                </q-dialog>
            </q-card-actions>
            
        </div>
        <div class="row" v-if="selectedTable">
            <div class="col-12">
                <ExportarTablasView :selected-table="selectedTable" />
            </div>
        </div>
    </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import { TraerTablas } from './service/ExportarDatosService';
import ExportarTablasView from './components/ExportarTablasView.vue';

export default {
    name: 'ExportarDatosView',
    components: {
        ExportarTablasView
    },
    setup() {
        const selectedTable = ref(null);
        const tables = ref([]);
        const showExportModal = ref(false);
        const exportData = () => {
          
        };

        const tablasImport = async () => {
            try {
                const response = await TraerTablas();
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
            showExportModal,
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