<template>
    <q-card class="q-pa-lg q-mx-auto shadow-2" style="max-width: 900px; border-radius: 12px;">
        <div class="row justify-start q-mb-md  q-mt-md">
            <q-btn label="Volver" flat rounded style="background-color: #0e1d75; color: white;"
                @click="$emit('volver')" />
        </div>
        <q-card-section>
            <div class="text-h5 text-center " style="color: #0e1d75;">Historial de flujo de stock</div>
        </q-card-section>
        <div class="row q-mb-md q-ml-xs q-gutter-md">
            <q-select v-model="selectedProduct" :options="filteredProductsOptions" use-input option-label="label"
                option-value="value" label="Productos" @filter="filterProducts" outlined dense clearable class="col-5"
                style="background-color: white;" />
            <q-input v-model="fechaDesde" type="date" label="Fecha Desde" outlined dense class="q-mr-lg" />
            <q-input v-model="fechaHasta" type="date" label="Fecha Hasta" outlined dense class="q-mr-lg" />
        </div>
        <q-card-section>
            <q-card-section>
                <q-table :rows="rows" :columns="columns" row-key="id_Produccion" flat bordered :loading="loading"
                    no-data-label="No hay datos para mostrar" class="my-table-product shadow-1"
                    style="background-color: white; border-radius: 8px;">
                    <template v-slot:header="props">
                        <q-tr :props="props">
                            <q-th v-for="col in props.cols" :key="col.name" :props="props"
                                style="background-color: #0e1d75; color: white;">
                                {{ col.label }}
                            </q-th>
                        </q-tr>
                    </template>
                </q-table>
            </q-card-section>

        </q-card-section>

    </q-card>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import { useQuasar } from 'quasar'
import { fetchProducts } from '../../../components/Tablas/service/AddDatosAPI'
import { getProduccion, getDevolucion, getVentasMercaderia } from '../service/GestionService'

export default {
    name: 'HistorialStock',
    emits: ['volver'],
    props: {
        selectedTable: {
            type: String,
            required: true
        },
    },

    setup(props) {
        const $q = useQuasar();
        const selectedProduct = ref(null);
        const filteredProductsOptions = ref([]);
        const allProducts = ref([]);
        const loading = ref(true);
        const fechaDesde = ref(null);
        const fechaHasta = ref(null);
        const rows = ref([]);
        const columns = [
            { name: 'Fecha', label: 'Fecha', align: 'left', field: 'Fecha' },
            { name: 'Producto', label: 'Producto', align: 'left', field: 'Nombre' },
            { name: 'Codigo', label: 'Codigo', align: 'left', field: 'Codigo' },
            { name: 'Cantidad', label: 'Cantidad', align: 'left', field: 'Cantidad' },
        ];

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

        const consularTabla = () => {
            if (props.selectedTable === 'Produccion') {
                loadProduccion();
            }else if (props.selectedTable === 'Devolucion') {
                loadDevolucion();
            } else if (props.selectedTable === 'VentasMercaderia') {
                loadVentasMercaderia();
            }
        }

        const loadDevolucion = async () => {
            try {
                loading.value = true;
                const devolucionData = await getDevolucion({
                    fechaDesde: fechaDesde.value,
                    fechaHasta: fechaHasta.value,
                    idProducto: selectedProduct.value ? selectedProduct.value.value : null,
                });
                console.log("Devolución devuelta:", devolucionData);
                rows.value = devolucionData.data.map((item) => ({
                    id_Devolucion: item.id_Devolucion,
                    Fecha: item.Fecha,
                    Nombre: item.Producto.Nombre,
                    Codigo: item.Producto.Codigo,
                    Cantidad: item.Cantidad,
                }));
            } catch (error) {
                console.error("Error al cargar devolución:", error);
                $q.notify({
                    type: "negative",
                    message: "No se pudo cargar la devolución.",
                    position: "top",
                });
            } finally {
                loading.value = false;
            }
        };

        const loadProduccion = async () => {
            try {
                loading.value = true;
                const produccionData = await getProduccion({
                    fechaDesde: fechaDesde.value,
                    fechaHasta: fechaHasta.value,
                    idProducto: selectedProduct.value ? selectedProduct.value.value : null,
                });
                rows.value = produccionData.data.map((item) => ({
                    id_Produccion: item.id_Produccion,
                    Fecha: item.Fecha,
                    Nombre: item.Producto.Nombre,
                    Codigo: item.Producto.Codigo,
                    Cantidad: item.Cantidad,
                }));
            } catch (error) {
                console.error("Error al cargar producción:", error);
                $q.notify({
                    type: "negative",
                    message: "No se pudo cargar la producción.",
                    position: "top",
                });
            } finally {
                loading.value = false;
            }
        };

        const loadVentasMercaderia = async () => {
            try {
                loading.value = true;
                const ventasMData = await getVentasMercaderia({
                    fechaDesde: fechaDesde.value,
                    fechaHasta: fechaHasta.value,
                    idProducto: selectedProduct.value ? selectedProduct.value.value : null,
                });
                rows.value = ventasMData.data.map((item) => ({
                    Id_VentaMercaderia: item.Id_VentaMercaderia,
                    Fecha: item.Fecha,
                    Nombre: item.Producto.Nombre,
                    Codigo: item.Producto.Codigo,
                    Cantidad: item.Cantidad,
                }));
            } catch (error) {
                console.error("Error al cargar ventas:", error);
                $q.notify({
                    type: "negative",
                    message: "No se pudo cargar la ventas.",
                    position: "top",
                });
            } finally {
                loading.value = false;
            }
        };

        watch(selectedProduct, (newValue) => {
            if (newValue !== null) {   
                consularTabla();
            }
            else{
                selectedProduct.value = "";
            }
        });

        watch([fechaDesde, fechaHasta], () => {
            if (props.selectedTable === 'Produccion') {
                loadProduccion();
            }else if (props.selectedTable === 'Devolucion') {
                loadDevolucion();
            }else if (props.selectedTable === 'VentasMercaderia') {
                loadVentasMercaderia();
            }

        });

        onMounted(() => {
            loadProducts();
            if (props.selectedTable === 'Produccion') {
                loadProduccion();
            }else if (props.selectedTable === 'Devolucion') {
                loadDevolucion();
            }else if (props.selectedTable === 'VentasMercaderia') {
                loadVentasMercaderia();
            }
        });

        return {
            selectedProduct,
            filteredProductsOptions,
            allProducts,
            filterProducts,
            loadProducts,
            loading,
            fechaDesde,
            fechaHasta,
            columns,
            rows,
        };

    }
}
</script>
<style>
.my-table-product thead tr:first-child th {
    background-color: #46799e;
    color: white;
    font-size: 100%;
}
</style>