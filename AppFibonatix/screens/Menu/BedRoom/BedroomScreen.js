// Componentes de React
import React, { useState, useEffect, useRef } from 'react';  
import { Text, View, SafeAreaView, StatusBar, Pressable, StyleSheet, Animated, BackHandler } from 'react-native';

// Navegación
import { useNavigation } from '@react-navigation/native';

// Fuentes
import useCustomFonts from '../../../assets/components/FontsConfigure';

// Íconos
import { MaterialIcons } from '@expo/vector-icons';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { FocusOn, FocusOff } from '../../../assets/img-svg';

// Componente de Misiones y Personalidad
import MissionsScreen from './components/MissionsScreen';

// Foco de sueño
import { useFocus } from '../../../assets/components/FocusContext';

import { useAppContext } from '../../../assets/context/AppContext';

export default function BeedRoomScreen(props) {
    const { fontsLoaded, onLayoutRootView } = useCustomFonts();
    const { globalData } = useAppContext(); // Añade esta línea para acceder a globalData
    if (!fontsLoaded) return null;

    const navigation = useNavigation();
    const { isFocusOn, setIsFocusOn } = useFocus();
    const [showOverlay, setShowOverlay] = useState(false);
    const overlayOpacity = useRef(new Animated.Value(0)).current;
    const [toggleDisabled, setToggleDisabled] = useState(false);

    useEffect(() => {
        if (!isFocusOn) {
            setShowOverlay(true);
            Animated.timing(overlayOpacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start(() => {
                setToggleDisabled(false);
            });
        } else {
            Animated.timing(overlayOpacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start(() => {
                setShowOverlay(false);
                setToggleDisabled(false);
            });
        }
    }, [isFocusOn, overlayOpacity]);    

    useEffect(() => {
        const onBackPress = () => {
            if (!isFocusOn) {
                return true;
            }
            return false;
        };
        const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
        return () => subscription.remove();
    }, [isFocusOn]);

    const toggleFocus = () => {
        if (toggleDisabled) return;
        setToggleDisabled(true);
        setIsFocusOn(prev => !prev);
    };    

    useEffect(() => {
        const unsubscribe = navigation.addListener('beforeRemove', (e) => {
            if (!isFocusOn) {
                e.preventDefault();
            }
        });
        return () => unsubscribe();
    }, [isFocusOn, navigation]);        

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.container} 
                pointerEvents={!isFocusOn ? "none" : "auto"}
            >
                <StatusBar
                    barStyle="dark-content"
                    translucent={true}
                    backgroundColor="transparent"
                />

                <View style={styles.header}>
                    <View style={{ marginHorizontal: 10, marginTop: 30 }}>
                        <View>
                            <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                                <Pressable onPress={() => { navigation.openDrawer(); }} style={styles.menuButton}>
                                    <MaterialIcons name="menu" size={30} color="white" />
                                </Pressable>

                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                    <View style={styles.containerEmotion}>
                                        <View style={styles.Emotion}>
                                            <SimpleLineIcons name="energy" size={40} color="#15448e" />
                                        </View>
                                    </View>
                                    <View style={styles.containerBarEmotion}>
                                        <View style={[styles.BarEmotion, { width: (globalData.sleepPercentage || 0) * 2.5 }]}></View>
                                    </View>
                                </View>
                            </View>
                        </View>

                        <View style={{ marginTop: -5 }}>
                            <Text style={styles.textHeader}>Dormitorio</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.containerSleep}>
                    <View style={styles.containerFocus}>
                        { isFocusOn && (
                            <Pressable style={styles.Focus} onPress={toggleFocus}>
                                <FocusOn />
                            </Pressable>
                        )}
                    </View>

                    <View style={styles.containerMisions}>
                        <MissionsScreen />
                    </View>
                </View>
            </View>

            {showOverlay && (
                <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>
                    <Pressable style={styles.Focus2} onPress={toggleFocus} pointerEvents="auto">
                        <FocusOff />
                    </Pressable>
                </Animated.View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#B7E0FE',
        justifyContent: 'space-between',
    },
    header: {
        backgroundColor: '#478CDB',
        height: 164,
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
        backgroundColor: '#15448e',
        borderRadius: 80,
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
        zIndex: 1,
    },
    Emotion: {
        backgroundColor: '#86cee9',
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
        backgroundColor: '#15448e',
        borderTopRightRadius: 60,
        borderBottomRightRadius: 60,
        width: 250,
        height: 35,
        justifyContent: 'center',
        alignItems: 'right',
        marginLeft: -10,
    },
    BarEmotion: {
        backgroundColor: '#04a2e1',
        borderTopRightRadius: 60,
        borderBottomRightRadius: 60,
        width: 80,
        height: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: -10,
    },
    containerSleep: {
        backgroundColor: '#7cc7fd',
        width: '100%',
        height: '60%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        position: 'relative',
    },
    containerFocus: {
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: '#B7E0FE',
        position: 'absolute',
        top: -100,
        left: '50%',
        transform: [{ translateX: -100 }],
        zIndex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    Focus: {
        width: 180,
        height: 180,
        borderRadius: 90,
        backgroundColor: '#478CDB',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    Focus2: {
        width: 180,
        height: 180,
        borderRadius: 150,
        marginBottom: '40%',
        backgroundColor: '#478CDB',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerMisions: {
        flex: 1,
        width: '85%',
        marginBottom: 20,
        backgroundColor: '#57A4FD',
        marginTop: 120,
        alignSelf: 'center',
        borderRadius: 20,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
    },    
});