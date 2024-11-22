<template>
    <q-layout>
        <q-page-container>
            <h3 class="q-ml-md">Modificación de datos</h3>

            <div class="q-pa-md">
                <div class="row q-gutter-md items-center">
                    <q-select v-model="selectedSection" :options="sections" label="Selecciona una sección" outlined
                        dense class="col-4" />
                </div>

                <div v-if="selectedSection != null" class="q-mt-md">
                    <div class="row q-gutter-md items-center">
                        <q-input v-model="newProduct.producto" label="Producto" outlined dense class="col-5" />
                        <q-input v-model.number="newProduct.cantidad" label="Cantidad" type="number" outlined dense
                            class="col-2" />
                        <q-input v-model="filters.fecha" label="Fecha" type="date" outlined dense class="col-4" />
                    </div>
                    <q-btn label="Agregar producto" color="primary" @click="addProduct" class="q-mt-md col-3"
                        borderer />

                    <!-- Tabla de productos -->
                    <div class="q-mt-md" style="max-width: 80%;">
                        <q-table :rows="filteredProducts" :columns="columns" row-key="id" flat bordered
                            class="my-table-product">
                            <template v-slot:body-cell-actions="props">
                                <q-td style="display: flex; justify-content: flex-end; ">
                                    <q-btn flat color="negative" icon="fa-solid fa-trash-can"
                                        @click="removeProduct(props.row.id)" />
                                </q-td>
                            </template>
                        </q-table>
                        <q-btn label="Guardar" color="green" @click="SendDatos" class="q-mt-md col-4" />
                    </div>
                </div>
            </div>
        </q-page-container>

    </q-layout>
</template>

<script>
import { ref, computed } from "vue";
import { SaveProduccion } from "./service/AddDatosAPI";

export default {
    setup() {
        const sections = [
            "Producción",
            "Devolución",
            "Compra de Materia Prima",
            "Venta de Mercaderías",
        ];

        const selectedSection = ref(null);

        const filters = ref({
            fecha: "",
        });

        const newProduct = ref({
            producto: "",
            cantidad: null,
            fecha: "",
        });

        const addedProducts = ref([]);
        let productId = 1; //modifcar cuando se carguen datois desde el back


        const columns = [
            { name: "fecha", label: "Fecha", align: "center", field: "fecha" },
            { name: "producto", label: "Producto", align: "left", field: "producto" },
            { name: "cantidad", label: "Cantidad", align: "center", field: "cantidad" },
            { name: "actions", label: "Acciones", align: "right" },
        ];

        const addProduct = () => {
            if (newProduct.value.producto && newProduct.value.cantidad > 0) {
                addedProducts.value.push({
                    id: productId++,
                    producto: newProduct.value.producto,
                    cantidad: newProduct.value.cantidad,
                    fecha: filters.value.fecha || new Date().toISOString().slice(0, 10),
                });
                newProduct.value.producto = "";
                newProduct.value.cantidad = null;
                newProduct.value.fecha = "";
            } else {
                alert("Por favor, ingresa un producto y una cantidad válida.");
            }
        };

        const removeProduct = (id) => {
            addedProducts.value = addedProducts.value.filter((product) => product.id !== id);
        };

        // const applyFilters = () => {
        //     // Aplica los filtros si es necesario
        // };

        const filteredProducts = computed(() => {
            return addedProducts.value.filter((product) => {
                const fechaProducto = new Date(product.fecha);
                const fechaFiltro = new Date(filters.value.fecha);
                return fechaProducto >= fechaFiltro;
            });
        });
        const SendDatos = async () => {
            if (addedProducts.value.length === 0) {
                alert("No hay productos para enviar.");
                return;
            }
            try {
                // Preparar el payload
                const productos = addedProducts.value.map(({ producto, cantidad, fecha }) => ({
                    nombre: producto,  // Nombre del producto
                    cantidad,  // Cantidad del producto
                    fecha,     // Fecha asociada
                }));

                const response = await SaveProduccion(productos);
                alert("Datos enviados con éxito: " + response.message);
                addedProducts.value = [];
            } catch (error) {
                console.error("Error al enviar los datos:", error);
                alert(error.message || "Error al enviar los datos.");
            }
        };


        return {
            sections,
            selectedSection,
            filters,
            newProduct,
            addedProducts,
            columns,
            addProduct,
            removeProduct,
            // applyFilters,
            filteredProducts,
            SendDatos
        };
    },
};
</script>

<style scoped>
.q-page {
    max-width: 600px;
    margin: 0 auto;
}

.my-table-product thead tr:first-child th {
    background-color: #46799e;
    color: white;
    font-size: 100%;
}
</style>
