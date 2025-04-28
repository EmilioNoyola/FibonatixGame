import React from 'react';
import { TextInput, View, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RegisterStyles } from '../../../styles/UserAuthenticationStyles/RegisterStyles';

const AuthInput = ({
    placeholder,
    value,
    onChangeText,
    secureTextEntry,
    onToggleSecureText,
    iconName,
    onIconPress,
    editable = true,
}) => {
    return (
        <View style={RegisterStyles.inputWrapper}>
            <TextInput
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={secureTextEntry}
                style={RegisterStyles.input}
                editable={editable}
            />
            {iconName && (
                <Pressable
                    style={RegisterStyles.eyeIconContainer}
                    onPress={onIconPress || (() => onToggleSecureText(!secureTextEntry))}
                >
                    <Icon
                        name={iconName}
                        size={24}
                        color="#0B5A39"
                    />
                </Pressable>
            )}
        </View>
    );
};

export default AuthInput;