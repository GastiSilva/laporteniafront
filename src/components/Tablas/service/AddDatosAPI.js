import { api } from 'boot/axios';

export const guardarEnProduccion = async (productos) => {
    if (!Array.isArray(productos) || productos.length === 0) {
        throw new Error("No hay productos para enviar.");
    }
    try {
        const response = await api.post('/SaveInProduccion', { productos });
        return response.data;
    } catch (error) {
        console.error("Error al enviar datos a Producción:", error);
        throw new Error("Error al guardar los datos en Producción.");
    }
};

export const fetchProducts = async () => {
    try {
        const response = await api.post('/FetchProducts');        
        return response.data;
    } catch (error) {
        console.error("Error al cargar productos:", error);
        alert("No se pudo cargar la lista de productos.");
    }
};

export const guardarEnDevolucion = async (productos) => {
    if (!Array.isArray(productos) || productos.length === 0) {
        throw new Error("No hay productos para enviar.");
    }
    try {   
        const response = await api.post('/guardarEnDevolucion', { productos });
        return response.data;
    } catch (error) {
        console.error("Error al enviar datos Devolución:", error);
        throw new Error("Error al guardar los datos en Devolución.");
    }
};

export const guardarEnVentas = async (productos) => {
    if (!Array.isArray(productos) || productos.length === 0) {
        throw new Error("No hay productos para enviar.");
    }
    try {   
        const response = await api.post('/guardarVentaMercaderia', { productos });
        return response.data;
    } catch (error) {
        console.error("Error al enviar datos Devolución:", error);
        throw new Error("Error al guardar los datos en Devolución.");
    }
};

export default {
    fetchProducts,
    guardarEnProduccion,
    guardarEnDevolucion,
    guardarEnVentas
};