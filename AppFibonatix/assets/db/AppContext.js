import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { globalDataService, personalityService } from './ApiService';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [globalData, setGlobalData] = useState({
        coins: 0,
        trophies: 0,
        gamePercentage: 0,
        foodPercentage: 0,
        sleepPercentage: 0
    });
    const [personalityTraits, setPersonalityTraits] = useState([]);
    const [error, setError] = useState(null);

    // Escuchar cambios en la autenticación
    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            setError(null); // Reinicia el error
            
            if (currentUser) {
                try {
                    const userData = await globalDataService.getUserData(currentUser.uid);
                    setGlobalData(userData);
                    
                    const traits = await personalityService.getPersonalityTraits(currentUser.uid);
                    setPersonalityTraits(traits);
                } catch (error) {
                    console.error("Error loading user data:", error);
                    setError("No se pudieron cargar los datos del usuario. Por favor, intenta de nuevo.");
                }
            }
            
            setLoading(false);
        });
        
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const decreaseGamePercentage = () => {
            setGlobalData(prev => {
                const newPercentage = Math.max((prev.gamePercentage || 0) - 10, 0); // Disminuye 10%, mínimo 0
                return { ...prev, gamePercentage: newPercentage };
            });
        };
    
        const interval = setInterval(decreaseGamePercentage, 30000); // Cada 30 segundos (30000 ms)
        return () => clearInterval(interval);
    }, []);

    const incrementGamePercentage = async (amount) => {
        if (!user) return;
    
        try {
            const updatedData = await globalDataService.updateGamePercentage(amount);
            setGlobalData(prev => ({
                ...prev,
                gamePercentage: updatedData.gamePercentage
            }));
            return updatedData;
        } catch (error) {
            console.error("Error updating game percentage:", error);
            throw error;
        }
    };

    // Métodos para actualizar datos
    const updateCoins = async (amount) => {
        if (!user) return;
        
        try {
            const updatedData = await globalDataService.updateCoins(amount); // Elimina user.uid
            setGlobalData(prev => ({
                ...prev,
                coins: updatedData.coins
            }));
            return updatedData;
        } catch (error) {
            console.error("Error updating coins:", error);
            throw error;
        }
    };
    
    const updateTrophies = async (amount) => {
        if (!user) return;
        
        try {
            const updatedData = await globalDataService.updateTrophies(amount); // Elimina user.uid
            setGlobalData(prev => ({
                ...prev,
                trophies: updatedData.trophies
            }));
            return updatedData;
        } catch (error) {
            console.error("Error updating trophies:", error);
            throw error;
        }
    };

    const refreshUserData = async () => {
        if (!user) return;
        
        try {
            const userData = await globalDataService.getUserData(user.uid);
            setGlobalData(userData);
            
            const traits = await personalityService.getPersonalityTraits(user.uid);
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
        globalData,
        personalityTraits,
        updateCoins,
        updateTrophies,
        refreshUserData,
        incrementGamePercentage,
        error // Añade el estado de error
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};