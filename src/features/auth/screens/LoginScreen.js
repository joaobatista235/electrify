import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TextInput, Button, Text, Card } from 'react-native-paper';
import LottieView from 'lottie-react-native';

export default function LoginScreen() {
    const navigation = useNavigation();

    // Definindo um tema personalizado para as labels
    const inputTheme = {
        colors: {
            primary: '#FFA500', // Cor da borda e do ícone quando o input está ativo
            placeholder: '#999999', // Cor do placeholder
            text: '#333333', // Cor do texto digitado
            label: '#333333', // Cor da label
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

            {/* Formulário de Login */}
            <Card style={styles.card}>
                <Card.Content>
                    <Text style={styles.title} variant="headlineMedium">
                        Login
                    </Text>

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

                    {/* Botão de Login */}
                    <Button
                        mode="contained"
                        onPress={() => navigation.navigate('Main')}
                        style={styles.button}
                        icon="login"
                        buttonColor="#FFC107" // Cor de fundo do botão
                        textColor="#FFFFFF" // Cor do texto do botão
                    >
                        Entrar
                    </Button>

                    {/* Divisor */}
                    <View style={styles.dividerContainer}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>ou</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    {/* Botão de Login com Google */}
                    <Button
                        mode="outlined"
                        onPress={() => console.log('Login com Google')}
                        style={styles.googleButton}
                        icon={() => (
                            <Image
                                source={require('../../../assets/icons/google.png')} // Ícone do Google
                                style={styles.googleIcon}
                            />
                        )}
                        textColor="#333333" // Cor do texto
                    >
                        Entrar com Google
                    </Button>

                    {/* Link para Cadastro */}
                    <Button
                        mode="text"
                        onPress={() => navigation.navigate('Register')}
                        style={styles.linkButton}
                        textColor="#FFC107" // Cor do texto do link
                    >
                        Não tem uma conta? Cadastre-se
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
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 16,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#CCCCCC',
    },
    dividerText: {
        marginHorizontal: 8,
        color: '#999999',
    },
    googleButton: {
        marginTop: 8,
        borderColor: '#CCCCCC', // Cor da borda
        backgroundColor: '#FFFFFF', // Cor de fundo
    },
    googleIcon: {
        width: 24,
        height: 24,
        marginRight: 8,
    },
    linkButton: {
        marginTop: 16,
    },
});