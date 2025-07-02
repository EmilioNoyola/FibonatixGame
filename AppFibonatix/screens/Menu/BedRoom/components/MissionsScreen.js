import React, { useState, useEffect } from 'react';
import { Text, View, SafeAreaView, StatusBar, Pressable, ScrollView } from 'react-native';
import Animated, { useSharedValue, withTiming, useAnimatedStyle } from 'react-native-reanimated';
import useCustomFonts from '../../../../assets/components/FontsConfigure';
import PersonalityGrid from './PersonalityGrid';
import { styles } from './BedroomStyles';

const buttonSpacing = styles.width > 400 ? 20 * styles.scale : 10 * styles.scale;

const misiones = [
    { id: 1, texto: 'Completa una actividad matemática', progreso: '1/3', recompensa: '5' },
    { id: 2, texto: 'Juega 5 minutos en la app', progreso: '2/5', recompensa: '7' },
    { id: 3, texto: 'Gana 10 monedas', progreso: '10/10', recompensa: '10' },
    { id: 4, texto: 'Juega 3 juegos', progreso: '2/3', recompensa: '5' },
];

const ProgressBar = ({ progreso }) => {
    if (!progreso || typeof progreso !== "string" || !progreso.includes("/")) {
        return <Text style={{ color: "red" }}>Error en progreso</Text>;
    }

    const [completado, total] = progreso.split('/').map(Number);
    const progressWidth = useSharedValue(0);

    useEffect(() => {
        if (!isNaN(completado) && !isNaN(total) && total > 0) {
            const porcentaje = (completado / total) * 100;
            progressWidth.value = withTiming(porcentaje, { duration: 500 });
        }
    }, [completado, total]);

    const animatedStyle = useAnimatedStyle(() => ({
        width: `${progressWidth.value}%`,
    }));

    return (
        <View style={styles.progressBarContainer}>
            <Animated.View style={[styles.progressBar, animatedStyle]} />
        </View>
    );
};

export default function MissionsScreen() {
    const { fontsLoaded, onLayoutRootView } = useCustomFonts();
    if (!fontsLoaded) return null;

    const [seccion, setSeccion] = useState('misiones');
    const misionesScale = useSharedValue(1.2); 
    const personalidadScale = useSharedValue(0.9);

    const toggleSeccion = (nuevoValor) => {
        if (nuevoValor === 'misiones') {
            misionesScale.value = withTiming(1.2, { duration: 250 });
            personalidadScale.value = withTiming(0.9, { duration: 250 });
        } else {
            misionesScale.value = withTiming(0.9, { duration: 250 });
            personalidadScale.value = withTiming(1.2, { duration: 250 });
        }
        setSeccion(nuevoValor);
    };

    const animatedMisionesStyle = useAnimatedStyle(() => ({
        transform: [{ scale: misionesScale.value }],
    }));

    const animatedPersonalidadStyle = useAnimatedStyle(() => ({
        transform: [{ scale: personalidadScale.value }],
    }));

    return (
        <SafeAreaView style={styles.missionsContainer} onLayout={onLayoutRootView}>
            <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
            <View style={styles.header2}>
                <View style={styles.tabContainer}>
                    <Animated.View style={[styles.tabButton, animatedMisionesStyle, { marginRight: buttonSpacing }]}> 
                        <Pressable onPress={() => toggleSeccion('misiones')} style={styles.button}>
                            <Text style={styles.buttonText}>Misiones Diarias</Text>
                        </Pressable>
                    </Animated.View>
                    <Animated.View style={[styles.tabButton, animatedPersonalidadStyle, { marginLeft: buttonSpacing }]}> 
                        <Pressable onPress={() => toggleSeccion('personalidad')} style={styles.button}>
                            <Text style={styles.buttonText}>Personalidad</Text>
                        </Pressable>
                    </Animated.View>
                </View>
            </View>
            <View style={styles.contentContainer}>
                {seccion === 'misiones' ? (
                    <ScrollView style={styles.scrollContainer}>
                        {misiones.map((mision) => (
                            <View key={mision.id} style={styles.misionContainer}>
                                <Text style={styles.misionText} numberOfLines={2} ellipsizeMode="tail">
                                    {mision.texto}
                                </Text>
                                <View style={styles.misionInfo}>
                                    <Text style={styles.progreso}>{mision.progreso}</Text>
                                    <View style={styles.recompensaContainer}>
                                        <Text style={styles.recompensa}>{mision.recompensa}</Text>
                                    </View>
                                </View>
                                {typeof mision.progreso === "string" ? (
                                    <ProgressBar progreso={mision.progreso} />
                                ) : (
                                    <Text style={{ color: "red" }}>Error en progreso</Text>
                                )}
                            </View>
                        ))}
                    </ScrollView>
                ) : (
                    <View style={styles.personalidadContainer}>
                        <PersonalityGrid />
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
}