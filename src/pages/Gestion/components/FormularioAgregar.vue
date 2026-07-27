<template>
  <div>
    <q-card-section class="row items-center justify-between q-pb-none">
      <div class="text-subtitle1 text-weight-semibold">Agregar Datos</div>
      <q-btn icon="close" flat round dense @click="$emit('volver')" />
    </q-card-section>
    <q-card-section>
      <q-form @submit.prevent="handleSubmit">
        <div v-for="(group, index) in groupedColumns" :key="index" class="q-mb-md">
          <q-card v-if="group.title" flat bordered class="q-pa-md q-mb-md">
            <div class="text-subtitle1 text-bold text-secondary">{{ group.title }}</div>
            <div v-for="column in group.columns" :key="column" class="q-mb-md">
              <q-input outlined v-model="formData[column]" :label="column" />
            </div>
          </q-card>
          <div v-else>
            <div v-for="column in group.columns" :key="column" class="q-mb-md">
              <q-input outlined v-model="formData[column]" :label="column" />
            </div>
          </div>
        </div>
        <div class="row justify-center q-gutter-md">
          <q-btn label="Agregar" type="submit" color="primary" class="q-px-lg" @click="handleAgregar" />
          <q-btn label="Cancelar" flat color="grey-8" @click="$emit('volver')" />
        </div>
      </q-form>
    </q-card-section>
  </div>
</template>

<script>
import { ref, watch, computed, onMounted } from 'vue';
import { getFormsData, addUsuario, addProveedor, addVendedor, addCliente, addEgresos, addProducto } from '../service/GestionService';


export default {
  name: 'FormularioAgregar',
  props: {
    selectedTable: {
      type: String,
      required: true,
    },
  },
  emits: ['submit', 'agregar-completado', 'volver'],
  setup(props, { emit }) {
    const currentView = ref('Formulario');
    const formData = ref({});
    const columns = ref([]);
    const foreignColumns = ref({});

    const filteredColumns = computed(() => {
      return columns.value.filter(column => !column.toLowerCase().startsWith('id'));
    });

    const groupedColumns = computed(() => {
      const groups = [];
      let currentGroup = { title: null, columns: [] };

      filteredColumns.value.forEach(column => {
        const foreignKey = Object.keys(foreignColumns.value).find(key => foreignColumns.value[key].includes(column));
        if (foreignKey) {
          const title = foreignKey.replace(/^Id_/, '');
          if (currentGroup.title !== title) {
            if (currentGroup.columns.length > 0) {
              groups.push(currentGroup);
            }
            currentGroup = { title, columns: [column] };
          } else {
            currentGroup.columns.push(column);
          }
        } else {
          currentGroup.columns.push(column);
        }
      });

      if (currentGroup.columns.length > 0) {
        groups.push(currentGroup);
      }

      return groups;
    });

    watch(filteredColumns, (newColumns) => {
      formData.value = newColumns.reduce((obj, col) => {
        obj[col] = '';
        return obj;
      }, {});
    }, { immediate: true });

    const handleSubmit = () => {
      emit('submit', { ...formData.value });
    };

    const crearForms = async () => {
      try {
        const response = await getFormsData(props.selectedTable);
        const data = response.data;
        if (data) {
          columns.value = data.columns.filter(column => !column.toLowerCase().startsWith('id'));
          foreignColumns.value = data.foreignColumns || {};
          formData.value = {};

          data.columns.forEach(column => {
            if (data.foreignColumns && data.foreignColumns[column]) {
              data.foreignColumns[column].forEach((foreignCol, index) => {
                if (index !== 0) {
                  formData.value[foreignCol] = '';
                  columns.value.push(foreignCol);
                }
              });
            } else if (!column.toLowerCase().startsWith('id')) {
              formData.value[column] = '';
            }
          });
        }
      } catch (error) {
        console.error('Error al obtener datos de la tabla:', error);
        alert('Error al obtener datos de la tabla');
      }
    };

    const handleAgregar = async () => {
      try {
        if (props.selectedTable === 'Usuarios') {
          await addUsuario(formData.value);
        } else if (props.selectedTable === 'Proveedor') {
          await addProveedor(formData.value);
        } else if (props.selectedTable === 'Vendedores') {
          await addVendedor(formData.value);
        } else if (props.selectedTable === 'Clientes') {
          await addCliente(formData.value);
        }else if( props.selectedTable === 'Egresos') {
          await addEgresos(formData.value);
        }else if(props.selectedTable === 'Productos') {
          await addProducto(formData.value);
        } 
        emit('agregar-completado');
      } catch (error) {
        console.error('Error al agregar:', error);
        alert('Error al agregar');
      }
    };

    onMounted(() => {
      crearForms();
    });

    return {
      currentView,
      formData,
      filteredColumns,
      groupedColumns,
      handleSubmit,
      handleAgregar,
      crearForms,
    };
  },
};
</script>
