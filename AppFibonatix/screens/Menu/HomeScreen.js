// Componentes de React Native.
import React from 'react';  
import { Text, View, SafeAreaView, StatusBar, Pressable, StyleSheet, Image } from 'react-native';

// Navegación
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';

// Fuentes
import useCustomFonts from '../../apis/FontsConfigure';
import { RFPercentage } from 'react-native-responsive-fontsize';

// Íconos
import { MaterialIcons } from '@expo/vector-icons'; // Si estás usando Expo; si no, puedes usar otro ícono.
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { FaceA, FaceB, FaceC, FaceD } from '../../assets/img-svg';

export default function HomeScreen(props) {

    const { fontsLoaded, onLayoutRootView } = useCustomFonts();
    if (!fontsLoaded) return null;

    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.container} onLayout={onLayoutRootView}>

            <StatusBar
                barStyle="dark-content"
                translucent={true}
                backgroundColor="transparent"
            />

            <View style={styles.containerHeader}>
                <View style={styles.header}>
                    <View style={{marginHorizontal: 10, marginTop: 30}}>
                        <View>
                            <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                                <Pressable onPress={() => { navigation.openDrawer(); }} style={styles.menuButton}>
                                    <MaterialIcons name="menu" size={30} color="white" />
                                </Pressable>

                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                    <View style={styles.containerEmotion}>
                                        <View style={styles.Emotion}>
                                            <FaceA />
                                        </View>
                                    </View>
                                    <View style={styles.containerBarEmotion}>
                                        <View style={styles.BarEmotion}></View>
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

            <View style={styles.containerInfo}>
                <View style={styles.information}>
                    <View style={styles.containerMonedas}>
                        <View style={styles.Monedas}></View>
                        <Text style={styles.textMonedas}>x999</Text>
                    </View>

                    <View style={styles.containerLevel}>
                        <View style={styles.Level}>
                            <Text style={styles.textLevel}>1</Text>
                        </View>
                    </View>

                    <View style={styles.containerVictorias}>
                        <View style={styles.Victorias}>
                            <Image 
                                source={require("../../assets/img/Trofeo.png")} 
                                style={styles.imageWins} 
                                resizeMode="contain"
                            />
                        </View>
                        <Text style={styles.textVictorias}>x999</Text>
                    </View>
                </View>
            </View>

            <View style={styles.scrollArea}>
                <ScrollView 
                    contentContainerStyle={styles.scrollContainer}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                >
                    <View style={styles.Card}>
                        <View style={styles.containerImage}>
                            <Image
                                source={{ uri: 'https://raw.githubusercontent.com/EmilioNoyola/EmilioNoyola.github.io/refs/heads/main/IMG/MemoramaMatematico.webp' }} // Inserta la URL de tu imagen
                                style={styles.image}
                            />
                        </View>
                        <View style={styles.textButtonContainer}>
                            <Text style={styles.cardText}>Memorama Matemático</Text>
                            <Pressable 
                                style={({pressed}) => [
                                    {
                                        backgroundColor: pressed ? '#185D45' : '#1F7758',
                                    },
                                        styles.containerButton,
                                ]}
                                onPress={() => navigation.navigate('MemoramaMatematico')}
                            >
                                <FontAwesome5 name="play" size={24} color="white" />
                            </Pressable>
                        </View>
                    </View>
                    <View style={styles.Card}>
                        <View style={styles.containerImage}>
                            <Image
                                source={{ uri: 'https://raw.githubusercontent.com/EmilioNoyola/EmilioNoyola.github.io/refs/heads/main/IMG/MutipliTortuga.webp' }} // Inserta la URL de tu imagen
                                style={styles.image}
                            />
                        </View>
                        <View style={styles.textButtonContainer}>
                            <Text style={styles.cardText}>Reflejos Matemáticos</Text>
                            <Pressable 
                                style={({pressed}) => [
                                    {
                                        backgroundColor: pressed ? '#185D45' : '#1F7758',
                                    },
                                        styles.containerButton,
                                ]}
                                onPress={() => navigation.navigate('MultipliTortuga')} 
                            >
                                <FontAwesome5 name="play" size={24} color="white" />
                            </Pressable>
                        </View>
                    </View>
                    <View style={styles.Card}>
                        <View style={styles.containerImage}>
                            <Image
                                source={{ uri: 'https://your-image-url.com' }}
                                style={styles.image}
                            />
                        </View>
                        <View style={styles.textButtonContainer}>
                            <Text style={styles.cardText}>DibujiTortuga ( Juego 3 )</Text>
                            <Pressable 
                                style={({pressed}) => [
                                    {
                                        backgroundColor: pressed ? '#185D45' : '#1F7758',
                                    },
                                        styles.containerButton,
                                ]}
                                onPress={() => navigation.navigate('DibujiTortuga')} 
                            >
                                <FontAwesome5 name="play" size={24} color="white" />
                            </Pressable>
                        </View>
                    </View>
                    <View style={styles.Card}>
                        <View style={styles.containerImage}>
                            <Image
                                source={{ uri: 'https://your-image-url.com' }}
                                style={styles.image}
                            />
                        </View>
                        <View style={styles.textButtonContainer}>
                            <Text style={styles.cardText}>Tortuga Alimenticia ( Juego 4 )</Text>
                            <Pressable 
                                style={({pressed}) => [
                                    {
                                        backgroundColor: pressed ? '#185D45' : '#1F7758',
                                    },
                                        styles.containerButton,
                                ]}
                                onPress={() => navigation.navigate('Juego4')} 
                            >
                                <FontAwesome5 name="play" size={24} color="white" />
                            </Pressable>
                        </View>
                    </View>
                    <View style={styles.Card}>
                        <View style={styles.containerImage}>
                            <Image
                                source={{ uri: 'https://your-image-url.com' }}
                                style={styles.image}
                            />
                        </View>
                        <View style={styles.textButtonContainer}>
                            <Text style={styles.cardText}>RapiTortuga ( Juego 5 )</Text>
                            <Pressable 
                                style={({pressed}) => [
                                    {
                                        backgroundColor: pressed ? '#185D45' : '#1F7758',
                                    },
                                        styles.containerButton,
                                ]}
                                onPress={() => navigation.navigate('Juego5')} 
                            >
                                <FontAwesome5 name="play" size={24} color="white" />
                            </Pressable>
                        </View>
                    </View>
                    <View style={styles.Card}>
                        <View style={styles.containerImage}>
                            <Image
                                source={{ uri: 'https://your-image-url.com' }}
                                style={styles.image}
                            />
                        </View>
                        <View style={styles.textButtonContainer}>
                            <Text style={styles.cardText}>Rompefracciones ( Juego 6 )</Text>
                            <Pressable 
                                style={({pressed}) => [
                                    {
                                        backgroundColor: pressed ? '#185D45' : '#1F7758',
                                    },
                                        styles.containerButton,
                                ]}
                                onPress={() => navigation.navigate('Juego6')} 
                            >
                                <FontAwesome5 name="play" size={24} color="white" />
                            </Pressable>
                        </View>
                    </View>
                    <View style={styles.Card}>
                        <View style={styles.containerImage}>
                            <Image
                                source={{ uri: 'https://your-image-url.com' }}
                                style={styles.image}
                            />
                        </View>
                        <View style={styles.textButtonContainer}>
                            <Text style={styles.cardText}>Tortuga Alimenticia 2 ( Juego 7 )</Text>
                            <Pressable 
                                style={({pressed}) => [
                                    {
                                        backgroundColor: pressed ? '#185D45' : '#1F7758',
                                    },
                                        styles.containerButton,
                                ]}
                                onPress={() => navigation.navigate('Juego7')} 
                            >
                                <FontAwesome5 name="play" size={24} color="white" />
                            </Pressable>
                        </View>
                    </View>
                    <View style={styles.Card}>
                        <View style={styles.containerImage}>
                            <Image
                                source={{ uri: 'https://your-image-url.com' }}
                                style={styles.image}
                            />
                        </View>
                        <View style={styles.textButtonContainer}>
                            <Text style={styles.cardText}>Sopa de Tortuga ( Juego 8 )</Text>
                            <Pressable 
                                style={({pressed}) => [
                                    {
                                        backgroundColor: pressed ? '#185D45' : '#1F7758',
                                    },
                                        styles.containerButton,
                                ]}
                                onPress={() => navigation.navigate('Juego8')} 
                            >
                                <FontAwesome5 name="play" size={24} color="white" />
                            </Pressable>
                        </View>
                    </View>
                    <View style={styles.Card}>
                        <View style={styles.containerImage}>
                            <Image
                                source={{ uri: 'https://raw.githubusercontent.com/EmilioNoyola/EmilioNoyola.github.io/refs/heads/main/IMG/JuegoSerpiente.webp' }} // Inserta la URL de tu imagen
                                style={styles.image}
                            />
                        </View>
                        <View style={styles.textButtonContainer}>
                            <Text style={styles.cardText}>Serpiente Matemática</Text>
                            <Pressable 
                                style={({pressed}) => [
                                    {
                                        backgroundColor: pressed ? '#185D45' : '#1F7758',
                                    },
                                        styles.containerButton,
                                ]}
                                onPress={() => navigation.navigate('TortugaMatematica')} 
                            >
                                <FontAwesome5 name="play" size={24} color="white" />
                            </Pressable>
                        </View>
                    </View>
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
        height: 164, // Altura fija para el encabezado
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
    Emotion: {
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
    BarEmotion: {
        backgroundColor: '#5BF586', //
        borderTopRightRadius: 60,
        borderBottomRightRadius: 60,
        width: 200,
        height: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: -10,
    },
    containerInfo: {
        backgroundColor: '#A3E8AE',
        height: 105, // Altura fija para el contenedor
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        justifyContent: 'center', // Centra verticalmente el contenido
        alignItems: 'center', // Asegura que también esté centrado horizontalmente si es necesario
    },
    information: {
        width: '95%', // Ajusta el ancho para que no ocupe toda la pantalla
        height: 70,
        backgroundColor: '#CBF9CD',
        borderRadius: 20,
        justifyContent: 'center', // Centra el contenido dentro de la vista
        alignItems: 'center', // Opcional si quieres centrar contenido interno
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
    Monedas: {
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
    Level: {
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
        flex: 1, // Toma el espacio restante después del encabezado
        marginBottom: 18,
        backgroundColor: '#CBEFD5',
    },
    scrollContainer: {
        marginTop: 20,
        paddingHorizontal: 10,
        paddingBottom: 20, // Espacio adicional al final
    },
    Card: {
        width: 360,
        height: 160,
        backgroundColor: '#004A2B',
        borderRadius: 35,
        marginBottom: 40,
        alignSelf: 'center', // Centrado horizontal
        flexDirection: 'row', // Asegura que los elementos estén alineados horizontalmente
        padding: 10,
        shadowColor: '#000', // Color de la sombra
        shadowOffset: { width: 0, height: 8 }, // Posición de la sombra (debajo del botón)
        shadowOpacity: 0.8, // Opacidad de la sombra (muy opaca)
        shadowRadius: 0, // Sin difuminación
        elevation: 4, // Elevación para Android (opcional)
    },
    containerImage: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1B5B44',
        width: 196,
        height: 138,
        borderRadius: 30,
        marginRight: 20, // Espacio entre la imagen y el texto
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 20,
    },
    textButtonContainer: {
        justifyContent: 'center',
        alignItems: 'center', // Alinea el texto y el botón hacia la izquierda
        flex: 1, // Toma el espacio restante
    },
    cardText: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'Quicksand',
        textAlign: 'center', // Centra el texto
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
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    }
});

