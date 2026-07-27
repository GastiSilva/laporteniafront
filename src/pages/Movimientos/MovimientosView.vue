<template>
    <div class="q-pa-lg">
        <div class="page-header">
            <div>
                <h1 class="page-title">Flujo de stock</h1>
                <p class="page-subtitle">
                    Registrá movimientos de producción, devoluciones y ventas de mercadería.
                </p>
            </div>
        </div>

        <div class="surface-card q-pa-lg q-mb-md">
            <div class="seccion-titulo">Sección</div>
            <div class="row q-col-gutter-md">
                <div class="col-12 col-md-5">
                    <q-select
                        v-model="selectedSection"
                        :options="sections"
                        label="Seleccioná una sección"
                        outlined
                        dense
                        bg-color="white"
                        hide-bottom-space
                    />
                </div>
            </div>
        </div>

        <template v-if="selectedSection">
            <div class="surface-card q-pa-lg q-mb-md">
                <div class="seccion-titulo">Agregar producto</div>

                <div class="row q-col-gutter-md items-center">
                    <div class="col-12 col-md-5">
                        <q-select
                            v-model="selectedProduct"
                            :options="filteredProductsOptions"
                            label="Producto"
                            option-label="label"
                            option-value="value"
                            outlined
                            dense
                            bg-color="white"
                            use-input
                            clearable
                            hide-bottom-space
                            :loading="loading"
                            @filter="filterProducts"
                        />
                    </div>
                    <div class="col-6 col-md-2">
                        <q-input
                            v-model.number="newProduct.cantidad"
                            label="Cantidad"
                            type="number"
                            outlined
                            dense
                            bg-color="white"
                            hide-bottom-space
                        />
                    </div>
                    <div class="col-6 col-md-3">
                        <q-input
                            v-model="filters.fecha"
                            label="Fecha"
                            type="date"
                            outlined
                            dense
                            bg-color="white"
                            hide-bottom-space
                        />
                    </div>
                    <div class="col-12 col-md-2">
                        <q-btn
                            label="Agregar"
                            icon="add"
                            color="primary"
                            unelevated
                            no-caps
                            class="full-width"
                            @click="addProduct"
                        />
                    </div>
                </div>
            </div>

            <q-table
                class="data-table q-mb-md"
                :rows="addedProducts"
                :columns="columns"
                row-key="id"
                flat
                hide-pagination
                :rows-per-page-options="[0]"
            >
                <template v-slot:no-data>
                    <div class="full-width column flex-center q-pa-xl text-grey-6">
                        <q-icon name="inventory_2" size="42px" class="q-mb-sm" />
                        <div class="text-subtitle2">Sin productos cargados</div>
                        <div class="text-caption q-mt-xs">
                            Agregá productos para registrarlos en {{ selectedSection }}.
                        </div>
                    </div>
                </template>

                <template v-slot:body-cell-actions="props">
                    <q-td :props="props" class="cell-actions text-right">
                        <q-btn
                            flat
                            dense
                            round
                            size="sm"
                            color="negative"
                            icon="delete_outline"
                            @click="removeProduct(props.row.id)"
                        >
                            <q-tooltip>Quitar</q-tooltip>
                        </q-btn>
                    </q-td>
                </template>
            </q-table>

            <div class="flex justify-end">
                <q-btn
                    :label="`Guardar en ${selectedSection}`"
                    icon="save"
                    color="primary"
                    unelevated
                    no-caps
                    :loading="guardando"
                    :disable="addedProducts.length === 0"
                    @click="handleGuardar"
                />
            </div>
        </template>

        <div v-else class="surface-card q-pa-xl column flex-center text-grey-6">
            <q-icon name="touch_app" size="42px" class="q-mb-sm" />
            <div class="text-subtitle2">Elegí una sección para empezar</div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { guardarEnProduccion, fetchProducts, guardarEnDevolucion, guardarEnVentas } from "./service/MovimientosService";
import { useQuasar } from "quasar";
import { fechaHoy } from "src/composables/useFecha";

// Cada seccion declara a que servicio guarda y si el payload lleva `id`.
// Antes esto eran tres funciones EnviarDatos* casi identicas mas un if-else.
const SECCIONES = {
    "Producción": { guardar: guardarEnProduccion, incluirId: true },
    "Devolución": { guardar: guardarEnDevolucion, incluirId: false },
    "Venta de Mercaderías": { guardar: guardarEnVentas, incluirId: false },
};

export default {
    name: 'MovimientosView',
    setup() {
        const sections = Object.keys(SECCIONES);
        const $q = useQuasar();

        const selectedProduct = ref(null);
        const filteredProductsOptions = ref([]);
        const allProducts = ref([]);

        const loading = ref(true);
        const guardando = ref(false);
        const selectedSection = ref(null);
        const filters = ref({ fecha: "" });
        const newProduct = ref({ producto: "", cantidad: null, fecha: "" });
        const addedProducts = ref([]);

        // Contador propio para la key de cada fila agregada. Antes se usaba
        // `productFound.value++`, que ademas de repetir ids mutaba el objeto de
        // las opciones del select y corrompia el listado de productos.
        let siguienteId = 1;

        const columns = [
            { name: "fecha", label: "Fecha", align: "left", field: "fecha" },
            { name: "producto", label: "Producto", align: "left", field: "producto" },
            { name: "cantidad", label: "Cantidad", align: "center", field: "cantidad" },
            { name: "actions", label: "", align: "right" },
        ];

        const addProduct = () => {
            if (!selectedProduct.value || !(newProduct.value.cantidad > 0)) {
                $q.notify({
                    type: "warning",
                    message: "Por favor, seleccioná un producto y una cantidad válida.",
                    position: "top",
                });
                return;
            }

            addedProducts.value.push({
                id: siguienteId++,
                idProducto: selectedProduct.value.value,
                producto: selectedProduct.value.label,
                cantidad: newProduct.value.cantidad,
                fecha: filters.value.fecha || fechaHoy(),
            });

            selectedProduct.value = null;
            newProduct.value.cantidad = null;
        };

        const removeProduct = (id) => {
            addedProducts.value = addedProducts.value.filter((product) => product.id !== id);
        };

        const filterProducts = (val, update) => {
            update(() => {
                const lista = val
                    ? allProducts.value.filter(p => p.Nombre.toLowerCase().includes(val.toLowerCase()))
                    : allProducts.value;

                filteredProductsOptions.value = lista.map(p => ({
                    label: p.Nombre,
                    value: p.Id_Producto,
                }));
            });
        };

        const loadProducts = async () => {
            loading.value = true;
            try {
                const productos = await fetchProducts();
                allProducts.value = productos || [];
                filteredProductsOptions.value = allProducts.value.map((product) => ({
                    label: product.Nombre,
                    value: product.Id_Producto,
                }));
            } catch (error) {
                console.error("Error al cargar productos:", error);
                $q.notify({
                    type: "negative",
                    message: "No se pudieron cargar los productos.",
                    position: "top",
                });
            } finally {
                loading.value = false;
            }
        };

        const handleGuardar = async () => {
            const seccion = SECCIONES[selectedSection.value];
            if (!seccion) return;

            if (addedProducts.value.length === 0) {
                $q.notify({
                    type: "negative",
                    message: "No hay productos para enviar.",
                    position: "top",
                });
                return;
            }

            const productos = addedProducts.value.map(({ id, producto, cantidad, fecha }) => ({
                ...(seccion.incluirId ? { id } : {}),
                nombre: producto,
                cantidad,
                fecha,
            }));

            guardando.value = true;
            try {
                await seccion.guardar(productos);
                $q.notify({
                    type: "positive",
                    message: `Datos cargados con éxito en ${selectedSection.value}.`,
                    position: "top",
                });
                addedProducts.value = [];
            } catch (error) {
                console.error("Error al enviar los datos:", error);
                $q.notify({
                    type: "negative",
                    message: error?.message || "No se pudieron guardar los datos.",
                    position: "top",
                });
            } finally {
                guardando.value = false;
            }
        };

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
            filteredProductsOptions,
            filterProducts,
            loading,
            guardando,
            handleGuardar,
        };
    },
};
</script>

<style scoped>
.seccion-titulo {
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--color-ink-muted);
    margin-bottom: 1rem;
}
</style>
