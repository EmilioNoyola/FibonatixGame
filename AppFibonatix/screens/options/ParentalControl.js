import React from 'react';  
import { Text, View, SafeAreaView, StatusBar, Pressable, StyleSheet, Image, TextInput, Dimensions, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import useCustomFonts from '../../assets/components/FontsConfigure';
import Ionicons from '@expo/vector-icons/Ionicons';
import CustomAlert from '../../assets/components/CustomAlert';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../assets/services/Credentials';
import { useAppContext } from '../../assets/context/AppContext';
import { encryptPin, decryptPin } from '../../assets/cifrado/CryptoUtils';

const { width, height } = Dimensions.get('window');

export default function ParentalControl(props) {
    const { fontsLoaded, onLayoutRootView } = useCustomFonts();
    if (!fontsLoaded) return null;
    
    const navigation = useNavigation();
    const { user, clientId } = useAppContext();
    const [pin, setPin] = useState('');
    const [showSetupText, setShowSetupText] = useState(false); // Nuevo estado para el texto de configuración
    const [alerts, setAlerts] = useState({ type: null, visible: false });
    const [isFirstTimeSetup, setIsFirstTimeSetup] = useState(false);
    
    useEffect(() => {
        const loadPin = async () => {
            if (user && clientId) {
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists()) {
                    const data = userDoc.data();
                    const hasPin = !!data.encryptedPin;
                    setShowSetupText(!hasPin);
                    setIsFirstTimeSetup(!hasPin); 
                }
            }
        };
        loadPin();
    }, [user, clientId]);

    const showAlert = (type) => setAlerts({ type, visible: true });
    const hideAlert = () => setAlerts({ ...alerts, visible: false });
    
    const handleConfirmAlert = async () => {
        switch (alerts.type) {
            case "resetProgress": await handleResetProgress(); hideAlert(); break;
            case "progressReset": hideAlert(); break;
            case "invalidPin": hideAlert(); setPin(''); break;
            case "forgotPin": navigation.navigate('RecoverPin'); hideAlert(); break;
            default: hideAlert(); break;
        }
    };

    const mostrarTituloAlerta = (type) => {
        switch (type) {
            case "resetProgress": return "Reiniciar Progreso";
            case "progressReset": return "Progreso Reiniciado";
            case "invalidPin": return "PIN Incorrecto";
            case "forgotPin": return "Recuperar PIN";
            default: return "Alerta";
        }
    };
    
    const mostrarMensajeAlerta = (type) => {
        switch (type) {
            case "resetProgress": return "¿Estás seguro de que deseas reiniciar todo tu progreso? Esto no se puede deshacer.";
            case "progressReset": return "Todo tu progreso ha sido reiniciado.";
            case "invalidPin": return "El PIN ingresado es incorrecto. Por favor, intenta nuevamente.";
            case "forgotPin": return "Dirígete a la pantalla de recuperación para recuperar tu PIN.";
            default: return "";
        }
    };
    
    const textoConfirmar = (type) => {
        switch (type) {
            case "resetProgress": return "Sí, Reiniciar";
            case "progressReset": return "Aceptar";
            case "invalidPin": return "Intentar de nuevo";
            case "forgotPin": return "Recuperar";
            default: return "Aceptar";
        }
    };
    
    const textoCancelar = (type) => {
        switch (type) { 
            case "resetProgress": return "Cancelar";
            default: return null;
        }
    };  

    const handlePinSubmit = async () => {
        if (!user || !clientId) {
            showAlert("invalidPin");
            return;
        }

        // Validar formato del PIN (4 dígitos)
        if (pin.length !== 4 || !/^\d+$/.test(pin)) {
            showAlert("invalidPin");
            return;
        }

        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (!userDoc.exists()) {
            showAlert("invalidPin");
            return;
        }

        const data = userDoc.data();
        const storedEncryptedPin = data.encryptedPin;

        if (isFirstTimeSetup) {
            // Mostrar confirmación para primera configuración
            Alert.alert(
                "Confirmar PIN",
                "¿Estás seguro de que deseas establecer este PIN? Asegúrate de recordarlo.",
                [
                    {
                        text: "Cancelar",
                        style: "cancel"
                    },
                    { 
                        text: "Confirmar", 
                        onPress: async () => {
                            try {
                                const password = await new Promise((resolve) => {
                                    Alert.prompt(
                                        "Establece tu contraseña", 
                                        "Ingresa una contraseña segura para cifrar el PIN (mínimo 8 caracteres):",
                                        (text) => {
                                            if (text && text.length >= 8) {
                                                resolve(text);
                                            } else {
                                                Alert.alert("Contraseña inválida", "La contraseña debe tener al menos 8 caracteres.");
                                                resolve(null);
                                            }
                                        },
                                        'secure-text'
                                    );
                                });

                                if (!password) return;

                                // Cifrar el PIN con Blowfish
                                const encryptedPin = await encryptPin(pin, password);
                                
                                // Guardar en Firestore
                                await setDoc(doc(db, 'users', user.uid), { 
                                    encryptedPin,
                                    pinSetupDate: new Date().toISOString() 
                                }, { merge: true });
                                
                                setShowSetupText(false);
                                setIsFirstTimeSetup(false);
                                navigation.navigate('DashboardParentalControl');
                            } catch (error) {
                                console.error("Error al guardar PIN:", error);
                                showAlert("invalidPin");
                            }
                        }
                    }
                ]
            );
        } else if (storedEncryptedPin) {
            try {
                const password = await new Promise((resolve) => {
                    Alert.prompt(
                        "Verificar contraseña", 
                        "Ingresa tu contraseña para verificar el PIN:",
                        resolve,
                        'secure-text'
                    );
                });

                if (!password) return;

                // Descifrar el PIN con Blowfish
                const decryptedPin = await decryptPin(storedEncryptedPin, password);
                
                if (decryptedPin === pin) {
                    navigation.navigate('DashboardParentalControl');
                } else {
                    showAlert("invalidPin");
                }
            } catch (error) {
                console.error("Error al verificar PIN:", error);
                showAlert("invalidPin");
            }
        }
    };

    const handleForgotPin = () => {
        showAlert("forgotPin");
    };

    const handleWebAccess = () => {
        console.log("Abrir enlace web");
    };

    return (
        <SafeAreaView style={styles.container} onLayout={onLayoutRootView}>
            <StatusBar barStyle="dark-content" translucent={true} backgroundColor="transparent" />
            <View style={styles.header}>
                <View style={styles.containerButtonBack}>
                    <Pressable onPress={() => props.navigation.goBack()} style={styles.ButtonBack}>
                        <Ionicons name="chevron-back" size={35} color="#1B5B44" />
                    </Pressable>
                </View>
                <View style={styles.containerTextHeader}>
                    <Text style={styles.textHeader}>Control Parental</Text>
                </View>
            </View>
            
            <View style={styles.content}>
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    style={styles.scrollView}
                >
                    <View style={styles.pinContainer}>
                        <View style={styles.welcomeContainer}>
                            <Ionicons name="shield-checkmark" size={60} color="#40916C" />
                            <Text style={styles.welcomeText}>Bienvenido al Control Parental</Text>
                            {showSetupText && (
                                <Text style={styles.subtitleText}>
                                    Configura tu PIN por primera vez
                                </Text>
                            )}
                            {!showSetupText && (
                                <Text style={styles.subtitleText}>Ingresa tu PIN para acceder</Text>
                            )}
                        </View>
                        
                        <View style={styles.pinInputContainer}>
                            <TextInput
                                style={styles.pinInput}
                                value={pin}
                                onChangeText={setPin}
                                keyboardType="numeric"
                                maxLength={4}
                                secureTextEntry={true}
                                placeholder="••••"
                                onSubmitEditing={handlePinSubmit}
                            />
                            <Pressable style={styles.submitButton} onPress={handlePinSubmit}>
                                <Text style={styles.submitButtonText}>Acceder</Text>
                            </Pressable>
                        </View>
                        
                        <Pressable style={styles.forgotButton} onPress={handleForgotPin}>
                            <Text style={styles.forgotButtonText}>¿Olvidaste tu PIN?</Text>
                        </Pressable>
                    </View>

                    <View style={styles.separator}>
                        <View style={styles.separatorLine} />
                        <Text style={styles.separatorText}>O</Text>
                        <View style={styles.separatorLine} />
                    </View>

                    <View style={styles.webAccessContainer}>
                        <Text style={styles.webAccessTitle}>Acceso desde Web</Text>
                        <Text style={styles.webAccessSubtitle}>Escanea el código QR o usa el enlace directo</Text>
                        
                        <View style={styles.qrContainer}>
                            <View style={styles.qrPlaceholder}>
                                <Ionicons name="qr-code" size={80} color="#40916C" />
                                <Text style={styles.qrText}>Código QR</Text>
                            </View>
                        </View>
                        
                        <Pressable style={styles.webLinkButton} onPress={handleWebAccess}>
                            <Ionicons name="link" size={20} color="#40916C" />
                            <Text style={styles.webLinkText}>Abrir Enlace Web</Text>
                        </Pressable>
                    </View>
                </ScrollView>
            </View>
            
            <View style={styles.footer}>
                <View style={styles.circle}>
                    <Image source={require('../../assets/img/LogoFibonatix.png')} style={styles.image} />
                </View>
                <Text style={styles.textFooter}>Frognova</Text>
            </View>
            
            {alerts.visible && (
                <CustomAlert
                    showAlert={alerts.visible}
                    title={mostrarTituloAlerta(alerts.type)}
                    message={mostrarMensajeAlerta(alerts.type)}
                    onConfirm={handleConfirmAlert}
                    onCancel={alerts.type === "resetProgress" ? hideAlert : null}
                    confirmText={textoConfirmar(alerts.type)}
                    cancelText={textoCancelar(alerts.type)}
                    confirmButtonColor="#40916C"
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#D8F3DC',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#74C69D',
        height: Math.max(120, height * 0.12),
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
    },
    containerButtonBack: {
        left: 20,
    },
    ButtonBack: {
        backgroundColor: '#D8F3DC',
        borderRadius: 70,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerTextHeader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textHeader: {
        fontSize: Math.min(35, width * 0.08),
        color: 'white',
        fontFamily: 'Quicksand',
        textAlign: 'center',
    },
    content: {
        flex: 1,
        alignItems: 'center',
    },
    scrollView: {
        width: '100%',
        marginBottom: 50,
    },
    scrollContent: {
        padding: 20,
        alignItems: 'center',
        minHeight: height * 0.6,
    },
    pinContainer: {
        alignItems: 'center',
        width: '100%',
        marginBottom: 30,
    },
    welcomeContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    welcomeText: {
        fontSize: Math.min(24, width * 0.06),
        color: '#094F2C',
        fontFamily: 'Quicksand',
        textAlign: 'center',
        marginTop: 15,
        fontWeight: 'bold',
    },
    subtitleText: {
        fontSize: Math.min(16, width * 0.04),
        color: '#40916C',
        fontFamily: 'Quicksand',
        textAlign: 'center',
        marginTop: 5,
    },
    pinInputContainer: {
        alignItems: 'center',
        width: '100%',
    },
    pinInput: {
        width: Math.min(200, width * 0.5),
        height: 60,
        borderColor: '#74C69D',
        borderWidth: 2,
        borderRadius: 15,
        paddingHorizontal: 15,
        fontSize: 24,
        textAlign: 'center',
        backgroundColor: 'white',
        marginBottom: 20,
        letterSpacing: 10,
    },
    submitButton: {
        backgroundColor: '#40916C',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    submitButtonText: {
        color: 'white',
        fontSize: Math.min(18, width * 0.045),
        fontFamily: 'Quicksand',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    forgotButton: {
        marginTop: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    forgotButtonText: {
        color: '#40916C',
        fontSize: Math.min(16, width * 0.04),
        fontFamily: 'Quicksand',
        textDecorationLine: 'underline',
    },
    separator: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '80%',
        marginVertical: 30,
    },
    separatorLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#74C69D',
    },
    separatorText: {
        marginHorizontal: 20,
        fontSize: Math.min(16, width * 0.04),
        color: '#40916C',
        fontFamily: 'Quicksand',
    },
    webAccessContainer: {
        alignItems: 'center',
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    webAccessTitle: {
        fontSize: Math.min(22, width * 0.055),
        color: '#094F2C',
        fontFamily: 'Quicksand',
        textAlign: 'center',
        fontWeight: 'bold',
        marginBottom: 5,
    },
    webAccessSubtitle: {
        fontSize: Math.min(14, width * 0.035),
        color: '#40916C',
        fontFamily: 'Quicksand',
        textAlign: 'center',
        marginBottom: 20,
    },
    qrContainer: {
        alignItems: 'center',
        marginBottom: 25,
    },
    qrPlaceholder: {
        width: Math.min(150, width * 0.35),
        height: Math.min(150, width * 0.35),
        borderWidth: 2,
        borderColor: '#74C69D',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
    },
    qrText: {
        fontSize: Math.min(14, width * 0.035),
        color: '#40916C',
        fontFamily: 'Quicksand',
        marginTop: 5,
    },
    webLinkButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#D8F3DC',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#74C69D',
    },
    webLinkText: {
        color: '#40916C',
        fontSize: Math.min(16, width * 0.04),
        fontFamily: 'Quicksand',
        marginLeft: 8,
        fontWeight: 'bold',
    },
    footer: {
        height: Math.max(120, height * 0.12),
        backgroundColor: '#74C69D',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    circle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#D8F3DC',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: -50,
    },
    image: {
        width: 85,
        height: 85,
    },
    textFooter: {
        fontSize: Math.min(30, width * 0.07),
        color: 'white',
        fontFamily: 'Quicksand',
        marginTop: 10,
    },
});