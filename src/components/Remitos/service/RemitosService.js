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
    const response = await api.get(`/estados`);
    return response.data;
    
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
}

