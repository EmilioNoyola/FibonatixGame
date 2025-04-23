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

// Importa el servicio de sincronización
import { syncService } from '../../assets/db/ApiService';

export default function Register({ navigation }) {
    const { fontsLoaded, onLayoutRootView } = useCustomFonts();
    if (!fontsLoaded) return null; // Si las fuentes no están cargadas, se retorna null

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
    const [activationCode, setActivationCode] = useState('');// Estado para el código de activación
    const [isModalVisible, setModalVisible] = useState(false);// Estado para controlar la visibilidad del modal del escáner
    const [hasPermission, setHasPermission] = useState(null);

    const [isLoading, setIsLoading] = useState(false);  // Estado para el indicador de carga

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
            await registerWithCode(username, email, password, activationCode);
            
            await syncService.startSync();
            
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
        setActivationCode(data);  // Coloca el código escaneado en el TextInput
        setModalVisible(false);   // Cierra el modal
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

                <ScrollView style={{ flex: 1}} keyboardShouldPersistTaps="handled">
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
                        <View style={{ position: 'relative'}}>
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
                            style={({pressed}) => [
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