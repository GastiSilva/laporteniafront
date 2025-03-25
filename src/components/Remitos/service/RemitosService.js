import { api } from 'boot/axios';


export const crearRemito = async (remitoData) => {
    try {
      const response = await api.post(`/altaRemitos`, remitoData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  };

export const obtenerEstados = async () => {
  try {
    const response = await api.get(`/estadosTodos`);
    return response.data;
    
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
}

export const obtenerRemitos = async () => {
  try {
    const response = await api.get(`/obtenerRemitos`);
    return response.data;
    
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
}

export const obtenerPDFRemitos = async (id) => {
  try {
    console.log("envio ", id);

    // Realizamos la solicitud, indicando que esperamos un archivo Blob (PDF)
    const response = await api.post('/obtenerRemitoPDF', { Id_Remito: id.Id_Remito }, {
      responseType: 'blob', // Asegúrate de que la respuesta sea un Blob
    });

    // Crear un Blob del PDF que recibimos en la respuesta
    const blob = new Blob([response.data], { type: 'application/pdf' });

    // Crear un enlace para descargar el archivo
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'remito_fabrica.pdf'; // Nombre del archivo descargado
    link.click(); // Iniciar la descarga

    return response; // Si necesitas hacer algo más con la respuesta

  } catch (error) {
    console.error("Error al obtener el PDF:", error);
    throw error.response ? error.response.data : error;
  }
};


