// Componentes y hooks de React.
import React from 'react'; 
import { Text, TextInput, View, ImageBackground, SafeAreaView, StatusBar, Pressable, ScrollView, ActivityIndicator, Modal, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react'; 

// Iconoss
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; 

// Alertas
import CustomAlert from '../../apis/Alertas';

// Fuentes personalizadas.
import useCustomFonts from '../../apis/FontsConfigure';

// Autenticación con Firebase
import '../../apis/Credentials';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, setDoc, doc, query, where, getDocs, collection, runTransaction, updateDoc, } from "firebase/firestore";

// Expo Camera
import { Camera, CameraView } from 'expo-camera';

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

    // Inicializamos el servidor de autenticación de firebase.
    const auth = getAuth();
    // Inicializamos el servidor de base de datos ( Firestore ) de firebase.
    const db = getFirestore();

    const [isLoading, setIsLoading] = useState(false);  // Estado para el indicador de carga

    // Verifica si el nombre de usuario existe.
    const verificarUsuario = async () => {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("username", "==", username));
        const querySnapshot = await getDocs(q);
        return !querySnapshot.empty;
    };

    const verificarCodigo = async (code) => {
        if (!code) return false;
    
        const codeRef = collection(db, "activationCodes");
        const q = query(codeRef, where("code", "==", code), where("used", "==", false));
        const querySnapshot = await getDocs(q);
    
        if (querySnapshot.empty) return false; // Si no encuentra un código válido, retorna false
    
        // Devuelve la referencia del documento del código de activación
        return querySnapshot.docs[0].ref;
    };    

    // Registra un nuevo usuario
    const Registrar = async () => {
        if (!email || !password || !username || !activationCode) {
            setIsLoading(false);
            return showAlert('emptyFields');
        }
        setIsLoading(true);
            try {
            if (await verificarUsuario()) {
                setIsLoading(false);
                return showAlert('usernameTaken');
            }
        
            const codeDocRef = await verificarCodigo(activationCode);
            if (!codeDocRef) {
                setIsLoading(false);
                return showAlert('invalidCode'); // Código no válido o ya usado
            }
        
            // Ejecutar una transacción para garantizar la actualización atómica
            await runTransaction(db, async (transaction) => {
                const codeDoc = await transaction.get(codeDocRef);
                if (!codeDoc.exists() || codeDoc.data().used) {
                throw new Error("Código inválido o ya utilizado");
                }
        
                // Crear la cuenta en Firebase Authentication
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
                // Guardar el usuario en Firestore
                transaction.set(doc(db, "users", userCredential.user.uid), {
                    username,
                    email,
                    activationCode,
                    license: 3
                });
        
                // Marcar el código de activación como usado
                transaction.update(codeDocRef, { 
                    used: true,
                    usedBy: userCredential.user.uid,
                    redeemedAt: new Date().toISOString() 
                });
            });
        
            showAlert('registerSuccess');
        } catch (error) {
            console.error("Error en registro:", error);
            const errorType = obtenerError(error.code) || 'registerError';
            showAlert(errorType);
        }
        setIsLoading(false);
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

    // Devuelve el código de error.
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
                            <TextInput placeholder="Código de Activación" value={activationCode} style={RegisterStyles.input} editable={true} onChangeText={setActivationCode} />
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

                            onPress={Registrar}
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

export const RegisterStyles = StyleSheet.create({
    main: {
        flex: 1, 
        backgroundColor: '#B1F6C3',
    },

    container: {
        flex: 1,
        backgroundColor: '#B1F6C3',
    },
    
    backgroundImage: {
        resizeMode: 'contain',
        position: 'absolute',
        opacity: 0.7,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    
    header: {   
        width: '100%',
        height: 97,
        backgroundColor: '#0B5A39',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
    },

    headerText: {
        color: '#E0F9E4',
        fontSize: 40,
        textTransform: 'uppercase',
        fontFamily: 'Quicksand',
    },

    inputContainer: {
        alignItems: 'center',
        height: 350,
        marginTop: 70,
    },
    
    input: {
        fontFamily: 'Quicksand_SemiBold',
        width: 274,
        height: 58,
        borderRadius: 27,
        paddingHorizontal: 20,
        backgroundColor: '#E8FCE9',
        color: '#01160399',
        opacity: 0.95,
        marginBottom: 35,
    },

    eyeIconContainer: {
        position: 'absolute',
        right: 20,
        top: 10, 
        height: 38,
        width: 38,
        justifyContent: 'center',
        alignItems: 'center',
    },

    buttonContainer: {
        bottom: 60
    },
    
    button: {
        width: 274,
        height: 58,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 27,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 7 },
            shadowOpacity: 0.8,
            shadowRadius: 4,
            elevation: 5,
    },    

    buttonText: {
        color: '#fff',
        fontSize: 15,
        fontFamily: 'Quicksand',
    },
    
    footer: {
        height: 167, 
        backgroundColor: '#0B5A39',
        justifyContent: 'center', 
        alignItems: 'center',    
        marginTop: 20, 
        bottom: 0,  
        left: 0,   
        right: 0,   
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -7 },
            shadowOpacity: 0.8,
            shadowRadius: 12,
            elevation: 15,
    },

    footerText: {
        color: '#9DE0B6',
        fontSize: 14,
        justifyContent: 'center',
        alignItems: 'center',   
        bottom: 20,
        fontFamily: 'Quicksand_Medium',
    },

    loadingContainer: {
        position: 'absolute', // Hace que el contenedor se superponga al resto del contenido
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo oscuro semitransparente
        justifyContent: 'center', // Centra el contenido verticalmente
        alignItems: 'center', // Centra el contenido horizontalmente
        zIndex: 10, // Hace que el contenedor esté por encima de otros elementos
    },

    loadingText: {
        color: '#fff',
        fontSize: 18,
        marginTop: 10,
        textAlign: 'center',
    },

    modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' },
    modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
    camera: { width: 300, height: 400 },
    modalCloseButton: { marginTop: 20, backgroundColor: '#0B5A39', padding: 10, borderRadius: 10 },
    modalCloseText: { color: 'white', fontSize: 16 }
})