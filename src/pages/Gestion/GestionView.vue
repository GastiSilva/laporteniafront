<template>
    <div class="exportar-datos-page">
        <h5 class="q-mb-xs q-mt-xs">Gestionar Datos</h5>
        <div class="row">
            <div class="col-3">
                <q-card-section>
                    <q-select v-model="selectedTable" :options="tables" label="Seleccione la tabla" outlined dense rounded />
                </q-card-section>
            </div>
        </div>
        <div class="row q-mt-none" v-if="selectedTable">
            <div class="col-12">
                <GestionTablasView :selected-table="selectedTable" />
            </div>
        </div>
    </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import { TraerTablas } from '../ExportarDatos/service/ExportarDatosService';
import GestionTablasView from './components/GestionTablasView.vue';

export default {
    name: 'GestionView',
    components: {
        GestionTablasView
    },
    setup() {
        const selectedTable = ref("");
        const tables = ref([]);


        const tablasImport = async () => {
            try {
                const response = await TraerTablas();
                tables.value = response.data.map(table => table.table_name).sort();
            }
            catch (error) {
                console.log("Error: ", error);
            }
        };

        
        onMounted(() => {
            tablasImport();
        });

        return {
            selectedTable,
            tables,
            tablasImport
        };
    }
};
</script>
<style scoped></style>