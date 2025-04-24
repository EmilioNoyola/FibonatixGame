import React, { useEffect, useState } from 'react';
import { SafeAreaView, StatusBar, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import useCustomFonts from '../../../assets/components/FontsConfigure';
import { useAppContext } from '../../../assets/context/AppContext';
import { gameService } from '../../../assets/services/ApiService';
import { styles } from './components/HomeStyles';

import Header from './components/Header';
import UserInfo from './components/UserInfo';
import GameCard from './components/GameCard';

import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
    const { fontsLoaded, onLayoutRootView } = useCustomFonts();
    const { refreshUserData, globalData } = useAppContext();
    const [availableGames, setAvailableGames] = useState([]);
    const navigation = useNavigation();

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

    const games = availableGames.length > 0
        ? availableGames.map(game => ({
                id: game.game_ID,
                title: game.game_name,
                imageUrl: game.imageUrl || 'https://via.placeholder.com/300x200',
                navigateTo: game.screen_name || 'Game',
            }))
        : [
                {
                    id: 1,
                    title: 'Memorama Matemático',
                    imageUrl: 'https://raw.githubusercontent.com/EmilioNoyola/EmilioNoyola.github.io/refs/heads/main/IMG/MemoramaMatematico.webp',
                    navigateTo: 'MemoramaMatematico',
                },
                {
                    id: 2,
                    title: 'Reflejos Matemáticos',
                    imageUrl: 'https://raw.githubusercontent.com/EmilioNoyola/EmilioNoyola.github.io/refs/heads/main/IMG/MutipliTortuga.webp',
                    navigateTo: 'MultipliTortuga',
                },
                {
                    id: 3,
                    title: 'DibujiTortuga',
                    imageUrl: 'https://via.placeholder.com/300x200',
                    navigateTo: 'DibujiTortuga',
                },
                {
                    id: 4,
                    title: 'Tortuga Alimenticia',
                    imageUrl: 'https://via.placeholder.com/300x200',
                    navigateTo: 'Juego4',
                },
                {
                    id: 5,
                    title: 'RapiTortuga',
                    imageUrl: 'https://via.placeholder.com/300x200',
                    navigateTo: 'Juego5',
                },
                {
                    id: 6,
                    title: 'Rompefracciones',
                    imageUrl: 'https://via.placeholder.com/300x200',
                    navigateTo: 'Juego6',
                },
                {
                    id: 7,
                    title: 'Tortuga Alimenticia 2',
                    imageUrl: 'https://via.placeholder.com/300x200',
                    navigateTo: 'Juego7',
                },
                {
                    id: 8,
                    title: 'Sopa de Tortuga',
                    imageUrl: 'https://via.placeholder.com/300x200',
                    navigateTo: 'Juego8',
                },
                {
                    id: 9,
                    title: 'Serpiente Matemática',
                    imageUrl: 'https://raw.githubusercontent.com/EmilioNoyola/EmilioNoyola.github.io/refs/heads/main/IMG/JuegoSerpiente.webp',
                    navigateTo: 'TortugaMatematica',
                },
        ];

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