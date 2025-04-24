import React from 'react'; 
import { Text, TextInput, TouchableOpacity, View, ImageBackground, SafeAreaView, StatusBar, Pressable, ScrollView} from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { recoverPasswordStyles } from "../../styles/UserAuthenticationStyles/recoverPasswordStyles";

import useCustomFonts from '../../assets/components/FontsConfigure';

export default function RecoverPassword(props) {

    const { fontsLoaded, onLayoutRootView } = useCustomFonts();

    // Si las fuentes no están cargadas, se retorna null
    if (!fontsLoaded) return null;

    return (

        <SafeAreaView style= {recoverPasswordStyles.main} onLayout={onLayoutRootView}>

            <StatusBar
                barStyle="light-content"
                translucent={true}
                backgroundColor="transparent"
            />

            <View style={recoverPasswordStyles.container}>

            <ImageBackground source={require('../../assets/img/tortugas_background.jpg')} style={recoverPasswordStyles.backgroundImage} />

                <View style={recoverPasswordStyles.header}>
                    <Text style={recoverPasswordStyles.headerText}>RECUPERAR CONTRASEÑA</Text>
                </View>

                <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled">

                    <View style={recoverPasswordStyles.inputContainer}>

                        <TextInput
                        placeholder="Email"
                        style={recoverPasswordStyles.input}
                        />
                        
                        <Pressable 
                                
                                style={({pressed}) => [
                                    {
                                        backgroundColor: pressed ? '#0e5c07f1' : '#0C5206',
                                    },
                                    recoverPasswordStyles.button,
                                ]}
                            
                        >

                            <Text style={recoverPasswordStyles.buttonText}>ENVIAR</Text>
                            
                        </Pressable>

                    </View>

                </ScrollView>

                <View style={recoverPasswordStyles.footer}>

                    <View style={recoverPasswordStyles.buttonContainer}>

                        <TextInput keyboardType='number-pad' placeholder='Código de Verificación' style={recoverPasswordStyles.InputButton} />

                        <TouchableOpacity 
                            style={recoverPasswordStyles.eyeIconContainer} 
                            onPress={() => props.navigation.navigate('ChangePassword')}
                        >

                            <FontAwesome5 name="arrow-circle-right" size={45} color="#014756" />

                        </TouchableOpacity>

                    </View>
                    
                    <Text style={recoverPasswordStyles.footerText}></Text>

                </View>

            </View>

        </SafeAreaView>

    );
}