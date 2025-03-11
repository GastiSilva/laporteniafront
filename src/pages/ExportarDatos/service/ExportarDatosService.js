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

export default TraerTablas;