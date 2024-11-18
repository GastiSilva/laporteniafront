<template>
    <q-page-container>
        <!-- Contenedor principal con @click.stop para evitar propagación de clics -->
        <div class="q-pa-md" @click.stop>
            <!-- Título de la vista -->
            <h3>Consultar Remito</h3>

            <!-- Botón Volver -->
            <q-btn flat label="Volver" color="secondary" class="q-ma-md" @click="setCurrentView('main')" />
            <!-- Campo de búsqueda global alineado a la derecha -->
            <q-input v-model="filter" label="Buscar Remito" outlined debounce="300" class="q-ma-sm search-input"
                :clearable="true" />

            <!-- Tabla de remitos -->
            <q-table :rows="paginatedRemitos" :columns="columns" row-key="id">
                <!-- Contenido de la tabla -->
            </q-table>

            <!-- Paginador -->
            <div class="row justify-center q-mt-md">
                <q-pagination v-model="pagination.page" color="grey-8" :max="pagesNumber" size="sm" />
            </div>
        </div>
    </q-page-container>
</template>

<script>
import { ref, computed } from 'vue';
import { defineComponent } from 'vue';
// import RemitosVIew from '../RemitosVIew.vue';



export default {
    props: {
        setCurrentView: {
            type: Function,
            required: true,
        },
    },
    setup(props) {
        //const currentView = ref('consultar');

        const remitos = ref([
            { id: 1, numero: 'R781', cliente: 'Leonardo', fecha: '2024-11-16', total: '16500.00' },
            { id: 2, numero: 'R002', cliente: 'Marcelo', fecha: '2024-11-15', total: '1500.00' },
            { id: 3, numero: 'R0122', cliente: 'Moka', fecha: '2023-11-15', total: '5700.00' },
        ]);

        const filter = ref('');
        const pagination = ref({ page: 1, rowsPerPage: 5 });

        const columns = [
            { name: 'numero', label: 'Nro Remito', align: 'left', field: 'numero' },
            { name: 'cliente', label: 'Cliente', align: 'left', field: 'cliente' },
            { name: 'fecha', label: 'Fecha', align: 'center', field: 'fecha' },
            { name: 'total', label: 'Total', align: 'right', field: 'total' },
            { name: 'actions', label: 'Acciones', align: 'center' },
        ];



        const goBack = () => {
            // Llama a la función pasada como prop para cambiar la vista
            props.setCurrentView('main');
        };


        const filteredRemitos = computed(() => {
            const query = filter.value.toLowerCase();
            return remitos.value.filter(remito =>
                remito.numero.toLowerCase().includes(query) ||
                remito.cliente.toLowerCase().includes(query) ||
                remito.fecha.toLowerCase().includes(query) ||
                remito.total.toLowerCase().includes(query)
            );
        });

        const pagesNumber = computed(() => Math.ceil(filteredRemitos.value.length / pagination.value.rowsPerPage));

        const paginatedRemitos = computed(() => {
            const start = (pagination.value.page - 1) * pagination.value.rowsPerPage;
            const end = start + pagination.value.rowsPerPage;
            return filteredRemitos.value.slice(start, end);
        });


        return {
            remitos,
            columns,
            filter,
            paginatedRemitos,
            pagination,
            pagesNumber,
            goBack

        };
    }
};
</script>

<style scoped>
.search-input {
    margin-left: auto;
    max-width: 300px;
}

.q-btn {
    display: flex;
    align-items: center;
}
</style>