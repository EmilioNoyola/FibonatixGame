import "react-native-gesture-handler";
import { createStackNavigator } from '@react-navigation/stack';
import SeleccionDeNivel from "./screens/SeleccionDeNivel";
import JuegoMemorama from "./screens/JuegoMemorama"; // Importa el componente de juego

const Stack = createStackNavigator();

export default function App() {
    return (
        <Stack.Navigator initialRouteName="SeleccionDeNivel">
            <Stack.Screen 
                name="SeleccionDeNivel" 
                component={SeleccionDeNivel} 
                options={{ headerShown: false }}
            />
            <Stack.Screen 
                name="JuegoMemorama" 
                component={JuegoMemorama} 
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
}