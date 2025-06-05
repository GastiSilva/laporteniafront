<template>
    <q-card class="q-pa-lg q-mx-auto shadow-2" style="max-width: 900px; border-radius: 12px;">
        <q-btn label="Volver" flat rounded style="background-color: #0e1d75; color: white;" @click="$emit('volver')" />
        <q-card-section>
            <div class="text-h5 text-center" style="color: #0e1d75;">Agregar Materia Prima por Producto</div>
        </q-card-section>
        <q-card-section>
            <q-form @submit.prevent="guardarMateriaPrimaPorProducto">
                <div class="text-subtitle1 text-bold text-secondary q-mb-md">Datos del Producto y Materia Prima</div>
                    <div class="row q-mb-md">
                        <q-select v-model="selectedProduct" :options="filteredProductsOptions" use-input
                            option-label="label" option-value="value" label="Productos" @filter="filterProducts"
                            @update:model-value="onSelectUpdate" outlined dense clearable class="col-6 q-mr-lg"
                            style="background-color: white;" />
                        <q-select v-model="selectedMateriaPrima" :options="materiaPrimaOptions" label="Materia Prima"
                            outlined clearable :error="!selectedMateriaPrima && errorIntento" class="col-5" dense />
                    </div>
                    <q-input v-model.number="nuevaMateriaPrima.cantidadNecesaria" label="Cantidad Necesaria" type="number"
                        outlined class="q-mb-md" dense />
                    <div class="row justify-center q-gutter-m q-mt-md">
                        <q-btn label="Guardar" type="submit" color="primary" class="q-px-lg" />
                        <q-btn label="Cancelar" flat color="negative" @click="limpiarFormulario" />
                    </div>
            </q-form>
        </q-card-section>
    </q-card>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useQuasar } from "quasar";
import { getMateriaPrimas, addMPxProducto } from '../service/GestionService'
import { fetchProducts } from '../../../components/Tablas/service/AddDatosAPI';

export default {
    name: 'FormularioMateriaPrimaPorProducto',
    emits: ['volver'],
    setup() {
        const $q = useQuasar();
        const selectedProduct = ref(null);
        const filteredProductsOptions = ref([]);
        const allProducts = ref([]);
        const addedProducts = ref([]);
        const loading = ref(true);
        const selectedMateriaPrima = ref(null);
        const nuevaMateriaPrima = ref({
            cantidadNecesaria: null
        });
        const productoOptions = ref([]);
        const materiaPrimaOptions = ref([]);
        const errorIntento = ref(false);



        const guardarMateriaPrimaPorProducto =  () => {
            if (!selectedProduct.value || !selectedMateriaPrima.value || !nuevaMateriaPrima.value.cantidadNecesaria) {
                errorIntento.value = true;
                return;
            }
            errorIntento.value = false;

         
            try {
                 addMPxProducto(
    selectedProduct.value.value,
    selectedMateriaPrima.value.value,
    nuevaMateriaPrima.value.cantidadNecesaria
);

                $q.notify({
                    type: "positive",
                    message: "Materia Prima agregada correctamente al producto.",
                    position: "top",
                });
                limpiarFormulario();
            } catch (error) {
                console.error("Error al guardar Materia Prima por Producto:", error);
                $q.notify({
                    type: "negative",
                    message: "No se pudo agregar la Materia Prima al producto.",
                    position: "top",
                });
            }
        };

        const cargarMateriaPrimas = async () => {
            try {
                const response = await getMateriaPrimas()
                const materiasPrimas = response.data
                materiaPrimaOptions.value = materiasPrimas.map(materia => ({
                    label: materia.Nombre,
                    value: materia.id_MateriaPrima,
                }))
            } catch (error) {
                console.error('Error al cargar las materias primas:', error)
            }
        }

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

        const limpiarFormulario = () => {
            selectedProduct.value = null;
            selectedMateriaPrima.value = null;
            nuevaMateriaPrima.value.cantidadNecesaria = null;
        };

        onMounted(() => {
            cargarMateriaPrimas();
            loadProducts();
        });

        return {
            selectedProduct,
            filteredProducts,
            filterProducts,
            filteredProductsOptions,
            allProducts,
            addedProducts,
            loading,
            loadProducts,
            selectedMateriaPrima,
            nuevaMateriaPrima,
            productoOptions,
            materiaPrimaOptions,
            errorIntento,
            guardarMateriaPrimaPorProducto,
            limpiarFormulario
        };
    }
};
</script>

<style scoped>
.q-card {
    max-width: 900px;
}
</style>
