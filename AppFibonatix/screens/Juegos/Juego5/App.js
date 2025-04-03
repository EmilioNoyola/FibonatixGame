import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Levels from './screens/Levels';
import LevelScreen from './screens/LevelScreen';

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
          name="LevelScreen" 
          component={LevelScreen} 
          options={{ headerShown: false }} 
        />
      </Stack.Navigator>
  );
}