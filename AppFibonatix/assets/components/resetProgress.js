// Componente para eliminar el progreso de los juegos.
import AsyncStorage from '@react-native-async-storage/async-storage';

// Reinicia el progreso del primer juego
export const resetFirstGameProgress = async () => {
    try {
        // Borrar niveles desbloqueados
        await AsyncStorage.removeItem("unlockedLevelsMemorama");

        // Borrar mejores puntajes
        const keys = await AsyncStorage.getAllKeys();
        const scoreKeys = keys.filter((key) => key.startsWith("bestScoreNivel"));
        await AsyncStorage.multiRemove(scoreKeys);

        // Eliminar el indicador de "ha jugado antes"
        await AsyncStorage.removeItem("hasPlayedBefore");

        return true; // Retorna true si se completó sin errores
    } catch (error) {
        console.error("Error al reiniciar el progreso del primer juego:", error);
        return false; // Retorna false si hubo un error
    }
};

// Reinicia el progreso del segundo juego
export const resetSecondGameProgress = async () => {
    try {
        // Eliminar datos de progreso
        await AsyncStorage.removeItem('unlockedLevels');
        await AsyncStorage.removeItem('hasPlayedBefore'); // Eliminar el flag
        const keys = await AsyncStorage.getAllKeys();
        const bestTimeKeys = keys.filter((key) => key.startsWith('bestTime_level_'));
        await AsyncStorage.multiRemove(bestTimeKeys);

        return true; // Retorna true si se completó sin errores
    } catch (error) {
        console.error("Error al reiniciar el progreso del segundo juego:", error);
        return false; // Retorna false si hubo un error
    }
};
