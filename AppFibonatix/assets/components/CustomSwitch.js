import React from "react";
import { View, Pressable, StyleSheet } from "react-native";

const CustomSwitch = ({ 
    value, 
    onValueChange, 
    onColor = "#1B4332", 
    offColor = "#5aa469", 
    circleColor = "#EFFFF4", 
    size = 50
}) => {
  const circleSize = size * 0.4; // Tamaño proporcional del círculo
  const translateX = size - circleSize - 4; // Alinea el círculo al borde del contenedor

    return (
        <Pressable
        onPress={() => onValueChange(!value)}
        style={[
            styles.container,
            {
            backgroundColor: value ? onColor : offColor,
            width: size,
            height: size * 0.5, // Mantiene proporción del contenedor
            borderRadius: size * 0.25,
            },
        ]}
        >
        <View
            style={[
            styles.circle,
            {
                backgroundColor: circleColor,
                width: circleSize,
                height: circleSize,
                borderRadius: circleSize / 2,
                transform: [{ translateX: value ? translateX : 0 }],
            },
            ]}
        />
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 2, // Espaciado entre el círculo y el borde
        justifyContent: "center",
    },
    circle: {
        elevation: 2, // Sombra para el círculo
    },
});

export default CustomSwitch;
