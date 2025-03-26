<template>
  <div class="form-container">
    <form @submit.prevent="handleSubmit" :class="['form-card', filteredColumns.length > 4 ? 'two-column' : '']">
      <h2 class="form-title">Agregar Datos</h2>
      <div v-for="column in filteredColumns" :key="column" class="form-group">
        <label :for="column" class="form-label">{{ column }}</label>
        <input :id="column" v-model="formData[column]" class="form-input" required />
      </div>
      <button type="submit" class="form-button" @click="handleAgregar">Agregar</button>
    </form>
  </div>
</template>

<script>
import { ref, watch, computed, onMounted } from 'vue';
import { getFormsData, addUsuario, addProveedor, addVendedor, addCliente } from '../service/GestionService';

export default {
  props: {
    selectedTable: {
      type: String,
      required: true,
    },
    // columns: {
    //   type: Array,
    //   required: true,
    // },
  },
  emits: ['submit','agregar-completado' ],
  setup(props, { emit }) {
    //Inicializacion del forms
    const formData = ref({});
    const columns = ref([]);
    const rows = ref([]);

    // const filteredColumns = computed(() => {
    //   return columns.value.filter(column => !column.toLowerCase().startsWith('id'));
    // });

    // watch(filteredColumns, (newColumns) => {
    //   formData.value = newColumns.reduce((obj, col) => {
    //   obj[col] = '';
    //   return obj;
    //   }, {});
    // }, { immediate: true });

    const filteredColumns = computed(() => {
      return columns.value.filter(column => !column.toLowerCase().startsWith('id'));
    });

    watch(filteredColumns, (newColumns) => {
      formData.value = newColumns.reduce((obj, col) => {
        obj[col] = '';
        return obj;
      }, {});
    }, { immediate: true });

    watch(rows, (newRows) => {
      if (newRows.length > 0) {
        formData.value = { ...newRows[0] };
      }
    }, { immediate: true });


    const handleSubmit = () => {
      emit('submit', { ...formData.value });
    };

    const crearForms = async () => {
      try {
        const response = await getFormsData(props.selectedTable);
        const data = response.data;
        console.log('Data:', data);
             if (data) {
          columns.value = data.columns.filter(column => !column.toLowerCase().startsWith('id'));
          formData.value = {};

          data.columns.forEach(column => {
            if (data.foreignColumns && data.foreignColumns[column]) {
              data.foreignColumns[column].forEach((foreignCol, index) => {
                if (index !== 0) { // Excluye el ID
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



    const handleAgregar = () => {
      try{  
        if (props.selectedTable === 'Usuarios') {
            agregarUsuario(formData.value);
        }else if(props.selectedTable === 'Proveedor') {
            agregarProveedor(formData.value);
        }else if(props.selectedTable === 'Vendedores') {
            agregarVendedor(formData.value);
        }else if(props.selectedTable === 'Clientes') {
            agregarCliente(formData.value);
        }
        emit('agregar-completado');
      }catch (error) {
        console.error('Error al agregar:', error);
        alert('Error al agregar');
      }
    };

    //completado de los distintnos fornms
    const agregarUsuario = async (formData) => {
      console.log('formData:', formData);
      try {
        await addUsuario(formData);
        alert('Usuario agregado correctamente');
      } catch (error) {
        console.error('Error al agregar usuario:', error);
        alert('Error al agregar usuario');
      }
    };

    const agregarProveedor = async (formData) => {
      console.log('formData:', formData);
      try {
        await addProveedor(formData);
        alert('Proveedor agregado correctamente');
      } catch (error) {
        console.error('Error al agregar usuario:', error);
        alert('Error al agregar usuario');
      }
    };

    const agregarCliente = async (formData) => {
      console.log('formData:', formData);
      try {
        await addCliente(formData);
        alert('Cliente agregado correctamente');
      } catch (error) {
        console.error('Error al agregar usuario:', error);
        alert('Error al agregar usuario');
      }
    };

    const agregarVendedor = async (formData) => {
      console.log('formData:', formData);
      try {
        await addVendedor(formData);
        alert('Vendedor agregado correctamente');
      } catch (error) {
        console.error('Error al agregar usuario:', error);
        alert('Error al agregar usuario');
      }
    };

    onMounted(() => {
      crearForms();
    });

    return {
      formData,
      filteredColumns,
      handleSubmit,
      handleAgregar,
      crearForms,
      agregarUsuario,
      agregarProveedor,
      agregarCliente
    };
  },
};
</script>



<style scoped>
.form-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.form-card {
  background-color: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 15px;
}

.two-column {
  grid-template-columns: repeat(2, 1fr);
}

.form-title {
  grid-column: span 2;
  margin-bottom: 15px;
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  margin-bottom: 5px;
  font-weight: 600;
}

.form-input {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
}

.form-input:focus {
  border-color: #0e1d75;
  outline: none;
  box-shadow: 0 0 4px rgba(14, 29, 117, 0.3);
}

.form-button {
  padding: 10px;
  background-color: #0e1d75;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.2rem;
  cursor: pointer;
  width: 100%;
  grid-column: span 2;
}

.form-button:hover {
  background-color: #1a2f98;
}
</style>