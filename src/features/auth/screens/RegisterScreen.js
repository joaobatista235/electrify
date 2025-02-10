import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TextInput, Button, Text, Card, useTheme } from 'react-native-paper';
import LottieView from 'lottie-react-native';

export default function RegisterScreen() {
    const navigation = useNavigation();

    // Definindo um tema personalizado para as labels
    const inputTheme = {
        colors: {
            primary: '#FFC107', // Cor da borda e do ícone quando o input está ativo
            placeholder: '#FFC107', // Cor do placeholder
            text: '#FFC107', // Cor do texto digitado
            label: '#FFC107', // Cor da label
        },
    };

    return (
        <View style={styles.container}>
            {/* Ilustração no Topo */}
            <View style={styles.illustrationContainer}>
                <LottieView
                    source={require('../../../assets/animations/energy-animation.json')}
                    autoPlay
                    loop
                    style={styles.illustration}
                />
            </View>

            {/* Formulário de Cadastro */}
            <Card style={styles.card}>
                <Card.Content>
                    <Text style={styles.title} variant="headlineMedium">
                        Cadastre-se
                    </Text>

                    {/* Campo de Nome */}
                    <TextInput
                        label="Nome"
                        mode="outlined"
                        style={styles.input}
                        left={<TextInput.Icon icon="account" color="#FFC107" />}
                        theme={inputTheme} // Aplicando o tema personalizado
                    />

                    {/* Campo de E-mail */}
                    <TextInput
                        label="E-mail"
                        mode="outlined"
                        keyboardType="email-address"
                        style={styles.input}
                        left={<TextInput.Icon icon="email" color="#FFC107" />}
                        theme={inputTheme} // Aplicando o tema personalizado
                    />

                    {/* Campo de Senha */}
                    <TextInput
                        label="Senha"
                        mode="outlined"
                        secureTextEntry
                        style={styles.input}
                        left={<TextInput.Icon icon="lock" color="#FFC107" />}
                        theme={inputTheme} // Aplicando o tema personalizado
                    />

                    {/* Botão de Cadastro */}
                    <Button
                        mode="contained"
                        onPress={() => navigation.navigate('Login')}
                        style={styles.button}
                        icon="account-plus"
                        buttonColor="#FFC107" // Cor de fundo do botão
                        textColor="#FFFFFF" // Cor do texto do botão
                    >
                        Cadastrar
                    </Button>

                    {/* Link para Login */}
                    <Button
                        mode="text"
                        onPress={() => navigation.navigate('Login')}
                        style={styles.linkButton}
                        textColor="#FFC107" // Cor do texto do link
                    >
                        Já tem uma conta? Faça login
                    </Button>
                </Card.Content>
            </Card>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
    },
    illustrationContainer: {
        width: 200,
        height: 200,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    illustration: {
        width: '100%',
        height: '100%',
    },
    card: {
        width: '90%',
        maxWidth: 400,
        padding: 16,
        borderRadius: 8,
        backgroundColor: '#FFFFFF',
        elevation: 4,
    },
    title: {
        marginBottom: 24,
        textAlign: 'center',
        color: '#333333',
        fontSize: 24,
        fontWeight: 'bold',
    },
    input: {
        marginBottom: 16,
        backgroundColor: '#FFFFFF',
    },
    button: {
        marginTop: 8,
        paddingVertical: 8,
    },
    linkButton: {
        marginTop: 16,
    },
});