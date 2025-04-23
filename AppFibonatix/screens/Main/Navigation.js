// Hooks de React que utilizamos.
import React, { useEffect, useReducer, useRef, useState } from 'react'
import { Pressable, StyleSheet, View, Text, LayoutChangeEvent } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

// svg
import Svg, { Path } from 'react-native-svg'

// Reanimated
import Animated, { useAnimatedStyle, withTiming, useDerivedValue } from 'react-native-reanimated'

// Lottie
import Lottie from 'lottie-react-native'

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
import Login from "../Auth/Login";
import Register from "../Auth/Register";
import RecoverPassword from "../Auth/recoverPassword";
import ChangePassword from "../Auth/changePassword";

// Pantallas de Menú
import HomeScreen from "../Menu/HomeScreen";
import FoodRoomScreen from "../Menu/FoodRoomScreen";
import BedroomScreen from "../Menu/BedroomScreen";

// Barra lateral
import CustomDrawerContent from './CustomDrawerContent';

// Pantalla de Carga
import LoadingScreen from "../../assets/apis/LoadingScreen"; 

// Foco de Sueño
import { FocusProvider } from '../../assets/apis/FocusContext'
import { useFocus } from '../../assets/apis/FocusContext'

import { useAppContext } from '../../assets/db/AppContext';

import MemoramaMatematico from '../Juegos/MemoramaMatematico/App';
import MultipliTortuga from '../Juegos/MultipliTortuga/App';
import DibujiTortuga from '../Juegos/Juego3/App';
import Juego4 from '../Juegos/Juego4/App';
import Juego5 from '../Juegos/Juego5/App';
import Juego6 from '../Juegos/Juego6/App';
import Juego7 from '../Juegos/Juego7/App';
import Juego8 from '../Juegos/Juego8/App';

import AsyncStorage from '@react-native-async-storage/async-storage'; 
import Settings from '../Options/Settings';
import ParentalControl from '../Options/ParentalControl';
import SupportAndHelp from '../Options/SupportAndHelp';

const AnimatedSvg = Animated.createAnimatedComponent(Svg);
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// Animaciones de la Barra de Navegación.
const AnimatedTabBar = ({ state: { index: activeIndex, routes }, navigation, descriptors }) => {

    const { bottom } = useSafeAreaInsets();
    const [layout, dispatch] = useReducer((state, action) => {
        const newState = [...state];
        newState[action.index] = { x: action.x, index: action.index };
        return newState;
    }, []);        
    
    const handleLayout = (event, index) => {
        dispatch({ x: event.nativeEvent.layout.x, index });
    };

    const xOffset = useDerivedValue(() => {
        if (layout.length !== routes.length) return 0;
        return layout.find(({ index }) => index === activeIndex)?.x - 25 || 0;
    }, [activeIndex, layout]);

    const animatedStyles = useAnimatedStyle(() => ({
        transform: [{ translateX: withTiming(xOffset.value, { duration: 250 }) }],
    }));

    const tabColors = {
        HomeScreen: "#CBEFD5",
        FoodRoomScreen: "#EBD2B2",
        BedroomScreen: "#7cc7fd", 
    };

    const tabBarColors = {
        HomeScreen: "#4EC160", 
        FoodRoomScreen: "#FFA851",
        BedroomScreen: "#478CDB",
    };        
    
    const activeRouteName = routes[activeIndex]?.name || "HomeScreen"; 
    const activeFillColor = tabColors[activeRouteName] || "#CBEFD5"; 
    const activeTabBarColor = tabBarColors[activeRouteName] || "#4EC160"; 

    return (
        <View style={[styles.tabBar, { backgroundColor: activeTabBarColor, paddingBottom: bottom }]}> 
            <AnimatedSvg
                width={110}
                height={60}
                viewBox="0 0 110 60"
                style={[styles.activeBackground, animatedStyles]}
            >
                <Path fill={activeFillColor} d="M20 0H0c11.046 0 20 8.953 20 20v5c0 19.33 15.67 35 35 35s35-15.67 35-35v-5c0-11.046 8.954-20 20-20H20" />
            </AnimatedSvg>
            <View style={styles.tabBarContainer}>
                {routes.map((route, index) => {
                    const active = index === activeIndex;
                    const { options } = descriptors[route.key];
                    return (
                        <TabBarComponent
                            key={route.key}
                            active={active}  
                            options={options}
                            onLayout={(e) => handleLayout(e, index)}
                            onPress={() => navigation.navigate(route.name)}
                        />
                    );
                })}
            </View>
        </View>
    );
};

// Animaciones de los íconos de la barra de navegación.
const TabBarComponent = ({ active = false, options, onLayout, onPress }) => { 
    const ref = useRef(null);

    useEffect(() => {
        if (active) {
            ref.current?.play();
        } else {
            ref.current?.reset();
        }
    }, [active]);        
    
    const animatedComponentCircleStyles = useAnimatedStyle(() => {
        return {
            transform: [{ scale: withTiming(active ? 1 : 0.01, { duration: 250 }) }]
        };
    }, [active]);

    const animatedIconContainerStyles = useAnimatedStyle(() => {
        return {
            opacity: withTiming(active ? 1 : 0.5, { duration: 250 }),
            marginTop: withTiming(active ? 0 : 15, { duration: 250 }),

        };
    });

    const { isFocusOn } = useFocus(); // Obtén el estado global

    const handlePress = () => {
        if (!isFocusOn) return; // Bloquea navegación si está en FocusOff
        onPress();
    };
    
    return (
        <Pressable onPress={handlePress} onLayout={onLayout} style={styles.component}>
            <Animated.View 
                style={[styles.componentCircle, animatedComponentCircleStyles]} 
            />
            <Animated.View style={[styles.iconContainer, animatedIconContainerStyles]}> 
                {options.tabBarIcon ? options.tabBarIcon({ ref, focused: active }) : <Text>?</Text>} 
            </Animated.View>
        </Pressable>
    );
};        

// Estilos de la barra y de los íconos.
const styles = StyleSheet.create({
    tabBar: { backgroundColor: '#4EC160', height: 70 },
    activeBackground: { position: 'absolute' },
    tabBarContainer: { flexDirection: 'row', justifyContent: 'space-evenly' },
    component: { height: 60, width: 60, marginTop: -5 },
    componentCircle: { flex: 1, borderRadius: 30, backgroundColor: 'white' },
    iconContainer: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' },
    icon: { height: 36, width: 36 },
});

// Definimos el componente que representa la barra de navegación.
function MyTabs() {
    return (
        <Tab.Navigator 
            tabBar={props => <AnimatedTabBar {...props} />}
            screenOptions={{ headerShown: false }}
        >
            <Tab.Screen 
                name="HomeScreen" 
                component={HomeScreen}   
                options={{ 
                    tabBarIcon: ({ ref }) => (
                        <Lottie 
                            ref={ref} 
                            source={require('../../assets/lottie/House2.json')} 
                            loop={false} 
                            style={styles.icon} 
                        />
                    ),                    
                }}       
            />
            <Tab.Screen  
                name="FoodRoomScreen" 
                component={FoodRoomScreen}
                options={{ 
                    tabBarIcon: ({ ref }) => (
                        <Lottie 
                            ref={ref} 
                            source={require('../../assets/lottie/House2.json')} 
                            loop={false} 
                            style={styles.icon} 
                        />
                    ),                    
                }}
            />
            <Tab.Screen 
                name="BedroomScreen" 
                component={BedroomScreen}
                options={{ 
                    tabBarIcon: ({ ref }) => (
                        <Lottie 
                            ref={ref} 
                            source={require('../../assets/lottie/House2.json')} 
                            loop={false} 
                            style={styles.icon} 
                        />
                    ),                    
                }}
            />
        </Tab.Navigator>
    );
}

// Definimos el componente que representa 
function MyDrawer() {
    return (
        <Drawer.Navigator
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            initialRouteName="MainTab"
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

// Separate the main app stack
const AuthStack = () => (
    <Stack.Navigator
        screenOptions={{ headerShown: false }}
    >
        <Stack.Screen name="Inicio" component={Inicio} />
        <Stack.Screen name="Login" component={Login} options={{ cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter }} />
        <Stack.Screen name="Register" component={Register} options={{ cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter }} />
        <Stack.Screen name="RecoverPassword" component={RecoverPassword} options={{ cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter }} />
        <Stack.Screen name="ChangePassword" component={ChangePassword} options={{ cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter }} />
    </Stack.Navigator>
);

// Separate the main app stack
const AppStack = () => (
    <Stack.Navigator
        screenOptions={{
            headerShown: false,
            cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
        }}
    >
        <Stack.Screen name="Menu" component={MyDrawer} />
        <Stack.Screen name="MemoramaMatematico" component={MemoramaMatematico} />
        <Stack.Screen name="MultipliTortuga" component={MultipliTortuga} />
        <Stack.Screen name="DibujiTortuga" component={DibujiTortuga} />
        <Stack.Screen name='Juego4' component={Juego4} />
        <Stack.Screen name='Juego5' component={Juego5} />
        <Stack.Screen name='Juego6' component={Juego6} />
        <Stack.Screen name='Juego7' component={Juego7} />
        <Stack.Screen name='Juego8' component={Juego8} />
    </Stack.Navigator>
);

// Función para exportar la navegación como componente.
export default function Navigation() {
    const { user, loading: isLoading } = useAppContext();

    if (isLoading) {
        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <LoadingScreen textoAdicional={''} />
            </View>
        );
    }

    return (
        <FocusProvider>
            <NavigationContainer
                fallback={<LoadingScreen textoAdicional={''} />}
            >
                {user ? <AppStack /> : <AuthStack />}
            </NavigationContainer>
        </FocusProvider>
    );
}
