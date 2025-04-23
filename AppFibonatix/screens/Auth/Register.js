// Componentes y hooks de React.
import React from 'react'; 
import { Text, TextInput, View, ImageBackground, SafeAreaView, StatusBar, Pressable, ScrollView, ActivityIndicator, Modal } from 'react-native';
import { useState, useEffect } from 'react'; 

// Iconos
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; 

// Alertas
import CustomAlert from '../../assets/apis/Alertas';

// Fuentes personalizadas.
import useCustomFonts from '../../assets/apis/FontsConfigure';

// Importamos nuestros servicios de Firebase
import '../../assets/firebase/Credentials';
import { userService, registerWithCode, getAuthErrorType } from '../../assets/firebase/FirebaseService';

// Expo Camera
import { Camera, CameraView } from 'expo-camera';

// Estilos
import { RegisterStyles } from "../../styles/UserAuthenticationStyles/RegisterStyles";

// Contexto global
import { useAppContext } from '../../assets/db/AppContext'; // Ajustamos el import del contexto

// Axios para hacer solicitudes HTTP
import axios from 'axios';

const API_BASE_URL = 'http://192.168.56.1:3000';

export default function Register({ navigation }) {
    const { fontsLoaded, onLayoutRootView } = useCustomFonts();
    const { setGlobalData, setPersonalityTraits, setClientId } = useAppContext(); // Añadimos setClientId

    if (!fontsLoaded) return null;

    // Estados para controlar la visibilidad de las alertas
    const [alerts, setAlerts] = useState({ type: null, visible: false });
    const showAlert = (type) => setAlerts({ type, visible: true });
    const hideAlert = () => setAlerts({ ...alerts, visible: false });

    // Estado para manejar la visibilidad de la contraseña
    const [secureTextEntry, setSecureTextEntry] = useState(true);

    // Estados para manejar los campos de entrada.
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [activationCode, setActivationCode] = useState('');
    const [isModalVisible, setModalVisible] = useState(false);
    const [hasPermission, setHasPermission] = useState(null);

    const [isLoading, setIsLoading] = useState(false);

    // Registrar nuevo usuario
    const registrar = async () => {
        if (!email || !password || !username || !activationCode) {
            setIsLoading(false);
            return showAlert('emptyFields');
        }

        setIsLoading(true);
        try {
            // Verificar si el nombre de usuario ya existe
            if (await userService.usernameExists(username)) {
                setIsLoading(false);
                return showAlert('usernameTaken');
            }

            // Registrar usuario con código de activación en Firebase
            const userCredential = await registerWithCode(username, email, password, activationCode);
            const uid = userCredential.user.uid;

            // Registrar usuario en el servidor y obtener el client_ID
            const signupResponse = await axios.post(`${API_BASE_URL}/firebase/signup`, {
                client_fire_base_ID: uid,
                username_user: username,
            });

            const client_ID = signupResponse.data.client_ID;
            setClientId(client_ID); // Almacenar el client_ID en el contexto
            console.log('Client ID obtenido:', client_ID);

            try {
                // Obtener datos globales del usuario
                const userDataResponse = await axios.get(`${API_BASE_URL}/firebase/api/userData/${client_ID}`);
                setGlobalData(userDataResponse.data);

                // Obtener rasgos de personalidad
                const traitsResponse = await axios.get(`${API_BASE_URL}/firebase/api/users/${client_ID}/personality`);
                setPersonalityTraits(traitsResponse.data);
            } catch (fetchError) {
                console.error('Error al obtener datos del usuario o rasgos de personalidad:', fetchError);
                // Mostrar una alerta genérica, pero permitir que el registro continúe
                showAlert('dataFetchError');
            }

            setIsLoading(false);
            showAlert('registerSuccess');
        } catch (error) {
            console.error("Error en registro:", error);
            setIsLoading(false);

            let errorType = 'registerError';
            if (error.code) {
                errorType = getAuthErrorType(error.code);
            } else if (error.message && error.message.includes("Código inválido")) {
                errorType = 'invalidCode';
            }

            showAlert(errorType);
        }
    };

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    // Manejar el escaneo del código QR
    const handleBarCodeScanned = ({ data }) => {
        setActivationCode(data);
        setModalVisible(false);
    };

    // Devuelve el título de cada alerta.
    const mostrarTituloAlerta = (type) => {
        switch (type) {
            case 'emptyFields': return "Campos vacíos";
            case 'usernameTaken': return "Nombre de Usuario Inválido";
            case 'invalidEmail': return "Correo Electrónico Inválido";
            case 'emailInUse': return "Correo Electrónico en Uso";
            case 'weakPassword': return "Contraseña Inválida";
            case 'registerError': return "Error de Registro";
            case 'registerSuccess': return "Registro Exitoso";
            case 'invalidCode': return "Código de Activación Inválido";
            default: return "Alerta";
        }
    };

    // Devuelve el mensaje de la alerta.
    const mostrarMensajeAlerta = (type) => {
        switch (type) {
            case 'emptyFields': return "Por favor, completa todos los campos.";
            case 'usernameTaken': return "Este nombre de usuario ya está en uso.";
            case 'invalidEmail': return "Por favor, ingresa un correo válido.";
            case 'emailInUse': return "Este correo electrónico ya está en uso.";
            case 'weakPassword': return "La contraseña debe tener al menos 6 caracteres.";
            case 'registerError': return "Hubo un problema con el registro. Intenta de nuevo.";
            case 'registerSuccess': return "Registro completado con éxito.";
            case 'invalidCode': return "El código de activación no es válido o ya ha sido usado.";
            default: return "";
        }
    };

    return (
        <SafeAreaView style={RegisterStyles.main} onLayout={onLayoutRootView}>
            <StatusBar
                barStyle="light-content"
                translucent={true}
                backgroundColor="transparent"
            />

            <View style={RegisterStyles.container}>
                <ImageBackground source={require('../../assets/img/tortugas_background.jpg')} style={RegisterStyles.backgroundImage} />

                <View style={RegisterStyles.header}>
                    <Text style={RegisterStyles.headerText}>REGISTRO</Text>
                </View>

                <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled">
                    <View style={RegisterStyles.inputContainer}>
                        <TextInput
                            placeholder="Nombre de Usuario"
                            value={username}
                            onChangeText={setUsername}
                            style={RegisterStyles.input}
                        />
                        <TextInput
                            placeholder="Email"
                            value={email}
                            onChangeText={setEmail}
                            style={RegisterStyles.input}
                        />
                        <View style={{ position: 'relative' }}>
                            <TextInput
                                placeholder="Contraseña"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={secureTextEntry}
                                style={RegisterStyles.input}
                            />
                            <Pressable
                                style={RegisterStyles.eyeIconContainer}
                                onPress={() => setSecureTextEntry(!secureTextEntry)}
                            >
                                <Icon
                                    name={secureTextEntry ? "eye" : "eye-off"}
                                    size={38}
                                    color="#0B5A39"
                                    style={RegisterStyles.eyeIconBelow}
                                />
                            </Pressable>
                        </View>
                        <View style={{ position: 'relative' }}>
                            <TextInput
                                placeholder="Código de Activación"
                                value={activationCode}
                                style={RegisterStyles.input}
                                editable={true}
                                onChangeText={setActivationCode}
                            />
                            <Pressable style={RegisterStyles.eyeIconContainer} onPress={() => setModalVisible(true)}>
                                <Icon name='qrcode' size={38} color="#0B5A39" style={RegisterStyles.eyeIconBelow} />
                            </Pressable>
                        </View>
                    </View>
                </ScrollView>

                <View style={RegisterStyles.footer}>
                    <View style={RegisterStyles.buttonContainer}>
                        <Pressable
                            style={({ pressed }) => [
                                {
                                    backgroundColor: pressed ? '#1f8a83' : '#239790',
                                },
                                RegisterStyles.button,
                            ]}
                            onPress={registrar}
                            disabled={isLoading}
                        >
                            <Text style={RegisterStyles.buttonText}>REGISTRARSE</Text>
                        </Pressable>
                    </View>
                    <Pressable onPress={() => navigation.navigate('Login')}>
                        <Text style={RegisterStyles.footerText}>¿Ya tienes cuenta? Inicia Sesión</Text>
                    </Pressable>
                </View>
            </View>

            {/* Modal para escanear el código QR */}
            <Modal visible={isModalVisible} animationType="slide">
                <View style={RegisterStyles.modalContainer}>
                    <Text style={RegisterStyles.modalTitle}>Escanea tu Código QR</Text>
                    {hasPermission === null ? (
                        <Text>Solicitando permisos...</Text>
                    ) : hasPermission === false ? (
                        <Text>No tienes acceso a la cámara.</Text>
                    ) : (
                        <CameraView style={RegisterStyles.camera} onBarcodeScanned={handleBarCodeScanned} />
                    )}
                    <Pressable style={RegisterStyles.modalCloseButton} onPress={() => setModalVisible(false)}>
                        <Text style={RegisterStyles.modalCloseText}>Cerrar</Text>
                    </Pressable>
                </View>
            </Modal>

            {isLoading && (
                <View style={RegisterStyles.loadingContainer}>
                    <ActivityIndicator size="large" color="#FFF" />
                    <Text style={RegisterStyles.loadingText}>Cargando...</Text>
                </View>
            )}

            {alerts.visible && (
                <CustomAlert
                    showAlert={alerts.visible}
                    title={mostrarTituloAlerta(alerts.type)}
                    message={mostrarMensajeAlerta(alerts.type)}
                    onConfirm={hideAlert}
                    confirmButtonColor={"#0B5A39"}
                    confirmText={"Aceptar"}
                />
            )}
        </SafeAreaView>
    );
}