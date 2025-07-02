// Animación de las barras ( Entretenimiento, Alimentación y Sueño ).
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, View } from 'react-native';

const AnimatedBar = ({ percentage, barStyle, containerStyle }) => {
    const barWidth = useRef(new Animated.Value(percentage * 2.5)).current;

    useEffect(() => {
        Animated.timing(barWidth, {
            toValue: percentage * 2.5,
            duration: 1000,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: false,
        }).start();
    }, [percentage]);

    return (
        <View style={containerStyle}>
            <Animated.View style={[barStyle, { width: barWidth }]} />
        </View>
    );
};

export default AnimatedBar;