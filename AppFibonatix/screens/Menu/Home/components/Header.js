import React, { useMemo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { FaceA, FaceB, FaceC, FaceD } from '../../../../assets/img-svg';
import { styles } from './HomeStyles';

const Header = ({ onMenuPress, gamePercentage }) => {
    const moodFace = useMemo(() => {
        if (gamePercentage >= 75) return <FaceA />;
        if (gamePercentage >= 50) return <FaceB />;
        if (gamePercentage >= 25) return <FaceC />;
        return <FaceD />;
    }, [gamePercentage]);

    return (
        <View style={styles.containerHeader}>
            <View style={styles.header}>
                <View style={{ marginHorizontal: 10, marginTop: 30 }}>
                    <View>
                        <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                            <Pressable onPress={onMenuPress} style={styles.menuButton}>
                                <MaterialIcons name="menu" size={30} color="white" />
                            </Pressable>

                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <View style={styles.containerEmotion}>
                                    <View style={styles.emotion}>
                                        {moodFace}
                                    </View>
                                </View>
                                <View style={styles.containerBarEmotion}>
                                    <View style={[styles.barEmotion, { width: gamePercentage * 2.5 }]}></View>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={{ marginTop: -5 }}>
                        <Text style={styles.textHeader}>Sala de Juegos</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default Header;