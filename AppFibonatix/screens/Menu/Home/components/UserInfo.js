import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppContext } from '../../../../assets/context/AppContext';
import { styles } from './HomeStyles';

const UserInfo = ({ onOpenModal }) => {
    const { globalData } = useAppContext();

    const calculateLevel = (trophies) => {
        const trophyCount = trophies || 0;
        return Math.floor(trophyCount / 10) + 1;
    };

    return (
        <View style={styles.containerInfo}>
            <View style={styles.information}>
                <View style={styles.containerMonedas}>
                    <View style={styles.monedas}></View>
                    <Text style={styles.textMonedas}>x{globalData.coins || 0}</Text>
                </View>

                <Pressable onPress={onOpenModal} style={styles.containerPlushieButton}>
                    <View style={styles.plushieButton}>
                        <MaterialIcons name="toys" size={24} color="white" />
                    </View>
                </Pressable>

                <View style={styles.containerVictorias}>
                    <View style={styles.victorias}>
                        <Image
                            source={require("../../../../assets/img/Trofeo.png")}
                            style={styles.imageWins}
                            resizeMode="contain"
                        />
                    </View>
                    <Text style={styles.textVictorias}>x{globalData.trophies || 0}</Text>
                </View>
            </View>
        </View>
    );
};

export default UserInfo;