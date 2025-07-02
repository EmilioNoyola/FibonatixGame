import * as React from "react";
import { useState, useEffect } from "react";
import { Text, View, Pressable, Dimensions } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { BackHandler } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { JuegoMemoramaStyles } from "../styles/JuegoMemoramaStyles";
import Card from "../Card";
import CustomAlert from "../../../../assets/components/CustomAlert";
import { useAppContext } from "../../../../assets/context/AppContext";
import { gameService } from "../../../../assets/services/ApiService";

// Datos de las tarjetas para cada nivel
const levelData = {
  1: ["1+1", "2", "2+2", "4", "3+3", "6", "4+4", "8", "5+5", "10", "6+6", "12"],
  2: ["3+4", "7", "5+2", "7", "4+5", "9", "6+3", "9", "2+6", "8", "1+7", "8"],
  3: ["5+6", "11", "7+3", "10", "4+7", "11", "6+5", "11", "3+8", "11", "2+8", "10"],
  4: ["8+5", "13", "9-4", "5", "7+6", "13", "10-5", "5", "12-7", "5", "6+7", "13"],
  5: ["9+5", "14", "11-6", "5", "8+7", "15", "12-8", "4", "13-9", "4", "7+8", "15"],
  6: ["10+4", "14", "13-7", "6", "9+6", "15", "14-8", "6", "15-9", "6", "8+6", "14"],
  7: ["2x3", "6", "8+7", "15", "4x2", "8", "14-9", "5", "5+9", "14", "3x3", "9", "12-7", "5", "6+8", "14"],
  8: ["3x4", "12", "9+6", "15", "5x2", "10", "15-8", "7", "7+8", "15", "4x3", "12", "13-6", "7", "6+9", "15"],
  9: ["4x5", "20", "10+8", "18", "3x6", "18", "16-9", "7", "8+7", "15", "5x4", "20", "14-7", "7", "9+6", "15"],
  10: ["10÷2", "5", "6x3", "18", "12-7", "5", "8+7", "15", "15÷3", "5", "14-9", "5", "4x5", "20", "7+8", "15"],
  11: ["20÷5", "4", "5x4", "20", "15-9", "6", "9+6", "15", "12÷3", "4", "16-10", "6", "3x6", "18", "8+7", "15"],
  12: ["25÷5", "5", "6x4", "24", "17-11", "6", "10+7", "17", "15÷3", "5", "18-12", "6", "4x5", "20", "9+8", "17"],
};

// Función para mezclar las tarjetas
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
  }
  return array;
}

const { width, height } = Dimensions.get("window");
const scale = width / 414; // Escala basada en un diseño de referencia de 414px de ancho

export default function JuegoMemorama({ navigation, route }) {
  const {
    clientId,
    incrementGamePercentage,
    updateTrophies,
    decreaseFoodPercentageOnGamePlay,
    refreshUserData,
  } = useAppContext();

  const [isGameStarted, setIsGameStarted] = useState(false);
  const [exitAttempt, setExitAttempt] = useState(false);
  const [timePlayed, setTimePlayed] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  const level = route.params.level;
  const cards = levelData[level];

  const [board, setBoard] = useState(() => shuffle([...cards]));
  const [selectedCards, setSelectedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(null);
  const [didWin, setDidWin] = useState(false);
  const [unlockedLevels, setUnlockedLevels] = useState([1]);
  const [previousGameProgress, setPreviousGameProgress] = useState(null);
  const [alerts, setAlerts] = useState({ type: null, visible: false });
  const [coinsEarned, setCoinsEarned] = useState(0);
  const [isNewLevel, setIsNewLevel] = useState(false);

  const [correctAttempts, setCorrectAttempts] = useState(0);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [operationTimes, setOperationTimes] = useState([]); // Para almacenar tiempos de cada intento
  const [startTime, setStartTime] = useState(null); // Para medir el tiempo por operación

  const showAlert = (type) => setAlerts({ type, visible: true });
  const hideAlert = () => setAlerts({ ...alerts, visible: false });

  // Temporizador
  useEffect(() => {
    let interval;
    if (timerActive) {
      interval = setInterval(() => {
        setTimePlayed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  // Reiniciar el juego cuando cambia el nivel
  useEffect(() => {
    resetGame();
  }, [level]);

  // Iniciar partida: decrementar food percentage y comenzar temporizador
  const startGame = async () => {
    try {
      if (!clientId) {
        throw new Error("No se encontró el ID del cliente. Por favor, inicia sesión nuevamente.");
      }
      await decreaseFoodPercentageOnGamePlay();
      setTimerActive(true);
      setIsGameStarted(true);
      if (level === 1) {
        await AsyncStorage.setItem("hasPlayedBefore", "true");
      }
    } catch (error) {
      console.error("Error al iniciar partida:", error.message);
      showAlert("Error");
    }
  };

  // Cargar niveles desbloqueados y mejor puntaje
  useEffect(() => {
    const loadData = async () => {
      try {
        if (!clientId) {
          console.warn("No clientId available, skipping data load.");
          setUnlockedLevels([1]);
          return;
        }

        // Cargar niveles desbloqueados desde la base de datos
        const levelsUnlocked = await gameService.getUnlockedLevels(clientId, 1);
        const levelsArray = Array.from({ length: levelsUnlocked }, (_, i) => i + 1);
        setUnlockedLevels(levelsArray.length > 0 ? levelsArray : [1]);

        // Cargar el progreso anterior para determinar si el nivel ya fue completado
        const gameProgress = await gameService.getGameProgress(clientId);
        const memoramaProgress = gameProgress.find(game => game.game_ID === 1);
        setPreviousGameProgress(memoramaProgress);

        // Cargar mejor puntaje desde AsyncStorage
        const savedBestScore = await AsyncStorage.getItem(`bestScoreNivel${level}`);
        if (savedBestScore !== null) {
          setBestScore(parseInt(savedBestScore));
        }
      } catch (error) {
        console.error("Error al cargar datos:", error.message);
        setUnlockedLevels([1]);
      }
    };
    loadData();

    const checkFirstTimePlaying = async () => {
      if (level === 1) {
        const hasPlayed = await AsyncStorage.getItem("hasPlayedBefore");
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

  const didPlayerWin = () => matchedCards.length === board.length;

  // Obtener datos del juego desde la base de datos
  const getGameData = async () => {
    try {
      const games = await gameService.getGames();
      const game = games.find(g => g.game_ID === 1); // Memorama Matemático
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

  // Actualizar datos en la base de datos al completar un nivel
  const updateGameData = async () => {
    try {
      setTimerActive(false);

      if (!clientId) {
        throw new Error("No se encontró el ID del cliente. No se puede actualizar el progreso.");
      }

      const gameProgress = await gameService.getGameProgress(clientId);
      const memoramaProgress = gameProgress.find(game => game.game_ID === 1);

      const previousPlayedCount = memoramaProgress ? memoramaProgress.game_played_count || 0 : 0;
      const previousTimePlayed = memoramaProgress ? memoramaProgress.game_time_played || 0 : 0;
      const previousLevels = memoramaProgress ? memoramaProgress.game_levels || 0 : 0;

      const isNewLevelLocal = previousLevels < level;
      setIsNewLevel(isNewLevelLocal);

      const { gamePercentage, coinsEarned: coins, trophiesEarned } = await getGameData();
      setCoinsEarned(coins);

      if (coins === undefined || trophiesEarned === undefined) {
        throw new Error("Datos del juego incompletos: coins o trophiesEarned no están definidos.");
      }

      // Calcular tiempo promedio por operación
      const avgTime = operationTimes.length > 0 ? operationTimes.reduce((a, b) => a + b) / operationTimes.length : 0;

      // Actualizar Game_Progress
      const gameData = {
        game_ID: 1,
        game_played_count: previousPlayedCount + 1,
        game_levels: Math.max(previousLevels, level),
        game_time_played: previousTimePlayed + timePlayed,
        coins_earned: coins,
        trophies_earned: isNewLevelLocal ? trophiesEarned : 0,
      };
      await gameService.updateGameProgress(gameData, clientId);

      // Actualizar Global_Data
      await incrementGamePercentage(gamePercentage);
      if (isNewLevelLocal) {
        await updateTrophies(trophiesEarned);
      }

      // Actualizar Game_Performance
      if (memoramaProgress && memoramaProgress.game_progress_ID) {
        await gameService.updateGamePerformance(
          memoramaProgress.game_progress_ID,
          correctAttempts,
          wrongAttempts,
          avgTime
        );
      }

      await refreshUserData();

      const newLevelsUnlocked = Math.max(previousLevels, level) + 1;
      const levelsArray = Array.from({ length: newLevelsUnlocked }, (_, i) => i + 1);
      setUnlockedLevels(levelsArray.length > 0 ? levelsArray : [1]);
    } catch (error) {
      console.error("Error al actualizar datos del juego:", error.message);
      console.error("Detalles del error:", error.response ? error.response.data : error);
      showAlert("Error");
    }
  };

  // Verificar si el jugador ganó y actualizar datos
  useEffect(() => {
    if (didPlayerWin()) {
      setDidWin(true);
      updateGameData();
      showAlert("Correcto");
    }
  }, [matchedCards]);

  // Guardar mejor puntaje
  useEffect(() => {
    const saveBestScore = async () => {
      if (didWin && (bestScore === null || score < bestScore)) {
        await AsyncStorage.setItem(`bestScoreNivel${level}`, score.toString());
        setBestScore(score);
      }
    };
    saveBestScore();
  }, [matchedCards]);

  const isMatch = (card1, card2) => {
    const evalCard1 = isNaN(card1) ? eval(card1) : parseInt(card1);
    const evalCard2 = isNaN(card2) ? eval(card2) : parseInt(card2);
    return evalCard1 === evalCard2;
  };

  useEffect(() => {
    if (selectedCards.length < 2) return;

    const [firstIndex, secondIndex] = selectedCards;
    const firstCard = board[firstIndex];
    const secondCard = board[secondIndex];
    const endTime = Date.now();
    const timeTaken = startTime ? (endTime - startTime) / 1000 : 0; // Tiempo en segundos

    if (isMatch(firstCard, secondCard)) {
      setMatchedCards([...matchedCards, firstIndex, secondIndex]);
      setCorrectAttempts(correctAttempts + 1);
      setOperationTimes([...operationTimes, timeTaken]);
    } else {
      setWrongAttempts(wrongAttempts + 1);
      setOperationTimes([...operationTimes, timeTaken]);
    }

    const timeoutId = setTimeout(() => setSelectedCards([]), 1000);
    return () => clearTimeout(timeoutId);
  }, [selectedCards]);

  const handleTapCard = (index) => {
    if (selectedCards.length >= 2 || selectedCards.includes(index)) return;

    // Inicia el temporizador para esta operación si es el primer toque
    if (selectedCards.length === 0) {
      setStartTime(Date.now());
    }

    setSelectedCards([...selectedCards, index]);
    setScore(score + 1);

    // Solo actualizamos intentos al hacer match o fallar (en el useEffect de selectedCards)
  };

  const resetGame = () => {
    setMatchedCards([]);
    setScore(0);
    setSelectedCards([]);
    setBoard(shuffle([...cards]));
    setTimePlayed(0);
    setTimerActive(true);
    setDidWin(false);
    setCorrectAttempts(0);
    setWrongAttempts(0);
    setOperationTimes([]);
    setStartTime(null);
  };

  const mostrarTituloAlerta = (type) => {
    switch (type) {
      case "startGame":
        return "Memorama Matemático";
      case "exit":
        return "SALIR";
      case "Correcto":
        return "¡Correcto!";
      case "Felicidades":
        return "¡Felicidades!";
      case "Error":
        return "Error!";
      default:
        return "Alerta";
    }
  };

  const mostrarMensajeAlerta = (type) => {
    switch (type) {
      case "startGame":
        return "Junta pares de operaciones con su respuesta hasta completar toda la tabla.";
      case "exit":
        return "¿Quieres abandonar el juego?";
      case "Correcto":
        return `Has completado el nivel.\nRecompensas: ${coinsEarned} monedas${isNewLevel ? ", 1 trofeo" : ""}.`;
      case "Felicidades":
        return "Has completado todos los niveles.";
      case "Error":
        return "Hubo un error al procesar tu progreso. Intenta de nuevo más tarde.";
      default:
        return null;
    }
  };

  const textoConfirmar = (type) => {
    switch (type) {
      case "startGame":
        return "JUGAR";
      case "Felicidades":
        return "Salir";
      case "Correcto":
        return level < 12 ? "Siguiente Nivel" : "Finalizar";
      default:
        return "Aceptar";
    }
  };

  const textoCancelar = (type) => {
    switch (type) {
      case "Felicidades":
        return "Niveles";
      case "Correcto":
        return "Salir";
      default:
        return "Cancelar";
    }
  };

  const handleConfirmAlert = async () => {
    switch (alerts.type) {
      case "startGame":
        await startGame();
        hideAlert();
        break;
      case "exit":
        navigation.navigate("HomeScreen");
        hideAlert();
        break;
      case "Felicidades":
        navigation.navigate("HomeScreen");
        hideAlert();
        break;
      case "Correcto":
        if (level < 12) {
          navigation.navigate("JuegoMemorama", { level: level + 1 });
        } else {
          showAlert("Felicidades");
        }
        hideAlert();
        break;
      case "Error":
        hideAlert();
        break;
      default:
        hideAlert();
        break;
    }
  };

  const handleCancelAlert = () => {
    switch (alerts.type) {
      case "Felicidades":
        navigation.navigate("SeleccionDeNivel");
        break;
      case "Correcto":
        navigation.navigate("HomeScreen");
        break;
      default:
        break;
    }
    hideAlert();
  };

  const handleBackPress = () => {
    setExitAttempt(true);
    showAlert("exit");
    return true;
  };

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handleBackPress);
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
    };
  }, []);

  return (
    <SafeAreaView style={JuegoMemoramaStyles.main}>
      <StatusBar style="dark" />
      <View style={JuegoMemoramaStyles.header}>
        <View style={JuegoMemoramaStyles.cajaTitulo}>
          <Text style={JuegoMemoramaStyles.titulo}>
            {didWin ? "¡Completado!" : "MEMORAMA MATEMÁTICO"}
          </Text>
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
          <Pressable style={JuegoMemoramaStyles.button} onPress={() => showAlert("exit")}>
            {({ pressed }) => (
              <MaterialIcons
                name="exit-to-app"
                size={47}
                color={pressed ? "#b26701" : "#da7e01"}
              />
            )}
          </Pressable>
        </View>
        <View style={JuegoMemoramaStyles.cajaPuntajes}>
          {bestScore !== null && (
            <View style={JuegoMemoramaStyles.puntajeContainer}>
              <Ionicons name="trophy" size={30 * scale} color="#da7e01" style={JuegoMemoramaStyles.icon} />
              <Text style={JuegoMemoramaStyles.score}>{bestScore}</Text>
            </View>
          )}
          <View style={JuegoMemoramaStyles.puntajeContainer}>
            <MaterialIcons name="touch-app" size={30 * scale} color="#da7e01" style={JuegoMemoramaStyles.icon} />
            <Text style={JuegoMemoramaStyles.score}>{score}</Text>
          </View>
          <View style={JuegoMemoramaStyles.puntajeContainer}>
            <MaterialIcons name="timer" size={30 * scale} color="#da7e01" style={JuegoMemoramaStyles.icon} />
            <Text style={JuegoMemoramaStyles.score}>
              {Math.floor(timePlayed / 60)}:{(timePlayed % 60).toString().padStart(2, "0")}
            </Text>
          </View>
          <View style={JuegoMemoramaStyles.puntajeContainer}>
            <MaterialIcons name="check" size={30 * scale} color="#da7e01" style={JuegoMemoramaStyles.icon} />
            <Text style={JuegoMemoramaStyles.score}>{correctAttempts}</Text>
          </View>
          <View style={JuegoMemoramaStyles.puntajeContainer}>
            <MaterialIcons name="close" size={30 * scale} color="#da7e01" style={JuegoMemoramaStyles.icon} />
            <Text style={JuegoMemoramaStyles.score}>{wrongAttempts}</Text>
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
          onCancel={alerts.type === "startGame" ? null : handleCancelAlert}
          confirmText={textoConfirmar(alerts.type)}
          cancelText={textoCancelar(alerts.type)}
          confirmButtonColor={"#eb8c05"}
          cancelButtonColor={"#fdd295"}
        />
      )}
    </SafeAreaView>
  );
}