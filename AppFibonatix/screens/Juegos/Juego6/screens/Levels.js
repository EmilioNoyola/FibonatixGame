import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, StatusBar, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Fontisto from '@expo/vector-icons/Fontisto';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Fuentes personalizadas
import useCustomFonts from '../../../../assets/components/FontsConfigure';

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
    const totalLevels = 6;  
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
                  ? '#6351D9' // Color oscurecido al presionar
                  : '#7A65FB' // Color original
                : '#EEE4FF', // Color de botón bloqueado
            },
          ]}
          onPress={() => {
            if (isUnlocked) {
              // Navegar al componente genérico de nivel pasando el número de nivel como parámetro
              navigation.navigate('GameLevel', { levelNumber: level });
            } else {
              Alert.alert(
                'Nivel Bloqueado',
                'Completa los niveles anteriores para desbloquear este nivel.'
              );
            }
          }}
        >
          <Text style={[
            styles.levelButtonText,
            !isUnlocked && styles.lockedButtonText
          ]}>
            {isUnlocked ? `Nivel ${level}` : <Fontisto name="locked" size={24} color="#A590FF" />}
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

      <View style={styles.purpleBackground}>
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
    backgroundColor: '#EEE4FF',
  },
  header: {
    backgroundColor: '#A590FF',
    marginHorizontal: 10,
    paddingVertical: 20,
    borderRadius: 30,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 30,
    color: '#3B1F70', 
    fontFamily: 'Quicksand',
    textTransform: 'uppercase',
  },
  purpleBackground: {
    backgroundColor: '#CDC1FF', 
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
    backgroundColor: '#7A65FB', 
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
    backgroundColor: '#EEE4FF', 
  },
});

export default Levels;