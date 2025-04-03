import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
import { Animated } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from "react-native-safe-area-context";

// Componente para renderizar el círculo de fracción
const FractionCircle = ({ num, denom }) => {
  const angle = (num / denom) * 360;
  const largeArc = angle > 180 ? 1 : 0;
  const radius = 40;
  const cx = 50;
  const cy = 50;
  const x = cx + radius * Math.cos((angle - 90) * (Math.PI / 180));
  const y = cy + radius * Math.sin((angle - 90) * (Math.PI / 180));

  return (
    <Svg width={100} height={100} viewBox="0 0 100 100">
      {/* Círculo en el fondo */}
      <Circle cx="50" cy="50" r={radius} fill="#E2D7F7" stroke="black" strokeWidth="2" />
      {/* Color que representa la fracción */}
      <Path
        d={`M 50,50 L 50,${50 - radius} A ${radius},${radius} 0 ${largeArc},1 ${x},${y} Z`}
        fill="#5F06ED"
      />
      {/* Dividir el círculo en fracciones */}
      {[...Array(denom)].map((_, i) => {
        const angle = (i / denom) * 360;
        const x = cx + radius * Math.cos((angle - 90) * (Math.PI / 180));
        const y = cy + radius * Math.sin((angle - 90) * (Math.PI / 180));
        return <Path key={i} d={`M50,50 L${x},${y}`} stroke="black" strokeWidth="2" />;
      })}
    </Svg>
  );
};

// Función auxiliar para barajar arrays
const shuffleArray = (array) => {
  return array
    .map(item => ({ item, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ item }) => item);
};

// Definición de niveles del juego
const GAME_LEVELS = {
  1: {
    fractions: [
      { num: 1, denom: 4, id: 0 },
      { num: 1, denom: 2, id: 1 },
      { num: 2, denom: 3, id: 2 },
      { num: 3, denom: 4, id: 3 },
      { num: 1, denom: 6, id: 4 },
      { num: 5, denom: 9, id: 5 },
      { num: 2, denom: 5, id: 6 },
      { num: 3, denom: 8, id: 7 },
      { num: 1, denom: 8, id: 8 },
    ],
    images: [
      { id: 0, image: 'https://i.imgur.com/mNXPZ8B.png' },
      { id: 1, image: 'https://i.imgur.com/XcJAK2u.png' },
      { id: 2, image: 'https://i.imgur.com/9fLVG5Z.png' },
      { id: 3, image: 'https://i.imgur.com/jPHXjYD.png' },
      { id: 4, image: 'https://i.imgur.com/dBKnLPq.png' },
      { id: 5, image: 'https://i.imgur.com/GVY7YyS.png' },
      { id: 6, image: 'https://i.imgur.com/7Qw3KDj.png' },
      { id: 7, image: 'https://i.imgur.com/mBPuPfL.png' },
      { id: 8, image: 'https://i.imgur.com/ZN3hQlW.png' },
    ],
    colorScheme: {
      mainColor: '#563B88',
      buttonColor: '#7A65FB',
      backgroundColor: '#CDC1FF',
    }
  },
  2: {
    fractions: [
      { num: 1, denom: 3, id: 0 },
      { num: 2, denom: 5, id: 1 },
      { num: 3, denom: 4, id: 2 },
      { num: 1, denom: 6, id: 3 },
      { num: 4, denom: 5, id: 4 },
      { num: 2, denom: 6, id: 5 },
      { num: 5, denom: 8, id: 6 },
      { num: 3, denom: 5, id: 7 },
      { num: 7, denom: 8, id: 8 },
    ],
    images: [
      { id: 0, image: 'https://i.imgur.com/QdZ5fpL.png' },
      { id: 1, image: 'https://i.imgur.com/LyJzPIZ.png' },
      { id: 2, image: 'https://i.imgur.com/87xUe0c.png' },
      { id: 3, image: 'https://i.imgur.com/9VlXbR8.png' },
      { id: 4, image: 'https://i.imgur.com/dKPJ29A.png' },
      { id: 5, image: 'https://i.imgur.com/mJzYkYw.png' },
      { id: 6, image: 'https://i.imgur.com/KsL6pj7.png' },
      { id: 7, image: 'https://i.imgur.com/DXu8Dv2.png' },
      { id: 8, image: 'https://i.imgur.com/Ptq8jFc.png' },
    ],
    colorScheme: {
      mainColor: '#563B88',
      buttonColor: '#7A65FB',
      backgroundColor: '#CDC1FF',
    }
  },
  3: {
    fractions: [
      { num: 3, denom: 10, id: 0 },
      { num: 1, denom: 5, id: 1 },
      { num: 5, denom: 12, id: 2 },
      { num: 2, denom: 7, id: 3 },
      { num: 3, denom: 7, id: 4 },
      { num: 4, denom: 9, id: 5 },
      { num: 5, denom: 6, id: 6 },
      { num: 3, denom: 5, id: 7 },
      { num: 7, denom: 10, id: 8 },
    ],
    images: [
      { id: 0, image: 'https://i.imgur.com/6qzUmx0.png' },
      { id: 1, image: 'https://i.imgur.com/RCNd5iw.png' },
      { id: 2, image: 'https://i.imgur.com/OmvNUt9.png' },
      { id: 3, image: 'https://i.imgur.com/8LCmL7K.png' },
      { id: 4, image: 'https://i.imgur.com/vYbKLqR.png' },
      { id: 5, image: 'https://i.imgur.com/oZ8QdL3.png' },
      { id: 6, image: 'https://i.imgur.com/9jgwLyY.png' },
      { id: 7, image: 'https://i.imgur.com/Dh0jPJW.png' },
      { id: 8, image: 'https://i.imgur.com/u1N7WdZ.png' },
    ],
    colorScheme: {
      mainColor: '#563B88',
      buttonColor: '#7A65FB',
      backgroundColor: '#CDC1FF',
    }
  },
  4: {
    fractions: [
      { num: 1, denom: 10, id: 0 },
      { num: 3, denom: 8, id: 1 },
      { num: 4, denom: 6, id: 2 },
      { num: 5, denom: 10, id: 3 },
      { num: 2, denom: 4, id: 4 },
      { num: 6, denom: 9, id: 5 },
      { num: 4, denom: 8, id: 6 },
      { num: 2, denom: 8, id: 7 },
      { num: 9, denom: 10, id: 8 },
    ],
    images: [
      { id: 0, image: 'https://i.imgur.com/1Sz8BVJ.png' },
      { id: 1, image: 'https://i.imgur.com/Xk3f2P4.png' },
      { id: 2, image: 'https://i.imgur.com/zPP9Ksd.png' },
      { id: 3, image: 'https://i.imgur.com/W3H4LaF.png' },
      { id: 4, image: 'https://i.imgur.com/8y1qGrJ.png' },
      { id: 5, image: 'https://i.imgur.com/0HxzVr1.png' },
      { id: 6, image: 'https://i.imgur.com/PqZFMzF.png' },
      { id: 7, image: 'https://i.imgur.com/JGkZx9B.png' },
      { id: 8, image: 'https://i.imgur.com/OPLUofC.png' },
    ],
    colorScheme: {
      mainColor: '#563B88',
      buttonColor: '#7A65FB',
      backgroundColor: '#CDC1FF',
    }
  },
  5: {
    fractions: [
      { num: 1, denom: 12, id: 0 },
      { num: 5, denom: 8, id: 1 },
      { num: 7, denom: 12, id: 2 },
      { num: 2, denom: 10, id: 3 },
      { num: 6, denom: 10, id: 4 },
      { num: 7, denom: 8, id: 5 },
      { num: 3, denom: 6, id: 6 },
      { num: 11, denom: 12, id: 7 },
      { num: 9, denom: 12, id: 8 },
    ],
    images: [
      { id: 0, image: 'https://i.imgur.com/SkBpuYF.png' },
      { id: 1, image: 'https://i.imgur.com/N5VMXaM.png' },
      { id: 2, image: 'https://i.imgur.com/JLG0w1F.png' },
      { id: 3, image: 'https://i.imgur.com/f8JvDz1.png' },
      { id: 4, image: 'https://i.imgur.com/UyFgn6i.png' },
      { id: 5, image: 'https://i.imgur.com/YeHbHfS.png' },
      { id: 6, image: 'https://i.imgur.com/VQb7cFT.png' },
      { id: 7, image: 'https://i.imgur.com/kAYV72G.png' },
      { id: 8, image: 'https://i.imgur.com/FPTYjAa.png' },
    ],
    colorScheme: {
      mainColor: '#563B88',
      buttonColor: '#7A65FB',
      backgroundColor: '#CDC1FF',
    }
  },
  6: {
    fractions: [
      { num: 4, denom: 12, id: 0 },
      { num: 5, denom: 6, id: 1 },
      { num: 3, denom: 12, id: 2 },
      { num: 8, denom: 12, id: 3 },
      { num: 7, denom: 9, id: 4 },
      { num: 5, denom: 12, id: 5 },
      { num: 8, denom: 10, id: 6 },
      { num: 4, denom: 5, id: 7 },
      { num: 10, denom: 12, id: 8 },
    ],
    images: [
      { id: 0, image: 'https://i.imgur.com/ecTK0LP.png' },
      { id: 1, image: 'https://i.imgur.com/RNdKKA9.png' },
      { id: 2, image: 'https://i.imgur.com/C2sHU3I.png' },
      { id: 3, image: 'https://i.imgur.com/PF1fJdW.png' },
      { id: 4, image: 'https://i.imgur.com/cL0Wfov.png' },
      { id: 5, image: 'https://i.imgur.com/XQWcBn5.png' },
      { id: 6, image: 'https://i.imgur.com/Hxwv20A.png' },
      { id: 7, image: 'https://i.imgur.com/G8Yjc6u.png' },
      { id: 8, image: 'https://i.imgur.com/zVnXlGY.png' },
    ],
    colorScheme: {
      mainColor: '#563B88',
      buttonColor: '#7A65FB',
      backgroundColor: '#CDC1FF',
    }
  }
};

const GameLevel = ({ route }) => {
  const { levelNumber } = route.params;
  const navigation = useNavigation();
  
  // Obtener la configuración del nivel actual
  const currentLevelConfig = GAME_LEVELS[levelNumber] || GAME_LEVELS[1];
  const { fractions, images, colorScheme } = currentLevelConfig;
  
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [correct, setCorrect] = useState([]);
  const [positions, setPositions] = useState(Array(9).fill(undefined));
  const [currentFractionIndex, setCurrentFractionIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [borderColors, setBorderColors] = useState(Array(9).fill("black"));
  const [shuffledImages, setShuffledImages] = useState([]);
  const [pulseAnimation] = useState(new Animated.Value(0));

  // Barajar imágenes al cargar el componente
  useEffect(() => {
    setShuffledImages(shuffleArray(images));
  }, []);

  // Animación de pulso cuando se completa el nivel
  useEffect(() => {
    if (completed) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnimation, {
            toValue: 1,
            duration: 500,
            useNativeDriver: false,
          }),
          Animated.timing(pulseAnimation, {
            toValue: 0,
            duration: 500,
            useNativeDriver: false,
          }),
        ])
      ).start();
    }
  }, [completed, pulseAnimation]);

  // Reiniciar todos los estados cuando cambia el nivel
    useEffect(() => {
        setPositions(Array(9).fill(undefined));
        setCorrect([]);
        setBorderColors(Array(9).fill("black"));
        setCurrentFractionIndex(0);
        setSelectedPosition(null);
        setCompleted(false);
        setShuffledImages(shuffleArray(images));
    }, [levelNumber, images]);

  const currentImage = shuffledImages[currentFractionIndex] || {};
  const currentFraction = fractions.find(frac => frac.id === currentImage?.id) || {};

  const handleSelectPosition = (index) => {
    if (selectedPosition !== null) return; // No permitir seleccionar más de un espacio a la vez
    setSelectedPosition(index);

    // Si el espacio seleccionado es correcto
    if (fractions[index].id === currentFraction.id) {
      setPositions(prev => {
        const updated = [...prev];
        updated[index] = currentImage.id;
        return updated;
      });
      setCorrect(prev => [...prev, index]);
      
      // Cambiar el borde de la celda seleccionada a verde
      setBorderColors(prev =>
        prev.map((color, i) => (i === index ? "green" : color))
      );
    
      setTimeout(() => {
        if (currentFractionIndex + 1 < fractions.length) {
          setCurrentFractionIndex(currentFractionIndex + 1);
          setSelectedPosition(null);
          setBorderColors(Array(9).fill("black"));
        } else {
          setCompleted(true);
      
          // Desbloquear siguiente nivel
          const nextLevel = levelNumber + 1;
          if (nextLevel <= Object.keys(GAME_LEVELS).length) {
            AsyncStorage.getItem('@unlocked_levels')
              .then(storedLevels => {
                let levels = storedLevels ? JSON.parse(storedLevels) : [1];
                if (!levels.includes(nextLevel)) {
                  levels.push(nextLevel);
                  AsyncStorage.setItem('@unlocked_levels', JSON.stringify(levels));
                }
              })
              .catch(error => console.error('Error al guardar el nivel desbloqueado:', error));
          
            // Navegar al siguiente nivel después de 2 segundos
            setTimeout(() => {
                setCompleted(false); // Reiniciar el estado completed
                if (nextLevel <= Object.keys(GAME_LEVELS).length) {
                navigation.replace('GameLevel', { levelNumber: nextLevel });
                } else {
                // Si es el último nivel, volver a la pantalla de selección
                Alert.alert(
                    '¡Felicidades!', 
                    'Has completado todos los niveles del juego.',
                    [{ text: 'OK', onPress: () => navigation.navigate('Levels') }]
                );
                }
            }, 2000);
          }
        }
      }, 500);
    } else {
      // Si la selección es incorrecta, cambiar el borde a rojo
      setBorderColors(prev =>
        prev.map((color, i) => (i === index ? "red" : color))
      );
      
      // Reiniciar el juego después de un error
      setTimeout(() => {
        setPositions(Array(9).fill(undefined));
        setCorrect([]);
        setBorderColors(Array(9).fill("black"));
        setCurrentFractionIndex(0);
        setSelectedPosition(null);
        setShuffledImages(shuffleArray(images));
      }, 1000);
    }
  };

  // Función para reiniciar el juego
  const handleResetGame = () => {
    setPositions(Array(9).fill(undefined));
    setCorrect([]);
    setBorderColors(Array(9).fill("black"));
    setCurrentFractionIndex(0);
    setSelectedPosition(null);
    setShuffledImages(shuffleArray(images));
    setCompleted(false);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: "#EEE4FF" }]}>
      <View style={[styles.topBar, { backgroundColor: colorScheme.backgroundColor }]}>
        <Text style={[styles.titleText, { color: colorScheme.mainColor, fontFamily: 'Quicksand' }]}>
          ROMPEFRACCIONES
        </Text>
        <View style={styles.topControls}>
          <TouchableOpacity style={styles.topButton} onPress={handleResetGame}>
            <Ionicons name="reload-circle" size={50} color={colorScheme.mainColor} />
          </TouchableOpacity>

          <View style={[styles.levelContainer, { backgroundColor: colorScheme.mainColor }]}>
            <Text style={[styles.levelText, { fontFamily: 'Quicksand' }]}>
              NVL. {levelNumber}
            </Text>
          </View>

          <TouchableOpacity style={styles.topButton} onPress={() => navigation.navigate('Levels')}>
            <MaterialCommunityIcons name="exit-to-app" size={52} color={colorScheme.mainColor} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.gameContainer, { backgroundColor: colorScheme.backgroundColor }]}>
        <Text style={[styles.title, { fontFamily: 'Quicksand_SemiBold' }]}>
          Selecciona la fracción:
        </Text>
        <Text style={[styles.fractionText, { fontFamily: 'Quicksand_Medium' }]}>
          {currentFraction?.num ? `${currentFraction.num}/${currentFraction.denom}` : "Cargando..."}
        </Text>
        <Text style={[styles.fractionText, { fontFamily: 'Quicksand_Medium' }]}>
          Selecciona el espacio correcto para la imagen
        </Text>
        
        {/* Caja animada para el borde */}
        <Animated.View
          style={[
            styles.gridWrapper,
            {
              borderColor: completed ? "yellow" : "black",
              borderWidth: 4,
              transform: [{
                scale: pulseAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.05],
                })
              }],
            },
          ]}
        >
          {/* La tabla con las fracciones */}
          <View style={styles.grid}>
            {fractions.map((frac, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.cell, { borderColor: borderColors[index] }]}
                onPress={() => handleSelectPosition(index)}
                disabled={positions[index] !== undefined}
              >
                <View style={styles.imageContainer}>
                  <FractionCircle num={frac.num} denom={frac.denom} />
                </View>
                {positions[index] !== undefined && (
                  <View style={styles.positionedImage}>
                    <Image 
                      source={{ uri: images.find(img => img.id === positions[index])?.image }} 
                      style={styles.image} 
                    />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
        
        {currentImage && !completed && (
          <View style={styles.imageContainerBottom}>
            <Image source={{ uri: currentImage.image }} style={styles.image} />
          </View>
        )}
        
        {completed && (
          <Text style={[styles.correctText, { fontFamily: 'Quicksand_Bold' }]}>
            ¡Completado!
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EEE4FF",
  },
  topBar: {
    backgroundColor: '#CDC1FF',
    borderRadius: 30,
    marginHorizontal: 15,
    paddingVertical: 15,
    alignItems: 'center',
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
  },
  titleText: {
    fontSize: 24,
    color: '#563B88',
    marginBottom: 10,
  },
  levelContainer: {
    backgroundColor: '#563B88',
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 90,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelText: {
    fontSize: 18,
    color: '#EEE4FF',
    textAlign: 'center',
  },
  gameContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#CDC1FF",
    borderRadius: 27,
    margin: 15,
    padding: 5,
  },
  title: {
    fontSize: 22,
  },
  fractionText: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
  grid: {
    width: 350,
    height: 348,
    flexDirection: "row",
    flexWrap: "wrap",
    borderWidth: 2,
    borderColor: "#563B88",
  },
  cell: {
    width: "33.33%",
    height: "33.37%",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: "#563B88",
  },
  imageContainer: {
    width: 100,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
  },
  positionedImage: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 112,
    height: 112,
    resizeMode: "contain",
  },
  imageContainerBottom: {
    alignItems: "center",
    justifyContent: "center",
  },
  correctText: {
    color: "green",
    fontWeight: "bold",
    marginTop: 20,
    fontSize: 24,
  },
  gridWrapper: {
    width: 358,
    height: 356,
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  topButton: {
    padding: 5,
  },
});

export default GameLevel;