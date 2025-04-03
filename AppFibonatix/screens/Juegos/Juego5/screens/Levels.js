import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Fontisto from '@expo/vector-icons/Fontisto';

// Fuentes personalizadas
import useCustomFonts from '../../../../apis/FontsConfigure';

// Importamos la configuración de niveles centralizada
import levelsConfig from './LevelsConfig';

function Levels({ navigation }) {
  // Los niveles desbloqueados desde el inicio (puedes cambiar la lógica para desbloquear progresivamente)
  const [unlockedLevels, setUnlockedLevels] = useState([1, 2, 3]);
  
  // Si las fuentes no están cargadas, se retorna null
  const { fontsLoaded, onLayoutRootView } = useCustomFonts();
  if (!fontsLoaded) return null;

  const renderLevels = () => {
    return levelsConfig.map((level) => {
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
                  ? '#B757C2' // Color oscurecido al presionar
                  : '#D669E7' // Color original
                : '#B0C9E4', // Color de botón bloqueado
            },
          ]}
          onPress={() => {
            if (isUnlocked) {
              navigation.navigate('LevelScreen', { levelId: level.id });
            }
          }}
        >
          <Text style={styles.levelButtonText}>
            {level.name}
          </Text>
          {isUnlocked && (
            <Text style={styles.levelDescription}>
              {level.description}
            </Text>
          )}
          {!isUnlocked && (
            <Text style={styles.lockedText}>
              <Fontisto name="locked" size={14} color="#485C73" /> Bloqueado
            </Text>
          )}
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

      <View style={styles.pinkBackground}>
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
    backgroundColor: '#FFDDF5',
  },
  header: {
    backgroundColor: '#F39FFB',
    marginHorizontal: 10,
    paddingVertical: 20,
    borderRadius: 30,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 30,
    color: '#701F6B', 
    fontFamily: 'Quicksand',
    textTransform: 'uppercase',
  },
  pinkBackground: {
    backgroundColor: '#F9BCFF', 
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
    backgroundColor: '#D669E7', 
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 15,
    marginBottom: 10,
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelButtonText: {
    fontSize: 20,
    fontFamily: 'Quicksand',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  levelDescription: {
    fontSize: 14,
    fontFamily: 'Quicksand',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  lockedButton: {
    backgroundColor: '#B0C9E4', 
  },
  lockedText: {
    fontSize: 14,
    fontFamily: 'Quicksand',
    color: '#485C73',
  },
});

export default Levels;