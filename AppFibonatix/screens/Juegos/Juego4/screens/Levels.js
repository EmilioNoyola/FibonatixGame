import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, StatusBar, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Fontisto from '@expo/vector-icons/Fontisto';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Fuentes personalizadas
import useCustomFonts from '../../../../assets/components/FontsConfigure';

function Levels({ navigation }) {
  const [unlockedLevels, setUnlockedLevels] = useState([1]);  // Nivel 1 desbloqueado por defecto
  
  // Si las fuentes no están cargadas, se retorna null
  const { fontsLoaded, onLayoutRootView } = useCustomFonts();
  if (!fontsLoaded) return null;

  // Cargar los niveles desbloqueados al abrir la pantalla
  const loadUnlockedLevels = async () => {
    try {
      const storedLevels = await AsyncStorage.getItem('@unlocked_levels');
      if (storedLevels !== null) {
        setUnlockedLevels(JSON.parse(storedLevels));  // Cargar niveles desbloqueados
      }
    } catch (error) {
      console.error('Error al cargar los niveles desbloqueados:', error);
    }
  };

  // Cargar niveles al montar el componente
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadUnlockedLevels();  // Se carga cada vez que vuelves a la pantalla
    });

    return unsubscribe;
  }, [navigation]);

  const renderLevels = () => {
    // Obtén el total de niveles desde el archivo de configuración de GameConfig
    const totalLevels = 3;  // Ahora tenemos 3 niveles disponibles
    
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
                  ? '#8B7400' // Color oscurecido al presionar
                  : '#A38800' // Color original
                : '#A39600', // Color de botón bloqueado
            },
          ]}
          onPress={() => {
            if (isUnlocked) {
              // Ahora navegamos al componente GameLevel con el parámetro levelId
              navigation.navigate('GameLevel', { levelId: level });
            } else {
              Alert.alert(
                'Nivel Bloqueado',
                'Completa los niveles anteriores para desbloquear este nivel.'
              );
            }
          }}
        >
          <Text style={styles.levelButtonText}>
            {isUnlocked ? `Nivel ${level}` : <Fontisto name="locked" size={24} color="#FBDF2E" />}
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

      <View style={styles.yellowBackground}>
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
    backgroundColor: '#F5EEBC',
  },
  header: {
    backgroundColor: '#FBDF2E',
    marginHorizontal: 10,
    paddingVertical: 20,
    borderRadius: 30,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 30,
    color: '#A38800', 
    fontFamily: 'Quicksand',
    textTransform: 'uppercase',
  },
  yellowBackground: {
    backgroundColor: '#F5E47B', 
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
    backgroundColor: '#A38800', 
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
    backgroundColor: '#A39600', 
  },
});

export default Levels;