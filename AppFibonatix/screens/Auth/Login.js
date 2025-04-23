// Componentes utilizados de React Native.
import React from 'react';  
import { Text, TextInput, View, ImageBackground, SafeAreaView, StatusBar, Pressable, ScrollView, ActivityIndicator} from 'react-native';

// Hooks utilizados de React.
import { useState } from 'react'; 

// Estilos de esta pantalla.
import { LoginStyles } from "../../styles/UserAuthenticationStyles/LoginStyles";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; 

// Alertas Personalizadas
import CustomAlert from '../../assets/apis/Alertas';

// Importamos nuestros servicios de Firebase
import '../../assets/firebase/Credentials';
import { userService, authService, getAuthErrorType } from '../../assets/firebase/FirebaseService';

// Componentes para las fuentes
import useCustomFonts from '../../assets/apis/FontsConfigure';

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
    const [alerts, setAlerts] = useState({ type: null, visible: false });
    const showAlert = (type) => setAlerts({ type, visible: true });
    const hideAlert = () => setAlerts({ ...alerts, visible: false });

    const [isLoading, setIsLoading] = useState(false);  // Estado para el indicador de carga

    // Método para iniciar sesión
    const iniciarSesion = async () => {
        try {
            setIsLoading(true);

            if (!username || !password) {
                setIsLoading(false);
                return showAlert('emptyFields');
            }

            // Obtener el correo asociado al nombre de usuario
            const userData = await userService.findUserByUsername(username);

            if (!userData) {
                setIsLoading(false);
                return showAlert('userNotFound');
            }

            const email = userData.email;
            console.log("Correo encontrado:", email);
            
            // Iniciar sesión usando el correo y la contraseña
            try {
                const userCredential = await authService.login(email, password);
                setIsLoading(false);
                console.log("Usuario autenticado:", userCredential.user);
                showAlert('loginSuccess');
                // Aquí podrías navegar a la pantalla principal después de iniciar sesión
            } catch (error) {
                console.log("Error al iniciar sesión:", error.code, error.message);
                setIsLoading(false);
                const errorType = getAuthErrorType(error.code);
                showAlert(errorType === 'unknown' ? 'loginError' : errorType);
            }
        } catch (error) {
            console.log("Error en la búsqueda del usuario:", error.message);
            setIsLoading(false);
            showAlert('searchError');
        }
    };

    // Devuelve el título de cada alerta
    const mostrarTituloAlerta = (type) => {
        switch (type) {
            case 'emptyFields': return "Campos vacíos";
            case 'userNotFound': return "Usuario Inexistente";
            case 'wrongPassword': return "Contraseña Incorrecta";
            case 'loginError': return "Error de Inicio de Sesión";
            case 'loginSuccess': return "¡Bienvenido!";
            case 'searchError': return "Error en la Búsqueda de Usuario";
            default: return "Alerta";
        }
    };
    
    // Devuelve el mensaje de la alerta
    const mostrarMensajeAlerta = (type) => {
        switch (type) {
            case 'emptyFields': return "Por favor, completa todos los campos.";
            case 'userNotFound': return "Por favor, ingresa un Usuario válido.";
            case 'wrongPassword': return "Por favor, inténtalo de nuevo.";
            case 'loginError': return "Hubo un problema al iniciar sesión. Intenta de nuevo.";
            case 'loginSuccess': return "Haz iniciado sesión correctamente.";
            case 'searchError': return "Por favor, inténtalo de nuevo.";
            default: return "";
        }
    };

    return (
        <SafeAreaView style={LoginStyles.main} onLayout={onLayoutRootView}>
            <StatusBar
                barStyle="light-content"
                translucent={true}
                backgroundColor="transparent"
            />

            <View style={LoginStyles.container}>
                <ImageBackground source={require('../../assets/img/tortugas_background.jpg')} style={LoginStyles.backgroundImage} />

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
                            onPress={iniciarSesion}
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

            {/* Alerta dinámica */}
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