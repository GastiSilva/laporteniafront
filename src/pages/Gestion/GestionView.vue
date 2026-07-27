<template>
    <div class="q-pa-lg">
        <div class="page-header">
            <div>
                <h1 class="page-title">Gestionar Datos</h1>
                <p class="page-subtitle">Consultá, agregá y editá los registros de cada tabla.</p>
            </div>
        </div>

        <div class="surface-card q-pa-lg q-mb-md">
            <div class="row q-col-gutter-md">
                <div class="col-12 col-md-4">
                    <q-select
                        v-model="selectedTable"
                        :options="tables"
                        label="Seleccioná la tabla"
                        outlined
                        dense
                        bg-color="white"
                        hide-bottom-space
                    />
                </div>
            </div>
        </div>

        <GestionTablasView v-if="selectedTable" :selected-table="selectedTable" />

        <div v-else class="surface-card q-pa-xl column flex-center text-grey-6">
            <q-icon name="tune" size="42px" class="q-mb-sm" />
            <div class="text-subtitle2">Elegí una tabla para gestionarla</div>
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