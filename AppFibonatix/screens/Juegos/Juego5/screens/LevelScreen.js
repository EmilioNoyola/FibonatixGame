import React from 'react';
import LevelComponent from './LevelComponent';
import levelsConfig from './LevelsConfig';

const LevelScreen = ({ navigation, route }) => {
    const { levelId } = route.params;
    
    // Encontrar la configuración del nivel basado en el ID
    const levelData = levelsConfig.find(level => level.id === levelId);
    
    // Si no se encuentra el nivel, podemos manejar el error o redirigir
    if (!levelData) {
        // Opción 1: Volver a la pantalla de selección de niveles
        navigation.goBack();
        return null;
        
        // Opción 2: Mostrar un mensaje de error
        // return <Text>Nivel no encontrado</Text>;
    }
    
    return <LevelComponent navigation={navigation} levelConfig={levelData.config} />;
};

export default LevelScreen;