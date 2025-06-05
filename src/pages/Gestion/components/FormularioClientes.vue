<template>
    <q-card class="q-pa-lg q-mx-auto shadow-2" style="max-width: 900px; border-radius: 12px;">
        <q-btn label="Volver" flat rounded style="background-color: #0e1d75; color: white;" @click="$emit('volver')" />
        <q-card-section>
            <div class="text-h5 text-center" style="color: #0e1d75;">Agregar Clientes</div>
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
    </q-card>
</template>

<script>
import { ref } from 'vue';
import { useQuasar } from "quasar";
import { addCliente } from '../service/GestionService'

export default {
    name: 'FormularioClientes',
    emits: ['volver'],
    setup() {
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