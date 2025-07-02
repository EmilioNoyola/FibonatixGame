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

export default function FoodRoomScreen(props) {
    const { fontsLoaded, onLayoutRootView } = useCustomFonts();
    const { globalData, refreshUserData, alert, setAlert } = useAppContext();
    const [refreshing, setRefreshing] = useState(false);
    if (!fontsLoaded) return null;

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
                        <Pressable style={styles.buttonAlimentar}>
                            <Text style={styles.textButtonAlimentar}>Alimentar</Text>
                        </Pressable>
                    </View>
                    <View style={styles.containerFood}>
                        <InventaryList />
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