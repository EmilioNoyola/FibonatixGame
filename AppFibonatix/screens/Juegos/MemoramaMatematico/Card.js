import React from "react";
import { Pressable, Text, StyleSheet, Dimensions } from "react-native";
import { RFPercentage } from 'react-native-responsive-fontsize';

const { width } = Dimensions.get("window");
const scale = width / 414;

const styles = StyleSheet.create({
    card: {
        width: 80 * scale,
        height: 80 * scale,
        margin: 5 * scale,
        borderRadius: 10 * scale,
        backgroundColor: "#da7e01",
        justifyContent: "center",
        alignItems: "center",
    },
    cardTurned: {
        backgroundColor: "#FFD3B8",
    },
    cardText: {
        fontSize: RFPercentage(3),
        color: "#FFFFFF",
        fontFamily: "Quicksand",
    },
    cardTextTurned: {
        color: "#da7e01",
    },
});

const Card = ({ children, isTurnedOver, onPress }) => {
    return (
        <Pressable
        style={[styles.card, isTurnedOver && styles.cardTurned]}
        onPress={onPress}
        >
        <Text
            style={[styles.cardText, isTurnedOver && styles.cardTextTurned]}
        >
            {isTurnedOver ? children : "?"}
        </Text>
        </Pressable>
    );
};

export default Card;