import React, { useState } from 'react';
import { View, ImageBackground, SafeAreaView, StatusBar, ScrollView, ActivityIndicator, Text, Pressable } from 'react-native';

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
                        <AuthInput
                            placeholder="Nombre de Usuario"
                            value={username}
                            onChangeText={setUsername}
                            autoComplete="username"
                        />
                        <View style={{ paddingTop: 35 }}>
                            <AuthInput
                                placeholder="Contraseña"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={secureTextEntry}
                                onToggleSecureText={setSecureTextEntry}
                                iconName={secureTextEntry ? "eye" : "eye-off"}
                                autoComplete="password"
                            />
                            <PressableButton
                                onPress={() => navigation.navigate('RecoverPassword')}
                                text="¿Olvidaste tu contraseña?"
                                style={LoginStyles.ButtonRecoverPasswordContainer}
                                textStyle={LoginStyles.ButtonRecoverPassword}
                                pressedColor="#a9f7a2d8"
                                defaultColor="#A9F7A27A"
                            />
                        </View>
                    </View>
                </ScrollView>

                <View style={LoginStyles.footer}>
                    <View style={LoginStyles.buttonContainer}>
                        <PressableButton
                            onPress={iniciarSesion}
                            disabled={isLoading}
                            text="INICIAR SESIÓN"
                        />
                    </View>
                    <Pressable onPress={() => navigation.navigate('Register')}>
                        <Text style={LoginStyles.footerText}>¿No tienes cuenta? Regístrate</Text>
                    </Pressable>
                </View>
            </View>

            {isLoading && (
                <View style={LoginStyles.loadingContainer}>
                    <ActivityIndicator size="large" color="#FFF" />
                    <Text style={LoginStyles.loadingText}>Cargando...</Text>
                </View>
            )}

            <AuthAlertHandler
                alertType={alerts.type}
                visible={alerts.visible}
                onConfirm={hideAlert}
            />
        </SafeAreaView>
    );
}