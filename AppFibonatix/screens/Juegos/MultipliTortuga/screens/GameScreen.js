import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Pressable, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "@react-navigation/native";
import { BackHandler } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { RFPercentage } from 'react-native-responsive-fontsize';
import CustomAlert from '../../../../assets/components/CustomAlert';
import { useAppContext } from '../../../../assets/context/AppContext';
import { gameService } from '../../../../assets/services/ApiService';

const { width } = Dimensions.get("window");
const scale = width / 414;

function GameScreen({ route, navigation }) {
  const { level } = route.params;
  const { clientId, incrementGamePercentage, updateTrophies, updateCoins, decreaseFoodPercentageOnGamePlay, refreshUserData } = useAppContext();

  const [cards, setCards] = useState(generateCards(level));
  const [placedCards, setPlacedCards] = useState(Array(10).fill(null));
  const [initialPositions, setInitialPositions] = useState(Array(10).fill(null));
  const [selectedCard, setSelectedCard] = useState(null);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [bestTime, setBestTime] = useState(null);
  const [alerts, setAlerts] = useState({ type: null, visible: false });
  const [exitAttempt, setExitAttempt] = useState(false);
  const [coinsEarned, setCoinsEarned] = useState(0);
  const [isNewLevel, setIsNewLevel] = useState(false);
  const [didWin, setDidWin] = useState(false);
  const [unlockedLevels, setUnlockedLevels] = useState([1]);
  const [previousGameProgress, setPreviousGameProgress] = useState(null);
  const [wrongAttempts, setWrongAttempts] = useState(0); // Nuevo estado para rastrear intentos fallidos

  const navigation2 = useNavigation();

  const showAlert = (type) => setAlerts({ type, visible: true });
  const hideAlert = () => setAlerts({ ...alerts, visible: false });

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!clientId) {
          console.warn("No clientId available, skipping data load.");
          setUnlockedLevels([1]);
          return;
        }

        const levelsUnlocked = await gameService.getUnlockedLevels(clientId, 2);
        const levelsArray = Array.from({ length: levelsUnlocked }, (_, i) => i + 1);
        setUnlockedLevels(levelsArray.length > 0 ? levelsArray : [1]);

        const gameProgress = await gameService.getGameProgress(clientId);
        const multipliProgress = gameProgress.find(game => game.game_ID === 2);
        setPreviousGameProgress(multipliProgress);

        const savedBestTime = await AsyncStorage.getItem(`bestTime_level_${level}`);
        if (savedBestTime !== null) {
          setBestTime(parseInt(savedBestTime));
        }
      } catch (error) {
        console.error("Error al cargar datos:", error.message);
        setUnlockedLevels([1]);
      }
    };
    loadData();

    const checkFirstTimePlaying = async () => {
      if (level === 1) {
        const hasPlayed = await AsyncStorage.getItem("hasPlayedMultipliBefore");
        if (!hasPlayed) {
          showAlert("startGame");
        } else {
          startGame();
        }
      } else {
        startGame();
      }
    };
    checkFirstTimePlaying();
  }, [level, clientId]);

  const startGame = async () => {
    try {
      if (!clientId) {
        throw new Error("No se encontró el ID del cliente. Por favor, inicia sesión nuevamente.");
      }
      await decreaseFoodPercentageOnGamePlay();
      setIsTimerRunning(true);
      if (level === 1) {
        await AsyncStorage.setItem("hasPlayedMultipliBefore", "true");
      }
      setWrongAttempts(0); // Reiniciar intentos fallidos al empezar
    } catch (error) {
      console.error("Error al iniciar partida:", error.message);
      showAlert("Error");
    }
  };

  function generateCards(level) {
    const numbers = Array.from({ length: 10 }, (_, i) => (i + 1) * level);
    return shuffle(numbers);
  }

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  const resetGameState = () => {
    setCards(generateCards(level));
    setPlacedCards(Array(10).fill(null));
    setInitialPositions(Array(10).fill(null));
    setSelectedCard(null);
    setTimer(0);
    setIsTimerRunning(false);
    setDidWin(false);
    setWrongAttempts(0); // Reiniciar intentos fallidos al reiniciar
  };

  const reloadLevel = () => {
    resetGameState();
    setTimeout(() => setIsTimerRunning(true), 100);
  };

  const handleCardSelect = (index) => {
    setSelectedCard({ type: 'available', index });
  };

  const handlePlaceCard = (targetIndex) => {
    if (selectedCard) {
      const newPlacedCards = [...placedCards];
      const newCards = [...cards];
      const newInitialPositions = [...initialPositions];

      if (selectedCard.type === 'available') {
        if (newPlacedCards[targetIndex] === null) {
          newPlacedCards[targetIndex] = cards[selectedCard.index];
          newCards[selectedCard.index] = null;
          newInitialPositions[targetIndex] = selectedCard.index;
        } else {
          showAlert('EspacioOcupado');
        }
      } else if (selectedCard.type === 'placed') {
        const sourceIndex = selectedCard.index;
        const temp = newPlacedCards[targetIndex];
        newPlacedCards[targetIndex] = newPlacedCards[sourceIndex];
        newPlacedCards[sourceIndex] = temp;

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
        const originalIndex = initialPositions[targetIndex];
        if (originalIndex !== null) {
          const newPlacedCards = [...placedCards];
          const newCards = [...cards];
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

  useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const saveBestTime = async (time) => {
    try {
      const storedBestTime = await AsyncStorage.getItem(`bestTime_level_${level}`);
      if (!storedBestTime || time < parseInt(storedBestTime, 10)) {
        await AsyncStorage.setItem(`bestTime_level_${level}`, time.toString());
        setBestTime(time);
      }
    } catch (error) {
      console.error('Error guardando el mejor tiempo:', error);
    }
  };

  const getGameData = async () => {
    try {
      const games = await gameService.getGames();
      const game = games.find(g => g.game_ID === 2);
      if (!game) {
        throw new Error("Juego no encontrado en la base de datos");
      }
      return {
        gamePercentage: game.game_percentage || 5,
        coinsEarned: game.game_coins || 10,
        trophiesEarned: game.game_trophy || 1
      };
    } catch (error) {
      console.error("Error al obtener datos del juego:", error.message);
      return { gamePercentage: 5, coinsEarned: 10, trophiesEarned: 1 };
    }
  };

  const updateGameData = async (attemptCount, isWrong) => {
    try {
      setIsTimerRunning(false);

      if (!clientId) {
        throw new Error("No se encontró el ID del cliente. No se puede actualizar el progreso.");
      }

      const gameProgress = await gameService.getGameProgress(clientId);
      const multipliProgress = gameProgress.find(game => game.game_ID === 2);

      const previousPlayedCount = multipliProgress ? multipliProgress.game_played_count || 0 : 0;
      const previousTimePlayed = multipliProgress ? multipliProgress.game_time_played || 0 : 0;
      const previousLevels = multipliProgress ? multipliProgress.game_levels || 0 : 0;

      const isNewLevelLocal = previousLevels < level;
      setIsNewLevel(isNewLevelLocal);

      const { gamePercentage, coinsEarned: coins, trophiesEarned } = await getGameData();
      setCoinsEarned(coins);

      if (coins === undefined || trophiesEarned === undefined) {
        throw new Error("Datos del juego incompletos: coins o trophiesEarned no están definidos.");
      }

      const gameData = {
        game_ID: 2,
        game_played_count: previousPlayedCount + 1,
        game_levels: Math.max(previousLevels, level),
        game_time_played: previousTimePlayed + timer,
        coins_earned: coins,
        trophies_earned: isNewLevelLocal ? trophiesEarned : 0,
      };
      await gameService.updateGameProgress(gameData, clientId);

      await incrementGamePercentage(gamePercentage);
      await updateCoins(coins);
      if (isNewLevelLocal) {
        await updateTrophies(trophiesEarned);
      }

      // Lógica para Game_Performance
      if (multipliProgress && multipliProgress.game_progress_ID) {
        const correctAttempts = isWrong === 0 ? attemptCount : 0; // Incrementa solo si es correcto
        const totalWrongAttempts = isWrong === 1 ? wrongAttempts + 1 : wrongAttempts; // Actualiza si es incorrecto
        const avgTime = timer > 0 ? timer / (correctAttempts + totalWrongAttempts || 1) : 0; // Tiempo promedio ajustado

        await gameService.updateGamePerformance(
          multipliProgress.game_progress_ID,
          correctAttempts,
          totalWrongAttempts,
          avgTime
        );
      }

      const agilIncrease = timer < 20 ? 5 : 2;
      const tenazIncrease = 3;

      await refreshUserData();

      const newLevelsUnlocked = Math.max(previousLevels, level) + 1;
      const levelsArray = Array.from({ length: newLevelsUnlocked }, (_, i) => i + 1);
      setUnlockedLevels(levelsArray.length > 0 ? levelsArray : [1]);
    } catch (error) {
      console.error("Error al actualizar datos del juego:", error.message);
      showAlert("Error");
    }
  };

  const checkOrder = () => {
    const correctOrder = Array.from({ length: 10 }, (_, i) => (i + 1) * level);
    const attemptCount = 1; // Cada verificación cuenta como un intento
    if (JSON.stringify(placedCards) === JSON.stringify(correctOrder)) {
      setDidWin(true);
      saveBestTime(timer);
      updateGameData(attemptCount, 0); // Pasa attemptCount y 0 wrongAttempts
      showAlert('Correcto');
    } else {
      setWrongAttempts(wrongAttempts + 1); // Incrementa intentos fallidos
      updateGameData(attemptCount, 1); // Pasa attemptCount y 1 wrongAttempt
      showAlert('Error');
    }
  };

  const mostrarTituloAlerta = (type) => {
    switch (type) {
      case 'startGame': return 'MULTIPLI TORTUGA';
      case 'exit': return 'SALIR';
      case 'Correcto': return '¡Correcto!';
      case 'EspacioOcupado': return 'Espacio ocupado';
      case 'Felicidades': return '¡Felicidades!';
      case 'Error': return 'Error!';
      default: return "Alerta";
    }
  };

  const mostrarMensajeAlerta = (type) => {
    switch (type) {
      case 'startGame': return 'Completa la tabla correctamente en el menor tiempo posible.';
      case 'exit': return "¿Quieres abandonar el juego?";
      case 'Correcto': return `Has completado el nivel.\nRecompensas: ${coinsEarned} monedas${isNewLevel ? ", 1 trofeo" : ""}.`;
      case 'EspacioOcupado': return "Este espacio ya tiene una carta.";
      case 'Felicidades': return "Has completado todos los niveles.";
      case 'Error': return "El orden de las cartas es incorrecto.";
      default: return null;
    }
  };

  const textoConfirmar = (type) => {
    switch (type) {
      case 'startGame': return "JUGAR";
      case 'Felicidades': return "Salir";
      case 'Correcto': return level < 12 ? "Siguiente Nivel" : "Finalizar";
      default: return "Aceptar";
    }
  };

  const textoCancelar = (type) => {
    switch (type) {
      case 'Felicidades': return "Niveles";
      case 'Correcto': return "Salir";
      default: return "Cancelar";
    }
  };

  const handleConfirmAlert = async () => {
    switch (alerts.type) {
      case 'startGame':
        await startGame();
        hideAlert();
        break;
      case 'exit':
        navigation2.navigate('HomeScreen');
        hideAlert();
        break;
      case 'Felicidades':
        navigation2.navigate('HomeScreen');
        hideAlert();
        break;
      case 'Correcto':
        if (level < 12) {
          setIsTimerRunning(false);
          setTimer(0);
          setCards(generateCards(level + 1));
          setPlacedCards(Array(10).fill(null));
          setInitialPositions(Array(10).fill(null));
          setSelectedCard(null);
          setDidWin(false);
          navigation2.navigate('GameScreen', { level: level + 1 });
          setTimeout(() => setIsTimerRunning(true), 100);
        } else {
          showAlert("Felicidades");
        }
        hideAlert();
        break;
      case 'Error':
        hideAlert();
        break;
      default:
        hideAlert();
        break;
    }
  };

  const handleCancelAlert = () => {
    switch (alerts.type) {
      case 'Felicidades':
        navigation2.navigate('Level');
        break;
      case 'Correcto':
        navigation2.navigate('HomeScreen');
        break;
      default:
        break;
    }
    hideAlert();
  };

  const handleBackPress = () => {
    setExitAttempt(true);
    showAlert('exit');
    return true;
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.cajaTitulo}>
          <Text style={styles.titulo}>{didWin ? "¡Completado!" : "MULTIPLI TORTUGA"}</Text>
        </View>
        <View style={styles.cajaIconos}>
          <Pressable style={styles.button} onPress={reloadLevel}>
            {({ pressed }) => (
              <Ionicons
                name="reload-circle"
                size={50 * scale}
                color={pressed ? "#3f9c75" : "#327c5c"}
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
                size={47 * scale}
                color={pressed ? "#3f9c75" : "#327c5c"}
              />
            )}
          </Pressable>
        </View>
        <View style={styles.cajaPuntajes}>
          {bestTime !== null && (
            <View style={styles.puntajeContainer}>
              <Ionicons name="trophy" size={30 * scale} color="#327c5c" style={styles.icon} />
              <Text style={styles.score}>
                {`${Math.floor(bestTime / 60).toString().padStart(2, '0')}:${(bestTime % 60).toString().padStart(2, '0')}`}
              </Text>
            </View>
          )}
          <View style={styles.puntajeContainer}>
            <MaterialIcons name="timer" size={30 * scale} color="#327c5c" style={styles.icon} />
            <Text style={styles.score}>
              {`${Math.floor(timer / 60).toString().padStart(2, '0')}:${(timer % 60).toString().padStart(2, '0')}`}
            </Text>
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
          onCancel={alerts.type === 'startGame' ? null : handleCancelAlert}
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
  header: {
    backgroundColor: "#ade6b6",
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30 * scale,
    marginHorizontal: 10 * scale,
    paddingVertical: 10 * scale,
  },
  cajaTitulo: {
    marginVertical: 5 * scale,
  },
  titulo: {
    fontSize: RFPercentage(3.5),
    color: '#3f9c75',
    fontFamily: 'Quicksand',
  },
  cajaIconos: {
    flexDirection: 'row',
    marginVertical: 5 * scale,
  },
  cajaNivel: {
    borderRadius: 90 * scale,
    backgroundColor: '#327c5c',
    alignItems: 'center',
    justifyContent: 'center',
    height: 46 * scale,
    width: 90 * scale,
  },
  Nivel: {
    fontSize: RFPercentage(2.5),
    color: '#D8F3DC',
    fontFamily: 'Quicksand',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 12 * scale,
  },
  cajaPuntajes: {
    flexDirection: 'row',
    marginVertical: 5 * scale,
    backgroundColor: "#c8edd1",
    borderRadius: 30 * scale,
    paddingHorizontal: 10 * scale,
  },
  puntajeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8 * scale,
  },
  icon: {
    marginRight: 5 * scale,
  },
  score: {
    fontSize: RFPercentage(3),
    color: '#3f9c75',
    fontFamily: 'Quicksand',
  },
  targetArea: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    width: '100%',
    marginTop: 20 * scale,
  },
  targetWrapper: {
    width: 60 * scale,
    height: 80 * scale,
    margin: 10 * scale,
    alignItems: 'center',
    justifyContent: 'center',
  },
  targetSpace: {
    width: '100%',
    height: 60 * scale,
    backgroundColor: '#52B788',
    borderRadius: 10 * scale,
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
    marginVertical: 20 * scale,
    height: 235 * scale,
  },
  card: {
    backgroundColor: '#52B788',
    width: 60 * scale,
    height: 60 * scale,
    margin: 10 * scale,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10 * scale,
    opacity: 1,
  },
  selectedCard: {
    borderWidth: 2 * scale,
    borderColor: '#1B4332',
  },
  cardText: {
    fontSize: RFPercentage(2.5),
    color: 'white',
    fontFamily: 'Quicksand',
  },
  operationText: {
    fontSize: RFPercentage(2),
    color: '#081C15',
    marginTop: 8 * scale,
    fontFamily: 'Quicksand',
  },
  checkButton: {
    backgroundColor: '#1B4332',
    padding: 10 * scale,
    borderRadius: 10 * scale,
    marginTop: 10 * scale,
    width: '50%',
    alignSelf: 'center',
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: RFPercentage(2.5),
    fontFamily: 'Quicksand',
    fontWeight: 'bold',
  },
  emptyCard: {
    width: 60 * scale,
    height: 60 * scale,
    margin: 10 * scale,
  },
});

export default GameScreen;