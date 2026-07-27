
import { api } from 'boot/axios';

export const loginUserAPI = async (Usuario, Contrasenia) => {
  try {
    const response = await api.post('/login', {
      Usuario,
      Contrasenia,
    });
    return response.data; 
  } catch (error) {
    throw error;
  }
};

