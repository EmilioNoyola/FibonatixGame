import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, StatusBar, ScrollView, ActivityIndicator, Pressable, Animated, Easing, ImageBackground } from 'react-native';

import useCustomFonts from '../../assets/components/FontsConfigure';
import { authService, getAuthErrorType } from '../../assets/services/FirebaseService';
import { RecoverPasswordStyles } from '../../styles/UserAuthenticationStyles/recoverPasswordStyles';

import AuthInput from './components/AuthInput';
import AuthAlertHandler from './components/AuthAlertHandler';
import PressableButton from './components/PressableButton';

const alertMessages = {
    emptyFields: { title: "Campo vacío", message: "Por favor, ingresa tu correo electrónico." },
    invalidEmail: { title: "Correo Electrónico Inválido", message: "Por favor, ingresa un correo válido." },
    userNotFound: { title: "Usuario No Encontrado", message: "No existe una cuenta asociada a este correo." },
    resetError: { title: "Error al Enviar Correo", message: "Hubo un problema al enviar el correo. Intenta de nuevo." },
    resetSuccess: { title: "Correo Enviado", message: "Se ha enviado un enlace de reestablecimiento a tu correo." },
};

export default function RecoverPassword({ navigation }) {
    const { fontsLoaded, onLayoutRootView } = useCustomFonts();

    if (!fontsLoaded) return null;

    const [email, setEmail] = useState('');
    const [alerts, setAlerts] = useState({ type: null, visible: false });
    const [isLoading, setIsLoading] = useState(false);

    const slideUp = useState(new Animated.Value(300))[0];
    const inputFade1 = useState(new Animated.Value(0))[0];
    const loginFade = useState(new Animated.Value(0))[0];

    useEffect(() => {
        Animated.parallel([
            Animated.timing(slideUp, {
                toValue: 0,
                duration: 800,
                easing: Easing.out(Easing.exp),
                useNativeDriver: true,
            }),
            Animated.timing(inputFade1, {
                toValue: 1,
                duration: 400,
                delay: 200,
                useNativeDriver: true,
            }),
            Animated.timing(loginFade, {
                toValue: 1,
                duration: 400,
                delay: 600,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const showAlert = (type) => setAlerts({ type, visible: true });
    const hideAlert = () => setAlerts({ ...alerts, visible: false });

    const enviarCorreo = async () => {
        try {
            setIsLoading(true);

            if (!email) {
                setIsLoading(false);
                return showAlert('emptyFields');
            }

            await authService.resetPassword(email);
            setIsLoading(false);
            showAlert('resetSuccess');
        } catch (error) {
            console.log("Error al enviar correo de reestablecimiento:", error.code, error.message);
            setIsLoading(false);
            const errorType = getAuthErrorType(error.code);
            showAlert(errorType === 'unknown' ? 'resetError' : errorType);
        }
    };

    const handleAlertConfirm = () => {
        hideAlert();
        if (alerts.type === 'resetSuccess') {
            navigation.navigate('Login');
        }
    };

    return (
        <SafeAreaView style={RecoverPasswordStyles.main} onLayout={onLayoutRootView}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
            
            <ImageBackground
                source={require('../../assets/img/tortugas_background.jpg')}
                style={RecoverPasswordStyles.backgroundImage}
                resizeMode="cover"
            >
                <View style={RecoverPasswordStyles.backgroundOverlay} />
                
                <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} keyboardShouldPersistTaps="handled">
                    <Animated.View style={[RecoverPasswordStyles.cardContainer, { transform: [{ translateY: slideUp }] }]}>
                        <Text style={RecoverPasswordStyles.headerText}>Recuperar Contraseña</Text>
                        <Text style={RecoverPasswordStyles.subHeaderText}>Ingresa tu correo para continuar</Text>

                        <View style={RecoverPasswordStyles.inputContainer}>
                            <Animated.View style={{ opacity: inputFade1 }}>
                                <AuthInput
                                    placeholder="Email"
                                    value={email}
                                    onChangeText={setEmail}
                                    autoComplete="email"
                                />
                            </Animated.View>
                        </View>

                        <View style={RecoverPasswordStyles.buttonContainer}>
                            <PressableButton
                                onPress={enviarCorreo}
                                disabled={isLoading}
                                text="ENVIAR"
                            />
                        </View>

                        <Animated.View style={{ opacity: loginFade }}>
                            <Pressable onPress={() => navigation.navigate('Login')}>
                                <Text style={RecoverPasswordStyles.loginText}>
                                    ¿Ya tienes tu contraseña? <Text style={RecoverPasswordStyles.loginLink}>Inicia Sesión</Text>
                                </Text>
                            </Pressable>
                        </Animated.View>
                    </Animated.View>
                </ScrollView>
    
                {isLoading && (
                    <View style={RecoverPasswordStyles.loadingOverlay}>
                        <ActivityIndicator size="large" color="#fff" />
                        <Text style={RecoverPasswordStyles.loadingText}>Cargando...</Text>
                    </View>
                )}
    
                <AuthAlertHandler
                    alertType={alerts.type}
                    visible={alerts.visible}
                    onConfirm={handleAlertConfirm}
                />
            </ImageBackground>
        </SafeAreaView>
    );
}