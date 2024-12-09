import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { authStyles } from '../styles/authStyles';

export default function LoginScreen() {
    const navigation = useNavigation();

    return (
        <View style={authStyles.container}>
            <Text style={authStyles.title}>Bem-vindo</Text>
            <TextInput style={authStyles.input} placeholder="E-mail" keyboardType="email-address" />
            <TextInput style={authStyles.input} placeholder="Senha" secureTextEntry />
            <TouchableOpacity
                style={authStyles.button}
                onPress={() => navigation.navigate('Main')}
            >
                <Text style={authStyles.buttonText}>Entrar</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => navigation.navigate('Register')}
            >
                <Text style={authStyles.linkText}>Não tem uma conta? Cadastre-se</Text>
            </TouchableOpacity>
        </View>
    );
}
