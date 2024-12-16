import React from 'react';  
import { Text, View, SafeAreaView, StatusBar, Pressable, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import useCustomFonts from '../../apis/FontsConfigure';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ScrollView, TextInput } from 'react-native-gesture-handler';

import Icon from 'react-native-vector-icons/MaterialIcons'; // Importamos los íconos de MaterialIcons}
import MaterialIcons from '@expo/vector-icons/MaterialIcons';


// Librerías de Firebase y Firestore
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
import { doc, getDoc } from "firebase/firestore";

import { useState, useEffect } from 'react';

import CustomSwitch from '../../apis/CustomSwitch';

import { resetFirstGameProgress, resetSecondGameProgress } from '../../apis/resetProgress';

// Alertas Personalizadas
import CustomAlert from '../../apis/Alertas';

export default function Settings(props) {
    const { fontsLoaded, onLayoutRootView } = useCustomFonts();
    if (!fontsLoaded) return null;

    const navigation = useNavigation();

    const [headerHeight, setHeaderHeight] = useState(0);
    const auth = getAuth();
    const db = getFirestore();

    const [username, setUsername] = useState(""); // Estado para el nombre de usuario
    const user = auth.currentUser;

    // Estados para controlar la visibilidad de las alertas
    const [alerts, setAlerts] = useState({ type: null, visible: false });
    const showAlert = (type) => setAlerts({ type, visible: true });
    const hideAlert = () => setAlerts({ ...alerts, visible: false });

    // Función para obtener el nombre de usuario desde Firestore
    const getUsername = async () => {
        if (user) {
            const userRef = doc(db, "users", user.uid); // Accede al documento del usuario
            const userDoc = await getDoc(userRef); // Obtén el documento
            if (userDoc.exists()) {
                setUsername(userDoc.data().username); // Establece el nombre de usuario
            } else {
                console.log("No hay datos para este usuario");
            }
        }
    };

    // Llama a getUsername cuando el componente se monta o cuando el usuario cambia
    useEffect(() => {
        if (user) {
            getUsername();
        }
    }, [user]);

    const [isOn, setIsOn] = useState(false);
    const [isOn2, setIsOn2] = useState(false);
    const [isOn3, setIsOn3] = useState(false);

    // Funciones al confirmar la alerta.
    const handleConfirmAlert = async () => {
        switch (alerts.type) {
            case "resetProgress":
                await handleResetProgress();
                hideAlert();
                break;
            case "progressReset":
                hideAlert();
                break;
            default:
                hideAlert();
                break;
        }
    };
    
    const handleResetProgress = async () => {
        try {
            const firstGameReset = await resetFirstGameProgress();
            const secondGameReset = await resetSecondGameProgress();
    
            if (firstGameReset && secondGameReset) {
                showAlert("progressReset"); // Mostrar alerta de confirmación
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
                    <Text style={styles.textHeader}>Ajustes</Text>
                </View>
            </View>

            <View style={styles.content}>
                <ScrollView
                    contentContainerStyle={{
                        padding: 20, // Espacio interno del ScrollView
                    }}
                    style={styles.scrollView} // Centra el propio ScrollView
                >
                    <View>
                        <View style={styles.titleContainer}>
                            <Text style={styles.title}>Usuario</Text>
                        </View>

                        <View style={styles.option}>

                            <View style={styles.circleUserContainer}>
                                <Icon name="account-circle" size={130} color="#A7DDB5"/>
                                <Pressable 
                                    style={({pressed}) => [
                                        {
                                            backgroundColor: pressed ? '#e9f6ec' : 'white',
                                        },
                                        styles.circleEditIcon,
                                    ]}                                    
                                >
                                    <MaterialIcons name="edit" size={30} color="#40916C" />
                                </Pressable>
                            </View>

                            <View style= {{flex: 1, justifyContent: 'center', alignItems: 'center'}}>

                                <Text style={styles.subtitleText}>Nombre de Usuario</Text>
                                <TextInput style={styles.textInput} placeholder='Nombre de Usuario' editable={false}>{username}</TextInput>
                                <Pressable 
                                    style={({pressed}) => [
                                        {
                                            backgroundColor: pressed ? '#e9f6ec' : 'white',
                                        },
                                        styles.circleEditUsernameIcon,
                                    ]} 
                                >
                                    <MaterialIcons name="edit" size={20} color="#40916C" />
                                </Pressable>
                            </View>

                        </View>

                    </View>

                    <View style={styles.optionContainer}>
                        <View style={styles.titleContainer}>
                            <Text style={styles.title}>General</Text>
                        </View>

                        <View style={styles.option}>

                            <View style={styles.textOptionContainer}>
                                <Text style={styles.textOption}>Notificaciones</Text>
                            </View>

                            <View style= {styles.switchContainer}>

                                <CustomSwitch 
                                    value={isOn}
                                    onValueChange={setIsOn}
                                    onColor="#1B4332"
                                    offColor="#5aa469"
                                    circleColor="#EFFFF4"
                                    size={80} // Tamaño más grande
                                />

                            </View>

                        </View>

                        <View style={styles.option}>

                            <View style={styles.textOptionContainer}>
                                <Text style={styles.textOption}>Efectos de Sonido</Text>
                            </View>

                            <View style= {styles.switchContainer}>

                                <CustomSwitch 
                                    value={isOn2}
                                    onValueChange={setIsOn2}
                                    onColor="#1B4332"
                                    offColor="#5aa469"
                                    circleColor="#EFFFF4"
                                    size={80} // Tamaño más grande
                                />

                            </View>

                        </View>

                        <View style={styles.option}>

                            <View style={styles.textOptionContainer}>
                                <Text style={styles.textOption}>Música</Text>
                            </View>

                            <View style= {styles.switchContainer}>

                                <CustomSwitch 
                                    value={isOn3}
                                    onValueChange={setIsOn3}
                                    onColor="#1B4332"
                                    offColor="#5aa469"
                                    circleColor="#EFFFF4"
                                    size={80} // Tamaño más grande
                                />

                            </View>

                        </View>

                    </View>

                    <View style={styles.optionContainer}>
                        <View style={styles.titleContainer}>
                            <Text style={styles.title}>Juegos</Text>
                        </View>

                        <View style={styles.option}>

                            <View style={styles.textOptionContainer}>
                                <Text style={styles.textOption}>Progreso</Text>
                            </View>

                            <Pressable 
                                style={({ pressed }) => [
                                    {
                                        backgroundColor: pressed ? '#C63C29' : '#D7513F',
                                    },
                                    styles.progresoButtom,
                                ]}
                                onPress={() => showAlert('resetProgress')} // Cambiado para evitar la ejecución inmediata
                            >
                                <Text style={styles.progresoButtomText}>REINICIAR</Text>
                            </Pressable>

                        </View>

                    </View>

                </ScrollView>
            </View>

            <View style={styles.footer}>
                <View style={styles.circle}>
                    <Image source={require('../../assets/LogoFibonatix.png')} style={styles.image} />
                </View>
                <Text style={styles.textFooter}>Fibonatix</Text>
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
        position: 'absolute',
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
        fontSize: 48,
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

    optionContainer: {
        marginTop: 20,
    },

    titleContainer: {
        width: '100%',
        height: 60,
        backgroundColor: '#40916C',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },

    title: {
        fontSize: 36,
        color: 'white',
        fontFamily: 'Quicksand',
    },

    circleUserContainer: {
        width: 130, // Ajusta el tamaño según sea necesario
        height: 130,
        borderRadius: 75, // Debe ser la mitad del ancho/alto para un círculo perfecto
        backgroundColor: '#40916C',
    },   

    circleEditIcon: {

        width: 40,
        height: 40,
        borderRadius: 20,
        position: 'absolute',
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',

    },

    circleEditUsernameIcon: {
        width: 30,
        height: 30,
        borderRadius: 15,
        position: 'absolute',
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },

    subtitleText: {
        fontSize: 16,
        color: '#094F2C',
        fontFamily: 'Quicksand',
    },

    textInput: {
        padding: 15,
        backgroundColor: '#A7DDB5',
        width: 180,
        borderRadius: 15,
        color: '#094F2C',
        fontFamily: 'Quicksand_Medium',
    },

    option: {
        marginVertical: 15,
        flexDirection: 'row',
    },

    textOptionContainer:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },

    textOption: {
        fontSize: 24,
        color: '#094F2C',
        fontFamily: 'Quicksand',
    },

    switchContainer: {
        justifyContent: 'center',
        alignItems: 'flex-end',
    },

    progresoButtom:{
        width: 200,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 27,
    },

    progresoButtomText: {
        color: 'white',
        fontFamily: 'Quicksand',
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
