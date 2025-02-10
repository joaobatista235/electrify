import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Card, ProgressBar, Button } from 'react-native-paper';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';

const ProfileScreen = () => {
    // Carregar as fontes personalizadas
    const [fontsLoaded] = useFonts({
        Poppins_400Regular,
        Poppins_700Bold,
    });

    // Se as fontes não estiverem carregadas, exibe um loading ou null
    if (!fontsLoaded) {
        return null; // Ou uma tela de carregamento
    }

    // Dados do usuário (exemplo)
    const user = {
        name: 'João Silva',
        level: 5,
        xp: 750,
        xpToNextLevel: 1000,
        coins: 120,
        badges: [
            { id: 1, name: 'Iniciante', icon: 'trophy', description: 'Realizou a primeira simulação.' },
            { id: 2, name: 'Economizador', icon: 'leaf', description: 'Reduziu o consumo em 10%.' },
            { id: 3, name: 'Leitor de Dicas', icon: 'book', description: 'Leu 5 dicas de economia.' },
        ],
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Card de Informações Pessoais */}
            <Card style={styles.card}>
                <Card.Content>
                    <View style={styles.profileInfo}>
                        <FontAwesome name="user-circle" size={60} color="#FFC107" />
                        <Text style={styles.userName}>{user.name}</Text>
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
                        color="#FFC107" // Amarelo
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
                        textColor="#FFC107" // Amarelo
                        icon="trophy"
                    >
                        Ver Todas as Medalhas
                    </Button>
                </Card.Content>
            </Card>

            {/* Card de Moedas */}
            <Card style={styles.card}>
                <Card.Content>
                    <Text style={styles.title}>Moedas</Text>
                    <View style={styles.coinContainer}>
                        <FontAwesome name="money" size={24} color="#FFC107" />
                        <Text style={styles.coinText}>{user.coins} moedas</Text>
                    </View>
                </Card.Content>
            </Card>

            {/* Botão de Editar Perfil */}
            <Button
                mode="contained"
                onPress={() => console.log('Editar perfil')}
                style={styles.editButton}
                buttonColor="#FFC107" // Amarelo
                textColor="#FFFFFF" // Texto branco
                icon="pencil"
            >
                Editar Perfil
            </Button>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 16,
        backgroundColor: '#F5F5F5', // Fundo cinza claro
    },
    card: {
        marginBottom: 16,
        borderRadius: 16,
        elevation: 4,
        backgroundColor: '#FFFFFF', // Fundo branco
    },
    title: {
        fontSize: 20,
        fontFamily: 'Poppins_700Bold', // Fonte personalizada
        color: '#333333', // Cinza escuro
        marginBottom: 16,
    },
    profileInfo: {
        alignItems: 'center',
    },
    userName: {
        fontSize: 22,
        fontFamily: 'Poppins_700Bold', // Fonte personalizada
        color: '#333333', // Cinza escuro
        marginTop: 8,
    },
    levelText: {
        fontSize: 16,
        fontFamily: 'Poppins_400Regular', // Fonte personalizada
        color: '#555555', // Cinza médio
        marginBottom: 8,
    },
    progressBar: {
        height: 10,
        borderRadius: 5,
        backgroundColor: '#E0E0E0', // Cinza claro
        marginBottom: 8,
    },
    xpText: {
        fontSize: 14,
        fontFamily: 'Poppins_400Regular', // Fonte personalizada
        color: '#666666', // Cinza médio
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
        fontFamily: 'Poppins_700Bold', // Fonte personalizada
        color: '#333333', // Cinza escuro
    },
    badgeDescription: {
        fontSize: 14,
        fontFamily: 'Poppins_400Regular', // Fonte personalizada
        color: '#666666', // Cinza médio
    },
    coinContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    coinText: {
        fontSize: 16,
        fontFamily: 'Poppins_700Bold', // Fonte personalizada
        color: '#333333', // Cinza escuro
        marginLeft: 8,
    },
    button: {
        marginTop: 8,
    },
    editButton: {
        marginTop: 16,
    },
});

export default ProfileScreen;