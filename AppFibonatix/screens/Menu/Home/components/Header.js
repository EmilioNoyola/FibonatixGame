import React, { useMemo } from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import { styles } from './HomeStyles';
import AnimatedBar from '../../../../assets/components/AnimatedBar';


const Header = ({ onMenuPress, gamePercentage }) => {

    const moodFace = useMemo(() => {
        let imageUrl = '';

        if (gamePercentage >= 75) {
            imageUrl = 'https://raw.githubusercontent.com/EmilioNoyola/FibonatixGame/refs/heads/main/IMG/Emociones/ShurteIconHappy.png';
        } else if (gamePercentage >= 50) {
            imageUrl = 'https://raw.githubusercontent.com/EmilioNoyola/FibonatixGame/refs/heads/main/IMG/Emociones/ShurtleIconMeh.png';
        } else {
            imageUrl = 'https://raw.githubusercontent.com/EmilioNoyola/FibonatixGame/refs/heads/main/IMG/Emociones/ShurtleIconMad.png';
        }

        return (
            <Image
                source={{ uri: imageUrl }}
                style={styles.emotion}
                resizeMode="contain"
            />
        );
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