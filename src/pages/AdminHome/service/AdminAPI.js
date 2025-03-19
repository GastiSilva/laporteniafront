import { api } from 'boot/axios';

export const RemitoPDFAPI = async (id) => {
  if (!id) {
    console.error('ID no definido al generar PDF.');
    return;
  }
  try {
    console.log(`Llamando a la API con ID: ${id}`); 
    const response = await api.get(`/generarRemito/${id}`,  { 
      responseType: 'blob', 
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

