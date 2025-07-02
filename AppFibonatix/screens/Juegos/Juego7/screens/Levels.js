import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, StatusBar, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Fontisto from '@expo/vector-icons/Fontisto';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { useAppContext } from '../../../../assets/context/AppContext';
import { gameService } from '../../../../assets/services/ApiService';
import CustomAlert from '../../../../assets/components/CustomAlert';

const { width, height } = Dimensions.get("window");
const scale = width / 414;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C0F8BC',
  },
  header: {
    backgroundColor: '#67E96E',
    marginHorizontal: 10 * scale,
    paddingVertical: 20 * scale,
    borderRadius: 30 * scale,
    alignItems: 'center',
  },
  headerText: {
    fontSize: RFPercentage(4),
    color: '#1F7023',
    fontFamily: 'Quicksand',
    textTransform: 'uppercase',
  },
  greenBackground: {
    backgroundColor: '#90F0A5',
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
    paddingHorizontal: 70 * scale,
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
    backgroundColor: '#DDFFDA',
  },
});

function Levels({ navigation }) {
  const { clientId } = useAppContext();
  const [unlockedLevels, setUnlockedLevels] = useState([1]);
  const [alerts, setAlerts] = useState({ type: null, visible: false });
  const [loading, setLoading] = useState(true);

  const showAlert = (type) => setAlerts({ type, visible: true });
  const hideAlert = () => setAlerts({ ...alerts, visible: false });

  // Cargar niveles desbloqueados desde la base de datos
  const loadUnlockedLevels = async () => {
    try {
      if (!clientId) {
        console.warn("No clientId available, skipping data load.");
        setUnlockedLevels([1]);
        return;
      }

      // Cargar niveles desbloqueados desde la base de datos
      const levelsUnlocked = await gameService.getUnlockedLevels(clientId, 4); // gameID = 4 para Tortuga Alimenticia
      const levelsArray = Array.from({ length: levelsUnlocked }, (_, i) => i + 1);
      setUnlockedLevels(levelsArray.length > 0 ? levelsArray : [1]);
    } catch (error) {
      console.error("Error al cargar niveles desbloqueados:", error);
      setUnlockedLevels([1]);
    } finally {
      setLoading(false);
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
    return [1, 2, 3, 4].map((levelId) => {
      const isUnlocked = unlockedLevels.includes(levelId);
      const levelData = {
        1: { title: "Fácil" },
        2: { title: "Intermedio" },
        3: { title: "Difícil" },
        4: { title: "Experto" }
      }[levelId];

      return (
        <Pressable
          key={levelId}
          style={({ pressed }) => [
            styles.levelButton,
            !isUnlocked && styles.lockedButton,
            {
              backgroundColor: isUnlocked
                ? pressed
                  ? '#1FAB1F'
                  : '#2FBB2F'
                : '#DDFFDA',
            },
          ]}
          onPress={() => {
            if (isUnlocked) {
              navigation.navigate('LevelScreen', { levelId });
            } else {
              showAlert("Nivel Bloqueado");
            }
          }}
        >
          <Text style={styles.levelButtonText}>
            {isUnlocked ? levelData.title : <Fontisto name="locked" size={24 * scale} color="#2FBB2F" />}
          </Text>
        </Pressable>
      );
    });
  };

  const mostrarTituloAlerta = (type) => {
    switch (type) {
      case "Nivel Bloqueado":
        return "Nivel Bloqueado";
      default:
        return "Alerta";
    }
  };

  const mostrarMensajeAlerta = (type) => {
    switch (type) {
      case "Nivel Bloqueado":
        return "Completa los niveles anteriores para desbloquear este nivel.";
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
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

      {alerts.visible && (
        <CustomAlert
          showAlert={alerts.visible}
          title={mostrarTituloAlerta(alerts.type)}
          message={mostrarMensajeAlerta(alerts.type)}
          onConfirm={hideAlert}
          confirmText="Aceptar"
          confirmButtonColor={"#2FBB2F"}
        />
      )}
    </SafeAreaView>
  );
}

export default Levels;