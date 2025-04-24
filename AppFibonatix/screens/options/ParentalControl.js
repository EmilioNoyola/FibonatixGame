// Componentes de React
import React from 'react';  
import { Text, View, SafeAreaView, StatusBar, Pressable, StyleSheet, Image } from 'react-native';
import { useState, useEffect } from 'react';

// Navegación
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';

// Fuentes
import useCustomFonts from '../../assets/components/FontsConfigure';

// Íconos
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import EvilIcons from '@expo/vector-icons/EvilIcons';

// Alertas
import CustomAlert from '../../assets/components/CustomAlert';

import { Linking } from 'react-native';

export default function ParentalControl(props) {

    const { fontsLoaded, onLayoutRootView } = useCustomFonts();
    if (!fontsLoaded) return null;

    const navigation = useNavigation();

    // Estados para controlar la visibilidad de las alertas
    const [alerts, setAlerts] = useState({ type: null, visible: false });
    const showAlert = (type) => setAlerts({ type, visible: true });
    const hideAlert = () => setAlerts({ ...alerts, visible: false });

    // Confirmar la alerta.
    const handleConfirmAlert = async () => {
        switch (alerts.type) {
            case "resetProgress": await handleResetProgress(); hideAlert(); break;
            case "progressReset": hideAlert(); break;
            default: hideAlert(); break;
        }
    };
    
    // Reiniciar progreso.
    const handleResetProgress = async () => {
        try {
            const firstGameReset = await resetFirstGameProgress();
            const secondGameReset = await resetSecondGameProgress();
    
            if (firstGameReset && secondGameReset) {
                showAlert("progressReset"); 
            } else {
                Alert.alert(
                    "Error",
                    "Hubo un problema al intentar eliminar el progreso. Intenta nuevamente."
                );
            }
        } catch (error) {
            console.error("Error al reiniciar el progreso:", error);
            Alert.alert(
                "Error",
                "Ocurrió un error inesperado. Intenta nuevamente."
            );
        }
    };    

    // Titulo de las alertas
    const mostrarTituloAlerta = (type) => {
        switch (type) {
        case "resetProgress": return "Reiniciar Progreso";
        case "progressReset": return "Progreso Reiniciado";
        default: return "Alerta";
        }
    };
    
    // Mensajes de las alertas.
    const mostrarMensajeAlerta = (type) => {
        switch (type) {
        case "resetProgress": return "¿Estás seguro de que deseas reiniciar todo tu progreso? Esto no se puede deshacer.";
        case "progressReset": return "Todo tu progreso ha sido reiniciado.";
        default: return "";
        }
    };
    
    // Texto del botón confirmar.
    const textoConfirmar = (type) => {
        switch (type) {
        case "resetProgress": return "Sí, Reiniciar";
        case "progressReset": return "Aceptar";
        default: return "Aceptar";
        }
    };
    
    // Texto del botón cancelar.
    const textoCancelar = (type) => {
        switch (type) { 
        case "resetProgress": return "Cancelar";
        default: return null;
        }
    };  

    return (
        <SafeAreaView style={styles.container} onLayout={onLayoutRootView}>

            <StatusBar
                barStyle="dark-content"
                translucent={true}
                backgroundColor="transparent"
            />

            <View style={styles.header}>
                <View style={styles.containerButtonBack}>
                    <Pressable onPress={() => props.navigation.goBack()} style={styles.ButtonBack}>
                        <Ionicons name="chevron-back" size={35} color="#1B5B44" />
                    </Pressable>
                </View>
                <View style={styles.containerTextHeader}>
                    <Text style={styles.textHeader}>Control Parental</Text>
                </View>
            </View>

            <View style={styles.content}>
                <ScrollView
                    contentContainerStyle={{
                        padding: 20,
                    }}
                    style={styles.scrollView} 
                >
                    <View style={styles.containerLinkQR}>
                        <View style={styles.containerQR}>
                            <AntDesign name="qrcode" size={280} color="black" />
                        </View>
                        <View style={styles.containerTextQR}>
                            <Text style={styles.textQR}>
                                Para acceder a las opciones de control parental favor de escanear el siguiente código QR o apretar el link
                            </Text>
                        </View>
                        <View style={styles.containerLink}>
                            <Pressable 
                                style={({pressed}) => [
                                    {
                                        backgroundColor: pressed ? '#9dd8ca' : '#8AD0C0',
                                    },
                                    styles.link,
                                ]}  
                                onPress={() => Linking.openURL('https://webfrognova-production.up.railway.app/')}
                            >
                                <Text style={styles.textLink}>Llévame ahí<EvilIcons name="external-link" size={20} color="#40a08a" /></Text>
                            </Pressable>
                        </View>
                    </View>
                </ScrollView>
            </View>

            <View style={styles.footer}>
                <View style={styles.circle}>
                    <Image source={require('../../assets/img/LogoFibonatix.png')} style={styles.image} />
                </View>
                <Text style={styles.textFooter}>Frognova</Text>
            </View>

            {alerts.visible && (
                <CustomAlert
                    showAlert={alerts.visible}
                    title={mostrarTituloAlerta(alerts.type)}
                    message={mostrarMensajeAlerta(alerts.type)}
                    onConfirm={handleConfirmAlert}
                    onCancel={alerts.type === "resetProgress" ? hideAlert : null}
                    confirmText={textoConfirmar(alerts.type)}
                    cancelText={textoCancelar(alerts.type)}
                    confirmButtonColor="#40916C"
                />
            )}

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#D8F3DC',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#74C69D',
        height: 120,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
    },
    containerButtonBack: {
        left: 20,
    },
    ButtonBack: {
        backgroundColor: '#D8F3DC',
        borderRadius: 70,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerTextHeader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textHeader: {
        fontSize: 35,
        color: 'white',
        fontFamily: 'Quicksand',
        textAlign: 'center',
    },
    content: {
        flex: 1, // Ocupa el espacio restante entre el header y el footer
        alignItems: 'center', // Centra el ScrollView horizontalmente
    },
    scrollView: {
        width: '100%', // Ajusta el ancho del ScrollView
        borderRadius: 10, // Opcional: estilo adicional
        marginBottom: 50,
    },
    containerQR: {
        width: 290, // Tamaño del contenedor
        height: 290,
        borderRadius: 20,
        backgroundColor: '#A7DDB5', // Fondo para destacar el QR
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerTextQR: {
        marginTop: 20,
        width: 290
    },
    textQR: {
        fontSize: 20,
        color: '#094F2C',
        fontFamily: 'Quicksand',
        textAlign: 'center',
    },
    containerLinkQR: {
        marginTop: 20,
        alignItems: 'center', // Centra horizontalmente el contenido
        justifyContent: 'center', // Centra verticalmente el contenido si es necesario
        width: '100%', // Asegura que el contenedor ocupe todo el ancho
    },
    link: {
        flexDirection: 'row', // Para que el texto y el ícono estén en la misma fila
        width: 200, // Ancho del botón
        height: 40, // Altura del botón
        borderRadius: 30, // Bordes redondeados
        justifyContent: 'center', // Centrar verticalmente el contenido
        alignItems: 'center', // Centrar horizontalmente el contenido
        marginTop: 20, // Espacio entre el link y el texto superior
    },
    textLink: {
        fontSize: 22,
        color: '#40a08a',
        fontFamily: 'Quicksand',
        textAlign: 'center',
        textDecorationLine: 'underline',
    },
    footer: {
        height: 120,
        backgroundColor: '#74C69D',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    circle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#D8F3DC',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: -50,
    },
    image: {
        width: 85,
        height: 85,
    },
    textFooter: {
        fontSize: 30,
        color: 'white',
        fontFamily: 'Quicksand',
        marginTop: 10,
    },
});
