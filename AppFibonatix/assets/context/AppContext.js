import '../services/Credentials'; 
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { globalDataService, personalityService } from '../services/ApiService';
import { io } from 'socket.io-client';
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

    const forceSync = async () => {
        if (!user || !clientId) return;
        
        try {
            const { clientId: fetchedClientId, data: userData } = await globalDataService.getUserData(user.uid, setClientId);
            setGlobalData(userData);
            return userData;
        } catch (error) {
            console.error("Error en sincronización forzada:", error);
            throw error;
        }
    };

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
        const appStateListener = AppState.addEventListener('change', (nextAppState) => {
            if (nextAppState === 'active' && socket) {
                socket.connect();
                socket.emit("join", { clientId });
            } else if (nextAppState === 'background' && socket) {
                socket.disconnect();
            }
        });

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
                newSocket.connect();
            }
        };

        const handleUpdate = (data) => {
            setGlobalData(prev => {
                const changes = {};
                if (Math.abs(data.gamePercentage - (prev.gamePercentage || 0)) > 1) changes.gamePercentage = data.gamePercentage;
                if (Math.abs(data.foodPercentage - (prev.foodPercentage || 0)) > 1) changes.foodPercentage = data.foodPercentage;
                if (Math.abs(data.sleepPercentage - (prev.sleepPercentage || 0)) > 1) changes.sleepPercentage = data.sleepPercentage;
                return Object.keys(changes).length ? { ...prev, ...changes } : prev;
            });
            debouncedCheckStatus(data);
        };

        const handleError = (error) => {
            console.error("Error en WebSocket:", error);
            setSocketReady(false);
        };

        newSocket.on("connect", handleConnect);
        newSocket.on("disconnect", handleDisconnect);
        newSocket.on("updateGlobalData", handleUpdate);
        newSocket.on("error", handleError);

        setSocket(newSocket);

        return () => {
            appStateListener.remove();
            newSocket.off("connect", handleConnect);
            newSocket.off("disconnect", handleDisconnect);
            newSocket.off("updateGlobalData", handleUpdate);
            newSocket.off("error", handleError);
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
            await forceSync();
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
            await forceSync();
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
            await forceSync();
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
            setGlobalData(prev => ({ ...prev, coins: updatedData.coins }));
            await forceSync();
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
            await forceSync();
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