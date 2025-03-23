import { api } from 'boot/axios';

export const getTableData = async (tableName) => {
    try {
        const response = await api.get(`/datosTablas/${tableName}`);
        return response;
    } catch (error) {
        console.error(`Error fetching data from table ${tableName}:`, error);
        throw error;
    }
};

export const deleteProduccion = async (id, cantidad) => {
    try {
        const response = await api.delete(`/EliminarDeProduccion/${id}/${cantidad}`);
        return response;
    } catch (error) {
        console.error(`No se pudo borrar el producto con  ${id}:`, error);
        throw error;
    }
}

export const deleteVentas = async (id, cantidad) => {
    try {
        const response = await api.delete(`/eliminarDeVentaMercaderia/${id}/${cantidad}`);
        return response;
    } catch (error) {
        console.error(`No se pudo borrar el producto con  ${id}:`, error);
        throw error;
    }
}


export default {getTableData , deleteProduccion, deleteVentas};