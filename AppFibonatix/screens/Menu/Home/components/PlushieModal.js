import React, { useEffect, useState, useRef } from 'react';
import { Modal, View, Text, Pressable, Animated, Easing, FlatList, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { styles } from './PlushieModalStyles';
import { useBluetooth } from '../../../../assets/context/BluetoothContext';
import { plushieService } from '../../../../assets/services/PlushieService';

const PlushieModal = ({ visible, onClose }) => {
    const slideUp = useState(new Animated.Value(300))[0];
    const fadeIn = useState(new Animated.Value(0))[0];
    const { isConnected, isConnecting, pairedDevices, connectToDevice, disconnectDevice, writeToCharacteristic, subscribeToData } = useBluetooth();
    const [showDeviceList, setShowDeviceList] = useState(false);
    const [colorIndex, setColorIndex] = useState(0);
    const [isVibrating, setIsVibrating] = useState(false);
    const cleanupFSRRef = useRef(null);
    const cleanupIMURef = useRef(null);
    const isMounted = useRef(true);

    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(slideUp, {
                    toValue: 0,
                    duration: 500,
                    easing: Easing.out(Easing.exp),
                    useNativeDriver: true,
                }),
                Animated.timing(fadeIn, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(slideUp, {
                    toValue: 300,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeIn, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [visible]);

    useEffect(() => {
        // Limpiar monitores anteriores
        if (cleanupFSRRef.current) {
            cleanupFSRRef.current();
            cleanupFSRRef.current = null;
        }
        if (cleanupIMURef.current) {
            cleanupIMURef.current();
            cleanupIMURef.current = null;
        }

        if (isConnected && visible) {
            // Configurar monitoreo de FSR
            cleanupFSRRef.current = plushieService.monitorFSR(
                writeToCharacteristic,
                subscribeToData,
                isConnected,
                async (fsrValue) => {
                    if (!isMounted.current) return;
                    
                    const lowThreshold = 200;
                    const midThreshold = 500;
                    const highThreshold = 800;

                    let r, g, b;
                    if (fsrValue < lowThreshold) {
                        // Apagar LED si es presión muy baja
                        r = 0;
                        g = 0;
                        b = 0;
                    } else if (fsrValue >= lowThreshold && fsrValue < midThreshold) {
                        // Amarillo (255, 255, 0)
                        r = 1;
                        g = 1;
                        b = 0;
                    } else if (fsrValue >= midThreshold && fsrValue < highThreshold) {
                        // Naranja (aproximado: 255, 165, 0 → 1, 0.65, 0)
                        r = 1;
                        g = 0.65;
                        b = 0;
                    } else {
                        // Rojo (255, 0, 0)
                        r = 1;
                        g = 0;
                        b = 0;
                    }

                    try {
                        await writeToCharacteristic(`LED:${r},${g},${b}`);
                        console.log(`LED cambiado por FSR: R=${r}, G=${g}, B=${b}, Valor=${fsrValue}`);
                    } catch (error) {
                        console.error('Error al actualizar LED desde FSR:', error);
                    }
                }
            );

            // Configurar monitoreo de IMU
            cleanupIMURef.current = plushieService.monitorIMU(
                writeToCharacteristic,
                subscribeToData,
                isConnected,
                async () => {
                    if (!isMounted.current) return;
                    
                    try {
                        // Reutilizar la misma lógica de toggleLEDs
                        const nextIndex = await plushieService.toggleLEDs(
                            writeToCharacteristic, 
                            isConnected, 
                            colorIndex
                        );
                        setColorIndex(nextIndex);
                        console.log(`LED cambiado por IMU a índice ${nextIndex}`);
                    } catch (error) {
                        console.error('Error al actualizar LED desde IMU:', error);
                    }
                }
            );
        }

        return () => {
            // Limpiar al desmontar
            if (cleanupFSRRef.current) {
                cleanupFSRRef.current();
                cleanupFSRRef.current = null;
            }
            if (cleanupIMURef.current) {
                cleanupIMURef.current();
                cleanupIMURef.current = null;
            }
        };
    }, [isConnected, visible]);

    const handleToggleConnection = () => {
        if (isConnected) {
            disconnectDevice();
            setShowDeviceList(false);
        } else {
            setShowDeviceList(true);
        }
    };

    const handleDeviceSelect = (device) => {
        setShowDeviceList(false);
        connectToDevice(device);
    };

    const handleToggleLEDs = async () => {
        try {
            const nextIndex = await plushieService.toggleLEDs(writeToCharacteristic, isConnected, colorIndex);
            setColorIndex(nextIndex);
        } catch (error) {
            Alert.alert('Error', 'No se pudo cambiar los LEDs. Asegúrate de estar conectado al peluche.');
        }
    };

    const handleToggleVibration = async () => {
        try {
            const newVibrationState = await plushieService.toggleVibration(writeToCharacteristic, isConnected, isVibrating);
            setIsVibrating(newVibrationState);
        } catch (error) {
            Alert.alert('Error', 'No se pudo controlar la vibración. Asegúrate de estar conectado al peluche.');
        }
    };

    const renderDeviceItem = ({ item }) => (
        <Pressable
            style={styles.deviceItem}
            onPress={() => handleDeviceSelect(item)}
            disabled={isConnecting}
        >
            <Text style={styles.deviceText}>{item.name} ({item.address})</Text>
        </Pressable>
    );

    return (
        <Modal
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
            animationType="none"
        >
            <View style={styles.overlay}>
                <Animated.View style={[styles.modalContainer, { transform: [{ translateY: slideUp }], opacity: fadeIn }]}>
                    <View style={styles.header}>
                        <Text style={styles.headerText}>Probar Peluche</Text>
                        <Pressable onPress={onClose} style={styles.closeButton}>
                            <MaterialIcons name="close" size={24} color="#0B5A39" />
                        </Pressable>
                    </View>

                    {showDeviceList && !isConnected && (
                        <View style={styles.deviceListContainer}>
                            <Text style={styles.deviceListTitle}>Dispositivos Emparejados</Text>
                            {pairedDevices.length > 0 ? (
                                <FlatList
                                    data={pairedDevices}
                                    renderItem={renderDeviceItem}
                                    keyExtractor={(item) => item.address}
                                    style={styles.deviceList}
                                />
                            ) : (
                                <Text style={styles.noDevicesText}>No se encontraron dispositivos emparejados.</Text>
                            )}
                        </View>
                    )}

                    <View style={styles.buttonContainer}>
                        <Pressable
                            style={[styles.testButton, isConnecting && { opacity: 0.5 }]}
                            onPress={handleToggleConnection}
                            disabled={isConnecting}
                        >
                            <Text style={styles.buttonText}>
                                {isConnecting ? 'Conectando...' : isConnected ? 'Desconectar' : 'Seleccionar Dispositivo'}
                            </Text>
                        </Pressable>
                        <Pressable 
                            style={[styles.testButton, !isConnected && { opacity: 0.5 }]} 
                            onPress={handleToggleLEDs} 
                            disabled={!isConnected}
                        >
                            <Text style={styles.buttonText}>Cambiar Color LED</Text>
                        </Pressable>
                        <Pressable 
                            style={[styles.testButton, !isConnected && { opacity: 0.5 }]} 
                            onPress={handleToggleVibration}
                            disabled={!isConnected}
                        >
                            <Text style={styles.buttonText}>
                                {isVibrating ? 'Apagar Vibración' : 'Activar Vibración'}
                            </Text>
                        </Pressable>
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
};

export default PlushieModal;