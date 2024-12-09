import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { authStyles } from '../styles/authStyles';

export default function RegisterScreen() {
    const navigation = useNavigation();

    return (
        <View style={authStyles.container}>
            <Text style={authStyles.title}>Crie sua Conta</Text>
            <TextInput style={authStyles.input} placeholder="Nome Completo" />
            <TextInput style={authStyles.input} placeholder="E-mail" keyboardType="email-address" />
            <TextInput style={authStyles.input} placeholder="Senha" secureTextEntry />
            <TextInput style={authStyles.input} placeholder="Confirme sua Senha" secureTextEntry />
            <TouchableOpacity style={authStyles.button}>
                <Text style={authStyles.buttonText}>Cadastrar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={authStyles.linkText}>Voltar para Login</Text>
            </TouchableOpacity>
        </View>
    );
}