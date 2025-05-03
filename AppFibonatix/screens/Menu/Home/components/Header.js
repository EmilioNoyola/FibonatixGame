import React, { useMemo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import { styles } from './HomeStyles';
import AnimatedBar from '../../../../assets/components/AnimatedBar';

// Importa las animaciones Lottie
import happyFace from '../../../../assets/lottie/happy-face.json';
import contentFace from '../../../../assets/lottie/content-face.json';
import neutralFace from '../../../../assets/lottie/neutral-face.json';
import sadFace from '../../../../assets/lottie/sad-face.json';

const Header = ({ onMenuPress, gamePercentage }) => {
    // Seleccionar la animación de la carita según el porcentaje
    const moodFace = useMemo(() => {
        if (gamePercentage >= 75) {
        return <LottieView source={happyFace} autoPlay loop style={styles.emotion} />;
        }
        if (gamePercentage >= 50) {
        return <LottieView source={contentFace} autoPlay loop style={styles.emotion} />;
        }
        if (gamePercentage >= 25) {
        return <LottieView source={neutralFace} autoPlay loop style={styles.emotion} />;
        }
        return <LottieView source={sadFace} autoPlay loop style={styles.emotion} />;
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
                    <View style={styles.containerEmotion}>{moodFace}</View>
                    <AnimatedBar
                    percentage={gamePercentage}
                    barStyle={styles.barEmotion}
                    containerStyle={styles.containerBarEmotion}
                    />
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