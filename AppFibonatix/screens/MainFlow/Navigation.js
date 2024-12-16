// Hooks de React que utilizamos.
import React, { useEffect, useState } from 'react';

// Funciones proporcionadas por Firebase.
import { getAuth, onAuthStateChanged } from "firebase/auth";

// Librerías de React Navigation.
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from '@react-navigation/drawer';
import { CardStyleInterpolators } from '@react-navigation/stack'; // Librería para transiciones.

// Pantallas de Autenticación de Usuario.
import Inicio from "./Inicio";
import Login from "../UserAuthentication/Login";
import Register from "../UserAuthentication/Register";
import RecoverPassword from "../UserAuthentication/recoverPassword";
import ChangePassword from "../UserAuthentication/changePassword";

// Pantallas de Menú
import HomeScreen from "../Menu/HomeScreen";
import FoodRoomScreen from "../Menu/FoodRoomScreen";
import BedroomScreen from "../Menu/BedroomScreen";

// Barra lateral
import CustomDrawerContent from './CustomDrawerContent';

// Pantalla de Carga
import LoadingScreen from "../../apis/LoadingScreen"; 

// Íconos de barra de navegación.
import { Joystick, JoystickAzul, JoystickNaranja, LunaAzul, LunaNaranja, LunaVerde, UtenciliosAzules, UtenciliosNaranjas, UtenciliosVerdes } from '../../assets/img-svg';
import TortugaMatematica from '../Juegos/TortugaMatematica';

import JuegoMemorama from "../Juegos/MemoramaMatematico/screens/JuegoMemorama";
import SeleccionDeNivel from "../Juegos/MemoramaMatematico/screens/SeleccionDeNivel";

import LevelScreen from '../Juegos/MultipliTortuga/screens/LevelScreen';
import GameScreen from '../Juegos/MultipliTortuga/screens/GameScreen';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import Settings from '../options/Settings';
import ParentalControl from '../options/ParentalControl';
import SupportAndHelp from '../options/SupportAndHelp';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// Definimos el componente que representa la barra de navegación.
export function MyTabs() {
    return (
        <Tab.Navigator 
            initialRouteName="HomeScreen"
            screenOptions={({ route }) => {
                // Definimos el color de fondo según la pestaña
                const backgroundColor =
                    route.name === 'FoodRoomScreen' ? '#FFA851' :
                    route.name === 'MainHome' ? '#4EC160' :
                    route.name === 'BedroomScreen' ? '#478CDB' : '#4EC160';

                return {
                    headerShown: false,
                    tabBarShowLabel: false,
                    tabBarStyle: {
                        backgroundColor: backgroundColor, // Aplicamos el color dinámico
                        position: 'absolute',
                        height: 77,
                        marginBottom: 10,
                        marginHorizontal: 10,
                        alignSelf: 'center',
                        borderTopWidth: 0,
                        borderRadius: 15,
                        shadowColor: '#000',
                        shadowOpacity: 0.1,
                        shadowRadius: 10,
                        elevation: 5,
                    },
                    // Estilo de cada item para controlar la separación entre pestañas
                    tabBarItemStyle: {
                        marginHorizontal: 23, // Controla el espacio entre cada ícono
                    },
                };
            }}  
        >
            <Tab.Screen 
                name="FoodRoomScreen" 
                component={FoodRoomScreen}
                options={({ navigation }) => ({
                    tabBarIcon: ({ focused }) => {
                        // Si está enfocado en su propia pantalla
                        if (focused) {
                            return <UtenciliosNaranjas />;
                        }
                        // Aquí verificamos las otras rutas
                        const currentRoute = navigation.getState().routes[navigation.getState().index].name;
                        if (currentRoute === 'MainHome') {
                            return <UtenciliosVerdes style={{margin: 30}} />; // Icono para cuando estamos en MainHome
                        }
                        if (currentRoute === 'BedroomScreen') {
                            return <UtenciliosAzules />; // Icono para cuando estamos en BedroomScreen
                        }
                        return <UtenciliosVerdes />; // Retornar un ícono por defecto o el más relevante.
                    },
                })}  
            />
            <Tab.Screen 
                name="HomeScreen" 
                component={HomeScreen}
                options={({ navigation }) => ({
                    tabBarIcon: ({ focused }) => {
                        // Si está enfocado en su propia pantalla
                        if (focused) {
                            return <Joystick />;
                        }
                        // Verificamos la ruta actual
                        const currentRoute = navigation.getState().routes[navigation.getState().index].name;
                        if (currentRoute === 'FoodRoomScreen') {
                            return <JoystickNaranja />; // Icono para cuando estamos en FoodRoomScreen
                        }
                        if (currentRoute === 'BedroomScreen') {
                            return <JoystickAzul />; // Icono para cuando estamos en BedroomScreen
                        }
                        return <Joystick />; // Retornar un ícono por defecto
                    },
                })}  
            />
            <Tab.Screen 
                name="BedroomScreen" 
                component={BedroomScreen}
                options={({ navigation }) => ({
                    tabBarIcon: ({ focused }) => {
                        // Si está enfocado en su propia pantalla
                        if (focused) {
                            return <LunaAzul />;
                        }
                        // Verificamos la ruta actual
                        const currentRoute = navigation.getState().routes[navigation.getState().index].name;
                        if (currentRoute === 'FoodRoomScreen') {
                            return <LunaNaranja />; // Icono para cuando estamos en FoodRoomScreen
                        }
                        if (currentRoute === 'MainHome') {
                            return <LunaVerde />; // Icono para cuando estamos en MainHome
                        }
                        return <LunaVerde />; // Retornar un ícono por defecto
                    },
                })}  
            />
        </Tab.Navigator>
    );
}

// Definimos el componente que representa 
function MyDrawer() {
    return (
        <Drawer.Navigator
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{
                headerShown: false,
            }}
        >
            <Drawer.Screen name="MainTab" component={MyTabs} />
            <Drawer.Screen name="Settings" component={Settings} />
            <Drawer.Screen name="ParentalControl" component={ParentalControl} />
            <Drawer.Screen name="SupportAndHelp" component={SupportAndHelp} />
        </Drawer.Navigator>
    );
}

const MemoStack = createStackNavigator();

function MemoramaStack() {
    return (
        <MemoStack.Navigator 
            initialRouteName="SeleccionDeNivel"
            screenOptions={{
                headerShown: false,
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            }}
        >
            <MemoStack.Screen name="SeleccionDeNivel" component={SeleccionDeNivel} options={{ headerShown: false }}/>
            <MemoStack.Screen name="JuegoMemorama" component={JuegoMemorama} options={{ headerShown: false }}/>
        </MemoStack.Navigator>
    );
}

const MultiStack = createStackNavigator();

const MultiStackScreen = () => {
    const [unlockedLevels, setUnlockedLevels] = useState([1]); // Nivel 1 siempre desbloqueado

    useEffect(() => {
        const loadUnlockedLevels = async () => {
            try {
                const levels = await AsyncStorage.getItem('unlockedLevels');
                if (levels) {
                    const parsedLevels = JSON.parse(levels);
                    if (Array.isArray(parsedLevels) && parsedLevels.every(level => typeof level === 'number')) {
                        setUnlockedLevels(parsedLevels); // Solo actualiza si los datos son válidos
                    } else {
                        console.warn('Datos corruptos en AsyncStorage, restableciendo niveles.');
                        setUnlockedLevels([1]); // Restablece al estado inicial si los datos no son válidos
                    }
                } else {
                    console.log('No se encontraron datos de niveles, usando valores predeterminados.');
                }
            } catch (error) {
                console.error('Error al cargar niveles desbloqueados:', error);
                setUnlockedLevels([1]); // Restablece al estado inicial en caso de error
            }
        };

        loadUnlockedLevels();
    }, []);

    const saveUnlockedLevels = async (levels) => {
        try {
            await AsyncStorage.setItem('unlockedLevels', JSON.stringify(levels));
        } catch (error) {
            console.error('Error al guardar niveles desbloqueados:', error);
        }
    };

    return (
        <MultiStack.Navigator 
            initialRouteName="Level"
            screenOptions={{
                headerShown: false,
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            }}
        >
            <MultiStack.Screen name="Level" >
                {props => (
                    <LevelScreen
                        {...props}
                        unlockedLevels={unlockedLevels}
                        setUnlockedLevels={(levels) => {
                            setUnlockedLevels(levels);
                            saveUnlockedLevels(levels); 
                        }}
                    />
                )}
            </MultiStack.Screen>
            <MultiStack.Screen name="GameScreen" >
                {props => (
                    <GameScreen
                        {...props}
                        unlockedLevels={unlockedLevels}
                        setUnlockedLevels={(levels) => {
                            setUnlockedLevels(levels);
                            saveUnlockedLevels(levels); 
                        }}
                    />
                )}
            </MultiStack.Screen>
        </MultiStack.Navigator>
    );
};

// Definir el Stack principal de autenticación del usuario.
function MyStack({ user, loading }) {
    return (
        <Stack.Navigator
            initialRouteName='Inicio'
            screenOptions={{
                headerShown: false,
                cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
            }}
        >
            {loading ? (  
                <Stack.Screen name="Loading" component={LoadingScreen} />
            ) : user ? (
                <>
                
                    <Stack.Screen name="Menu" component={MyDrawer} />
                    <Stack.Screen name="TortugaMatematica" component={TortugaMatematica} />
                    <Stack.Screen name="MemoramaMatematico" component={MemoramaStack} />
                    <Stack.Screen name="MultipliTortuga" component={MultiStackScreen} />

                </>

            ) : (
                <>
                    <Stack.Screen name="Inicio" component={Inicio} />
                    <Stack.Screen name="Login" component={Login} />
                    <Stack.Screen name="Register" component={Register} />
                    <Stack.Screen name="RecoverPassword" component={RecoverPassword} />
                    <Stack.Screen name="ChangePassword" component={ChangePassword} />
                </>
            )}
        </Stack.Navigator>
    );
}

// Función para exportar la navegación como componente.
export default function Navigation() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);  
    const auth = getAuth();

    // Utilizamos esta función para verificar si el usuario inicio sesión.
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);  
            setLoading(false);  
        });

        return () => unsubscribe();
    }, [auth]);

    return (
        <NavigationContainer>
            <MyStack user={user} loading={loading} /> 
        </NavigationContainer>
    );
}
