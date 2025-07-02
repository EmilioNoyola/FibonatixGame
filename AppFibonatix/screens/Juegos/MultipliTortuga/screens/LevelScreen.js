import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, StatusBar, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Fontisto from '@expo/vector-icons/Fontisto';
import { RFPercentage } from 'react-native-responsive-fontsize';
import useCustomFonts from '../../../../assets/components/FontsConfigure';
import CustomAlert from '../../../../assets/components/CustomAlert';
import { useAppContext } from '../../../../assets/context/AppContext';
import { gameService } from '../../../../assets/services/ApiService';

const { width } = Dimensions.get("window");
const scale = width / 414;

function LevelScreen({ navigation }) {
  const { clientId } = useAppContext();
  const [unlockedLevels, setUnlockedLevels] = useState([1]);
  const [alerts, setAlerts] = useState({ type: null, visible: false });

  const showAlert = (type) => setAlerts({ type, visible: true });
  const hideAlert = () => setAlerts({ ...alerts, visible: false });

  const { fontsLoaded, onLayoutRootView } = useCustomFonts();
  if (!fontsLoaded) return null;

  const loadUnlockedLevels = async () => {
    if (!clientId) return;
    try {
      const levelsUnlocked = await gameService.getUnlockedLevels(clientId, 2);
      const levelsArray = Array.from({ length: levelsUnlocked }, (_, i) => i + 1);
      setUnlockedLevels(levelsArray.length > 0 ? levelsArray : [1]);
    } catch (error) {
      console.error("Error al cargar los niveles desbloqueados desde la base de datos:", error);
      setUnlockedLevels([1]);
    }
  };

  useEffect(() => {
    loadUnlockedLevels();
  }, [clientId]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadUnlockedLevels();
    });
    return unsubscribe;
  }, [navigation]);

  const allLevels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

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
          {allLevels.map((level) => (
            <Pressable
              key={level}
              onPress={() => {
                if (unlockedLevels.includes(level)) {
                  navigation.navigate("GameScreen", { level });
                } else {
                  showAlert("Nivel Bloqueado");
                }
              }}
              style={({ pressed }) => [
                unlockedLevels.includes(level)
                  ? {
                      backgroundColor: pressed ? '#40976C' : '#40916C',
                    }
                  : {
                      backgroundColor: '#B7E4C7',
                    },
                styles.levelButton,
              ]}
              disabled={!unlockedLevels.includes(level)}
            >
              <Text style={styles.levelButtonText}>
                {unlockedLevels.includes(level) ? `Nivel ${level}` : <Fontisto name="locked" size={24 * scale} color="#40916C" />}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>
      {alerts.visible && (
        <CustomAlert
          showAlert={alerts.visible}
          title="Nivel Bloqueado"
          message="Este nivel está bloqueado. Completa los niveles anteriores para desbloquearlo."
          onConfirm={hideAlert}
          confirmText="Aceptar"
          confirmButtonColor="#429f74"
          cancelButtonColor="#9ed7bd"
        />
      )}
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
    marginHorizontal: 10 * scale,
    paddingVertical: 20 * scale,
    borderRadius: 30 * scale,
    alignItems: 'center',
  },
  headerText: {
    fontSize: RFPercentage(4),
    color: '#1B4332',
    fontFamily: 'Quicksand',
    textTransform: 'uppercase',
  },
  greenBackground: {
    backgroundColor: '#A7DDB5',
    borderRadius: 20 * scale,
    margin: 10 * scale,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    padding: 20 * scale,
    borderRadius: 30 * scale,
    width: '100%',
    gap: 20 * scale,
  },
  levelButton: {
    paddingVertical: 15 * scale,
    paddingHorizontal: 78 * scale,
    borderRadius: 15 * scale,
    marginBottom: 10 * scale,
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelButtonText: {
    fontSize: RFPercentage(3),
    fontFamily: 'Quicksand',
    color: '#FFFFFF',
  },
});

export default LevelScreen;