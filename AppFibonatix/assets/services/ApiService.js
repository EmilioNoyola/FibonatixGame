import axios from 'axios';
import { getAuth } from "firebase/auth";
import { io } from 'socket.io-client';

const API_BASE_URL = 'http://192.168.56.1:3000';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

const socket = io(API_BASE_URL, {
    autoConnect: false,
});

export const connectWebSocket = (clientId, onUpdate) => {
    socket.connect();

    socket.on("connect", () => {
        console.log("Conectado al servidor WebSocket");
        socket.emit("join", { clientId });
    });

    socket.on("updateGlobalData", (data) => {
        console.log("Actualización de datos globales:", data);
        onUpdate(data);
    });

    socket.on("disconnect", () => {
        console.log("Desconectado del servidor WebSocket");
    });

    return () => {
        socket.disconnect();
    };
};

const getClientId = async (uid, setClientId) => {
    const auth = getAuth();
    const user = auth.currentUser || { uid };
    if (!user) throw new Error('Usuario no autenticado');

    console.log('Obteniendo client_ID para UID:', user.uid); // Log del UID

    try {
        const response = await api.post('/api/getClientId', { client_fire_base_ID: user.uid });
        console.log('Respuesta de /api/getClientId:', response.data);
        if (setClientId) setClientId(response.data.client_ID);
        return response.data.client_ID;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            console.error('Cliente no encontrado para UID:', user.uid);
            throw new Error('CLIENT_NOT_FOUND');
        }
        console.error('Error en getClientId:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const globalDataService = {
    getUserData: async (uid, setClientId) => {
        try {
            const client_ID = await getClientId(uid, setClientId);
            const response = await api.get(`/api/userData/${client_ID}`);
            return { clientId: client_ID, data: response.data }; // Devolver clientId y datos
        } catch (error) {
            if (error.message === 'CLIENT_NOT_FOUND') {
                throw error;
            }
            console.error('Error al obtener datos del usuario:', error);
            throw error;
        }
    },
    updateCoins: async (amount, clientId) => {
        try {
            const response = await api.post(`/api/userData/${clientId}/coins`, { amount });
            return response.data;
        } catch (error) {
            console.error('Error al actualizar monedas:', error);
            throw error;
        }
    },
    updateTrophies: async (amount, clientId) => {
        try {
            const response = await api.post(`/api/userData/${clientId}/trophies`, { amount });
            return response.data;
        } catch (error) {
            console.error('Error al actualizar trofeos:', error);
            throw error;
        }
    },
    updateGamePercentage: async (amount, clientId) => {
        try {
            const response = await api.post(`/api/userData/${clientId}/gamePercentage`, { amount });
            return response.data;
        } catch (error) {
            console.error('Error al actualizar porcentaje de juego:', error);
            throw error;
        }
    },
    updateFoodPercentage: async (amount, clientId) => {
        try {
            const response = await api.post(`/api/userData/${clientId}/foodPercentage`, { amount });
            return response.data;
        } catch (error) {
            console.error('Error al actualizar porcentaje de comida:', error);
            throw error;
        }
    },
    updateSleepPercentage: async (amount, clientId) => {
        try {
            const response = await api.post(`/api/userData/${clientId}/sleepPercentage`, { amount });
            return response.data;
        } catch (error) {
            console.error('Error al actualizar porcentaje de sueño:', error);
            throw error;
        }
    },
};

export const gameService = {
    getGames: async () => {
        try {
            const response = await api.get('/api/games');
            return response.data;
        } catch (error) {
            console.error('Error al obtener juegos:', error);
            throw error;
        }
    },
    getGameProgress: async (clientId) => {
        try {
            const response = await api.post('/api/getGameProgress', { client_ID: clientId });
            return response.data;
        } catch (error) {
            console.error('Error al obtener progreso de juegos:', error);
            throw error;
        }
    },
    updateGameProgress: async (gameData, clientId) => {
        try {
            const response = await api.post('/api/updateGameProgress', { client_ID: clientId, ...gameData });
            return response.data;
        } catch (error) {
            console.error('Error al actualizar progreso de juego:', error);
            throw error;
        }
    },
};

export const personalityService = {
    getPersonalityTraits: async (clientId) => {
        try {
            console.log('Solicitando rasgos de personalidad para clientId:', clientId); // Log del clientId
            const response = await api.get(`/api/users/${clientId}/personality`);
            console.log('Respuesta de /api/users/.../personality:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error al obtener rasgos de personalidad:', error);
            throw error;
        }
    },
};