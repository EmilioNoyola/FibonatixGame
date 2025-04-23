import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Fontisto from '@expo/vector-icons/Fontisto';

// Fuentes personalizadas
import useCustomFonts from '../../../../assets/apis/FontsConfigure';

function LevelScreen({ navigation, route }) {
  // Si las fuentes no están cargadas, se retorna null
  const { fontsLoaded, onLayoutRootView } = useCustomFonts();
  if (!fontsLoaded) return null;

  // Estado inicial de niveles desbloqueados (todos desbloqueados por defecto)
  const unlockedLevels = [1, 2, 3, 4, 5, 6];

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
          {[...Array(12)].map((_, i) => {
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
                        ? '#40976C'
                        : '#40916C'
                      : '#B7E4C7',
                  },
                ]}
                onPress={() => {
                  if (isUnlocked) {
                    navigation.navigate('GameScreen', { level });
                  }
                }}
              >
                <Text style={styles.levelButtonText}>
                  {isUnlocked ? `Nivel ${level}` : <Fontisto name="locked" size={24} color="#40916C" />}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D8F3DC',
  },
  header: {
    backgroundColor: '#74C69D',
    marginHorizontal: 10,
    paddingVertical: 20,
    borderRadius: 30,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 30,
    color: '#1B4332', 
    fontFamily: 'Quicksand',
    textTransform: 'uppercase',
  },
  greenBackground: {
    backgroundColor: '#A7DDB5', 
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
    backgroundColor: '#40916C', 
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
    backgroundColor: '#B7E4C7', 
  },
});

export default LevelScreen;