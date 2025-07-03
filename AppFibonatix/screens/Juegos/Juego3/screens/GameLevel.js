import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions, 
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { MaterialCommunityIcons, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackHandler } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import CustomAlert from '../../../../assets/components/CustomAlert';
import { useAppContext } from '../../../../assets/context/AppContext';
import { gameService } from '../../../../assets/services/ApiService';

const GameLevel = ({ navigation, route }) => {
  const { levelNumber, levelConfig } = route.params || {};
  const { 
    clientId, 
    incrementGamePercentage, 
    updateTrophies, 
    updateCoins,
    decreaseFoodPercentageOnGamePlay, 
    refreshUserData 
  } = useAppContext();

  const [selectedColor, setSelectedColor] = useState(null);
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [timePlayed, setTimePlayed] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [bestTime, setBestTime] = useState(null);
  const [alerts, setAlerts] = useState({ type: null, visible: false });
  const [exitAttempt, setExitAttempt] = useState(false);
  const [coinsEarned, setCoinsEarned] = useState(0);
  const [isNewLevel, setIsNewLevel] = useState(false);
  const [didWin, setDidWin] = useState(false);
  const [previousGameProgress, setPreviousGameProgress] = useState(null);
  const [wrongAttempts, setWrongAttempts] = useState(0); // Nuevo estado para intentos fallidos

  const screenWidth = Dimensions.get('window').width;
  const scale = screenWidth / 414;

  const config = levelConfig || {
    gridSize: 9,
    gridOperations: [
      ["17-10", "7/1", "25-18", "11-4", "13-7", "5+2", "13-6", "7+3", "20/2"],
      ["21-14", "21/3", "9-2", "4+2", "66/6", "12/2", "14/2", "5*2", "11-1"],
      ["7+0", "4+3", "3*2", "22/2", "39-28", "11+0", "8-2", "7*1", "1+6"],
      ["30-23", "9-3", "11/1", "55/5", "15-4", "36-25", "7+4", "5+1", "15-8"],
      ["11-5", "30-19", "8+3", "5+4", "18-7", "18/2", "44/4", "10+1", "6*1"],
      ["20-9", "19-8", "12-1", "15-4", "31-20", "11-0", "17-6", "21-10", "35-24"],
      ["6+5", "4+7", "33/3", "10-2", "16/2", "8+0", "24-13", "3+8", "5+6"],
      ["11/1", "22-11", "9+2", "6+2", "7+1", "2*4", "0+11", "28-17", "13-2"],
      ["6*2", "3+9", "5+7", "3*4", "8+4", "15-3", "20-8", "12+0", "12*1"],
    ],
    colorMapping: {
      10: '#FFE936',
      9: '#A5EFFF',
      12: '#5EFF40',
      8: '#9D742C',
      6: '#FF423E',
      7: '#57EBFF',
      11: '#FFEEAE',
    }
  };

  const gridSize = config.gridSize;
  const gridOperations = config.gridOperations;
  const colorMapping = config.colorMapping;
  const cellSize = Math.floor((screenWidth - 30 * scale) / gridSize) - 4;

  const generateGridData = () => {
    const grid = [];
    let id = 1;
    for (let row = 0; row < gridSize; row++) {
      const rowData = [];
      for (let col = 0; col < gridSize; col++) {
        rowData.push({
          id: id++,
          operation: gridOperations[row][col],
          result: eval(gridOperations[row][col]),
          color: null,
        });
      }
      grid.push(rowData);
    }
    return grid;
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!clientId) {
          console.warn("No clientId available, skipping data load.");
          return;
        }

        const gameProgress = await gameService.getGameProgress(clientId);
        const dibujitortugaProgress = gameProgress.find(game => game.game_ID === 3);
        setPreviousGameProgress(dibujitortugaProgress);

        setGridData(generateGridData());
      } catch (error) {
        console.error("Error al cargar datos:", error.message);
        setGridData(generateGridData());
      } finally {
        setLoading(false);
      }
    };
    loadData();

    const checkFirstTimePlaying = async () => {
      if (levelNumber === 1) {
        const hasPlayed = null; // Eliminamos AsyncStorage
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
      setIsGameStarted(true);
      if (levelNumber === 1) {
        // No guardamos en AsyncStorage
      }
      setWrongAttempts(0); // Reiniciar intentos fallidos al empezar
    } catch (error) {
      console.error("Error al iniciar partida:", error.message);
      showAlert("Error");
    }
  };

  useEffect(() => {
    let interval;
    if (timerActive) {
      interval = setInterval(() => {
        setTimePlayed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  const resetGame = () => {
    setGridData(generateGridData());
    setTimePlayed(0);
    setTimerActive(true);
    setDidWin(false);
    setSelectedColor(null);
    setWrongAttempts(0); // Reiniciar intentos fallidos al reiniciar
  };

  const getGameData = async () => {
    try {
      const games = await gameService.getGames();
      const game = games.find(g => g.game_ID === 3);
      if (!game) {
        throw new Error("Juego no encontrado en la base de datos");
      }
      return {
        gamePercentage: game.game_percentage || 3,
        coinsEarned: game.game_coins || 8,
        trophiesEarned: game.game_trophy || 1
      };
    } catch (error) {
      console.error("Error al obtener datos del juego:", error.message);
      return { gamePercentage: 3, coinsEarned: 8, trophiesEarned: 1 };
    }
  };

  const updateGameData = async () => {
    try {
      setTimerActive(false);

      if (!clientId) {
        throw new Error("No se encontró el ID del cliente. No se puede actualizar el progreso.");
      }

      const gameProgress = await gameService.getGameProgress(clientId);
      const dibujitortugaProgress = gameProgress.find(game => game.game_ID === 3);

      const previousPlayedCount = dibujitortugaProgress ? dibujitortugaProgress.game_played_count || 0 : 0;
      const previousTimePlayed = dibujitortugaProgress ? dibujitortugaProgress.game_time_played || 0 : 0;
      const previousLevels = dibujitortugaProgress ? dibujitortugaProgress.game_levels || 0 : 0;

      const isNewLevelLocal = previousLevels < levelNumber;
      setIsNewLevel(isNewLevelLocal);

      const { gamePercentage, coinsEarned: coins, trophiesEarned } = await getGameData();
      setCoinsEarned(coins);

      if (coins === undefined || trophiesEarned === undefined) {
        throw new Error("Datos del juego incompletos: coins o trophiesEarned no están definidos.");
      }

      const gameData = {
        game_ID: 3,
        game_played_count: previousPlayedCount + 1,
        game_levels: Math.max(previousLevels, levelNumber),
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

      // Lógica para Game_Performance
      if (dibujitortugaProgress && dibujitortugaProgress.game_progress_ID) {
        const totalCorrectAttempts = gridData.flat().filter(cell => cell.color === colorMapping[cell.result]).length; // Cuenta celdas correctamente coloreadas
        const totalWrongAttempts = wrongAttempts; // Acumula intentos fallidos
        const avgTime = timePlayed > 0 ? timePlayed / (totalCorrectAttempts + totalWrongAttempts || 1) : 0; // Tiempo promedio ajustado

        await gameService.updateGamePerformance(
          dibujitortugaProgress.game_progress_ID,
          totalCorrectAttempts,
          totalWrongAttempts,
          avgTime
        );
      }

      const agilIncrease = timePlayed < 20 ? 5 : 2;
      const tenazIncrease = 3;

      await refreshUserData();
    } catch (error) {
      console.error("Error al actualizar datos del juego:", error.message);
      showAlert("Error");
    }
  };

  const saveBestTime = async (time) => {
    try {
      const storedBestTime = null; // Eliminamos AsyncStorage
      if (!storedBestTime || time < parseInt(storedBestTime, 10)) {
        setBestTime(time);
      }
    } catch (error) {
      console.error('Error guardando el mejor tiempo:', error);
    }
  };

  const handleColorSelection = (color) => {
    setSelectedColor(color);
  };

  const handleCellClick = async (cell) => {
    if (!selectedColor) {
      showAlert("SelectColor");
      return;
    }

    const correctColor = colorMapping[cell.result];
    if (selectedColor === correctColor) {
      cell.color = selectedColor;
      const updatedGridData = [...gridData];
      setGridData(updatedGridData);

      if (checkLevelComplete()) {
        setDidWin(true);
        saveBestTime(timePlayed);
        updateGameData();
        showAlert("Correcto");
      }
    } else {
      setWrongAttempts(wrongAttempts + 1); // Incrementa intentos fallidos
      showAlert("Incorrecto");
    }
  };

  const checkLevelComplete = () => {
    return gridData.flat().every((cell) => cell.color !== null);
  };

  const showAlert = (type) => setAlerts({ type, visible: true });
  const hideAlert = () => setAlerts({ ...alerts, visible: false });

  const mostrarTituloAlerta = (type) => {
    switch (type) {
      case "startGame": return "DIBUJI TORTUGA";
      case "exit": return "SALIR";
      case "Correcto": return "¡Correcto!";
      case "Felicidades": return "¡Felicidades!";
      case "Error": return "Error!";
      case "SelectColor": return "Selecciona un color";
      case "Incorrecto": return "¡Incorrecto!";
      default: return "Alerta";
    }
  };

  const mostrarMensajeAlerta = (type) => {
    switch (type) {
      case "startGame": return "Pinta las celdas con el color correcto según el resultado de cada operación.";
      case "exit": return "¿Quieres abandonar el juego?";
      case "Correcto": return `Has completado el nivel.\nRecompensas: ${coinsEarned} monedas${isNewLevel ? ", 1 trofeo" : ""}.`;
      case "Felicidades": return "Has completado todos los niveles.";
      case "Error": return "Hubo un error al procesar tu progreso. Intenta de nuevo más tarde.";
      case "SelectColor": return "Selecciona un color antes de pintar.";
      case "Incorrecto": return "El color seleccionado no coincide con el resultado.";
      default: return null;
    }
  };

  const textoConfirmar = (type) => {
    switch (type) {
      case "startGame": return "JUGAR";
      case "Felicidades": return "Salir";
      case "Correcto": return levelNumber < route.params?.levelConfigs?.length ? "Siguiente Nivel" : "Finalizar";
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
        navigation.navigate("HomeScreen");
        hideAlert();
        break;
      case "Felicidades":
        navigation.navigate("HomeScreen");
        hideAlert();
        break;
      case "Correcto":
        if (levelNumber < route.params?.levelConfigs?.length) {
          const nextLevel = levelNumber + 1;
          navigation.navigate("GameLevel", { 
            levelNumber: nextLevel,
            levelConfig: route.params?.levelConfigs[nextLevel - 1]
          });
        } else {
          showAlert("Felicidades");
        }
        hideAlert();
        break;
      case "Error":
      case "SelectColor":
      case "Incorrecto":
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#355CC7" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <View style={styles.cajaTitulo}>
          <Text style={styles.titleText}>{didWin ? "¡Completado!" : "DIBUJI TORTUGA"}</Text>
        </View>
        <View style={styles.cajaIconos}>
          <Pressable style={styles.topButton} onPress={resetGame}>
            {({ pressed }) => (
              <Ionicons
                name="reload-circle"
                size={50 * scale}
                color={pressed ? "#2A4BA0" : "#355CC7"}
              />
            )}
          </Pressable>
          <View style={styles.levelContainer}>
            <Text style={styles.levelText}>NVL. {levelNumber}</Text>
          </View>
          <Pressable style={styles.topButton} onPress={() => showAlert("exit")}>
            {({ pressed }) => (
              <MaterialIcons
                name="exit-to-app"
                size={47 * scale}
                color={pressed ? "#2A4BA0" : "#355CC7"}
              />
            )}
          </Pressable>
        </View>
        <View style={styles.cajaPuntajes}>
          {bestTime !== null && (
            <View style={styles.puntajeContainer}>
              <Ionicons name="trophy" size={30 * scale} color="#355CC7" style={styles.icon} />
              <Text style={styles.score}>
                {`${Math.floor(bestTime / 60).toString().padStart(2, '0')}:${(bestTime % 60).toString().padStart(2, '0')}`}
              </Text>
            </View>
          )}
          <View style={styles.puntajeContainer}>
            <MaterialIcons name="timer" size={30 * scale} color="#355CC7" style={styles.icon} />
            <Text style={styles.score}>
              {`${Math.floor(timePlayed / 60).toString().padStart(2, '0')}:${(timePlayed % 60).toString().padStart(2, '0')}`}
            </Text>
          </View>
        </View>
      </View>

      <View style={[styles.gridWrapper, { padding: 10 * scale }]}>
        <View style={styles.grid}>
          {gridData.flat().map((cell) => (
            <TouchableOpacity
              key={cell.id}
              style={[
                styles.cell, 
                { 
                  backgroundColor: cell.color || 'white', 
                  width: cellSize, 
                  height: cellSize 
                }
              ]}
              onPress={() => handleCellClick(cell)}
            >
              <Text style={[
                styles.cellText, 
                { fontSize: Math.floor(cellSize / 4) }
              ]}>
                {cell.operation}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.palette}>
        {Object.entries(colorMapping).map(([key, color]) => (
          <TouchableOpacity
            key={key}
            style={[
              styles.colorButton, 
              { 
                backgroundColor: color,
                borderWidth: selectedColor === color ? 3 : 1,
                width: 40 * scale,
                height: 40 * scale,
                borderRadius: 20 * scale,
                margin: 5 * scale,
              }
            ]}
            onPress={() => handleColorSelection(color)}
          >
            <Text style={[
              styles.colorText,
              { 
                color: ['#FFE936', '#A5EFFF', '#5EFF40', '#57EBFF', '#FFEEAE'].includes(color) ? 'black' : 'white',
                fontSize: RFPercentage(2),
              }
            ]}>
              {key}
            </Text>
          </TouchableOpacity>
        ))}
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
          confirmButtonColor="#355CC7"
          cancelButtonColor="#9DDBF5"
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#9DDBF5',
  },
  topBar: {
    backgroundColor: '#6EB3F4',
    borderRadius: 30 * (Dimensions.get('window').width / 414),
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10 * (Dimensions.get('window').width / 414),
    marginHorizontal: 15 * (Dimensions.get('window').width / 414),
    marginTop: 10 * (Dimensions.get('window').width / 414),
  },
  cajaTitulo: {
    marginVertical: 5 * (Dimensions.get('window').width / 414),
  },
  titleText: {
    fontSize: RFPercentage(3.5),
    fontWeight: 'bold',
    color: '#355CC7',
    fontFamily: 'Quicksand',
  },
  cajaIconos: {
    flexDirection: 'row',
    marginVertical: 5 * (Dimensions.get('window').width / 414),
  },
  levelContainer: {
    backgroundColor: '#355CC7',
    width: 90 * (Dimensions.get('window').width / 414),
    height: 46 * (Dimensions.get('window').width / 414),
    borderRadius: 90 * (Dimensions.get('window').width / 414),
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelText: {
    fontSize: RFPercentage(2.5),
    fontWeight: 'bold',
    color: '#9DDBF5',
    fontFamily: 'Quicksand',
  },
  topButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 12 * (Dimensions.get('window').width / 414),
  },
  cajaPuntajes: {
    flexDirection: 'row',
    marginVertical: 5 * (Dimensions.get('window').width / 414),
    backgroundColor: '#A5EFFF',
    borderRadius: 30 * (Dimensions.get('window').width / 414),
    paddingHorizontal: 10 * (Dimensions.get('window').width / 414),
  },
  puntajeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8 * (Dimensions.get('window').width / 414),
  },
  icon: {
    marginRight: 5 * (Dimensions.get('window').width / 414),
  },
  score: {
    fontSize: RFPercentage(3),
    color: '#355CC7',
    fontFamily: 'Quicksand',
  },
  gridWrapper: {
    backgroundColor: '#EAE7E7',
    borderRadius: 10 * (Dimensions.get('window').width / 414),
    marginVertical: 20 * (Dimensions.get('window').width / 414),
    marginHorizontal: 15 * (Dimensions.get('window').width / 414),
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15 * (Dimensions.get('window').width / 414), // Ajuste para que sea un poco más grande
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  cell: {
    margin: 1 * (Dimensions.get('window').width / 414),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'gray',
  },
  cellText: {
    fontWeight: 'bold',
    color: '#333333',
    fontFamily: 'Quicksand',
  },
  palette: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 10 * (Dimensions.get('window').width / 414),
    paddingVertical: 10 * (Dimensions.get('window').width / 414),
  },
  colorButton: {
    borderColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorText: {
    fontWeight: 'bold',
    fontFamily: 'Quicksand',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DDBF5',
  },
});

export default GameLevel;