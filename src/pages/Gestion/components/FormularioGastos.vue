<template>
    <q-card class="q-pa-lg q-mx-auto shadow-2" style="max-width: 900px; border-radius: 12px;">
        <q-btn label="Volver" flat rounded style="background-color: #0e1d75; color: white;" @click="$emit('volver')" />
        <q-card-section>
            <div class="text-h5 text-center" style="color: #0e1d75;">Agregar Gasto</div>
        </q-card-section>

        <q-card-section>
            <q-form @submit.prevent="guardarGasto">
                <!-- 🧾 Datos del Gasto -->
                <div class="text-subtitle1 text-bold text-secondary q-mb-md">Datos del Gasto</div>

                <q-input outlined v-model="gasto.descripcion" label="Descripción" class="q-mb-md" />
                <q-input outlined v-model.number="gasto.Importe" label="Importe" type="number" class="q-mb-md" prefix="$" />

                <q-select outlined v-model="gasto.Id_TipoGastos" :options="tiposGasto" option-value="Id_TipoGastos"
                    option-label="Tipo_Gasto" label="Tipo de Gasto" class="q-mb-md"  />

                <q-select outlined v-model="gasto.Id_Egresos" :options="egresos" option-value="Id_Egresos"
                    option-label="Concepto" label="Egreso Asociado" class="q-mb-md" />

                <!-- Botones -->
                <div class="row justify-center q-gutter-md">
                    <q-btn label="Guardar" type="submit" color="primary" class="q-px-lg" />
                    <q-btn label="Cancelar" flat color="negative" @click="limpiarFormulario" />
                </div>
            </q-form>
        </q-card-section>
    </q-card>
</template>

<script>
import { ref, onMounted } from "vue";
import { useQuasar } from "quasar";
import { addGastos, getEgresos, getTipoGastos } from "../service/GestionService";

export default {
    name: "FormularioGastos",
    setup() {
        const $q = useQuasar();

        const gasto = ref({
            descripcion: "",
            Importe: null,
            Id_TipoGastos: null,
            Id_Egresos: null,
        });

        const tiposGasto = ref([]);
        const egresos = ref([]);

        const cargarDatos = async () => {
            try {
                const [resTipos, resEgresos] = await Promise.all([
                    getTipoGastos(),
                    getEgresos()
                ]);
                tiposGasto.value = resTipos.data;
                egresos.value = resEgresos.data;
            } catch (error) {
                $q.notify({ type: "negative", message: "Error al cargar opciones." });
            }
        };

        const guardarGasto = async () => {
            try {
                const payload = {
                    descripcion: gasto.value.descripcion,
                    Importe: gasto.value.Importe,
                    Id_TipoGastos: gasto.value.Id_TipoGastos?.Id_TipoGastos, 
                    Id_Egresos: gasto.value.Id_Egresos?.Id_Egresos 
                };


                const response = await addGastos(payload);
                $q.notify({ type: "positive", message: "Gasto guardado correctamente" });
                limpiarFormulario();
            } catch (error) {
                $q.notify({ type: "negative", message: error.response?.data?.error || "Error al guardar el gasto." });
            }
        };

        const limpiarFormulario = () => {
            gasto.value = {
                descripcion: "",
                Importe: null,
                Id_TipoGastos: null,
                Id_Egresos: null,
            };
        };

        onMounted(() => {
            cargarDatos();
        });

        return {
            gasto,
            tiposGasto,
            egresos,
            guardarGasto,
            limpiarFormulario
        };
    }
};
</script>

<style scoped>
.text-secondary {
    color: #0e1d75;
}
</style>