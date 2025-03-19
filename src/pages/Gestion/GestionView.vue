<template>
    <div class="exportar-datos-page">
        <h5 class="q-mb-md q-mt-md">Gestionar Datos</h5>
        <div class="row">
            <div class="col-3">
                <q-card-section>
                    <q-select v-model="selectedTable" :options="tables" label="Seleccione la tabla" outlined dense rounded />
                </q-card-section>
            </div>
            <q-card-actions align="right">
                <q-btn label="Consultar" color="primary" />
                <q-btn v-if="selectedTable" label="Agregar" color="primary" icon="add" />
                <q-btn v-if="selectedTable" label="Eliminar" color="primary" icon="remove" />
                <q-btn v-if="selectedTable" label="Guardar" color="primary" icon="save" />
            </q-card-actions>
        </div>
        <div class="row" v-if="selectedTable">
            <div class="col-12">
                <GestionTablasView :selected-table="selectedTable" />
            </div>
        </div>
    </div>

</template>

<script>
import { onMounted, ref, watch } from 'vue';
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
        console.log("envioo", selectedTable);

        const exportData = () => {
        };

        const tablasImport = async () => {
            try {
                const response = await TraerTablas();
                tables.value = response.data.map(table => table.table_name);
            }
            catch (error) {
                console.log("Error: ", error);
            }
        };

        watch(selectedTable, (newValue) => {
            console.log("Nueva tabla seleccionada:", newValue);
        });


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
<style scoped></style>