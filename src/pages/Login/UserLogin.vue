<template>
  <AdminLayout>
    <q-page class="login-page flex flex-center q-pa-md">
      <q-card class="w-full max-w-[420px] rounded-2xl shadow-xl bg-white/95 backdrop-blur-sm">
        <q-card-section class="px-6 pt-8 pb-2 text-center">
          <h1 class="text-2xl font-bold text-brand-primary m-0">Iniciar sesión</h1>
          <p class="text-sm text-gray-500 mt-2 mb-0">Accedé al panel de administración</p>
        </q-card-section>

        <q-card-section class="px-6 pb-8">
          <q-form class="flex flex-col gap-4" @submit.prevent="login">
            <q-input
              v-model="username"
              label="Nombre de usuario"
              type="text"
              outlined
              required
              autofocus
            />

            <q-input
              v-model="password"
              label="Contraseña"
              :type="showPassword ? 'text' : 'password'"
              outlined
              required
            >
              <template v-slot:append>
                <q-icon
                  :name="showPassword ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="togglePasswordVisibility"
                />
              </template>
            </q-input>

            <q-btn
              label="Iniciar sesión"
              type="submit"
              :loading="loading"
              class="w-full text-white"
              :style="{ backgroundColor: 'var(--color-brand-primary)' }"
              unelevated
              no-caps
            />

            <div v-if="errorMessage" class="text-sm text-red-600 text-center">
              {{ errorMessage }}
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-page>
  </AdminLayout>
</template>

<script>
import { ref } from 'vue';
import { loginUserAPI } from 'src/pages/Login/service/LoginService';
import AdminLayout from 'src/layouts/AdminLayout.vue';
import { useAuthStore } from 'src/stores/auth';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';

export default {
  components: {
    AdminLayout,
  },
  setup() {
    const $q = useQuasar();
    const auth = useAuthStore();
    const username = ref('');
    const password = ref('');
    const errorMessage = ref('');
    const loading = ref(false);
    const showPassword = ref(false);
    const { push } = useRouter();

    const login = async () => {
      loading.value = true;
      errorMessage.value = '';

      try {
        const result = await loginUserAPI(username.value, password.value);

        if (result?.token) {
          auth.login({ token: result.token, usuario: result.usuario });
          $q.notify({
            type: 'positive',
            message: 'Bienvenido al sistema.',
            position: 'top',
          });
          push('/adminHome');
        } else {
          errorMessage.value = 'Usuario o contraseña incorrectos';
        }
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error('Login error:', error);
        }
        errorMessage.value = error.response?.data?.message || 'Usuario o contraseña incorrectos';
      } finally {
        loading.value = false;
      }
    };

    const togglePasswordVisibility = () => {
      showPassword.value = !showPassword.value;
    };

    return {
      username,
      password,
      errorMessage,
      loading,
      showPassword,
      togglePasswordVisibility,
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
}
</style>
