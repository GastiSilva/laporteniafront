import { api } from 'boot/axios';

export const RemitoPDF = async () => {
  try {
    const response = await api.post('/generarRemito', null, { // Usa `null` si no hay datos en el cuerpo
      responseType: 'blob', // Mover esto aquí
    });

    // Crear una URL para el archivo PDF
    const url = window.URL.createObjectURL(new Blob([response.data]));

    // Crear un enlace y descargar el PDF
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'remito_fabrica.pdf'); // Nombre del archivo
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error al descargar el PDF:', error);
    throw error; // Re-lanzar el error para manejarlo en el componente
  }
};

