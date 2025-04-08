<template>
    <q-card class="q-pa-lg q-mx-auto shadow-2" style="max-width: 900px; border-radius: 12px;">
        <q-btn label="Volver" flat rounded style="background-color: #0e1d75; color: white;" @click="$emit('volver')" />
        <q-card-section>
            <div class="text-h5 text-center" style="color: #0e1d75;">Agregar Egreso</div>
        </q-card-section>
        <q-card-section>
            <q-form @submit.prevent="guardarEgreso">
                <!-- 🧾 Datos del Egreso -->
                <div class="text-subtitle1 text-bold text-secondary q-mb-md">Datos del Egreso</div>

                <q-input outlined v-model="egreso.Fecha" label="Fecha" type="date" class="q-mb-md" />
                <q-input outlined v-model="egreso.Concepto" label="Concepto" class="q-mb-md" />
                <q-input outlined v-model="egreso.Comprobante" label="Comprobante" class="q-mb-md" />
                <q-input outlined v-model.number="egreso.ImporteTotal" label="Importe Total" type="number" class="q-mb-md" />

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
import { ref } from "vue";
import { useQuasar } from "quasar";
import {addEgresos } from '../service/GestionService';

export default {
    name: "FormularioEgresos",
    setup() {
        const $q = useQuasar();

        const egreso = ref({
            Fecha: "",
            Concepto: "",
            Comprobante: "",
            ImporteTotal: null,
        });

        const guardarEgreso = async () => {
            try {
                const response = await addEgresos(egreso.value);
                $q.notify({ type: "positive", message: response.data.message });
                limpiarFormulario();
            } catch (error) {
                $q.notify({ type: "negative", message: error.response?.data?.message || "Error al guardar el egreso." });
            }
        };

        const limpiarFormulario = () => {
            egreso.value = {
                Fecha: "",
                Concepto: "",
                Comprobante: "",
                ImporteTotal: null,
            };
        };

        return {
            egreso,
            guardarEgreso,
            limpiarFormulario,
        };
    },
};
</script>

<style scoped>
.text-secondary {
    color: #0e1d75;
}
</style>