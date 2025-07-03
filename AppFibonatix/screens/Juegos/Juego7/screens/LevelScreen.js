import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, Pressable, ScrollView, Dimensions, BackHandler } from "react-native";
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomAlert from '../../../../assets/components/CustomAlert';
import { useAppContext } from "../../../../assets/context/AppContext";
import { gameService } from "../../../../assets/services/ApiService";
import { foods, levels } from "./levelData";
import useCustomFonts from "../../../../assets/components/FontsConfigure";

const { width } = Dimensions.get("window");
const scale = width / 414;

export default function LevelScreen({ route, navigation }) {
  const { levelId } = route.params;
  const levelData = levels.find(level => level.id === levelId);
  const { clientId, incrementGamePercentage, updateTrophies, updateCoins, decreaseFoodPercentageOnGamePlay, refreshUserData } = useAppContext();
  const [selected, setSelected] = useState([]);
  const [round, setRound] = useState(0);
  const [displayedFoods, setDisplayedFoods] = useState([]);
  const [feedback, setFeedback] = useState({});
  const [timePlayed, setTimePlayed] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [bestTime, setBestTime] = useState(null);
  const [alerts, setAlerts] = useState({ type: null, visible: false });
  const [coinsEarned, setCoinsEarned] = useState(0);
  const [isNewLevel, setIsNewLevel] = useState(false);
  const [correctAttempts, setCorrectAttempts] = useState(0);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [operationTimes, setOperationTimes] = useState([]);
  const [startTime, setStartTime] = useState(null);

  const showAlert = (type) => setAlerts({ type, visible: true });
  const hideAlert = () => setAlerts({ ...alerts, visible: false });

  const { fontsLoaded, onLayoutRootView } = useCustomFonts();
  if (!fontsLoaded) return null;

  const getRandomFoods = () => {
    const levelFoods = foods[levelData.foodsKey];
    const shuffledFoods = [...levelFoods].sort(() => 0.5 - Math.random());
    const requiredType = currentRound.type;
    const filterCondition = currentRound.filter;

    let correctFoods = shuffledFoods;
    if (requiredType) {
      correctFoods = correctFoods.filter(food =>
        Array.isArray(requiredType) ? requiredType.includes(food.type) : food.type === requiredType
      );
    }

    if (filterCondition) {
      correctFoods = correctFoods.filter(filterCondition);
    }

    let atLeastTwo = correctFoods.slice(0, 2);
    if (atLeastTwo.length < 2) {
      const remainingCorrectFoods = shuffledFoods.filter(food => !atLeastTwo.includes(food))
        .filter(food => 
          (requiredType ? (Array.isArray(requiredType) ? requiredType.includes(food.type) : food.type === requiredType) : true) &&
          (!filterCondition || filterCondition(food))
        ).slice(0, 2 - atLeastTwo.length);
      atLeastTwo = [...atLeastTwo, ...remainingCorrectFoods];
    }

    const incorrectFoods = shuffledFoods.filter(food => {
      const typeMatch = requiredType ? 
        (Array.isArray(requiredType) ? !requiredType.includes(food.type) : food.type !== requiredType) : 
        true;
      const filterMatch = filterCondition ? !filterCondition(food) : true;
      return (typeMatch || filterMatch) && !atLeastTwo.includes(food);
    }).slice(0, levelData.itemsPerRound - atLeastTwo.length);

    return [...atLeastTwo, ...incorrectFoods].sort(() => 0.5 - Math.random());
  };

  useEffect(() => {
    setDisplayedFoods(getRandomFoods());
  }, [round]);

  useEffect(() => {
    let interval;
    if (timerActive) {
      interval = setInterval(() => {
        setTimePlayed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!clientId) {
          return;
        }
        const savedBestTime = await AsyncStorage.getItem(`bestTime_level_${levelId}`);
        if (savedBestTime !== null) {
          setBestTime(parseInt(savedBestTime));
        }
      } catch (error) {
        console.error("Error al cargar datos:", error.message);
      }
    };
    loadData();

    const checkFirstTimePlaying = async () => {
      if (levelId === 1) {
        const hasPlayed = await AsyncStorage.getItem("hasPlayedBuscaBefore");
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
  }, [levelId, clientId]);

  const startGame = async () => {
    try {
      if (!clientId) {
        throw new Error("No se encontró el ID del cliente. Por favor, inicia sesión nuevamente.");
      }
      await decreaseFoodPercentageOnGamePlay();
      setTimerActive(true);
      if (levelId === 1) {
        await AsyncStorage.setItem("hasPlayedBuscaBefore", "true");
      }
    } catch (error) {
      console.error("Error al iniciar partida:", error.message);
      showAlert("Error");
    }
  };

  const currentRound = levelData.rounds[round];

  const handleSelect = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((item) => item !== id));
    } else {
      setSelected([...selected, id]);
    }
    setFeedback({});
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

    const allCorrect = selected.every(id => correctSelections.includes(id)) && selected.length === correctSelections.length;
    const endTime = Date.now();
    const timeTaken = startTime ? (endTime - startTime) / 1000 : 0;

    if (allCorrect) {
      setCorrectAttempts(correctAttempts + 1);
      setOperationTimes([...operationTimes, timeTaken]);
      setTimeout(() => {
        if (round < levelData.rounds.length - 1) {
          nextRound();
        } else {
          setTimerActive(false);
          saveBestTime(timePlayed);
          updateGameData();
          showAlert("Correcto");
        }
      }, 1000);
    } else {
      setWrongAttempts(wrongAttempts + 1);
      setOperationTimes([...operationTimes, timeTaken]);
      setTimeout(() => {
        setSelected([]);
        setFeedback({});
      }, 1000);
    }
    setStartTime(Date.now());
  };

  const saveBestTime = async (time) => {
    try {
      const storedBestTime = await AsyncStorage.getItem(`bestTime_level_${levelId}`);
      if (!storedBestTime || time < parseInt(storedBestTime, 10)) {
        await AsyncStorage.setItem(`bestTime_level_${levelId}`, time.toString());
        setBestTime(time);
      }
    } catch (error) {
      console.error('Error guardando el mejor tiempo:', error);
    }
  };

  const getGameData = async () => {
    try {
      const games = await gameService.getGames();
      const game = games.find(g => g.game_ID === 4);
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

  const updateGameData = async () => {
    try {
      setTimerActive(false);

      if (!clientId) {
        throw new Error("No se encontró el ID del cliente. No se puede actualizar el progreso.");
      }

      const gameProgress = await gameService.getGameProgress(clientId);
      const buscaProgress = gameProgress.find(game => game.game_ID === 4);

      const previousPlayedCount = buscaProgress ? buscaProgress.game_played_count || 0 : 0;
      const previousTimePlayed = buscaProgress ? buscaProgress.game_time_played || 0 : 0;
      const previousLevels = buscaProgress ? buscaProgress.game_levels || 0 : 0;

      const isNewLevelLocal = previousLevels < levelId;
      setIsNewLevel(isNewLevelLocal);

      const { gamePercentage, coinsEarned: coins, trophiesEarned } = await getGameData();
      setCoinsEarned(coins);

      if (coins === undefined || trophiesEarned === undefined) {
        throw new Error("Datos del juego incompletos: coins o trophiesEarned no están definidos.");
      }

      const avgTime = operationTimes.length > 0 ? operationTimes.reduce((a, b) => a + b) / operationTimes.length : 0;

      const gameData = {
        game_ID: 4,
        game_played_count: previousPlayedCount + 1,
        game_levels: Math.max(previousLevels, levelId),
        game_time_played: previousTimePlayed + timePlayed,
        coins_earned: coins,
        trophies_earned: isNewLevelLocal ? trophiesEarned : 0,
      };
      await gameService.updateGameProgress(gameData, clientId);

      await incrementGamePercentage(gamePercentage);
      await updateCoins(coins);
      if (isNewLevelLocal) {
        await updateTrophies(trophiesEarned);
      }

      if (buscaProgress && buscaProgress.game_progress_ID) {
        await gameService.updateGamePerformance(
          buscaProgress.game_progress_ID,
          correctAttempts,
          wrongAttempts,
          avgTime
        );
      }

      await refreshUserData();
    } catch (error) {
      console.error("Error al actualizar datos del juego:", error.message);
      showAlert("Error");
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
    setDisplayedFoods(getRandomFoods());
    setTimePlayed(0);
    setTimerActive(true);
    setCorrectAttempts(0);
    setWrongAttempts(0);
    setOperationTimes([]);
    setStartTime(null);
  };

  const mostrarTituloAlerta = (type) => {
    switch (type) {
      case "startGame": return "TORTUGA ALIMENTICIA";
      case "exit": return "SALIR";
      case "Correcto": return "¡Correcto!";
      case "Felicidades": return "¡Felicidades!";
      case "Error": return "Error!";
      default: return "Alerta";
    }
  };

  const mostrarMensajeAlerta = (type) => {
    switch (type) {
      case "startGame": return "Encuentra los elementos correctos en cada ronda.";
      case "exit": return "¿Quieres abandonar el juego?";
      case "Correcto": return `Has completado el nivel.\nRecompensas: ${coinsEarned} monedas${isNewLevel ? ", 1 trofeo" : ""}.`;
      case "Felicidades": return "Has completado todos los niveles.";
      case "Error": return "Hubo un error al procesar tu progreso.";
      default: return null;
    }
  };

  const textoConfirmar = (type) => {
    switch (type) {
      case "startGame": return "JUGAR";
      case "Felicidades": return "Salir";
      case "Correcto": return levelId < 4 ? "Siguiente Nivel" : "Finalizar";
      default: return "Aceptar";
    }
  };

  const textoCancelar = (type) => {
    switch (type) {
      case "Felicidades": return "Niveles";
      case "Correcto": return "Salir";
      default: return "Cancelar";
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
        if (levelId < 4) {
          navigation.navigate("LevelScreen", { levelId: levelId + 1 });
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

  const handleBackPress = () => {
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
    <SafeAreaView style={styles.container} onLayout={onLayoutRootView}>
      <View style={styles.header}>
        <View style={styles.cajaTitulo}>
          <Text style={styles.titulo}>Busca y Encuentra</Text>
        </View>
        <View style={styles.cajaIconos}>
          <Pressable style={styles.button1} onPress={restartLevel}>
            {({ pressed }) => (
              <Ionicons
                name="reload-circle"
                size={50 * scale}
                color={pressed ? "#1F7023" : "#2FBB2F"}
              />
            )}
          </Pressable>
          <View style={styles.cajaNivel}>
            <Text style={styles.Nivel}>NVL. {levelId}</Text>
          </View>
          <Pressable style={styles.button1} onPress={() => showAlert("exit")}>
            {({ pressed }) => (
              <MaterialIcons
                name="exit-to-app"
                size={47 * scale}
                color={pressed ? "#1F7023" : "#2FBB2F"}
              />
            )}
          </Pressable>
        </View>
        <View style={styles.cajaPuntajes}>
          {bestTime !== null && (
            <View style={styles.puntajeContainer}>
              <Ionicons name="trophy" size={30 * scale} color="#2FBB2F" style={styles.icon} />
              <Text style={styles.score}>
                {`${Math.floor(bestTime / 60).toString().padStart(2, '0')}:${(bestTime % 60).toString().padStart(2, '0')}`}
              </Text>
            </View>
          )}
          <View style={styles.puntajeContainer}>
            <MaterialIcons name="timer" size={30 * scale} color="#2FBB2F" style={styles.icon} />
            <Text style={styles.score}>
              {`${Math.floor(timePlayed / 60).toString().padStart(2, '0')}:${(timePlayed % 60).toString().padStart(2, '0')}`}
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
            <TouchableOpacity
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
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      <View style={styles.buttonContainer}>
        <Pressable style={styles.button} onPress={checkSelection}>
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
          confirmButtonColor="#2FBB2F"
          cancelButtonColor="#DDFFDA"
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#C0F8BC",
  },
  header: {
    backgroundColor: "#90F0A5",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30 * scale,
    marginHorizontal: 10 * scale,
    paddingVertical: 10 * scale,
  },
  cajaTitulo: {
    marginVertical: 5 * scale,
  },
  titulo: {
    fontSize: RFPercentage(3.5),
    color: "#2FBB2F",
    fontFamily: "Quicksand",
  },
  cajaIconos: {
    flexDirection: "row",
    marginVertical: 5 * scale,
  },
  cajaNivel: {
    borderRadius: 90 * scale,
    backgroundColor: "#2FBB2F",
    alignItems: "center",
    justifyContent: "center",
    height: 46 * scale,
    width: 90 * scale,
  },
  Nivel: {
    fontSize: RFPercentage(2.5),
    color: "#C3F1C0",
    fontFamily: "Quicksand",
  },
  button1: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 12 * scale,
  },
  cajaPuntajes: {
    flexDirection: "row",
    marginVertical: 5 * scale,
    backgroundColor: "#C3F1C0",
    borderRadius: 30 * scale,
    paddingHorizontal: 10 * scale,
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
    fontSize: RFPercentage(3),
    color: "#2FBB2F",
    fontFamily: "Quicksand",
  },
  topBar: {
    backgroundColor: "#90F0A5",
    borderRadius: 30,
    alignItems: "center",
    paddingVertical: 20,
    marginHorizontal: 15,
  },
  topControls: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    gap: 15,
  },
  titleText: {
    fontSize: RFPercentage(3),
    color: "#2FBB2F",
    marginBottom: 10,
    fontFamily: "Quicksand",
  },
  levelContainer: {
    backgroundColor: "#2FBB2F",
    width: 90 * scale,
    height: 46 * scale,
    borderRadius: 90 * scale,
    alignItems: "center",
    justifyContent: "center",
  },
  levelText: {
    fontSize: RFPercentage(2),
    color: "#C3F1C0",
    textAlign: "center",
    fontFamily: "Quicksand",
  },
  roundContainer: {
    alignItems: "center",
    marginVertical: 10 * scale,
  },
  roundText: {
    fontSize: RFPercentage(2.5),
    fontFamily: "Quicksand_SemiBold",
    marginBottom: 10 * scale,
    color: "#000000",
    textAlign: "center",
  },
  title: {
    fontSize: RFPercentage(2),
    fontFamily: "Quicksand_Medium",
    textAlign: "center",
  },
  greenBackground: {
    backgroundColor: "#90F0A5",
    borderRadius: 20 * scale,
    marginHorizontal: 10 * scale,
    padding: 5 * scale,
    flex: 1,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
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
    alignItems: "center",
    marginBottom: 10 * scale,
  },
  button: {
    marginTop: 10 * scale,
    padding: 10 * scale,
    backgroundColor: "#187918",
    borderRadius: 10 * scale,
    justifyContent: "center",
    alignItems: "center",
    width: "50%",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: RFPercentage(2.5),
    fontFamily: "Quicksand",
  },
});