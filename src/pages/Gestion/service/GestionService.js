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

export default getTableData;