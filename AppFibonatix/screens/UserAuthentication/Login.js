// Componentes utilizados de React Native.
import React from 'react';  
import { Text, TextInput, View, ImageBackground, SafeAreaView, StatusBar, Pressable, ScrollView, ActivityIndicator} from 'react-native';

// Hooks utilizados de React.
import { useState } from 'react'; 

// Estilos de esta pantalla.
import { LoginStyles } from "../../styles/UserAuthenticationStyles/LoginStyles";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; 

// Alertas Personalizadas
import CustomAlert from '../../apis/Alertas';  // Importamos la función de alerta personalizada

// Funciones proporcionadas por Firebase.
import '../../apis/Credentials'
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";

// Componentes para las fuentes
import useCustomFonts from '../../apis/FontsConfigure';

import { CommonActions } from '@react-navigation/native';

export default function Login(props) {

    const { fontsLoaded, onLayoutRootView } = useCustomFonts();

    // Si las fuentes no están cargadas, se retorna null
    if (!fontsLoaded) return null;

    // Estado para ocultar o mostrar la contraseña.
    const [secureTextEntry, setSecureTextEntry] = useState(true);

    // Estado para obtener la entrada del usuario de la contraseña y el nombre de usuario.
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // Estados para controlar la visibilidad de las alertas
    const [showAlert1, setShowAlert1] = useState(false); 
    const [showAlert2, setShowAlert2] = useState(false); 
    const [showAlert3, setShowAlert3] = useState(false);
    const [showAlert4, setShowAlert4] = useState(false);
    const [showAlert5, setShowAlert5] = useState(false);

    const auth = getAuth();
    const db = getFirestore();

    const [isLoading, setIsLoading] = useState(false);  // Estado para el indicador de carga

    // Buscar el correo electrónico basado en el nombre de usuario
    const buscarUsuario = async (username) => {

        const q = query(collection(db, "users"), where("username", "==", username));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {

            // Retornar el correo electrónico si el nombre de usuario existe
            return querySnapshot.docs[0].data().email;

        } else {

            // Alerta: Manejar el caso en el que el nombre de usuario no existe
            console.log("El nombre de usuario no existe.");
            setIsLoading(false);  // Desactiva al iniciar sesión correctamente
            setShowAlert1(true);
            return null;
        }

    };

    const IniciarSesion = async () => {

        try {

            setIsLoading(true);  // Activa el estado de carga

            if (username && password) {

                // Obtener el correo asociado al nombre de usuario
                const email = await buscarUsuario(username);

                if(email) {

                console.log("Correo encontrado:", email);
                
                // Iniciar sesión usando el correo y la contraseña
                signInWithEmailAndPassword(auth, email, password)

                .then((userCredential) => {
                    const user = userCredential.user;
                    setIsLoading(false);  // Desactiva al iniciar sesión correctamente
                    console.log("Usuario autenticado:", user);
                    // Dentro de tu función que maneja el login, por ejemplo
                })

                    .catch((error) => {
                        console.log("Error al iniciar sesión:", error.code, error.message);
                        setIsLoading(false);  // Desactiva el estado si hay un error
                        // Alerta: Manejar el caso en el que la autenticación falla
                         // Si la alerta de usuario inexistente no está activa, mostrar la alerta de contraseña incorrecta.
                        if (!showAlert1) {
                            setShowAlert3(true); // Mostrar alerta de contraseña incorrecta
                        }
                    });

                }

            } else {
                setIsLoading(false);  // Desactiva el estado si los campos están vacíos
                console.log("Campos de texto vacíos.");
                // Alerta: Manejar el caso en el que los campos de texto están vacíos
                setShowAlert4(true);
            }

        } catch (error) {
            console.log("Error en la búsqueda del usuario:", error.message);
            setIsLoading(false);  // Desactiva el estado en caso de error
            // Alerta: Error en la busqueda del usuario.
            setShowAlert5(true);
        }

    };

    return (

        <SafeAreaView style= {LoginStyles.main} onLayout={onLayoutRootView}>

            <StatusBar
                barStyle="light-content"
                translucent={true}
                backgroundColor="transparent"
            />

            <View style={LoginStyles.container}>

                <ImageBackground source={require('../../assets/tortugas_background.jpg')} style={LoginStyles.backgroundImage} />

                <View style={LoginStyles.header}>

                    <Text style={LoginStyles.headerText}>INICIO DE SESIÓN</Text>

                </View>

                <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled">

                    <View style={LoginStyles.inputContainer}>

                        <TextInput
                            placeholder="Nombre de Usuario"
                            autoComplete='username'
                            value={username}
                            onChangeText={setUsername}
                            style={LoginStyles.input}
                        />

                        <View style={{ position: 'relative', paddingTop: 35 }}>

                            <TextInput
                                placeholder="Contraseña"
                                autoComplete='password'
                                secureTextEntry={secureTextEntry}  
                                value={password}
                                onChangeText={setPassword}
                                style={LoginStyles.input}
                            />

                            <Pressable 
                                style={LoginStyles.eyeIconContainer} 
                                onPress={() => setSecureTextEntry(!secureTextEntry)}
                                hitSlop={35}
                            >

                                <Icon
                                    name={secureTextEntry ? "eye" : "eye-off"} 
                                    size={38}
                                    color="#0B5A39"
                                    style={LoginStyles.eyeIconBelow}
                                />

                            </Pressable>

                            <View>

                                <Pressable 
                                
                                    onPress={() => props.navigation.navigate('RecoverPassword')}

                                    style={({pressed}) => [
                                        {
                                            backgroundColor: pressed ? '#a9f7a2d8' : '#A9F7A27A',
                                        },
                                        LoginStyles.ButtonRecoverPasswordContainer,
                                    ]}

                                    
                                >

                                    <Text style={LoginStyles.ButtonRecoverPassword}>¿Olvidaste tu contraseña?</Text>

                                </Pressable>

                            </View>

                        </View>

                    </View>

                </ScrollView>

                <View style={LoginStyles.footer}>

                    <View style={LoginStyles.buttonContainer}>

                        <Pressable 
                            
                            style={({pressed}) => [
                                {
                                    backgroundColor: pressed ? '#1f8a83' : '#239790',
                                },
                                LoginStyles.button,
                            ]}

                            onPress={IniciarSesion}
                            disabled={isLoading}
                        
                        >
                            <Text style={LoginStyles.buttonText}>INICIAR SESIÓN</Text>

                        </Pressable>

                    </View>

                    <Pressable onPress={() => props.navigation.navigate('Register')}>

                        <Text style={LoginStyles.footerText}>¿No tienes cuenta? Regístrate</Text>
                        
                    </Pressable>

                </View>

            </View>

            {/* Indicador de carga */}
            {isLoading && (
                <View style={LoginStyles.loadingContainer}>
                    <ActivityIndicator size="large" color="#FFF" />
                    <Text style={LoginStyles.loadingText}>Cargando...</Text>
                </View>
            )}

            {/* Llamada a la alerta sobre campos vacíos. */}
            <CustomAlert
                showAlert={showAlert1}
                title="Usuario Inexistente"
                message="Por favor, ingresa un Usuario válido."
                onConfirm={() => setShowAlert1(false)}
                confirmButtonColor={"#0B5A39"}
                confirmText={"Aceptar"}
            /> 

            {/* Llamada a la alerta sobre registro exitoso */}
            <CustomAlert
                showAlert={showAlert2}
                title="¡Bienvenido!"
                message="Haz iniciado sesión correctamente."
                onConfirm={() => {
                    setShowAlert2(false); // Primera acción
                }}
                confirmButtonColor={"#0B5A39"}
                confirmText={"Aceptar"}
            />

            {/* Llamada a la alerta sobre guardado de usuario fallido. */}
            <CustomAlert
                showAlert={showAlert3}
                title="Contraseña Incorrecta"
                message="Por favor, inténtalo de nuevo."
                onConfirm={() => {
                    setShowAlert3(false); // Primera acción
                }}
                confirmButtonColor={"#0B5A39"}
                confirmText={"Aceptar"}
            />

            {/* Llamada a la alerta sobre registro fallido. */}
            <CustomAlert
                showAlert={showAlert4}
                title="Campos vacíos"
                message="Por favor, completa todos los campos."
                onConfirm={() => {
                    setShowAlert4(false); // Primera acción
                }}
                confirmButtonColor={"#0B5A39"}
                confirmText={"Aceptar"}
            />

            {/* Llamada a la alerta sobre registro fallido. */}
            <CustomAlert
                showAlert={showAlert5}
                title="Error en la Búsqueda de Usuario"
                message="Por favor, inténtalo de nuevo."
                onConfirm={() => {
                    setShowAlert5(false); // Primera acción
                }}
                confirmButtonColor={"#0B5A39"}
                confirmText={"Aceptar"}
            />

        </SafeAreaView>

    );
}