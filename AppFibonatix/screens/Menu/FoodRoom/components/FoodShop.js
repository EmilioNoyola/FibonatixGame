import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Pressable, FlatList, Image, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Svg, { Path } from "react-native-svg";
import axios from 'axios';
import { useAppContext } from '../../../assets/context/AppContext';

import { styles } from './FoodRoomStyles';

const API_BASE_URL = 'https://shurtleserver-production.up.railway.app/';

export default function FoodShop() {
    const { clientId, globalData, updateCoins } = useAppContext();
    const [foodItems, setFoodItems] = useState([]);
    const [indice, setIndice] = useState(0);
    const [cantidad, setCantidad] = useState(1);
    const [loading, setLoading] = useState(true);
    const flatListRef = useRef(null);

    useEffect(() => {
        const fetchFoodItems = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}api/food`);
                setFoodItems(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching food items:', error);
                setLoading(false);
            }
        };
        
        fetchFoodItems();
    }, []);

    const cambiarAlimento = (direccion) => {
        if (foodItems.length === 0) return;
        
        let nuevoIndice = indice + (direccion === 'derecha' ? 1 : -1);
        if (nuevoIndice < 0) nuevoIndice = foodItems.length - 1;
        if (nuevoIndice >= foodItems.length) nuevoIndice = 0;
        setIndice(nuevoIndice);
        flatListRef.current?.scrollToIndex({ index: nuevoIndice, animated: true });
    };

    const handlePurchase = async () => {
        if (foodItems.length === 0) return;
        
        const selectedFood = foodItems[indice];
        const totalCost = selectedFood.food_price * cantidad;
        
        if (globalData.coins < totalCost) {
            Alert.alert('Error', 'No tienes suficientes monedas', [{ text: 'OK' }]);
            return;
        }

        try {
            const response = await axios.post(`${API_BASE_URL}api/purchaseFood/${clientId}`, {
                food_ID: selectedFood.food_ID,
                quantity: cantidad
            });

            // Actualizar monedas en el contexto
            await updateCoins(-totalCost);
            
            Alert.alert('Éxito', `Has comprado ${cantidad} ${selectedFood.food_name}`, [{ text: 'OK' }]);
            setCantidad(1);
        } catch (error) {
            console.error('Error purchasing food:', error);
            Alert.alert('Error', error.response?.data?.message || 'Error al comprar el alimento', [{ text: 'OK' }]);
        }
    };

    if (loading) {
        return (
            <View style={styles.containerShop}>
                <Text>Cargando alimentos...</Text>
            </View>
        );
    }

    if (foodItems.length === 0) {
        return (
            <View style={styles.containerShop}>
                <Text>No hay alimentos disponibles</Text>
            </View>
        );
    }

    return (
        <View style={styles.containerShop}>
            <View style={styles.containerOption}>
                <Text style={styles.textOption}>{foodItems[indice].food_name}</Text>
                <View style={styles.Option}>
                    <Pressable onPress={() => cambiarAlimento('izquierda')}>
                        <Svg width={22} height={37} fill="none">
                            <Path fill="#BA591D" d="M16.374 36.087.924 20.823a2.9 2.9 0 0 1-.712-1.079A3.6 3.6 0 0 1 0 18.5q0-.663.212-1.244a2.9 2.9 0 0 1 .712-1.079L16.374.913Q17.298 0 18.725 0t2.351.913T22 3.235t-.924 2.323L7.977 18.5l13.1 12.942q.923.912.923 2.323 0 1.41-.924 2.322t-2.35.913q-1.429 0-2.352-.913" />
                        </Svg>
                    </Pressable>
                    <View style={styles.flatListContainer}>
                        <FlatList
                            ref={flatListRef}
                            data={foodItems}
                            horizontal
                            pagingEnabled
                            snapToAlignment="center"
                            snapToInterval={styles.ITEM_WIDTH}
                            decelerationRate="fast"
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item) => item.food_ID.toString()}
                            getItemLayout={(data, index) => ({ 
                                length: styles.ITEM_WIDTH, 
                                offset: styles.ITEM_WIDTH * index, 
                                index 
                            })}
                            contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}
                            renderItem={({ item }) => (
                                <View style={styles.containerCircleFood}>
                                    <Image 
                                        source={{ uri: item.food_image_url }} 
                                        style={styles.imageFood} 
                                    />
                                </View>
                            )}
                            scrollEnabled={false}
                        />
                    </View>
                    <Pressable onPress={() => cambiarAlimento('derecha')}>
                        <Svg width={22} height={38} fill="none">
                            <Path fill="#BA591D" d="M.924 37.063Q0 36.126 0 34.677q0-1.447.924-2.386L14.023 19 .923 5.709Q0 4.772 0 3.323T.924.937 3.274 0q1.428 0 2.352.937l15.45 15.677q.504.511.716 1.108Q22 18.319 22 19t-.208 1.278q-.212.597-.716 1.108L5.626 37.063Q4.702 38 3.275 38t-2.351-.937" />
                        </Svg>
                    </Pressable>
                </View>
            </View>
            <View style={styles.info}>
                <View style={styles.precio}>
                    <View style={styles.coin}></View>
                    <Text style={styles.textPrecio}>x{foodItems[indice].food_price}</Text>
                </View>
                <View style={styles.cantidad}>
                    <Pressable onPress={() => setCantidad(Math.max(1, cantidad - 1))}>
                        <MaterialIcons name="remove-circle-outline" size={30} color="#BA591D" />
                    </Pressable>
                    <Text style={styles.textCantidad}>{cantidad}</Text>
                    <Pressable onPress={() => setCantidad(Math.min(10, cantidad + 1))}>
                        <MaterialIcons name="add-circle-outline" size={30} color="#BA591D" />
                    </Pressable>
                </View>
                <Pressable style={styles.buttonComprar} onPress={handlePurchase}>
                    <Text style={styles.textComprar}>Comprar</Text>
                </Pressable>
            </View>
        </View>
    );
}