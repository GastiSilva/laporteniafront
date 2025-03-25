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

export const addVendedor = async ({ Nombre, Cuit }) => {
    try {
        const response = await api.post('/registerVendedor', {
            Nombre,
            Cuit
        });
        return response;
    } catch (error) {
        console.error('Error al agregar usuario:', error);
        throw error;
    }
};

export const addCliente = async ({ Nombre, Cuil }) => {
    try {
        const response = await api.post('/registerCliente', {
            Nombre,
            Cuil
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

export const deleteProveedor = async (id) => {
    try {
        const response = await api.delete('/removeProveedor', {
            data: { id_Proveedor: id } 
        });
        return response;
    } catch (error) {
        console.error(`No se pudo borrar el cliente con ${id}:`, error);
        throw error;
    }
};

export const deleteVendedor = async (id) => {
    try {
        const response = await api.delete('/removeVendedor', {
            data: { Id_Vendedor: id } 
        });
        return response;
    } catch (error) {
        console.error(`No se pudo borrar el cliente con ${id}:`, error);
        throw error;
    }
};

export const deleteCliente = async (id) => {
    try {
        const response = await api.delete('/removeCliente', {
            data: { id_Cliente: id } 
        });
        return response;
    } catch (error) {
        console.error(`No se pudo borrar el cliente con ${id}:`, error);
        throw error;
    }
};



export default {
    getTableData ,
    deleteProduccion, deleteVentas,deleteCliente, deleteProveedor, deleteVendedor,
    addUsuario, addProveedor, addVendedor, addCliente
    };