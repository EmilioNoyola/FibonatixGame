import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useBluetooth } from '../../../../assets/context/BluetoothContext';
import { plushieService } from '../../../../assets/services/PlushieService';
import { styles } from '../components/HomeStyles';

const GameCard = ({ title, imageUrl, navigateTo, id }) => {
    const navigation = useNavigation();
    const { isConnected, writeToCharacteristic } = useBluetooth();

    const handlePress = async () => {
        try {
            if (isConnected && id) {
            console.log(`Intentando seleccionar juego con id: ${id} para ${title}`);
            await plushieService.selectGame(writeToCharacteristic, isConnected, id);
            console.log(`Juego ${id} (${title}) seleccionado exitosamente`);
            } else {
            console.log(`No se seleccionó juego: isConnected=${isConnected}, id=${id}`);
            }
            navigation.navigate(navigateTo);
        } catch (error) {
            console.error(`Error al notificar selección de juego ${id} (${title}):`, error);
        }
    };

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
                        onPress={handlePress}
                    >
                        <FontAwesome5 name="play" size={24} color="white" />
                    </Pressable>
            </View>
        </View>
    );
};

export default GameCard;