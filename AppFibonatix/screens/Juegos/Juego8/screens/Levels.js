import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, StatusBar, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Fontisto from '@expo/vector-icons/Fontisto';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Fuentes personalizadas
import useCustomFonts from '../../../../apis/FontsConfigure';

// Configuración de niveles
import { LEVEL_CONFIG } from './levelConfig';

function Levels({ navigation }) {
  const [unlockedLevels, setUnlockedLevels] = useState([1]);  // Nivel 1 desbloqueado siempre
  
  // Si las fuentes no están cargadas, se retorna null
  const { fontsLoaded, onLayoutRootView } = useCustomFonts();
  if (!fontsLoaded) return null;

  // Cargar los niveles desbloqueados al abrir la pantalla
  const loadUnlockedLevels = async () => {
    try {
      const storedLevels = await AsyncStorage.getItem('@unlocked_levels');
      if (storedLevels !== null) {
        setUnlockedLevels(JSON.parse(storedLevels));
      }
    } catch (error) {
      console.error('Error al cargar los niveles desbloqueados:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadUnlockedLevels();  
    });
    return unsubscribe;
  }, [navigation]);

  const renderLevels = () => {
    const totalLevels = Object.keys(LEVEL_CONFIG).length;  
    return [...Array(totalLevels)].map((_, i) => {
      const level = i + 1;
      const isUnlocked = unlockedLevels.includes(level);

      return (
        <Pressable
          key={level}
          style={({ pressed }) => [
            styles.levelButton,
            !isUnlocked && styles.lockedButton,
            {
              backgroundColor: isUnlocked
                ? pressed
                  ? '#700010' // Color oscurecido al presionar
                  : '#800020' // Color original del juego 2
                : '#F998B5', // Color de botón bloqueado del juego 2
            },
          ]}
          onPress={() => {
            if (isUnlocked) {
              navigation.navigate('GameLevel', { levelNumber: level });
            } else {
              Alert.alert(
                'Nivel Bloqueado',
                'Completa los niveles anteriores para desbloquear este nivel.'
              );
            }
          }}
        >
          <Text style={styles.levelButtonText}>
            {isUnlocked ? `Nivel ${level}` : <Fontisto name="locked" size={24} color="#800020" />}
          </Text>
        </Pressable>
      );
    });
  };

  return (
    <SafeAreaView style={styles.container} onLayout={onLayoutRootView}>
      <StatusBar backgroundColor="transparent" barStyle="dark-content" />

      <View style={styles.header}>
        <Text style={styles.headerText}>Selección de Nivel</Text>
      </View>

      <View style={styles.blueBackground}>
        <ScrollView
          contentContainerStyle={styles.levelsContainer}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {renderLevels()}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F998B6', // Color de fondo del juego 2
  },
  header: {
    backgroundColor: '#CE3558', // Color del header del juego 2
    marginHorizontal: 10,
    paddingVertical: 20,
    borderRadius: 30,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 30,
    color: '#630F11', // Color del texto del juego 2
    fontFamily: 'Quicksand',
    textTransform: 'uppercase',
  },
  blueBackground: {
    backgroundColor: '#E56587', // Color del background del juego 2
    borderRadius: 20,
    margin: 10,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    padding: 20,
    borderRadius: 30,
    width: '100%',
    gap: 20,
  },
  levelButton: {
    backgroundColor: '#800020', // Color del botón del juego 2
    paddingVertical: 15,
    paddingHorizontal: 78,
    borderRadius: 15,
    marginBottom: 10,
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelButtonText: {
    fontSize: 20,
    fontFamily: 'Quicksand',
    color: '#FFFFFF',
  },
  lockedButton: {
    backgroundColor: '#F998B5', // Color del botón bloqueado del juego 2
  },
});

export default Levels;