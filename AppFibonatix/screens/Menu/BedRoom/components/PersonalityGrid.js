import React from "react";
import { ScrollView } from "react-native";
import PersonalityItem from "./PersonalityItem";
import { styles } from "./BedroomStyles";
import { useAppContext } from "../../../../assets/context/AppContext";

export default function PersonalityGrid() {
    const { personalityTraits } = useAppContext();

    return (
        <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
            {personalityTraits.map((trait, index) => (
                <PersonalityItem
                    key={index}
                    name={trait.name}
                    image={{ uri: trait.imageUrl || "https://raw.githubusercontent.com/EmilioNoyola/FibonatixGame/refs/heads/main/IMG/Emociones/Sociable.png" }}
                    progress={trait.percentage}
                    color={["#E63946", "#F4A261", "#FFD60A", "#2A9D8F", "#457B9D", "#6A4C93"][index % 6]}
                />
            ))}
        </ScrollView>
    );
}