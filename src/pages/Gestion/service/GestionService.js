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

//METODOS AGREGAR
export const addUsuario = async ({ Usuario, Contrasenia, Mail }) => {
    try {
        const response = await api.post('/register', {
            Usuario,
            Contrasenia,
            Mail
        });
        return response;
    } catch (error) {
        console.error('Error al agregar usuario:', error);
        throw error;
    }
};

export const addProveedor = async ({ Nombre, Cuit }) => {
    try {
        const response = await api.post('/registerProveedor', {
            Nombre,
            Cuit
        });
        return response;
    } catch (error) {
        console.error('Error al agregar usuario:', error);
        throw error;
    }
};




//METODOS ELIMINAR 
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


export default {getTableData , deleteProduccion, deleteVentas, addUsuario, addProveedor};