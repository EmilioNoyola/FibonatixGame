// Componente que representa a la tortuga en el juego.
import { StyleSheet, Text, View, Image } from "react-native";

export default function Animal({ x, y, turtleCount }) {
  return (
    <View 
    
      style={[
        { 
          top: y * 10, 
          left: x * 10 
        }, 
        styles.animal
        ]}
    >
      <Image source={require("../TortugaJuego.png")} style={styles.turtle} />
      <Text style={styles.count}>{turtleCount}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  animal: {
    flexDirection: "row",
    alignItems: "center",
  },
  turtle: {
    width: 50,
    height: 30,
  },
  count: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#572364",
  },
});


