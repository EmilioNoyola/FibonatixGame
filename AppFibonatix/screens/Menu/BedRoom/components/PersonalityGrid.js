// Componentes de React
import React from "react";
import { StyleSheet, ScrollView } from "react-native";

// Componente de Personalidad
import PersonalityItem from "./PersonalityItem";

const personalityData = [
    { id: 1, name: "Artístico", image: { uri: 'https://raw.githubusercontent.com/EmilioNoyola/FibonatixGame/refs/heads/main/IMG/Emociones/Artistico.png' }, progress: 87, color: "#E63946" },
    { id: 2, name: "Paciente", image: { uri: 'https://raw.githubusercontent.com/EmilioNoyola/FibonatixGame/refs/heads/main/IMG/Emociones/Paciente.png' }, progress: 15, color: "#F4A261" },
    { id: 3, name: "Sociable", image: { uri: 'https://raw.githubusercontent.com/EmilioNoyola/FibonatixGame/refs/heads/main/IMG/Emociones/Sociable.png' }, progress: 63, color: "#FFD60A" },
    { id: 4, name: "Valiente", image: { uri: 'https://raw.githubusercontent.com/EmilioNoyola/FibonatixGame/refs/heads/main/IMG/Emociones/Valiente.png' }, progress: 57, color: "#2A9D8F" },
    { id: 5, name: "Ágil", image: { uri: 'https://raw.githubusercontent.com/EmilioNoyola/FibonatixGame/refs/heads/main/IMG/Emociones/Agil.png' }, progress: 35, color: "#457B9D" },
    { id: 6, name: "Tenaz", image: { uri: 'https://raw.githubusercontent.com/EmilioNoyola/FibonatixGame/refs/heads/main/IMG/Emociones/Tenaz.png' }, progress: 92, color: "#6A4C93" },
];

export default function PersonalityGrid() {
    return (
        <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
            {personalityData.map((item) => (
                <PersonalityItem key={item.id} {...item} />
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-around",
    },
});
