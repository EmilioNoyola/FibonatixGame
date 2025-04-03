import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Alert } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const LevelComponent = ({ navigation, levelConfig }) => {
    // Configuración y estados del nivel
    const { 
        levelNumber, 
        initialTimeLeft = 30, 
        minNumberRange, 
        maxNumberRange,
        operationsToComplete = 6,
        scoreIncrement = 10,
        timeIncrement = 5,
        timePenalty = 5
    } = levelConfig;
    
    // Estados
    const [num1, setNum1] = useState(0);
    const [num2, setNum2] = useState(0);
    const [options, setOptions] = useState([]);
    const [operation, setOperation] = useState('+');
    const [selectedOperation, setSelectedOperation] = useState('+');
    const [timeLeft, setTimeLeft] = useState(initialTimeLeft);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [operationCounts, setOperationCounts] = useState({ '+': 0, '-': 0, '×': 0, '÷': 0 });
    const [currentStage, setCurrentStage] = useState(1);
    const [completedOperations, setCompletedOperations] = useState(0);
    const [progress] = useState(new Animated.Value(1));
    const [optionColors, setOptionColors] = useState({});
    
    const [color] = useState(progress.interpolate({
        inputRange: [0, 1],
        outputRange: ['#f44336', '#4caf50'],
    }));

    // Manejo del tiempo y progreso
    useEffect(() => {
        if (timeLeft > 0 && !gameOver) {
            const timer = setInterval(() => {
                setTimeLeft(prevTime => prevTime - 0.05);
                Animated.timing(progress, {
                    toValue: timeLeft / initialTimeLeft,
                    duration: 50,
                    useNativeDriver: false
                }).start();
            }, 50);
            return () => clearInterval(timer);
        }
        
        if (timeLeft <= 0 || (operation === '÷' && operationCounts['÷'] >= operationsToComplete)) {
            setGameOver(true);
            showGameOverAlert();
        }
    }, [timeLeft, operationCounts]);

    // Generación de números cuando cambia la operación
    useEffect(() => {
        if (selectedOperation) {
            generateNumbers();
        }
    }, [selectedOperation]);

    // Alerta de fin de juego
    const showGameOverAlert = () => {
        setIsAlertVisible(true);
    };

    // Reiniciar juego
    const resetGame = () => {
        setTimeLeft(initialTimeLeft);
        setScore(0);
        setGameOver(false);
        setOperationCounts({ '+': 0, '-': 0, '×': 0, '÷': 0 });
        setCurrentStage(1);
        setCompletedOperations(0);
        setOperation('+');
        setSelectedOperation('+');
        generateNumbers();
    };

    // Siguiente nivel
    const handleNextLevel = () => {
        if (operationCounts['÷'] === operationsToComplete) {
            const nextLevel = levelNumber + 1;
            navigation.navigate(`Level${nextLevel}`);
        } else {
            Alert.alert(
                "Operaciones incompletas",
                "Debes completar las 4 operaciones antes de pasar al siguiente nivel.",
                [{ text: "OK" }]
            );
        }
    };

    // Salir al menú de niveles
    const handleExit = () => {
        navigation.navigate('Levels');
    };

    // Generar opciones de respuesta
    const generateOptions = (correctAnswer) => {
        let incorrect1, incorrect2, incorrect3, incorrect4, incorrect5;
        
        // El número de opciones depende del nivel
        const numOptions = levelNumber === 1 ? 6 : levelNumber === 2 ? 3 : 3;
    
        do {
            incorrect1 = correctAnswer + (Math.floor(Math.random() * 5) + 1);
        } while (incorrect1 === correctAnswer);
    
        do {
            incorrect2 = correctAnswer - (Math.floor(Math.random() * 5) + 1);
        } while (incorrect2 === correctAnswer || incorrect2 === incorrect1);
    
        do {
            incorrect3 = correctAnswer + (Math.floor(Math.random() * 3) + 1);
        } while ([correctAnswer, incorrect1, incorrect2].includes(incorrect3));
    
        let choices = [correctAnswer, incorrect1, incorrect2];
        
        if (numOptions > 3) {
            do {
                incorrect4 = correctAnswer - (Math.floor(Math.random() * 3) + 1);
            } while ([correctAnswer, incorrect1, incorrect2, incorrect3].includes(incorrect4));
            
            do {
                incorrect5 = correctAnswer + (Math.floor(Math.random() * 7) + 1);
            } while ([correctAnswer, incorrect1, incorrect2, incorrect3, incorrect4].includes(incorrect5));
            
            choices = [correctAnswer, incorrect1, incorrect2, incorrect3, incorrect4, incorrect5];
        }
    
        setOptions(choices.sort(() => Math.random() - 0.5));
    
        // Inicializar colores de opciones
        let initialColors = {};
        choices.forEach(choice => {
            initialColors[choice] = '#FFDDF5';
        });
        setOptionColors(initialColors);
    };

    // Generar nuevos números para la operación actual
    const generateNumbers = () => {
        let n1, n2;

        // Lógica ajustada según el nivel y la operación
        if (operation === '-') {
            n1 = Math.floor(Math.random() * (maxNumberRange - minNumberRange)) + minNumberRange;
            n2 = Math.floor(Math.random() * (n1 - minNumberRange)) + minNumberRange;
        } else if (operation === '÷') {
            // Para división, asegurar divisores exactos
            n1 = Math.floor(Math.random() * (maxNumberRange - minNumberRange)) + minNumberRange;
            let divisors = [];
            for (let i = 1; i <= n1; i++) {
                if (n1 % i === 0) divisors.push(i);
            }
            n2 = divisors.length > 1 ? divisors[Math.floor(Math.random() * (divisors.length - 1)) + 1] : 1;
        } else {
            n1 = Math.floor(Math.random() * (maxNumberRange - minNumberRange)) + minNumberRange;
            n2 = Math.floor(Math.random() * (maxNumberRange - minNumberRange)) + minNumberRange;
        }

        setNum1(n1);
        setNum2(n2);

        const correctAnswer = operation === '+' ? n1 + n2
            : operation === '-' ? n1 - n2
                : operation === '×' ? n1 * n2
                    : operation === '÷' ? n1 / n2
                        : null;

        generateOptions(correctAnswer);
    };

    // Cambiar operación actual
    const handleOperationPress = (op) => {
        setOperation(op);
        setSelectedOperation(op);
    };

    // Verificar respuesta seleccionada
    const checkAnswer = (selectedAnswer) => {
        let correctAnswer;
        switch (operation) {
            case '+': correctAnswer = num1 + num2; break;
            case '-': correctAnswer = num1 - num2; break;
            case '×': correctAnswer = num1 * num2; break;
            case '÷': correctAnswer = num1 / num2; break;
        }

        // Cambiar color de la opción seleccionada
        setOptionColors(prevColors => ({
            ...prevColors,
            [selectedAnswer]: selectedAnswer === correctAnswer ? '#28a745' : '#dc3545'
        }));

        if (selectedAnswer === correctAnswer) {
            setScore(prevScore => prevScore + scoreIncrement);
            setTimeLeft(prevTime => Math.min(prevTime + timeIncrement, initialTimeLeft));

            setOperationCounts(prevCounts => {
                const newCounts = { ...prevCounts, [operation]: prevCounts[operation] + 1 };

                if (operation === '÷' && newCounts['÷'] >= operationsToComplete) {
                    setGameOver(true);
                    showGameOverAlert();
                }

                if (newCounts[operation] === operationsToComplete) {
                    let nextOperation = operation;
                    if (operation === '+') nextOperation = '-';
                    else if (operation === '-') nextOperation = '×';
                    else if (operation === '×') nextOperation = '÷';

                    setTimeout(() => {
                        setOperation(nextOperation);
                        setSelectedOperation(nextOperation);
                    }, 1000);

                    setCurrentStage(prevStage => prevStage + 1);
                }
                return newCounts;
            });

            setCompletedOperations(prev => prev + 1);
        } else {
            setTimeLeft(prevTime => Math.max(prevTime - timePenalty, 0));
        }

        setTimeout(() => {
            generateNumbers();
        }, 700);
    };

    // Generar nuevos números al cambiar operación
    useEffect(() => {
        generateNumbers();
    }, [operation]);

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.topBar}>
                <Text style={styles.titleText}>ROMPEFRACCIONES</Text>
                <View style={styles.topControls}>
                    <TouchableOpacity style={styles.topButton} onPress={resetGame}>
                        <Ionicons name="reload-circle" size={40} color="#D669E6" />
                    </TouchableOpacity>
                    <View style={styles.levelContainer}>
                        <Text style={styles.levelText}>NVL. {levelNumber}</Text>
                    </View>
                    <TouchableOpacity style={styles.topButton} onPress={() => navigation.navigate('Levels')}>
                        <MaterialCommunityIcons name="exit-to-app" size={40} color="#D669E6" />
                    </TouchableOpacity>
                </View>
                <Text style={styles.scoreText}>Puntuación: {score}</Text>
            </View>

            <View style={styles.gameContainer}>
                {gameOver ? (
                    <View style={styles.gameOverContainer}>
                        <Text style={styles.gameOverText}>¡Juego terminado!</Text>
                        <Text style={styles.scoreText}>Puntuación: {score}</Text>
                        <View style={styles.buttonRow}>
                            <TouchableOpacity style={styles.gameOverButton} onPress={handleNextLevel}>
                                <Text style={styles.gameOverButtonText}>Siguiente nivel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.gameOverButton} onPress={handleExit}>
                                <Text style={styles.gameOverButtonText}>Salir</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.gameOverButton} onPress={resetGame}>
                                <Text style={styles.gameOverButtonText}>Reiniciar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    <>
                        {/* Timer */}
                        <View style={styles.timerContainer}>
                            <View style={styles.timerIcon}>
                                <Text style={styles.timerIconText}>i</Text>
                            </View>
                            <View style={styles.progressBarBackground}>
                                <Animated.View
                                    style={[
                                        styles.progressBar, 
                                        { 
                                            width: `${(timeLeft/initialTimeLeft)*100}%`,
                                            backgroundColor: timeLeft < 10 ? '#f44336' : '#FF69B4'
                                        }
                                    ]}
                                />
                            </View>
                        </View>

                        {/* Operation buttons */}
                        <View style={styles.buttonContainer}>
                            {['+', '-', '×', '÷'].map((op) => (
                                <TouchableOpacity
                                    key={op}
                                    style={[
                                        styles.button,
                                        selectedOperation === op ? styles.buttonSelected : null
                                    ]}
                                    onPress={() => handleOperationPress(op)}
                                    disabled={operation !== op}
                                >
                                    <Text style={styles.buttonText}>{op}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Opciones de respuesta */}
                        {levelNumber === 1 ? (
                            <>
                                <View style={styles.topOptionsContainer}>
                                    {options.slice(0, 3).map((option, index) => (
                                        <TouchableOpacity
                                            key={`top-${index}`}
                                            style={[
                                                styles.optionButton,
                                                { backgroundColor: optionColors[option] || '#FFDDF5' }
                                            ]}
                                            onPress={() => checkAnswer(option)}
                                        >
                                            <Text style={styles.optionText}>{option}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>

                                {/* Ecuación */}
                                <View style={styles.equationContainer}>
                                    <Text style={styles.equationText}>
                                        {num1}{' ' + operation + ' '}{num2 + ' '}=
                                    </Text>
                                    <View style={styles.answerBox}></View>
                                </View>

                                {/* Opciones de respuesta abajo */}
                                <View style={styles.bottomOptionsContainer}>
                                    {options.slice(3, 6).map((option, index) => (
                                        <TouchableOpacity
                                            key={`bottom-${index}`}
                                            style={[
                                                styles.optionButton,
                                                { backgroundColor: optionColors[option] || '#FFDDF5' }
                                            ]}
                                            onPress={() => checkAnswer(option)}
                                        >
                                            <Text style={styles.optionText}>{option}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </>
                        ) : (
                            <>
                                {/* Para nivel 2 y 3 - diseño de ecuación con opciones abajo */}
                                <View style={styles.equationContainerAlt}>
                                    <Text style={styles.equationTextAlt}>
                                        {num1}{' ' + operation + ' '}{num2 + ' '}=
                                    </Text>
                                </View>
                                
                                <View style={styles.optionsContainerAlt}>
                                    {options.map((option, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            style={[
                                                styles.optionButtonAlt,
                                                { backgroundColor: optionColors[option] || '#FFDDF5' }
                                            ]}
                                            onPress={() => checkAnswer(option)}
                                        >
                                            <Text style={styles.optionTextAlt}>{option}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </>
                        )}
                    </>
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFDDF5',
    },
    topBar: {
        backgroundColor: '#F9BCFF',
        paddingVertical: 20,
        borderRadius: 20,
        marginHorizontal: 15,
    },
    topControls: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleText: {
        fontSize: 24,
        color: '#D669E6',
        textAlign: 'center',
        marginBottom: 10,
        fontFamily: 'Quicksand'
    },
    topButton: {
        padding: 5,
        paddingHorizontal: 10,
    },
    levelContainer: {
        backgroundColor: '#D669E6',
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 20,
        alignItems: 'center',
    },
    levelText: {
        fontSize: 16,
        color: 'white',
        fontFamily: 'Quicksand'
    },
    gameContainer: {
        backgroundColor: '#F9BCFF',
        marginHorizontal: 15,
        marginVertical: 15,
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        flex: 1,
    },
    timerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginVertical: 10,
        zIndex: 1,
    },
    timerIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        position: 'absolute',
        backgroundColor: '#D669E6',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    timerIconText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
    progressBarBackground: {
        flex: 1,
        height: 15,
        backgroundColor: 'white',
        borderRadius: 10,
        overflow: 'hidden',
        marginLeft: 27,
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#FF69B4',
        borderRadius: 10,
    },
    scoreText: {
        fontSize: 18,
        marginTop: 10,
        color: '#D669E6',
        textAlign: 'center',
        fontFamily: 'Quicksand'
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#FFDDF5',
        borderRadius: 20,
        width: '100%',
        paddingVertical: 12,
        marginVertical: 15,
    },
    button: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonSelected: {
        backgroundColor: '#F9BCFF',
        transform: [{ scale: 1.4 }],
        borderWidth: 1,
        borderColor: 'white',
    },
    buttonText: {
        fontSize: 35,
        color: '#E35CBA',
        fontFamily: 'Quicksand',
        textAlign: 'center',
        lineHeight: 50,
        top:-2,
    },
    topOptionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginVertical: 15,
    },
    optionButton: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#FFDDF5',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
    },
    optionText: {
        fontSize: 22,
        color: '#D681CD',
        fontFamily: 'Quicksand_SemiBold',
    },
    equationContainer: {
        flexDirection: 'row',
        backgroundColor: '#D681CD',
        borderRadius: 15,
        paddingHorizontal: 20,
        paddingVertical: 15,
        alignItems: 'center',
        marginVertical: 10,
    },
    equationText: {
        fontSize: 36,
        color: 'white',
        fontFamily: 'Quicksand_SemiBold',
    },
    bottomOptionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 20,
    },    
    answerBox: {
        width: 70,
        height: 50,
        backgroundColor: 'white',
        borderRadius: 10,
        marginLeft: 10,
    },
    // Estilos para niveles 2 y 3
    equationContainerAlt: {
        backgroundColor: '#D681CD',
        borderRadius: 15,
        paddingHorizontal: 20,
        paddingVertical: 15,
        alignItems: 'center',
        marginVertical: 30,
        width: '90%',
    },
    equationTextAlt: {
        fontSize: 42,
        color: 'white',
        fontFamily: 'Quicksand_SemiBold',
    },
    optionsContainerAlt: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 20,
        flexWrap: 'wrap',
    },
    optionButtonAlt: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: '#FFDDF5',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
        margin: 10,
    },
    optionTextAlt: {
        fontSize: 26,
        color: '#D681CD',
        fontFamily: 'Quicksand_SemiBold',
    },
    gameOverContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 30,
    },
    gameOverText: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#D669E6',
    },
    buttonRow: {
        flexDirection: 'row',
        marginTop: 20,
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    gameOverButton: {
        backgroundColor: '#D669E6',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 15,
        marginHorizontal: 10,
        marginVertical: 5,
        elevation: 2,
    },
    gameOverButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    }
});

export default LevelComponent;