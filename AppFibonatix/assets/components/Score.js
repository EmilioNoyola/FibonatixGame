import { Text, StyleSheet, View, Image } from "react-native";
import useCustomFonts from '../../apis/FontsConfigure';

export default function Score({ score, highScore }) {

  const { fontsLoaded, onLayoutRootView } = useCustomFonts();

  // Si las fuentes no están cargadas, se retorna null
  if (!fontsLoaded) return null;

  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
      {/* Sección de highScore */}
      <View style={styles.scoreContainer}>
        <Image 
          source={require("../img/Trofeo.png")} 
          style={styles.image} 
          resizeMode="contain" // Ajusta la imagen sin cortarla
        />
        <Text style={styles.text}>{highScore}</Text>
      </View>

      {/* Sección de score */}
      <View style={styles.scoreContainer}>
        <Image 
          source={require("../img/TortugaJuego.png")} 
          style={styles.image2} 
          resizeMode="contain" // Ajusta la imagen sin cortarla
        />
        <Text style={styles.text}>{score}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', // Alinea los "highScore" y "score" horizontalmente
    justifyContent: 'space-between', // Distribuye el espacio entre ellos
    alignItems: 'center', // Centra las secciones verticalmente
    paddingHorizontal: 10, // Espacio lateral
  },
  scoreContainer: {
    flexDirection: 'row', // Alinea la imagen y el texto en una línea
    alignItems: 'center', // Centra verticalmente la imagen y el texto
    marginHorizontal: 10, // Espacio entre cada sección
  },
  text: {
    fontSize: 26,
    fontFamily: 'Quicksand',
    color: '#572364',
    marginLeft: 5, // Espacio entre la imagen y el texto
  },
  image: {
    width: 35, // Anchura deseada
    height: 35, // Altura deseada
  },
  image2: {
    width: 50, // Anchura deseada
    height: 50, // Altura deseada
  },
});
