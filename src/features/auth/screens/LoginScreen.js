import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TextInput, Button, Text, Card, Checkbox } from 'react-native-paper';
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../../../firebase/firebaseConfig';

export default function LoginScreen() {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    useEffect(() => {
        const loadSavedCredentials = async () => {
            try {
                const savedEmail = await AsyncStorage.getItem('email');
                const savedPassword = await AsyncStorage.getItem('password');
                if (savedEmail && savedPassword) {
                    setEmail(savedEmail);
                    setPassword(savedPassword);
                    setRememberMe(true);
                }
            } catch (error) {
                console.error('Erro ao carregar credenciais salvas:', error);
            }
        };

        loadSavedCredentials();
    }, []);

    const handleLogin = async () => {
        setEmailError('');
        setPasswordError('');

        if (!email) {
            setEmailError('Por favor, insira seu e-mail.');
            return;
        }

        if (!password) {
            setPasswordError('Por favor, insira sua senha.');
            return;
        }

        setLoading(true);
        try {
            await auth().signInWithEmailAndPassword(email, password);

            if (rememberMe) {
                await AsyncStorage.setItem('email', email);
                await AsyncStorage.setItem('password', password);
            } else {
                await AsyncStorage.removeItem('email');
                await AsyncStorage.removeItem('password');
            }

            navigation.reset({
                index: 0,
                routes: [{ name: 'Main' }]
            });
        } catch (error) {
            if (error.code === 'auth/invalid-email') {
                setEmailError('E-mail inválido.');
            } else if (error.code === 'auth/user-not-found') {
                setEmailError('Usuário não encontrado.');
            } else if (error.code === 'auth/wrong-password') {
                setPasswordError('Senha incorreta.');
            } else {
                Alert.alert('Erro', error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const inputTheme = {
        colors: {
            primary: '#FFA500',
            placeholder: '#999999',
            text: '#333333',
            label: '#333333',
        },
    };

    return (
        <View style={styles.container}>
            <Card style={styles.card}>
                <Card.Content>
                    {/* Animação */}
                    <View style={styles.animationContainer}>
                        <LottieView
                            source={require('../../../assets/animations/energy-animation.json')}
                            autoPlay
                            loop
                            style={styles.animation}
                        />
                    </View>

                    {/* Título */}
                    <Text style={styles.title} variant="headlineMedium">
                        Login
                    </Text>

                    {/* Campo de E-mail */}
                    <TextInput
                        label="E-mail"
                        mode="outlined"
                        keyboardType="email-address"
                        value={email}
                        onChangeText={(text) => {
                            setEmail(text);
                            setEmailError('');
                        }}
                        style={styles.input}
                        left={<TextInput.Icon icon="email" color="#FFC107" />}
                        theme={inputTheme}
                        error={!!emailError}
                    />
                    {emailError ? (
                        <Text style={styles.errorText}>{emailError}</Text>
                    ) : null}

                    {/* Campo de Senha */}
                    <TextInput
                        label="Senha"
                        mode="outlined"
                        secureTextEntry
                        value={password}
                        onChangeText={(text) => {
                            setPassword(text);
                            setPasswordError('');
                        }}
                        style={styles.input}
                        left={<TextInput.Icon icon="lock" color="#FFC107" />}
                        theme={inputTheme}
                        error={!!passwordError}
                    />
                    {passwordError ? (
                        <Text style={styles.errorText}>{passwordError}</Text>
                    ) : null}

                    {/* Checkbox para "Lembrar login" */}
                    <View style={styles.checkboxContainer}>
                        <Checkbox
                            status={rememberMe ? 'checked' : 'unchecked'}
                            onPress={() => setRememberMe(!rememberMe)}
                            color="#FFC107"
                        />
                        <Text style={styles.checkboxText}>Lembrar login</Text>
                    </View>

                    {/* Botão de Login */}
                    <Button
                        mode="contained"
                        onPress={handleLogin}
                        style={styles.button}
                        icon="login"
                        buttonColor="#FFC107"
                        textColor="#FFFFFF"
                        loading={loading}
                        disabled={loading}
                    >
                        Entrar
                    </Button>

                    {/* Divisor */}
                    <View style={styles.dividerContainer}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>ou</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    {/* Link para Cadastro */}
                    <Button
                        mode="text"
                        onPress={() => navigation.navigate('Register')}
                        style={styles.linkButton}
                        textColor="#FFC107"
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
    card: {
        width: '90%',
        maxWidth: 400,
        padding: 16,
        borderRadius: 8,
        backgroundColor: '#FFFFFF',
        elevation: 4,
    },
    animationContainer: {
        width: 150,
        height: 150,
        alignSelf: 'center',
        marginBottom: 16,
    },
    animation: {
        width: '100%',
        height: '100%',
    },
    title: {
        marginBottom: 24,
        textAlign: 'center',
        color: '#333333',
        fontSize: 24,
        fontWeight: 'bold',
    },
    input: {
        marginBottom: 8,
        backgroundColor: '#FFFFFF',
    },
    errorText: {
        color: '#FF5252',
        fontSize: 14,
        marginBottom: 8,
        marginLeft: 8,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    checkboxText: {
        marginLeft: 8,
        color: '#333333',
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
    linkButton: {
        marginTop: 16,
    },
});