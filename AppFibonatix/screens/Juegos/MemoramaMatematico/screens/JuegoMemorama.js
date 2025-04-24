import * as React from 'react';

// Componentes de React Native
import { useState, useEffect } from 'react';
import { Text, View, Image, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackHandler } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Íconos utilizados
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

// Estilos
import { JuegoMemoramaStyles } from '../styles/JuegoMemoramaStyles';
import Card from '../Card';

// Alertas Personalizadas
import CustomAlert from '../../../../assets/components/CustomAlert';

// Datos de las tarjetas para cada nivel
const levelData = {
  1: ["1+1", "2", "2+2", "4", "3+3", "6", "4+4", "8", "5+5", "10", "6+6", "12"],
  2: ["3*3", "9", "8-7", "1", "2*2", "4", "8-5", "3", "8+5", "13", "7+7", "14"],
  3: ["4*6", "24", "15/5", "3", "8+7", "15", "6*6", "36", "7-7", "0", "10/2", "5"],
  4: ["8*9", "72", "24/6", "4", "8*8", "64", "6*7", "42", "18/3", "6", "12/4", "3"],
  5: ["1+1", "2", "2+2", "4", "3+3", "6", "4+4", "8", "5+5", "10", "6+6", "12"],
};

// Función para mezclar las tarjetas
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
  }
  return array;
}

export default function JuegoMemorama({ navigation, route }) {

  const [isGameStarted, setIsGameStarted] = useState(false); // Controlar si el juego ha iniciado
  const [exitAttempt, setExitAttempt] = useState(false); // Controlar intentos de salida

  const level = route.params.level; // Nivel actual
  const cards = levelData[level]; // Tarjetas del nivel actual

  const [board, setBoard] = React.useState(() => shuffle([...cards]));
  const [selectedCards, setSelectedCards] = React.useState([]);
  const [matchedCards, setMatchedCards] = React.useState([]);
  const [score, setScore] = React.useState(0);
  const [bestScore, setBestScore] = React.useState(null);
  const [didWin, setDidWin] = React.useState(false);
  const [unlockedLevels, setUnlockedLevels] = React.useState([1]);

  // Controlar la visibilidad de las alertas
  const [alerts, setAlerts] = useState({ type: null, visible: false });
  const showAlert = (type) => setAlerts({ type, visible: true });
  const hideAlert = () => setAlerts({ ...alerts, visible: false });
  
  useEffect(() => {
    const checkFirstTimePlaying = async () => {
      if (level === 1) { // Solo para el nivel 1
        const hasPlayed = await AsyncStorage.getItem("hasPlayedBefore");
        if (!hasPlayed) {
          showAlert("startGame"); // Mostrar alerta si es la primera vez
        }
      }
    };
    checkFirstTimePlaying();
  }, [level]);   
  
  // Desbloquear el siguiente nivel
  React.useEffect(() => {
    if (didWin) {
      unlockNextLevel(level + 1); 
    }
  }, [didWin]);

  // Carga los niveles desbloqueados desde AsyncStorage
  React.useEffect(() => {
    const loadUnlockedLevels = async () => {
      try {
        const levels = await AsyncStorage.getItem('unlockedLevelsMemorama');
        if (levels) {
          const parsedLevels = JSON.parse(levels);
          if (Array.isArray(parsedLevels)) {
            setUnlockedLevels(parsedLevels);
          }
        }
      } catch (error) {
        console.error('Error al cargar los niveles desbloqueados:', error);
      }
    };
    loadUnlockedLevels();
  }, []);

  // Desbloquea el siguiente nivel
  const unlockNextLevel = async (nextLevel) => {
    if (!unlockedLevels.includes(nextLevel) && nextLevel <= 4) {
      const newUnlockedLevels = [...unlockedLevels, nextLevel];
      setUnlockedLevels(newUnlockedLevels);
      await AsyncStorage.setItem('unlockedLevelsMemorama', JSON.stringify(newUnlockedLevels));
    }
  };

  const didPlayerWin = () => matchedCards.length === board.length;

  // Si el jugador gana.
  React.useEffect(() => {
    if (didPlayerWin()) {
      setDidWin(true);
      showAlert('Correcto'); // Mostrar alerta personalizada al ganar el nivel
    }
  }, [matchedCards]);  

  // 
  React.useEffect(() => {
    const fetchBestScore = async () => {
      const savedBestScore = await AsyncStorage.getItem(`bestScoreNivel${level}`);
      if (savedBestScore !== null) {
        setBestScore(parseInt(savedBestScore));
      }
    };
    fetchBestScore();
  }, []);

  // 
  React.useEffect(() => {
    const saveBestScore = async () => {
      if (didPlayerWin() && (bestScore === null || score < bestScore)) {
        await AsyncStorage.setItem(`bestScoreNivel${level}`, score.toString());
        setBestScore(score);
      }
    };
    saveBestScore();
  }, [matchedCards]);

  // 
  const isMatch = (card1, card2) => {
    const evalCard1 = isNaN(card1) ? eval(card1) : parseInt(card1);
    const evalCard2 = isNaN(card2) ? eval(card2) : parseInt(card2);
    return evalCard1 === evalCard2;
  };

  // 
  React.useEffect(() => {
    if (selectedCards.length < 2) return;

    const [firstIndex, secondIndex] = selectedCards;
    const firstCard = board[firstIndex];
    const secondCard = board[secondIndex];

    if (isMatch(firstCard, secondCard)) {
      setMatchedCards([...matchedCards, firstIndex, secondIndex]);
      setSelectedCards([]);
    } else {
      const timeoutId = setTimeout(() => setSelectedCards([]), 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [selectedCards]);

  // 
  const handleTapCard = (index) => {
    if (selectedCards.length >= 2 || selectedCards.includes(index)) return;
    setSelectedCards([...selectedCards, index]);
    setScore(score + 1);
  };  

  // Reordena el tablero al reiniciar
  const resetGame = () => {
    setMatchedCards([]);
    setScore(0);
    setSelectedCards([]);
    setBoard(shuffle([...cards])); 
  };
    
  // Títulos de las alertas.
  const mostrarTituloAlerta = (type) => {
    switch (type) {
      case 'startGame': return 'Memorama Matemático';
      case 'exit': return 'SALIR';
      case 'Correcto': return '¡Correcto!';
      case 'Felicidades': return '¡Felicidades!';
      case 'Error': return 'Error!';
      default: return "Alerta";
    }
  };
      
  // Mensajes de las alertas.
  const mostrarMensajeAlerta = (type) => {
    switch (type) {
      case 'startGame': return 'Junta pares de operaciones con su respuesta hasta completar toda la tabla.';
      case 'exit': return "¿Quieres abandonar el juego?";
      case 'Correcto': return "Has completado el nivel."; 
      case 'Felicidades': return "Has completado todos los niveles.";
      case 'Error': return "El orden de las cartas es incorrecto.";
      default: return null;
    }
  };

  // Texto del botón confirmar
  const textoConfirmar = (type) => {
    switch (type) {
      case 'startGame': return 'JUGAR';
      case 'Felicidades': return 'Salir';
      case 'Correcto': return "Siguiente Nivel";
      default: return "Aceptar";
    }
  };
    
  // Texto del boton cancelar
  const textoCancelar = (type) => {
    switch (type) {
      case 'Felicidades': return "Niveles";
      case 'Correcto': return "Salir";
      default: return "Cancelar";
    }
  };
    
  // Al confirmar la alerta
  const handleConfirmAlert = async () => {
    switch (alerts.type) {
      case 'startGame':
        if (level === 1) {
          await AsyncStorage.setItem('hasPlayedBefore', 'true'); // Marcar como jugado
        }
        setIsGameStarted(true); // Marcar el juego como iniciado
        break;
      case 'exit': 
        navigation.navigate('HomeScreen');
        break;
      case 'Felicidades':
        navigation.navigate('HomeScreen');
        break;
      case 'Error':
        return; // Salir de la función aquí
      default:
        break;
    }
    hideAlert(); // Cierra la alerta
  };          
    
  // Al cancelar la alerta
  const handleCancelAlert = () => {
    switch (alerts.type) {
      case 'Felicidades':
        navigation.navigate('Level');
        break;
      case 'Correcto':
        navigation.navigate('HomeScreen'); // Navegar a la selección de nivel si se cancela
        break;
      default:
        break;
    }
    hideAlert(); // Cierra la alerta
  };
  
  // Esta función se ejecutará cuando el usuario presione el botón de retroceso
  const handleBackPress = () => {
    setExitAttempt(true); // Marca el intento de salida
    showAlert('exit'); // Muestra una alerta de confirmación
    return true; // Retorna true para prevenir la acción predeterminada
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

    <SafeAreaView style={JuegoMemoramaStyles.main}>

      <StatusBar style="dark" />

      <View style={JuegoMemoramaStyles.header}>

        <View style={JuegoMemoramaStyles.cajaTitulo}>
          <Text style={JuegoMemoramaStyles.titulo}>{didPlayerWin() ? "¡Completado!" : "MEMORAMA MATEMÁTICO"}</Text>
        </View>

        <View style={JuegoMemoramaStyles.cajaIconos}>

          <Pressable style={JuegoMemoramaStyles.button} onPress={resetGame}>
            {({ pressed }) => (
              <Ionicons
                name="reload-circle"
                size={50}
                color={pressed ? "#b26701" : "#da7e01"}
              />
            )}
          </Pressable>

          <View style={JuegoMemoramaStyles.cajaNivel}>
            <Text style={JuegoMemoramaStyles.Nivel}>NVL. {level}</Text>
          </View>

          <Pressable style={JuegoMemoramaStyles.button} onPress={() => showAlert('exit')}>
            {({ pressed }) => (
              <MaterialIcons
                name="exit-to-app"
                size={47}
                color={pressed ? "#b26701" : "#da7e01"} // Cambia el color cuando está presionado
              />
            )}
          </Pressable>

        </View>

        <View style={JuegoMemoramaStyles.cajaPuntajes}>
          {bestScore !== null && (
            <View style={JuegoMemoramaStyles.puntajeContainer}>
              <Image 
                source={require("../../../../assets/img/Trofeo.png")} 
                style={JuegoMemoramaStyles.image} 
                resizeMode="contain"
              />
              <Text style={JuegoMemoramaStyles.score}>{bestScore}</Text>
            </View>
          )}
          <View style={JuegoMemoramaStyles.puntajeContainer}>
            <Image 
              source={require("../../../../assets/img/TortugaJuego.png")} 
              style={JuegoMemoramaStyles.image} 
              resizeMode="contain"
            />
            <Text style={JuegoMemoramaStyles.score}>{score}</Text>
          </View>
        </View>

      </View>

      <View style={JuegoMemoramaStyles.boardContainer}>
        <View style={JuegoMemoramaStyles.board}>
          {board.map((card, index) => {
            const isTurnedOver = selectedCards.includes(index) || matchedCards.includes(index);
            return (
              <Card key={index} isTurnedOver={isTurnedOver} onPress={() => handleTapCard(index)}>
                {card}
              </Card>
            );
          })}
        </View>
      </View>

      {alerts.visible && (
        <CustomAlert
          showAlert={alerts.visible}
          title={mostrarTituloAlerta(alerts.type)}       
          message={mostrarMensajeAlerta(alerts.type)}   
          onConfirm={handleConfirmAlert}                
          onCancel={alerts.type === 'startGame' ? null : handleCancelAlert} 
          confirmText={textoConfirmar(alerts.type)}
          cancelText={textoCancelar(alerts.type)}   
          confirmButtonColor={'#eb8c05'}    
          cancelButtonColor={'#fdd295'}              
        />
      )}

    </SafeAreaView>

  );
}
