// Esta pantalla de carga se muestra al cargar la pantalla principal.
import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Image } from 'react-native';

// Fuentes personalizadas.
import useCustomFonts from '../apis/FontsConfigure';

const image = require('../assets/tortuga.png');

const LoadingScreen = ({ textoAdicional }) => {

    // Estado para las fuentes personalizadas.
    const { fontsLoaded, onLayoutRootView } = useCustomFonts();
    if (!fontsLoaded) return null; // Si las fuentes no están cargadas, se retorna null

    return (
        <View style={styles.container}>
            <Image source={image} style={{ width: 120, height: 110 }} />
            <ActivityIndicator size="large" color="#0B5A39" />
            <Text style={styles.text}>Cargando...</Text> 
            <Text style={styles.subText}>{textoAdicional}</Text> 
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#CBEFD5',
    },
    text: {
        marginTop: 10,
        fontSize: 18,
        color: '#0B5A39',
        fontFamily: 'Quicksand_Medium',
    },
    subText: {
        marginTop: 5,  // Margen superior para el nuevo texto
        fontSize: 16,   // Tamaño de fuente del nuevo texto
        color: '#555555', // Color del nuevo texto
        fontFamily: 'Quicksand_Regular', // Fuente del nuevo texto
    },
});

export default LoadingScreen;
