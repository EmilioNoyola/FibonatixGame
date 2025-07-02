import React, { useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import Animated, { useSharedValue, useAnimatedProps, withTiming } from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { styles } from './BedroomStyles';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function PersonalityItem({ name, image, progress, color, scale = 1 }) {
    const animatedProgress = useSharedValue(0);

    useEffect(() => {
        animatedProgress.value = withTiming(progress, { duration: 1000 });
    }, [progress]);

    const animatedProps = useAnimatedProps(() => ({
        strokeDashoffset: styles.CIRCLE_CIRCUMFERENCE - (styles.CIRCLE_CIRCUMFERENCE * animatedProgress.value) / 100,
    }));

    return (
        <Animated.View style={[styles.personalityContainer, { transform: [{ scale }] }]}>
            <View style={styles.progressContainer}>
                <Svg width={styles.SVG_SIZE} height={styles.SVG_SIZE} viewBox={`0 0 ${styles.SVG_SIZE} ${styles.SVG_SIZE}`}>
                    <Circle
                        cx={styles.SVG_SIZE / 2}
                        cy={styles.SVG_SIZE / 2}
                        r={styles.RADIUS}
                        stroke="#E0E0E0"
                        strokeWidth={styles.STROKE_WIDTH}
                        fill="none"
                    />
                    <AnimatedCircle
                        cx={styles.SVG_SIZE / 2}
                        cy={styles.SVG_SIZE / 2}
                        r={styles.RADIUS}
                        stroke={color}
                        strokeWidth={styles.STROKE_WIDTH}
                        fill="none"
                        strokeDasharray={styles.CIRCLE_CIRCUMFERENCE}
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