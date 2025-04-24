import React from 'react';
import { Pressable, Text } from 'react-native';
import { RegisterStyles } from '../../../styles/UserAuthenticationStyles/RegisterStyles';

const PressableButton = ({ onPress, disabled, text, style, textStyle, pressedColor, defaultColor }) => (
    <Pressable
        style={({ pressed }) => [
            {
                backgroundColor: pressed ? (pressedColor || '#1f8a83') : (defaultColor || '#239790'),
            },
            RegisterStyles.button,
            style,
        ]}
        onPress={onPress}
        disabled={disabled}
    >
        <Text style={[RegisterStyles.buttonText, textStyle]}>{text}</Text>
    </Pressable>
);

export default PressableButton;