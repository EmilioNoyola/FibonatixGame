// RecoverPin.js
import React, { useState } from 'react';
import { View, Text, SafeAreaView, StatusBar, Pressable, StyleSheet, TextInput, Dimensions, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import useCustomFonts from '../../assets/components/FontsConfigure';
import Ionicons from '@expo/vector-icons/Ionicons';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../assets/services/Credentials';
import { decryptPin } from '../../assets/cifrado/CryptoUtils';
import { useAppContext } from '../../assets/context/AppContext';

const { width, height } = Dimensions.get('window');

export default function RecoverPin(props) {
    const { fontsLoaded, onLayoutRootView } = useCustomFonts();
    if (!fontsLoaded) return null;

    const navigation = useNavigation();
    const { user, clientId } = useAppContext();
    const [password, setPassword] = useState('');
    const [recoveredPin, setRecoveredPin] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleRecoverPin = async () => {
        if (!user || !clientId) {
            Alert.alert("Error", "Usuario no autenticado.");
            return;
        }

        setIsLoading(true);
        try {
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (!userDoc.exists()) {
                Alert.alert("Error", "No se encontró el perfil del usuario.");
                return;
            }

            const data = userDoc.data();
            const storedEncryptedPin = data.encryptedPin;
            if (!storedEncryptedPin) {
                Alert.alert("Error", "No hay un PIN almacenado para recuperar.");
                return;
            }

            const decryptedPin = await decryptPin(storedEncryptedPin, password);
            setRecoveredPin(decryptedPin);
            Alert.alert("Éxito", `Tu PIN recuperado es: ${decryptedPin}`);
        } catch (error) {
            console.error("Error al recuperar el PIN:", error);
            Alert.alert("Error", "Contraseña incorrecta o error al descifrar. Intenta de nuevo.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container} onLayout={onLayoutRootView}>
            <StatusBar barStyle="dark-content" translucent={true} backgroundColor="transparent" />
            <View style={styles.header}>
                <View style={styles.containerButtonBack}>
                    <Pressable onPress={() => navigation.goBack()} style={styles.ButtonBack}>
                        <Ionicons name="chevron-back" size={35} color="#1B5B44" />
                    </Pressable>
                </View>
                <View style={styles.containerTextHeader}>
                    <Text style={styles.textHeader}>Recuperar PIN</Text>
                </View>
            </View>
            
            <View style={styles.content}>
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    style={styles.scrollView}
                >
                    <View style={styles.pinContainer}>
                        <View style={styles.welcomeContainer}>
                            <Ionicons name="lock-closed" size={60} color="#40916C" />
                            <Text style={styles.welcomeText}>Recuperar tu PIN</Text>
                            <Text style={styles.subtitleText}>Ingresa tu contraseña para recuperar tu PIN</Text>
                        </View>
                        
                        <View style={styles.pinInputContainer}>
                            <TextInput
                                style={styles.pinInput}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={true}
                                placeholder="Contraseña"
                                onSubmitEditing={handleRecoverPin}
                            />
                            <Pressable style={styles.submitButton} onPress={handleRecoverPin} disabled={isLoading}>
                                <Text style={styles.submitButtonText}>Recuperar</Text>
                            </Pressable>
                        </View>
                        
                        {recoveredPin ? (
                            <Text style={styles.recoveredPinText}>Tu PIN es: {recoveredPin}</Text>
                        ) : null}
                    </View>
                </ScrollView>
            </View>
            
            <View style={styles.footer}>
                <View style={styles.circle}>
                    <Image source={require('../../assets/img/LogoFibonatix.png')} style={styles.image} />
                </View>
                <Text style={styles.textFooter}>Frognova</Text>
            </View>
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
    recoveredPinText: {
        fontSize: Math.min(20, width * 0.05),
        color: '#094F2C',
        fontFamily: 'Quicksand',
        textAlign: 'center',
        marginTop: 20,
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