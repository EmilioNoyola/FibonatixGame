import axios from 'axios';
import { getAuth } from "firebase/auth";
import { io } from 'socket.io-client';

const API_BASE_URL = 'https://shurtleserver-production.up.railway.app/';
export const SOCKET_URL = 'wss://shurtleserver-production.up.railway.app/';

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 segundos de timeout
});

api.interceptors.response.use(
    response => response,
    error => {
        if (error.response) {
            // El servidor respondió con un código de estado fuera del rango 2xx
            console.error('Error de respuesta:', error.response.status, error.response.data);
        } else if (error.request) {
            // La solicitud fue hecha pero no se recibió respuesta
            console.error('Error de solicitud:', error.request);
        } else {
            // Algo pasó al configurar la solicitud
            console.error('Error:', error.message);
        }
        return Promise.reject(error);
    }
);

const socket = io(SOCKET_URL, {
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

    try {
        const response = await api.post('/api/getClientId', { client_fire_base_ID: user.uid });

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
            return { clientId: client_ID, data: response.data };
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
    getUnlockedLevels: async (clientId, gameId) => {
        try {
            const response = await api.post('/api/getGameProgress', { client_ID: clientId });
            const gameProgress = response.data.find(game => game.game_ID === gameId);
            return gameProgress ? (gameProgress.game_levels || 0) + 1 : 1;
        } catch (error) {
            console.error('Error al obtener niveles desbloqueados:', error);
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
    updateGamePerformance: async (gameProgressId, correctAttempts, wrongAttempts, avgTime) => {
        try {
            console.log("Intentando actualizar Game_Performance:", { gameProgressId, correctAttempts, wrongAttempts, avgTime });
            const response = await api.post('/api/updateGamePerformance', {
                game_progress_ID: gameProgressId,
                correct_attempts: correctAttempts,
                wrong_attempts: wrongAttempts,
                avg_time_per_operation: avgTime,
            });
            console.log("Respuesta de updateGamePerformance:", response.data);
            return response.data;
        } catch (error) {
            console.error('Error updating game performance:', error.response ? error.response.data : error.message);
            throw error;
        }
    },
    getGamePerformance: async (gameProgressId) => {
        try {
            const response = await api.get(`/api/getGamePerformance/${gameProgressId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching game performance:', error);
            throw error;
        }
    },
};

export const personalityService = {
    getPersonalityTraits: async (clientId) => {
        try {
            const response = await api.get(`/api/users/${clientId}/personality`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener rasgos de personalidad:', error);
            throw error;
        }
    },
};