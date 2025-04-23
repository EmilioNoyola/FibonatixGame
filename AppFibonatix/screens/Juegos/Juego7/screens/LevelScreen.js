import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, Alert, StyleSheet, Pressable, ScrollView } from "react-native";
import { Ionicons, MaterialCommunityIcons } from 'react-native-vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from "react-native-safe-area-context";
import { foods, levels } from "./levelData";

// Importa las fuentes personalizadas
import useCustomFonts from "../../../../assets/apis/FontsConfigure";

export default function LevelScreen({ route, navigation }) {
  const { levelId } = route.params;
  const levelData = levels.find(level => level.id === levelId);
  const [selected, setSelected] = useState([]);
  const [round, setRound] = useState(0);
  const [displayedFoods, setDisplayedFoods] = useState([]);
  const [feedback, setFeedback] = useState({});
  const currentRound = levelData.rounds[round];
  
  // Carga de fuentes personalizadas
  const { fontsLoaded, onLayoutRootView } = useCustomFonts();
  if (!fontsLoaded) return null;

  const getRandomFoods = () => {
    const levelFoods = foods[levelData.foodsKey];
    const shuffledFoods = [...levelFoods].sort(() => 0.5 - Math.random());
    const requiredType = currentRound.type;
    const filterCondition = currentRound.filter;
  
    // Filtra alimentos correctos basados en tipo y/o condición de filtro
    let correctFoods = shuffledFoods;
    
    if (requiredType) {
      correctFoods = correctFoods.filter(food =>
        Array.isArray(requiredType) ? requiredType.includes(food.type) : food.type === requiredType
      );
    }
  
    if (filterCondition) {
      correctFoods = correctFoods.filter(filterCondition);
    }
  
    // Asegúrate de que haya al menos 2 alimentos correctos
    let atLeastTwo = correctFoods.slice(0, 2);
    if (atLeastTwo.length < 2) {
      console.warn("No hay suficientes alimentos que cumplan los criterios");
      // Añadir más alimentos correctos si es posible
      const remainingCorrectFoods = shuffledFoods.filter(food => !atLeastTwo.includes(food))
        .filter(food => 
          (requiredType ? (Array.isArray(requiredType) ? requiredType.includes(food.type) : food.type === requiredType) : true) &&
          (!filterCondition || filterCondition(food))
        ).slice(0, 2 - atLeastTwo.length);
        
      atLeastTwo = [...atLeastTwo, ...remainingCorrectFoods];
    }
  
    // Completa con alimentos incorrectos
    const incorrectFoods = shuffledFoods.filter(food => {
      const typeMatch = requiredType ? 
        (Array.isArray(requiredType) ? !requiredType.includes(food.type) : food.type !== requiredType) : 
        true;
      const filterMatch = filterCondition ? !filterCondition(food) : true;
      return (typeMatch || filterMatch) && !atLeastTwo.includes(food);
    }).slice(0, levelData.itemsPerRound - atLeastTwo.length);
  
    // Mezcla alimentos correctos e incorrectos
    const finalFoods = [...atLeastTwo, ...incorrectFoods].sort(() => 0.5 - Math.random());
  
    return finalFoods;
  };
  
  useEffect(() => {
    setDisplayedFoods(getRandomFoods());
  }, [round]);

  const handleSelect = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((item) => item !== id));
    } else {
      setSelected([...selected, id]);
    }
    setFeedback({});
  };

  const checkSelection = () => {
    let newFeedback = {};
    const correctSelections = displayedFoods
      .filter(food => {
        const typeMatch = currentRound.type ? 
          (Array.isArray(currentRound.type) ? currentRound.type.includes(food.type) : food.type === currentRound.type) : 
          true;
        const filterMatch = currentRound.filter ? currentRound.filter(food) : true;
        return typeMatch && filterMatch;
      })
      .map(food => food.id);
  
    selected.forEach(id => {
      newFeedback[id] = correctSelections.includes(id) ? "green" : "red";
    });
  
    setFeedback(newFeedback);
  
    const allCorrect = selected.every(id => correctSelections.includes(id)) && selected.length === correctSelections.length;
  
    if (allCorrect) {
      setTimeout(() => {
        if (round < levelData.rounds.length - 1) {
          nextRound();
        } else {
          // Nivel completado, desbloquear siguiente nivel
          unlockNextLevel();
        }
      }, 1000);
    } else {
      setTimeout(() => {
        setSelected([]);
        setFeedback({});
      }, 1000);
    }
  };

  const unlockNextLevel = async () => {
    if (levelData.nextLevel) {
      try {
        // Obtener niveles desbloqueados actuales
        const storedLevels = await AsyncStorage.getItem('@unlocked_levels');
        let unlockedLevels = storedLevels ? JSON.parse(storedLevels) : [1];
        
        // Añadir siguiente nivel si no está ya desbloqueado
        if (!unlockedLevels.includes(levelData.nextLevel)) {
          unlockedLevels.push(levelData.nextLevel);
          await AsyncStorage.setItem('@unlocked_levels', JSON.stringify(unlockedLevels));
        }
        
        // Mostrar alerta de nivel completado
        Alert.alert(
          "¡Felicidades!",
          `Has completado el ${levelData.title}. ¿Qué deseas hacer?`,
          [
            {
              text: "Salir a niveles",
              onPress: () => navigation.navigate("Levels"),
            },
            levelData.nextLevel ? {
              text: levelData.nextLevelName,
              onPress: () => navigation.navigate("LevelScreen", { levelId: levelData.nextLevel }),
            } : null,
          ].filter(Boolean),
          { cancelable: false }
        );
      } catch (error) {
        console.error('Error al desbloquear el siguiente nivel:', error);
        Alert.alert("Error", "No se pudo guardar tu progreso.");
      }
    } else {
      // Si es el último nivel
      Alert.alert(
        "¡Felicidades!",
        "¡Has completado todos los niveles del juego!",
        [
          {
            text: "Volver a niveles",
            onPress: () => navigation.navigate("Levels"),
          }
        ],
        { cancelable: false }
      );
    }
  };

  const nextRound = () => {
    setSelected([]);
    setFeedback({});
    setRound(round + 1);
  };
  
  const restartLevel = () => {
    setRound(0);
    setSelected([]);
    setFeedback({});
    setDisplayedFoods(getRandomFoods());
  };

  return (
    <SafeAreaView style={styles.container} onLayout={onLayoutRootView}>
      <View style={styles.topBar}>
        <Text style={styles.titleText}>TORTUGA ALIMENTICIA</Text>
        <View style={styles.topControls}>
          <TouchableOpacity style={styles.topButton} onPress={restartLevel}>
            <Ionicons name="reload-circle" size={40} color="#2FBB2F" />
          </TouchableOpacity>
          <View style={styles.levelContainer}>
            <Text style={styles.levelText}>NVL. {levelData.id}</Text>
          </View>
          <TouchableOpacity
            style={styles.topButton}
            onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Levels' }] })}
          >
            <MaterialCommunityIcons name="exit-to-app" size={42} color="#2FBB2F" />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.roundContainer}>
        <Text style={styles.roundText}>Ronda {round + 1}</Text> 
        <Text style={styles.title}>{currentRound.title}</Text>
      </View>
      
      <View style={styles.greenBackground}>
        <ScrollView
          contentContainerStyle={styles.grid}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {displayedFoods.map((food) => (
            <TouchableOpacity
              key={food.id}
              style={[ 
                styles.item,
                selected.includes(food.id) && { borderColor: "blue", backgroundColor: "#9DDAFB" },
                feedback[food.id] && { 
                  borderColor: feedback[food.id], 
                  backgroundColor: feedback[food.id] === "red" ? "#F88787" : "#13FF52" 
                }
              ]}
              onPress={() => handleSelect(food.id)}
            >
              <Image 
                source={{ uri: food.image }} 
                style={styles.image} 
                defaultSource={require('../../../../assets/img/tortuga.png')} // Asegúrate de tener una imagen de placeholder
              />
              <Text style={styles.itemText}>{food.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      <View style={styles.buttonContainer}>
        <Pressable style={styles.button} onPress={checkSelection}>
          <Text style={styles.buttonText}>Verificar</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#C0F8BC",
    },
    topBar: {
      backgroundColor: '#90F0A5',
      borderRadius: 30,
      alignItems: 'center',
      paddingVertical: 20,
      marginHorizontal: 15,
    },
    topControls: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      gap: 15,
    },
    titleText: {
      fontSize: 24,
      color: '#2FBB2F',
      marginBottom: 10,
      fontFamily: 'Quicksand'
    },
    levelContainer: {
      backgroundColor: '#2FBB2F',
      width: 90,
      height: 46,
      borderRadius: 90,
      alignItems: 'center',
      justifyContent: 'center',
    },
    levelText: {
      fontSize: 18,
      color: '#C3F1C0',
      textAlign: 'center',
      fontFamily: 'Quicksand',
    },
    roundContainer: {
      alignItems: 'center',
      marginVertical: 10,
    },
    roundText: {
      fontSize: 24,
      fontFamily: 'Quicksand_SemiBold',
      marginBottom: 10,
      color: "#000000",
      textAlign: 'center',
    },
    title: {
      fontSize: 20,
      fontFamily: 'Quicksand_Medium',
      textAlign: 'center',
    },
    grid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      backgroundColor: "#90F0A5",
      borderRadius: 20,
      marginHorizontal: 15,
      padding: 5,
    },
    item: {
      alignItems: "center",
      margin: 6,
      borderWidth: 2,
      backgroundColor: "#FFF",
      borderColor: "#098223",
      borderRadius: 10,
      width: 100,
      height: 95,
      justifyContent: "center",
    },
    image: {
      width: 70,
      height: 70,
    },
    buttonContainer: {
      alignItems: 'center',
    },
    button: {
      marginTop: 10,
      padding: 10,
      backgroundColor: "#187918",
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      width: '50%',
    },
    buttonText: {
      color: "#FFFFFF",
      fontSize: 20,
      fontFamily: 'Quicksand',
    },
  });