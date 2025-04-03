import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView, Dimensions } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

// Importar configuración de niveles
import { LEVEL_CONFIG } from './levelConfig';

const { width } = Dimensions.get('window');

const GameLevel = () => {
  const route = useRoute();
  const { levelNumber } = route.params;
  const levelConfig = LEVEL_CONFIG[levelNumber];
  
  const words = levelConfig.words;
  const gridSize = levelConfig.gridSize;
  // Calcular cellSize basado en el gridSize específico del nivel
  const cellSize = Math.floor((width - 40) / gridSize); // Ajuste de márgenes para mejor visualización

  const navigation = useNavigation();
  const [wordGrid, setWordGrid] = useState([]);
  const [currentSelection, setCurrentSelection] = useState([]);
  const [wordsFound, setWordsFound] = useState([]);
  const [foundCells, setFoundCells] = useState([]);

  useEffect(() => {
    startNewGame();
  }, []);

  // Función para generar la cuadrícula vacía
  const generateEmptyGrid = (size) => {
    return Array(size).fill(null).map(() => Array(size).fill('_'));
  };

  // Función para iniciar el juego y generar la sopa de letras
  const startNewGame = () => {
    const newGrid = generateEmptyGrid(gridSize);
    setWordGrid(newGrid);
    setCurrentSelection([]);
    setWordsFound([]);
    setFoundCells([]);
    placeWordsInGrid(words, newGrid);
  };

  // Función para colocar las palabras en la cuadrícula
  const placeWordsInGrid = (words, grid) => {
    words.forEach(word => {
      let placed = false;
      let attempts = 0;
      const maxAttempts = 100; // Evitar bucles infinitos
      
      while (!placed && attempts < maxAttempts) {
        attempts++;
        const row = Math.floor(Math.random() * gridSize);
        const col = Math.floor(Math.random() * gridSize);
        const direction = Math.floor(Math.random() * 3); // 0: horizontal, 1: vertical, 2: diagonal
        if (canPlaceWordAt(word, grid, row, col, direction)) {
          for (let i = 0; i < word.length; i++) {
            if (direction === 0) { // Horizontal
              grid[row][col + i] = word[i];
            } else if (direction === 1) { // Vertical
              grid[row + i][col] = word[i];
            } else if (direction === 2) { // Diagonal
              grid[row + i][col + i] = word[i];
            }
          }
          placed = true;
        }
      }
      
      // Si después de muchos intentos no se pudo colocar, simplemente continuamos
      if (!placed) {
        console.warn(`No se pudo colocar la palabra: ${word}`);
      }
    });

    // Rellenar las celdas vacías con letras aleatorias
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        if (grid[i][j] === '_') {
          grid[i][j] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        }
      }
    }
    setWordGrid([...grid]);
  };

  // Función para verificar si la palabra se puede colocar en la cuadrícula
  const canPlaceWordAt = (word, grid, row, col, direction) => {
    if (direction === 0) { // Horizontal
      if (col + word.length > gridSize) return false;
      for (let i = 0; i < word.length; i++) {
        if (grid[row][col + i] !== '_') return false;
      }
    } else if (direction === 1) { // Vertical
      if (row + word.length > gridSize) return false;
      for (let i = 0; i < word.length; i++) {
        if (grid[row + i][col] !== '_') return false;
      }
    } else if (direction === 2) { // Diagonal
      if (row + word.length > gridSize || col + word.length > gridSize) return false;
      for (let i = 0; i < word.length; i++) {
        if (grid[row + i][col + i] !== '_') return false;
      }
    }
    return true;
  };

  const selectCell = (rowIndex, colIndex) => {
    const index = rowIndex * gridSize + colIndex;
  
    // Si la celda ya está seleccionada, quitarla de la selección
    if (currentSelection.includes(index)) {
      setCurrentSelection(currentSelection.filter(i => i !== index));
      return;
    }
  
    // Si la celda no está seleccionada, agregarla a la selección
    const newSelection = [...currentSelection, index];
    setCurrentSelection(newSelection);
  
    // Extraer las coordenadas de la selección actual
    const selectedCoords = newSelection.map(idx => ({
      row: Math.floor(idx / gridSize),
      col: idx % gridSize
    }));
  
    // Verificar si la selección forma una línea válida
    if (!isSelectionInLine(selectedCoords)) {
      setCurrentSelection([]); // Si no es una línea válida, deseleccionamos
      return;
    }
  
    // Verificar si la celda seleccionada es adyacente a la última celda seleccionada
    if (newSelection.length > 1) {
      const lastIndex = currentSelection[currentSelection.length - 1];
      const lastRow = Math.floor(lastIndex / gridSize);
      const lastCol = lastIndex % gridSize;
  
      const isAdjacent =
        (rowIndex === lastRow && Math.abs(colIndex - lastCol) === 1) || // Horizontal
        (colIndex === lastCol && Math.abs(rowIndex - lastRow) === 1) || // Vertical
        (Math.abs(rowIndex - lastRow) === 1 && Math.abs(colIndex - lastCol) === 1); // Diagonal
  
      if (!isAdjacent) {
        setCurrentSelection([]); // Si no es adyacente, deseleccionamos
        return;
      }
    }
  
    // Aquí ya no estamos verificando si la palabra está en la lista de palabras
    const selectedWord = selectedCoords
      .map(({ row, col }) => wordGrid[row][col])
      .join('');
  
    // Si la selección forma una palabra válida
    if (words.includes(selectedWord) && !wordsFound.some(w => w.word === selectedWord)) {
      const randomColor = `hsl(${Math.floor(Math.random() * 360)}, 100%, 75%)`;
  
      setFoundCells(prevCells => [...prevCells, ...newSelection]);
  
      setWordsFound(prevWords => {
        const updatedWords = [...prevWords, { word: selectedWord, color: randomColor }];
  
        if (updatedWords.length === words.length) {
          setTimeout(() => {
            const nextLevel = levelNumber + 1;
            const hasNextLevel = LEVEL_CONFIG[nextLevel] !== undefined;
            
            Alert.alert(
              `¡Felicidades! Has completado el Nivel ${levelNumber}`,
              "¿Qué deseas hacer ahora?",
              [
                { text: "Salir", onPress: () => navigation.navigate("Levels") },
                hasNextLevel ? 
                  { text: `Nivel ${nextLevel}`, onPress: () => navigation.navigate("GameLevel", { levelNumber: nextLevel }) } :
                  { text: "Completado", style: 'cancel' }
              ],
              { cancelable: false }
            );
  
            // Guardar progreso del nivel completado
            AsyncStorage.setItem(`@level${levelNumber}_completed`, 'true')
              .then(() => {
                AsyncStorage.getItem('@unlocked_levels')
                  .then(storedLevels => {
                    let levels = storedLevels ? JSON.parse(storedLevels) : [levelNumber];
                    if (hasNextLevel && !levels.includes(nextLevel)) {
                      levels.push(nextLevel);
                      AsyncStorage.setItem('@unlocked_levels', JSON.stringify(levels));
                    }
                  })
                  .catch(error => console.error('Error al desbloquear el nivel:', error));
              })
              .catch(error => console.error('Error al guardar el progreso:', error));
          }, 1000);
        }
  
        return updatedWords;
      });
  
      setCurrentSelection([]); // Reiniciar selección
    }
  };
  
  // Función para validar si la selección está en línea
  const isSelectionInLine = (coords) => {
    if (coords.length < 2) return true; // Si hay solo una letra, no se evalúa

    const sameRow = coords.every(({ row }) => row === coords[0].row);
    const sameCol = coords.every(({ col }) => col === coords[0].col);
    const isDiagonal = coords.every(({ row, col }, i) => 
      row - coords[0].row === col - coords[0].col || row - coords[0].row === (col - coords[0].col) * -1
    );

    return sameRow || sameCol || isDiagonal;
  };
  
  const getCellColor = (rowIndex, colIndex) => {
    const cellIndex = rowIndex * gridSize + colIndex;
    for (let foundWord of wordsFound) {
      if (foundCells.includes(cellIndex) && getWordCells(foundWord.word).includes(cellIndex)) {
        return foundWord.color || "#FFD700"; // Usa el color asignado o amarillo por defecto 
      }
    }
    return null;
  };

  // Función para obtener las celdas que forman la palabra
  const getWordCells = (word) => {
    const wordCells = [];
    wordGrid.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell === word[0]) { // Comienza con la primera letra de la palabra
          // Verificamos si la palabra está en esa posición
          let match = true;
          for (let i = 0; i < word.length; i++) {
            if (row[colIndex + i] !== word[i]) {
              match = false;
              break;
            }
          }
          if (match) {
            for (let i = 0; i < word.length; i++) {
              wordCells.push(rowIndex * gridSize + (colIndex + i));
            }
          }

          match = true;
          for (let i = 0; i < word.length; i++) { // Vertical
            if (rowIndex + i >= gridSize || wordGrid[rowIndex + i][colIndex] !== word[i]) {
              match = false;
              break;
            }
          }
          if (match) {
            for (let i = 0; i < word.length; i++) {
              wordCells.push((rowIndex + i) * gridSize + colIndex);
            }
          }

          match = true;
          for (let i = 0; i < word.length; i++) { // Diagonal
            if (rowIndex + i >= gridSize || colIndex + i >= gridSize || wordGrid[rowIndex + i][colIndex + i] !== word[i]) {
              match = false;
              break;
            }
          }
          if (match) {
            for (let i = 0; i < word.length; i++) {
              wordCells.push((rowIndex + i) * gridSize + (colIndex + i));
            }
          }
        }
      });
    });
    return wordCells;
  };

  // Función para verificar si la celda está en una palabra encontrada
  const isCellPartOfFoundWord = (rowIndex, colIndex) => {
    const cellIndex = rowIndex * gridSize + colIndex;
    return foundCells.includes(cellIndex);
  };
  
  // Reiniciar el juego
  const handleResetGame = () => {
    startNewGame();  // Llamada para reiniciar la sopa de letras
    setWordsFound([]); // Reinicia las palabras encontradas
    setFoundCells([]); // Reinicia las celdas encontradas
    setCurrentSelection([]); // Reinicia la selección actual
  };
  
  // Renderizar la cuadrícula según el tamaño
  const renderGrid = () => {
    return (
      <ScrollView horizontal={true} contentContainerStyle={styles.scrollableGridContainer}>
        <ScrollView contentContainerStyle={styles.scrollableGrid}>
          <View style={styles.gridContainer}>
            {wordGrid.map((row, rowIndex) => (
              <View key={`row-${rowIndex}`} style={styles.gridRow}>
                {row.map((cell, colIndex) => renderCell(rowIndex, colIndex, cell))}
              </View>
            ))}
          </View>
        </ScrollView>
      </ScrollView>
    );
  };

  // Renderizar una celda individual
  const renderCell = (rowIndex, colIndex, cell) => (
    <TouchableOpacity
      key={`${rowIndex}-${colIndex}`}
      style={[
        styles.gridCell,
        { width: cellSize, height: cellSize },
        currentSelection.includes(rowIndex * gridSize + colIndex) && styles.selected,
        isCellPartOfFoundWord(rowIndex, colIndex) && { backgroundColor: getCellColor(rowIndex, colIndex) },
      ]}
      onPress={() => selectCell(rowIndex, colIndex)}
    >
      <Text style={[styles.cellText, { fontSize: cellSize * 0.5 }]}>{cell}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.gameContainer}>
      <View style={styles.topBar}>
        <Text style={styles.titleText}>{levelConfig.title}</Text>
        <View style={styles.topControls}>
          <TouchableOpacity style={styles.topButton} onPress={handleResetGame}>
            <Ionicons name="reload-circle" size={50} color="#800020" />
          </TouchableOpacity>
  
          <View style={styles.levelContainer}>
            <Text style={styles.levelText}>NVL. {levelNumber}</Text>
          </View>
  
          <TouchableOpacity style={styles.topButton} onPress={() => navigation.navigate('Levels')}>
            <MaterialCommunityIcons name="exit-to-app" size={52} color="#800020" />
          </TouchableOpacity>
        </View>
      </View>
  
      <Text style={styles.instructionsText}>{levelConfig.instruction}</Text>
  
      <View style={styles.wordSearchContainer}>
        {renderGrid()}
      </View>
  
      <View style={styles.wordsListContainer}>
        <View style={styles.wordsRow}>
          {words.map((word, index) => {
            // Busca el color asociado a la palabra
            const foundWord = wordsFound.find(w => w.word === word);
            return (
              <View
                key={index}
                style={[styles.wordItem, foundWord && { backgroundColor: foundWord.color }]}
              >
                <Text style={styles.wordText}>{word}</Text>
              </View>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  gameContainer: {
    flex: 1,
    backgroundColor: '#F998B5',
  },
  topBar: {
    backgroundColor: '#E56587',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    marginHorizontal: 15,
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
  },
  titleText: {
    fontSize: 24,
    color: '#800020',
    marginBottom: 10,
    fontFamily: 'Quicksand'
  },
  levelContainer: {
    backgroundColor: '#800020',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 90,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelText: {
    fontSize: 18,
    color: '#F998B5',
    textAlign: 'center',
    fontFamily: 'Quicksand'
  },
  wordSearchContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  scrollableGridContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollableGrid: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridContainer: {
    // No incluir width o height fijo aquí
  },
  gridRow: {
    flexDirection: 'row', // Las celdas de una fila se alinean horizontalmente
  },
  gridCell: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'black',
  },
  cellText: {
    fontWeight: 'bold',
  },
  selected: {
    backgroundColor: '#F88787',
  },
  wordsListContainer: {
    marginHorizontal: 15,
    marginTop: 20,
    padding: 10,
    backgroundColor: '#90172F',
    borderRadius: 15,
  },
  wordItem: {
    padding: 2,
    margin: 5,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    textAlign: 'center',
  },
  wordsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  wordText: {
    padding: 5,
  },
  instructionsText: {
    fontSize: 25,
    textAlign: 'center',
    color: '#CE3558',
    paddingVertical: 20,
    fontFamily: 'Quicksand_SemiBold',
  },
});

export default GameLevel;