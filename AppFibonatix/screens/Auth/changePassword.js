import React from 'react';  
import { useState } from 'react';
import { Text, TextInput, View, ImageBackground, SafeAreaView, StatusBar, Pressable, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; 
import { changePasswordStyles } from "../../styles/UserAuthenticationStyles/changePasswordStyles";

import useCustomFonts from '../../assets/components/FontsConfigure';

export default function ChangePassword(props) {

    const [secureTextEntry, setSecureTextEntry] = useState(true);

    const { fontsLoaded, onLayoutRootView } = useCustomFonts();

    // Si las fuentes no están cargadas, se retorna null
    if (!fontsLoaded) return null;

    return (

        <SafeAreaView style= {changePasswordStyles.main} onLayout={onLayoutRootView}>

            <StatusBar
                barStyle="light-content"
                translucent={true}
                backgroundColor="transparent"
            />

            <View style={changePasswordStyles.container}>

                <ImageBackground source={require('../../assets/img/tortugas_background.jpg')} style={changePasswordStyles.backgroundImage} />

                <View style={changePasswordStyles.header}>

                    <Text style={changePasswordStyles.headerText}>CAMBIAR CONTRASEÑA</Text> 

                </View>

                <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled">

                    <View style={changePasswordStyles.inputContainer}>

                        <View style={{ position: 'relative'}}>

                            <TextInput
                                placeholder="Contraseña Nueva"
                                secureTextEntry={secureTextEntry}  
                                style={changePasswordStyles.input}
                            />

                            <Pressable 
                                style={changePasswordStyles.eyeIconContainer1} 
                                onPress={() => setSecureTextEntry(!secureTextEntry)}
                            >
                            
                                <Icon
                                    name={secureTextEntry ? "eye" : "eye-off"}
                                    size={38}
                                    color="#0B5A39"
                                    style={changePasswordStyles.eyeIconBelow1}
                                />

                            </Pressable>

                        </View>

                        <View style={{ position: 'relative', paddingTop: 35 }}>

                            <TextInput
                                placeholder="Confirmar Contraseña"
                                secureTextEntry={secureTextEntry}  
                                style={changePasswordStyles.input}
                            />

                            <Pressable 
                                style={changePasswordStyles.eyeIconContainer2} 
                                onPress={() => setSecureTextEntry(!secureTextEntry)}
                            >

                                <Icon
                                    name={secureTextEntry ? "eye" : "eye-off"}
                                    size={38}
                                    color="#0B5A39"
                                    style={changePasswordStyles.eyeIconBelow2}
                                />

                            </Pressable>

                        </View>

                    </View>

                </ScrollView>

                <View style={changePasswordStyles.footer}>

                    <View style={changePasswordStyles.buttonContainer}>

                        <Pressable 
                            
                            style={({pressed}) => [
                                {
                                    backgroundColor: pressed ? '#1f8a83' : '#239790',
                                },
                                changePasswordStyles.button,
                            ]}
                            onPress={() => props.navigation.navigate('Login')}
                            
                        >

                            <Text style={changePasswordStyles.buttonText}>RESTABLECER</Text>

                        </Pressable>

                    </View>

                        <Text style={changePasswordStyles.footerText}></Text>

                </View>

            </View>

        </SafeAreaView>

    );
}