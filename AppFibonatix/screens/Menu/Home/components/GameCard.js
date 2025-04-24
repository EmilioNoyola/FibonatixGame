import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { styles } from '../components/HomeStyles';

const GameCard = ({ title, imageUrl, navigateTo }) => {
    const navigation = useNavigation();

    return (
        <View style={styles.card}>
            <View style={styles.containerImage}>
                <Image
                    source={{ uri: imageUrl || 'https://via.placeholder.com/300x200' }}
                    style={styles.image}
                    resizeMode="cover"
                />
            </View>
            <View style={styles.textButtonContainer}>
                <Text style={styles.cardText}>{title}</Text>
                <Pressable
                    style={({ pressed }) => [
                        {
                            backgroundColor: pressed ? '#185D45' : '#1F7758',
                        },
                        styles.containerButton,
                    ]}
                    onPress={() => navigation.navigate(navigateTo)}
                >
                    <FontAwesome5 name="play" size={24} color="white" />
                </Pressable>
            </View>
        </View>
    );
};

export default GameCard;