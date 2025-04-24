// Componentes de React
import React from 'react';  
import { Text, View, SafeAreaView, StatusBar, Pressable, Image, Alert, ActivityIndicator, StyleSheet } from "react-native";
import { useState, useEffect } from 'react';
import * as ImagePicker from "expo-image-picker";

// Navegación
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import CustomSwitch from '../../assets/components/CustomSwitch';

// Fuentes
import useCustomFonts from '../../assets/components/FontsConfigure';

// Íconos
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

// Librerías de Firebase y Firestore
import { getAuth } from 'firebase/auth';
import { doc, getDoc, updateDoc, getFirestore } from "firebase/firestore";
import { DeviceEventEmitter } from 'react-native'; // Importar DeviceEventEmitter

// Reiniciar progreso.
import { resetFirstGameProgress, resetSecondGameProgress } from '../../assets/components/resetProgress';

// Alertas Personalizadas
import CustomAlert from '../../assets/components/CustomAlert';

const IMGUR_CLIENT_ID = "0df5037c839291f"; // Client ID de Imgur

export default function Settings(props) {

    const { fontsLoaded, onLayoutRootView } = useCustomFonts();
    if (!fontsLoaded) return null;

    // Estados para controlar la visibilidad de las alertas
    const [alerts, setAlerts] = useState({ type: null, visible: false });
    const showAlert = (type) => setAlerts({ type, visible: true });
    const hideAlert = () => setAlerts({ ...alerts, visible: false });

    // Estado para controlar la visibilidad de los botones.
    const [showUpdateButton, setShowUpdateButton] = useState(false);
    const [isOn, setIsOn] = useState(false);
    const [isOn2, setIsOn2] = useState(false);
    const [isOn3, setIsOn3] = useState(false);

    const auth = getAuth();
    const db = getFirestore();
    const user = auth.currentUser;

    const [username, setUsername] = useState(""); 
    const [profileImage, setProfileImage] = useState(null);
    const [isEditing, setIsEditing] = useState(false); // Estado para activar/desactivar edición
    const [isLoading, setIsLoading] = useState(false); // Estado de carga
    const [lastUploadTime, setLastUploadTime] = useState(null);

    // Obtener el nombre de usuario desde Firestore
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

    // Obtener la foto de perfil desde Firestore
    const getProfileImage = async () => {
        if (user) {
            const userRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userRef);
            if (userDoc.exists()) {
                setProfileImage(userDoc.data().profileImage);
            }
        }
    };

    const handleEditPress = () => {
        setIsEditing(true); // Activar edición
        setShowUpdateButton(true); // Mostrar el botón de actualizar
    };

    // Llama a getUsername cuando el componente se monta o cuando el usuario cambia
    useEffect(() => {
        if (user) {
            getUsername();
        }
    }, [user]);

    useEffect(() => {
        getProfileImage();
    }, []);

    // Función para seleccionar imagen desde la galería
    const pickImage = async () => {
        const now = new Date().getTime();
    
        if (lastUploadTime && now - lastUploadTime < 60000) { 
            showAlert("tiempoEdicionImagen");
            return;
        }
    
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            base64: true, 
        });
    
        if (!result.canceled) {
            setLastUploadTime(now);
            setIsLoading(true);
            uploadToImgur(result.assets[0].base64);
        }
    };

    // Subir la imagen a Imgur
    const uploadToImgur = async (base64Image) => {
        try {
            let response = await fetch("https://api.imgur.com/3/image", {
                method: "POST",
                headers: {
                    "Authorization": `Client-ID ${IMGUR_CLIENT_ID}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    image: base64Image,
                    type: "base64",
                }),
            });

            let json = await response.json();
            if (json.success) {
                updateProfileImage(json.data.link);
            } else {
                throw new Error("Error al subir la imagen.");
            }
        } catch (error) {
            Alert.alert("Error", error.message);
            setIsLoading(false);
        }
    };

    const handleUpdateUsername = async () => {
        if (username.trim() === "") {
            showAlert("FaltaNombreUsuario");
            return;
        }
    
        setIsLoading(true); // Activar pantalla de carga
    
        try {
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, { username });

            showAlert("NombreUsuarioActualizado");
    
            // Emitir el evento para actualizar el Drawer
            DeviceEventEmitter.emit("usernameUpdated", username);
    
            // Desactivar edición después de actualizar
            setIsEditing(false);
            setShowUpdateButton(false);
        } catch (error) {
            console.error("Error actualizando el nombre de usuario:", error);
            showAlert("ErrorActualizarUsuario");
        }
    
        setIsLoading(false); // Desactivar pantalla de carga
    };     

    // Actualizar la URL de la imagen en Firestore
    const updateProfileImage = async (imageUrl) => {
        try {
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, { profileImage: imageUrl });
            setProfileImage(imageUrl);
    
            // Emitir evento para actualizar la imagen en el Drawer
            DeviceEventEmitter.emit("profileImageUpdated", imageUrl);
    
            showAlert("ImagenActualizada");
        } catch (error) {
            showAlert("ErrorActualizarImagen");
            console.error("Error actualizando la imagen de perfil:", error);
        }
        setIsLoading(false);
    };

    // Reiniciar progreso.
    const handleResetProgress = async () => {
        try {
            const firstGameReset = await resetFirstGameProgress();
            const secondGameReset = await resetSecondGameProgress();
    
            if (firstGameReset && secondGameReset) {
                showAlert("progressReset"); 
            } else {
                showAlert("resetProgressError");
            }
        } catch (error) {
            console.error("Error al reiniciar el progreso:", error);
            showAlert("resetProgressErrorInesperado");
        }
    };

    // Confirmar la alerta.
    const handleConfirmAlert = async () => {
        switch (alerts.type) {
            case "resetProgress": await handleResetProgress(); hideAlert(); break;
            case "progressReset": hideAlert(); break;
            default: hideAlert(); break;
        }
    };    

    // Titulo de las alertas
    const mostrarTituloAlerta = (type) => {
        switch (type) {
            case "resetProgress": return "Reiniciar Progreso";
            case "progressReset": return "Progreso Reiniciado";
            case "resetProgressError": return "Error!"
            case "resetProgressErrorInesperado": return "Error inesperado";
            case "tiempoEdicionImagen": return "Espera un momento";
            case "FaltaNombreUsuario": return "Nombre de Usuario";
            case "NombreUsuarioActualizado": return "Éxito!";
            case "ErrorActualizarUsuario": return "Error!";
            case "ImagenActualizada": return "Éxito!";
            case "ErrorActualizarImagen": return "Error!";
            default: return "Alerta";
        }
    };
    
    // Mensajes de las alertas.
    const mostrarMensajeAlerta = (type) => {
        switch (type) {
            case "resetProgress": return "¿Estás seguro de que deseas reiniciar todo tu progreso? Esto no se puede deshacer.";
            case "progressReset": return "Todo tu progreso ha sido reiniciado.";
            case "resetProgressError": return "Hubo un problema al intentar eliminar el progreso. Intenta nuevamente.";
            case "resetProgressErrorInesperado": return "Ocurrió un error inesperado. Intenta nuevamente.";
            case "tiempoEdicionImagen": return "Solo puedes actualizar tu imagen cada 1 minuto.";
            case "FaltaNombreUsuario": return "Por favor, ingresa un nombre de usuario.";
            case "NombreUsuarioActualizado": return "Nombre de usuario actualizado correctamente.";
            case "ErrorActualizarUsuario": return "Hubo un problema al actualizar el nombre.";
            case "ImagenActualizada": return "Foto de perfil actualizada correctamente.";
            case "ErrorActualizarImagen": return "Hubo un problema al actualizar la foto de perfil.";
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
                    <Pressable 
                        onPress={() => { 
                            props.navigation.goBack();         
                            setIsEditing(false);
                            setShowUpdateButton(false);
                        }} 
                        style={styles.ButtonBack}
                    >
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
                                {profileImage ? (
                                    <Image source={{ uri: profileImage }} style={{ width: 130, height: 130, borderRadius: 65 }} />
                                ) : (
                                    <MaterialIcons name="account-circle" size={130} color="#A7DDB5" />
                                )}

                                <Pressable
                                    style={{
                                        position: "absolute",
                                        bottom: 5,
                                        right: 5,
                                        backgroundColor: "white",
                                        borderRadius: 20,
                                        padding: 5,
                                    }}
                                    onPress={pickImage}
                                >
                                    <MaterialIcons name="edit" size={25} color="#40916C" />
                                </Pressable>
                            </View>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={styles.subtitleText}>Nombre de Usuario</Text>
                                
                                <View style={styles.textInputContainer}>
                                    <TextInput
                                        style={styles.textInput}
                                        value={username}
                                        onChangeText={setUsername}
                                        placeholder="Nombre de usuario"
                                        editable={isEditing} // Se activa solo cuando el usuario presiona el botón de edición
                                        maxLength={20} // Limita el texto a 20 caracteres
                                    />
                                    <Pressable
                                        style={({ pressed }) => [
                                            { backgroundColor: pressed ? '#e9f6ec' : 'white' },
                                            styles.circleEditUsernameIcon,
                                        ]}
                                        onPress={handleEditPress} // Activa la edición
                                    >
                                        <MaterialIcons name="edit" size={20} color="#40916C" />
                                    </Pressable>
                                </View>

                                {/* Botón de actualizar nombre */}
                                {showUpdateButton && ( // Solo se renderiza si showUpdateButton es true
                                    <Pressable
                                        style={[
                                            styles.updateButton,
                                            { backgroundColor: '#40916C' },
                                        ]}
                                        onPress={handleUpdateUsername}
                                    >
                                        <Text style={styles.updateButtonText}>Confirmar</Text>
                                    </Pressable>
                                )}
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
                                onPress={() => showAlert('resetProgress')}
                            >
                                <Text style={styles.progresoButtomText}>REINICIAR</Text>
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

            {isLoading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#FFF" />
                    <Text style={styles.loadingText}>Actualizando...</Text>
                </View>
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
    textInputContainer: {
        position: 'relative', // Para que el ícono se posicione correctamente
        width: 180, // Aumenta el ancho para que el ícono no quede cortado
    },
    textInput: {
        padding: 15,
        backgroundColor: '#A7DDB5',
        width: '100%', 
        borderRadius: 15,
        color: '#094F2C',
        fontFamily: 'Quicksand_Medium',
    },
    circleEditUsernameIcon: {
        width: 30,
        height: 30,
        borderRadius: 15,
        position: 'absolute',
        right: -10, // Ajusta la posición horizontal (valor negativo para sobresalir)
        top: -10, // Ajusta la posición vertical (valor negativo para sobresalir)
        justifyContent: 'center',
        alignItems: 'center',
    },
    subtitleText: {
        fontSize: 16,
        color: '#094F2C',
        fontFamily: 'Quicksand',
    },
    updateButton: {
        marginTop: 10,
        backgroundColor: '#40916C',
        padding: 5,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: '40%',
    },
    
    updateButtonText: {
        color: 'white',
        fontSize: 16,
        fontFamily: 'Quicksand',
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
    loadingContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo oscuro semitransparente
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    
    loadingText: {
        color: '#fff',
        fontSize: 18,
        marginTop: 10,
        textAlign: 'center',
    },
    
});
