<template>
    <q-page-container>
        <div @click.stop>
            <h4 class="q-mb-md q-mt-md">Consultar Remito</h4>

             <div justify-between class="row ">

                 <q-btn flat label="Volver"  text-color="white" class="q-ma-md" @click="goBack" rounded style="background-color:#0e1d75;" />
    
                 <q-input v-model="filter" label="Buscar Remito" outlined debounce="300" class="q-ma-sm search-input" style="background-color: white;" :clearable="true">
                     <template #append>
                         <q-icon name="search" />
                     </template>
                 </q-input>
             </div>

            <!-- Tabla de remitos -->
            <q-table :rows="paginatedRemitos" :columns="columns" row-key="id" flat bordered>
                <template v-slot:header="props">
                    <q-tr :props="props">
                        <q-th v-for="col in props.cols" :key="col.name" :props="props" style="background-color: #0e1d75;color: white;">
                            {{ col.label }}
                        </q-th>
                    </q-tr>
                </template>
                <template v-slot:body-cell-actions="props">
                    <q-td align="center">
                        <div style="display: flex; justify-content: flex-end;">
                            <q-btn icon="fa-solid fa-circle-down" flat dense color="primary" @click="downloadRemito(props.row)" />
                            <q-btn icon="fa-solid fa-trash-can" flat dense color="negative" @click="deleteRemito(props.row.id)" />
                        </div>
                    </q-td>
                </template>
            </q-table>

            <!-- Paginador -->
            <div class="row justify-center q-mt-md">
                <q-pagination v-model="pagination.page" color="grey-8" :max="pagesNumber" size="sm" />
            </div>
        </div>
    </q-page-container>
</template>

<script>
import { ref, computed } from "vue";

export default {
    props: {
        setCurrentView: {
            type: Function,
            required: true,
        },
    },
    setup(props) {
        const remitos = ref([
 ]);

        const filter = ref("");
        const pagination = ref({ page: 1, rowsPerPage: 5 });

        const columns = [
            { name: "numero", label: "Nro Remito", align: "left", field: "numero" },
            { name: "cliente", label: "Cliente", align: "center", field: "cliente" },
            { name: "fecha", label: "Fecha", align: "center", field: "fecha" },
            { name: "total", label: "Total", align: "center", field: row => `$${parseFloat(row.total).toFixed(2)}` },
            { name: "actions", label: "Acciones", align: "right" },
        ];

        const goBack = () => {
            props.setCurrentView("main");
        };

        const deleteRemito = (id) => {
            remitos.value = remitos.value.filter((remito) => remito.id !== id);
        };

        const downloadRemito = (remito) => {
            alert(`Descargando remito: ${remito.numero}`);
        };

        const filteredRemitos = computed(() => {
            const query = filter.value.toLowerCase();
            return remitos.value.filter(
                (remito) =>
                    remito.numero.toLowerCase().includes(query) ||
                    remito.cliente.toLowerCase().includes(query) ||
                    remito.fecha.toLowerCase().includes(query) ||
                    remito.total.toLowerCase().includes(query)
            );
        });

        const pagesNumber = computed(() =>
            Math.ceil(filteredRemitos.value.length / pagination.value.rowsPerPage)
        );

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
            goBack,
            deleteRemito,
            downloadRemito,
        };
    },
};
</script>

<style scoped>
.search-input {
    margin-left: auto;
    width: min(100%, 400px);
    height: 18px !important;
    font-size: 0.75rem !important;
}


.q-btn {
    display: flex;
    align-items: center;
}
</style>
