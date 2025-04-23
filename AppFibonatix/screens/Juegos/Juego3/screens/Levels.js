import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, StatusBar, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Fontisto from '@expo/vector-icons/Fontisto';

// Fuentes personalizadas
import useCustomFonts from '../../../../assets/apis/FontsConfigure';

function Levels({ navigation, unlockedLevels = [], route }) {
  // Si las fuentes no están cargadas, se retorna null
  const { fontsLoaded, onLayoutRootView } = useCustomFonts();
  if (!fontsLoaded) return null;

  const totalLevels = route.params?.levelConfigs?.length || 5; // Usa la cantidad de niveles configurados o 5 por defecto

  const renderLevels = () => {
    return [...Array(totalLevels)].map((_, i) => {
      const level = i + 1;
      const isUnlocked = level === 1 || (Array.isArray(unlockedLevels) && unlockedLevels.includes(level));

      return (
        <Pressable
          key={level}
          style={({ pressed }) => [
            styles.levelButton,
            !isUnlocked && styles.lockedButton,
            {
              backgroundColor: isUnlocked
                ? pressed
                  ? '#355CC7' // Oscurecido
                  : '#355CC7' // Color original
                : '#9DDBF5', // Color de botón bloqueado
            },
          ]}
          onPress={() => {
            if (isUnlocked) {
              try {
                navigation.navigate('GameLevel', { 
                  levelNumber: level,
                  levelConfig: route.params?.levelConfigs[i]
                });
              } catch (error) {
                Alert.alert('Error', 'No se pudo abrir el nivel.');
              }
            } else {
              Alert.alert(
                'Nivel Bloqueado',
                'Completa los niveles anteriores para desbloquear este nivel.'
              );
            }
          }}
        >
          <Text style={styles.levelButtonText}>
            {isUnlocked ? `Nivel ${level}` : <Fontisto name="locked" size={24} color="#408FF7" />}
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
    backgroundColor: '#9DDBF5',
  },
  header: {
    backgroundColor: '#408FF7',
    marginHorizontal: 10,
    paddingVertical: 20,
    borderRadius: 30,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 30,
    color: '#00296F', 
    fontFamily: 'Quicksand',
    textTransform: 'uppercase',
  },
  blueBackground: {
    backgroundColor: '#6EB3F4', 
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
    backgroundColor: '#355CC7', 
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
    backgroundColor: '#9DDBF5', 
  },
});

export default Levels;