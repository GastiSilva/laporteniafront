<template>
    <div>
        <q-card-section class="row items-center justify-between q-pb-none">
            <div class="text-subtitle1 text-weight-semibold">Agregar Egreso</div>
            <q-btn icon="close" flat round dense @click="$emit('volver')" />
        </q-card-section>
        <q-card-section>
            <q-form @submit.prevent="guardarEgreso">
                <!-- 🧾 Datos del Egreso -->
                <div class="text-subtitle1 text-bold text-secondary q-mb-md">Datos del Egreso</div>

                <q-input outlined v-model="egreso.Fecha" label="Fecha" type="date" class="q-mb-md" />
                <q-input outlined v-model="egreso.Concepto" label="Concepto" class="q-mb-md" />
                <q-input outlined v-model="egreso.Comprobante" label="Comprobante" class="q-mb-md" />
                <q-input outlined v-model.number="egreso.ImporteTotal" label="Importe Total" type="number" class="q-mb-md" prefix="$" />

                <!-- Botones -->
                <div class="row justify-center q-gutter-md">
                    <q-btn label="Guardar" type="submit" color="primary" class="q-px-lg" />
                    <q-btn label="Cancelar" flat color="negative" @click="limpiarFormulario" />
                </div>
            </q-form>
        </q-card-section>
    </div>
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