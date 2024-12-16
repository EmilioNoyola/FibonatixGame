// Componentes utilizados de React Native.
import React from 'react';  
import { Text, View, SafeAreaView, StatusBar, Pressable, StyleSheet, ScrollView, Image } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import useCustomFonts from '../../apis/FontsConfigure';

import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

import { MaterialIcons } from '@expo/vector-icons'; // Si estás usando Expo; si no, puedes usar otro ícono.

import { FaceA, FaceB, FaceC, FaceD } from '../../assets/img-svg';


export default function FoodRoomScreen(props) {

    const { fontsLoaded, onLayoutRootView } = useCustomFonts();

    // Si las fuentes no están cargadas, se retorna null
    if (!fontsLoaded) return null;

    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.container} onLayout={onLayoutRootView}>

            <StatusBar
                barStyle="dark-content"
                translucent={true}
                backgroundColor="transparent"
            />

        <View style={styles.header}>

            <View style={{marginHorizontal: 10, marginTop: 30}}>

                <View >
                    <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                        <Pressable onPress={() => { navigation.openDrawer(); }} style={styles.menuButton}>
                            <MaterialIcons name="menu" size={30} color="white" />
                        </Pressable>

                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>

                            <View style={styles.containerEmotion}>

                                <View style={styles.Emotion}>

                                    <FaceB />

                                </View>
                                
                            </View>
                            <View style={styles.containerBarEmotion}>

                                <View style={styles.BarEmotion}></View>

                            </View>

                        </View>

                    </View>
                </View>

                <View style={{marginTop: -5}}>
                    <Text style={styles.textHeader}>Comedor</Text>
                </View>

            </View>

        </View>
            
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FEE6C4',
    },

    header: {
        backgroundColor: '#FFA851',
        height: 164, // Altura fija para el encabezado
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
    },
    textHeader: {
        fontSize: 48,
        color: 'white',
        fontFamily: 'Quicksand',
        textAlign: 'center',
    },
    menuButton: {
        backgroundColor: 'black',
        borderRadius: 70,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerEmotion: {
        backgroundColor: 'black',
        borderRadius: 80,
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 20,
        zIndex: 1,
    },

    Emotion: {
        backgroundColor: '#FEFA82',
        borderRadius: 60,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 20,
        zIndex: 1,
        position: 'absolute',
    },

    containerBarEmotion: {

        backgroundColor: 'black',
        borderTopRightRadius: 60,
        borderBottomRightRadius: 60,
        width: 250,
        height: 35,
        justifyContent: 'center',
        alignItems: 'right',
        marginLeft: -10,

    },

    BarEmotion: {

        backgroundColor: 'orange', //
        borderTopRightRadius: 60,
        borderBottomRightRadius: 60,
        width: 140,
        height: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: -10,

    },

    scrollArea: {
        flex: 1, // Toma el espacio restante después del encabezado
        marginTop: 20, // Opcional, para separación
        marginBottom: 40,
    },
    scrollContainer: {
        paddingHorizontal: 10,
        paddingBottom: 20, // Espacio adicional al final
    },
    Card: {
        width: 360,
        height: 160,
        backgroundColor: '#E26F02',
        borderRadius: 35,
        marginBottom: 40,
        alignSelf: 'center', // Centrado horizontal
        flexDirection: 'row', // Asegura que los elementos estén alineados horizontalmente
        padding: 10,
    },
    containerImage: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#EC8926',
        width: 196,
        height: 138,
        borderRadius: 30,
        marginRight: 20, // Espacio entre la imagen y el texto
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 20,
    },
    textButtonContainer: {
        justifyContent: 'center',
        alignItems: 'center', // Alinea el texto y el botón hacia la izquierda
        flex: 1, // Toma el espacio restante
    },
    cardText: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'Quicksand',
        textAlign: 'center', // Centra el texto
    },
    containerButton: {
        width: 80,
        height: 55,
        marginTop: 10,
        padding: 10,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 7 },
            shadowOpacity: 0.8,
            shadowRadius: 4,
            elevation: 5,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    }
});
