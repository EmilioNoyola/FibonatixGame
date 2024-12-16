// Componentes de React Native.
import React from 'react';
import { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, Alert, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Fuentes personalizadas.
import useCustomFonts from '../../../../apis/FontsConfigure';

// Íconos
import Fontisto from '@expo/vector-icons/Fontisto';

// Alertas Personalizadas
import CustomAlert from '../../../../apis/Alertas';

function LevelScreen({ navigation, unlockedLevels }) {

  // Estados para controlar la visibilidad de las alertas
  const [alerts, setAlerts] = useState({ type: null, visible: false });
  const showAlert = (type) => setAlerts({ type, visible: true });
  const hideAlert = () => setAlerts({ ...alerts, visible: false });

  // Si las fuentes no están cargadas, se retorna null
  const { fontsLoaded, onLayoutRootView } = useCustomFonts();
  if (!fontsLoaded) return null;
  
  // Titulo de las alertas.
  const mostrarTituloAlerta = (type) => {
    switch (type) {
      case 'resetProgress': return 'Reiniciar Progreso';
      case 'progressReset': return 'Progreso Reiniciado';
      default: return 'Alerta';
    }
  };
  
  // Mensaje de las alertas.
  const mostrarMensajeAlerta = (type) => {
    switch (type) {
      case 'resetProgress': return '¿Estás seguro de que deseas reiniciar todo tu progreso? Esto no se puede deshacer.';
      case 'progressReset': return 'Tu progreso ha sido reiniciado exitosamente.';
      default: return null;
    }
  };

  // Texto del botón confirmar
  const textoConfirmar = (type) => {
    switch (type) {
      case 'gameOver': return "Reiniciar";
      case 'Felicidades': return "Salir";
      case 'Correcto': return "Siguiente Nivel";
      default: return "Aceptar";
    }
  };
  
  // Texto del boton cancelar
  const textoCancelar = (type) => {
    switch (type) {
      case 'gameOver': return "Abandonar";
      case 'Felicidades': return "Niveles";
      case 'Correcto': return "Salir";
      default: return "Cancelar";
    }
  };
  
  // Al confirmar la alerta.
  const handleConfirmAlert = async () => {
    switch (alerts.type) {
      case 'resetProgress':
        await resetProgress();
        break;
      default:
        hideAlert();
        break;
    }
  };
  
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
                    } else {
                      showAlert('Nivel Bloqueado');
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

      {alerts.visible && (
        <CustomAlert
          showAlert={alerts.visible}
          title={mostrarTituloAlerta(alerts.type)}
          message={mostrarMensajeAlerta(alerts.type)}
          onConfirm={handleConfirmAlert}
          onCancel={alerts.type === "resetProgress" ? hideAlert : null}
          confirmText={textoConfirmar(alerts.type)}
          cancelText={textoCancelar(alerts.type)}
          confirmButtonColor="#40916C"
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

      resetButton: {
        backgroundColor: "#d9534f",
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
    },

    textoResetButton: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "bold",
    },

});

export default LevelScreen;









