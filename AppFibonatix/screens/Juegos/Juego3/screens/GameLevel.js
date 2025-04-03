import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  Dimensions, 
  ActivityIndicator 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const GameLevel = ({ navigation, route, unlockedLevels = [], setUnlockedLevels = () => {} }) => {
  const { levelNumber, levelConfig } = route.params || {};
  
  const [selectedColor, setSelectedColor] = useState(null);
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const screenWidth = Dimensions.get('window').width;
  
  // Si no hay configuración, usar valores por defecto del nivel 1
  const config = levelConfig || {
    gridSize: 9,
    gridOperations: [
      ["17-10", "7/1", "25-18", "11-4", "13-7", "5+2", "13-6", "7+3", "20/2"],
      ["21-14", "21/3", "9-2", "4+2", "66/6", "12/2", "14/2", "5*2", "11-1"],
      ["7+0", "4+3", "3*2", "22/2", "39-28", "11+0", "8-2", "7*1", "1+6"],
      ["30-23", "9-3", "11/1", "55/5", "15-4", "36-25", "7+4", "5+1", "15-8"],
      ["11-5", "30-19", "8+3", "5+4", "18-7", "18/2", "44/4", "10+1", "6*1"],
      ["20-9", "19-8", "12-1", "15-4", "31-20", "11-0", "17-6", "21-10", "35-24"],
      ["6+5", "4+7", "33/3", "10-2", "16/2", "8+0", "24-13", "3+8", "5+6"],
      ["11/1", "22-11", "9+2", "6+2", "7+1", "2*4", "0+11", "28-17", "13-2"],
      ["6*2", "3+9", "5+7", "3*4", "8+4", "15-3", "20-8", "12+0", "12*1"],
    ],
    colorMapping: {
      10: '#FFE936',
      9: '#A5EFFF',
      12: '#5EFF40',
      8: '#9D742C',
      6: '#FF423E',
      7: '#57EBFF',
      11: '#FFEEAE',
    }
  };
  
  const gridSize = config.gridSize;
  const gridOperations = config.gridOperations;
  const colorMapping = config.colorMapping;
  
  // Calcular el tamaño de la celda basado en el tamaño de la pantalla y la cuadrícula
  const cellSize = Math.floor((screenWidth - 30) / gridSize) - 4;

  const generateGridData = () => {
    const grid = [];
    let id = 1;

    for (let row = 0; row < gridSize; row++) {
      const rowData = [];
      for (let col = 0; col < gridSize; col++) {
        rowData.push({
          id: id++,
          operation: gridOperations[row][col],
          result: eval(gridOperations[row][col]),
          color: null,
        });
      }
      grid.push(rowData);
    }
    return grid;
  };

  useEffect(() => {
    const loadLevelState = async () => {
      try {
        const savedGrid = await AsyncStorage.getItem(`Level${levelNumber}_gridData`);
        if (savedGrid) {
          setGridData(JSON.parse(savedGrid));
        } else {
          setGridData(generateGridData());
        }
      } catch (error) {
        console.error('Error loading grid data:', error);
        setGridData(generateGridData());
      } finally {
        setLoading(false);
      }
    };

    loadLevelState();
  }, [levelNumber]);

  const handleColorSelection = (color) => {
    setSelectedColor(color);
  };

  const handleCellClick = async (cell) => {
    if (!selectedColor) {
      Alert.alert('Selecciona un color antes de pintar.');
      return;
    }

    const correctColor = colorMapping[cell.result];
    if (selectedColor === correctColor) {
      cell.color = selectedColor;
      const updatedGridData = [...gridData];
      setGridData(updatedGridData);

      // Guardar progreso parcial en AsyncStorage
      await AsyncStorage.setItem(`Level${levelNumber}_gridData`, JSON.stringify(updatedGridData));

      if (checkLevelComplete()) {
        Alert.alert(
          '¡Felicidades!',
          'Nivel completado. ¿Deseas pasar al siguiente nivel?',
          [
            {
              text: 'Sí',
              onPress: async () => {
                const nextLevel = levelNumber + 1;
                if (!unlockedLevels.includes(nextLevel)) {
                  const updatedLevels = [...unlockedLevels, nextLevel];
                  setUnlockedLevels(updatedLevels);
                  await AsyncStorage.setItem('unlockedLevels', JSON.stringify(updatedLevels));
                }
                
                // Verificar si existe el siguiente nivel en la configuración
                const nextLevelConfig = route.params?.levelConfigs?.[nextLevel - 1];
                if (nextLevelConfig) {
                  navigation.navigate('GameLevel', { 
                    levelNumber: nextLevel,
                    levelConfig: nextLevelConfig
                  });
                } else {
                  Alert.alert('¡Felicidades!', '¡Has completado todos los niveles disponibles!');
                  navigation.navigate('Levels');
                }
              },
            },
            { text: 'Salir', onPress: () => navigation.navigate('Levels') },
          ]
        );
      }
    } else {
      Alert.alert('¡Incorrecto!', 'El color seleccionado no coincide con el resultado.');
    }
  };

  const checkLevelComplete = () => {
    return gridData.flat().every((cell) => cell.color !== null);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.titleText}>DIBUJI TORTUGA</Text> 
        <View style={styles.topControls}>
          <TouchableOpacity style={styles.topButton} onPress={() => setGridData(generateGridData())}>
            <Ionicons name="reload-circle" size={50} color="#355CC7" /> 
          </TouchableOpacity>
          <View style={styles.levelContainer}>
            <Text style={styles.levelText}>NVL. {levelNumber}</Text>
          </View>
          <TouchableOpacity style={styles.topButton} onPress={() => navigation.navigate('Levels')}>
            <MaterialCommunityIcons name="exit-to-app" size={52} color="#355CC7" /> 
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.gridWrapper}>
        <View style={styles.grid}>
          {gridData.flat().map((cell) => (
            <TouchableOpacity
              key={cell.id}
              style={[
                styles.cell, 
                { 
                  backgroundColor: cell.color || 'white', 
                  width: cellSize, 
                  height: cellSize 
                }
              ]}
              onPress={() => handleCellClick(cell)}
            >
              <Text style={[
                styles.cellText, 
                { fontSize: Math.floor(cellSize / 4) }
              ]}>
                {cell.operation}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.palette}>
        {Object.entries(colorMapping).map(([key, color]) => (
          <TouchableOpacity
            key={key}
            style={[
              styles.colorButton, 
              { 
                backgroundColor: color,
                borderWidth: selectedColor === color ? 3 : 1
              }
            ]}
            onPress={() => handleColorSelection(color)}
          >
            <Text style={[
              styles.colorText,
              { color: ['#FFE936', '#A5EFFF', '#5EFF40', '#57EBFF', '#FFEEAE'].includes(color) ? 'black' : 'white' }
            ]}>
              {key}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#9DDBF5',
  },
  topBar: {
    backgroundColor: '#6EB3F4',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 25,
    marginHorizontal: 15,
    marginTop: 10,
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#355CC7',
    marginBottom: 10,
  },
  levelContainer: {
    backgroundColor: '#355CC7',
    width: 90,
    height: 46,
    borderRadius: 90,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#9DDBF5',
    textAlign: 'center',
  },
  gridWrapper: {
    padding: 10,
    backgroundColor: '#EAE7E7',
    borderRadius: 10,
    marginVertical: 20,
    marginHorizontal: 15,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  cell: {
    margin: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'gray',
  },
  cellText: {
    fontWeight: 'bold',
    color: '#333333',
  },
  palette: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  colorButton: {
    width: 40,
    height: 40,
    margin: 5,
    borderRadius: 20,
    borderColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0f7fa',
  },
});

export default GameLevel;