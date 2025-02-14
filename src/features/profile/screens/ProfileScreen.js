import React from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { Text, Card, ProgressBar, Button, ActivityIndicator } from 'react-native-paper';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../../firebase/firebaseConfig';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';

const ProfileScreen = ({ navigation }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const [fontsLoaded] = useFonts({
        Poppins_400Regular,
        Poppins_700Bold,
    });

    const fetchUserData = async () => {
        try {
            const user = auth.currentUser;
            if (user) {
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists()) {
                    setUser(userDoc.data());
                } else {
                    console.log("Documento do usuário não encontrado.");
                }
            }
        } catch (error) {
            console.error("Erro ao buscar dados do usuário:", error);
            Alert.alert('Erro', 'Não foi possível carregar os dados do usuário.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    if (!fontsLoaded || loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FFC107" />
                <Text style={styles.loadingText}>Carregando...</Text>
            </View>
        );
    }

    const handleLogout = async () => {
        try {
            await signOut(auth);
            Alert.alert('Sucesso', 'Logout realizado com sucesso!');
            navigation.navigate('Login');
        } catch (error) {
            Alert.alert('Erro', error.message);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Card de Informações Pessoais */}
            <Card style={styles.card}>
                <Card.Content>
                    <View style={styles.profileInfo}>
                        <FontAwesome name="user-circle" size={60} color="#FFC107" />
                        <Text style={styles.userName}>{user.name}</Text>
                        {/* Botão de Editar Perfil */}
                        <Button
                            mode="contained"
                            onPress={() => console.log('Editar perfil')}
                            style={styles.editButton}
                            buttonColor="#FFC107"
                            textColor="#FFFFFF"
                            icon="pencil"
                        >
                            Editar Perfil
                        </Button>
                    </View>
                </Card.Content>
            </Card>

            {/* Card de Progresso (XP e Nível) */}
            <Card style={styles.card}>
                <Card.Content>
                    <Text style={styles.title}>Progresso</Text>
                    <Text style={styles.levelText}>Nível {user.level} - Economizador de Energia</Text>
                    <ProgressBar
                        progress={user.xp / user.xpToNextLevel}
                        color="#FFC107"
                        style={styles.progressBar}
                    />
                    <Text style={styles.xpText}>
                        {user.xp} / {user.xpToNextLevel} XP
                    </Text>
                </Card.Content>
            </Card>

            {/* Card de Medalhas */}
            <Card style={styles.card}>
                <Card.Content>
                    <Text style={styles.title}>Medalhas Conquistadas</Text>
                    {user.badges.map((badge) => (
                        <View key={badge.id} style={styles.badgeItem}>
                            <FontAwesome name={badge.icon} size={24} color="#FFC107" />
                            <View style={styles.badgeInfo}>
                                <Text style={styles.badgeName}>{badge.name}</Text>
                                <Text style={styles.badgeDescription}>{badge.description}</Text>
                            </View>
                        </View>
                    ))}
                    <Button
                        mode="outlined"
                        onPress={() => console.log('Ver todas as medalhas')}
                        style={styles.button}
                        textColor="#FFC107"
                        icon="trophy"
                    >
                        Ver Todas as Medalhas
                    </Button>
                </Card.Content>
            </Card>

            {/* Botão de Logout */}
            <Button
                mode="contained"
                onPress={handleLogout}
                style={styles.logoutButton}
                buttonColor="#FF5252"
                textColor="#FFFFFF"
                icon="logout"
            >
                Sair
            </Button>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 8,
        backgroundColor: '#F5F5F5',
    },
    card: {
        marginBottom: 16,
        borderRadius: 8,
        elevation: 4,
        backgroundColor: '#FFFFFF',
    },
    title: {
        fontSize: 20,
        fontFamily: 'Poppins_700Bold',
        color: '#333333',
        marginBottom: 16,
    },
    profileInfo: {
        alignItems: 'center',
    },
    userName: {
        fontSize: 22,
        fontFamily: 'Poppins_700Bold',
        color: '#333333',
        marginTop: 8,
    },
    levelText: {
        fontSize: 16,
        fontFamily: 'Poppins_400Regular',
        color: '#555555',
        marginBottom: 8,
    },
    progressBar: {
        height: 10,
        borderRadius: 5,
        backgroundColor: '#E0E0E0',
        marginBottom: 8,
    },
    xpText: {
        fontSize: 14,
        fontFamily: 'Poppins_400Regular',
        color: '#666666',
    },
    badgeItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    badgeInfo: {
        marginLeft: 8,
    },
    badgeName: {
        fontSize: 16,
        fontFamily: 'Poppins_700Bold',
        color: '#333333',
    },
    badgeDescription: {
        fontSize: 14,
        fontFamily: 'Poppins_400Regular',
        color: '#666666',
    },
    button: {
        marginTop: 8,
    },
    editButton: {
        marginTop: 16,
    },
    logoutButton: {
        marginTop: 16,
        marginBottom: 32,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        fontFamily: 'Poppins_400Regular',
        color: '#333333',
    },
});

export default ProfileScreen;