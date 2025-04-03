import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Alert, ScrollView } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from 'react-native-vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LEVELS_CONFIG } from './GameConfig';

const GameLevel = ({ navigation, route }) => {
  const { levelId } = route.params;
  const levelConfig = LEVELS_CONFIG.find(level => level.id === levelId);
  
  if (!levelConfig) {
    Alert.alert("Error", "No se encontró la configuración del nivel");
    navigation.goBack();
    return null;
  }

  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [bestTime, setBestTime] = useState(null);
  const [currentCards, setCurrentCards] = useState([]);  
  const [selectedFood, setSelectedFood] = useState(null);
  const [feedback, setFeedback] = useState({});
  const [remainingItems, setRemainingItems] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState(levelConfig.initialCategories);
  
  const formatTime = (seconds) => {
    const min = String(Math.floor(seconds / 60)).padStart(2, '0');
    const sec = String(seconds % 60).padStart(2, '0');
    return `${min}:${sec}`;
  };
  
  // Guarda el mejor tiempo 
  const saveBestTime = async (time) => {
    try {
      await AsyncStorage.setItem(`@best_time_level${levelId}`, time.toString());
    } catch (error) {
      console.error('Error al guardar el mejor tiempo:', error);
    }
  };

  // Carga el mejor tiempo guardado al iniciar el nivel
  const loadBestTime = async () => {
    try {
      const storedTime = await AsyncStorage.getItem(`@best_time_level${levelId}`);
      if (storedTime !== null) {
        setBestTime(parseInt(storedTime)); 
      }
    } catch (error) {
      console.error('Error al cargar el mejor tiempo:', error);
    }
  };

  const handleFoodSelect = (item) => {
    setSelectedFood(item);
    setFeedback({ [item.name]: 'selected' }); 
  };
  
  const replaceCorrectCard = (correctItem) => { 
    const updatedRemaining = remainingItems.filter(item => item.name !== correctItem.name);
  
    if (updatedRemaining.length > 0) {
      const newCard = updatedRemaining[0];
      setRemainingItems(updatedRemaining.slice(1));
  
      const updatedCards = currentCards.map(card =>
        card?.name === correctItem.name ? newCard : card
      );
      setCurrentCards(updatedCards);
    } else {
      const updatedCards = currentCards.map(card =>
        card?.name === correctItem.name ? null : card
      );
      setCurrentCards(updatedCards);
  
      if (updatedCards.every(card => card === null)) {
        setIsRunning(false); // Detiene el temporizador
        const newTime = timer;
        const isNewRecord = bestTime === null || newTime < bestTime;
        
        // Si hay un nivel siguiente, lo desbloqueamos
        if (levelId < LEVELS_CONFIG.length) {
          unlockNextLevel(levelId + 1);
        }
  
        if (isNewRecord) {
          setBestTime(newTime); 
          saveBestTime(newTime); // Guarda el nuevo récord
        }
  
        Alert.alert(
          "¡FELICIDADES!",
          `Completaste el nivel en ${formatTime(newTime)}.\n\n ${
            isNewRecord
              ? "¡Has mejorado tu tiempo!"
              : `Tiempo record ${formatTime(bestTime)}.`
          }`,
          [
            { text: "Reiniciar Nivel", onPress: () => restartLevel() },
            { text: "Salir", onPress: () => navigation.navigate('Levels') },
          ]
        );
      }
    }
  };
  
  const unlockNextLevel = async (nextLevel) => {
    try {
      const storedLevels = await AsyncStorage.getItem('@unlocked_levels');
      const unlockedLevels = storedLevels ? JSON.parse(storedLevels) : [1];
  
      if (!unlockedLevels.includes(nextLevel)) {
        unlockedLevels.push(nextLevel);  // Desbloquea el siguiente nivel
        await AsyncStorage.setItem('@unlocked_levels', JSON.stringify(unlockedLevels));
      }
    } catch (error) {
      console.error('Error al desbloquear el siguiente nivel:', error);
    }
  };
  
  const getRandomCards = () => {
    const shuffled = [...levelConfig.foodItems].sort(() => 0.5 - Math.random());
    const uniqueCards = shuffled.slice(0, levelConfig.cardsToShow);
    setRemainingItems(shuffled.slice(levelConfig.cardsToShow));
    setCurrentCards(uniqueCards);
  };
  
  const handleCategorySelect = (category) => {
    if (selectedFood) {
      if (selectedFood.category === category) {
        setSelectedCategories(prevState => {
          const updatedCategory = [...prevState[category], selectedFood];
          return { ...prevState, [category]: updatedCategory };
        });
        setFeedback({
          [selectedFood.name]: 'correct',
          [category]: 'correct'
        });
        
        setTimeout(() => {
          replaceCorrectCard(selectedFood);
          setSelectedFood(null);
          setFeedback({});
        }, 300);
      } else {
        setFeedback({
          [selectedFood.name]: 'incorrect',
          [category]: 'incorrect'
        });
       
        setTimeout(() => {
          setSelectedFood(null);
          setFeedback({});
        }, 300);
      }
    }
  };
  
  const restartLevel = () => {
    setTimer(0);
    setIsRunning(true);
    setSelectedCategories(levelConfig.initialCategories);
    getRandomCards();
  };
  
  useEffect(() => {
    loadBestTime();  // Carga el mejor tiempo guardado
    getRandomCards();  // Carga las cartas
  
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);  // Suma tiempo cada segundo
      }, 1000);
    }
  
    return () => clearInterval(interval);  // Detiene el temporizador al salir
  }, [isRunning]);
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.titleText}>{levelConfig.title}</Text>
        <View style={styles.topControls}>
          <TouchableOpacity style={styles.topButton} onPress={restartLevel}>
            <Ionicons name="reload-circle" size={40} color="#A38800" />
          </TouchableOpacity>
          <View style={styles.levelContainer}>
            <Text style={styles.levelText}>{levelConfig.level}</Text>
          </View>
          <TouchableOpacity style={styles.topButton} onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Levels' }] })}>
            <MaterialCommunityIcons name="exit-to-app" size={42} color="#A38800" />
          </TouchableOpacity>
        </View>
        <View style={styles.timerContainer}>
          <View style={styles.timerItem}>
            <MaterialCommunityIcons name="turtle" size={30} color="#008106" />
            <Text style={styles.timerText}>{formatTime(timer)}</Text>
          </View>
          <View style={styles.timerItem}>
            <Ionicons name="trophy" size={30} color="#f5b700" />
            <Text style={styles.timerText}>{bestTime ? formatTime(bestTime) : '00:00'}</Text>
          </View>
        </View>
      </View>
      <View style={styles.gameArea}>
        <View style={styles.leftPanel}>
          {Array.from({ length: levelConfig.cardsToShow }).map((_, index) => {
            const item = currentCards[index];
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.foodItem,
                  feedback[item?.name] === 'correct' && styles.correctItem,
                  feedback[item?.name] === 'incorrect' && styles.incorrectItem,
                  feedback[item?.name] === 'selected' && styles.selectedFoodItem,
                  !item && { opacity: 0 }
                ]}
                onPress={() => item && handleFoodSelect(item)} 
                disabled={!item}
              >
                {item ? (
                  <>
                    <Image
                      source={{ uri: item.image }}  
                      style={styles.foodImage}  
                      resizeMode="contain"  
                    />
                    <Text style={styles.foodText}>{item.name}</Text>  
                  </>
                ) : null}
              </TouchableOpacity>
            );
          })}
        </View>
        <View style={styles.rightPanel}>
          {levelConfig.categories.map((category, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.foodItem,
                feedback[category] === 'correct' && styles.correctItem,
                feedback[category] === 'incorrect' && styles.incorrectItem
              ]}
              onPress={() => handleCategorySelect(category)}
            >
              <Text style={styles.categoryText}>{category}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F5EEBC',
    },
    transparentSlot: {
      width: 150, 
      height: 150, 
      backgroundColor: 'transparent', 
      borderRadius: 0, 
      borderColor: 'transparent', 
      borderWidth: 0, 
      elevation: 0, 
      shadowColor: 'transparent', 
      shadowOpacity: 0,
      shadowRadius: 0,
    },
    topBar: {
      backgroundColor: '#F5E47B',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 30,
      paddingVertical: 15,
      marginHorizontal: 15,
    },
    titleText: {
      color: '#A38800',
      fontSize: 24,
      fontFamily: 'Quicksand',
      textTransform: 'uppercase',
    },
    topControls: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 15,
    },
    topButton: {
      marginHorizontal: 12,
    },
    levelContainer: {
      backgroundColor: '#A38800',
      borderRadius: 90,
      alignItems: 'center',
      justifyContent: 'center',
      height: 46,
      width: 90,
    },
    levelText: {
      fontSize: 18,
      fontFamily: 'Quicksand',
      color: '#F5EEBC',
    },
    timerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 10,
      paddingVertical: 5,
    },
    timerItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 10,
    },
    timerText: {
      marginLeft: 5,
      fontSize: 27,
      color: '#A38800',
      fontFamily: 'Quicksand',
    },
    foodItem: {
      backgroundColor: '#fff',
      width: '90%',
      height: 150,  
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: '#E7C100',
      marginVertical: 5,
      elevation: 3,
    },
    foodText: {
      fontSize: 18, 
      color: '#5F4F00',
      textAlign: 'center', 
      fontFamily: 'Quicksand_SemiBold',
    },
    categoryText: {
      fontSize: 18,
      color: '#5F4F00',
      textAlign: 'center', 
      fontFamily: 'Quicksand_SemiBold',
    },
    gameArea: {
      flex: 1,
      flexDirection: 'row', 
      padding: 10,
    },
    leftPanel: {
      flex: 1, 
      justifyContent: 'space-evenly', 
      alignItems: 'center',
      padding: 10,
    },
    rightPanel: {
      flex: 1, 
      justifyContent: 'space-evenly',
      alignItems: 'center',
      padding: 10,
    },
  selectedFoodItem: {
    backgroundColor: '#E7C100',  
  },
  correctItem: {
    backgroundColor: '#7EF585', 
  },
  incorrectItem: {
    backgroundColor: '#F0A18E',  
  },
  emptySlot: {
    width: '80%',
    height: 150, 
    borderRadius: 10,
    marginVertical: 5,
    opacity: 0,
  },
  foodImage: {
    width: 90,   
    height: 90,
    marginBottom: 5,  
  },
  });

export default GameLevel;