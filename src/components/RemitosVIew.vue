<template>
  <div>
    <canvas ref="canvas" :width="canvasWidth" :height="canvasHeight"></canvas>
    <button @click="saveData">Guardar Datos</button>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
  setup() {
    const canvas = ref(null);
    const canvasWidth = 800; // Ancho del canvas
    const canvasHeight = 600; // Alto del canvas

    onMounted(() => {
      const ctx = canvas.value.getContext('2d');
      const image = new Image();
      image.src = require('../assets/Remitosfabrica.png'); // Asegúrate de que la ruta sea correcta

      image.onload = () => {
        ctx.drawImage(image, 0, 0, canvasWidth, canvasHeight);
        // Puedes agregar texto o campos aquí si lo deseas
      };
    });

    const saveData = () => {
      // Aquí puedes implementar la lógica para guardar los datos ingresados
      // Por ejemplo, podrías convertir el canvas a una imagen y enviarlo a un servidor
      const dataURL = canvas.value.toDataURL();
      console.log(dataURL); // Esto contiene la imagen en formato Base64
      // Puedes enviar `dataURL` a tu backend para registrar los datos
    };

    return {
      canvas,
      canvasWidth,
      canvasHeight,
      saveData,
    };
  },
};
</script>

<style scoped>
canvas {
  border: 1px solid #ccc; /* Opcional: agrega un borde al canvas */
}
</style>
