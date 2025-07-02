import React, { useState, useEffect, useRef } from 'react';  
import { Text, View, SafeAreaView, StatusBar, Pressable, Animated, BackHandler, ScrollView, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { useBluetooth } from '../../../assets/context/BluetoothContext';
import { plushieService } from '../../../assets/services/PlushieService';
import useCustomFonts from '../../../assets/components/FontsConfigure';
import { FocusOn, FocusOff } from '../../../assets/img-svg';
import MissionsScreen from './components/MissionsScreen';
import { useFocus } from '../../../assets/components/FocusContext';
import { useAppContext } from '../../../assets/context/AppContext';
import AnimatedBar from '../../../assets/components/AnimatedBar';
import StatusAlertModal from '../../../assets/components/StatusAlertModal';
import * as Notifications from 'expo-notifications';
import { styles } from './components/BedroomStyles';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function BedroomScreen(props) {
    const { fontsLoaded, onLayoutRootView } = useCustomFonts();
    const { socket, globalData, refreshUserData, alert, setAlert, updateSleepPercentage, clientId } = useAppContext();
    const [refreshing, setRefreshing] = useState(false);
    if (!fontsLoaded) return null;

    const navigation = useNavigation();
    const { isFocusOn, setIsFocusOn } = useFocus();
    const [showOverlay, setShowOverlay] = useState(false);
    const overlayOpacity = useRef(new Animated.Value(0)).current;
    const [toggleDisabled, setToggleDisabled] = useState(false);
    const [regenerationTime, setRegenerationTime] = useState(0);
    const { isConnected, writeToCharacteristic } = useBluetooth();
    const cleanupFSRRef = useRef(null);

    useEffect(() => {
        if (alert && isConnected) {
            if (cleanupFSRRef.current?.pauseMonitoring) {
                cleanupFSRRef.current.pauseMonitoring();
            }
            
            plushieService.handleStatusAlert(writeToCharacteristic, isConnected, alert);
            
            const timer = setTimeout(() => {
                setAlert(null);
                if (cleanupFSRRef.current?.resumeMonitoring) {
                    cleanupFSRRef.current.resumeMonitoring();
                }
            }, 3000);
            
            return () => clearTimeout(timer);
        }
    }, [alert, isConnected]);

    useEffect(() => {
        let interval;
        if (!isFocusOn && globalData.sleepPercentage < 100) {
            setShowOverlay(true);
            Animated.timing(overlayOpacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start(() => {
                setToggleDisabled(false);
            });

            interval = setInterval(async () => {
                try {
                    await updateSleepPercentage(0.2);
                    // Forzar sincronización periódica
                    if (Math.floor(globalData.sleepPercentage) % 10 === 0) {
                        await forceSync();
                    }
                } catch (error) {
                    console.error("Error al actualizar sueño:", error);
                    clearInterval(interval);
                }
            }, 1000);
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

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isFocusOn, overlayOpacity]);

    useEffect(() => {
        if (!socket || !clientId) return;

        const handleFocusToggle = () => {
            socket.emit("toggleFocus", { clientId, isFocusOn }, (ack) => {
                if (!ack?.success) {
                    console.error("Error al sincronizar estado del foco");
                    // Revertir el estado si falla la sincronización
                    setIsFocusOn(prev => !prev);
                }
            });
        };

        const timer = setTimeout(handleFocusToggle, 500); // Pequeño delay para evitar sobrecarga

        return () => clearTimeout(timer);
    }, [isFocusOn, clientId, socket]);

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

    const onRefresh = async () => {
        setRefreshing(true);
        try {
            await refreshUserData();
        } catch (error) {
            console.error('Error al recargar datos globales:', error);
        } finally {
            setRefreshing(false);
        }
    };

    // Configurar notificaciones push
    useEffect(() => {
        const checkStatus = async () => {
            const now = Date.now();
            const lastAlertTime = globalData.lastAlertTime || 0;
            if (now - lastAlertTime < 30000) return;

            const scheduleNotification = async (title, message) => {
                await Notifications.scheduleNotificationAsync({
                    content: {
                        title: title,
                        body: message,
                        sound: true,
                    },
                    trigger: null, 
                });
                setGlobalData(prev => ({ ...prev, lastAlertTime: now }));
            };

            if (globalData.sleepPercentage <= 5) {
                const timeToFull = ((100 - globalData.sleepPercentage) * 3000 / 100) / 60000;
                await scheduleNotification(
                    '¡Tu tortuga tiene mucho sueño!',
                    `Falta ${Math.ceil(timeToFull)} min para regenerar el sueño.`
                );
            } else if (globalData.sleepPercentage <= 15) {
                const timeToFull = ((100 - globalData.sleepPercentage) * 3000 / 100) / 60000;
                await scheduleNotification(
                    '¡Tu tortuga tiene sueño!',
                    `Falta ${Math.ceil(timeToFull)} min para regenerar el sueño.`
                );
            }
            if (globalData.foodPercentage <= 5) {
                const timeToFull = (100 - globalData.foodPercentage) * 1800 / 100; // 3 min
                await scheduleNotification(
                    '¡Tu tortuga tiene mucha hambre!',
                    `Falta ${Math.ceil(timeToFull / 60000)} min para alimentarla.`,
                    timeToFull
                );
            } else if (globalData.foodPercentage <= 15) {
                const timeToFull = (100 - globalData.foodPercentage) * 1800 / 100;
                await scheduleNotification(
                    '¡Tu tortuga tiene hambre!',
                    `Falta ${Math.ceil(timeToFull / 60000)} min para alimentarla.`,
                    timeToFull
                );
            }
            if (globalData.gamePercentage <= 5) {
                const timeToFull = (100 - globalData.gamePercentage) * 2400 / 100; // 4 min
                await scheduleNotification(
                    '¡Tu tortuga quiere jugar mucho!',
                    `Falta ${Math.ceil(timeToFull / 60000)} min para que juegue.`,
                    timeToFull
                );
            } else if (globalData.gamePercentage <= 15) {
                const timeToFull = (100 - globalData.gamePercentage) * 2400 / 100;
                await scheduleNotification(
                    '¡Tu tortuga quiere jugar!',
                    `Falta ${Math.ceil(timeToFull / 60000)} min para que juegue.`,
                    timeToFull
                );
            }
        };

        const interval = setInterval(checkStatus, 30000); // Verificar cada 30 segundos
        return () => clearInterval(interval);
    }, [globalData]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.container} pointerEvents={!isFocusOn ? "none" : "auto"}>
                <StatusBar
                    barStyle="dark-content"
                    translucent={true}
                    backgroundColor="transparent"
                />
                <View style={styles.header}>
                    <View style={{ marginHorizontal: 10 * styles.scale, marginTop: 30 * styles.scale }}>
                        <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                            <Pressable onPress={() => { navigation.openDrawer(); }} style={styles.menuButton}>
                                <MaterialIcons name="menu" size={30 * styles.scale} color="white" />
                            </Pressable>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <View style={styles.containerEmotion}>
                                    <View style={styles.Emotion}>
                                        <SimpleLineIcons name="energy" size={40 * styles.scale} color="#15448e" />
                                    </View>
                                </View>
                                <AnimatedBar
                                    percentage={globalData.sleepPercentage || 0}
                                    barStyle={styles.BarEmotion}
                                    containerStyle={styles.containerBarEmotion}
                                />
                            </View>
                        </View>
                        <View style={{ marginTop: -5 * styles.scale }}>
                            <Text style={styles.textHeader}>Dormitorio</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.containerSleep}>
                    <View style={styles.containerFocus}>
                        {isFocusOn && (
                            <Pressable style={styles.Focus} onPress={toggleFocus}>
                                <FocusOn />
                            </Pressable>
                        )}
                        {!isFocusOn && regenerationTime > 0 && (
                            <Text style={styles.timerText}>
                                Regenerando: {Math.ceil(regenerationTime / 1000)}s
                            </Text>
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
            <StatusAlertModal
                key={alert ? `${alert.type}-${alert.level}-${globalData.lastAlertTime}` : null}
                visible={!!alert}
                type={alert?.type}
                onClose={() => setAlert(null)}
            />
        </SafeAreaView>
    );
}
