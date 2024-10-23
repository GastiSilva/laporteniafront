import { createApp } from 'vue'; 
import App from './App.vue'; 
import router from './router'; 

const app = createApp(App); // Crea la aplicación con Vue 3

app.use(router); // Usa el router en la aplicación

app.mount('#app'); // Monta la aplicación en el elemento con id "app"
