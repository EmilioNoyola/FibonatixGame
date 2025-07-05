import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Image, Alert } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import Svg, { Path } from "react-native-svg";
import { StyleSheet, Dimensions } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';

// Obtener dimensiones de la pantalla
const { width, height } = Dimensions.get('window');

// Definir una proporción base para escalar elementos (basada en un ancho de diseño de 414px)
const scale = width / 414;

// Ajustar ITEM_WIDTH para que sea responsivo (originalmente 200px en un diseño de 414px)
const ITEM_WIDTH = 200 * scale;

export default function InventaryList({ inventory = [], onFeed }) {
  const [indice, setIndice] = useState(0);

  const cambiarAlimento = (direccion) => {
    if (!inventory || inventory.length === 0) return;
    let nuevoIndice = direccion === 'izquierda' ? indice - 1 : indice + 1;
    if (nuevoIndice < 0) nuevoIndice = inventory.length - 1;
    if (nuevoIndice >= inventory.length) nuevoIndice = 0;
    setIndice(nuevoIndice);
  };

  const handleFeedPress = () => {
    if (!inventory || !inventory[indice] || inventory[indice].foodStock <= 0) {
      Alert.alert('Error', 'No hay suficiente stock para alimentar.');
      return;
    }
    onFeed(inventory[indice].foodId);
  };

  if (!inventory || inventory.length === 0) {
    return (
      <View style={styles.containerInventary}>
        <Text>No hay alimentos en el inventario</Text>
      </View>
    );
  }

  return (
    <View style={styles.containerInventary}>
      {/* Botón Izquierdo */}
      <Pressable onPress={() => cambiarAlimento('izquierda')} style={styles.arrowButton}>
        <Svg width={14} height={24} fill="none">
          <Path
            fill="#BA591D"
            d="M10.42 23.408.588 13.507a1.9 1.9 0 0 1-.453-.7A2.4 2.4 0 0 1 0 12q0-.43.135-.807.132-.376.453-.7L10.42.592Q11.008 0 11.916 0q.909 0 1.496.592.588.592.588 1.507t-.588 1.506L5.076 12l8.336 8.395Q14 20.986 14 21.9q0 .916-.588 1.507-.588.592-1.496.592-.909 0-1.496-.592"
          />
        </Svg>
      </Pressable>

      {/* Elementos del Inventario */}
      <View style={styles.itemsContainer}>
        {[-1, 0, 1].map((offset) => {
          const index = (indice + offset + inventory.length) % inventory.length;
          const item = inventory[index];
          const isActive = offset === 0;
          return item ? (
            <InventaryItem
              key={item.foodId}
              item={item}
              isActive={isActive}
              offset={offset}
            />
          ) : null;
        })}
      </View>

      {/* Botón Derecho */}
      <Pressable onPress={() => cambiarAlimento('derecha')} style={styles.arrowButton}>
        <Svg width={14} height={24} fill="none">
          <Path
            fill="#BA591D"
            d="m3.58.592 9.832 9.901q.321.324.453.7.135.376.135.807 0 .43-.135.807-.132.376-.453.7L3.58 23.408Q2.993 24 2.084 24t-1.496-.592T0 21.901t.588-1.506L8.924 12 .588 3.605Q0 3.014 0 2.1T.588.592 2.084 0 3.58.592"
          />
        </Svg>
      </Pressable>

      {/* Botón de Alimentar */}
      <Pressable style={styles.feedButton} onPress={handleFeedPress}>
        <Text style={styles.feedButtonText}>Alimentar</Text>
      </Pressable>
    </View>
  );
}

// Componente de ítem individual
function InventaryItem({ item, isActive, offset }) {
  const baseOffset = 7; // Ajustado para separación compacta

  const translation = useSharedValue(offset * baseOffset);
  const scale = useSharedValue(isActive ? 1.2 : 1);

  useEffect(() => {
    translation.value = withSpring(offset * baseOffset, {
      damping: 15,
      stiffness: 150,
    });
    scale.value = withSpring(isActive ? 1.2 : 1, {
      damping: 15,
      stiffness: 150,
    });
  }, [offset, isActive]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: isActive ? 1 : 0.5,
    transform: [
      { translateX: translation.value },
      { scale: scale.value },
    ]
  }));

  return (
    <View style={styles.itemContainer}>
      <Animated.View style={[styles.item, animatedStyle]}>
        <Image source={item.image} style={styles.image} />
      </Animated.View>
      {isActive && (
        <View style={styles.priceTab}>
          <Text style={styles.priceText}>{item.foodStock || 0}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  containerInventary: {
    width: '80%',
    height: '40%',
    backgroundColor: '#ffd6ad',
    borderRadius: 30 * scale,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 5 * scale,
    borderColor: '#d16a00',
  },
  itemsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 18 * scale,
  },
  itemContainer: {
    alignItems: 'center',
  },
  item: {
    width: 50 * scale,
    height: 50 * scale,
    borderRadius: 25 * scale,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  image: {
    width: 40 * scale,
    height: 40 * scale,
    resizeMode: 'contain',
  },
  priceTab: {
    marginTop: '15%',
    backgroundColor: '#d16a00',
    width: '80%',
    height: '70%',
    borderRadius: 10 * scale,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#d16a00',
    borderWidth: 5 * scale,
    zIndex: 1,
  },
  priceText: {
    color: 'white',
    fontSize: 15 * scale,
    fontWeight: 'bold',
  },
  arrowButton: {
    width: 40 * scale,
    height: 40 * scale,
    justifyContent: 'center',
    alignItems: 'center',
  },
  feedButton: {
    position: 'absolute',
    bottom: 10 * scale,
    left: '50%',
    transform: [{ translateX: -50 * scale }],
    backgroundColor: '#BA591D',
    paddingVertical: 8 * scale,
    paddingHorizontal: 20 * scale,
    borderRadius: 15 * scale,
    alignItems: 'center',
  },
  feedButtonText: {
    color: 'white',
    fontSize: 16 * scale,
    fontWeight: 'bold',
  },
});