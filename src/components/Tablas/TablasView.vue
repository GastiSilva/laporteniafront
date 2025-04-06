<template>
    <q-layout>
        <q-page-container>
            <h5 class="q-mb-md q-mt-xs">Flujo de stock</h5>

            <div class="row items-center q-mb-none">
                <q-select v-model="selectedSection" :options="sections" label="Selecciona una sección" outlined
                    dense rounded class="col-4"  style="background-color: white;" />
            </div>
            <div>
                <div v-if="selectedSection != null" class="q-mt-md">
                    <div class="row q-gutter-md items-center">
                        <q-select v-model="selectedProduct" :options="filteredProductsOptions" use-input
                            option-label="label" option-value="value" label="Productos" @filter="filterProducts"
                            @update:model-value="onSelectUpdate" outlined dense clearable class="col-5"
                            style="background-color: white;" />
                        <q-input v-model.number="newProduct.cantidad" label="Cantidad" type="number" outlined dense
                            class="col-2"  style="background-color: white;" />
                        <q-input v-model="filters.fecha" label="Fecha" type="date" outlined dense class="col-4"  style="background-color: white;"  />
                    </div>
                    <q-btn label="Agregar producto" color="primary" @click="addProduct" class="q-mt-md col-3"
                        borderer />

                    <!-- Tabla de productos -->
                    <div class="q-mt-md" style="max-width: 80%;">
                        <q-table :rows="filteredProducts" :columns="columns" row-key="id" flat bordered
                            class="my-table-product">
                            <template v-slot:header="props">
                                <q-tr :props="props">
                                    <q-th v-for="col in props.cols" :key="col.name" :props="props" style="background-color: #0e1d75; color: white;">
                                        {{ col.label }}
                                    </q-th>
                                </q-tr>
                            </template>
                            <template v-slot:body-cell-actions="props">
                                <q-td style="display: flex; justify-content: flex-end;">
                                    <q-btn flat color="negative" icon="fa-solid fa-trash-can"
                                        @click="removeProduct(props.row.id)" />
                                </q-td>
                            </template>
                        </q-table>
                        <q-btn label="Guardar" color="green" @click="handleGuardar" class="q-mt-md col-4" />
                    </div>
                </div>
            </div>
        </q-page-container>
    </q-layout>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { guardarEnProduccion, fetchProducts, guardarEnDevolucion, guardarEnVentas } from "./service/AddDatosAPI";
import { useQuasar } from "quasar";

export default {
    setup() {
        const sections = [
            "Producción",
            "Devolución",
            "Compra de Materia Prima",
            "Venta de Mercaderías",
        ];
        const $q = useQuasar();
        const selectedProduct = ref(null);
        const filteredProductsOptions = ref([]);
        const allProducts = ref([]);

        const products = ref([]); // Todos los productos cargados del backend
        const loading = ref(true); 
        const selectedSection = ref(null);
        const filters = ref({ fecha: "" });
        const newProduct = ref({ producto: "", cantidad: null, fecha: "" });
        const addedProducts = ref([]);
        // let productId = 1;

        const onSelectUpdate = (val) => {
            console.log("Valor seleccionado:", val);
        };


        const columns = [
            { name: "fecha", label: "Fecha", align: "center", field: "fecha" },
            { name: "producto", label: "Producto", align: "left", field: "producto" },
            { name: "cantidad", label: "Cantidad", align: "center", field: "cantidad" },
            { name: "actions", label: "Acciones", align: "right" },
        ];

        const addProduct = () => {
            if (selectedProduct.value && newProduct.value.cantidad > 0) {
                const productFound = filteredProductsOptions.value.find((product) => {
                    return product.value === selectedProduct.value.value;
                });

                if (productFound) {
                    addedProducts.value.push({
                        id: productFound.value++,
                        producto: productFound.label,
                        cantidad: newProduct.value.cantidad,
                        fecha: filters.value.fecha || new Date().toISOString().slice(0, 10),
                    });
                    selectedProduct.value = null;
                    newProduct.value.cantidad = null;
                } else {
                    console.error("El producto seleccionado no se encontró en las opciones filtradas.");
                }
            } else {
                $q.notify({
                    type: "warning",
                    message: "Por favor, selecciona un producto y una cantidad válida.",
                    position: "top",
                });
            }
        };

        const removeProduct = (id) => {
            addedProducts.value = addedProducts.value.filter(
                (product) => product.id !== id
            );
        };

        const filteredProducts = computed(() => {
            return addedProducts.value;
        });

        function filterProducts(val, update) {
            update(() => {
                if (!val) {
                    filteredProductsOptions.value = allProducts.value.map(function (product) {
                        return {
                            label: product.Nombre,
                            value: product.Id_Producto
                        };
                    });
                    return;
                }

                const search = val.toLowerCase();
                filteredProductsOptions.value = allProducts.value
                    .filter(function (product) {
                        return product.Nombre.toLowerCase().includes(search);
                    })
                    .map(function (product) {
                        return {
                            label: product.Nombre,
                            value: product.Id_Producto
                        };
                    });
            });
        }

        const loadProducts = async () => {
            try {
                loading.value = true;
                const productos = await fetchProducts();
                allProducts.value = productos;
                filteredProductsOptions.value = productos.map((product) => ({
                    label: product.Nombre,
                    value: product.Id_Producto,
                }));
            } catch (error) {
                console.error("Error al cargar productos:", error);
                $q.notify({
                    type: "negative",
                    message: "No se pudo cargar los productos.",
                    position: "top",
                });
            } finally {
                loading.value = false;
            }
        };      

        const EnviarDatosProduccion = async () => {
            if (addedProducts.value.length === 0) {
                $q.notify({
                    type: "negative",
                    message: "No hay productos para enviar.",
                    position: "top",
                });
                return;
            }
            try {                
                const productos = addedProducts.value.map(
                    ({ id, producto, cantidad, fecha }) => ({
                        id,
                        nombre: producto,
                        cantidad,
                        fecha,
                    })
                );
                const response = await guardarEnProduccion(productos);
                $q.notify({
                    type: "positive",
                    message: "Datos cargados con éxito en Producción",
                    position: "top",
                });
                addedProducts.value = [];
            } catch (error) {
                console.error("Error al enviar los datos:", error);
            }
        };

        const EnviarDatosDevolucion = async () => {
            if (addedProducts.value.length === 0) {
                $q.notify({
                    type: "negative",
                    message: "No hay productos para enviar.",
                    position: "top",
                });
                return;
            }
            try {
                console.log("addedProducts.value", addedProducts.value);
                const productos = addedProducts.value.map(
                    ({ producto, cantidad, fecha }) => ({
                        nombre: producto,
                        cantidad,
                        fecha,
                    })
                );
                const response = await guardarEnDevolucion(productos);
                $q.notify({
                    type: "positive",
                    message: "Datos cargados con éxito en Devolución",
                    position: "top",
                });
                addedProducts.value = [];
            } catch (error) {
                console.error("Error al enviar los datos:", error);
            }
        };


        const EnviarDatosVentas = async () => {
            if (addedProducts.value.length === 0) {
                $q.notify({
                    type: "negative",
                    message: "No hay productos para enviar.",
                    position: "top",
                });
                return;
            }
            try {
                const productos = addedProducts.value.map(
                    ({ producto, cantidad, fecha }) => ({
                        nombre: producto,
                        cantidad,
                        fecha,
                    })
                );
                const response = await guardarEnVentas(productos);
                $q.notify({
                    type: "positive",
                    message: "Datos cargados con éxito en Ventas",
                    position: "top",
                });
                addedProducts.value = [];
            } catch (error) {
                console.error("Error al enviar los datos:", error);
            }
        };



        const handleGuardar = () =>{
            if(selectedSection.value === "Producción"){
                EnviarDatosProduccion();
            }else if(selectedSection.value === "Devolución"){
                EnviarDatosDevolucion();
            }else if(selectedSection.value === "Venta de Mercaderías"){
                EnviarDatosVentas();
            }
        }

        onMounted(() => {
            loadProducts();
        });

        return {
            sections,
            selectedSection,
            filters,
            newProduct,
            addedProducts,
            columns,
            addProduct,
            removeProduct,
            selectedProduct,
            filteredProducts,
            filteredProductsOptions,
            filterProducts,
            loadProducts,
            products,
            loading,
            onSelectUpdate,
            EnviarDatosProduccion,
            EnviarDatosDevolucion,
            EnviarDatosVentas,
            handleGuardar
        };
    },
};
</script>

<style scoped>
.q-page {
    max-width: 60%;
    margin: 0 auto;
}

.my-table-product thead tr:first-child th {
    background-color: #46799e;
    color: white;
    font-size: 100%;
}
</style>