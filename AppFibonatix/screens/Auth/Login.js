import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, StatusBar, ScrollView, ActivityIndicator, Pressable, Animated, Easing, ImageBackground } from 'react-native';

import useCustomFonts from '../../assets/components/FontsConfigure';
import { userService, authService, getAuthErrorType } from '../../assets/services/FirebaseService';
import { LoginStyles } from '../../styles/UserAuthenticationStyles/LoginStyles';

import AuthInput from './components/AuthInput';
import AuthAlertHandler from './components/AuthAlertHandler';
import PressableButton from './components/PressableButton';

const alertMessages = {
    emptyFields: { title: "Campos vacíos", message: "Por favor, completa todos los campos." },
    userNotFound: { title: "Usuario Inexistente", message: "Por favor, ingresa un Usuario válido." },
    wrongPassword: { title: "Contraseña Incorrecta", message: "Por favor, inténtalo de nuevo." },
    loginError: { title: "Error de Inicio de Sesión", message: "Hubo un problema al iniciar sesión. Intenta de nuevo." },
    loginSuccess: { title: "¡Bienvenido!", message: "Haz iniciado sesión correctamente." },
    searchError: { title: "Error en la Búsqueda de Usuario", message: "Por favor, inténtalo de nuevo." },
};

export default function Login({ navigation }) {
    const { fontsLoaded, onLayoutRootView } = useCustomFonts();

    if (!fontsLoaded) return null;

    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [alerts, setAlerts] = useState({ type: null, visible: false });
    const [isLoading, setIsLoading] = useState(false);

    const slideUp = useState(new Animated.Value(300))[0];
    const inputFade1 = useState(new Animated.Value(0))[0];
    const inputFade2 = useState(new Animated.Value(0))[0];
    const registerFade = useState(new Animated.Value(0))[0];

    useEffect(() => {
        Animated.parallel([
            Animated.timing(slideUp, {
                toValue: 0,
                duration: 800,
                easing: Easing.out(Easing.exp),
                useNativeDriver: true,
            }),
            Animated.sequence([
                Animated.timing(inputFade1, {
                    toValue: 1,
                    duration: 400,
                    delay: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(inputFade2, {
                    toValue: 1,
                    duration: 400,
                    delay: 100,
                    useNativeDriver: true,
                }),
            ]),
            Animated.timing(registerFade, {
                toValue: 1,
                duration: 400,
                delay: 600,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const showAlert = (type) => setAlerts({ type, visible: true });
    const hideAlert = () => setAlerts({ ...alerts, visible: false });

    const iniciarSesion = async () => {
        try {
            setIsLoading(true);

            if (!username || !password) {
                setIsLoading(false);
                return showAlert('emptyFields');
            }

            const userData = await userService.findUserByUsername(username);

            if (!userData) {
                setIsLoading(false);
                return showAlert('userNotFound');
            }

            const email = userData.email;
            console.log("Correo encontrado:", email);

            try {
                const userCredential = await authService.login(email, password);
                setIsLoading(false);
                console.log("Usuario autenticado:", userCredential.user);
                showAlert('loginSuccess');
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

    return (
        <SafeAreaView style={LoginStyles.main} onLayout={onLayoutRootView}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
            
            <ImageBackground
                source={require('../../assets/img/tortugas_background.jpg')}
                style={LoginStyles.backgroundImage}
                resizeMode="cover"
            >
                <View style={LoginStyles.backgroundOverlay} />
                
                <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} keyboardShouldPersistTaps="handled">
                    <Animated.View style={[LoginStyles.cardContainer, { transform: [{ translateY: slideUp }] }]}>
                        <Text style={LoginStyles.headerText}>Bienvenido</Text>
                        <Text style={LoginStyles.subHeaderText}>Inicia sesión para continuar</Text>

                        <View style={LoginStyles.inputContainer}>
                            <Animated.View style={{ opacity: inputFade1 }}>
                                <AuthInput
                                    placeholder="Nombre de Usuario"
                                    value={username}
                                    onChangeText={setUsername}
                                    autoComplete="username"
                                />
                            </Animated.View>
                            <Animated.View style={{ opacity: inputFade2 }}>
                                <AuthInput
                                    placeholder="Contraseña"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={secureTextEntry}
                                    onToggleSecureText={setSecureTextEntry}
                                    iconName={secureTextEntry ? "eye" : "eye-off"}
                                    autoComplete="password"
                                />
                            </Animated.View>
                            <Pressable
                                onPress={() => navigation.navigate('RecoverPassword')}
                                style={LoginStyles.recoverPasswordContainer}
                            >
                                <Text style={LoginStyles.recoverPasswordText}>¿Olvidaste tu contraseña?</Text>
                            </Pressable>
                        </View>

                        <View style={LoginStyles.buttonContainer}>
                            <PressableButton
                                onPress={iniciarSesion}
                                disabled={isLoading}
                                text="INICIAR SESIÓN"
                            />
                        </View>

                        <Animated.View style={{ opacity: registerFade }}>
                            <Pressable onPress={() => navigation.navigate('Register')}>
                                <Text style={LoginStyles.registerText}>
                                    ¿No tienes cuenta? <Text style={LoginStyles.registerLink}>Regístrate</Text>
                                </Text>
                            </Pressable>
                        </Animated.View>
                    </Animated.View>
                </ScrollView>
    
                {isLoading && (
                    <View style={LoginStyles.loadingOverlay}>
                        <ActivityIndicator size="large" color="#fff" />
                        <Text style={LoginStyles.loadingText}>Cargando...</Text>
                    </View>
                )}
    
                <AuthAlertHandler
                    alertType={alerts.type}
                    visible={alerts.visible}
                    onConfirm={hideAlert}
                />
            </ImageBackground>
        </SafeAreaView>
    );
}