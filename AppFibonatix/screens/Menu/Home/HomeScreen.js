import React, { useEffect, useState, useRef } from 'react';
import { SafeAreaView, StatusBar, View, RefreshControl } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useBluetooth } from '../../../assets/context/BluetoothContext';
import { plushieService } from '../../../assets/services/PlushieService';
import useCustomFonts from '../../../assets/components/FontsConfigure';
import { useAppContext } from '../../../assets/context/AppContext';
import { gameService } from '../../../assets/services/ApiService';
import { styles } from './components/HomeStyles';
import Header from './components/Header';
import UserInfo from './components/UserInfo';
import GameCard from './components/GameCard';
import PlushieModal from './components/PlushieModal';
import StatusAlertModal from '../../../assets/components/StatusAlertModal';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
    const { fontsLoaded, onLayoutRootView } = useCustomFonts();
    const { refreshUserData, globalData, alert, setAlert } = useAppContext();
    const [availableGames, setAvailableGames] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const navigation = useNavigation();
    const { isConnected, writeToCharacteristic } = useBluetooth();
    const cleanupFSRRef = useRef(null);

    useEffect(() => {
        if (alert && isConnected) {
            if (cleanupFSRRef.current?.pauseMonitoring) {
                cleanupFSRRef.current.pauseMonitoring();
            }
            
            plushieService.handleStatusAlert(writeToCharacteristic, isConnected, alert);
            
            const timer = setTimeout(() => {
                setAlert(null);
                if (cleanupFSRRef.current?.resumeMonitoring) {
                    cleanupFSRRef.current.resumeMonitoring();
                }
            }, 3000);
            
            return () => clearTimeout(timer);
        }
    }, [alert, isConnected]);

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

    const onRefresh = async () => {
        setRefreshing(true);
        try {
            await refreshUserData();
        } catch (error) {
            console.error('Error al recargar datos globales:', error);
        } finally {
            setRefreshing(false);
        }
    };

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
            <UserInfo onOpenModal={() => setModalVisible(true)} />

            <View style={styles.scrollArea}>
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor="#4EC160"
                        colors={['#4EC160']}
                        />
                    }
                    >
                    {games.map(game => (
                        <GameCard
                            key={game.id}
                            title={game.title}
                            imageUrl={game.imageUrl}
                            navigateTo={game.navigateTo}
                            id={game.id} 
                        />
                    ))}
                    </ScrollView>
            </View>

            <PlushieModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
            />
            
            <StatusAlertModal
                key={alert ? `${alert.type}-${alert.level}-${globalData.lastAlertTime}` : null}
                visible={!!alert}
                type={alert?.type}
                onClose={() => setAlert(null)}
            />
        </SafeAreaView>
    );
}