import React, { useState, useEffect } from 'react';
import { View, ImageBackground, SafeAreaView, StatusBar, ScrollView, ActivityIndicator, Modal, Text, Pressable, Animated, Easing } from 'react-native';
import { CameraView } from 'expo-camera';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import axios from 'axios';

import useCustomFonts from '../../assets/components/FontsConfigure';
import { userService, registerWithCode, getAuthErrorType } from '../../assets/services/FirebaseService';
import { useAppContext } from '../../assets/context/AppContext';
import { RegisterStyles } from '../../styles/UserAuthenticationStyles/RegisterStyles';

import AuthInput from './components/AuthInput';
import AuthAlertHandler from './components/AuthAlertHandler';
import PressableButton from './components/PressableButton';

const API_BASE_URL = 'https://shurtleserver-production.up.railway.app/';

export default function Register({ navigation }) {
    const { fontsLoaded, onLayoutRootView } = useCustomFonts();
    const { setGlobalData, setPersonalityTraits, setClientId } = useAppContext();

    if (!fontsLoaded) return null;

    const [alerts, setAlerts] = useState({ type: null, visible: false });
    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [activationCode, setActivationCode] = useState('');
    const [isModalVisible, setModalVisible] = useState(false);
    const [hasPermission, setHasPermission] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const auth = getAuth();

    const slideUp = useState(new Animated.Value(300))[0];
    const inputFade1 = useState(new Animated.Value(0))[0];
    const inputFade2 = useState(new Animated.Value(0))[0];
    const inputFade3 = useState(new Animated.Value(0))[0];
    const inputFade4 = useState(new Animated.Value(0))[0];
    const loginFade = useState(new Animated.Value(0))[0];

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
                Animated.timing(inputFade3, {
                    toValue: 1,
                    duration: 400,
                    delay: 100,
                    useNativeDriver: true,
                }),
                Animated.timing(inputFade4, {
                    toValue: 1,
                    duration: 400,
                    delay: 100,
                    useNativeDriver: true,
                }),
            ]),
            Animated.timing(loginFade, {
                toValue: 1,
                duration: 400,
                delay: 600,
                useNativeDriver: true,
            }),
        ]).start();

        (async () => {
            const { status } = await CameraView.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const showAlert = (type) => setAlerts({ type, visible: true });
    const hideAlert = () => setAlerts({ ...alerts, visible: false });

    const registrar = async () => {
        if (!email || !password || !username || !activationCode) {
            setIsLoading(false);
            return showAlert('emptyFields');
        }

        setIsLoading(true);
        try {
            if (await userService.usernameExists(username)) {
                setIsLoading(false);
                return showAlert('usernameTaken');
            }

            // Registrar en Firebase Authentication y esperar a que se complete.
            const userCredential = await registerWithCode(username, email, password, activationCode);
            let uid;
            await new Promise((resolve) => {
                const unsubscribe = onAuthStateChanged(auth, (user) => {
                    if (user) {
                        uid = user.uid;
                        unsubscribe();
                        resolve();
                    }
                });
            });

            if (!uid) throw new Error('No se pudo obtener el UID del usuario');

            let client_ID;
            let attempt = 0;
            const maxAttempts = 3;

            while (attempt < maxAttempts) {
                try {
                    const signupResponse = await axios.post(`${API_BASE_URL}api/signup`, {
                        client_fire_base_ID: uid,
                        username_user: username,
                        activation_code: activationCode,
                    }, { timeout: 5000 });
                    console.log('Respuesta de /api/signup:', signupResponse.data);
                    client_ID = signupResponse.data.client_ID;
                    break;
                } catch (signupError) {
                    attempt++;
                    console.error(`Intento ${attempt} - Detalles del error de /api/signup:`, signupError.response ? signupError.response.data : signupError.message);
                    if (attempt === maxAttempts) throw signupError;
                    await new Promise(resolve => setTimeout(resolve, 1000)); 
                }
            }

            if (!client_ID) {
                client_ID = await getClientIdFromServer(uid);
                if (!client_ID) throw new Error('Failed to register user in server');
                console.log('Recuperado client_ID tras reintentos:', client_ID);
            }

            setClientId(client_ID);

            try {
                const userDataResponse = await axios.get(`${API_BASE_URL}/api/userData/${client_ID}`);
                setGlobalData(userDataResponse.data);

                const traitsResponse = await axios.get(`${API_BASE_URL}/api/users/${client_ID}/personality`);
                setPersonalityTraits(traitsResponse.data);
            } catch (fetchError) {
                console.error('Error al obtener datos del usuario o rasgos de personalidad:', fetchError);
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
            } else if (error.message === 'Failed to register user in server') {
                errorType = 'serverRegisterError';
            }

            showAlert(errorType);
        }
    };

    // Función auxiliar para obtener client_ID desde /api/getClientId
    const getClientIdFromServer = async (uid) => {
        let attempt = 0;
        const maxAttempts = 3;

        while (attempt < maxAttempts) {
            try {
                const response = await axios.post(`${API_BASE_URL}/api/getClientId`, { client_fire_base_ID: uid }, { timeout: 5000 });
                console.log('Respuesta de /api/getClientId:', response.data);
                return response.data.client_ID;
            } catch (error) {
                attempt++;
                console.error(`Intento ${attempt} - Error al obtener client_ID:`, error.response ? error.response.data : error.message);
                if (attempt === maxAttempts) return null;
                await new Promise(resolve => setTimeout(resolve, 1000)); 
            }
        }
        return null;
    };

    const handleBarCodeScanned = ({ data }) => {
        setActivationCode(data);
        setModalVisible(false);
    };

    const handleAlertConfirm = () => {
        hideAlert();
        if (alerts.type === 'registerSuccess') {
            navigation.navigate('Login');
        }
    };

    return (
        <SafeAreaView style={RegisterStyles.main} onLayout={onLayoutRootView}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
            
            <ImageBackground
                source={require('../../assets/img/tortugas_background.jpg')}
                style={RegisterStyles.backgroundImage}
                resizeMode="cover"
            >
                <View style={RegisterStyles.backgroundOverlay} />
                
                <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} keyboardShouldPersistTaps="handled">
                    <Animated.View style={[RegisterStyles.cardContainer, { transform: [{ translateY: slideUp }] }]}>
                        <Text style={RegisterStyles.headerText}>Regístrate</Text>
                        <Text style={RegisterStyles.subHeaderText}>Crea una cuenta para comenzar</Text>

                        <View style={RegisterStyles.inputContainer}>
                            <Animated.View style={{ opacity: inputFade1 }}>
                                <AuthInput
                                    placeholder="Nombre de Usuario"
                                    value={username}
                                    onChangeText={setUsername}
                                />
                            </Animated.View>
                            <Animated.View style={{ opacity: inputFade2 }}>
                                <AuthInput
                                    placeholder="Email"
                                    value={email}
                                    onChangeText={setEmail}
                                />
                            </Animated.View>
                            <Animated.View style={{ opacity: inputFade3 }}>
                                <AuthInput
                                    placeholder="Contraseña"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={secureTextEntry}
                                    onToggleSecureText={setSecureTextEntry}
                                    iconName={secureTextEntry ? "eye" : "eye-off"}
                                />
                            </Animated.View>
                            <Animated.View style={{ opacity: inputFade4 }}>
                                <AuthInput
                                    placeholder="Código de Activación"
                                    value={activationCode}
                                    onChangeText={setActivationCode}
                                    iconName="qrcode"
                                    onIconPress={() => setModalVisible(true)}
                                />
                            </Animated.View>
                        </View>

                        <View style={RegisterStyles.buttonContainer}>
                            <PressableButton
                                onPress={registrar}
                                disabled={isLoading}
                                text="REGISTRARSE"
                            />
                        </View>

                        <Animated.View style={{ opacity: loginFade }}>
                            <Pressable onPress={() => navigation.navigate('Login')}>
                                <Text style={RegisterStyles.loginText}>
                                    ¿Ya tienes cuenta? <Text style={RegisterStyles.loginLink}>Inicia Sesión</Text>
                                </Text>
                            </Pressable>
                        </Animated.View>
                    </Animated.View>
                </ScrollView>

                <Modal visible={isModalVisible} animationType="fade">
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
                    <View style={RegisterStyles.loadingOverlay}>
                        <ActivityIndicator size="large" color="#fff" />
                        <Text style={RegisterStyles.loadingText}>Cargando...</Text>
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