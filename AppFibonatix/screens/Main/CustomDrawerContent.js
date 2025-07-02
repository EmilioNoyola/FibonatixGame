//Componentes y Hooks de react native.
import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, StatusBar, Image } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';

// Librerías de Firebase y Firestore
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
import { doc, getDoc } from "firebase/firestore";

// Íconos
import Icon from 'react-native-vector-icons/MaterialIcons'; 
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Entypo from '@expo/vector-icons/Entypo';

import useCustomFonts from '../../assets/components/FontsConfigure';

import { DeviceEventEmitter } from 'react-native';

export default function CustomDrawer(props) {

    const { fontsLoaded, onLayoutRootView } = useCustomFonts();
    if (!fontsLoaded) return null;

    const auth = getAuth();
    const db = getFirestore();
    const user = auth.currentUser;

    const [username, setUsername] = useState(""); 
    const [profileImage, setProfileImage] = useState(null);

    // Obtener el nombre de usuario desde Firestore.
    const getUserData = async () => {
        if (user) {
            const userRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userRef);
            if (userDoc.exists()) {
                setUsername(userDoc.data().username);
                setProfileImage(userDoc.data().profileImage || null); 
            }
        }
    };

    // Llama a getUsername cuando el componente se monta o cuando el usuario cambia.
    useEffect(() => {
        if (user) {
            getUserData();
        }

        const updateProfileImageListener = DeviceEventEmitter.addListener("profileImageUpdated", (newImage) => {
            setProfileImage(newImage);
        });

        return () => {
            updateProfileImageListener.remove();
        };
    }, [user]);

    // Cerrar sesión.
    const handleSignOut = () => {
        signOut(auth)
            .then(() => {
                console.log("Sesión cerrada");
            })
            .catch((error) => console.log("Error al cerrar sesión:", error));
    };

    return (
        <>
            <StatusBar
                barStyle="dark-content"
                translucent={true}
                backgroundColor="transparent"
            />

            <View style={styles.container} onLayout={onLayoutRootView}>
                <View style={styles.headerContent}>
                    <View style={styles.header}></View>
                    <View style={styles.circle}>
                        {profileImage ? (
                            <Image source={{ uri: profileImage }} style={styles.profileImage} />
                        ) : (
                            <Icon name="account-circle" size={160} color="#706103" />
                        )}
                    </View>
                    <View>
                        { user ? (
                            <>
                                <Text style={styles.TextUser}>{username}</Text>
                                <Text style={styles.TextEmail}>{user.email}</Text>
                            </>
                        ) : (
                            <Text style={styles.TextEmail}>No hay usuario autenticado.</Text>
                        ) }
                    </View>
                </View>

                <DrawerContentScrollView
                    {...props}
                    contentContainerStyle={[styles.content]}
                >
                    <View>
                        <Pressable                             
                            style={({pressed}) => [
                                {
                                    backgroundColor: pressed ? '#FCEFA1' : 'transparent',
                                },
                                    styles.Button,
                            ]}
                            onPress={() => props.navigation.navigate('ParentalControl')}
                        >
                            <View style={styles.row}>
                                <FontAwesome6 name="shield-heart" size={40} color="#594d02" style={styles.icon} />
                                <Text style={styles.TextButton}>Control Parental</Text>
                            </View>
                        </Pressable>

                        <Pressable                             
                            style={({pressed}) => [
                                {
                                    backgroundColor: pressed ? '#FCEFA1' : 'transparent',
                                },
                                    styles.Button,
                            ]}
                            onPress={() => props.navigation.navigate('Settings')}
                        >
                            <View style={styles.row}>
                                <MaterialIcons name="settings" size={45} color="#594d02" style={styles.icon} />
                                <Text style={styles.TextButton}>Ajustes</Text>
                            </View>
                        </Pressable>

                        <Pressable                             
                            style={({pressed}) => [
                                {
                                    backgroundColor: pressed ? '#FCEFA1' : 'transparent',
                                },
                                    styles.Button,
                            ]}
                            onPress={() => props.navigation.navigate('SupportAndHelp')}
                        >
                            <View style={styles.row}>
                                <Entypo name="help-with-circle" size={40} color="#594d02" style={styles.icon} />
                                <Text style={styles.TextButton}>Ayuda y Soporte</Text>
                            </View>
                        </Pressable>
                    </View>

                    <View style={styles.containerLogoutButton}>
                        <Pressable 
                            style={({pressed}) => [
                                {
                                    backgroundColor: pressed ? '#C63C29' : '#D7513F',
                                },
                                    styles.logoutButton,
                            ]}
                            onPress={handleSignOut}
                        >
                            <Text style={styles.logoutText}>CERRAR SESIÓN</Text>
                        </Pressable>
                    </View>
                </DrawerContentScrollView>

                <View style={styles.footer}>
                    <View style={styles.circleLogo}>
                        <Image source={require('../../assets/img/LogoFibonatix.png')} style={styles.image} />
                    </View>
                    <Text style={styles.textFooter}>Frognova</Text>
                </View>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F5CB', 
    },
    headerContent: {
        backgroundColor: '#F4F5CB', 
        alignItems: 'center', 
    },
    header: {
        width: '100%',
        height: 140, 
        backgroundColor: '#F4ED5E',
            borderBottomLeftRadius: 15,
            borderBottomRightRadius: 15,
    },
    circle: {
        marginTop: -80, 
        width: 170,  
        height: 170, 
        borderRadius: 110, 
        backgroundColor: '#F4F5CB', 
        alignItems: 'center',
        justifyContent: 'center', 
    },
    profileImage: {
        width: 160,
        height: 160,
        borderRadius: 80, 
    },
    TextUser: {
        fontSize: 34,
        color: '#706103',
        fontFamily: 'Quicksand',
        textAlign: 'center',
    },
    TextEmail: {
        marginTop: 10,
        fontSize: 23,
        color: '#706103',
        textAlign: 'center',
        fontFamily: 'Quicksand_SemiBold',
    },
    content: {
        display: 'flex',
        paddingTop: 20,
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center'
    },
    Button: {
        margin: 5,
        padding: 10,
        borderRadius: 20,
    },
    row: {
        flexDirection: 'row', 
        alignItems: 'center', 
    },       
    icon: {
        marginRight: 10,
    },
    TextButton: {
        fontSize: 20,
        fontFamily: 'Quicksand',
        color: '#706103',
    },
    containerLogoutButton: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15,
    },
    logoutButton: {
        width: 260,
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
    logoutText: {
        color: 'white',
        fontFamily: 'Quicksand',
    },
    footer: {
        height: 120,
        backgroundColor: '#F4ED5E',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    circleLogo: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#F4F5CB',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: -40,
    },
    image: {
        width: 85,
        height: 85,
    },
    textFooter: {
        fontSize: 30,
        color: '#706103',
        fontFamily: 'Quicksand',
        marginTop: 20,
    },
});
