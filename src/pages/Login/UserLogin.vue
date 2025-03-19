<template>
  <AdminLayout>
    <q-page class="login-page"> 
      <div class="login-container"> 
        <q-card class="q-pa-md login-card"
          style="max-width: 600px; background-color: rgba(255, 255, 255, 0.9); margin: 0;">
          <q-card-section>
            <q-form @submit.prevent="login">
              <!-- Campo de nombre de usuario -->
              <q-input v-model="username" label="Nombre de usuario" type="text" outlined required class="q-mb-md"
                style="min-height: 50px;" />

              <!-- Campo de contraseña -->
              <q-input v-model="password" label="Contraseña" type="password" outlined required class="q-mt-md"
                style="min-height: 50px;" />

              <!-- Botón para enviar el formulario -->
              <q-btn label="Iniciar sesión" :style="{ backgroundColor: '#292678', color: 'white' }" type="submit"
                class="q-mt-md full-width" />

              <div v-if="errorMessage" class="error-message">
                {{ errorMessage }}
              </div>

            </q-form>

          </q-card-section>
        </q-card>
      </div>
    </q-page>
  </AdminLayout>
</template>

<script>
import { ref } from 'vue';
import { loginUserAPI } from 'src/pages/Login/service/LoginAPI';
import AdminLayout from 'src/layouts/AdminLayout.vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';

export default {
  components: {
    AdminLayout,
  },
  setup() {
    const $q = useQuasar();
    const username = ref('');
    const password = ref('');
    const errorMessage = ref('');
    const { push } = useRouter();

    const login = () => {
      loginUserAPI(username.value, password.value)
        .then((success) => {
          if (success) {
            alert('Login exitoso, se lo redirigirá al sistema');
            push('/adminHome'); 
          } else {
            errorMessage.value = 'Usuario o contraseña incorrectos';
          }
          console.log("usuario", username.value);
          console.log("contraseña", password.value);
          
          
        })
        .catch((error) => {
          errorMessage.value = 'Usuario o contraseña incorrectos';
        });
    };

    return {
      username,
      password,
      errorMessage,
      login,
    };
  },
};

</script>

<style scoped>
.login-page {
  background-image: url('/src/assets/fondologin.jpg');
  background-size: cover;
  background-position: center;
  min-height: 100vh;
  background-repeat: no-repeat;
  margin: 0;
  padding: 0;
}

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
}

.login-card {
  width: 100%;
  max-width: 500px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}

.q-mt-md full-width {
  background-color: #292678;
}

.error-message {
  color: red; /* Estilo para resaltar el mensaje de error */
  margin-top: 10px; /* Espaciado */
}
</style>
