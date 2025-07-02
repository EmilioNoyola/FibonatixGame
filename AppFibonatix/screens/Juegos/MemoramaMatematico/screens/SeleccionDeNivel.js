import React, { useEffect, useState } from "react";
import { Text, View, StatusBar, ScrollView, Pressable, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSeleccion } from "../styles/StyleSeleccion";
import Fontisto from "@expo/vector-icons/Fontisto";
import useCustomFonts from "../../../../assets/components/FontsConfigure";
import CustomAlert from "../../../../assets/components/CustomAlert";
import { useAppContext } from "../../../../assets/context/AppContext";
import { gameService } from "../../../../assets/services/ApiService";

const { width } = Dimensions.get("window");
const scale = width / 414;
const fontScale = width / 414;

export default function SeleccionDeNivel({ navigation }) {
  const { clientId } = useAppContext();
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [unlockedLevels, setUnlockedLevels] = useState([1]);
  const [alerts, setAlerts] = useState({ type: null, visible: false });

  const showAlert = (type) => setAlerts({ type, visible: true });
  const hideAlert = () => setAlerts({ ...alerts, visible: false });

  const { fontsLoaded, onLayoutRootView } = useCustomFonts();
  if (!fontsLoaded) return null;

  const loadUnlockedLevels = async () => {
    if (!clientId) return;
    try {
      const levelsUnlocked = await gameService.getUnlockedLevels(clientId, 1); // gameID = 1 para Memorama Matemático
      const levelsArray = Array.from({ length: levelsUnlocked }, (_, i) => i + 1);
      setUnlockedLevels(levelsArray.length > 0 ? levelsArray : [1]);
    } catch (error) {
      console.error("Error al cargar los niveles desbloqueados desde la base de datos:", error);
      setUnlockedLevels([1]); // Por defecto, nivel 1 desbloqueado
    }
  };

  useEffect(() => {
    loadUnlockedLevels();
  }, [clientId]);

  useEffect(() => {
    // Escuchar cambios en la navegación o recargar niveles si es necesario
    const unsubscribe = navigation.addListener('focus', () => {
      loadUnlockedLevels();
    });
    return unsubscribe;
  }, [navigation]);

  const allLevels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  return (
    <SafeAreaView style={StyleSeleccion.container} onLayout={onLayoutRootView}>
      <StatusBar backgroundColor="transparent" barStyle="dark-content" />
      <View style={StyleSeleccion.header}>
        <Text style={StyleSeleccion.textoTitulo}>Selección de Nivel</Text>
      </View>
      <View style={StyleSeleccion.levelsContainer}>
        <ScrollView
          contentContainerStyle={StyleSeleccion.levels}
          showsVerticalScrollIndicator={false}
        >
          {allLevels.map((level) => (
            <Pressable
              key={level}
              onPress={() => {
                if (unlockedLevels.includes(level)) {
                  navigation.navigate("JuegoMemorama", { level });
                } else {
                  showAlert("Nivel Bloqueado");
                }
              }}
              style={({ pressed }) => [
                unlockedLevels.includes(level)
                  ? {
                      ...StyleSeleccion.boton,
                      backgroundColor: pressed ? "#fa970a" : "#eb8c05",
                    }
                  : {
                      ...StyleSeleccion.boton,
                      backgroundColor: "#fdd295",
                    },
                StyleSeleccion.boton,
              ]}
              disabled={!unlockedLevels.includes(level)}
            >
              <Text style={StyleSeleccion.textoBoton}>
                {unlockedLevels.includes(level) ? `Nivel ${level}` : <Fontisto name="locked" size={24} color="#eb8c05" />}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}