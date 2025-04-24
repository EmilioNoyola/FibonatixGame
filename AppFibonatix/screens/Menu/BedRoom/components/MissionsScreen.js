// Componentes y Hooks de React
import React, { useState, useEffect } from 'react';
import { Text, View, SafeAreaView, StatusBar, Pressable, ScrollView, StyleSheet, Dimensions } from 'react-native';

// Animaciones
import Animated, { useSharedValue, withTiming, useAnimatedStyle } from 'react-native-reanimated';

// Fuentes
import useCustomFonts from '../../../../assets/components/FontsConfigure';

// Componente de Sección Personalidad
import PersonalityGrid from './PersonalityGrid';

const { width } = Dimensions.get('window');
const buttonSpacing = width > 400 ? 20 : 10;

const misiones = [
    { id: 1, texto: 'Completa una actividad matemática', progreso: '1/3', recompensa: '5' },
    { id: 2, texto: 'Juega 5 minutos en la app', progreso: '2/5', recompensa: '7' },
    { id: 3, texto: 'Gana 10 monedas', progreso: '10/10', recompensa: '10' },
    { id: 4, texto: 'Juega 3 juegos', progreso: '2/3', recompensa: '5' },
];

// Componente de barra de progreso animada.
const ProgressBar = ({ progreso }) => {
    if (!progreso || typeof progreso !== "string" || !progreso.includes("/")) {
        return <Text style={{ color: "red" }}>Error en progreso</Text>; // Si hay un error en progreso
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

    // Botón seleccionado
    const toggleSeccion = (nuevoValor) => {
        if (nuevoValor === 'misiones') {
            misionesScale.value = withTiming(1.2, { duration: 250 }); // Escala grande para activo
            personalidadScale.value = withTiming(0.9, { duration: 250 }); // Escala pequeña para inactivo
        } else {
            misionesScale.value = withTiming(0.9, { duration: 250 }); // Escala pequeña para inactivo
            personalidadScale.value = withTiming(1.2, { duration: 250 }); // Escala grande para activo
        }
        setSeccion(nuevoValor);
    };

    // Animación de aumento de tamaño misiones.
    const animatedMisionesStyle = useAnimatedStyle(() => ({
        transform: [{ scale: misionesScale.value }],
    }));

    // Animación de aumento de tamaño personalidad.
    const animatedPersonalidadStyle = useAnimatedStyle(() => ({
        transform: [{ scale: personalidadScale.value }],
    }));

    return (
        <SafeAreaView style={styles.container} onLayout={onLayoutRootView}>
            <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
            
            <View style={styles.header}>
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

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#B7E0FE', borderRadius: 20 },
    header: { backgroundColor: '#1E62CE', paddingVertical: 15, alignItems: 'center', borderTopLeftRadius: 20, borderTopRightRadius: 20 },
    tabContainer: { flexDirection: 'row', justifyContent: 'center', width: '90%' },
    tabButton: { borderRadius: 15, overflow: 'hidden' },
    button: { backgroundColor: '#2B79F5', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10 },
    buttonText: { color: 'white', fontSize: 16, fontFamily: 'Quicksand' },
    contentContainer: { flex: 1, padding: 15 },
    scrollContainer: { flex: 1 },
    misionContainer: { backgroundColor: '#57A4FD', padding: 15, borderRadius: 10, marginBottom: 10, flexDirection: 'column' },
    misionText: { color: 'white', fontSize: 16, fontFamily: 'Quicksand_Medium', flexShrink: 1 },
    misionInfo: { backgroundColor: '#88BFFD', borderRadius: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 5 },
    progreso: { color: 'white', fontSize: 14, fontFamily: 'Quicksand_Medium', marginLeft: 10 },
    recompensaContainer: { height: 30, width: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center', backgroundColor: 'orange' },
    recompensa: { fontSize: 18, color: 'white', fontFamily: 'Quicksand_Medium' },
    personalidadContainer: {  },
    personalidadText: { fontSize: 20, fontWeight: 'bold', color: '#478CDB' },
    progressBarContainer: { height: 10, backgroundColor: '#E0E0E0', borderRadius: 5, marginTop: 10, overflow: 'hidden' },
    progressBar: { height: '100%', backgroundColor: '#4CAF50', borderRadius: 5, },
});