import React, { useState, useEffect } from 'react';
import { View, ImageBackground, SafeAreaView, StatusBar, ScrollView, ActivityIndicator, Modal, Text, Pressable } from 'react-native';
import { CameraView } from 'expo-camera';
import { getAuth, signOut } from 'firebase/auth';
import axios from 'axios';

import useCustomFonts from '../../assets/components/FontsConfigure';
import { userService, registerWithCode, getAuthErrorType } from '../../assets/services/FirebaseService';
import { useAppContext } from '../../assets/context/AppContext';
import { RegisterStyles } from '../../styles/UserAuthenticationStyles/RegisterStyles';

import AuthInput from './components/AuthInput';
import AuthAlertHandler from './components/AuthAlertHandler';
import PressableButton from './components/PressableButton';

const API_BASE_URL = 'http://192.168.56.1:3000'; // Ajustado para emulador Android

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

    const showAlert = (type) => setAlerts({ type, visible: true });
    const hideAlert = () => setAlerts({ ...alerts, visible: false });

    const registrar = async () => {
        if (!email || !password || !username || !activationCode) {
            setIsLoading(false);
            return showAlert('emptyFields');
        }

        setIsLoading(true);
        let userCredential;
        try {
            if (await userService.usernameExists(username)) {
                setIsLoading(false);
                return showAlert('usernameTaken');
            }

            userCredential = await registerWithCode(username, email, password, activationCode);
            const uid = userCredential.user.uid;

            let client_ID;
            try {
                const signupResponse = await axios.post(`${API_BASE_URL}/api/signup`, {
                    client_fire_base_ID: uid,
                    username_user: username,
                    activation_code: activationCode,
                });
                client_ID = signupResponse.data.client_ID;
                setClientId(client_ID);
                console.log('Client ID obtenido:', client_ID);
            } catch (signupError) {
                await userCredential.user.delete();
                throw new Error('Failed to register user in server');
            }

            try {
                const userDataResponse = await axios.get(`${API_BASE_URL}/api/userData/${client_ID}`);
                setGlobalData(userDataResponse.data);

                const traitsResponse = await axios.get(`${API_BASE_URL}/api/users/${client_ID}/personality`);
                setPersonalityTraits(traitsResponse.data);
            } catch (fetchError) {
                console.error('Error al obtener datos del usuario o rasgos de personalidad:', fetchError);
                showAlert('dataFetchError');
            }

            await signOut(auth);
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

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

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
                        <AuthInput
                            placeholder="Nombre de Usuario"
                            value={username}
                            onChangeText={setUsername}
                        />
                        <AuthInput
                            placeholder="Email"
                            value={email}
                            onChangeText={setEmail}
                        />
                        <AuthInput
                            placeholder="Contraseña"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={secureTextEntry}
                            onToggleSecureText={setSecureTextEntry}
                            iconName={secureTextEntry ? "eye" : "eye-off"}
                        />
                        <AuthInput
                            placeholder="Código de Activación"
                            value={activationCode}
                            onChangeText={setActivationCode}
                            iconName="qrcode"
                            onIconPress={() => setModalVisible(true)}
                        />
                    </View>
                </ScrollView>

                <View style={RegisterStyles.footer}>
                    <View style={RegisterStyles.buttonContainer}>
                        <PressableButton
                            onPress={registrar}
                            disabled={isLoading}
                            text="REGISTRARSE"
                        />
                    </View>
                    <Pressable onPress={() => navigation.navigate('Login')}>
                        <Text style={RegisterStyles.footerText}>¿Ya tienes cuenta? Inicia Sesión</Text>
                    </Pressable>
                </View>
            </View>

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

            <AuthAlertHandler
                alertType={alerts.type}
                visible={alerts.visible}
                onConfirm={handleAlertConfirm}
            />
        </SafeAreaView>
    );
}