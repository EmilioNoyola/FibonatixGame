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
const getClientId = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) throw new Error('Usuario no autenticado');
    
    try {
        const response = await api.post('/firebase/getClientId', { client_fire_base_ID: user.uid });
        console.log('Respuesta de /firebase/getClientId:', response.data);
        return response.data.client_ID;
    } catch (error) {
        console.error('Error en getClientId:', error.response ? error.response.data : error.message);
        throw error;
    }
};

// Servicios para datos globales del usuario
export const globalDataService = {
    getUserData: async () => {
        try {
            const client_ID = await getClientId();
            const response = await api.get(`/firebase/api/userData/${client_ID}`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener datos del usuario:', error);
            throw error;
        }
    },
    updateCoins: async (amount) => {
        try {
            const client_ID = await getClientId();
            const response = await api.post(`/firebase/api/userData/${client_ID}/coins`, { amount });
            return response.data;
        } catch (error) {
            console.error('Error al actualizar monedas:', error);
            throw error;
        }
    },
    updateTrophies: async (amount) => {
        try {
            const client_ID = await getClientId();
            const response = await api.post(`/firebase/api/userData/${client_ID}/trophies`, { amount });
            return response.data;
        } catch (error) {
            console.error('Error al actualizar trofeos:', error);
            throw error;
        }
    },
    updateGamePercentage: async (amount) => {
        try {
            const client_ID = await getClientId();
            const response = await api.post(`/firebase/api/userData/${client_ID}/gamePercentage`, { amount });
            return response.data;
        } catch (error) {
            console.error('Error al actualizar porcentaje de juego:', error);
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
    getGameProgress: async () => {
        try {
            const client_ID = await getClientId();
            const response = await api.post('/firebase/getGameProgress', { client_ID });
            return response.data;
        } catch (error) {
            console.error('Error al obtener progreso de juegos:', error);
            throw error;
        }
    },
    updateGameProgress: async (gameData) => {
        try {
            const client_ID = await getClientId();
            const response = await api.post('/firebase/updateGameProgress', { client_ID, ...gameData });
            return response.data;
        } catch (error) {
            console.error('Error al actualizar progreso de juego:', error);
            throw error;
        }
    },
};

// Servicios para personalidad de la mascota
export const personalityService = {
    getPersonalityTraits: async () => {
        try {
            const client_ID = await getClientId();
            const response = await api.get(`/firebase/api/users/${client_ID}/personality`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener rasgos de personalidad:', error);
            throw error;
        }
    },
};