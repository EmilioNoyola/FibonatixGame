import '../services/Credentials'; 
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { globalDataService, personalityService, api } from '../services/ApiService';
import { io } from 'socket.io-client';
import { AppState } from 'react-native'; // Added missing import
import { Platform } from 'react-native';
import { SOCKET_URL } from '../services/ApiService';

const AppContext = createContext();
const db = getFirestore();

export const useAppContext = () => useContext(AppContext);

// Función debounce helper fuera del componente
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

export const AppProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [clientId, setClientId] = useState(null);
    const [license, setLicense] = useState(null);
    const [socketReady, setSocketReady] = useState(false);
    const [globalData, setGlobalData] = useState({
        coins: 0,
        trophies: 0,
        gamePercentage: 0,
        foodPercentage: 0,
        sleepPercentage: 0,
        lastAlertTime: 0,
    });
    const [personalityTraits, setPersonalityTraits] = useState([]);
    const [error, setError] = useState(null);
    const [alert, setAlert] = useState(null);
    const [socket, setSocket] = useState(null);

    const auth = getAuth();

    const [alertState, setAlertState] = useState({
        currentAlert: null,
        lastAlertTime: 0,
        alertCooldown: 30000,
        isAlertActive: false,
    });

    const [appState, setAppState] = useState(AppState.currentState);
    const [currentSessionId, setCurrentSessionId] = useState(null);
    const [isManagingSession, setIsManagingSession] = useState(false);

    // Función para registrar el inicio de sesión
    const startAppSession = async () => {
        if (!clientId) return;
        
        try {
            // Primero cerrar cualquier sesión activa existente
            if (currentSessionId) {
                await api.post('/api/endAppSession', { 
                    session_ID: currentSessionId,
                    client_ID: clientId
                }).catch(console.error);
            }

            // Crear nueva sesión
            const response = await api.post('/api/startAppSession', { 
                client_ID: clientId 
            });
            
            if (response.data?.session_ID) {
                setCurrentSessionId(response.data.session_ID);
                console.log('Sesión de aplicación iniciada:', response.data.session_ID);
            }
        } catch (error) {
            console.error('Error al iniciar sesión de aplicación:', error);
            setCurrentSessionId(null);
        }
    };

    // Función para registrar el cierre de sesión
    const endAppSession = async (sessionId = currentSessionId) => {
        if (!clientId || !sessionId) return;
        
        try {
            await api.post('/api/endAppSession', { 
                session_ID: sessionId,
                client_ID: clientId
            });
            console.log('Sesión de aplicación finalizada:', sessionId);
            
            if (sessionId === currentSessionId) {
                setCurrentSessionId(null);
            }
            return true;
        } catch (error) {
            console.error('Error al finalizar sesión de aplicación:', error);
            return false;
        }
    };

    // Manejar cambios en el estado de la aplicación
    useEffect(() => {
        let isMounted = true;
        let sessionTimeout;
        
        const handleAppStateChange = async (nextAppState) => {
            if (!isMounted || !clientId) return;
            
            console.log(`App state changed from ${appState} to ${nextAppState}`);
            
            // Ignorar si no hay cambio real de estado
            if (appState === nextAppState) return;

            try {
                if (nextAppState === 'active') {
                    // Cerrar cualquier sesión previa antes de abrir una nueva
                    if (currentSessionId) {
                        await endAppSession(currentSessionId).catch(console.error);
                    }
                    await startAppSession();
                } else if (appState === 'active' && nextAppState.match(/inactive|background/)) {
                    // Usar un timeout para asegurar el cierre incluso si la app es terminada
                    sessionTimeout = setTimeout(async () => {
                        try {
                            if (currentSessionId && isMounted) {
                                await endAppSession(currentSessionId);
                            }
                        } catch (error) {
                            console.error('Error al finalizar sesión en timeout:', error);
                        }
                    }, 1000); // 1 segundo de gracia
                }
            } catch (error) {
                console.error('Error en manejo de cambio de estado:', error);
            }

            if (isMounted) {
                setAppState(nextAppState);
            }
        };

        const subscription = AppState.addEventListener('change', handleAppStateChange);

        return () => {
            isMounted = false;
            clearTimeout(sessionTimeout);
            subscription.remove();
            
            // Forzar cierre de sesión al desmontar si aún está activa
            if (currentSessionId && clientId) {
                endAppSession(currentSessionId).catch(error => {
                    console.error('Error al finalizar sesión en cleanup:', error);
                });
            }
        };
    }, [isAuthenticated, clientId, currentSessionId, appState]);

    const checkStatusLevels = useCallback((data) => {
        const now = Date.now();
        const { currentAlert, lastAlertTime, alertCooldown, isAlertActive } = alertState;

        if (isAlertActive || (lastAlertTime && now - lastAlertTime < alertCooldown)) {
            return;
        }

        let newAlert = null;

        if (data.gamePercentage <= 5) {
            newAlert = { type: 'game', level: 'critical' };
        } else if (data.foodPercentage <= 5) {
            newAlert = { type: 'food', level: 'critical' };
        } else if (data.sleepPercentage <= 5) {
            newAlert = { type: 'sleep', level: 'critical' };
        } else if (data.gamePercentage <= 15) {
            newAlert = { type: 'game', level: 'warning' };
        } else if (data.foodPercentage <= 15) {
            newAlert = { type: 'food', level: 'warning' };
        } else if (data.sleepPercentage <= 15) {
            newAlert = { type: 'sleep', level: 'warning' };
        }

        if (newAlert) {
            setAlertState(prev => ({
                ...prev,
                currentAlert: newAlert,
                lastAlertTime: now,
                isAlertActive: true,
            }));
            setAlert(newAlert);
            setTimeout(() => {
                setAlertState(prev => ({
                    ...prev,
                    isAlertActive: false,
                }));
                setAlert(null);
            }, 3000);
        }
    }, [alertState]);

    const debouncedCheckStatus = useCallback(
        debounce((data) => checkStatusLevels(data), 1000),
        [checkStatusLevels]
    );

    useEffect(() => {

        if (!user || !clientId) return;

        const newSocket = io(SOCKET_URL, {
            autoConnect: false,
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            randomizationFactor: 0.5,
        });

        const handleConnect = () => {
            console.log("Conectado al servidor WebSocket");
            newSocket.emit("join", { clientId });
            setSocketReady(true);
        };

        const handleDisconnect = (reason) => {
            console.log("Desconectado del servidor WebSocket:", reason);
            setSocketReady(false);
            if (reason === "io server disconnect") {
                // Intentar reconectar después de un breve retraso
                setTimeout(() => {
                    newSocket.connect();
                }, 2000);
            }
        };

        const handleUpdate = (data) => {
            setGlobalData(prev => {
                // Eliminar el filtro estricto de diferencias > 1
                const newData = {
                    ...prev,
                    coins: data.coins !== undefined ? data.coins : prev.coins,
                    trophies: data.trophies !== undefined ? data.trophies : prev.trophies,
                    gamePercentage: data.gamePercentage !== undefined ? data.gamePercentage : prev.gamePercentage,
                    foodPercentage: data.foodPercentage !== undefined ? data.foodPercentage : prev.foodPercentage,
                    sleepPercentage: data.sleepPercentage !== undefined ? data.sleepPercentage : prev.sleepPercentage,
                    lastAlertTime: data.lastAlertTime !== undefined ? data.lastAlertTime : prev.lastAlertTime
                };
                
                // Verificar si hubo cambios reales
                if (JSON.stringify(prev) !== JSON.stringify(newData)) {
                    return newData;
                }
                return prev;
            });
            debouncedCheckStatus(data);
        };

        const handleConnectError = (error) => {
            console.error("Error de conexión WebSocket:", error);
            setSocketReady(false);
        };

        newSocket.on("connect", handleConnect);
        newSocket.on("disconnect", handleDisconnect);
        newSocket.on("connect_error", handleConnectError);
        newSocket.on("updateGlobalData", handleUpdate);

        // Intentar conectar inicialmente
        newSocket.connect();

        setSocket(newSocket);

        return () => {
            newSocket.off("connect", handleConnect);
            newSocket.off("disconnect", handleDisconnect);
            newSocket.off("connect_error", handleConnectError);
            newSocket.off("updateGlobalData", handleUpdate);
            newSocket.disconnect();
        };
    }, [user, clientId, debouncedCheckStatus]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setLoading(true);
            if (!currentUser) {
                setUser(null);
                setIsAuthenticated(false);
                setClientId(null);
                setLicense(null);
                setGlobalData({
                    coins: 0,
                    trophies: 0,
                    gamePercentage: 0,
                    foodPercentage: 0,
                    sleepPercentage: 0,
                    lastAlertTime: 0,
                });
                setPersonalityTraits([]);
                setError(null);
                setLoading(false);
                return;
            }

            setUser(currentUser);
            setError(null);

            try {
                const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
                if (userDoc.exists()) setLicense(userDoc.data().license);
                else throw new Error('User document not found in Firestore');

                let fetchedClientId;
                let userData;
                try {
                    const result = await globalDataService.getUserData(currentUser.uid, setClientId);
                    fetchedClientId = result.clientId;
                    userData = result.data;
                    setGlobalData(userData || {
                        coins: 0,
                        trophies: 0,
                        gamePercentage: 0,
                        foodPercentage: 0,
                        sleepPercentage: 0,
                        lastAlertTime: 0,
                    });
                } catch (error) {
                    console.error('Error fetching global data:', error);
                    setGlobalData({
                        coins: 0,
                        trophies: 0,
                        gamePercentage: 0,
                        foodPercentage: 0,
                        sleepPercentage: 0,
                        lastAlertTime: 0,
                    });
                }

                if (fetchedClientId) {
                    try {
                        const traits = await personalityService.getPersonalityTraits(fetchedClientId);
                        setPersonalityTraits(traits || []);
                    } catch (error) {
                        console.error('Error fetching personality traits:', error);
                        setPersonalityTraits([]);
                    }
                } else setPersonalityTraits([]);

                setIsAuthenticated(true);
            } catch (err) {
                console.error("Error loading user data:", err);
                setError("No se pudieron cargar los datos del usuario. Por favor, intenta de nuevo.");
                setIsAuthenticated(false);
                await signOut(auth);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!user || !clientId) return;

        const syncInterval = setInterval(async () => {
            try {
                await forceSync();
            } catch (error) {
                console.error("Error en sincronización periódica:", error);
            }
        }, 30000); // Cada 30 segundos

        return () => clearInterval(syncInterval);
    }, [user, clientId]);

    const decreaseFoodPercentageOnGamePlay = async () => {
        if (!user || !clientId) return;
        try {
            const amount = -5;
            const updatedData = await globalDataService.updateFoodPercentage(amount, clientId);
            setGlobalData(prev => ({ ...prev, foodPercentage: updatedData.foodPercentage }));
            await forceSync();
        } catch (error) {
            console.error("Error decreasing food percentage on gameplay:", error);
            throw error;
        }
    };

    const incrementGamePercentage = async (amount) => {
        if (!user || !clientId) return;
        try {
            const updatedData = await globalDataService.updateGamePercentage(amount, clientId);
            setGlobalData(prev => ({ ...prev, gamePercentage: updatedData.gamePercentage }));
            const fullData = await forceSync();
            setGlobalData(fullData);
            return updatedData;
        } catch (error) {
            console.error("Error updating game percentage:", error);
            throw error;
        }
    };

    const updateFoodPercentage = async (amount) => {
        if (!user || !clientId) return;
        try {
            const updatedData = await globalDataService.updateFoodPercentage(amount, clientId);
            setGlobalData(prev => ({ ...prev, foodPercentage: updatedData.foodPercentage }));
            const fullData = await forceSync();
            setGlobalData(fullData);
            return updatedData;
        } catch (error) {
            console.error("Error updating food percentage:", error);
            throw error;
        }
    };

    const updateSleepPercentage = async (amount) => {
        if (!user || !clientId) return;
        try {
            const updatedData = await globalDataService.updateSleepPercentage(amount, clientId);
            setGlobalData(prev => ({ ...prev, sleepPercentage: updatedData.sleepPercentage }));
            const fullData = await forceSync();
            setGlobalData(fullData);
            return updatedData;
        } catch (error) {
            console.error("Error updating sleep percentage:", error);
            throw error;
        }
    };

    const updateCoins = async (amount) => {
        if (!user || !clientId) return;
        try {
            const updatedData = await globalDataService.updateCoins(amount, clientId);
            setGlobalData(prev => ({ 
                ...prev, 
                coins: updatedData.coins 
            }));
            // Forzar sincronización completa
            const fullData = await forceSync();
            setGlobalData(fullData);
            return updatedData;
        } catch (error) {
            console.error("Error updating coins:", error);
            throw error;
        }
    };

    const updateTrophies = async (amount) => {
        if (!user || !clientId) return;
        try {
            const updatedData = await globalDataService.updateTrophies(amount, clientId);
            setGlobalData(prev => ({ ...prev, trophies: updatedData.trophies }));
            const fullData = await forceSync();
            setGlobalData(fullData);
            return updatedData;
        } catch (error) {
            console.error("Error updating trophies:", error);
            throw error;
        }
    };

    const refreshUserData = async () => {
        if (!user || !clientId) return;
        try {
            const { clientId: fetchedClientId, data: userData } = await globalDataService.getUserData(user.uid, setClientId);
            setGlobalData(userData);
            const traits = await personalityService.getPersonalityTraits(fetchedClientId);
            setPersonalityTraits(traits);
            return userData;
        } catch (error) {
            console.error("Error refreshing user data:", error);
            throw error;
        }
    };

    const value = {
        socket,
        socketReady,
        user,
        loading,
        isAuthenticated,
        clientId,
        setClientId,
        license,
        setLicense,
        globalData,
        setGlobalData,
        personalityTraits,
        setPersonalityTraits,
        updateCoins,
        updateTrophies,
        refreshUserData,
        forceSync,
        incrementGamePercentage,
        decreaseFoodPercentageOnGamePlay,
        updateFoodPercentage,
        updateSleepPercentage,
        error,
        alert,
        setAlert,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};