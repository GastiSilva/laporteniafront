<template>
    <div class="exportar-datos-page">
        <h5 class="q-mb-xs q-mt-md">Exportar Datos</h5>
        <div class="row">
            <div class="col-3 ">
                <q-card-section>
                    <q-select
                        v-model="selectedTable"
                        :options="tables"
                        label="Seleccione la tabla"
                        outlined
                        dense
                        rounded
                    />
                </q-card-section>
            </div>
    
            <q-card-actions align="right">
                <q-btn v-if="selectedTable" label="Exportar" color="primary" icon="download"  @click="handleExportar"/>          
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
import { TraerTablasExport, GenerateExcellProduccion, GenerateExcellDevolucion} from './service/ExportarDatosService';
import ExportarTablasView from './components/ExportarTablasView.vue';


export default {
    name: 'ExportarDatosView',
    components: {
        ExportarTablasView
    },
    setup() {
        const selectedTable = ref(null);
        const tables = ref([]);
        const exportData = () => {
          
        };

        const handleExportar = () =>{
            if(selectedTable.value === "Produccion"){
                generarExcellProduccion();
            }else if(selectedTable.value === "Devolucion"){
                generarExcellDevolucion();
            }
        }

        const tablasImport = async () => {
            try {
                const response = await TraerTablasExport();
                tables.value = response.data.map(table => table.table_name);
            }
            catch (error){
                console.log("Error: ", error);
            }
        };

        const generarExcellProduccion = async () => {
            try {
            const response = await GenerateExcellProduccion(selectedTable.value);
            console.log("Response: ", response);
            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${selectedTable.value}.xlsx`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            }
            catch (error){
            console.log("Error: ", error);
            }
        };
        const generarExcellDevolucion = async () => {
            try {
            const response = await GenerateExcellDevolucion(selectedTable.value);
            console.log("Response: ", response);
            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${selectedTable.value}.xlsx`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
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
            tablasImport,
            generarExcellProduccion,
            generarExcellDevolucion,
            handleExportar
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