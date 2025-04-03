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

export const GenerateExcellProduccion = async () =>{
    try {
        const response = await api.get('/ExportarExcellProduccion', {
            responseType: 'blob', 
        });  
        return response;
    } catch (error) {
        console.error('Error al traer tablas:', error);
        throw error;
    }
}

export const GenerateExcellDevolucion = async () =>{
    try {
        const response = await api.get('/exportarExcellDevolucion', {
            responseType: 'blob', 
        });  
        return response;
    } catch (error) {
        console.error('Error al traer tablas:', error);
        throw error;
    }
}

export const GenerateExcellVentas = async () =>{
    try {
        const response = await api.get('/exportarExcellVentas', {
            responseType: 'blob', 
        });  
        return response;
    } catch (error) {
        console.error('Error al traer tablas:', error);
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

export const GenerateExcellIngresos = async () =>{
    try {
        const response = await api.get('/ExportarExcellIngresos', {
            responseType: 'blob', 
        });  
        return response;
    } catch (error) {
        console.error('Error al traer tablas:', error);
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
                                                                                   
export default {
    TraerTablas, TraerTablasExport,
    GenerateExcellProduccion, GenerateExcellDevolucion, GenerateExcellVentas, GenerateExcellProductos, GenerateExcellIngresos, GenerateExcellClientes
};