import React, { useEffect, useState } from 'react';
import { Modal, View, Text, Pressable, Animated, Easing } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { styles } from './PlushieModalStyles';
import { plushieService } from '../../../../assets/services/PlushieService';

const PlushieModal = ({ visible, onClose }) => {
    const slideUp = useState(new Animated.Value(300))[0];
    const fadeIn = useState(new Animated.Value(0))[0];

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

    const handleTestLEDs = () => {
        console.log('Probando LEDs...');
        // plushieService.testLEDs();
    };

    const handleTestVibration = () => {
        console.log('Probando motores de vibración...');
        // plushieService.testVibration();
    };

    const handleTestFSR = () => {
        console.log('Probando sensor FSR...');
        // plushieService.testFSR();
    };

    const handleTestIMU = () => {
        console.log('Probando IMU MPU6050...');
        // plushieService.testIMU();
    };

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

                    <View style={styles.buttonContainer}>
                        <Pressable style={styles.testButton} onPress={handleTestLEDs}>
                            <Text style={styles.buttonText}>Probar LEDs</Text>
                        </Pressable>
                        <Pressable style={styles.testButton} onPress={handleTestVibration}>
                            <Text style={styles.buttonText}>Probar Vibración</Text>
                        </Pressable>
                        <Pressable style={styles.testButton} onPress={handleTestFSR}>
                            <Text style={styles.buttonText}>Probar Sensor FSR</Text>
                        </Pressable>
                        <Pressable style={styles.testButton} onPress={handleTestIMU}>
                            <Text style={styles.buttonText}>Probar IMU</Text>
                        </Pressable>
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
};

export default PlushieModal;