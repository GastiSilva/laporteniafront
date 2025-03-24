<template>
  <div class="form-container">
    <form @submit.prevent="handleSubmit" class="form-card">
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
import { ref, watch, computed } from 'vue';
import { addUsuario, addProveedor } from '../service/GestionService';

export default {
  props: {
    selectedTable: {
      type: String,
      required: true,
    },
    columns: {
      type: Array,
      required: true,
    },
  },
  emits: ['submit'],
  setup(props, { emit }) {
    //Inicializacion del forms
    const formData = ref({});
    const filteredColumns = computed(() => {
      return props.columns.filter(column => !column.toLowerCase().startsWith('id'));
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

    const handleAgregar = () => {
            if (props.selectedTable === 'Usuarios') {
                agregarUsuario(formData.value);
            }else if(props.selectedTable === 'Proveedor') {
                agregarProveedor(formData.value);
            }
        };

    //completado de los distonos fornms
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
        alert('Usuario agregado correctamente');
      } catch (error) {
        console.error('Error al agregar usuario:', error);
        alert('Error al agregar usuario');
      }
    };


    return {
      formData,
      filteredColumns,
      handleSubmit,
      handleAgregar,
      agregarUsuario,
      agregarProveedor
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
  max-width: 400px;
}

.form-title {
  margin-bottom: 15px;
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
}

.form-group {
  margin-bottom: 15px;
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
}

.form-button:hover {
  background-color: #1a2f98;
}
</style>