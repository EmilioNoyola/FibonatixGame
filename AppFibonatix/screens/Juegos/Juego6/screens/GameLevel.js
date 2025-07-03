import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BackHandler } from "react-native";
import { Animated } from "react-native";
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { RFPercentage } from "react-native-responsive-fontsize";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomAlert from "../../../../assets/components/CustomAlert";
import { useAppContext } from "../../../../assets/context/AppContext";
import { gameService } from "../../../../assets/services/ApiService";
import Svg, { Circle, Path } from "react-native-svg";

const { width } = Dimensions.get("window");
const scale = width / 414;

const FractionCircle = ({ num, denom }) => {
  const angle = (num / denom) * 360;
  const largeArc = angle > 180 ? 1 : 0;
  const radius = 40;
  const cx = 50;
  const cy = 50;
  const x = cx + radius * Math.cos((angle - 90) * (Math.PI / 180));
  const y = cy + radius * Math.sin((angle - 90) * (Math.PI / 180));

  return (
    <Svg width={100} height={100} viewBox="0 0 100 100">
      <Circle cx="50" cy="50" r={radius} fill="#E2D7F7" stroke="black" strokeWidth="2" />
      <Path
        d={`M 50,50 L 50,${50 - radius} A ${radius},${radius} 0 ${largeArc},1 ${x},${y} Z`}
        fill="#5F06ED"
      />
      {[...Array(denom)].map((_, i) => {
        const angle = (i / denom) * 360;
        const x = cx + radius * Math.cos((angle - 90) * (Math.PI / 180));
        const y = cy + radius * Math.sin((angle - 90) * (Math.PI / 180));
        return <Path key={i} d={`M50,50 L${x},${y}`} stroke="black" strokeWidth="2" />;
      })}
    </Svg>
  );
};

const shuffleArray = (array) => {
  return array
    .map(item => ({ item, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ item }) => item);
};

const GAME_LEVELS = {
  1: {
    fractions: [
      { num: 1, denom: 4, id: 0 },
      { num: 1, denom: 2, id: 1 },
      { num: 2, denom: 3, id: 2 },
      { num: 3, denom: 4, id: 3 },
      { num: 1, denom: 6, id: 4 },
      { num: 5, denom: 9, id: 5 },
      { num: 2, denom: 5, id: 6 },
      { num: 3, denom: 8, id: 7 },
      { num: 1, denom: 8, id: 8 },
    ],
    images: [
      { id: 0, image: 'https://i.imgur.com/mNXPZ8B.png' },
      { id: 1, image: 'https://i.imgur.com/XcJAK2u.png' },
      { id: 2, image: 'https://i.imgur.com/9fLVG5Z.png' },
      { id: 3, image: 'https://i.imgur.com/jPHXjYD.png' },
      { id: 4, image: 'https://i.imgur.com/dBKnLPq.png' },
      { id: 5, image: 'https://i.imgur.com/GVY7YyS.png' },
      { id: 6, image: 'https://i.imgur.com/7Qw3KDj.png' },
      { id: 7, image: 'https://i.imgur.com/mBPuPfL.png' },
      { id: 8, image: 'https://i.imgur.com/ZN3hQlW.png' },
    ],
    colorScheme: {
      mainColor: '#563B88',
      buttonColor: '#7A65FB',
      backgroundColor: '#CDC1FF',
    }
  },
  2: {
    fractions: [
      { num: 1, denom: 3, id: 0 },
      { num: 2, denom: 5, id: 1 },
      { num: 3, denom: 4, id: 2 },
      { num: 1, denom: 6, id: 3 },
      { num: 4, denom: 5, id: 4 },
      { num: 2, denom: 6, id: 5 },
      { num: 5, denom: 8, id: 6 },
      { num: 3, denom: 5, id: 7 },
      { num: 7, denom: 8, id: 8 },
    ],
    images: [
      { id: 0, image: 'https://i.imgur.com/QdZ5fpL.png' },
      { id: 1, image: 'https://i.imgur.com/LyJzPIZ.png' },
      { id: 2, image: 'https://i.imgur.com/87xUe0c.png' },
      { id: 3, image: 'https://i.imgur.com/9VlXbR8.png' },
      { id: 4, image: 'https://i.imgur.com/dKPJ29A.png' },
      { id: 5, image: 'https://i.imgur.com/mJzYkYw.png' },
      { id: 6, image: 'https://i.imgur.com/KsL6pj7.png' },
      { id: 7, image: 'https://i.imgur.com/DXu8Dv2.png' },
      { id: 8, image: 'https://i.imgur.com/Ptq8jFc.png' },
    ],
    colorScheme: {
      mainColor: '#563B88',
      buttonColor: '#7A65FB',
      backgroundColor: '#CDC1FF',
    }
  },
  3: {
    fractions: [
      { num: 3, denom: 10, id: 0 },
      { num: 1, denom: 5, id: 1 },
      { num: 5, denom: 12, id: 2 },
      { num: 2, denom: 7, id: 3 },
      { num: 3, denom: 7, id: 4 },
      { num: 4, denom: 9, id: 5 },
      { num: 5, denom: 6, id: 6 },
      { num: 3, denom: 5, id: 7 },
      { num: 7, denom: 10, id: 8 },
    ],
    images: [
      { id: 0, image: 'https://i.imgur.com/6qzUmx0.png' },
      { id: 1, image: 'https://i.imgur.com/RCNd5iw.png' },
      { id: 2, image: 'https://i.imgur.com/OmvNUt9.png' },
      { id: 3, image: 'https://i.imgur.com/8LCmL7K.png' },
      { id: 4, image: 'https://i.imgur.com/vYbKLqR.png' },
      { id: 5, image: 'https://i.imgur.com/oZ8QdL3.png' },
      { id: 6, image: 'https://i.imgur.com/9jgwLyY.png' },
      { id: 7, image: 'https://i.imgur.com/Dh0jPJW.png' },
      { id: 8, image: 'https://i.imgur.com/u1N7WdZ.png' },
    ],
    colorScheme: {
      mainColor: '#563B88',
      buttonColor: '#7A65FB',
      backgroundColor: '#CDC1FF',
    }
  },
  4: {
    fractions: [
      { num: 1, denom: 10, id: 0 },
      { num: 3, denom: 8, id: 1 },
      { num: 4, denom: 6, id: 2 },
      { num: 5, denom: 10, id: 3 },
      { num: 2, denom: 4, id: 4 },
      { num: 6, denom: 9, id: 5 },
      { num: 4, denom: 8, id: 6 },
      { num: 2, denom: 8, id: 7 },
      { num: 9, denom: 10, id: 8 },
    ],
    images: [
      { id: 0, image: 'https://i.imgur.com/1Sz8BVJ.png' },
      { id: 1, image: 'https://i.imgur.com/Xk3f2P4.png' },
      { id: 2, image: 'https://i.imgur.com/zPP9Ksd.png' },
      { id: 3, image: 'https://i.imgur.com/W3H4LaF.png' },
      { id: 4, image: 'https://i.imgur.com/8y1qGrJ.png' },
      { id: 5, image: 'https://i.imgur.com/0HxzVr1.png' },
      { id: 6, image: 'https://i.imgur.com/PqZFMzF.png' },
      { id: 7, image: 'https://i.imgur.com/JGkZx9B.png' },
      { id: 8, image: 'https://i.imgur.com/OPLUofC.png' },
    ],
    colorScheme: {
      mainColor: '#563B88',
      buttonColor: '#7A65FB',
      backgroundColor: '#CDC1FF',
    }
  },
  5: {
    fractions: [
      { num: 1, denom: 12, id: 0 },
      { num: 5, denom: 8, id: 1 },
      { num: 7, denom: 12, id: 2 },
      { num: 2, denom: 10, id: 3 },
      { num: 6, denom: 10, id: 4 },
      { num: 7, denom: 8, id: 5 },
      { num: 3, denom: 6, id: 6 },
      { num: 11, denom: 12, id: 7 },
      { num: 9, denom: 12, id: 8 },
    ],
    images: [
      { id: 0, image: 'https://i.imgur.com/SkBpuYF.png' },
      { id: 1, image: 'https://i.imgur.com/N5VMXaM.png' },
      { id: 2, image: 'https://i.imgur.com/JLG0w1F.png' },
      { id: 3, image: 'https://i.imgur.com/f8JvDz1.png' },
      { id: 4, image: 'https://i.imgur.com/UyFgn6i.png' },
      { id: 5, image: 'https://i.imgur.com/YeHbHfS.png' },
      { id: 6, image: 'https://i.imgur.com/VQb7cFT.png' },
      { id: 7, image: 'https://i.imgur.com/kAYV72G.png' },
      { id: 8, image: 'https://i.imgur.com/FPTYjAa.png' },
    ],
    colorScheme: {
      mainColor: '#563B88',
      buttonColor: '#7A65FB',
      backgroundColor: '#CDC1FF',
    }
  },
  6: {
    fractions: [
      { num: 4, denom: 12, id: 0 },
      { num: 5, denom: 6, id: 1 },
      { num: 3, denom: 12, id: 2 },
      { num: 8, denom: 12, id: 3 },
      { num: 7, denom: 9, id: 4 },
      { num: 5, denom: 12, id: 5 },
      { num: 8, denom: 10, id: 6 },
      { num: 4, denom: 5, id: 7 },
      { num: 10, denom: 12, id: 8 },
    ],
    images: [
      { id: 0, image: 'https://i.imgur.com/ecTK0LP.png' },
      { id: 1, image: 'https://i.imgur.com/RNdKKA9.png' },
      { id: 2, image: 'https://i.imgur.com/C2sHU3I.png' },
      { id: 3, image: 'https://i.imgur.com/PF1fJdW.png' },
      { id: 4, image: 'https://i.imgur.com/cL0Wfov.png' },
      { id: 5, image: 'https://i.imgur.com/XQWcBn5.png' },
      { id: 6, image: 'https://i.imgur.com/Hxwv20A.png' },
      { id: 7, image: 'https://i.imgur.com/G8Yjc6u.png' },
      { id: 8, image: 'https://i.imgur.com/zVnXlGY.png' },
    ],
    colorScheme: {
      mainColor: '#563B88',
      buttonColor: '#7A65FB',
      backgroundColor: '#CDC1FF',
    }
  }
};

const GameLevel = ({ route, navigation }) => {
  const { levelNumber } = route.params;
  const { clientId, incrementGamePercentage, updateTrophies, updateCoins, decreaseFoodPercentageOnGamePlay, refreshUserData } = useAppContext();
  const currentLevelConfig = GAME_LEVELS[levelNumber] || GAME_LEVELS[1];
  const { fractions, images, colorScheme } = currentLevelConfig;

  const [selectedPosition, setSelectedPosition] = useState(null);
  const [correct, setCorrect] = useState([]);
  const [positions, setPositions] = useState(Array(9).fill(undefined));
  const [currentFractionIndex, setCurrentFractionIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [borderColors, setBorderColors] = useState(Array(9).fill("black"));
  const [shuffledImages, setShuffledImages] = useState([]);
  const [pulseAnimation] = useState(new Animated.Value(0));
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

  useEffect(() => {
    // Reiniciar completamente el estado del juego
    resetGameState();
    
    const loadData = async () => {
      try {
        const savedBestTime = await AsyncStorage.getItem(`bestTime_level_${levelNumber}`);
        if (savedBestTime !== null) {
          setBestTime(parseInt(savedBestTime));
        }
      } catch (error) {
        console.error("Error al cargar datos:", error.message);
      }
    };
    
    loadData();
    
    const checkFirstTimePlaying = async () => {
      if (levelNumber === 1) {
        const hasPlayed = await AsyncStorage.getItem("hasPlayedRompefraccionesBefore");
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
  }, [levelNumber, images]); // Agregamos 'images' como dependencia

  const startGame = async () => {
    try {
      if (!clientId) {
        throw new Error("No se encontró el ID del cliente. Por favor, inicia sesión nuevamente.");
      }
      await decreaseFoodPercentageOnGamePlay();
      setTimerActive(true);
      if (levelNumber === 1) {
        await AsyncStorage.setItem("hasPlayedRompefraccionesBefore", "true");
      }
    } catch (error) {
      console.error("Error al iniciar partida:", error.message);
      showAlert("Error");
    }
  };

  useEffect(() => {
    let interval;
    if (timerActive) {
      interval = setInterval(() => setTimePlayed((prev) => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  useEffect(() => {
    if (completed) {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnimation, {
            toValue: 1,
            duration: 500,
            useNativeDriver: false,
          }),
          Animated.timing(pulseAnimation, {
            toValue: 0,
            duration: 500,
            useNativeDriver: false,
          }),
        ])
      );
      animation.start();
      
      // Cleanup function para detener la animación
      return () => {
        animation.stop();
        pulseAnimation.stopAnimation();
        pulseAnimation.setValue(0);
      };
    }
  }, [completed, pulseAnimation]);

  const currentImage = shuffledImages[currentFractionIndex] || {};
  const currentFraction = fractions.find(frac => frac.id === currentImage?.id) || {};

  const handleSelectPosition = (index) => {
    if (selectedPosition !== null) return;
    const endTime = Date.now();
    const timeTaken = startTime ? (endTime - startTime) / 1000 : 0;
    setStartTime(Date.now());
    setSelectedPosition(index);

    if (fractions[index].id === currentFraction.id) {
      setPositions(prev => {
        const updated = [...prev];
        updated[index] = currentImage.id;
        return updated;
      });
      setCorrect(prev => [...prev, index]);
      setBorderColors(prev => prev.map((color, i) => (i === index ? "green" : color)));
      setCorrectAttempts(correctAttempts + 1);
      setOperationTimes([...operationTimes, timeTaken]);

      setTimeout(() => {
        if (currentFractionIndex + 1 < fractions.length) {
          setCurrentFractionIndex(currentFractionIndex + 1);
          setSelectedPosition(null);
          setBorderColors(Array(9).fill("black"));
        } else {
          setCompleted(true);
          setTimerActive(false);
          saveBestTime(timePlayed);
          updateGameData();
          showAlert("Correcto");
        }
      }, 500);
    } else {
      setBorderColors(prev => prev.map((color, i) => (i === index ? "red" : color)));
      setWrongAttempts(wrongAttempts + 1);
      setOperationTimes([...operationTimes, timeTaken]);

      setTimeout(() => {
        setPositions(Array(9).fill(undefined));
        setCorrect([]);
        setBorderColors(Array(9).fill("black"));
        setCurrentFractionIndex(0);
        setSelectedPosition(null);
        setShuffledImages(shuffleArray(images));
      }, 1000);
    }
  };

  const resetGameState = () => {
    // Detener animaciones
    pulseAnimation.stopAnimation();
    pulseAnimation.setValue(0);
    
    // Reiniciar todos los estados del juego
    setPositions(Array(9).fill(undefined));
    setCorrect([]);
    setBorderColors(Array(9).fill("black"));
    setCurrentFractionIndex(0);
    setSelectedPosition(null);
    setCompleted(false);
    setTimePlayed(0);
    setTimerActive(false);
    setCorrectAttempts(0);
    setWrongAttempts(0);
    setOperationTimes([]);
    setStartTime(null);
    setCoinsEarned(0);
    setIsNewLevel(false);
    
    // Reiniciar imágenes mezcladas
    setShuffledImages(shuffleArray(images));
  };

  const handleResetGame = () => {
    resetGameState();
    setTimerActive(true);
  };

  const saveBestTime = async (time) => {
    try {
      const storedBestTime = await AsyncStorage.getItem(`bestTime_level_${levelNumber}`);
      if (!storedBestTime || time < parseInt(storedBestTime, 10)) {
        await AsyncStorage.setItem(`bestTime_level_${levelNumber}`, time.toString());
        setBestTime(time);
      }
    } catch (error) {
      console.error("Error guardando el mejor tiempo:", error);
    }
  };

  const getGameData = async () => {
    try {
      const games = await gameService.getGames();
      const game = games.find(g => g.game_ID === 6);
      if (!game) throw new Error("Juego no encontrado en la base de datos");
      return {
        gamePercentage: game.game_percentage || 5,
        coinsEarned: game.game_coins || 10,
        trophiesEarned: game.game_trophy || 1,
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
      const rompefraccionesProgress = gameProgress.find(game => game.game_ID === 6);
      const previousPlayedCount = rompefraccionesProgress ? rompefraccionesProgress.game_played_count || 0 : 0;
      const previousTimePlayed = rompefraccionesProgress ? rompefraccionesProgress.game_time_played || 0 : 0;
      const previousLevels = rompefraccionesProgress ? rompefraccionesProgress.game_levels || 0 : 0;
      const isNewLevelLocal = previousLevels < levelNumber;
      setIsNewLevel(isNewLevelLocal);
      const { gamePercentage, coinsEarned: coins, trophiesEarned } = await getGameData();
      setCoinsEarned(coins);
      if (coins === undefined || trophiesEarned === undefined) {
        throw new Error("Datos del juego incompletos: coins o trophiesEarned no están definidos.");
      }
      const avgTime = operationTimes.length > 0 ? operationTimes.reduce((a, b) => a + b) / operationTimes.length : 0;
      const gameData = {
        game_ID: 6,
        game_played_count: previousPlayedCount + 1,
        game_levels: Math.max(previousLevels, levelNumber),
        game_time_played: previousTimePlayed + timePlayed,
        coins_earned: coins,
        trophies_earned: isNewLevelLocal ? trophiesEarned : 0,
      };
      await gameService.updateGameProgress(gameData, clientId);
      await incrementGamePercentage(gamePercentage);
      await updateCoins(coins);
      if (isNewLevelLocal) await updateTrophies(trophiesEarned);
      if (rompefraccionesProgress && rompefraccionesProgress.game_progress_ID) {
        await gameService.updateGamePerformance(
          rompefraccionesProgress.game_progress_ID,
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

  const mostrarTituloAlerta = (type) => {
    switch (type) {
      case "startGame":
        return "ROMPEFRACCIONES";
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
        return "Empareja las fracciones con las imágenes para completar el rompecabezas.";
      case "exit":
        return "¿Quieres abandonar el juego?";
      case "Correcto":
        return `Has completado el nivel.\nRecompensas: ${coinsEarned} monedas${isNewLevel ? ", 1 trofeo" : ""}.`;
      case "Felicidades":
        return "Has completado todos los niveles.";
      case "Error":
        return "Hubo un error al procesar tu progreso.";
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
        return levelNumber < 6 ? "Siguiente Nivel" : "Finalizar";
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
        if (levelNumber < 6) {
          // Detener animaciones antes de navegar
          pulseAnimation.stopAnimation();
          pulseAnimation.setValue(0);
          navigation.navigate("GameLevel", { levelNumber: levelNumber + 1 });
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
    return () => BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colorScheme.backgroundColor }]}>
      <View style={[styles.header, { backgroundColor: colorScheme.backgroundColor }]}>
        <View style={styles.cajaTitulo}>
          <Text style={[styles.titulo, { color: colorScheme.mainColor, fontFamily: "Quicksand" }]}>
            {completed ? "¡Completado!" : "ROMPEFRACCIONES"}
          </Text>
        </View>
        <View style={styles.cajaIconos}>
          <Pressable style={styles.button} onPress={handleResetGame}>
            {({ pressed }) => (
              <Ionicons
                name="reload-circle"
                size={50 * scale}
                color={pressed ? "#3B1F70" : colorScheme.mainColor}
              />
            )}
          </Pressable>
          <View style={[styles.cajaNivel, { backgroundColor: colorScheme.mainColor }]}>
            <Text style={[styles.Nivel, { fontFamily: "Quicksand" }]}>NVL. {levelNumber}</Text>
          </View>
          <Pressable style={styles.button} onPress={() => showAlert("exit")}>
            {({ pressed }) => (
              <MaterialCommunityIcons
                name="exit-to-app"
                size={52 * scale}
                color={pressed ? "#3B1F70" : colorScheme.mainColor}
              />
            )}
          </Pressable>
        </View>
        <View style={[styles.cajaPuntajes, { backgroundColor: "#E2D7F7" }]}>
          {bestTime !== null && (
            <View style={styles.puntajeContainer}>
              <Ionicons name="trophy" size={30 * scale} color={colorScheme.mainColor} style={styles.icon} />
              <Text style={[styles.score, { fontFamily: "Quicksand" }]}>
                {`${Math.floor(bestTime / 60).toString().padStart(2, "0")}:${(bestTime % 60)
                  .toString()
                  .padStart(2, "0")}`}
              </Text>
            </View>
          )}
          <View style={styles.puntajeContainer}>
            <MaterialIcons name="timer" size={30 * scale} color={colorScheme.mainColor} style={styles.icon} />
            <Text style={[styles.score, { fontFamily: "Quicksand" }]}>
              {`${Math.floor(timePlayed / 60).toString().padStart(2, "0")}:${(timePlayed % 60)
                .toString()
                .padStart(2, "0")}`}
            </Text>
          </View>
        </View>
      </View>
      <View style={[styles.gameContainer, { backgroundColor: colorScheme.backgroundColor }]}>
        <Text style={[styles.title, { fontFamily: "Quicksand_SemiBold" }]}>
          Selecciona la fracción:
        </Text>
        <Text style={[styles.fractionText, { fontFamily: "Quicksand_Medium" }]}>
          {currentFraction?.num ? `${currentFraction.num}/${currentFraction.denom}` : "Cargando..."}
        </Text>
        <Text style={[styles.fractionText, { fontFamily: "Quicksand_Medium" }]}>
          Selecciona el espacio correcto para la imagen
        </Text>
        <Animated.View
          style={[
            styles.gridWrapper,
            {
              borderColor: completed ? "yellow" : "black",
              borderWidth: 4,
              transform: [{
                scale: pulseAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.05],
                })
              }],
            },
          ]}
        >
          <View style={styles.grid}>
            {fractions.map((frac, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.cell, { borderColor: borderColors[index] }]}
                onPress={() => handleSelectPosition(index)}
                disabled={positions[index] !== undefined}
              >
                <View style={styles.imageContainer}>
                  <FractionCircle num={frac.num} denom={frac.denom} />
                </View>
                {positions[index] !== undefined && (
                  <View style={styles.positionedImage}>
                    <Image 
                      source={{ uri: images.find(img => img.id === positions[index])?.image }} 
                      style={styles.image} 
                    />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
        {currentImage && !completed && (
          <View style={styles.imageContainerBottom}>
            <Image source={{ uri: currentImage.image }} style={styles.image} />
          </View>
        )}
        {completed && (
          <Text style={[styles.correctText, { fontFamily: "Quicksand_Bold" }]}>
            ¡Completado!
          </Text>
        )}
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
          confirmButtonColor={colorScheme.buttonColor}
          cancelButtonColor="#E2D7F7"
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EEE4FF",
  },
  header: {
    backgroundColor: "#CDC1FF",
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
    color: "#563B88",
  },
  cajaIconos: {
    flexDirection: "row",
    marginVertical: 5 * scale,
  },
  cajaNivel: {
    borderRadius: 90 * scale,
    backgroundColor: "#563B88",
    alignItems: "center",
    justifyContent: "center",
    height: 46 * scale,
    width: 90 * scale,
  },
  Nivel: {
    fontSize: RFPercentage(2.5),
    color: "#EEE4FF",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 12 * scale,
  },
  cajaPuntajes: {
    flexDirection: "row",
    marginVertical: 5 * scale,
    backgroundColor: "#E2D7F7",
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
    color: "#563B88",
  },
  gameContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#CDC1FF",
    borderRadius: 27 * scale,
    margin: 15 * scale,
    padding: 5 * scale,
  },
  title: {
    fontSize: RFPercentage(3),
  },
  fractionText: {
    fontSize: RFPercentage(2.5),
    marginBottom: 10 * scale,
    textAlign: "center",
  },
  grid: {
    width: 350 * scale,
    height: 348 * scale,
    flexDirection: "row",
    flexWrap: "wrap",
    borderWidth: 2,
    borderColor: "#563B88",
  },
  cell: {
    width: "33.33%",
    height: "33.37%",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: "#563B88",
  },
  imageContainer: {
    width: 100 * scale,
    height: 100 * scale,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
  },
  positionedImage: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 112 * scale,
    height: 112 * scale,
    resizeMode: "contain",
  },
  imageContainerBottom: {
    alignItems: "center",
    justifyContent: "center",
  },
  correctText: {
    color: "green",
    fontWeight: "bold",
    marginTop: 20 * scale,
    fontSize: RFPercentage(3),
  },
  gridWrapper: {
    width: 358 * scale,
    height: 356 * scale,
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10 * scale,
  },
  topButton: {
    padding: 5 * scale,
  },
});

export default GameLevel;