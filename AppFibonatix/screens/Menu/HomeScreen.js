// Componentes de React Native
import React, { useMemo, useEffect, useState } from 'react';  
import { Text, View, SafeAreaView, StatusBar, Pressable, StyleSheet, Image } from 'react-native';

// Navegación
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';

// Fuentes
import useCustomFonts from '../../assets/apis/FontsConfigure';
import { RFPercentage } from 'react-native-responsive-fontsize';

// Íconos
import { MaterialIcons } from '@expo/vector-icons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { FaceA, FaceB, FaceC, FaceD } from '../../assets/img-svg';

import { useAppContext } from '../../assets/db/AppContext';
import { gameService } from '../../assets/db/ApiService';

// Componente para las tarjetas de juego
const GameCard = React.memo(({ title, imageUrl, navigateTo }) => {
    const navigation = useNavigation();
    
    return (
        <View style={styles.card}>
            <View style={styles.containerImage}>
                <Image
                    source={{ uri: imageUrl || 'https://via.placeholder.com/300x200' }}
                    style={styles.image}
                    resizeMode="cover"
                />
            </View>
            <View style={styles.textButtonContainer}>
                <Text style={styles.cardText}>{title}</Text>
                <Pressable 
                    style={({pressed}) => [
                        {
                            backgroundColor: pressed ? '#185D45' : '#1F7758',
                        },
                        styles.containerButton,
                    ]}
                    onPress={() => navigation.navigate(navigateTo)}
                >
                    <FontAwesome5 name="play" size={24} color="white" />
                </Pressable>
            </View>
        </View>
    );
});

// Componente para el header
const Header = React.memo(({ onMenuPress, gamePercentage }) => {
    const moodFace = useMemo(() => {
        if (gamePercentage >= 75) return <FaceA />;
        if (gamePercentage >= 50) return <FaceB />;
        if (gamePercentage >= 25) return <FaceC />;
        return <FaceD />;
    }, [gamePercentage]);

    return (
        <View style={styles.containerHeader}>
            <View style={styles.header}>
                <View style={{marginHorizontal: 10, marginTop: 30}}>
                    <View>
                        <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                            <Pressable onPress={onMenuPress} style={styles.menuButton}>
                                <MaterialIcons name="menu" size={30} color="white" />
                            </Pressable>

                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <View style={styles.containerEmotion}>
                                    <View style={styles.emotion}>
                                        {moodFace}
                                    </View>
                                </View>
                                <View style={styles.containerBarEmotion}>
                                    <View style={[styles.barEmotion, { width: gamePercentage * 2.5 }]}></View>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={{marginTop: -5}}>
                        <Text style={styles.textHeader}>Sala de Juegos</Text>
                    </View>
                </View>
            </View>
        </View>
    );
});

// Componente para la información del usuario
const UserInfo = React.memo(() => {
    const { globalData } = useAppContext();
    
    // Cálculo del nivel basado en trofeos
    const calculateLevel = (trophies) => {
        const trophyCount = trophies || 0;
        return Math.floor(trophyCount / 10) + 1; // Nivel 1 para 0-9 trofeos, Nivel 2 para 10-19, etc.
    };
    
    return (
        <View style={styles.containerInfo}>
            <View style={styles.information}>
                <View style={styles.containerMonedas}>
                    <View style={styles.monedas}></View>
                    <Text style={styles.textMonedas}>x{globalData.coins || 0}</Text>
                </View>

                <View style={styles.containerLevel}>
                    <View style={styles.level}>
                        <Text style={styles.textLevel}>{calculateLevel(globalData.trophies)}</Text>
                    </View>
                </View>

                <View style={styles.containerVictorias}>
                    <View style={styles.victorias}>
                        <Image 
                            source={require("../../assets/img/Trofeo.png")} 
                            style={styles.imageWins} 
                            resizeMode="contain"
                        />
                    </View>
                    <Text style={styles.textVictorias}>x{globalData.trophies || 0}</Text>
                </View>
            </View>
        </View>
    );
});

export default function HomeScreen() {
    const { fontsLoaded, onLayoutRootView } = useCustomFonts();
    const navigation = useNavigation();
    const { refreshUserData, globalData } = useAppContext();
    const [availableGames, setAvailableGames] = useState([]);

    // Cargar juegos desde la API
    useEffect(() => {
        const loadGames = async () => {
            try {
                const gamesData = await gameService.getGames();
                setAvailableGames(gamesData);
            } catch (error) {
                console.error('Error al cargar juegos:', error);
            }
        };

        loadGames();
        refreshUserData();
    }, []);

    // Datos de los juegos
    const games = useMemo(() => {
        if (availableGames.length > 0) {
            return availableGames.map(game => ({
                id: game.game_ID,
                title: game.game_name,
                imageUrl: game.imageUrl || 'https://via.placeholder.com/300x200',
                navigateTo: game.screen_name || 'Game'
            }));
        }

        return [
            {
                id: 1,
                title: 'Memorama Matemático',
                imageUrl: 'https://raw.githubusercontent.com/EmilioNoyola/EmilioNoyola.github.io/refs/heads/main/IMG/MemoramaMatematico.webp',
                navigateTo: 'MemoramaMatematico'
            },
            {
                id: 2,
                title: 'Reflejos Matemáticos',
                imageUrl: 'https://raw.githubusercontent.com/EmilioNoyola/EmilioNoyola.github.io/refs/heads/main/IMG/MutipliTortuga.webp',
                navigateTo: 'MultipliTortuga'
            },
            {
                id: 3,
                title: 'DibujiTortuga',
                imageUrl: 'https://via.placeholder.com/300x200',
                navigateTo: 'DibujiTortuga'
            },
            {
                id: 4,
                title: 'Tortuga Alimenticia',
                imageUrl: 'https://via.placeholder.com/300x200',
                navigateTo: 'Juego4'
            },
            {
                id: 5,
                title: 'RapiTortuga',
                imageUrl: 'https://via.placeholder.com/300x200',
                navigateTo: 'Juego5'
            },
            {
                id: 6,
                title: 'Rompefracciones',
                imageUrl: 'https://via.placeholder.com/300x200',
                navigateTo: 'Juego6'
            },
            {
                id: 7,
                title: 'Tortuga Alimenticia 2',
                imageUrl: 'https://via.placeholder.com/300x200',
                navigateTo: 'Juego7'
            },
            {
                id: 8,
                title: 'Sopa de Tortuga',
                imageUrl: 'https://via.placeholder.com/300x200',
                navigateTo: 'Juego8'
            },
            {
                id: 9,
                title: 'Serpiente Matemática',
                imageUrl: 'https://raw.githubusercontent.com/EmilioNoyola/EmilioNoyola.github.io/refs/heads/main/IMG/JuegoSerpiente.webp',
                navigateTo: 'TortugaMatematica'
            }
        ]
    }, [availableGames]);

    if (!fontsLoaded) return null;

    return (
        <SafeAreaView style={styles.container} onLayout={onLayoutRootView}>
            <StatusBar
                barStyle="dark-content"
                translucent={true}
                backgroundColor="transparent"
            />

            <Header 
                onMenuPress={() => navigation.openDrawer()} 
                gamePercentage={globalData.gamePercentage || 0}
            />
            <UserInfo />

            <View style={styles.scrollArea}>
                <ScrollView 
                    contentContainerStyle={styles.scrollContainer}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                >
                    {games.map(game => (
                        <GameCard 
                            key={game.id}
                            title={game.title}
                            imageUrl={game.imageUrl}
                            navigateTo={game.navigateTo}
                        />
                    ))}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#CBEFD5',
    },
    containerHeader: {
        backgroundColor: '#A3E8AE',
    },
    header: {
        backgroundColor: '#4EC160',
        height: 164,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
    },
    textHeader: {
        fontSize: RFPercentage(6),
        color: 'white',
        fontFamily: 'Quicksand',
        textAlign: 'center',
    },
    menuButton: {
        backgroundColor: 'black',
        borderRadius: 70,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerEmotion: {
        backgroundColor: '#004A2B',
        borderRadius: 80,
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
        zIndex: 1,
    },
    emotion: {
        backgroundColor: '#99fa9d',
        borderRadius: 60,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 20,
        zIndex: 1,
        position: 'absolute',
    },
    containerBarEmotion: {
        backgroundColor: '#004A2B',
        borderTopRightRadius: 60,
        borderBottomRightRadius: 60,
        width: 250,
        height: 35,
        justifyContent: 'center',
        alignItems: 'right',
        marginLeft: -10,
    },
    barEmotion: {
        backgroundColor: '#5BF586',
        borderTopRightRadius: 60,
        borderBottomRightRadius: 60,
        height: 25, // Mantén solo la altura
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: -10,
    },
    containerInfo: {
        backgroundColor: '#A3E8AE',
        height: 105,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    information: {
        width: '95%',
        height: 70,
        backgroundColor: '#CBF9CD',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        gap: 40,
    },
    containerMonedas: {
        width: 90,
        height: 34,
        backgroundColor: '#4EC160',
        borderRadius: 20,
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',
    },
    monedas: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'orange',
    },
    textMonedas: {
        color: 'white',
        fontSize: 15,
        fontFamily: 'Quicksand_SemiBold',
        marginLeft: 5,
    },
    containerLevel: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#7fcc97',
        justifyContent: 'center',
        alignItems: 'center',
    },
    level: {
        width: 43,
        height: 43,
        borderRadius: 21,
        backgroundColor: '#398F53',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textLevel:{
        color: 'white',
        fontSize: 20,
        fontFamily: 'Quicksand_SemiBold',
    },
    containerVictorias: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    victorias: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageWins: {
        width: 30,
        height: 30,
    },
    textVictorias: {
        color: 'black',
        fontSize: 15,
        fontFamily: 'Quicksand_SemiBold',
    },
    scrollArea: {
        flex: 1,
        marginBottom: 18,
        backgroundColor: '#CBEFD5',
    },
    scrollContainer: {
        marginTop: 20,
        paddingHorizontal: 10,
        paddingBottom: 20,
    },
    card: {
        width: 360,
        height: 160,
        backgroundColor: '#004A2B',
        borderRadius: 35,
        marginBottom: 40,
        alignSelf: 'center',
        flexDirection: 'row',
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.8,
        shadowRadius: 0,
        elevation: 4,
    },
    containerImage: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1B5B44',
        width: 196,
        height: 138,
        borderRadius: 30,
        marginRight: 20,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 20,
    },
    textButtonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    cardText: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'Quicksand',
        textAlign: 'center',
    },
    containerButton: {
        width: 80,
        height: 55,
        marginTop: 10,
        padding: 10,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 7 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
        elevation: 5,
    }
});