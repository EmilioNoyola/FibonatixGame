// Componente de la Pantalla de carga.
import React from 'react';
import useCustomFonts from './FontsConfigure';
import { View, Text, ActivityIndicator, StyleSheet, Image } from 'react-native';
import { Dimensions } from 'react-native';

const LoadingScreen = ({ textoAdicional }) => {

    const image = require('../img/logo_carga.png');
    const screenWidth = Dimensions.get('window').width;
    const imageWidth = screenWidth * 0.8; 
    const imageHeight = imageWidth * (293 / 332); 

    const { fontsLoaded, onLayoutRootView } = useCustomFonts();
    if (!fontsLoaded) return null;

    return (
        <View style={styles.container}>
            <Image
                        source={image}
                        style={{
                            width: imageWidth,
                            height: imageHeight,
                            zIndex: 10,
                            resizeMode: 'contain'
                        }}
                    />
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
        backgroundColor: '#fffdf7',
    },
    text: {
        marginTop: 10,
        fontSize: 18,
        color: '#0B5A39',
        fontFamily: 'Quicksand_Medium',
    },
    subText: {
        marginTop: 5,  
        fontSize: 16,   
        color: '#555555', 
        fontFamily: 'Quicksand_Regular', 
    },
});

export default LoadingScreen;
