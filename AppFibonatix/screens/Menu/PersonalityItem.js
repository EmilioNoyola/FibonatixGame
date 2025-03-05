// Componentes de React.
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

// Animaciones
import Animated, { useSharedValue, useAnimatedProps, withTiming } from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

// Definimos las constantes de tamaño
const SVG_SIZE = 155;            // Tamaño total del SVG (ancho y alto)
const RADIUS = 60;               // Radio del círculo de progreso
const STROKE_WIDTH = 10;         // Ancho del trazo de la barra
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * RADIUS; // Perímetro del círculo (para strokeDasharray)

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function PersonalityItem({ name, image, progress, color, scale = 1 }) {
    const animatedProgress = useSharedValue(0);

    useEffect(() => {
        animatedProgress.value = withTiming(progress, { duration: 1000 });
    }, [progress]);

    const animatedProps = useAnimatedProps(() => ({
        // Calcula el offset en función del porcentaje completado
        strokeDashoffset: CIRCLE_CIRCUMFERENCE - (CIRCLE_CIRCUMFERENCE * animatedProgress.value) / 100,
    }));

    return (
        // Usamos un Animated.View para poder escalar el componente completo
        <Animated.View style={[styles.container, { transform: [{ scale }] }]}>
            <View style={styles.progressContainer}>
                <Svg width={SVG_SIZE} height={SVG_SIZE} viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}>
                    {/* Fondo de la barra circular */}
                    <Circle
                        cx={SVG_SIZE / 2}
                        cy={SVG_SIZE / 2}
                        r={RADIUS}
                        stroke="#E0E0E0"
                        strokeWidth={STROKE_WIDTH}
                        fill="none"
                    />
                    {/* Barra de progreso animada */}
                    <AnimatedCircle
                        cx={SVG_SIZE / 2}
                        cy={SVG_SIZE / 2}
                        r={RADIUS}
                        stroke={color}
                        strokeWidth={STROKE_WIDTH}
                        fill="none"
                        strokeDasharray={CIRCLE_CIRCUMFERENCE}
                        animatedProps={animatedProps}
                        strokeLinecap="round"
                    />
                </Svg>
                <View style={styles.imageContainer}>
                    <Image source={image} style={styles.image} />
                </View>
            </View>
            <Text style={styles.progressText}>{progress}%</Text>
            <Text style={styles.name}>{name}</Text>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "45%",
        alignItems: "center",
        marginBottom: 20,
    },
    progressContainer: {
        width: SVG_SIZE,
        height: SVG_SIZE,
        justifyContent: "center",
        alignItems: "center",
    },
    imageContainer: {
        position: "absolute",
        width: 110,       // Ajusta este valor para que el círculo blanco sea más pequeño y deje ver la barra de progreso
        height: 110,
        borderRadius: 55,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        width: 70,        // Tamaño de la imagen interna (puedes ajustarlo)
        height: 70,
        resizeMode: "contain",
    },
    progressText: {
        fontSize: 16,
        marginTop: -35,
        backgroundColor: '#E0E0E0',
        padding: 5,
        borderRadius: 10,
        fontFamily: "Quicksand",
    },
    name: {
        fontSize: 20,
        fontFamily: "Quicksand",
        textAlign: "center",
        marginTop: 5,
    },
});
