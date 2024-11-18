<template>
    <q-layout>
        <q-page-container>
            <!-- Selector de secciones -->
            <q-select v-model="selectedSection" :options="sections" label="Selecciona una sección" outlined
                class="q-mb-md" />
            <!-- Formulario para agregar productos -->
            <<div class="q-pa-md">
                <q-input v-model="newProduct.producto" label="Producto" outlined class="q-mb-sm" />
                <q-input v-model.number="newProduct.cantidad" label="Cantidad" type="number" outlined class="q-mb-sm" />
                <q-btn label="Agregar a la tabla" color="primary" @click="addProduct" />
                </div>

                <!-- Tabla de productos agregados -->
                <q-table :rows="addedProducts" :columns="columns" row-key="id" flat bordered class="q-mt-md">
                    <template v-slot:body-cell-actions="props">
                        <q-td>
                            <q-btn flat color="negative" icon="delete" @click="removeProduct(props.row.id)" />
                        </q-td>
                    </template>
                </q-table>

        </q-page-container>

    </q-layout>
</template>

<script>
import { ref } from "vue";

export default {
    setup() {
        const sections = [
            "Compra de Mercaderías",
            "Producción",
            "Venta de Mercaderías",
            "Devolución",
        ];

        const selectedSection = ref(null);

        const newProduct = ref({
            producto: "",
            cantidad: null,
        });

        const addedProducts = ref([]);
        let productId = 1; // ID autoincremental para la tabla

        const columns = [
            { name: "producto", label: "Producto", align: "left", field: "producto" },
            { name: "cantidad", label: "Cantidad", align: "center", field: "cantidad" },
            { name: "actions", label: "Acciones", align: "center" },
        ];

        const addProduct = () => {
            if (newProduct.value.producto && newProduct.value.cantidad > 0) {
                addedProducts.value.push({
                    id: productId++,
                    producto: newProduct.value.producto,
                    cantidad: newProduct.value.cantidad,
                });
                newProduct.value.producto = "";
                newProduct.value.cantidad = null;
            } else {
                alert("Por favor, ingresa un producto y una cantidad válida.");
            }
        };

        const removeProduct = (id) => {
            addedProducts.value = addedProducts.value.filter((product) => product.id !== id);
        };

        return {
            sections,
            selectedSection,
            newProduct,
            addedProducts,
            columns,
            addProduct,
            removeProduct,
        };
    },
};
</script>

<style scoped>
.q-page {
    max-width: 600px;
    margin: 0 auto;
}
</style>