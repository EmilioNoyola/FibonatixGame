import React, { useState, useEffect } from "react";
import { View, Text, Pressable, StyleSheet, ScrollView, StatusBar, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Fontisto from "@expo/vector-icons/Fontisto";
import { RFPercentage } from "react-native-responsive-fontsize";
import CustomAlert from "../../../../assets/components/CustomAlert";
import { useAppContext } from "../../../../assets/context/AppContext";
import { gameService } from "../../../../assets/services/ApiService";
import { LEVEL_CONFIG } from "./levelConfig";
import useCustomFonts from "../../../../assets/components/FontsConfigure";

const { width } = Dimensions.get("window");
const scale = width / 414;

function Levels({ navigation }) {
  const { clientId } = useAppContext();
  const [unlockedLevels, setUnlockedLevels] = useState([1]);

  const { fontsLoaded, onLayoutRootView } = useCustomFonts();
  if (!fontsLoaded) return null;

  const loadUnlockedLevels = async () => {
    try {
      if (!clientId) {
        setUnlockedLevels([1]);
        return;
      }
      const levelsUnlocked = await gameService.getUnlockedLevels(clientId, 5);
      const levelsArray = Array.from({ length: levelsUnlocked }, (_, i) => i + 1);
      setUnlockedLevels(levelsArray.length > 0 ? levelsArray : [1]);
    } catch (error) {
      console.error("Error al cargar los niveles desbloqueados:", error);
      setUnlockedLevels([1]);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadUnlockedLevels();
    });
    return unsubscribe;
  }, [navigation, clientId]);

  const showAlert = (type) => setAlerts({ type, visible: true });
  const hideAlert = () => setAlerts({ ...alerts, visible: false });
  const [alerts, setAlerts] = useState({ type: null, visible: false });

  const renderLevels = () => {
    const totalLevels = Object.keys(LEVEL_CONFIG).length;
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
                  ? "#700010"
                  : "#800020"
                : "#F998B5",
            },
          ]}
          onPress={() => {
            if (isUnlocked) {
              navigation.navigate("GameLevel", { levelNumber: level });
            } else {
              showAlert("Nivel Bloqueado");
            }
          }}
        >
          <Text style={styles.levelButtonText}>
            {isUnlocked ? `Nivel ${level}` : <Fontisto name="locked" size={24 * scale} color="#800020" />}
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
          title="Nivel Bloqueado"
          message="Completa los niveles anteriores para desbloquear este nivel."
          onConfirm={hideAlert}
          confirmText="Aceptar"
          confirmButtonColor="#800020"
          cancelButtonColor="#F998B5"
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F998B5",
  },
  header: {
    backgroundColor: "#CE3558",
    marginHorizontal: 10 * scale,
    paddingVertical: 20 * scale,
    borderRadius: 30 * scale,
    alignItems: "center",
  },
  headerText: {
    fontSize: RFPercentage(4),
    color: "#630F11",
    fontFamily: "Quicksand",
    textTransform: "uppercase",
  },
  blueBackground: {
    backgroundColor: "#E56587",
    borderRadius: 20 * scale,
    margin: 10 * scale,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  levelsContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    padding: 20 * scale,
    borderRadius: 30 * scale,
    width: "100%",
    gap: 20 * scale,
  },
  levelButton: {
    backgroundColor: "#800020",
    paddingVertical: 15 * scale,
    paddingHorizontal: 78 * scale,
    borderRadius: 15 * scale,
    marginBottom: 10 * scale,
    width: "80%",
    alignItems: "center",
    justifyContent: "center",
  },
  levelButtonText: {
    fontSize: RFPercentage(3),
    fontFamily: "Quicksand",
    color: "#FFFFFF",
  },
  lockedButton: {
    backgroundColor: "#F998B5",
  },
});

export default Levels;