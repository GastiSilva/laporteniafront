<template>
  <div>
    <h1>Generar PDF con Imagen de Fondo</h1>
    <input v-model="invoiceData.client" placeholder="Señor(es)" />
    <input v-model="invoiceData.address" placeholder="Domicilio" />
    <input v-model="invoiceData.invoiceNumber" placeholder="N°" />
    <input v-model="invoiceData.date.day" placeholder="Día" />
    <input v-model="invoiceData.date.month" placeholder="Mes" />
    <input v-model="invoiceData.date.year" placeholder="Año" />
    <button @click="generatePDF">Generar PDF</button>
  </div>
</template>

<script>
import { PDFDocument, rgb } from 'pdf-lib';
import imageUrl from '../assets/remitofabrica.png'; // Ruta a tu imagen

export default {
  data() {
    return {
      invoiceData: {
        client: '',
        address: '',
        invoiceNumber: '',
        date: { day: '', month: '', year: '' },
      },
    };
  },
  methods: {
    async generatePDF() {
      // Crear un nuevo documento PDF
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([600, 400]);

      // Cargar la imagen
      const imageBytes = await fetch(imageUrl).then(res => res.arrayBuffer());
      const pdfImage = await pdfDoc.embedPng(imageBytes); // O embedJpg si es JPG

      // Obtener dimensiones de la imagen
      const { width, height } = pdfImage.scale(1); // Escala al tamaño original

      // Dibujar la imagen en el PDF
      page.drawImage(pdfImage, {
        x: 0,
        y: page.getHeight() - height, // Ajusta la posición
        width,
        height,
      });

      // Establecer el color y la fuente
      const fontSize = 12;
      const color = rgb(0, 0, 0); // Negro

      // Dibujar texto en el PDF
      page.drawText(`Señor(es): ${this.invoiceData.client}`, { x: 50, y: 350, size: fontSize, color });
      page.drawText(`Domicilio: ${this.invoiceData.address}`, { x: 50, y: 320, size: fontSize, color });
      page.drawText(`N°: ${this.invoiceData.invoiceNumber}`, { x: 450, y: 350, size: fontSize, color });
      page.drawText(`Día: ${this.invoiceData.date.day}`, { x: 450, y: 320, size: fontSize, color });
      page.drawText(`Mes: ${this.invoiceData.date.month}`, { x: 500, y: 320, size: fontSize, color });
      page.drawText(`Año: ${this.invoiceData.date.year}`, { x: 550, y: 320, size: fontSize, color });

      // Serializar el PDF a un Uint8Array
      const pdfBytes = await pdfDoc.save();

      // Crear un enlace para descargar el PDF
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'factura.pdf';
      a.click();
      URL.revokeObjectURL(url); // Liberar el objeto URL
    },
  },
};
</script>

<style scoped>
/* Estilos opcionales */
</style>
