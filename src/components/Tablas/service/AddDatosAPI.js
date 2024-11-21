import { api } from 'boot/axios';

export const SaveProduccion = async (productos) => {
    if (!Array.isArray(productos) || productos.length === 0) {
        throw new Error("No hay productos para enviar.");
    }

    try {
        const response = await api.post("/SaveInProduccion", { productos });
        return response.data;
    } catch (error) {
        console.error("Error al enviar datos a Producción:", error);
        throw new Error("Error al guardar los datos en Producción.");
    }
};