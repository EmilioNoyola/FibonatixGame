import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { globalDataService, personalityService } from './ApiService';

const AppContext = createContext();
const db = getFirestore();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [clientId, setClientId] = useState(null);
    const [license, setLicense] = useState(null);
    const [globalData, setGlobalData] = useState({
        coins: 0,
        trophies: 0,
        gamePercentage: 0,
        foodPercentage: 0,
        sleepPercentage: 0,
    });
    const [personalityTraits, setPersonalityTraits] = useState([]);
    const [error, setError] = useState(null);

    const auth = getAuth();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
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
                });
                setPersonalityTraits([]);
                setError(null);
                setLoading(false);
                return;
            }

            setUser(currentUser);
            setError(null);

            try {
                // Fetch license from Firestore
                const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
                if (userDoc.exists()) {
                    setLicense(userDoc.data().license);
                } else {
                    throw new Error('User document not found in Firestore');
                }

                if (!clientId) {
                    const fetchedClientId = await globalDataService.getUserData(currentUser.uid, setClientId);
                    setGlobalData(fetchedClientId);
                }

                if (clientId && personalityTraits.length === 0) {
                    const traits = await personalityService.getPersonalityTraits(clientId);
                    setPersonalityTraits(traits);
                }

                setIsAuthenticated(true);
            } catch (err) {
                if (err.message === 'CLIENT_NOT_FOUND') {
                    setError("Usuario no registrado en el servidor. Por favor, regístrate nuevamente.");
                    await signOut(auth);
                    setIsAuthenticated(false);
                    return;
                }
                console.error("Error loading user data:", err);
                setError("No se pudieron cargar los datos del usuario. Por favor, intenta de nuevo.");
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, [clientId]);

    useEffect(() => {
        if (!user || !clientId) return;

        const decreaseGamePercentage = async () => {
            setGlobalData(prev => {
                const newPercentage = Math.max((prev.gamePercentage || 0) - 3, 0);
                if (newPercentage !== prev.gamePercentage) {
                    incrementGamePercentage(newPercentage - prev.gamePercentage);
                }
                return { ...prev, gamePercentage: newPercentage };
            });
        };

        const interval = setInterval(decreaseGamePercentage, 30000);
        return () => clearInterval(interval);
    }, [user, clientId]);

    useEffect(() => {
        if (!user || !clientId) return;

        const decreaseFoodPercentage = async () => {
            setGlobalData(prev => {
                const newPercentage = Math.max((prev.foodPercentage || 0) - 2, 0);
                if (newPercentage !== prev.foodPercentage) {
                    updateFoodPercentage(newPercentage - prev.foodPercentage);
                }
                return { ...prev, foodPercentage: newPercentage };
            });
        };

        const interval = setInterval(decreaseFoodPercentage, 30000);
        return () => clearInterval(interval);
    }, [user, clientId]);

    useEffect(() => {
        if (!user || !clientId) return;

        const decreaseSleepPercentage = async () => {
            setGlobalData(prev => {
                const newPercentage = Math.max((prev.sleepPercentage || 0) - 3, 0);
                if (newPercentage !== prev.sleepPercentage) {
                    updateSleepPercentage(newPercentage - prev.sleepPercentage);
                }
                return { ...prev, sleepPercentage: newPercentage };
            });
        };

        const interval = setInterval(decreaseSleepPercentage, 30000);
        return () => clearInterval(interval);
    }, [user, clientId]);

    const decreaseFoodPercentageOnGamePlay = async () => {
        if (!user || !clientId) return;

        try {
            setGlobalData(prev => {
                const newPercentage = Math.max((prev.foodPercentage || 0) - 5, 0);
                if (newPercentage !== prev.foodPercentage) {
                    updateFoodPercentage(newPercentage - prev.foodPercentage);
                }
                return { ...prev, foodPercentage: newPercentage };
            });
        } catch (error) {
            console.error("Error decreasing food percentage on gameplay:", error);
            throw error;
        }
    };

    const incrementGamePercentage = async (amount) => {
        if (!user || !clientId) return;

        try {
            const updatedData = await globalDataService.updateGamePercentage(amount, clientId);
            setGlobalData(prev => ({
                ...prev,
                gamePercentage: updatedData.gamePercentage,
            }));
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
            setGlobalData(prev => ({
                ...prev,
                foodPercentage: updatedData.foodPercentage,
            }));
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
            setGlobalData(prev => ({
                ...prev,
                sleepPercentage: updatedData.sleepPercentage,
            }));
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
                coins: updatedData.coins,
            }));
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
            setGlobalData(prev => ({
                ...prev,
                trophies: updatedData.trophies,
            }));
            return updatedData;
        } catch (error) {
            console.error("Error updating trophies:", error);
            throw error;
        }
    };

    const refreshUserData = async () => {
        if (!user || !clientId) return;

        try {
            const userData = await globalDataService.getUserData(user.uid, setClientId);
            setGlobalData(userData);
            const traits = await personalityService.getPersonalityTraits(clientId);
            setPersonalityTraits(traits);
            return userData;
        } catch (error) {
            console.error("Error refreshing user data:", error);
            throw error;
        }
    };

    const value = {
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
        incrementGamePercentage,
        decreaseFoodPercentageOnGamePlay,
        updateFoodPercentage,
        updateSleepPercentage,
        error,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};