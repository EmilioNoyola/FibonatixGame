import { TouchableOpacity, StyleSheet, View, Text } from "react-native";
import { useState, useEffect } from 'react';
import { Ionicons, FontAwesome,  MaterialIcons } from "@expo/vector-icons";

// Alertas Personalizadas
import CustomAlert from '../../apis/Alertas';
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BackHandler } from 'react-native';

import useCustomFonts from '../../apis/FontsConfigure';

export default function Header({
  children,
  reloadGame,
  pauseGame,
  isPaused,
  highScore, // Recibe el puntaje más alto como prop
}) {

    const navigation = useNavigation(); // Obtiene el objeto de navegación

    const { fontsLoaded, onLayoutRootView } = useCustomFonts();

    // Si las fuentes no están cargadas, se retorna null
    if (!fontsLoaded) return null;


    // Estados para controlar la visibilidad de las alertas
    const [alerts, setAlerts] = useState({ type: null, visible: false });
    const showAlert = (type) => setAlerts({ type, visible: true });
    const hideAlert = () => setAlerts({ ...alerts, visible: false });
    const [exitAttempt, setExitAttempt] = useState(false); // Nuevo estado para controlar intentos de salida

    // Al cancelar la alerta
    const handleCancelAlert = () => {
      if (exitAttempt) {
        pauseGame(); // Reanuda el juego si intentó salir y canceló
        setExitAttempt(false); // Resetea el intento de salida
      }
      hideAlert(); // Cierra la alerta
    };

    // Función que devuelve el título de cada alerta dependiendo el caso.
    const mostrarTituloAlerta = (type) => {
        switch (type) {
            case 'exit': return "SALIR";
            default: return "Alerta";
        }
    };
    
    // Función que devuelve el mensaje de la alerta dependiendo el caso.
    const mostrarMensajeAlerta = (type) => {
        switch (type) {
            case 'exit': return "¿Quieres abandonar el juego?";
            default: return "";
        }
    };

    const textoConfirmar = (type) => {
      switch (type) {
        case 'exit': return "Abandonar";
        default: return "Aceptar";
      }
    };

    const textoCancelar = (type) => {
      switch (type) {
        case 'exit': return "Cancelar";
        default: return "Cancelar";
      }
    };

    const handleConfirmAlert = () => {
      switch (alerts.type) {
        case 'exit':
          navigation.goBack();
          break;
        default:
          console.log("Acción por defecto");
      }
      hideAlert(); // Cierra la alerta después de confirmar
    };
    
    // Esta función se ejecutará cuando el usuario presione el botón de retroceso
    const handleBackPress = () => {
      if (!isPaused) {
        pauseGame(); // Pausa el juego solo si no está pausado
      }
      setExitAttempt(true); // Marca el intento de salida
      showAlert('exit'); // Muestra una alerta de confirmación
      return true; // Impide la acción predeterminada (salir de la aplicación)
    };

    useEffect(() => {
      // Configura el manejador de retroceso
      BackHandler.addEventListener('hardwareBackPress', handleBackPress);

      // Limpieza al desmontar el componente
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
      };
    }, []);
    

  return (
    <SafeAreaView style={styles.container}>
    <View style={styles.header} onLayout={onLayoutRootView}>

      <View style={styles.contentHeader}>

        <Text style={styles.title}>SERPIENTE MATEMÁTICA</Text>

        <View style={styles.headerButtons}>
          <TouchableOpacity onPress={reloadGame} style={styles.buttonLeft}>
            <Ionicons name="reload-circle" size={50} color={"#572364"} />
          </TouchableOpacity>

          <TouchableOpacity onPress={pauseGame} style={styles.buttonCenter}>
            <FontAwesome
              name={isPaused ? "play-circle" : "pause-circle"}
              size={47}
              color={"#572364"}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buttonRight}
            onPress={() => {
              if (!isPaused) {
                pauseGame(); // Pausa el juego solo si no está pausado
              }
              setExitAttempt(true); // Marca el intento de salida
              showAlert('exit'); // Muestra la alerta
            }}
          >
            <MaterialIcons name="exit-to-app" size={47} color={"#572364"} />
          </TouchableOpacity>
        </View>

      </View>

      {children}

      {alerts.visible && (
        <CustomAlert
          showAlert={alerts.visible}
          title={mostrarTituloAlerta(alerts.type)}       // Título dinámico
          message={mostrarMensajeAlerta(alerts.type)}   // Mensaje dinámico
          onConfirm={handleConfirmAlert}                // Acción al confirmar
          onCancel={handleCancelAlert}    
          confirmText={textoConfirmar(alerts.type)}
          cancelText={textoCancelar(alerts.type)}   
          confirmButtonColor={"#572364"}    
          cancelButtonColor={'#d7ace2'}               // Acción al cancelar
        />
      )}

    </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {

    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,

  },
  header: {
    width: 360,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#C6B1C9",
    borderRadius: 15,
  },

  contentHeader: {

    paddingHorizontal: 10,

  },

  title: {
    fontSize: 27,
    fontFamily: 'Quicksand',
    color: "#662975",
  },
  headerButtons: {
    flexDirection: "row", // Mantiene los botones en una fila
    alignItems: "center",
    justifyContent: "center", // Centra todos los botones
  },
  buttonLeft: {
    marginRight: 10,
  },
  buttonCenter: {
    marginHorizontal: 15,
  },
  buttonRight: {
    marginLeft: 10,
  },
  highScore: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 15,
    marginLeft: -100,
    marginTop: -10,
  },

  highScoreText: {
    fontSize: 24,
    fontFamily: 'Quicksand',
    marginLeft: 1,
    color: '#572364',
    
  },
});