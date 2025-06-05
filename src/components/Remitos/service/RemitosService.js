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


export const obtenerPDFRemitos = async (id) => {
  try {
      const response = await api.post('/obtenerRemitoPDF', { Id_Remito: id.Id_Remito }, {
      responseType: 'blob', 
    });

    const blob = new Blob([response.data], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'remito_fabrica.pdf'; 
    link.click(); 
    return response;

  } catch (error) {
    console.error("Error al obtener el PDF:", error);
    throw error.response ? error.response.data : error;
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

