import { api } from 'boot/axios';

export const getTableData = async (tableName, fechaDesde = null, fechaHasta = null) => {
    try {
        const params = {};
        if (fechaDesde && fechaHasta) {
            params.fechaDesde = fechaDesde;
            params.fechaHasta = fechaHasta;
        }

        const response = await api.get(`/datosTablas/${tableName}`, { params });
        return response;
    } catch (error) {
        console.error(`Error fetching data from table ${tableName}:`, error);
        throw error;
    }
};

export const getFormsData = async (tableName) => {
    try {
        const response = await api.get(`/datosTablasForms/${tableName}`);
        return response;
    } catch (error) {
        console.error(`Error fetching data from table ${tableName}:`, error);
        throw error;
    }
};

export const getCompraFormData = async () =>{
    try {
        const response = await api.get('/compras');
        return response;
    } catch (error) {
        console.error(`Error fetching data from table Compra:`, error);
        throw error;
    }
}

export const getClientes = async () => {
    try {
        const response = await api.get('/clientes');
        return response.data;
    } catch (error) {
        console.error('Error fetching clientes:', error);
        throw error;
    }
}

export const getProveedores = async () => {
    try {
        const response = await api.get('/proveedores');
        return response.data;
    } catch (error) {
        console.error('Error fetching proveedores:', error);
        throw error;
    }
}

export const getEgresos = async () => {
    try {
        const response = await api.get('/egresos');
        return response.data;
    } catch (error) {
        console.error('Error fetching egresos:', error);
        throw error;
    }
}

export const getTipoGastos = async () => {
    try {
        const response = await api.get('/tipogastos');
        return response;
    } catch (error) {
        console.error('Error fetching tipo gastos:', error);
        throw error;
    }
}

export const getStock = async () => {
    try {
        const response = await api.get('/Obtenerstock');
        return response;
    } catch (error) {
        console.error('Error al traer stock:', error);
        throw error;
    }
}
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

export const addCompra = async ({ compra, materiasPrimas, estadoId }) => {
    console.log('materiaPrimas', materiasPrimas)
    try {
      const response = await api.post('/GuardarCompra', {
        compra,
        materiasPrimas,
        estadoId
      })
      return response.data
    } catch (error) {
      console.error('Error al guardar la compra:', error)
      throw error
    }
}

export const addIvaVentas = async ({ ivaVenta, cliente, proveedor }) => {
    try {
      const response = await api.post('/GuardarIvaVentas', {
        ivaVenta,
        cliente,
        proveedor
      })
      return response.data
    } catch (error) {
      console.error('Error al guardar IVA Venta:', error)
      throw error
    }
}

export const addIvaCompras = async ({ ivaCompras, cliente, proveedor }) => {
    try {
      const response = await api.post('/GuardarIvaCompras', {
        ivaCompras,
        cliente,
        proveedor
      })
      return response.data
    } catch (error) {
      console.error('Error al guardar IVA Venta:', error)
      throw error
    }
}

export const addEgresos = async ({ Fecha, Concepto, Comprobante, ImporteTotal }) => {
    try {
        const response = await api.post('/GuardarEgreso', {
            Fecha,
            Concepto,
            Comprobante,
            ImporteTotal
        });
        return response;
    } catch (error) {
        console.error('Error al agregar egresos:', error);
        throw error;
    }
};

export const addGastos = async (gasto) => {
    try {
      const response = await api.post('/GuardarGastos', gasto);
      return response.data;
    } catch (error) {
      console.error('Error al guardar gasto:', error);
      throw error;
    }
}

export const addMateriaPrima = async (materia_prima) => {
    try {
      const response = await api.post('/GuardarEnMateriaPrima', materia_prima);
      return response.data;
    } catch (error) {
      console.error('Error al guardar la materia prima:', error);
      throw error;
    }
}
//METODOS ELIMINAR 
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

export const deleteUsuario = async (id) => {
    try {
        const response = await api.delete('/removeUsuario', {
            data: { id_Usuario: id } 
        });
        return response;
    } catch (error) {
        console.error(`No se pudo borrar el usuario con ${id}:`, error);
        throw error;
    }
};


//METOODOS MODIFICAR
export const editProduccion = async (id, cantidad) => {
    try {
        const response = await api.delete(`/produccion/${id}/${cantidad}`);
        return response;
    } catch (error) {
        console.error(`No se pudo borrar el producto con  ${id}:`, error);
        throw error;
    }
}

export const editIngreso = async (id_Ingreso, data) => {
    try {
        const response = await api.put(`/ingresos/${id_Ingreso}`, data);
        return response;
    } catch (error) {
        console.error(`Error al modificar el ingreso con id ${id_Ingreso}:`, error);
        throw error;
    }
};

export const editEgreso = async (Id_Egresos, importe_total) => {
    try {
        const response = await api.put(`/egresos/${Id_Egresos}`, importe_total);
        return response;
    } catch (error) {
        console.error(`Error al modificar el egreso con id ${Id_Egresos}:`, error);
        throw error;
    }
};

export const editIvaVentas = async (Id_IvaVentas, data) => {
    try {
        const response = await api.put(`/ivaventas/${Id_IvaVentas}`, data);
        return response;
    } catch (error) {
        console.error(`Error al modificar el egreso con id ${Id_IvaVentas}:`, error);
        throw error;
    }
};

export const editIvaCompras = async (Id_IvaCompras, data) => {
    try {
        const response = await api.put(`/ivacompras/${Id_IvaCompras}`, data);
        return response;
    } catch (error) {
        console.error(`Error al modificar el egreso con id ${Id_IvaCompras}:`, error);
        throw error;
    }
};

export const editventasMercaderia = async (id_VentaMercaderia, data) => {
    try {
        const response = await api.put(`/ventasMercaderia/${id_VentaMercaderia}`, data);
        return response;
    } catch (error) {
        console.error(`Error al modificar el egreso con id ${id_VentaMercaderia}:`, error);
        throw error;
    }
}

export const editGastos = async (Id_Gastos, importe) => {
    try {
        const response = await api.put(`/gastosImporte/${Id_Gastos}`, importe);
        return response;
    } catch (error) {
        console.error(`Error al modificar el gasto con id ${Id_Gastos}:`, error);
        throw error;
    }
};

export const editDevolucion = async (id_Devolucion, data) => {
    try {
        const response = await api.put(`/devolucion/${id_Devolucion}`, data);
        return response;
    } catch (error) {
        console.error(`Error al modificar el egreso con id ${id_Devolucion}:`, error);
        throw error;
    }
}


export default {
    getTableData , getFormsData, getCompraFormData, getClientes, getProveedores, getEgresos, getTipoGastos, getStock, 
    deleteCliente, deleteProveedor, deleteVendedor, deleteUsuario,
    addUsuario, addProveedor, addVendedor, addCliente, addCompra, addIvaVentas, addIvaCompras, addEgresos, addGastos, addMateriaPrima,
    editIngreso, editEgreso, editIvaVentas, editventasMercaderia, editGastos, editIvaCompras, editDevolucion, editProduccion
    };