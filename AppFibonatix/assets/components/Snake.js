import { Fragment } from "react";
import { StyleSheet, View, Image } from "react-native";

export default function Snake({ snake, direction }) {
  const getRotation = () => {
    switch (direction) {
      case "Up":
        return "180deg"; // Rotación hacia arriba
      case "Down":
        return "360deg"; // Rotación hacia abajo
      case "Left":
        return "90deg"; // Rotación hacia la izquierda
      case "Right":
      default:
        return "270deg"; // Sin rotación (derecha)
    }
  };

  // Tamaño de la cuadrícula (según el tamaño de la pantalla y la cuadrícula que definiste)
  const gridSize = 10;  // Asumiendo que cada celda de la cuadrícula es de 10x10

  return (
    <Fragment>
      {snake.map((segment, index) => {
        const segmentStyle = {
          left: segment.x * gridSize, // Ajustar posición horizontal
          top: segment.y * gridSize,  // Ajustar posición vertical
        };

        // Si es el primer segmento (la cabeza), renderiza con una imagen
        if (index === 0) {
          return (
            <Image
              key={index}
              source={require("../img/headerSnake.png")} // Ruta de la imagen
              style={[
                styles.head,
                segmentStyle,
                { transform: [{ rotate: getRotation() }] }, // Rotación dinámica
              ]}
              resizeMode="contain"
            />
          );
        }

        // Para los demás segmentos, simplemente usa un View
        return <View key={index} style={[styles.segment, segmentStyle]} />;
      })}
    </Fragment>
  );
}

const styles = StyleSheet.create({
  head: {
    position: "absolute",
    width: 50, // Este es el tamaño que usas para la cabeza
    height: 50, // Asegúrate de que sea un valor consistente con la cuadrícula
    zIndex: 10,
  },
  segment: {
    width: 40,  // El tamaño de los segmentos
    height: 40, // Debe coincidir con el tamaño de la celda de la cuadrícula (o 10x10)
    borderRadius: 20, // Redondear las esquinas para dar la forma de la serpiente
    backgroundColor: "#54af6c", // Color de los segmentos
    position: "absolute",  // Asegurarse de que se posicionen correctamente
    zIndex: 0,
  },
});
