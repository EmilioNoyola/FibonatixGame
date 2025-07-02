// Alertas sobre el estado de la mascota.
import React, { useRef, useEffect } from 'react';
import LottieView from 'lottie-react-native';
import { Modal, View, Text, StyleSheet, Pressable } from 'react-native';

const StatusAlertModal = ({ visible, type, onClose }) => {
    const animationRef = useRef(null);
    const hasShown = useRef(false);

    useEffect(() => {
        if (visible && !hasShown.current) {
        hasShown.current = true;
        if (animationRef.current) {
            animationRef.current.play();
        }
        } else if (!visible) {
        hasShown.current = false;
        }
    }, [visible]);

    const getConfig = () => {
        switch(type) {
        case 'game':
            return {
            color: '#FF0000',
            animation: require('../../assets/lottie/sad-face.json'),
            message: '¡Tu mascota necesita jugar!'
            };
        case 'food':
            return {
            color: '#FFA500',
            animation: require('../../assets/lottie/sad-face.json'),
            message: '¡Tu mascota tiene hambre!'
            };
        case 'sleep':
            return {
            color: '#0000FF',
            animation: require('../../assets/lottie/sad-face.json'),
            message: '¡Tu mascota tiene sueño!'
            };
        default:
            return {
            color: '#000000',
            animation: require('../../assets/lottie/sad-face.json'),
            message: '¡Alerta!'
            };
        }
    };

    const config = getConfig();

    return (
    <Modal 
        transparent={true} 
        visible={visible} 
        animationType="fade"
        onRequestClose={onClose}
        onShow={() => {
            if (animationRef.current) {
            animationRef.current.play();
            }
        }}
        >
        <Pressable style={styles.overlay} onPress={onClose}>
            <View style={[styles.container, { backgroundColor: config.color }]}>
            <LottieView
                ref={animationRef}
                source={config.animation}
                loop={false}
                style={styles.animation}
                onAnimationFinish={onClose}
            />
            <Text style={styles.message}>{config.message}</Text>
            </View>
        </Pressable>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    container: {
        width: '80%',
        padding: 20,
        borderRadius: 15,
        alignItems: 'center',
    },
    animation: {
        width: 150,
        height: 150,
    },
    message: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
        textAlign: 'center',
    },
});

export default StatusAlertModal;