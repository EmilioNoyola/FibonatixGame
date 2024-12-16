// Hooks y Componentes de react native.
import { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, View, Dimensions } from "react-native";

import { PanGestureHandler } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage"; 
import { useNavigation } from "@react-navigation/native";

// Funciones
import { checkEatsAnimal } from "../utils/checkEatsAnimal";
import { checkGameOver } from "../utils/checkGameOver";
import { randomAnimalPosition } from "../utils/randomAnimalPosition";

// Componentes propios
import Animal from "./Animal";
import Header from "./Header";
import Score from "./Score";
import Snake from "./Snake";

// Alertas Personalizadas
import CustomAlert from '../../apis/Alertas';

const SNAKE_INITIAL_POSITION = [
  { x: 5, y: 5 },
  { x: 4, y: 5 },
  { x: 3, y: 5 },
];
const ANIMAL_INITIAL_POSITION = { x: 5, y: 20 };
const MOVE_INTERVAL = 60;
const SCORE_INCREMENT = 10;

export default function Game() {
  const [direction, setDirection] = useState("Right");
  const [snake, setSnake] = useState(SNAKE_INITIAL_POSITION);
  const [animal, setAnimal] = useState(ANIMAL_INITIAL_POSITION);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0); 
  const [turtleCount, setTurtleCount] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const [isGameStarted, setIsGameStarted] = useState(false); // Controla el inicio del juego

  // Objeto que contiene la navegación.
  const navigation = useNavigation(); 

  // Tamaño de la pantalla para obtener los límites del juego.
  const { height, width } = Dimensions.get('window');
  const GAME_BOUNDS = { xMin: 0, xMax: Math.floor(width / 10) - 6, yMin: 0, yMax: Math.floor(height / 12) - 9 };

  useEffect(() => {
    // Cargar puntaje más alto almacenado al iniciar el juego
    const loadHighScore = async () => {
      const storedHighScore = await AsyncStorage.getItem("highScore");
      if (storedHighScore) {
        setHighScore(Number(storedHighScore));
      }
    };
    loadHighScore();
  
    // Mostrar alerta al iniciar el juego
    showAlert("startGame");
  }, []);
  

  useEffect(() => {
    if (!isGameOver && isGameStarted) {
      const intervalId = setInterval(() => {
        !isPaused && moveSnake();
      }, MOVE_INTERVAL);
      return () => clearInterval(intervalId);
    }
  }, [snake, isGameOver, isPaused, isGameStarted]);  

  // Movimiento de la serpiente.
  const moveSnake = () => {
    const snakeHead = snake[0];
    const newHead = { ...snakeHead };

    if (checkGameOver(snakeHead, GAME_BOUNDS)) {
      handleGameOver();
      return;
    }

    switch (direction) {
      case "Up":
        newHead.y -= 1;
        break;
      case "Down":
        newHead.y += 1;
        break;
      case "Left":
        newHead.x -= 1;
        break;
      case "Right":
        newHead.x += 1;
        break;
      default:
        break;
    }

    if (checkEatsAnimal(newHead, animal, 2.5)) {
      setAnimal(randomAnimalPosition(GAME_BOUNDS.xMax, GAME_BOUNDS.yMax));
      setSnake([newHead, ...snake]);
      setScore(score + SCORE_INCREMENT);
      setTurtleCount(turtleCount + 1);
    } else {
      setSnake([newHead, ...snake.slice(0, -1)]);
    }
  };

  const handleGesture = (event) => {
    const { translationX, translationY } = event.nativeEvent;
    
    // Determinar la dirección del gesto
    let newDirection = direction;  // Mantener la dirección actual por defecto
  
    // Si el gesto es más horizontal
    if (Math.abs(translationX) > Math.abs(translationY)) {
      // Si el gesto es hacia la derecha y no estamos yendo a la izquierda
      if (translationX > 0 && direction !== "Left") {
        newDirection = "Right";
      }
      // Si el gesto es hacia la izquierda y no estamos yendo a la derecha
      else if (translationX < 0 && direction !== "Right") {
        newDirection = "Left";
      }
    }
    // Si el gesto es más vertical
    else {
      // Si el gesto es hacia abajo y no estamos yendo hacia arriba
      if (translationY > 0 && direction !== "Up") {
        newDirection = "Down";
      }
      // Si el gesto es hacia arriba y no estamos yendo hacia abajo
      else if (translationY < 0 && direction !== "Down") {
        newDirection = "Up";
      }
    }
  
    // Establecer la nueva dirección solo si ha cambiado
    if (newDirection !== direction) {
      setDirection(newDirection);
    }
  };  

  const reloadGame = async () => {
    // Actualizar el puntaje más alto si se supera
    if (score > highScore) {
      setHighScore(score);
      await AsyncStorage.setItem("highScore", score.toString());
    }

    setSnake(SNAKE_INITIAL_POSITION);
    setAnimal(ANIMAL_INITIAL_POSITION);
    setIsGameOver(false);
    setScore(0);
    setTurtleCount(0);
    setDirection("Right");
    setIsPaused(false);
  };

  const pauseGame = () => {
    setIsPaused(!isPaused);
  };

  const handleGameOver = () => {
    setIsGameOver(true);
    showAlert("gameOver");
  };

  // Estados para controlar la visibilidad de las alertas
  const [alerts, setAlerts] = useState({ type: null, visible: false });
  const showAlert = (type) => setAlerts({ type, visible: true });
  const hideAlert = () => setAlerts({ ...alerts, visible: false });

  const mostrarTituloAlerta = (type) => {
    switch (type) {
      case "gameOver":
        return "Game Over";
      case "exit":
        return "SALIR";
      case "startGame":
        return "Serpiente Matemática";
      default:
        return "Alerta";
    }
  };
  
  const mostrarMensajeAlerta = (type) => {
    switch (type) {
      case "gameOver":
        return "¿Quieres reiniciar el juego?";
      case "exit":
        return "¿Quieres abandonar el juego?";
      case "startGame":
        return "Mueve a la serpiente para comer a las tortugas sin chocar, ¡Buena suerte!";
      default:
        return "";
    }
  };  

  const handleConfirmAlert = () => {
    switch (alerts.type) {
      case "gameOver":
        reloadGame(); // Reinicia el juego
        break;
      case "exit":
        navigation.goBack();
        break;
      case "startGame":
        setIsGameStarted(true); // Inicia el juego
        break;
      default:
        break;
    }
    hideAlert(); // Cierra la alerta
  };  

    // Al cancelar la alerta
  const handleCancelAlert = () => {
      switch (alerts.type) {
        case 'gameOver':
          navigation.goBack(); // Vuelve a la pantalla anterior
          break;
        default:
          break;
      }
      hideAlert(); // Cierra la alerta
  };

  const textoConfirmar = (type) => {
    switch (type) {
      case "gameOver":
        return "Reiniciar";
      case "startGame":
        return "JUGAR";
      default:
        return "Aceptar";
    }
  };  

  const textoCancelar = (type) => {
      switch (type) {
        case 'gameOver': return "Abandonar";
        default: return "Cancelar";
      }
  };
  
  return (
    <PanGestureHandler onGestureEvent={handleGesture}>
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1 }}>
          <Header
            reloadGame={reloadGame}
            pauseGame={pauseGame}
            isPaused={isPaused}
          >
            <Score score={score} highScore={highScore} />
          </Header>
          <View style={styles.boundaries}>
            <Snake snake={snake} direction={direction} />
            <Animal x={animal.x} y={animal.y} turtleCount={turtleCount} />
          </View>
        </View>

      {alerts.visible && (
        <CustomAlert
          showAlert={alerts.visible}
          title={mostrarTituloAlerta(alerts.type)}       // Título dinámico
          message={mostrarMensajeAlerta(alerts.type)}   // Mensaje dinámico
          onConfirm={handleConfirmAlert}                // Acción al confirmar
          onCancel={alerts.type === "startGame" ? null : handleCancelAlert} // Ocultar botón cancelar en startGame
          confirmText={textoConfirmar(alerts.type)}
          cancelText={textoCancelar(alerts.type)}   
          confirmButtonColor={"#572364"}    
          cancelButtonColor={'#d7ace2'}               // Acción al cancelar
        />
      )}

      </SafeAreaView>
    </PanGestureHandler>
  );
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#572364",
    justifyContent: "center",
    alignItems: "center",
  },
  boundaries: {
    flex: 1,
    backgroundColor: "#C6B1C9",
    width: 360,
    marginVertical: 20,
    borderRadius: 15,
  },
});


                                                



