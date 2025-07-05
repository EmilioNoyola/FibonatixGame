import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LevelScreen from './screens/LevelScreen';
import GameScreen from './screens/GameScreen';
import { useAppContext } from '../../../assets/context/AppContext';

const Stack = createStackNavigator();

export default function App() {
    const { clientId } = useAppContext();

    return (
        <Stack.Navigator initialRouteName="Level">
            <Stack.Screen
                name="Level"
                component={LevelScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="GameScreen"
                component={GameScreen}
                options={{ headerShown: false }}
                initialParams={{ clientId: clientId }} 
            />
        </Stack.Navigator>
    );
}