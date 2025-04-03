import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Levels from './screens/Levels';
import GameLevel from './screens/GameLevel';

const Stack = createStackNavigator();

export default function App() {
  return (
    <Stack.Navigator initialRouteName="Levels">
      <Stack.Screen 
        name="Levels" 
        component={Levels} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="GameLevel" 
        component={GameLevel} 
        options={{ headerShown: false }} 
      />
    </Stack.Navigator>
  );
}