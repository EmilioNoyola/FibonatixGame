import React, { createContext, useContext, useState, useEffect } from 'react';
import '../services/Credentials'; 
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { globalDataService, personalityService, connectWebSocket } from '../services/ApiService';

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
                const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
                if (userDoc.exists()) {
                    setLicense(userDoc.data().license);
                } else {
                    throw new Error('User document not found in Firestore');
                }
    
                let fetchedClientId;
                try {
                    fetchedClientId = await globalDataService.getUserData(currentUser.uid, setClientId);
                    setGlobalData(fetchedClientId || {
                        coins: 0,
                        trophies: 0,
                        gamePercentage: 0,
                        foodPercentage: 0,
                        sleepPercentage: 0,
                    });
                } catch (error) {
                    console.error('Error fetching global data:', error);
                    setGlobalData({
                        coins: 0,
                        trophies: 0,
                        gamePercentage: 0,
                        foodPercentage: 0,
                        sleepPercentage: 0,
                    });
                }
    
                if (clientId || fetchedClientId) {
                    try {
                        const traits = await personalityService.getPersonalityTraits(clientId || fetchedClientId);
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
    }, [clientId]);

    useEffect(() => {
        if (!user || !clientId) return;

        const cleanupWebSocket = connectWebSocket(clientId, (data) => {
            setGlobalData(data);
        });

        return () => {
            cleanupWebSocket();
        };
    }, [user, clientId]);

    const decreaseFoodPercentageOnGamePlay = async () => {
        if (!user || !clientId) return;

        try {
            const amount = -5;
            const updatedData = await globalDataService.updateFoodPercentage(amount, clientId);
            setGlobalData(prev => ({
                ...prev,
                foodPercentage: updatedData.foodPercentage,
            }));
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