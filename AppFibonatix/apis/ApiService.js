import axios from 'axios';

const API_BASE_URL = 'https://webfrognova-production.up.railway.app';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const syncService = {
    startSync: async () => {
        try {
            const response = await api.get('/sql/syncData');
            return response.data;
        } catch (error) {
            console.error('Error al iniciar la sincronización:', error);
            throw error;
        }
    }
};