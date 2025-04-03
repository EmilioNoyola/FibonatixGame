import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LevelScreen from './screens/LevelScreen';
import GameScreen from './screens/GameScreen';

const Stack = createStackNavigator();

export default function App() {
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
            />
        </Stack.Navigator>
    );
}