import React, { useState, useEffect } from "react";
import { View, Text, Pressable, StyleSheet, ScrollView, StatusBar, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Fontisto from "@expo/vector-icons/Fontisto";
import { RFPercentage } from "react-native-responsive-fontsize";
import useCustomFonts from "../../../../assets/components/FontsConfigure";
import CustomAlert from "../../../../assets/components/CustomAlert";
import { useAppContext } from "../../../../assets/context/AppContext";
import { gameService } from "../../../../assets/services/ApiService";

const { width } = Dimensions.get("window");
const scale = width / 414;

function Levels({ navigation }) {
  const { clientId } = useAppContext();
  const [unlockedLevels, setUnlockedLevels] = useState([1]);
  const [alerts, setAlerts] = useState({ type: null, visible: false });

  const showAlert = (type) => setAlerts({ type, visible: true });
  const hideAlert = () => setAlerts({ ...alerts, visible: false });

  const { fontsLoaded, onLayoutRootView } = useCustomFonts();
  if (!fontsLoaded) return null;

  const loadUnlockedLevels = async () => {
    try {
      if (!clientId) {
        setUnlockedLevels([1]);
        return;
      }
      const levelsUnlocked = await gameService.getUnlockedLevels(clientId, 6);
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
    const unsubscribe = navigation.addListener("focus", () => {
      loadUnlockedLevels();
    });
    return unsubscribe;
  }, [navigation]);

  const allLevels = [1, 2, 3, 4, 5, 6];

  return (
    <SafeAreaView style={styles.container} onLayout={onLayoutRootView}>
      <StatusBar backgroundColor="transparent" barStyle="dark-content" />
      <View style={[styles.header, { backgroundColor: "#A590FF" }]}>
        <Text style={styles.textoTitulo}>Selección de Nivel</Text>
      </View>
      <View style={[styles.levelsContainer, { backgroundColor: "#CDC1FF" }]}>
        <ScrollView
          contentContainerStyle={styles.levels}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {allLevels.map((level) => (
            <Pressable
              key={level}
              onPress={() => {
                if (unlockedLevels.includes(level)) {
                  navigation.navigate("GameLevel", { levelNumber: level });
                } else {
                  showAlert("Nivel Bloqueado");
                }
              }}
              style={({ pressed }) => [
                unlockedLevels.includes(level)
                  ? {
                      ...styles.boton,
                      backgroundColor: pressed ? "#6351D9" : "#7A65FB",
                    }
                  : {
                      ...styles.boton,
                      backgroundColor: "#EEE4FF",
                    },
                styles.boton,
              ]}
              disabled={!unlockedLevels.includes(level)}
            >
              <Text style={styles.textoBoton}>
                {unlockedLevels.includes(level) ? `Nivel ${level}` : <Fontisto name="locked" size={24 * scale} color="#7A65FB" />}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>
      {alerts.visible && (
        <CustomAlert
          showAlert={alerts.visible}
          title="Nivel Bloqueado"
          message="Completa los niveles anteriores para desbloquear este nivel."
          onConfirm={hideAlert}
          confirmText="Aceptar"
          confirmButtonColor="#7A65FB"
          cancelButtonColor="#EEE4FF"
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EEE4FF",
  },
  header: {
    marginHorizontal: 10 * scale,
    paddingVertical: 20 * scale,
    borderRadius: 30 * scale,
    alignItems: "center",
  },
  textoTitulo: {
    fontSize: RFPercentage(4),
    color: "#3B1F70",
    fontFamily: "Quicksand",
    textTransform: "uppercase",
  },
  levelsContainer: {
    borderRadius: 20 * scale,
    margin: 10 * scale,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  levels: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    padding: 20 * scale,
    borderRadius: 30 * scale,
    width: "100%",
    gap: 20 * scale,
  },
  boton: {
    paddingVertical: 15 * scale,
    paddingHorizontal: 78 * scale,
    borderRadius: 15 * scale,
    marginBottom: 10 * scale,
    width: "80%",
    alignItems: "center",
    justifyContent: "center",
  },
  textoBoton: {
    fontSize: RFPercentage(3),
    fontFamily: "Quicksand",
    color: "#FFFFFF",
  },
});

export default Levels;