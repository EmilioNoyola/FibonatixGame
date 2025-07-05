import React, { useState, useEffect, useRef } from 'react';  
import { Text, View, SafeAreaView, StatusBar, Pressable, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons'; 
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useBluetooth } from '../../../assets/context/BluetoothContext';
import { plushieService } from '../../../assets/services/PlushieService';
import useCustomFonts from '../../../assets/components/FontsConfigure';
import FoodShop from './components/FoodShop';
import InventaryList from './components/InventaryList';
import { useAppContext } from '../../../assets/context/AppContext';
import AnimatedBar from '../../../assets/components/AnimatedBar';
import StatusAlertModal from '../../../assets/components/StatusAlertModal';
import { styles } from './components/FoodRoomStyles';
import axios from 'axios';

const API_BASE_URL = 'https://shurtleserver-production.up.railway.app/';

export default function FoodRoomScreen(props) {
    const { fontsLoaded, onLayoutRootView } = useCustomFonts();
    const { globalData, refreshUserData, alert, setAlert, updateFoodPercentage, updateCoins } = useAppContext();
    const [refreshing, setRefreshing] = useState(false);
    const [inventory, setInventory] = useState([]);
    const navigation = useNavigation();
    const { isConnected, writeToCharacteristic } = useBluetooth();
    const cleanupFSRRef = useRef(null);

    useEffect(() => {
        if (!fontsLoaded) return;

        fetchInventory();
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
    }, [fontsLoaded, alert, isConnected, globalData.clientId]);

    const fetchInventory = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}api/foodInventory/${globalData.clientId}`);
            const foodInventory = response.data || [];
            setInventory(foodInventory.map(item => ({
                foodId: item.food_ID,
                foodName: item.food_name,
                foodStock: item.food_stock,
                image: { uri: item.food_image_url }
            })));
        } catch (error) {
            console.error('Error fetching inventory:', error);
            setInventory([]); // Asegurar que inventory no sea undefined
            setAlert({ type: 'error', message: 'Error al cargar el inventario.' });
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        try {
            await refreshUserData();
            await fetchInventory();
        } catch (error) {
            console.error('Error al recargar datos globales:', error);
            setAlert({ type: 'error', message: 'Error al recargar datos.' });
        } finally {
            setRefreshing(false);
        }
    };

    const handleFeed = async (foodId) => {
        const item = inventory.find(i => i.foodId === foodId);
        if (!item || item.foodStock <= 0) {
            setAlert({ type: 'warning', message: 'No tienes este alimento en tu inventario.' });
            return;
        }

        try {
            const response = await axios.post(`${API_BASE_URL}api/feedPet/${globalData.clientId}`, { foodId });
            await updateFoodPercentage(response.data.foodPercentage || 10);
            await updateCoins(-item.food_price * 0.1); // Ajustar según lógica de costo
            await fetchInventory();
            setAlert({ type: 'success', message: '¡Tu mascota ha sido alimentada!' });
        } catch (error) {
            console.error('Error feeding pet:', error);
            setAlert({ type: 'error', message: 'Error al alimentar. Intenta de nuevo.' });
        }
    };

    if (!fontsLoaded) return null;

    return (
        <SafeAreaView style={styles.container} onLayout={onLayoutRootView}>
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor="#FFA851"
                        colors={['#FFA851']}
                    />
                }
            >
                <StatusBar
                    barStyle="dark-content"
                    translucent={true}
                    backgroundColor="transparent"
                />

                <View style={styles.header}>
                    <View style={{ marginHorizontal: 10, marginTop: 30 }}>
                        <View>
                            <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                                <Pressable onPress={() => { navigation.openDrawer(); }} style={styles.menuButton}>
                                    <MaterialIcons name="menu" size={30} color="white" />
                                </Pressable>

                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                    <View style={styles.containerEmotion}>
                                        <View style={styles.Emotion}>
                                            <MaterialCommunityIcons name="food-apple-outline" size={40} color="#6d3709" />
                                        </View>   
                                    </View>
                                    <AnimatedBar
                                        percentage={globalData.foodPercentage || 0}
                                        barStyle={styles.BarEmotion}
                                        containerStyle={styles.containerBarEmotion}
                                    />
                                </View>
                            </View>
                        </View>

                        <View style={{ marginTop: -5 }}>
                            <Text style={styles.textHeader}>Comedor</Text>
                        </View>
                    </View>
                </View>

                <FoodShop />

                <View style={styles.containerInventary}>
                    <View style={styles.containerButtonAlimentar}>
                        <Pressable 
                            style={styles.buttonAlimentar}
                            onPress={() => {
                                if (inventory.length === 0 || !inventory[indice]?.foodStock > 0) {
                                    setAlert({ type: 'warning', message: 'No tienes alimentos para alimentar.' });
                                    return;
                                }
                                handleFeed(inventory[indice].foodId);
                            }}
                        >
                            <Text style={styles.textButtonAlimentar}>Alimentar</Text>
                        </Pressable>
                    </View>
                    <View style={styles.containerFood}>
                        <InventaryList inventory={inventory} onFeed={handleFeed} />
                        <Text style={styles.textFood}>Almacén</Text>
                    </View>
                </View>
            </ScrollView>
            <StatusAlertModal
                key={alert ? `${alert.type}-${alert.level}-${globalData.lastAlertTime}` : null}
                visible={!!alert}
                type={alert?.type}
                onClose={() => setAlert(null)}
            />
        </SafeAreaView>
    );
}