import { StyleSheet, Dimensions } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';

// Obtener dimensiones de la pantalla
const { width, height } = Dimensions.get('window');

// Definir una proporción base para escalar elementos (basada en un ancho de diseño de 414px, típico de iPhone 14 Pro)
const scale = width / 414;

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#CBEFD5',
    },
    containerHeader: {
        backgroundColor: '#A3E8AE',
    },
    header: {
        backgroundColor: '#4EC160',
        height: height * 0.20, // 25% de la altura de la pantalla (aproximadamente 164px en un iPhone 14 Pro)
        borderBottomLeftRadius: 15 * scale,
        borderBottomRightRadius: 15 * scale,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textHeader: {
        fontSize: RFPercentage(5), // Escala según el tamaño de pantalla (antes era RFPercentage(6))
        color: 'white',
        fontFamily: 'Quicksand',
        textAlign: 'center',
    },
    menuButton: {
        backgroundColor: 'black',
        borderRadius: 70 * scale,
        width: 50 * scale,
        height: 50 * scale,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10 * scale,
    },
    containerEmotion: {
        backgroundColor: '#004A2B',
        borderRadius: 80 * scale,
        width: 60 * scale,
        height: 60 * scale,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10 * scale,
        zIndex: 1,
    },
    emotion: {
        width: 50 * scale,
        height: 50 * scale,
    },
    containerBarEmotion: {
        backgroundColor: '#004A2B',
        borderTopRightRadius: 60 * scale,
        borderBottomRightRadius: 60 * scale,
        width: width * 0.6, // 60% del ancho de la pantalla (antes era 250px)
        height: 35 * scale,
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginLeft: -10 * scale,
        overflow: 'hidden',
    },
    barEmotion: {
        backgroundColor: '#5BF586',
        borderTopRightRadius: 60 * scale,
        borderBottomRightRadius: 60 * scale,
        height: 25 * scale,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: -10 * scale,
        position: 'relative',
    },
    containerInfo: {
        backgroundColor: '#A3E8AE',
        height: height * 0.12, // 15% de la altura de la pantalla (antes era 105px)
        borderBottomLeftRadius: 15 * scale,
        borderBottomRightRadius: 15 * scale,
        justifyContent: 'center',
        alignItems: 'center',
    },
    information: {
        width: '95%',
        height: 70 * scale,
        backgroundColor: '#CBF9CD',
        borderRadius: 20 * scale,
        justifyContent: 'space-evenly', // Cambiado de 'center' con gap para mejor espaciado
        alignItems: 'center',
        flexDirection: 'row',
    },
    containerMonedas: {
        width: 90 * scale,
        height: 34 * scale,
        backgroundColor: '#4EC160',
        borderRadius: 20 * scale,
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',
    },
    monedas: {
        width: 40 * scale,
        height: 40 * scale,
        borderRadius: 20 * scale,
        backgroundColor: 'orange',
    },
    textMonedas: {
        color: 'white',
        fontSize: RFPercentage(2), // Escala según el tamaño de pantalla (antes era 15)
        fontFamily: 'Quicksand_SemiBold',
        marginLeft: 5 * scale,
    },
    containerPlushieButton: {
        width: 50 * scale,
        height: 50 * scale,
        borderRadius: 25 * scale,
        backgroundColor: '#7fcc97',
        justifyContent: 'center',
        alignItems: 'center',
    },
    plushieButton: {
        width: 43 * scale,
        height: 43 * scale,
        borderRadius: 21 * scale,
        backgroundColor: '#398F53',
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerVictorias: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    victorias: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageWins: {
        width: 30 * scale,
        height: 30 * scale,
    },
    textVictorias: {
        color: 'black',
        fontSize: RFPercentage(2), // Escala según el tamaño de pantalla (antes era 15)
        fontFamily: 'Quicksand_SemiBold',
        marginLeft: 5 * scale,
    },
    scrollArea: {
        flex: 1,
        marginBottom: 18 * scale,
        backgroundColor: '#CBEFD5',
    },
    scrollContainer: {
        marginTop: 20 * scale,
        paddingHorizontal: 10 * scale,
        paddingBottom: 20 * scale, // Añadido para mejor espaciado al final del scroll
    },
    card: {
        width: width * 0.9, // 90% del ancho de la pantalla (antes era 360px)
        height: 160 * scale,
        backgroundColor: '#004A2B',
        borderRadius: 35 * scale,
        marginBottom: 40 * scale,
        alignSelf: 'center',
        flexDirection: 'row',
        padding: 10 * scale,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 * scale },
        shadowOpacity: 0.8,
        shadowRadius: 0,
        elevation: 4,
    },
    containerImage: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1B5B44',
        width: width * 0.45, // 45% del ancho de la pantalla (antes era 196px)
        height: 138 * scale,
        borderRadius: 30 * scale,
        marginRight: 20 * scale,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 20 * scale,
    },
    textButtonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    cardText: {
        color: 'white',
        fontSize: RFPercentage(2.5), // Escala según el tamaño de pantalla (antes era 18)
        fontFamily: 'Quicksand',
        textAlign: 'center',
    },
    containerButton: {
        width: 80 * scale,
        height: 55 * scale,
        marginTop: 10 * scale,
        padding: 10 * scale,
        borderRadius: 30 * scale,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 7 * scale },
        shadowOpacity: 0.8,
        shadowRadius: 4 * scale,
        elevation: 5,
    },
});