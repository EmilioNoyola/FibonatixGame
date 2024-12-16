// Componentes y hooks que se utilizan de React.
import React from 'react'; 
import { Text, TextInput, View, ImageBackground, SafeAreaView, StatusBar, Pressable, ScrollView, ActivityIndicator, Modal } from 'react-native';
import { useState } from 'react'; 

// Estilos de esta pantalla.
import { RegisterStyles } from "../../styles/UserAuthenticationStyles/RegisterStyles";

// Función de la camara.
import QRCamera from '../../apis/QRCamera'; 

// Iconos personalizados.
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; 

// Alertas Personalizadas
import CustomAlert from '../../apis/Alertas';

// Autenticación con Firebase
import '../../apis/Credentials';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, setDoc, doc, query, where, getDocs, collection } from "firebase/firestore";

// Fuentes personalizadas.
import useCustomFonts from '../../apis/FontsConfigure';

export default function Register({ navigation }) {

    const { fontsLoaded, onLayoutRootView } = useCustomFonts();
    if (!fontsLoaded) return null; // Si las fuentes no están cargadas, se retorna null

    // Estados para controlar la visibilidad de las alertas
    const [alerts, setAlerts] = useState({ type: null, visible: false });
    const showAlert = (type) => setAlerts({ type, visible: true });
    const hideAlert = () => setAlerts({ ...alerts, visible: false });

    // Definimos un estado para manejar la visibilidad de la contraseña
    const [secureTextEntry, setSecureTextEntry] = useState(true);

    // Definimos estados para manejar los campos de entrada.
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [activationCode, setActivationCode] = useState('');// Estado para el código de activación
    const [isModalVisible, setModalVisible] = useState(false);// Estado para controlar la visibilidad del modal del escáner

    // Inicializamos el servidor de autenticación de firebase.
    const auth = getAuth();
    // Inicializamos el servidor de base de datos ( Firestore ) de firebase.
    const db = getFirestore();

    const [isLoading, setIsLoading] = useState(false);  // Estado para el indicador de carga

    // Función para manejar la lectura del código QR
    const leerCodigoQR = (data) => {
        setActivationCode(data); // Almacena el código escaneado
        setModalVisible(false); // Cierra el modal
    };

    // Función para verificar si el nombre de usuario existe.
    const verificarUsuario = async () => {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("username", "==", username));
        const querySnapshot = await getDocs(q);
        return !querySnapshot.empty;
    };

    // Función para registrar un nuevo usuario
    const Registrar = async () => {
        if (!email || !password || !username ) return showAlert('emptyFields');

        setIsLoading(true);
        try {
            if (await verificarUsuario()) return showAlert('usernameTaken');

            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await setDoc(doc(db, "users", userCredential.user.uid), { username, email, activationCode });

            showAlert('registerSuccess');
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            const errorType = obtenerError(error.code);
            showAlert(errorType);
        }
    };

    // Función que devuelve el título de cada alerta dependiendo el caso.
    const mostrarTituloAlerta = (type) => {
        switch (type) {
            case 'emptyFields': return "Campos vacíos";
            case 'usernameTaken': return "Nombre de Usuario Inválido";
            case 'invalidEmail': return "Correo Electrónico Inválido";
            case 'emailInUse': return "Correo Electrónico en Uso";
            case 'weakPassword': return "Contraseña Inválida";
            case 'registerError': return "Error de Registro";
            case 'registerSuccess': return "Registro Exitoso";
            default: return "Alerta";
        }
    };
    
    // Función que devuelve el mensaje de la alerta dependiendo el caso.
    const mostrarMensajeAlerta = (type) => {
        switch (type) {
            case 'emptyFields': return "Por favor, completa todos los campos.";
            case 'usernameTaken': return "Este nombre de usuario ya está en uso.";
            case 'invalidEmail': return "Por favor, ingresa un correo válido.";
            case 'emailInUse': return "Este correo electrónico ya está en uso.";
            case 'weakPassword': return "La contraseña debe tener al menos 6 caracteres.";
            case 'registerError': return "Hubo un problema con el registro. Intenta de nuevo.";
            case 'registerSuccess': return "Registro completado con éxito.";
            default: return "";
        }
    };

    // Función que devuelve el código de error dependiendo el caso.
    const obtenerError = (errorCode) => {
        switch (errorCode) {
            case 'auth/invalid-email': return 'invalidEmail';
            case 'auth/email-already-in-use': return 'emailInUse';
            case 'auth/weak-password': return 'weakPassword';
            default: return 'registerError';
        }
    };

    return (

        <SafeAreaView style= {RegisterStyles.main} onLayout={onLayoutRootView}>

            <StatusBar
                barStyle="light-content"
                translucent={true}
                backgroundColor="transparent"
            />

            <View style={RegisterStyles.container}>

                <ImageBackground source={require('../../assets/tortugas_background.jpg')} style={RegisterStyles.backgroundImage} />

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

                            <View style={{ position: 'relative'}}>
                                
                                <TextInput
                                    placeholder="Código de Activación" 
                                    value={activationCode} // Mostrar el código de activación escaneado
                                    style={RegisterStyles.input}
                                    editable={false} // No editable

                                />

                                <Pressable 
                                    style={RegisterStyles.eyeIconContainer} 

                                >

                                    <Icon
                                        name='qrcode'
                                        size={38}
                                        color="#0B5A39"
                                        style={RegisterStyles.eyeIconBelow}
                                    />

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

                            onPress={Registrar}
                            disabled={isLoading}  // Deshabilitar el botón si está cargando
                        
                        >

                            <Text style={RegisterStyles.buttonText}>REGISTRARSE</Text>

                        </Pressable>

                    </View>

                    <Pressable onPress={() => navigation.navigate('Login')}>
                            <Text style={RegisterStyles.footerText}>¿Ya tienes cuenta? Inicia Sesión</Text>
                    </Pressable>

                </View>

            </View>   

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