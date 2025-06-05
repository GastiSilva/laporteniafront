<template>
    <div class="exportar-datos-page">
        <h5 class="q-mb-xs q-mt-md">Exportar Datos</h5>
        <div class="row">
            <div class="col-3 q-mt-xs" >
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
            
            <q-card-actions align="right" class="q-mb-xs">
                <q-btn v-if="selectedTable" label="Exportar" color="primary" icon="download"  @click="handleExportar"/>          
                <div class="row q-ml-md q-mt-md q-mb-md" v-if="mostrarfecha">
                    <q-input
                        v-model="fechaDesde"
                        label="Fecha Desde"
                        type="date"
                        outlined
                        dense
                        class="q-mr-md"
                        style="width: 200px;"
                    />
                    <q-input
                        v-model="fechaHasta"
                        label="Fecha Hasta"
                        type="date"
                        outlined
                        dense
                        style="width: 200px;"
                    />
                </div>    
            </q-card-actions>
            
        </div>
        <div class="row" v-if="selectedTable">
            <div class="col-12">
                <ExportarTablasView :selected-table="selectedTable" :fecha-desde="fechaDesde"
                :fecha-hasta="fechaHasta" />
            </div>
        </div>
    </div>
</template>

<script>
import { onMounted, ref, watch } from 'vue';
import  {   TraerTablasExport,
            GenerateExcellProduccion, GenerateExcellDevolucion, GenerateExcellVentas,
            GenerateExcellProductos, GenerateExcellIngresos, GenerateExcellClientes,
            GenerateExcellCompras, GenerateExcellEgresos
        } from './service/ExportarDatosService';
import ExportarTablasView from './components/ExportarTablasView.vue';
import { useQuasar } from 'quasar';


export default {
    name: 'ExportarDatosView',
    components: {
        ExportarTablasView
    },
    setup() {
        const $q = useQuasar();
        const selectedTable = ref(null);
        const tables = ref([]);
        const mostrarfecha = ref(false);
        const fechaDesde = ref(null);
        const fechaHasta = ref(null);

    
        const exportData = () => {
          
        };

        
        const mostrarFechas = () =>{
            if(selectedTable.value === "Produccion"){
                mostrarfecha.value = true;
            }else if(selectedTable.value === "Devolucion"){
                mostrarfecha.value = true;
            }else if(selectedTable.value === "VentasMercaderia"){
                mostrarfecha.value = true;
            }else if(selectedTable.value === "Ingresos"){
                mostrarfecha.value = true;
            }else if(selectedTable.value === "Compras"){
                mostrarfecha.value = true;
            }else if(selectedTable.value === "Egresos"){
                mostrarfecha.value = true;
            }else{
                mostrarfecha.value = false;
            }
        };

        watch (selectedTable, (newValue) => {
            if (newValue) {
                mostrarFechas();
                fechaDesde.value = null;
                fechaHasta.value = null;
            } else {
                mostrarfecha.value = false;
            }
        });
        
        const handleExportar = () =>{
            if(selectedTable.value === "Produccion"){
                generarExcellProduccion();
            }else if(selectedTable.value === "Devolucion"){
                generarExcellDevolucion();
            }else if(selectedTable.value === "VentasMercaderia"){
                generarExcellVentasMercaderia();
            }else if(selectedTable.value === "Productos"){
                generarExcellProductos();
            }else if(selectedTable.value === "Ingresos"){
                generarExcellIngresos();
            }else if(selectedTable.value === "Clientes"){
                generarExcellClientes();        
            }else if(selectedTable.value === "Compras"){
                generarExcellCompras();
            }else if(selectedTable.value === "Egresos"){
                generarExcellEgresos();
            }
        };

        const tablasImport = async () => {
            try {
                const response = await TraerTablasExport();

                tables.value = response.data.map(table => table.table_name).sort((a, b) => a.localeCompare(b));
            }
            catch (error){
                console.log("Error: ", error);
            }
        };

        const generarExcellProduccion = async () => {
            try {
            const response = await GenerateExcellProduccion(fechaDesde.value, fechaHasta.value);
            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${selectedTable.value}.xlsx`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            $q.notify({
                message: 'Datos exportados correctamente',
                color: 'green',
                position: 'top',
            });
            } catch (error) {
            console.log("Error: ", error);
            }
        };

        const generarExcellDevolucion = async () => {
            try {
            const response = await GenerateExcellDevolucion(fechaDesde.value, fechaHasta.value);
            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${selectedTable.value}.xlsx`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            $q.notify({
                    message: 'Datos exportados correctamente',
                    color: 'green',
                    position: 'top',
                });
            }
            catch (error){
            console.log("Error: ", error);
            }
        };

        const generarExcellVentasMercaderia = async () => {
            try { 
            const response = await GenerateExcellVentas(fechaDesde.value, fechaHasta.value);
            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${selectedTable.value}.xlsx`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            $q.notify({
                    message: 'Datos exportados correctamente',
                    color: 'green',
                    position: 'top',
                });
            }
            catch (error){
            console.log("Error: ", error);
            }
        };

        const generarExcellProductos = async () => {
            try { 
            const response = await GenerateExcellProductos(selectedTable.value);
            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${selectedTable.value}.xlsx`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            $q.notify({
                    message: 'Datos exportados correctamente',
                    color: 'green',
                    position: 'top',
                });
            }
            catch (error){
            console.log("Error: ", error);
            }
        };

        const generarExcellIngresos = async () => {
            try { 
            const response = await GenerateExcellIngresos(fechaDesde.value, fechaHasta.value);
            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${selectedTable.value}.xlsx`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            $q.notify({
                    message: 'Datos exportados correctamente',
                    color: 'green',
                    position: 'top',
                });
            }
            catch (error){
            console.log("Error: ", error);
            }
        };

        const generarExcellClientes = async () => {
            try { 
            const response = await GenerateExcellClientes(selectedTable.value);
            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${selectedTable.value}.xlsx`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            $q.notify({
                    message: 'Datos exportados correctamente',
                    color: 'green',
                    position: 'top',
                });
            }
            catch (error){
            console.log("Error: ", error);
            }
        };

        const generarExcellCompras = async () => {
            try { 
            const response = await GenerateExcellCompras(fechaDesde.value, fechaHasta.value);
            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${selectedTable.value}.xlsx`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            $q.notify({
                    message: 'Datos exportados correctamente',
                    color: 'green',
                    position: 'top',
                });
            }
            catch (error){
            console.log("Error: ", error);
            }
        };

        const generarExcellEgresos = async () => {
            try { 
            const response = await GenerateExcellEgresos(fechaDesde.value, fechaHasta.value);
            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${selectedTable.value}.xlsx`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            $q.notify({
                    message: 'Datos exportados correctamente',
                    color: 'green',
                    position: 'top',
                });
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
            mostrarfecha,
            fechaDesde,
            fechaHasta,
            generarExcellProduccion,
            generarExcellDevolucion,
            generarExcellVentasMercaderia,
            generarExcellProductos,
            generarExcellIngresos,
            generarExcellClientes,
            generarExcellCompras,
            generarExcellEgresos,
            handleExportar
        };
    }
};
</script>
<style scoped>

</style>