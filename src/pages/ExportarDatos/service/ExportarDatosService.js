import { api } from 'boot/axios';

export const TraerTablas = async () => {
    try {
        const response = api.get('/tablasTodas');        
        return response;
    } catch (error) {
        console.error('Error al traer tablas:', error);
        throw error;
    }
};

export const TraerTablasExport = async () => {
    try {
        const response = await api.get('/tablasExcell');        
        return response;
    } catch (error) {
        console.error('Error al traer tablas:', error);
        throw error;
    }
};

export const GenerateExcellProduccion = async (fechaDesde, fechaHasta) => {
    try {
        const response = await api.post('/ExportarExcellProduccion', {
            fechaDesde,
            fechaHasta
        }, {
            responseType: 'blob', 
        });  
        return response;
    } catch (error) {
        console.error('Error al generar el Excel de producción:', error);
        throw error;
    }
}

export const GenerateExcellDevolucion = async (fechaDesde, fechaHasta) => {
    try {
        const response = await api.post('/ExportarExcellDevolucion', {
            fechaDesde,
            fechaHasta
        }, {
            responseType: 'blob', 
        });  
        return response;
    } catch (error) {
        console.error('Error al generar el Excel de devolución:', error);
        throw error;
    }
}

export const GenerateExcellVentas = async (fechaDesde, fechaHasta) => {
    try {
        const response = await api.post('/ExportarExcellVentas', {
            fechaDesde,
            fechaHasta
        }, {
            responseType: 'blob', 
        });  
        return response;
    } catch (error) {
        console.error('Error al generar el Excel de ventas:', error);
        throw error;
    }
}

export const GenerateExcellProductos = async () =>{
    try {
        const response = await api.get('/ExportarExcellProductos', {
            responseType: 'blob', 
        });  
        return response;
    } catch (error) {
        console.error('Error al traer tablas:', error);
        throw error;
    }
}

export const GenerateExcellIngresos = async (fechaDesde, fechaHasta) => {
    try {
        const response = await api.post('/ExportarExcellIngresos', {
            fechaDesde,
            fechaHasta
        }, {
            responseType: 'blob', 
        });  
        return response;
    } catch (error) {
        console.error('Error al generar el Excel de ingresos:', error);
        throw error;
    }
}

export const GenerateExcellClientes = async () =>{
    try {
        const response = await api.get('/ExportarExcellClientes', {
            responseType: 'blob', 
        });  
        return response;
    } catch (error) {
        console.error('Error al traer tablas:', error);
        throw error;
    }
}

export const GenerateExcellCompras = async (fechaDesde, fechaHasta) => {
    try {
        const response = await api.post('/ExportarExcellCompras', {
            fechaDesde,
            fechaHasta
        }, {
            responseType: 'blob', 
        });  
        return response;
    } catch (error) {
        console.error('Error al generar el Excel de compras:', error);
        throw error;
    }
}
export const GenerateExcellEgresos = async (fechaDesde, fechaHasta) => {
    try {
        const response = await api.post('/ExportarExcellEgresos', {
            fechaDesde,
            fechaHasta
        }, {
            responseType: 'blob', 
        });  
        return response;
    } catch (error) {
        console.error('Error al generar el Excel de egresos:', error);
        throw error;
    }
}
                                                                                   
export default {
    TraerTablas, TraerTablasExport,
    GenerateExcellProduccion, GenerateExcellDevolucion, GenerateExcellVentas, GenerateExcellProductos, GenerateExcellIngresos, GenerateExcellClientes, GenerateExcellCompras, GenerateExcellEgresos
};