import '../services/Credentials'; 
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { globalDataService, personalityService, api } from '../services/ApiService';
import { io } from 'socket.io-client';
import { AppState } from 'react-native';
import { Platform, BackHandler } from 'react-native';
import { SOCKET_URL } from '../services/ApiService';

const AppContext = createContext();
const db = getFirestore();

export const useAppContext = () => useContext(AppContext);

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

    const sessionIdRef = useRef(null);

    const forceSync = useCallback(async () => {
        if (!user || !clientId) return;
        try {
            const { clientId: fetchedClientId, data: userData } = await globalDataService.getUserData(user.uid, setClientId);
            setGlobalData(userData);
            return userData;
        } catch (error) {
            console.error("Error en sincronización forzada:", error);
            throw error;
        }
    }, [user, clientId]);

    const startAppSession = useCallback(async () => {
        if (!clientId || isManagingSession) return;
        
        // Si ya hay una sesión activa, no crear otra
        if (sessionIdRef.current) {
            console.log('Ya existe una sesión activa:', sessionIdRef.current);
            return;
        }
        
        setIsManagingSession(true);
        try {
            console.log('Iniciando sesión de aplicación para cliente:', clientId);
            const response = await api.post('/api/startAppSession', { client_ID: clientId });
            if (response.data?.session_ID) {
                sessionIdRef.current = response.data.session_ID;
                setCurrentSessionId(response.data.session_ID);
                console.log('Sesión de aplicación iniciada exitosamente:', response.data.session_ID);
            } else {
                console.error('No se recibió session_ID en la respuesta:', response.data);
            }
        } catch (error) {
            console.error('Error al iniciar sesión de aplicación:', error);
            sessionIdRef.current = null;
            setCurrentSessionId(null);
        } finally {
            setIsManagingSession(false);
        }
    }, [clientId, isManagingSession]);

    const endAppSession = useCallback(async () => {
        const sessionToClose = sessionIdRef.current || currentSessionId;
        
        if (!clientId || !sessionToClose || isManagingSession) {
            console.log('No se puede cerrar sesión:', { 
                clientId, 
                sessionToClose, 
                isManagingSession,
                refValue: sessionIdRef.current,
                stateValue: currentSessionId
            });
            return false;
        }
        
        setIsManagingSession(true);
        
        try {
            console.log('Intentando cerrar sesión:', sessionToClose);
            
            // Usar AbortController para timeout
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 5000); // 5s timeout
            
            const response = await api.post('/api/endAppSession', {
                session_ID: sessionToClose,
                client_ID: clientId
            }, { signal: controller.signal });
            
            clearTimeout(timeout);
            
            console.log('Sesión cerrada exitosamente:', response.data);
            
            // Limpiar ambos: ref y state
            sessionIdRef.current = null;
            setCurrentSessionId(null);
            return true;
        } catch (error) {
            if (error.name === 'AbortError') {
                console.log('Timeout al cerrar sesión, pero continuando...');
                sessionIdRef.current = null;
                setCurrentSessionId(null);
                return true;
            } else {
                console.error('Error al cerrar sesión:', error);
                // Aún así limpiar el estado local para evitar sesiones zombi
                sessionIdRef.current = null;
                setCurrentSessionId(null);
                return false;
            }
        } finally {
            setIsManagingSession(false);
        }
    }, [clientId, currentSessionId, isManagingSession]);

    useEffect(() => {
        if (!isAuthenticated || !clientId) return;
        
        let isMounted = true;
        let currentAppState = AppState.currentState;
        
        const handleAppStateChange = async (nextAppState) => {
            if (!isMounted) return;
            
            console.log(`Estado cambiado de ${currentAppState} a ${nextAppState}`);
            console.log('Session ID en cambio de estado:', {
                ref: sessionIdRef.current,
                state: currentSessionId
            });
            
            try {
                // Cuando la app pasa a background o se cierra
                if (currentAppState === 'active' && nextAppState.match(/inactive|background/)) {
                    console.log('Aplicación está saliendo de primer plano - cerrando sesión');
                    const closed = await endAppSession();
                    console.log('Resultado del cierre:', closed);
                }
                
                // Cuando la app vuelve a primer plano
                if (nextAppState === 'active' && currentAppState !== 'active') {
                    console.log('Aplicación volvió a primer plano - iniciando sesión');
                    // Pequeño retraso para asegurar que la app está ready
                    setTimeout(() => {
                        if (isMounted) {
                            startAppSession();
                        }
                    }, 500);
                }
            } catch (error) {
                console.error('Error en manejo de cambio de estado:', error);
            }
            
            // Actualizar el estado local
            currentAppState = nextAppState;
            if (isMounted) {
                setAppState(nextAppState);
            }
        };

        // Iniciar sesión inicial si está activa y no hay sesión
        if (AppState.currentState === 'active' && !sessionIdRef.current) {
            console.log('Iniciando sesión inicial');
            startAppSession();
        }

        const subscription = AppState.addEventListener('change', handleAppStateChange);
        
        let backHandler;
        let memoryWarningSubscription;
        
        if (Platform.OS === 'android') {
            backHandler = BackHandler.addEventListener(
                'hardwareBackPress',
                async () => {
                    console.log('Back button pressed - cerrando sesión');
                    await endAppSession();
                    return false;
                }
            );
        }

        if (Platform.OS !== 'web') {
            memoryWarningSubscription = AppState.addEventListener('memoryWarning', async () => {
                console.log('Memory warning - cerrando sesión');
                await endAppSession();
            });
        }

        // Cleanup function
        return () => {
            isMounted = false;
            
            if (subscription) {
                subscription.remove();
            }
            
            if (backHandler) {
                backHandler.remove();
            }
            
            if (memoryWarningSubscription) {
                memoryWarningSubscription.remove();
            }
            
            // Forzar cierre de sesión si aún está activa
            if (sessionIdRef.current && clientId) {
                console.log('Limpieza final - cerrando sesión');
                endAppSession().catch(console.error);
            }
        };
    }, [isAuthenticated, clientId]);

    useEffect(() => {
        // Cerrar sesión cuando el usuario se desloggea
        if (!isAuthenticated && (sessionIdRef.current || currentSessionId)) {
            console.log('Usuario desloggeado - cerrando sesión');
            endAppSession().catch(console.error);
        }
    }, [isAuthenticated]);

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
                setTimeout(() => {
                    newSocket.connect();
                }, 2000);
            }
        };

        const handleUpdate = (data) => {
            setGlobalData(prev => {
                const newData = {
                    ...prev,
                    coins: data.coins !== undefined ? data.coins : prev.coins,
                    trophies: data.trophies !== undefined ? data.trophies : prev.trophies,
                    gamePercentage: data.gamePercentage !== undefined ? data.gamePercentage : prev.gamePercentage,
                    foodPercentage: data.foodPercentage !== undefined ? data.foodPercentage : prev.foodPercentage,
                    sleepPercentage: data.sleepPercentage !== undefined ? data.sleepPercentage : prev.sleepPercentage,
                    lastAlertTime: data.lastAlertTime !== undefined ? data.lastAlertTime : prev.lastAlertTime
                };
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
                setCurrentSessionId(null);
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
                if (userDoc.exists()) {
                    setLicense(userDoc.data().license);
                } else {
                    throw new Error('User document not found in Firestore');
                }

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
                } else {
                    setPersonalityTraits([]);
                }

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
        }, 30000);

        return () => clearInterval(syncInterval);
    }, [forceSync]);

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
        startAppSession,
        endAppSession,
        currentSessionId,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};