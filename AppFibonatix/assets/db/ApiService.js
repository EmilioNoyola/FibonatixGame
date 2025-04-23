import axios from 'axios';
import { getAuth } from "firebase/auth";

const API_BASE_URL = 'http://192.168.56.1:3000';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Función para obtener el client_ID desde Firebase
const getClientId = async (uid, setClientId) => {
    const auth = getAuth();
    const user = auth.currentUser || { uid };
    if (!user) throw new Error('Usuario no autenticado');

    try {
        const response = await api.post('/firebase/getClientId', { client_fire_base_ID: user.uid });
        console.log('Respuesta de /firebase/getClientId:', response.data);
        if (setClientId) setClientId(response.data.client_ID);
        return response.data.client_ID;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            // Cliente no encontrado: manejar este caso de manera específica
            throw new Error('CLIENT_NOT_FOUND');
        }
        console.error('Error en getClientId:', error.response ? error.response.data : error.message);
        throw error;
    }
};

// Servicios para datos globales del usuario
export const globalDataService = {
    getUserData: async (uid, setClientId) => {
        try {
            const client_ID = await getClientId(uid, setClientId);
            const response = await api.get(`/firebase/api/userData/${client_ID}`);
            return response.data;
        } catch (error) {
            if (error.message === 'CLIENT_NOT_FOUND') {
                throw error; // Propagar el error específico
            }
            console.error('Error al obtener datos del usuario:', error);
            throw error;
        }
    },
    updateCoins: async (amount, clientId) => {
        try {
            const response = await api.post(`/firebase/api/userData/${clientId}/coins`, { amount });
            return response.data;
        } catch (error) {
            console.error('Error al actualizar monedas:', error);
            throw error;
        }
    },
    updateTrophies: async (amount, clientId) => {
        try {
            const response = await api.post(`/firebase/api/userData/${clientId}/trophies`, { amount });
            return response.data;
        } catch (error) {
            console.error('Error al actualizar trofeos:', error);
            throw error;
        }
    },
    updateGamePercentage: async (amount, clientId) => {
        try {
            const response = await api.post(`/firebase/api/userData/${clientId}/gamePercentage`, { amount });
            return response.data;
        } catch (error) {
            console.error('Error al actualizar porcentaje de juego:', error);
            throw error;
        }
    },
    updateFoodPercentage: async (amount, clientId) => {
        try {
            const response = await api.post(`/firebase/api/userData/${clientId}/foodPercentage`, { amount });
            return response.data;
        } catch (error) {
            console.error('Error al actualizar porcentaje de comida:', error);
            throw error;
        }
    },
    updateSleepPercentage: async (amount, clientId) => {
        try {
            const response = await api.post(`/firebase/api/userData/${clientId}/sleepPercentage`, { amount });
            return response.data;
        } catch (error) {
            console.error('Error al actualizar porcentaje de sueño:', error);
            throw error;
        }
    },
};

// Servicios para juegos
export const gameService = {
    getGames: async () => {
        try {
            const response = await api.get('/firebase/api/games');
            return response.data;
        } catch (error) {
            console.error('Error al obtener juegos:', error);
            throw error;
        }
    },
    getGameProgress: async (clientId) => {
        try {
            const response = await api.post('/firebase/getGameProgress', { client_ID: clientId });
            return response.data;
        } catch (error) {
            console.error('Error al obtener progreso de juegos:', error);
            throw error;
        }
    },
    updateGameProgress: async (gameData, clientId) => {
        try {
            const response = await api.post('/firebase/updateGameProgress', { client_ID: clientId, ...gameData });
            return response.data;
        } catch (error) {
            console.error('Error al actualizar progreso de juego:', error);
            throw error;
        }
    },
};

// Servicios para personalidad de la mascota
export const personalityService = {
    getPersonalityTraits: async (clientId) => {
        try {
            const response = await api.get(`/firebase/api/users/${clientId}/personality`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener rasgos de personalidad:', error);
            throw error;
        }
    },
};