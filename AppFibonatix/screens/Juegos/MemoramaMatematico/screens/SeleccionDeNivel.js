// Componentes y Hooks de React Native
import React, { useEffect, useState } from "react";
import { Text, View, StatusBar, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from "@react-native-async-storage/async-storage";

// Estilos
import { StyleSeleccion } from "../styles/StyleSeleccion";

// Íconos
import Fontisto from '@expo/vector-icons/Fontisto';

// Fuentes Personalizadas
import useCustomFonts from '../../../../assets/apis/FontsConfigure';

// Alertas Personalizadas
import CustomAlert from '../../../../assets/apis/Alertas';

export default function SeleccionDeNivel({ navigation }) {

  const [isGameStarted, setIsGameStarted] = useState(false); // Controla si el juego ha iniciado

  const [unlockedLevels, setUnlockedLevels] = useState([1]); // Solo el nivel 1 desbloqueado por defecto

  // Estados para controlar la visibilidad de las alertas
  const [alerts, setAlerts] = useState({ type: null, visible: false });
  const showAlert = (type) => setAlerts({ type, visible: true });
  const hideAlert = () => setAlerts({ ...alerts, visible: false });

  // Si las fuentes no están cargadas, se retorna null
  const { fontsLoaded, onLayoutRootView } = useCustomFonts();
  if (!fontsLoaded) return null; 

  // Carga niveles desbloqueados.
  useEffect(() => {
    const loadUnlockedLevels = async () => {
      try {
        const levels = await AsyncStorage.getItem("unlockedLevelsMemorama");
        if (levels) {
          const parsedLevels = JSON.parse(levels);
          if (Array.isArray(parsedLevels)) {
            setUnlockedLevels(parsedLevels);
          }
        }
      } catch (error) {
        console.error("Error al cargar los niveles desbloqueados:", error);
      }
    };
    loadUnlockedLevels();
  }, []);

  // Funciones al confirmar la alerta.
  const handleConfirmAlert = () => {
    switch (alerts.type) {
      case "resetProgress":
        resetProgress(); // Reiniciar el progreso
        break;
      case "progressReset":
        hideAlert(); // Ocultar alerta de confirmación
        break;
      default:
        hideAlert();
        break;
    }
  };

  // Titulo de las alertas
  const mostrarTituloAlerta = (type) => {
    switch (type) {
      case "resetProgress": return "Reiniciar Progreso";
      case "progressReset": return "Progreso Reiniciado";
      default: return "Alerta";
    }
  };
  
  // Mensajes de las alertas.
  const mostrarMensajeAlerta = (type) => {
    switch (type) {
      case "resetProgress": return "¿Estás seguro de que deseas reiniciar todo tu progreso? Esto no se puede deshacer.";
      case "progressReset": return "Todo tu progreso ha sido reiniciado.";
      default: return "";
    }
  };
  
  // Texto del botón confirmar.
  const textoConfirmar = (type) => {
    switch (type) {
      case "resetProgress": return "Sí, Reiniciar";
      case "progressReset": return "Aceptar";
      default: return "Aceptar";
    }
  };
  
  // Texto del botón cancelar.
  const textoCancelar = (type) => {
    switch (type) { 
      case "resetProgress": return "Cancelar";
      default: return null;
    }
  };  

  const allLevels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]; // Lista de niveles disponibles

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
                  showAlert('Nivel Bloqueado'); // Mostrar alerta si el nivel está bloqueado
                }
              }}
              style={({ pressed }) => [
                unlockedLevels.includes(level)
                  ? {
                      ...StyleSeleccion.boton,
                      backgroundColor: pressed ? '#fa970a' : '#eb8c05',
                    }
                  : {
                      ...StyleSeleccion.boton,
                      backgroundColor: '#fdd295',
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

      {alerts.visible && (
        <CustomAlert
          showAlert={alerts.visible}
          title={mostrarTituloAlerta(alerts.type)}
          message={mostrarMensajeAlerta(alerts.type)}
          onConfirm={handleConfirmAlert}
          onCancel={alerts.type === "resetProgress" ? hideAlert : null}
          confirmText={textoConfirmar(alerts.type)}
          cancelText={textoCancelar(alerts.type)}
          confirmButtonColor="#eb8c05"
        />
      )}

    </SafeAreaView>

  );
}
