// Componentes utilizados de react native.
import { Text, View, SafeAreaView, StatusBar, Pressable, Image} from 'react-native';

// Estilos de esta pantalla.
import { InicioStyles } from "../../styles/InicioStyles";

// Fuentes Personalizadas.
import useCustomFonts from '../../assets/apis/FontsConfigure';

export default function Inicio(props) {

    const image = require('../../assets/img/tortuga.png');

    // Si las fuentes no están cargadas, se retorna null
    const { fontsLoaded, onLayoutRootView } = useCustomFonts();
    if (!fontsLoaded) return null;

    return (

        <SafeAreaView style= {InicioStyles.main} onLayout={onLayoutRootView}>

            <StatusBar
                barStyle="light-content"
                translucent={true}
                backgroundColor="transparent"
            />

            <View style={InicioStyles.container}>

                <View style={InicioStyles.principal} >

                    <Text style={InicioStyles.principalText1}>¡Hola, Amiguito! Estoy aquí para aprender y jugar contigo. </Text>
                
                    <Image source={image} style={{width: 332, height: 293, zIndex: 10}}/>

                    <Text style={InicioStyles.principalText2}>¿Listo para comenzar nuestra aventura?</Text>

                </View>

                <View>

                    <Pressable 
                    
                        style={({pressed}) => [
                            {
                                backgroundColor: pressed ? '#0d6742' : '#0B5A39',
                            },
                            InicioStyles.buttonContainer,
                        ]} 
                    
                        onPress={() => props.navigation.navigate('Login')}
                        
                    >

                        <Text style={InicioStyles.buttonText}>Comenzar</Text>

                    </Pressable>

                    <Text style={{textAlign: 'center', paddingTop: 20, color: '#0B5A39', fontFamily: 'Quicksand_Medium', zIndex: 10}}>Todos los Derechos Reservados ©Fibonatix Inc.</Text>

                </View>

                <View style={InicioStyles.footer}>

                </View>

            </View>

        </SafeAreaView>

    );
}