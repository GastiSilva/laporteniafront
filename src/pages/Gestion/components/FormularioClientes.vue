<template>
    <div>
        <q-card-section class="row items-center justify-between q-pb-none">
            <div class="text-subtitle1 text-weight-semibold">Agregar Cliente</div>
            <q-btn icon="close" flat round dense @click="$emit('volver')" />
        </q-card-section>
        <q-card-section>
            <q-form @submit.prevent="guardarCliente">
                <div class="text-subtitle1 text-bold text-secondary q-mb-md">Datos del Cliente</div>

                
                <q-input v-model="clientes.Nombre" label="Nombre" type="text"
                    outlined class="q-mb-md" dense />

                <q-input v-model="clientes.Cuil" label="Cuil" type="number"
                    outlined class="q-mb-md" dense />

                <div class="row justify-center q-gutter-m q-mt-md">
                    <q-btn label="Guardar" type="submit" color="primary" class="q-px-lg" />
                    <q-btn label="Cancelar" flat color="negative" @click="limpiarFormulario" />
                </div>
            </q-form>
        </q-card-section>
    </div>
</template>

<script>
import { ref } from 'vue';
import { useQuasar } from "quasar";
import { addCliente } from '../service/GestionService'

export default {
    name: 'FormularioClientes',
    emits: ['volver', 'agregar-completado'],
    setup(props, { emit }) {
        const $q = useQuasar();
        const clientes = ref({
            Nombre: "",
            Cuil: ""
        });
        const errorIntento = ref(false);

        const guardarCliente = () => {
            if (!clientes.value.Nombre || !clientes.value.Cuil) {
                errorIntento.value = true;
                return;
            }
            errorIntento.value = false;

            addCliente(clientes.value)
                .then(() => {
                    $q.notify({
                        type: 'positive',
                        message: 'Cliente agregado correctamente',
                        position: 'top'
                    });
                    limpiarFormulario();
                    emit('agregar-completado');
                })
                .catch((error) => {
                    console.error('Error al agregar cliente:', error);
                    $q.notify({
                        type: 'negative',
                        message: 'Error al agregar cliente',
                        position: 'top'
                    });
                });
        };

        const limpiarFormulario = () => {
            clientes.value.Nombre = null;
            clientes.value.Cuil = null;
        };

        return {
            clientes,
            guardarCliente,
            limpiarFormulario,
            errorIntento
        };
    }
};
</script>