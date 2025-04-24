import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, StatusBar, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Fontisto from '@expo/vector-icons/Fontisto';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Fuentes personalizadas
import useCustomFonts from '../../../../assets/components/FontsConfigure';
import { levels } from './levelData';

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
    return levels.map((level) => {
      const isUnlocked = unlockedLevels.includes(level.id);

      return (
        <Pressable
          key={level.id}
          style={({ pressed }) => [
            styles.levelButton,
            !isUnlocked && styles.lockedButton,
            {
              backgroundColor: isUnlocked
                ? pressed
                  ? '#1FAB1F' // Color oscurecido al presionar
                  : '#2FBB2F' // Color original del juego 2
                : '#DDFFDA', // Color de botón bloqueado del juego 2
            },
          ]}
          onPress={() => {
            if (isUnlocked) {
              navigation.navigate('LevelScreen', { levelId: level.id });
            } else {
              Alert.alert(
                'Nivel Bloqueado',
                'Completa los niveles anteriores para desbloquear este nivel.'
              );
            }
          }}
        >
          <Text style={styles.levelButtonText}>
            {isUnlocked ? level.title : <Fontisto name="locked" size={24} color="#2FBB2F" />}
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

      <View style={styles.greenBackground}>
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
    backgroundColor: '#C0F8BC', // Color de fondo del juego 2
  },
  header: {
    backgroundColor: '#67E96E', // Color del header del juego 2
    marginHorizontal: 10,
    paddingVertical: 20,
    borderRadius: 30,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 30,
    color: '#1F7023', // Color del texto del juego 2
    fontFamily: 'Quicksand',
    textTransform: 'uppercase',
  },
  greenBackground: {
    backgroundColor: '#90F0A5', // Color del background del juego 2
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
    backgroundColor: '#2FBB2F', // Color del botón del juego 2
    paddingVertical: 15,
    paddingHorizontal: 70,
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
    backgroundColor: '#DDFFDA', // Color del botón bloqueado del juego 2
  },
});

export default Levels;