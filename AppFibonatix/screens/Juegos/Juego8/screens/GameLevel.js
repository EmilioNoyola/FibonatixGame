import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BackHandler } from "react-native";
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { RFPercentage } from "react-native-responsive-fontsize";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomAlert from "../../../../assets/components/CustomAlert";
import { useAppContext } from "../../../../assets/context/AppContext";
import { gameService } from "../../../../assets/services/ApiService";
import { LEVEL_CONFIG } from "./levelConfig";
import useCustomFonts from "../../../../assets/components/FontsConfigure";

const { width } = Dimensions.get("window");
const scale = width / 414;

function GameLevel({ route, navigation }) {
  const { levelNumber } = route.params;
  const levelConfig = LEVEL_CONFIG[levelNumber];
  const {
    clientId,
    incrementGamePercentage,
    updateTrophies,
    updateCoins,
    decreaseFoodPercentageOnGamePlay,
    refreshUserData,
  } = useAppContext();
  const words = levelConfig.words;
  const gridSize = levelConfig.gridSize;
  const cellSize = Math.floor((width - 40 * scale) / gridSize);

  const [wordGrid, setWordGrid] = useState([]);
  const [currentSelection, setCurrentSelection] = useState([]);
  const [wordsFound, setWordsFound] = useState([]);
  const [foundCells, setFoundCells] = useState([]);
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

  useEffect(() => {
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
        const hasPlayed = await AsyncStorage.getItem("hasPlayedSopaBefore");
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
  }, [levelNumber, clientId]);

  const startGame = async () => {
    try {
      if (!clientId) {
        throw new Error("No se encontró el ID del cliente. Por favor, inicia sesión nuevamente.");
      }
      await decreaseFoodPercentageOnGamePlay();
      setTimerActive(true);
      if (levelNumber === 1) {
        await AsyncStorage.setItem("hasPlayedSopaBefore", "true");
      }
      startNewGame();
    } catch (error) {
      console.error("Error al iniciar partida:", error.message);
      showAlert("Error");
    }
  };

  const startNewGame = () => {
    const newGrid = generateEmptyGrid(gridSize);
    placeWordsInGrid(words, newGrid);
    setWordGrid([...newGrid]);
    setCurrentSelection([]);
    setWordsFound([]);
    setFoundCells([]);
    setCorrectAttempts(0);
    setWrongAttempts(0);
    setOperationTimes([]);
    setStartTime(Date.now());
  };

  const generateEmptyGrid = (size) => {
    return Array(size).fill(null).map(() => Array(size).fill("_"));
  };

  const placeWordsInGrid = (words, grid) => {
    words.forEach((word) => {
      let placed = false;
      let attempts = 0;
      const maxAttempts = 100;
      while (!placed && attempts < maxAttempts) {
        attempts++;
        const row = Math.floor(Math.random() * gridSize);
        const col = Math.floor(Math.random() * gridSize);
        const direction = Math.floor(Math.random() * 3);
        if (canPlaceWordAt(word, grid, row, col, direction)) {
          for (let i = 0; i < word.length; i++) {
            if (direction === 0) grid[row][col + i] = word[i];
            else if (direction === 1) grid[row + i][col] = word[i];
            else if (direction === 2) grid[row + i][col + i] = word[i];
          }
          placed = true;
        }
      }
      if (!placed) console.warn(`No se pudo colocar la palabra: ${word}`);
    });
    for (let i = 0; i < gridSize; i++)
      for (let j = 0; j < gridSize; j++)
        if (grid[i][j] === "_")
          grid[i][j] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  };

  const canPlaceWordAt = (word, grid, row, col, direction) => {
    if (direction === 0 && col + word.length > gridSize) return false;
    if (direction === 1 && row + word.length > gridSize) return false;
    if (direction === 2 && (row + word.length > gridSize || col + word.length > gridSize)) return false;
    for (let i = 0; i < word.length; i++) {
      if (direction === 0 && grid[row][col + i] !== "_") return false;
      if (direction === 1 && grid[row + i][col] !== "_") return false;
      if (direction === 2 && grid[row + i][col + i] !== "_") return false;
    }
    return true;
  };

  useEffect(() => {
    startNewGame();
  }, []);

  useEffect(() => {
    let interval;
    if (timerActive) {
      interval = setInterval(() => setTimePlayed((prev) => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  const selectCell = (rowIndex, colIndex) => {
    const index = rowIndex * gridSize + colIndex;
    
    // Si la celda ya está encontrada, no hacer nada
    if (foundCells.includes(index)) return;

    // Si es la primera selección o no hay selección actual
    if (currentSelection.length === 0) {
      setCurrentSelection([index]);
      return;
    }

    // Verificar si la celda ya está seleccionada (para deseleccionar)
    if (currentSelection.includes(index)) {
      setCurrentSelection(currentSelection.filter(i => i !== index));
      return;
    }

    // Obtener la última celda seleccionada
    const lastIndex = currentSelection[currentSelection.length - 1];
    const lastRow = Math.floor(lastIndex / gridSize);
    const lastCol = lastIndex % gridSize;

    // Verificar si la nueva celda es adyacente a la última seleccionada
    const isAdjacent = 
      (Math.abs(rowIndex - lastRow) <= 1 && Math.abs(colIndex - lastCol) <= 1) &&
      !(rowIndex === lastRow && colIndex === lastCol);

    if (!isAdjacent) {
      // Verificar si la selección actual forma una palabra incorrecta antes de cambiar
      if (currentSelection.length > 1) {
        const currentCoords = currentSelection.map(idx => ({
          row: Math.floor(idx / gridSize),
          col: idx % gridSize,
        }));
        const currentWord = currentCoords.map(({row, col}) => wordGrid[row][col]).join('');
        
        // Si la palabra actual no está en la lista de palabras válidas y no ha sido encontrada
        if (!words.includes(currentWord) && !wordsFound.some(w => w.word === currentWord)) {
          setWrongAttempts(prev => prev + 1);
        }
      }
      
      // Si no es adyacente, empezar nueva selección con esta celda
      setCurrentSelection([index]);
      return;
    }

    // Verificar si la nueva selección mantiene la misma dirección
    const newSelection = [...currentSelection, index];
    const selectedCoords = newSelection.map(idx => ({
      row: Math.floor(idx / gridSize),
      col: idx % gridSize,
    }));

    if (!isSelectionInLine(selectedCoords)) {
      // Verificar si la selección actual forma una palabra incorrecta antes de cambiar
      if (currentSelection.length > 1) {
        const currentCoords = currentSelection.map(idx => ({
          row: Math.floor(idx / gridSize),
          col: idx % gridSize,
        }));
        const currentWord = currentCoords.map(({row, col}) => wordGrid[row][col]).join('');
        
        // Si la palabra actual no está en la lista de palabras válidas y no ha sido encontrada
        if (!words.includes(currentWord) && !wordsFound.some(w => w.word === currentWord)) {
          setWrongAttempts(prev => prev + 1);
        }
      }
      
      // Si rompe la línea, mantener solo la última selección
      setCurrentSelection([index]);
      return;
    }

    // Si pasa todas las validaciones, actualizar la selección
    setCurrentSelection(newSelection);

    // Verificar si forman una palabra
    const selectedWord = selectedCoords.map(({row, col}) => wordGrid[row][col]).join('');
    if (words.includes(selectedWord) && !wordsFound.some(w => w.word === selectedWord)) {
      const randomColor = `hsl(${Math.floor(Math.random() * 360)}, 100%, 75%)`;
      const endTime = Date.now();
      const timeTaken = startTime ? (endTime - startTime) / 1000 : 0;
      
      setCorrectAttempts(prev => prev + 1);
      setOperationTimes([...operationTimes, timeTaken]);
      setFoundCells(prev => [...prev, ...newSelection]);
      setWordsFound(prev => {
        const updatedWords = [...prev, {word: selectedWord, color: randomColor}];
        if (updatedWords.length === words.length) {
          setTimerActive(false);
          saveBestTime(timePlayed);
          updateGameData();
          showAlert("Correcto");
        }
        return updatedWords;
      });
      setCurrentSelection([]);
      setStartTime(Date.now());
    }
  };

  // Agregar esta función para manejar clics fuera de la selección actual
  const handleWrongSelection = () => {
    if (currentSelection.length > 1) {
      const currentCoords = currentSelection.map(idx => ({
        row: Math.floor(idx / gridSize),
        col: idx % gridSize,
      }));
      const currentWord = currentCoords.map(({row, col}) => wordGrid[row][col]).join('');
      
      // Si la palabra actual no está en la lista de palabras válidas y no ha sido encontrada
      if (!words.includes(currentWord) && !wordsFound.some(w => w.word === currentWord)) {
        setWrongAttempts(prev => prev + 1);
      }
    }
  };

  const isSelectionInLine = (coords) => {
    if (coords.length < 2) return true;
    
    // Todas las filas iguales (horizontal)
    const isHorizontal = coords.every(c => c.row === coords[0].row);
    
    // Todas las columnas iguales (vertical)
    const isVertical = coords.every(c => c.col === coords[0].col);
    
    // Diagonal (pendiente 1 o -1)
    const first = coords[0];
    const second = coords[1];
    const rowDiff = second.row - first.row;
    const colDiff = second.col - first.col;
    
    // Solo considerar diagonales si la dirección es consistente
    const isDiagonal = coords.every((c, i) => {
      if (i === 0) return true;
      const expectedRow = first.row + (i * rowDiff);
      const expectedCol = first.col + (i * colDiff);
      return c.row === expectedRow && c.col === expectedCol;
    });

    return isHorizontal || isVertical || isDiagonal;
  };

  const getCellColor = (rowIndex, colIndex) => {
    const cellIndex = rowIndex * gridSize + colIndex;
    for (let foundWord of wordsFound) {
      if (foundCells.includes(cellIndex) && getWordCells(foundWord.word).includes(cellIndex)) {
        return foundWord.color || "#FFD700";
      }
    }
    return currentSelection.includes(cellIndex) ? "#F88787" : null;
  };

  const getWordCells = (word) => {
    const wordCells = [];
    wordGrid.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell === word[0]) {
          let match = true;
          for (let i = 0; i < word.length; i++) {
            if (row[colIndex + i] !== word[i]) {
              match = false;
              break;
            }
          }
          if (match) {
            for (let i = 0; i < word.length; i++) {
              wordCells.push(rowIndex * gridSize + (colIndex + i));
            }
          }
          match = true;
          for (let i = 0; i < word.length; i++) {
            if (rowIndex + i >= gridSize || wordGrid[rowIndex + i][colIndex] !== word[i]) {
              match = false;
              break;
            }
          }
          if (match) {
            for (let i = 0; i < word.length; i++) {
              wordCells.push((rowIndex + i) * gridSize + colIndex);
            }
          }
          match = true;
          for (let i = 0; i < word.length; i++) {
            if (
              rowIndex + i >= gridSize ||
              colIndex + i >= gridSize ||
              wordGrid[rowIndex + i][colIndex + i] !== word[i]
            ) {
              match = false;
              break;
            }
          }
          if (match) {
            for (let i = 0; i < word.length; i++) {
              wordCells.push((rowIndex + i) * gridSize + (colIndex + i));
            }
          }
        }
      });
    });
    return wordCells;
  };

  const handleResetGame = () => {
    startNewGame();
    setTimePlayed(0);
    setTimerActive(true);
    setCorrectAttempts(0);
    setWrongAttempts(0);
    setOperationTimes([]);
    setStartTime(null);
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
      const game = games.find((g) => g.game_ID === 5);
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
      const sopaProgress = gameProgress.find((game) => game.game_ID === 5);
      const previousPlayedCount = sopaProgress ? sopaProgress.game_played_count || 0 : 0;
      const previousTimePlayed = sopaProgress ? sopaProgress.game_time_played || 0 : 0;
      const previousLevels = sopaProgress ? sopaProgress.game_levels || 0 : 0;
      const isNewLevelLocal = previousLevels < levelNumber;
      setIsNewLevel(isNewLevelLocal);
      const { gamePercentage, coinsEarned: coins, trophiesEarned } = await getGameData();
      setCoinsEarned(coins);
      if (coins === undefined || trophiesEarned === undefined) {
        throw new Error("Datos del juego incompletos: coins o trophiesEarned no están definidos.");
      }
      const avgTime =
        operationTimes.length > 0 ? operationTimes.reduce((a, b) => a + b) / operationTimes.length : 0;
      const gameData = {
        game_ID: 5,
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
      if (sopaProgress && sopaProgress.game_progress_ID) {
        await gameService.updateGamePerformance(
          sopaProgress.game_progress_ID,
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
        return "SOPA OPERATIVA";
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
        return "Encuentra todas las palabras relacionadas con matemáticas.";
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
        return levelNumber < 12 ? "Siguiente Nivel" : "Finalizar";
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
        if (levelNumber < 12) {
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
    <SafeAreaView style={styles.gameContainer} onLayout={onLayoutRootView}>
      <View style={styles.header}>
        <View style={styles.cajaTitulo}>
          <Text style={styles.titulo}>
            {wordsFound.length === words.length ? "¡Completado!" : "SOPA OPERATIVA"}
          </Text>
        </View>
        <View style={styles.cajaIconos}>
          <Pressable style={styles.button} onPress={handleResetGame}>
            {({ pressed }) => (
              <Ionicons
                name="reload-circle"
                size={50 * scale}
                color={pressed ? "#630F11" : "#800020"}
              />
            )}
          </Pressable>
          <View style={styles.cajaNivel}>
            <Text style={styles.Nivel}>NVL. {levelNumber}</Text>
          </View>
          <Pressable style={styles.button} onPress={() => showAlert("exit")}>
            {({ pressed }) => (
              <MaterialCommunityIcons
                name="exit-to-app"
                size={52 * scale}
                color={pressed ? "#630F11" : "#800020"}
              />
            )}
          </Pressable>
        </View>
        <View style={styles.cajaPuntajes}>
          {bestTime !== null && (
            <View style={styles.puntajeContainer}>
              <Ionicons name="trophy" size={30 * scale} color="#800020" style={styles.icon} />
              <Text style={styles.score}>
                {`${Math.floor(bestTime / 60).toString().padStart(2, "0")}:${(bestTime % 60)
                  .toString()
                  .padStart(2, "0")}`}
              </Text>
            </View>
          )}
          <View style={styles.puntajeContainer}>
            <MaterialIcons name="timer" size={30 * scale} color="#800020" style={styles.icon} />
            <Text style={styles.score}>
              {`${Math.floor(timePlayed / 60).toString().padStart(2, "0")}:${(timePlayed % 60)
                .toString()
                .padStart(2, "0")}`}
            </Text>
          </View>
        </View>
      </View>
      <Text style={styles.instructionsText}>{levelConfig.instruction}</Text>
      <View style={styles.wordSearchContainer}>
        <ScrollView
          horizontal={true}
          contentContainerStyle={styles.scrollableGridContainer}
        >
          <ScrollView contentContainerStyle={styles.scrollableGrid}>
            <View style={styles.gridContainer}>
              {wordGrid.map((row, rowIndex) => (
                <View key={`row-${rowIndex}`} style={styles.gridRow}>
                  {row.map((cell, colIndex) => renderCell(rowIndex, colIndex, cell))}
                </View>
              ))}
            </View>
          </ScrollView>
        </ScrollView>
      </View>
      <View style={styles.wordsListContainer}>
        <View style={styles.wordsRow}>
          {words.map((word, index) => {
            const foundWord = wordsFound.find((w) => w.word === word);
            return (
              <View
                key={index}
                style={[styles.wordItem, foundWord && { backgroundColor: foundWord.color }]}
              >
                <Text style={styles.wordText}>{word}</Text>
              </View>
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
          confirmButtonColor="#800020"
          cancelButtonColor="#F998B5"
        />
      )}
    </SafeAreaView>
  );

  function renderCell(rowIndex, colIndex, cell) {
    const isSelected = currentSelection.includes(rowIndex * gridSize + colIndex);
    const isFound = isCellPartOfFoundWord(rowIndex, colIndex);
    
    return (
      <TouchableOpacity
        key={`${rowIndex}-${colIndex}`}
        style={[
          styles.gridCell,
          { width: cellSize, height: cellSize },
          isSelected && styles.selected,
          isFound && { backgroundColor: getCellColor(rowIndex, colIndex) },
          isFound && styles.foundCell,
        ]}
        onPress={() => selectCell(rowIndex, colIndex)}
      >
        <Text style={[
          styles.cellText, 
          { fontSize: cellSize * 0.5 },
          isSelected && styles.selectedText,
          isFound && styles.foundText,
        ]}>
          {cell}
        </Text>
      </TouchableOpacity>
    );
  }

  function isCellPartOfFoundWord(rowIndex, colIndex) {
    const cellIndex = rowIndex * gridSize + colIndex;
    return foundCells.includes(cellIndex);
  }
}

const styles = StyleSheet.create({
  gameContainer: {
    flex: 1,
    backgroundColor: "#F998B5",
  },
  header: {
    backgroundColor: "#E56587",
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
    color: "#800020",
    fontFamily: "Quicksand",
  },
  cajaIconos: {
    flexDirection: "row",
    marginVertical: 5 * scale,
  },
  cajaNivel: {
    borderRadius: 90 * scale,
    backgroundColor: "#800020",
    alignItems: "center",
    justifyContent: "center",
    height: 46 * scale,
    width: 90 * scale,
  },
  Nivel: {
    fontSize: RFPercentage(2.5),
    color: "#F998B5",
    fontFamily: "Quicksand",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 12 * scale,
  },
  cajaPuntajes: {
    flexDirection: "row",
    marginVertical: 5 * scale,
    backgroundColor: "#F0A1B8",
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
    color: "#800020",
    fontFamily: "Quicksand",
  },
  instructionsText: {
    fontSize: RFPercentage(2.5),
    textAlign: "center",
    color: "#CE3558",
    paddingVertical: 20 * scale,
    fontFamily: "Quicksand_SemiBold",
  },
  wordSearchContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10 * scale,
  },
  scrollableGridContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  scrollableGrid: {
    alignItems: "center",
    justifyContent: "center",
  },
  gridContainer: {},
  gridRow: {
    flexDirection: "row",
  },
  gridCell: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1 * scale,
    borderColor: "black",
  },
  cellText: {
    fontWeight: "bold",
  },
  selected: {
    backgroundColor: "#F88787",
  },
  wordsListContainer: {
    marginHorizontal: 15 * scale,
    marginTop: 20 * scale,
    padding: 10 * scale,
    backgroundColor: "#90172F",
    borderRadius: 15 * scale,
  },
  wordItem: {
    padding: 2 * scale,
    margin: 5 * scale,
    backgroundColor: "#e0e0e0",
    borderRadius: 4 * scale,
    textAlign: "center",
  },
  wordsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  wordText: {
    padding: 5 * scale,
  },
    selected: {
    backgroundColor: '#F88787',
    borderRadius: 5,
  },
  selectedText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  foundCell: {
    borderRadius: 5,
  },
  foundText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default GameLevel;