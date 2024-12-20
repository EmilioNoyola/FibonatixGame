//Componentes y Hooks de react native.
import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, StatusBar, Image } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';

// Librerías de Firebase y Firestore
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
import { doc, getDoc } from "firebase/firestore";

// Íconos
import Icon from 'react-native-vector-icons/MaterialIcons'; // Importamos los íconos de MaterialIcons
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Entypo from '@expo/vector-icons/Entypo';

// Fuentes personalizadas
import useCustomFonts from '../../apis/FontsConfigure';

export default function CustomDrawerContent(props) {

    // Si las fuentes no están cargadas, se retorna null
    const { fontsLoaded, onLayoutRootView } = useCustomFonts();
    if (!fontsLoaded) return null;

    const [headerHeight, setHeaderHeight] = useState(0);
    const auth = getAuth();
    const db = getFirestore();

    const [username, setUsername] = useState(""); // Estado para el nombre de usuario
    const user = auth.currentUser;

    // Función para obtener el nombre de usuario desde Firestore
    const getUsername = async () => {
        if (user) {
            const userRef = doc(db, "users", user.uid); // Accede al documento del usuario
            const userDoc = await getDoc(userRef); // Obtén el documento
            if (userDoc.exists()) {
                setUsername(userDoc.data().username); // Establece el nombre de usuario
            } else {
                console.log("No hay datos para este usuario");
            }
        }
    };

    // Llama a getUsername cuando el componente se monta o cuando el usuario cambia
    useEffect(() => {
        if (user) {
            getUsername();
        }
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
        < >
            <StatusBar
                barStyle="dark-content"
                translucent={true}
                backgroundColor="transparent"
            />

            <View style={styles.container} onLayout={onLayoutRootView}>

                <View style={styles.headerContent}>
                    <View style={styles.header}></View>
                    <View style={styles.circle}>
                        <Icon name="account-circle" size={160} color="#706103" />
                    </View>
                    <View>
                        {user ? (
                            <>
                                <Text style={styles.TextUser}>{username}</Text>
                                <Text style={styles.TextEmail}>{user.email}</Text>
                            </>
                        ) : (
                            <Text style={styles.TextEmail}>No hay usuario autenticado.</Text>
                        )}
                    </View>
                </View>

                <DrawerContentScrollView
                    {...props}
                    contentContainerStyle={[styles.content]}
                >

                    <View style={styles.containerButton}>

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
                        <Image source={require('../../assets/LogoFibonatix.png')} style={styles.image} />
                    </View>
                    <Text style={styles.textFooter}>Fibonatix</Text>
                </View>

            </View>
        </>
    );
}


const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#F4F5CB', // Color de fondo del contenedor
    },

    headerContent: {
        backgroundColor: '#F4F5CB', // Color de fondo para no generar espaciado inesperado
        alignItems: 'center', // Centrado de los elementos dentro del headerContent
    },

    header: {
        width: '100%',
        height: 140, // Fijamos la altura del header
        backgroundColor: '#F4ED5E',
            borderBottomLeftRadius: 15,
            borderBottomRightRadius: 15,
    },

    circle: {
        marginTop: -80, // Desplazamos el círculo hacia arriba para que quede entre el header y el fondo
        width: 170,  // Aumentamos el tamaño del círculo
        height: 170, // Aumentamos el tamaño del círculo
        borderRadius: 110, // Hacemos que el View sea un círculo
        backgroundColor: '#F4F5CB', // Fondo blanco
        alignItems: 'center',
        justifyContent: 'center', // Centra el ícono dentro del círculo
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
        flexDirection: 'row', // Alinear elementos en fila
        alignItems: 'center', // Centrar verticalmente
    },
        
    icon: {
        marginRight: 10, // Espacio entre ícono y texto
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
