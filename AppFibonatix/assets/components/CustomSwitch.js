// Botón switch personalizable.
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
    const circleSize = size * 0.4; 
    const translateX = size - circleSize - 4;

    return (
        <Pressable
        onPress={() => onValueChange(!value)}
        style={[
            styles.container,
            {
            backgroundColor: value ? onColor : offColor,
            width: size,
            height: size * 0.5, 
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
        padding: 2, 
        justifyContent: "center",
    },
    circle: {
        elevation: 2, 
    },
});

export default CustomSwitch;
