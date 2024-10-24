<template>
  <AdminLayout>
    <q-page class="login-page"> <!-- Clase para la página de inicio de sesión -->
      <div class="login-container"> <!-- Contenedor para centrar el login -->
        <q-card class="q-pa-md login-card" style="max-width: 600px; background-color: rgba(255, 255, 255, 0.9); margin: 0;"> <!-- Fondo blanco semi-transparente -->

          <q-card-section>
            <q-form @submit.prevent="login">
              <!-- Campo de nombre de usuario -->
              <q-input
                v-model="username"
                label="Nombre de usuario"
                type="text"
                outlined
                required
                class="q-mb-md" 
                style="min-height: 50px;" 
              />

              <!-- Campo de contraseña -->
              <q-input
                v-model="password"
                label="Contraseña"
                type="password"
                outlined
                required
                class="q-mt-md" 
                style="min-height: 50px;"
              />

              <!-- Botón para enviar el formulario -->
              <q-btn
                label="Iniciar sesión"
                color="primary"
                type="submit"
                class="q-mt-md full-width"
              />

              <!-- Mostrar un mensaje de error si ocurre -->
              <q-banner v-if="errorMessage" class="q-mt-md text-negative">
                {{ errorMessage }}
              </q-banner>
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

export default {
  components: {
    AdminLayout,
  },
  setup() {
    const username = ref(''); // Usuario ingresado por el usuario
    const password = ref(''); // Contraseña ingresada por el usuario
    const errorMessage = ref(''); // Almacenar cualquier mensaje de error

    const login = async () => {
      try {
        const data = await loginUserAPI(username.value, password.value);

        if (data.success) {
          alert('Login exitoso, se lo redirigira al sistema');
          // Redirigir al usuario al dashboard o cualquier otra página
          this.$router.push('/home');
        } else {
          errorMessage.value = 'Usuario o contraseña incorrectos';
        }
      } catch (error) {
        // Mostramos un mensaje de error si la petición falla
        errorMessage.value = 'Error al iniciar sesión. Inténtalo de nuevo.';
      }
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
  background-image: url('/src/assets/fondologin.jpg'); /* Cambia la ruta a tu imagen de fondo */
  background-size: cover; /* Cubre todo el espacio disponible */
  background-position: center; /* Centra la imagen */
  min-height: 100vh; /* Asegúrate de que ocupe toda la altura de la ventana */
  background-repeat: no-repeat; /* Evita que la imagen se repita */
  margin: 0; /* Elimina márgenes que puedan causar líneas blancas */
  padding: 0; /* Elimina padding que pueda causar espacios indeseados */
}

.login-container {
  display: flex;
  justify-content: center; /* Centra el contenido horizontalmente */
  align-items: center; /* Centra el contenido verticalmente */
  height: 100vh; /* Ocupa toda la altura de la ventana */
  width: 100%;
}

.login-card {
  width: 100%; /* Ajustar el ancho */
  max-width: 500px; /* Tamaño máximo del cuadro de login */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); /* Agregar sombra */
  border-radius: 10px; /* Borde redondeado */
}
</style>
