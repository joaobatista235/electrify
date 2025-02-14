import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TextInput, Button, Text, Card } from 'react-native-paper';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../../firebase/firebaseConfig';

export default function RegisterScreen() {
    const navigation = useNavigation();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleRegister = async () => {
        setNameError('');
        setEmailError('');
        setPasswordError('');

        let isValid = true;

        if (!name) {
            setNameError('Por favor, insira seu nome.');
            isValid = false;
        }

        if (!email) {
            setEmailError('Por favor, insira seu e-mail.');
            isValid = false;
        } else if (!validateEmail(email)) {
            setEmailError('Por favor, insira um e-mail válido.');
            isValid = false;
        }

        if (!password) {
            setPasswordError('Por favor, insira sua senha.');
            isValid = false;
        } else if (password.length < 6) {
            setPasswordError('A senha deve ter pelo menos 6 caracteres.');
            isValid = false;
        }

        if (!isValid) {
            return;
        }

        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            const user = userCredential.user;

            await setDoc(doc(db, 'users', user.uid), {
                name: name,
                level: 1,
                xp: 0,
                xpToNextLevel: 100,
                badges: [],
            });

            Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
            navigation.navigate('Login');
        } catch (error) {
            if (error.code === 'auth/email-already-in-use') {
                setEmailError('Este e-mail já está em uso.');
            } else if (error.code === 'auth/invalid-email') {
                setEmailError('E-mail inválido.');
            } else if (error.code === 'auth/weak-password') {
                setPasswordError('A senha é muito fraca.');
            } else {
                Alert.alert('Erro', error.message);
            }
            return;
        } finally {
            setLoading(false);
        }
    };

    const inputTheme = {
        colors: {
            primary: '#FFC107',
            placeholder: '#FFC107',
            text: '#FFC107',
            label: '#FFC107',
        },
    };

    return (
        <View style={styles.container}>
            <Card style={styles.card}>
                <Card.Content>
                    <Text style={styles.title} variant="headlineMedium">
                        Cadastre-se
                    </Text>

                    {/* Campo de Nome */}
                    <TextInput
                        label="Nome"
                        mode="outlined"
                        value={name}
                        onChangeText={(text) => {
                            setName(text);
                            setNameError('');
                        }}
                        style={styles.input}
                        left={<TextInput.Icon icon="account" color="#FFC107" />}
                        theme={inputTheme}
                        error={!!nameError}
                    />
                    {nameError ? (
                        <Text style={styles.errorText}>{nameError}</Text>
                    ) : null}

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

                    {/* Botão de Cadastro */}
                    <Button
                        mode="contained"
                        onPress={handleRegister}
                        style={styles.button}
                        icon="account-plus"
                        buttonColor="#FFC107"
                        textColor="#FFFFFF"
                        loading={loading}
                        disabled={loading}
                    >
                        Cadastrar
                    </Button>

                    {/* Link para Login */}
                    <Button
                        mode="text"
                        onPress={() => navigation.navigate('Login')}
                        style={styles.linkButton}
                        textColor="#FFC107"
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
        marginBottom: 8,
        backgroundColor: '#FFFFFF',
    },
    errorText: {
        color: '#FF5252',
        fontSize: 14,
        marginBottom: 8,
        marginLeft: 8,
    },
    button: {
        marginTop: 8,
        paddingVertical: 8,
    },
    linkButton: {
        marginTop: 16,
    },
});