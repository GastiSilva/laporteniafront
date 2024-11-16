<template>
    <q-page-container>
        <div class="q-pa-md">
            <!-- Título de la vista -->
            <h3>Consultar Remito</h3>

            <!-- Campo de búsqueda global -->
            <q-input v-model="filter" label="Buscar Remito" outlined debounce="300" class="q-ma-sm" :clearable="true"
                @click.stop />

            <!-- Tabla de remitos -->
            <q-table :rows="filteredRemitos" :columns="columns" row-key="id">
                <template v-slot:body-cell-actions="props">
                    <q-td :props="props">
                        <!-- Columna de botones para ver y descargar -->
                        <q-btn icon="visibility" color="primary" @click="verRemito(props.row)" flat />
                        <q-btn icon="download" color="secondary" @click="descargarRemito(props.row)" flat />
                    </q-td>
                </template>
            </q-table>

            <!-- Modal Pop-up para ver remito -->
            <q-dialog v-model="showPopup">
                <q-card style="min-width: 350px">
                    <q-card-section>
                        <div class="text-h6">Detalles del Remito</div>
                        <p>Nro Remito: {{ selectedRemito.numero }}</p>
                        <p>Cliente: {{ selectedRemito.cliente }}</p>
                        <p>Fecha: {{ selectedRemito.fecha }}</p>
                        <p>Total: {{ selectedRemito.total }}</p>
                        <!-- Aquí puedes agregar más detalles -->
                    </q-card-section>
                    <q-card-actions>
                        <q-btn label="Cerrar" color="primary" @click="showPopup = false" />
                    </q-card-actions>
                </q-card>
            </q-dialog>
        </div>
    </q-page-container>
</template>

<script>
import { ref, computed } from 'vue';

export default {
    setup() {
        const remitos = ref([
            { id: 1, numero: 'R781', cliente: 'Leonardo', fecha: '2024-11-16', total: '16500.00' },
            { id: 2, numero: 'R002', cliente: 'Marcelo', fecha: '2024-11-15', total: '1500.00' },
            { id: 3, numero: 'R0122', cliente: 'Moka', fecha: '2023-11-15', total: '5700.00' },
            // Agrega más remitos según tu base de datos
        ]);
        const selectedRemito = ref(null);
        const showPopup = ref(false);
        const filter = ref('');

        const columns = [
            { name: 'numero', label: 'Nro Remito', align: 'left', field: 'numero' },
            { name: 'cliente', label: 'Cliente', align: 'left', field: 'cliente' },
            { name: 'fecha', label: 'Fecha', align: 'center', field: 'fecha' },
            { name: 'total', label: 'Total', align: 'right', field: 'total' },
            { name: 'actions', label: 'Acciones', align: 'center' },
        ];

        // Filtro computado que busca en todas las columnas
        const filteredRemitos = computed(() => {
            const query = filter.value.toLowerCase();
            return remitos.value.filter(remito => {
                return (
                    remito.numero.toLowerCase().includes(query) ||
                    remito.cliente.toLowerCase().includes(query) ||
                    remito.fecha.toLowerCase().includes(query) ||
                    remito.total.toLowerCase().includes(query)
                );
            });
        });

        const verRemito = (remito) => {
            selectedRemito.value = remito;
            showPopup.value = true; // Abre el modal para ver el remito
        };

        const descargarRemito = (remito) => {
            // Lógica para descargar el remito
            console.log(`Descargando remito: ${remito.numero}`);
            // Aquí puedes integrar la lógica para descargar el archivo (como un PDF, por ejemplo)
        };

        return {
            remitos,
            columns,
            filter,
            showPopup,
            selectedRemito,
            filteredRemitos,
            verRemito,
            descargarRemito,
        };
    }
};
</script>

<style scoped>
/* Estilos personalizados */
</style>