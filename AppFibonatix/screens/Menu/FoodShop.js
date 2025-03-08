import React, { useState, useRef } from 'react';
import { View, Text, Pressable, StyleSheet, FlatList, Image, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Svg, { Path } from "react-native-svg"

const { width } = Dimensions.get('window');
const ITEM_WIDTH = 200;
const alimentos = [
    { id: 1, nombre: 'Camarones', precio: 50, imagen: { uri: 'https://raw.githubusercontent.com/EmilioNoyola/FibonatixGame/refs/heads/main/IMG/Comida/Tienda/Camarones.png' } },
    { id: 2, nombre: 'Calamares', precio: 85, imagen: { uri: 'https://raw.githubusercontent.com/EmilioNoyola/FibonatixGame/refs/heads/main/IMG/Comida/Tienda/Calamares.png'} },
    { id: 3, nombre: 'Melones', precio: 120, imagen: { uri: 'https://raw.githubusercontent.com/EmilioNoyola/FibonatixGame/refs/heads/main/IMG/Comida/Tienda/Melones.png' } },
    { id: 4, nombre: 'Berenjenas', precio: 40, imagen: { uri: 'https://raw.githubusercontent.com/EmilioNoyola/FibonatixGame/refs/heads/main/IMG/Comida/Tienda/Berenjenas.png' } },
    { id: 5, nombre: 'Aguacates', precio: 60, imagen: { uri: 'https://raw.githubusercontent.com/EmilioNoyola/FibonatixGame/refs/heads/main/IMG/Comida/Tienda/Aguacates.png' } },
    { id: 6, nombre: 'Mangos', precio: 70, imagen: { uri: 'https://raw.githubusercontent.com/EmilioNoyola/FibonatixGame/refs/heads/main/IMG/Comida/Tienda/Mangos.png' } },
    { id: 7, nombre: 'Naranjas', precio: 35, imagen: { uri: 'https://raw.githubusercontent.com/EmilioNoyola/FibonatixGame/refs/heads/main/IMG/Comida/Tienda/Naranjas.png' } },
    { id: 8, nombre: 'Manzanas', precio: 20, imagen: { uri: 'https://raw.githubusercontent.com/EmilioNoyola/FibonatixGame/refs/heads/main/IMG/Comida/Tienda/Manzanas.png' } },
];

export default function FoodShop() {
    const [indice, setIndice] = useState(0);
    const [cantidad, setCantidad] = useState(1);
    const flatListRef = useRef(null);

    const cambiarAlimento = (direccion) => {
        let nuevoIndice = indice + (direccion === 'derecha' ? 1 : -1);
        if (nuevoIndice < 0) nuevoIndice = alimentos.length - 1;
        if (nuevoIndice >= alimentos.length) nuevoIndice = 0;
        setIndice(nuevoIndice);
        flatListRef.current.scrollToIndex({ index: nuevoIndice, animated: true });
    };

    return (
        <View style={styles.containerShop}>
            <View style={styles.containerOption}>
                <Text style={styles.textOption}>{alimentos[indice].nombre}</Text>
                <View style={styles.Option}>
                    <Pressable onPress={() => cambiarAlimento('izquierda')}>
                        <Svg
                            width={22}
                            height={37}
                            fill="none"
                        >
                            <Path
                                fill="#BA591D"
                                d="M16.374 36.087.924 20.823a2.9 2.9 0 0 1-.712-1.079A3.6 3.6 0 0 1 0 18.5q0-.663.212-1.244a2.9 2.9 0 0 1 .712-1.079L16.374.913Q17.298 0 18.725 0t2.351.913T22 3.235t-.924 2.323L7.977 18.5l13.1 12.942q.923.912.923 2.323 0 1.41-.924 2.322t-2.35.913q-1.429 0-2.352-.913"
                            />
                        </Svg>
                    </Pressable>
                    <View style={styles.flatListContainer}>
                        <FlatList
                            ref={flatListRef}
                            data={alimentos}
                            horizontal
                            pagingEnabled
                            snapToAlignment="center"
                            snapToInterval={ITEM_WIDTH}
                            decelerationRate="fast"
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item) => item.id.toString()}
                            getItemLayout={(data, index) => ({ length: ITEM_WIDTH, offset: ITEM_WIDTH * index, index })}
                            contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}
                            renderItem={({ item }) => (
                                <View style={styles.containerCircleFood}>
                                    <Image source={item.imagen} style={styles.imageFood} />
                                </View>
                            )}
                            scrollEnabled={false}
                        />
                    </View>
                    <Pressable onPress={() => cambiarAlimento('derecha')}>
                        <Svg
                            width={22}
                            height={38}
                            fill="none"
                        >
                            <Path
                            fill="#BA591D"
                            d="M.924 37.063Q0 36.126 0 34.677q0-1.447.924-2.386L14.023 19 .923 5.709Q0 4.772 0 3.323T.924.937 3.274 0q1.428 0 2.352.937l15.45 15.677q.504.511.716 1.108Q22 18.319 22 19t-.208 1.278q-.212.597-.716 1.108L5.626 37.063Q4.702 38 3.275 38t-2.351-.937"
                            />
                        </Svg>
                    </Pressable>
                </View>
            </View>
            <View style={styles.info}>
                    <View style={styles.precio}>
                        <View style={styles.coin}></View>
                        <Text style={styles.textPrecio}>x{alimentos[indice].precio}</Text>
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
                    <Pressable style={styles.buttonComprar}>
                        <Text style={styles.textComprar}>Comprar</Text>
                    </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    containerShop: {
        flex: 1,
        alignItems: 'center',
        marginTop: 10,
    },
    containerOption: {
        alignItems: 'center',
    },
    textOption: {
        marginBottom: 10,
        fontSize: 24,
        fontFamily: 'Quicksand',
        color: 'black',
        textAlign: 'center',
    },
    Option: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    flatListContainer: {
        width: ITEM_WIDTH,
        overflow: 'hidden',
        marginHorizontal: 20,
    },
    containerCircleFood: {
        width: ITEM_WIDTH,
        height: ITEM_WIDTH,
        borderRadius: ITEM_WIDTH / 2,
        backgroundColor: '#6d3709',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageFood: {
        width: ITEM_WIDTH - 20,
        height: ITEM_WIDTH - 20,
        resizeMode: 'contain',
        borderRadius: (ITEM_WIDTH - 40) / 2,
    },
    containerInfo: {
        marginTop: '3%',
        width: '90%',
        height: '20%',
        backgroundColor: '#E97B36',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    info: {
        marginTop: '3%',
        width: '90%',
        height: '20%',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 7,
        borderColor: '#994c00',
        backgroundColor: '#ffc78f',
        flexDirection: 'row',
    },
    precio: {
        width: '30%',
        height: '50%',
        backgroundColor: '#D78B49',
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    coin: {
        width: 40,
        height: 40,
        backgroundColor: 'orange',
        borderRadius: 20,
    },
    textPrecio: {
        color: 'black',
        fontSize: 15,
        fontFamily: 'Quicksand',
        marginLeft: 7,
    },
    cantidad: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 10,
    },
    textCantidad: {
        color: 'black',
        fontSize: 25,
        fontFamily: 'Quicksand',
        marginHorizontal: 10,
    },
    buttonComprar: {
        width: '30%',
        height: '50%',
        backgroundColor: '#8A460B',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000', // Color de la sombra
        shadowOffset: { width: 0, height: 4 }, // Posición de la sombra (debajo del botón)
        shadowOpacity: 0.8, // Opacidad de la sombra (muy opaca)
        shadowRadius: 0, // Sin difuminación
        elevation: 4, // Elevación para Android (opcional)
    },
    textComprar: {
        color: 'white',
        fontSize: 15,
        fontFamily: 'Quicksand_Medium',
    },
});