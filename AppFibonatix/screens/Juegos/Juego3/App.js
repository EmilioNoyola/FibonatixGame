import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import 'react-native-gesture-handler';
import Levels from './screens/Levels';
import GameLevel from './screens/GameLevel';
import AsyncStorage from '@react-native-async-storage/async-storage';
import levelConfigs from './screens/LevelConfig';

const Stack = createStackNavigator();

export default function App() {
  const [unlockedLevels, setUnlockedLevels] = useState([1]); // Nivel 1 siempre desbloqueado

  useEffect(() => {
    const loadUnlockedLevels = async () => {
      try {
        const levels = await AsyncStorage.getItem('unlockedLevels');
        if (levels) {
          const parsedLevels = JSON.parse(levels).filter(
            (level) => Number.isInteger(level) && level >= 1
          );
          setUnlockedLevels(parsedLevels);
        } else {
          setUnlockedLevels([1]); // Si no hay datos, desbloquea solo el Nivel 1
        }
      } catch (error) {
        console.error('Error loading unlocked levels:', error);
        setUnlockedLevels([1]); // Fallback a Nivel 1 si hay error
      }
    };

    loadUnlockedLevels();
  }, []);

  const saveUnlockedLevels = async (levels) => {
    try {
      const uniqueLevels = [...new Set(levels)].filter(
        (level) => Number.isInteger(level) && level >= 1
      );
      await AsyncStorage.setItem('unlockedLevels', JSON.stringify(uniqueLevels));
    } catch (error) {
      console.error('Error saving unlocked levels:', error);
    }
  };

  const renderScreen = (Component) => (props) => (
    <Component
      {...props}
      unlockedLevels={unlockedLevels}
      setUnlockedLevels={(levels) => {
        setUnlockedLevels(levels);
        saveUnlockedLevels(levels);
      }}
    />
  );

  return (
      <Stack.Navigator initialRouteName="Levels">
        <Stack.Screen
          name="Levels"
          options={{ headerShown: false }}
        >
          {(props) => renderScreen(Levels)({
            ...props,
            levelConfigs: levelConfigs, // Pasa las configuraciones de nivel a Levels
          })}
        </Stack.Screen>

        <Stack.Screen
          name="GameLevel"
          component={GameLevel}
          options={{ headerShown: false }}
          initialParams={{ 
            unlockedLevels: unlockedLevels,
            setUnlockedLevels: (levels) => {
              setUnlockedLevels(levels);
              saveUnlockedLevels(levels);
            },
            levelConfigs: levelConfigs
          }}
        />
      </Stack.Navigator>
  );
}