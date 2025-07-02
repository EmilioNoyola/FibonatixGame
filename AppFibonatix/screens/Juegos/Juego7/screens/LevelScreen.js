import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  StyleSheet, 
  Pressable, 
  ScrollView, 
  Dimensions,
  BackHandler,
  StatusBar
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from "react-native-safe-area-context";
import { RFPercentage } from 'react-native-responsive-fontsize';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { foods, levels } from "./levelData";
import CustomAlert from "../../../../assets/components/CustomAlert";
import { useAppContext } from "../../../../assets/context/AppContext";
import { gameService } from "../../../../assets/services/ApiService";

const { width, height } = Dimensions.get("window");
const scale = width / 414;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#C0F8BC",
  },
  topBar: {
    backgroundColor: '#90F0A5',
    borderRadius: 30 * scale,
    alignItems: 'center',
    paddingVertical: 10 * scale,
    marginHorizontal: 15 * scale,
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    gap: 15 * scale,
  },
  titleText: {
    fontSize: RFPercentage(3.5),
    color: '#2FBB2F',
    marginBottom: 10 * scale,
    fontFamily: 'Quicksand'
  },
  levelContainer: {
    backgroundColor: '#2FBB2F',
    width: 90 * scale,
    height: 46 * scale,
    borderRadius: 90 * scale,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelText: {
    fontSize: RFPercentage(2.5),
    color: '#C3F1C0',
    textAlign: 'center',
    fontFamily: 'Quicksand',
  },
  roundContainer: {
    alignItems: 'center',
    marginVertical: 10 * scale,
  },
  roundText: {
    fontSize: RFPercentage(3),
    fontFamily: 'Quicksand',
    marginBottom: 10 * scale,
    color: "#000000",
    textAlign: 'center',
  },
  title: {
    fontSize: RFPercentage(2.8),
    fontFamily: 'Quicksand',
    textAlign: 'center',
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    backgroundColor: "#90F0A5",
    borderRadius: 20 * scale,
    marginHorizontal: 15 * scale,
    padding: 5 * scale,
  },
  item: {
    alignItems: "center",
    margin: 6 * scale,
    borderWidth: 2 * scale,
    backgroundColor: "#FFF",
    borderColor: "#098223",
    borderRadius: 10 * scale,
    width: 100 * scale,
    height: 95 * scale,
    justifyContent: "center",
  },
  image: {
    width: 70 * scale,
    height: 70 * scale,
  },
  buttonContainer: {
    alignItems: 'center',
    marginVertical: 10 * scale,
  },
  button: {
    padding: 10 * scale,
    backgroundColor: "#187918",
    borderRadius: 10 * scale,
    justifyContent: 'center',
    alignItems: 'center',
    width: '50%',
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: RFPercentage(2.8),
    fontFamily: 'Quicksand',
  },
  cajaPuntajes: {
    flexDirection: "row",
    marginVertical: 5 * scale,
    backgroundColor: "#C3F1C0",
    borderRadius: 30 * scale,
    paddingHorizontal: 10 * scale,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5 * scale,
  },
  puntajeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 8 * scale,
  },
  icon: {
    marginRight: 5 * scale,
  },
  score: {
    fontSize: RFPercentage(2.5),
    color: "#2FBB2F",
    fontFamily: "Quicksand",
  },
});

export default function LevelScreen({ route, navigation }) {
  const { clientId, 
    incrementGamePercentage, 
    updateTrophies, 
    decreaseFoodPercentageOnGamePlay,
    refreshUserData
  } = useAppContext();
  
  const { levelId } = route.params;
  const levelData = levels.find(level => level.id === levelId);
  const [selected, setSelected] = useState([]);
  const [round, setRound] = useState(0);
  const [displayedFoods, setDisplayedFoods] = useState([]);
  const [feedback, setFeedback] = useState({});
  const [timePlayed, setTimePlayed] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(null);
  const [alerts, setAlerts] = useState({ type: null, visible: false });
  const [coinsEarned, setCoinsEarned] = useState(0);
  const [isNewLevel, setIsNewLevel] = useState(false);
  const [exitAttempt, setExitAttempt] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);

  const currentRound = levelData.rounds[round];
  
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

  // Iniciar partida: decrementar food percentage y comenzar temporizador
  const startGame = async () => {
    try {
      if (!clientId) {
        throw new Error("No se encontró el ID del cliente. Por favor, inicia sesión nuevamente.");
      }
      await decreaseFoodPercentageOnGamePlay();
      setTimerActive(true);
      setIsGameStarted(true);
      if (levelId === 1) {
        await AsyncStorage.setItem("hasPlayedBefore", "true");
      }
    } catch (error) {
      console.error("Error al iniciar partida:", error.message);
      showAlert("Error");
    }
  };

  // Cargar mejor puntaje
  useEffect(() => {
    const loadBestScore = async () => {
      try {
        const savedBestScore = await AsyncStorage.getItem(`bestScoreLevel${levelId}`);
        if (savedBestScore !== null) {
          setBestScore(parseInt(savedBestScore));
        }
      } catch (error) {
        console.error("Error al cargar mejor puntaje:", error);
      }
    };
    loadBestScore();

    const checkFirstTimePlaying = async () => {
      if (levelId === 1) {
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
  }, [levelId]);

  const getRandomFoods = () => {
    const levelFoods = foods[levelData.foodsKey];
    const shuffledFoods = [...levelFoods].sort(() => 0.5 - Math.random());
    const requiredType = currentRound.type;
    const filterCondition = currentRound.filter;
  
    // Filtra alimentos correctos basados en tipo y/o condición de filtro
    let correctFoods = shuffledFoods;
    
    if (requiredType) {
      correctFoods = correctFoods.filter(food =>
        Array.isArray(requiredType) ? requiredType.includes(food.type) : food.type === requiredType
      );
    }
  
    if (filterCondition) {
      correctFoods = correctFoods.filter(filterCondition);
    }
  
    // Asegúrate de que haya al menos 2 alimentos correctos
    let atLeastTwo = correctFoods.slice(0, 2);
    if (atLeastTwo.length < 2) {
      console.warn("No hay suficientes alimentos que cumplan los criterios");
      const remainingCorrectFoods = shuffledFoods.filter(food => !atLeastTwo.includes(food))
        .filter(food => 
          (requiredType ? (Array.isArray(requiredType) ? requiredType.includes(food.type) : food.type === requiredType) : true) &&
          (!filterCondition || filterCondition(food))
        ).slice(0, 2 - atLeastTwo.length);
        
      atLeastTwo = [...atLeastTwo, ...remainingCorrectFoods];
    }
  
    // Completa con alimentos incorrectos
    const incorrectFoods = shuffledFoods.filter(food => {
      const typeMatch = requiredType ? 
        (Array.isArray(requiredType) ? !requiredType.includes(food.type) : food.type !== requiredType) : 
        true;
      const filterMatch = filterCondition ? !filterCondition(food) : true;
      return (typeMatch || filterMatch) && !atLeastTwo.includes(food);
    }).slice(0, levelData.itemsPerRound - atLeastTwo.length);
  
    // Mezcla alimentos correctos e incorrectos
    const finalFoods = [...atLeastTwo, ...incorrectFoods].sort(() => 0.5 - Math.random());
  
    return finalFoods;
  };
  
  useEffect(() => {
    setDisplayedFoods(getRandomFoods());
  }, [round, levelId]);

  const handleSelect = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((item) => item !== id));
    } else {
      setSelected([...selected, id]);
      setScore(score + 1);
    }
    setFeedback({});
  };

  // Obtener datos del juego desde la base de datos
  const getGameData = async () => {
    try {
      const games = await gameService.getGames();
      const game = games.find(g => g.game_ID === 4); // Tortuga Alimenticia
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

      // Obtener el progreso actual para acumular valores
      const gameProgress = await gameService.getGameProgress(clientId);
      const tortugaProgress = gameProgress.find(game => game.game_ID === 4);

      const previousPlayedCount = tortugaProgress ? tortugaProgress.game_played_count || 0 : 0;
      const previousTimePlayed = tortugaProgress ? tortugaProgress.game_time_played || 0 : 0;
      const previousLevels = tortugaProgress ? tortugaProgress.game_levels || 0 : 0;

      // Determinar si este nivel es nuevo (para los trofeos)
      const isNewLevelLocal = previousLevels < levelId;
      setIsNewLevel(isNewLevelLocal);

      // Obtener datos del juego
      const { gamePercentage, coinsEarned: coins, trophiesEarned } = await getGameData();
      setCoinsEarned(coins);

      // Validar que todos los valores sean definidos
      if (coins === undefined || trophiesEarned === undefined) {
        throw new Error("Datos del juego incompletos: coins o trophiesEarned no están definidos.");
      }

      // Actualizar Game_Progress
      const gameData = {
        game_ID: 4,
        game_played_count: previousPlayedCount + 1,
        game_levels: Math.max(previousLevels, levelId),
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

      await refreshUserData();
    } catch (error) {
      console.error("Error al actualizar datos del juego:", error.message);
      console.error("Detalles del error:", error.response ? error.response.data : error);
      showAlert("Error");
    }
  };

  const checkSelection = () => {
    let newFeedback = {};
    const correctSelections = displayedFoods
      .filter(food => {
        const typeMatch = currentRound.type ? 
          (Array.isArray(currentRound.type) ? currentRound.type.includes(food.type) : food.type === currentRound.type) : 
          true;
        const filterMatch = currentRound.filter ? currentRound.filter(food) : true;
        return typeMatch && filterMatch;
      })
      .map(food => food.id);
  
    selected.forEach(id => {
      newFeedback[id] = correctSelections.includes(id) ? "green" : "red";
    });
  
    setFeedback(newFeedback);
  
    const allCorrect = selected.every(id => correctSelections.includes(id)) && 
                      selected.length === correctSelections.length;
  
    if (allCorrect) {
      setTimeout(() => {
        if (round < levelData.rounds.length - 1) {
          nextRound();
        } else {
          // Nivel completado, desbloquear siguiente nivel
          updateGameData();
          unlockNextLevel();
        }
      }, 1000);
    } else {
      setTimeout(() => {
        setSelected([]);
        setFeedback({});
      }, 1000);
    }
  };

  const unlockNextLevel = async () => {
    // Guardar mejor puntaje
    if (bestScore === null || score < bestScore) {
      await AsyncStorage.setItem(`bestScoreLevel${levelId}`, score.toString());
      setBestScore(score);
    }

    if (levelData.nextLevel) {
      try {
        // Obtener niveles desbloqueados actuales
        const levelsUnlocked = await gameService.getUnlockedLevels(clientId, 4);
        const levelsArray = Array.from({ length: levelsUnlocked }, (_, i) => i + 1);
        
        if (!levelsArray.includes(levelData.nextLevel)) {
          showAlert("Correcto");
        } else {
          showAlert("Felicidades");
        }
      } catch (error) {
        console.error('Error al verificar niveles desbloqueados:', error);
        showAlert("Correcto");
      }
    } else {
      // Si es el último nivel
      showAlert("Felicidades");
    }
  };

  const nextRound = () => {
    setSelected([]);
    setFeedback({});
    setRound(round + 1);
  };
  
  const restartLevel = () => {
    setRound(0);
    setSelected([]);
    setFeedback({});
    setScore(0);
    setDisplayedFoods(getRandomFoods());
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

  const mostrarTituloAlerta = (type) => {
    switch (type) {
      case "startGame":
        return "Tortuga Alimenticia";
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
        return "Selecciona los alimentos que coincidan con la descripción de cada ronda.";
      case "exit":
        return "¿Quieres abandonar el juego?";
      case "Correcto":
        return `Has completado el nivel.\nRecompensas: ${coinsEarned} monedas${isNewLevel ? ", 1 trofeo" : ""}.`;
      case "Felicidades":
        return levelData.nextLevel 
          ? `Has completado el nivel ${levelData.title}. ¡Puedes avanzar al siguiente nivel!` 
          : "¡Has completado todos los niveles del juego!";
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
        return levelData.nextLevel ? "Siguiente Nivel" : "Finalizar";
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
        navigation.navigate("Levels");
        hideAlert();
        break;
      case "Felicidades":
        navigation.navigate("Levels");
        hideAlert();
        break;
      case "Correcto":
        if (levelData.nextLevel) {
          navigation.replace("LevelScreen", { levelId: levelData.nextLevel });
        } else {
          navigation.navigate("Levels");
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
        navigation.navigate("Levels");
        break;
      case "Correcto":
        navigation.navigate("Levels");
        break;
      default:
        break;
    }
    hideAlert();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.topBar}>
        <Text style={styles.titleText}>TORTUGA ALIMENTICIA</Text>
        
        <View style={styles.topControls}>
          <Pressable style={styles.button} onPress={restartLevel}>
            {({ pressed }) => (
              <Ionicons
                name="reload-circle"
                size={40 * scale}
                color={pressed ? '#1FAB1F' : '#2FBB2F'}
              />
            )}
          </Pressable>
          
          <View style={styles.levelContainer}>
            <Text style={styles.levelText}>NVL. {levelId}</Text>
          </View>
          
          <Pressable style={styles.button} onPress={() => showAlert("exit")}>
            {({ pressed }) => (
              <MaterialCommunityIcons
                name="exit-to-app"
                size={42 * scale}
                color={pressed ? '#1FAB1F' : '#2FBB2F'}
              />
            )}
          </Pressable>
        </View>
        
        <View style={styles.cajaPuntajes}>
          {bestScore !== null && (
            <View style={styles.puntajeContainer}>
              <Ionicons name="trophy" size={30 * scale} color="#2FBB2F" style={styles.icon} />
              <Text style={styles.score}>{bestScore}</Text>
            </View>
          )}
          <View style={styles.puntajeContainer}>
            <MaterialCommunityIcons name="gesture-tap" size={30 * scale} color="#2FBB2F" style={styles.icon} />
            <Text style={styles.score}>{score}</Text>
          </View>
          <View style={styles.puntajeContainer}>
            <MaterialCommunityIcons name="timer" size={30 * scale} color="#2FBB2F" style={styles.icon} />
            <Text style={styles.score}>
              {Math.floor(timePlayed / 60)}:{(timePlayed % 60).toString().padStart(2, "0")}
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.roundContainer}>
        <Text style={styles.roundText}>Ronda {round + 1}</Text> 
        <Text style={styles.title}>{currentRound.title}</Text>
      </View>
      
      <View style={styles.greenBackground}>
        <ScrollView
          contentContainerStyle={styles.grid}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {displayedFoods.map((food) => (
            <Pressable
              key={food.id}
              style={[ 
                styles.item,
                selected.includes(food.id) && { borderColor: "blue", backgroundColor: "#9DDAFB" },
                feedback[food.id] && { 
                  borderColor: feedback[food.id], 
                  backgroundColor: feedback[food.id] === "red" ? "#F88787" : "#13FF52" 
                }
              ]}
              onPress={() => handleSelect(food.id)}
            >
              <Image 
                source={{ uri: food.image }} 
                style={styles.image} 
                defaultSource={require('../../../../assets/img/tortuga.png')}
              />
              <Text style={styles.itemText}>{food.name}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>
      
      <View style={styles.buttonContainer}>
        <Pressable 
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: pressed ? '#0E5A0E' : '#187918' }
          ]} 
          onPress={checkSelection}
        >
          <Text style={styles.buttonText}>Verificar</Text>
        </Pressable>
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
          confirmButtonColor={"#2FBB2F"}
          cancelButtonColor={"#C0F8BC"}
        />
      )}
    </SafeAreaView>
  );
}