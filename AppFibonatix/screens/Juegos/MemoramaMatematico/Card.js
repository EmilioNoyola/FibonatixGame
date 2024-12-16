// Componentes de React Native.
import * as React from "react";
import { Pressable, Text, StyleSheet, Image } from "react-native";

export default function Card({onPress, isTurnedOver, children}) {
    return (
      <Pressable onPress={onPress} style={isTurnedOver ? styles.cardUp : styles.cardDown}>
        {isTurnedOver ? (
            <Text style={styles.text}>{children}</Text>
        ) : (
            <Text style={styles.textCardDown}><Image source={require("../../../assets/TortugaJuego.png")} style={{ width: 50, height: 30 }}/></Text>
        )}
      </Pressable>
    );
  }

  const styles = StyleSheet.create({
    cardUp: {
        width: 90,
        height: 90,
        backgroundColor: "#fdd295",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 25,
        margin: 15,
    },

    cardDown: {
        width: 90,
        height: 90,
        backgroundColor: "#eb8c05",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 25,
        margin: 15,
    },

    text: {
        fontSize: 40,
        color: "#da7e01",
        fontFamily: "Quicksand",
    },

    textCardDown: {
      color: "#FF7509",
  },

});