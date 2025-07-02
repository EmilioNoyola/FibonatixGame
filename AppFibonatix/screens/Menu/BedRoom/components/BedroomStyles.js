import { StyleSheet, Dimensions } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';

// Obtener dimensiones de la pantalla
const { width, height } = Dimensions.get('window');
const scale = width / 414;

// Definimos las constantes para el SVG de PersonalityItem
const SVG_SIZE = 155 * scale;
const RADIUS = 60 * scale;
const STROKE_WIDTH = 10 * scale;
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * RADIUS;

// Definimos los estilos por separado
const styleDefinitions = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#B7E0FE',
        justifyContent: 'space-between',
    },
    header: {
        backgroundColor: '#478CDB',
        height: height * 0.20, // Alineado con HomeStyles.js
        borderBottomLeftRadius: 15 * scale,
        borderBottomRightRadius: 15 * scale,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header2: {
        backgroundColor: '#1E62CE',
        height: height * 0.10, // Alineado con HomeStyles.js
        borderTopLeftRadius: 15 * scale,
        borderTopRightRadius: 15 * scale,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textHeader: {
        fontSize: RFPercentage(5), // Ajustado para responsividad
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
        backgroundColor: '#15448e',
        borderRadius: 80 * scale,
        width: 60 * scale,
        height: 60 * scale,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10 * scale,
        zIndex: 1,
    },
    Emotion: {
        backgroundColor: '#86cee9',
        borderRadius: 60 * scale,
        width: 50 * scale,
        height: 50 * scale,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 20 * scale,
        zIndex: 1,
        position: 'absolute',
    },
    containerBarEmotion: {
        backgroundColor: '#15448e',
        borderTopRightRadius: 60 * scale,
        borderBottomRightRadius: 60 * scale,
        width: width * 0.6, // Usamos width directamente para evitar referencias circulares
        height: 35 * scale,
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginLeft: -10 * scale,
        overflow: 'hidden',
    },
    BarEmotion: {
        backgroundColor: '#04a2e1',
        borderTopRightRadius: 60 * scale,
        borderBottomRightRadius: 60 * scale,
        height: 25 * scale,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: -10 * scale,
        position: 'relative',
    },
    containerSleep: {
        backgroundColor: '#7cc7fd',
        width: '100%',
        height: '60%',
        borderTopLeftRadius: 20 * scale,
        borderTopRightRadius: 20 * scale,
        position: 'relative',
        alignItems: 'center',
    },
    containerFocus: {
        width: 200 * scale,
        height: 200 * scale,
        borderRadius: 100 * scale,
        backgroundColor: '#B7E0FE',
        position: 'absolute',
        top: -100 * scale,
        left: '50%',
        transform: [{ translateX: -100 * scale }],
        zIndex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    Focus: {
        width: 180 * scale,
        height: 180 * scale,
        borderRadius: 90 * scale,
        backgroundColor: '#478CDB',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 * scale },
        shadowOpacity: 0.3,
        shadowRadius: 10 * scale,
        elevation: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    Focus2: {
        width: 180 * scale,
        height: 180 * scale,
        borderRadius: 150 * scale,
        marginBottom: '40%',
        backgroundColor: '#478CDB',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 * scale },
        shadowOpacity: 0.3,
        shadowRadius: 10 * scale,
        elevation: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerMisions: {
        flex: 1,
        width: '85%',
        marginBottom: 20 * scale,
        backgroundColor: '#57A4FD',
        marginTop: 120 * scale,
        alignSelf: 'center',
        borderRadius: 20 * scale,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
    },
    missionsContainer: {
        flex: 1,
        backgroundColor: '#B7E0FE',
        borderRadius: 20 * scale,
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '90%',
    },
    tabButton: {
        borderRadius: 15 * scale,
        overflow: 'hidden',
    },
    button: {
        backgroundColor: '#2B79F5',
        paddingVertical: 10 * scale,
        paddingHorizontal: 25 * scale,
        borderRadius: 10 * scale,
    },
    buttonText: {
        color: 'white',
        fontSize: 16 * scale,
        fontFamily: 'Quicksand',
    },
    contentContainer: {
        flex: 1,
        padding: 15 * scale,
    },
    scrollContainer: {
        flex: 1,
    },
    misionContainer: {
        backgroundColor: '#57A4FD',
        padding: 15 * scale,
        borderRadius: 10 * scale,
        marginBottom: 10 * scale,
        flexDirection: 'column',
    },
    misionText: {
        color: 'white',
        fontSize: 16 * scale,
        fontFamily: 'Quicksand_Medium',
        flexShrink: 1,
    },
    misionInfo: {
        backgroundColor: '#88BFFD',
        borderRadius: 20 * scale,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 5 * scale,
        paddingHorizontal: 10 * scale,
        paddingVertical: 5 * scale,
    },
    progreso: {
        color: 'white',
        fontSize: 14 * scale,
        fontFamily: 'Quicksand_Medium',
        marginLeft: 10 * scale,
    },
    recompensaContainer: {
        height: 30 * scale,
        width: 30 * scale,
        borderRadius: 15 * scale,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'orange',
    },
    recompensa: {
        fontSize: 18 * scale,
        color: 'white',
        fontFamily: 'Quicksand_Medium',
    },
    personalidadContainer: {},
    progressBarContainer: {
        height: 10 * scale,
        backgroundColor: '#E0E0E0',
        borderRadius: 5 * scale,
        marginTop: 10 * scale,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#4CAF50',
        borderRadius: 5 * scale,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    },
    personalityContainer: {
        width: '45%',
        alignItems: 'center',
        marginBottom: 20 * scale,
    },
    progressContainer: {
        width: SVG_SIZE,
        height: SVG_SIZE,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageContainer: {
        position: 'absolute',
        width: 110 * scale,
        height: 110 * scale,
        borderRadius: 55 * scale,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 70 * scale,
        height: 70 * scale,
        resizeMode: 'contain',
    },
    progressText: {
        fontSize: 16 * scale,
        marginTop: -35 * scale,
        backgroundColor: '#E0E0E0',
        padding: 5 * scale,
        borderRadius: 10 * scale,
        fontFamily: 'Quicksand',
    },
    name: {
        fontSize: 20 * scale,
        fontFamily: 'Quicksand',
        textAlign: 'center',
        marginTop: 5 * scale,
    },
    timerText: {
        color: '#FFFFFF',
        fontSize: 18,
        textAlign: 'center',
        marginTop: 10,
    },
});

// Exportamos tanto los estilos como las constantes necesarias
export const styles = {
    ...styleDefinitions,
    width,
    scale,
    SVG_SIZE,
    RADIUS,
    STROKE_WIDTH,
    CIRCLE_CIRCUMFERENCE,
};