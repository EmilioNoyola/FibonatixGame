// Componente para manejar el botón de confirmación de autenticación.
import React from 'react';
import { Pressable, Text, Animated } from 'react-native';
import { RegisterStyles } from '../../../styles/UserAuthenticationStyles/RegisterStyles';

const PressableButton = ({ onPress, disabled, text, style, textStyle, pressedColor, defaultColor }) => {
    const scale = new Animated.Value(1);

    const handlePressIn = () => {
        Animated.spring(scale, {
            toValue: 0.95,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scale, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
    };

    return (
        <Pressable
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={disabled}
        >
            <Animated.View
                style={[
                    RegisterStyles.button,
                    {
                        backgroundColor: defaultColor || '#239790',
                        transform: [{ scale }],
                    },
                    style,
                ]}
            >
                <Text style={[RegisterStyles.buttonText, textStyle]}>{text}</Text>
            </Animated.View>
        </Pressable>
    );
};

export default PressableButton;