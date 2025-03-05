import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, Image } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring 
} from 'react-native-reanimated';
import Svg, { Path } from "react-native-svg";

const alimentos = [
  { id: 1, nombre: 'Camaron', imagen: { uri: 'https://raw.githubusercontent.com/EmilioNoyola/FibonatixGame/refs/heads/main/IMG/Comida/Inventario/Camaron.png' }, cantidad: 10 },
  { id: 2, nombre: 'Calamar', imagen: { uri: 'https://raw.githubusercontent.com/EmilioNoyola/FibonatixGame/refs/heads/main/IMG/Comida/Inventario/Calamar.png' }, cantidad: 25 },
  { id: 3, nombre: 'Melón', imagen: { uri: 'https://raw.githubusercontent.com/EmilioNoyola/FibonatixGame/refs/heads/main/IMG/Comida/Inventario/Melon.png' }, cantidad: 40 },
  { id: 4, nombre: 'Berenjena', imagen: { uri: 'https://raw.githubusercontent.com/EmilioNoyola/FibonatixGame/refs/heads/main/IMG/Comida/Inventario/Berenjena.png' }, cantidad: 30 },
  { id: 5, nombre: 'Aguacate', imagen: { uri: 'https://raw.githubusercontent.com/EmilioNoyola/FibonatixGame/refs/heads/main/IMG/Comida/Inventario/Aguacate.png' }, cantidad: 15 },
  { id: 6, nombre: 'Mango', imagen: { uri: 'https://raw.githubusercontent.com/EmilioNoyola/FibonatixGame/refs/heads/main/IMG/Comida/Inventario/Mango.png' }, cantidad: 9 },
  { id: 7, nombre: 'Naranja', imagen: { uri: 'https://raw.githubusercontent.com/EmilioNoyola/FibonatixGame/refs/heads/main/IMG/Comida/Inventario/Naranja.png' }, cantidad: 7 },
  { id: 8, nombre: 'Manzana', imagen: { uri: 'https://raw.githubusercontent.com/EmilioNoyola/FibonatixGame/refs/heads/main/IMG/Comida/Inventario/Manzana.png' }, cantidad: 6 },
];

export default function InventaryList() {
  const [indice, setIndice] = useState(2); 

  const cambiarAlimento = (direccion) => {
    let nuevoIndice = direccion === 'izquierda' ? indice - 1 : indice + 1;
    if (nuevoIndice < 0) nuevoIndice = alimentos.length - 1;
    if (nuevoIndice >= alimentos.length) nuevoIndice = 0;
    setIndice(nuevoIndice);
  };

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
          // Se calcula el índice de forma circular
          let index = (indice + offset + alimentos.length) % alimentos.length;
          let item = alimentos[index];
          const isActive = offset === 0;
          return (
            <InventaryItem 
              key={item.id} 
              item={item} 
              isActive={isActive} 
              offset={offset} 
            />
          );
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
    </View>
  );
}

// Componente de ítem individual
function InventaryItem({ item, isActive, offset }) {
  // Reducimos el factor para el desplazamiento horizontal:
  const baseOffset = 15; // Prueba con 10 o 15 según tu diseño

  // Valores compartidos para la traslación y la escala
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
        <Image source={item.imagen} style={styles.image} />
      </Animated.View>
      {isActive && (
        <View style={styles.priceTab}>
          <Text style={styles.priceText}>{item.cantidad}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  containerInventary: {
    width: '90%',
    height: '50%',
    backgroundColor: '#ffd6ad',
    borderRadius: 30,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 5,
    borderColor: '#d16a00',
  },
  itemsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 15,
    // width: '65%',
  },
  itemContainer: {
    alignItems: 'center',
  },
  item: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  image: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  priceTab: {
    marginTop: '20%',
    backgroundColor: '#d16a00',
    width: '80%',
    height: '50%',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#d16a00',
    borderWidth: 5,
    zIndex: 1,
  },
  priceText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  arrowButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
