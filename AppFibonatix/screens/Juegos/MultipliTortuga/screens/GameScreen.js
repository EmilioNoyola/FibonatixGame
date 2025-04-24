// Componentes y Hooks de React Native
import React, { useState, useEffect } from 'react'; 
import { View, Text, TouchableOpacity, StyleSheet, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { useNavigation } from "@react-navigation/native";
import { BackHandler } from 'react-native';

// Íconos
import { Ionicons, MaterialIcons } from '@expo/vector-icons'; 

// Alertas Personalizadas
import CustomAlert from '../../../../assets/components/CustomAlert';

function GameScreen({ route, navigation, unlockedLevels, setUnlockedLevels }) {
  
  const { level } = route.params;
  const [cards, setCards] = useState(generateCards(level)); 
  const [placedCards, setPlacedCards] = useState(Array(10).fill(null)); 
  const [initialPositions, setInitialPositions] = useState(Array(10).fill(null)); 
  const [selectedCard, setSelectedCard] = useState(null); 

  const [timer, setTimer] = useState(0); // Para guardar el tiempo en segundos
  const [isTimerRunning, setIsTimerRunning] = useState(false); // Para controlar si el temporizador está activo
  const [bestTime, setBestTime] = useState(null); // Para guardar el mejor tiempo del nivel

  // Objeto que contiene la navegación.
  const navigation2 = useNavigation(); 

  // Estados para controlar la visibilidad de las alertas
  const [alerts, setAlerts] = useState({ type: null, visible: false });
  const showAlert = (type) => setAlerts({ type, visible: true });
  const hideAlert = () => setAlerts({ ...alerts, visible: false });

  const [exitAttempt, setExitAttempt] = useState(false); // Nuevo estado para controlar intentos de salida

  useEffect(() => {
      const checkFirstTimePlaying = async () => {
          if (level === 1) {
              const hasPlayed = await AsyncStorage.getItem('hasPlayedBefore');
              if (!hasPlayed) {
                  showAlert('startGame'); // Muestra la alerta
                  await AsyncStorage.setItem('hasPlayedBefore', 'true'); // Marca que ya ha jugado
              } else {
                  setIsTimerRunning(true); // Inicia el temporizador si ya ha jugado antes
              }
          } else {
              setIsTimerRunning(true); // Inicia el temporizador para niveles distintos del 1
          }
      };
      checkFirstTimePlaying();
  }, [level]);

  // Generar cartas según el nivel
  function generateCards(level) {
    const numbers = Array.from({ length: 10 }, (_, i) => (i + 1) * level);
    return shuffle(numbers);
  }

  // Mezclar las cartas
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Reinicia el nivel
  const reloadLevel = () => {
    setCards(generateCards(level));
    setPlacedCards(Array(10).fill(null));
    setInitialPositions(Array(10).fill(null));
    setSelectedCard(null);
    setTimer(0); // Reinicia el tiempo
    setIsTimerRunning(false); // Detiene el temporizador
    setTimeout(() => setIsTimerRunning(true), 100); // Reinicia el temporizador con un pequeño delay
  };  

  // Manejar selección de una carta
  const handleCardSelect = (index) => {
    setSelectedCard({ type: 'available', index });
  };

  // Manejar colocación o selección de una carta en un espacio
  const handlePlaceCard = (targetIndex) => {
    if (selectedCard) {
      const newPlacedCards = [...placedCards];
      const newCards = [...cards];
      const newInitialPositions = [...initialPositions];

      if (selectedCard.type === 'available') {
        if (newPlacedCards[targetIndex] === null) {
          newPlacedCards[targetIndex] = cards[selectedCard.index];
          newCards[selectedCard.index] = null;

          // Guardar la posición inicial de la carta
          newInitialPositions[targetIndex] = selectedCard.index;
        } else {
          showAlert('EspacioOcupado');
        }
      } else if (selectedCard.type === 'placed') {
        const sourceIndex = selectedCard.index;
        const temp = newPlacedCards[targetIndex];
        newPlacedCards[targetIndex] = newPlacedCards[sourceIndex];
        newPlacedCards[sourceIndex] = temp;

        // Intercambiar las posiciones iniciales de las cartas
        const tempInitialPos = newInitialPositions[targetIndex];
        newInitialPositions[targetIndex] = newInitialPositions[sourceIndex];
        newInitialPositions[sourceIndex] = tempInitialPos;
      }

      setPlacedCards(newPlacedCards);
      setCards(newCards);
      setInitialPositions(newInitialPositions);
      setSelectedCard(null);
    } else {
      if (placedCards[targetIndex] !== null) {
        // Si se hace clic en el espacio donde ya está la carta, la regresa a su lugar original
        const originalIndex = initialPositions[targetIndex];
        if (originalIndex !== null) {
          const newPlacedCards = [...placedCards];
          const newCards = [...cards];
          
          // Regresar la carta a su lugar original
          newCards[originalIndex] = placedCards[targetIndex];
          newPlacedCards[targetIndex] = null;
          
          setPlacedCards(newPlacedCards);
          setCards(newCards);
          setSelectedCard(null);
        }
      } else {
        setSelectedCard({ type: 'placed', index: targetIndex });
      }
    }
  };

  // Temporizador
  useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Guardar el mejor tiempo en AsyncStorage
  const saveBestTime = async (time) => {
    try {
      const storedBestTime = await AsyncStorage.getItem(`bestTime_level_${level}`);
      if (!storedBestTime || time < parseInt(storedBestTime, 10)) {
        await AsyncStorage.setItem(`bestTime_level_${level}`, time.toString());
        setBestTime(time);
      } else {
        setBestTime(parseInt(storedBestTime, 10));
      }
    } catch (error) {
      console.error('Error guardando el mejor tiempo:', error);
    }
  };

  // Obtener el mejor tiempo al cargar
  useEffect(() => {
    const fetchBestTime = async () => {
      try {
        const storedBestTime = await AsyncStorage.getItem(`bestTime_level_${level}`);
        if (storedBestTime) {
          setBestTime(parseInt(storedBestTime, 10));
        }
      } catch (error) {
        console.error('Error obteniendo el mejor tiempo:', error);
      }
    };
    fetchBestTime();
  }, [level]);

   // Verificar el orden de las cartas colocadas
  const checkOrder = () => {
    const correctOrder = Array.from({ length: 10 }, (_, i) => (i + 1) * level);
    if (JSON.stringify(placedCards) === JSON.stringify(correctOrder)) {
      showAlert('Correcto');
      setIsTimerRunning(false); // Detener el temporizador
      saveBestTime(timer); // Guardar el tiempo si es el mejor

      // Desbloquear el siguiente nivel si aún no está desbloqueado
      if (!unlockedLevels.includes(level + 1) && level < 12) {
        const newUnlockedLevels = [...unlockedLevels, level + 1];
        setUnlockedLevels(newUnlockedLevels);
        // Guardar progreso de los niveles desbloqueados
        AsyncStorage.setItem('unlockedLevels', JSON.stringify(newUnlockedLevels));
      }

      setTimeout(() => {
        if (level < 12) {

        } else {
          // Si es el último nivel, mostrar mensaje o regresar a la pantalla de niveles
          showAlert('Felicidades');
        }
      }, 1000);
    } else {
      showAlert('Error');
    }
  };
  
  // Títulos de las alertas.
  const mostrarTituloAlerta = (type) => {
    switch (type) {
      case 'startGame': return 'MULTIPLI TORTUGA';
      case 'gameOver': return "Game Over";
      case 'exit': return 'SALIR';
      case 'Correcto': return '¡Correcto!';
      case 'EspacioOcupado': return 'Espacio ocupado';
      case 'Felicidades': return '¡Felicidades!';
      case 'Error': return 'Error!';
      default: return "Alerta";
    }
  };
    
  // Mensajes de las alertas.
  const mostrarMensajeAlerta = (type) => {
    switch (type) {
      case 'startGame': return 'Completa la tabla correctamente en el menor orden posible.';
      case 'gameOver': return "¿Quieres reiniciar el juego?";
      case 'exit': return "¿Quieres abandonar el juego?";
      case 'Correcto': return "Has completado el nivel."; 
      case 'EspacioOcupado': return "Este espacio ya tiene una carta.";
      case 'Felicidades': return "Has completado todos los niveles.";
      case 'Error': return "El orden de las cartas es incorrecto.";
      default: return null;
    }
  };

  // Al confirmar la alerta.
  const handleConfirmAlert = () => {
    switch (alerts.type) {
      case 'startGame':
        if (level === 1) {
          setIsTimerRunning(true); // Inicia el temporizador al confirmar
        }
        break;
      case 'gameOver':
        reloadLevel(); // Reinicia el juego
        break;
      case 'exit':
        navigation2.navigate('HomeScreen');
        break;
      case 'Felicidades':
        navigation2.navigate('HomeScreen');
        break;
      case 'Correcto':
        navigation2.replace('GameScreen', { level: level + 1 });
        break;
      default:
        break;
    }
    hideAlert(); // Cierra la alerta
  }; 
  
  // Al cancelar la alerta.
  const handleCancelAlert = () => {
    switch (alerts.type) {
      case 'gameOver':
        navigation2.goBack(); // Vuelve a la pantalla anterior
        break;
      case 'Felicidades':
        navigation2.navigate('Level');
        break;
      case 'Correcto': 
        navigation2.navigate('HomeScreen');
        break;
      default:
        break;
    }
    hideAlert(); // Cierra la alerta
  };
  
  // Texto del botón confirmar
  const textoConfirmar = (type) => {
    switch (type) {
      case 'startGame': return "JUGAR";
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

  // Esta función se ejecutará cuando el usuario presione el botón de retroceso
  const handleBackPress = () => {
    setExitAttempt(true); // Marca el intento de salida
    showAlert('exit'); // Muestra una alerta de confirmación
    return true; // Retorna true para prevenir la acción predeterminada
  };    

  // Manejador de Retroceso.
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

      <View style={styles.Header}>

        <View style={styles.cajaTitulo}>
          <Text style={styles.titulo}>MULTIPLI TORTUGA</Text>
        </View>

        <View style={styles.cajaIconos}>

          <Pressable style={styles.button} onPress={reloadLevel}>
            {({ pressed }) => (
              <Ionicons
                name="reload-circle"
                size={50}
                color={pressed ? "#3f9c75" : "#327c5c"} // Cambia el color cuando está presionado
              />
            )}
          </Pressable>

          <View style={styles.cajaNivel}>
            <Text style={styles.Nivel}>NVL. {level}</Text>
          </View>

          <Pressable style={styles.button} onPress={() => showAlert('exit')}>
            {({ pressed }) => (
              <MaterialIcons
                name="exit-to-app"
                size={47}
                color={pressed ? "#3f9c75" : "#327c5c"} // Cambia el color cuando está presionado
              />
            )}
          </Pressable>

        </View>

        <View style={styles.cajaPuntajes}>

          <View style={styles.puntajeContainer}>
              <Image 
                source={require("../../../../assets/img/TortugaJuego.png")} 
                style={styles.image} 
                resizeMode="contain"
              />
              <Text style={styles.score}>{`${Math.floor(timer / 60)
                .toString()
                .padStart(2, '0')}:${(timer % 60).toString().padStart(2, '0')}`}
              </Text>
                {bestTime !== null && (
                  <Text style={styles.bestTime}>
                      <Image 
                        source={require("../../../../assets/img/Trofeo.png")} 
                        style={styles.image} 
                        resizeMode="contain"
                      />
                    {`${Math.floor(bestTime / 60)
                      .toString()
                      .padStart(2, '0')}:${(bestTime % 60).toString().padStart(2, '0')}`}
                  </Text>
                )}
          </View>

        </View>

      </View>

      <View style={styles.targetArea}>
        {placedCards.map((card, index) => (
          <View key={index} style={styles.targetWrapper}>
            <TouchableOpacity
              style={[
                styles.targetSpace,
                selectedCard?.type === 'available' && placedCards[index] === null 
                  ? styles.highlightTargetSpace 
                  : null,
              ]}
              onPress={() => handlePlaceCard(index)}
            >
              {card && <Text style={styles.cardText}>{card}</Text>}
            </TouchableOpacity>
            <Text style={styles.operationText}>{`${level} x ${index + 1}`}</Text>
          </View>
        ))}
      </View>

      <View style={styles.fixedCardsContainer}>
        {cards.map((card, index) =>
          card !== null ? (
            <TouchableOpacity
              key={index}
              style={[
                styles.card,
                selectedCard?.type === 'available' && selectedCard.index === index
                  ? styles.selectedCard
                  : null,
              ]}
              onPress={() => handleCardSelect(index)}
            >
              <Text style={styles.cardText}>{card}</Text>
            </TouchableOpacity>
          ) : (
            <View key={index} style={styles.emptyCard} />
          )
        )}
      </View>

      <TouchableOpacity style={styles.checkButton} onPress={checkOrder}>
        <Text style={styles.buttonText}>Comprobar</Text>
      </TouchableOpacity>

      {alerts.visible && (
        <CustomAlert
          showAlert={alerts.visible}
          title={mostrarTituloAlerta(alerts.type)}
          message={mostrarMensajeAlerta(alerts.type)}
          onConfirm={handleConfirmAlert}
          onCancel={alerts.type === 'startGame' ? null : handleCancelAlert} // Si es startGame, no necesitas botón de cancelar
          confirmText={textoConfirmar(alerts.type)}
          cancelText={textoCancelar(alerts.type)}
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

  bestTime: {
    fontSize: 27,
    color: '#3f9c75',
    fontFamily: 'Quicksand',
    marginLeft: 20,
    fontFamily: 'Quicksand',
  },

  Header: {
    backgroundColor: "#ade6b6",
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    marginHorizontal: 10,
    paddingVertical: 10,
  },

  cajaTitulo: {
    marginVertical: 5,
  },
  
  titulo: {
    fontSize: 24,
    color: '#3f9c75',
    fontFamily: 'Quicksand',
  },
  
  cajaIconos: {
    flexDirection: 'row',
    marginVertical: 5,
  },

  cajaNivel: {
    borderRadius: 90,
    backgroundColor: '#327c5c',
    alignItems: 'center',
    justifyContent: 'center',
    height: 46,
    width: 90,
  },

  Nivel: {
    fontSize: 18,
    color: '#D8F3DC',
    fontFamily: 'Quicksand',
  },
  
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 12,
  },

  cajaPuntajes: {
    flexDirection: 'row',
    marginVertical: 5,
  },

  puntajeContainer: {
    flexDirection: 'row', // Para alinear imagen y texto en la misma línea
    alignItems: 'center', // Para centrar la imagen y el texto verticalmente
    marginHorizontal: 10,
  },

  image: {
    width: 30,
    height: 30,
    marginRight: 5, // Espacio entre la imagen y el texto
  },
  
  score: {
    fontSize: 27,
    color: '#3f9c75',
    fontFamily: 'Quicksand',
  },
  
  containerExitButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  exitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
  },

  exitText: {
    fontSize: 16,
    color: '#1B4332',
    fontWeight: 'bold',
    marginLeft: 5,
  },

  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },

  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1B4332',
  },

  instruction: {
    fontSize: 18,
    color: '#081C15',
    marginBottom: 20,
    textAlign: 'center',
  },

  targetArea: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    width: '100%',
    marginTop: 20,
  },

  targetWrapper: {
    width: 60,
    height: 60,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  targetSpace: {
    width: '100%',
    height: '100%',
    backgroundColor: '#52B788', 
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.55,
  },

  highlightTargetSpace: {
    backgroundColor: '#1B4332', 
    opacity: 1,
  },

  fixedCardsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginVertical: 20,
    height: 235,
  },

  card: {
    backgroundColor: '#52B788', 
    width: 60,
    height: 60,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    opacity: 1,
  },

  selectedCard: {
    borderWidth: 2,
    borderColor: '#1B4332', 
  },

  cardText: {
    fontSize: 16,
    color: 'white',
    fontFamily: 'Quicksand',
  },
  
  operationText: {
    fontSize: 13,
    color: '#081C15', 
    marginTop: -2,
    fontFamily: 'Quicksand',
  },

  checkButton: {
    backgroundColor: '#1B4332', 
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    width: '50%',
    alignSelf: 'center',
  },

  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },

});

export default GameScreen;

























