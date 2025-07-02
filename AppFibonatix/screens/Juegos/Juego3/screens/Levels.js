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

function Levels({ navigation, route }) {
  const { clientId } = useAppContext();
  const [unlockedLevels, setUnlockedLevels] = useState([1]);
  const [alerts, setAlerts] = useState({ type: null, visible: false });

  const showAlert = (type) => setAlerts({ type, visible: true });
  const hideAlert = () => setAlerts({ ...alerts, visible: false });

  const { fontsLoaded, onLayoutRootView } = useCustomFonts();
  if (!fontsLoaded) return null;

  const totalLevels = route.params?.levelConfigs?.length || 5;

  const loadUnlockedLevels = async () => {
    if (!clientId) return;
    try {
      const levelsUnlocked = await gameService.getUnlockedLevels(clientId, 3);
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

  const renderLevels = () => {
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
                  ? '#2A4BA0'
                  : '#355CC7'
                : '#9DDBF5',
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
                showAlert("Error");
              }
            } else {
              showAlert("Nivel Bloqueado");
            }
          }}
        >
          <Text style={styles.levelButtonText}>
            {isUnlocked ? `Nivel ${level}` : <Fontisto name="locked" size={24 * scale} color="#408FF7" />}
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
      {alerts.visible && (
        <CustomAlert
          showAlert={alerts.visible}
          title={alerts.type === "Nivel Bloqueado" ? "Nivel Bloqueado" : "Error"}
          message={
            alerts.type === "Nivel Bloqueado"
              ? "Completa los niveles anteriores para desbloquear este nivel."
              : "No se pudo abrir el nivel."
          }
          onConfirm={hideAlert}
          confirmText="Aceptar"
          confirmButtonColor="#355CC7"
          cancelButtonColor="#9DDBF5"
        />
      )}
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
    marginHorizontal: 10 * scale,
    paddingVertical: 20 * scale,
    borderRadius: 30 * scale,
    alignItems: 'center',
  },
  headerText: {
    fontSize: RFPercentage(4),
    color: '#00296F',
    fontFamily: 'Quicksand',
    textTransform: 'uppercase',
  },
  blueBackground: {
    backgroundColor: '#6EB3F4',
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
  lockedButton: {
    backgroundColor: '#9DDBF5',
  },
});

export default Levels;