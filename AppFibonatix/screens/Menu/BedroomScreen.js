// Componentes utilizados de React Native.
import React from 'react';  
import { Text, View, SafeAreaView, StatusBar, Pressable, StyleSheet } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import useCustomFonts from '../../apis/FontsConfigure';

import { MaterialIcons } from '@expo/vector-icons'; // Si estás usando Expo; si no, puedes usar otro ícono.

import { FaceA, FaceB, FaceC, FaceD } from '../../assets/img-svg';

export default function BeedRoomScreen(props) {

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

                                    <FaceD />

                                </View>
                                
                            </View>
                            <View style={styles.containerBarEmotion}>

                                <View style={styles.BarEmotion}></View>

                            </View>

                        </View>

                    </View>
                </View>

                <View style={{marginTop: -5}}>
                    <Text style={styles.textHeader}>Dormitorio</Text>
                </View>

            </View>

            </View>
            
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#B7E0FE',
    },

    header: {
        backgroundColor: '#478CDB',
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

        backgroundColor: '#04a2e1', //
        borderTopRightRadius: 60,
        borderBottomRightRadius: 60,
        width: 80,
        height: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: -10,

    },

    logoutButton: {
        backgroundColor: '#ff4d4d',
        padding: 15,
        borderRadius: 10,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    menuButton: {
        backgroundColor: 'black',
        borderRadius: 60,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
