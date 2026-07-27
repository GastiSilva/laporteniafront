import { api } from 'boot/axios';
import { downloadBlob, MIME_PDF } from 'src/composables/useFileDownload';

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

export const obtenerRemitos = async (fechaDesde, fechaHasta) => {
  try {
    const params = {};

    if (fechaDesde) params.fechaDesde = fechaDesde;
    if (fechaHasta) params.fechaHasta = fechaHasta;

    const response = await api.get('/obtenerRemitos', { params });

    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};


// Descarga el PDF ya generado y guardado en la base (columna remitoPDF).
export const obtenerPDFRemitos = async (idRemito) => {
  try {
    const response = await api.post('/obtenerRemitoPDF', { Id_Remito: idRemito }, {
      responseType: 'blob',
    });

    downloadBlob(response.data, 'remito_fabrica.pdf', MIME_PDF);
    return response;
  } catch (error) {
    console.error("Error al obtener el PDF:", error);
    throw error.response ? error.response.data : error;
  }
};

// Genera el PDF del remito en el backend y lo descarga. Se usa al dar de alta
// un remito nuevo, cuando todavia no hay PDF guardado que traer.
export const generarPDFRemito = async (id) => {
  if (!id) {
    console.error('ID no definido al generar PDF.');
    return;
  }

  try {
    const response = await api.get(`/generarRemito/${id}`, {
      responseType: 'blob',
    });

    downloadBlob(response.data, 'remito_fabrica.pdf', MIME_PDF);
  } catch (error) {
    console.error('Error al descargar el PDF:', error);
    throw error;
  }
};

export const eliminarRemito = async (id) => {
  try {
    const response = await api.delete(`/EliminarRemito/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

