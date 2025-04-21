import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert, ActivityIndicator, Animated, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { auth, db, firebase } from '../../../firebase/firebaseConfig';
import { Dialog, Portal, Button, Provider } from 'react-native-paper';

// Definição das conquistas
const ACHIEVEMENTS = {
    TIPS_READER_1: {
        id: 'TIPS_READER_1',
        name: 'Leitor Iniciante',
        description: 'Leu 3 dicas de economia de energia.',
        icon: 'book',
        requiredTips: 3,
        xpReward: 20,
    },
    TIPS_READER_2: {
        id: 'TIPS_READER_2',
        name: 'Leitor Intermediário',
        description: 'Leu 10 dicas de economia de energia.',
        icon: 'book',
        requiredTips: 10,
        xpReward: 50,
    },
    TIPS_READER_3: {
        id: 'TIPS_READER_3',
        name: 'Leitor Avançado',
        description: 'Leu todas as dicas de economia de energia.',
        icon: 'book',
        requiredTips: 15,
        xpReward: 100,
    },
};

// Dicas padrão do aplicativo
const DEFAULT_TIPS = [
    { id: 'tip1', title: "Use lâmpadas LED", description: "Substitua lâmpadas incandescentes por LED para economizar até 80% de energia.", category: "Iluminação" },
    { id: 'tip2', title: "Ajuste o termostato", description: "Mantenha o ar-condicionado a 24°C para reduzir o consumo.", category: "Climatização" },
    { id: 'tip3', title: "Desligue dispositivos em standby", description: "Aparelhos em standby consomem energia. Use réguas com botão de liga/desliga.", category: "Eletrônicos" },
    { id: 'tip4', title: "Use energia solar", description: "Considere instalar painéis solares para reduzir sua dependência da rede elétrica.", category: "Energia Renovável" },
    { id: 'tip5', title: "Lave roupas com água fria", description: "Usar água fria na máquina de lavar economiza até 90% da energia usada para aquecer água.", category: "Eletrodomésticos" },
    { id: 'tip6', title: "Seque roupas naturalmente", description: "Sempre que possível, seque suas roupas ao ar livre em vez de usar secadoras.", category: "Eletrodomésticos" },
    { id: 'tip7', title: "Use cortinas térmicas", description: "Cortinas térmicas ajudam a manter a temperatura interna, reduzindo o uso de ar-condicionado.", category: "Climatização" },
    { id: 'tip8', title: "Mantenha equipamentos limpos", description: "Filtros de ar-condicionado e geladeiras limpos funcionam com mais eficiência.", category: "Manutenção" },
    { id: 'tip9', title: "Desligue as luzes", description: "Ao sair de um cômodo, sempre desligue as luzes que não estão sendo utilizadas.", category: "Iluminação" },
    { id: 'tip10', title: "Priorize luz natural", description: "Organize sua casa para aproveitar ao máximo a luz natural durante o dia.", category: "Iluminação" },
    { id: 'tip11', title: "Use temporizadores", description: "Configure temporizadores para desligar aparelhos automaticamente em horários específicos.", category: "Eletrônicos" },
    { id: 'tip12', title: "Monitore seu consumo", description: "Use aplicativos ou medidores inteligentes para acompanhar seu consumo de energia.", category: "Monitoramento" },
    { id: 'tip13', title: "Isole sua casa", description: "Melhore o isolamento térmico para reduzir o uso de aquecedores e ar-condicionado.", category: "Construção" },
    { id: 'tip14', title: "Use ventiladores", description: "Ventiladores consomem muito menos energia que ar-condicionados.", category: "Climatização" },
    { id: 'tip15', title: "Atualize eletrodomésticos", description: "Aparelhos antigos consomem mais energia. Priorize modelos com selo de eficiência energética.", category: "Eletrodomésticos" },
];

export default function TipsScreen({ navigation }) {
    const [tips, setTips] = useState([]);
    const [readTips, setReadTips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [impact, setImpact] = useState({
        co2Saved: 0,
        treesPlanted: 0,
    });
    
    // Estado para animação de conquistas
    const [showAchievementDialog, setShowAchievementDialog] = useState(false);
    const [newAchievements, setNewAchievements] = useState([]);
    const [totalXpEarned, setTotalXpEarned] = useState(0);
    
    // Animações
    const scaleAnim = useState(new Animated.Value(0.5))[0];
    const opacityAnim = useState(new Animated.Value(0))[0];

    const [fontsLoaded] = useFonts({
        Poppins_400Regular,
        Poppins_700Bold,
    });

    useEffect(() => {
        loadUserData();
    }, []);
    
    // Animar entrada da conquista
    const animateAchievement = () => {
        Animated.parallel([
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 5,
                tension: 30,
                useNativeDriver: true
            }),
            Animated.timing(opacityAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true
            })
        ]).start();
    };

    const loadUserData = async () => {
        try {
            setLoading(true);
            const user = auth().currentUser;
            if (!user) {
                setLoading(false);
                return;
            }

            const userDoc = await db.collection('users').doc(user.uid).get();

            if (userDoc.exists) {
                // Carregar dicas lidas do usuário
                const userData = userDoc.data();
                const userReadTips = userData.readTips || [];
                setReadTips(userReadTips);

                // Criar lista de dicas com status de leitura
                const tipsWithReadStatus = DEFAULT_TIPS.map(tip => ({
                    ...tip,
                    read: userReadTips.includes(tip.id)
                }));
                setTips(tipsWithReadStatus);

                // Calcular impacto ambiental baseado nas dicas lidas
                // Cada dica lida economiza aproximadamente 5kg de CO2
                const co2Saved = userReadTips.length * 5;
                // Cada 15kg de CO2 equivale a uma árvore por ano
                const treesPlanted = Math.floor(co2Saved / 15);
                
                setImpact({
                    co2Saved,
                    treesPlanted,
                });
            } else {
                // Inicializar documento do usuário se não existir
                await db.collection('users').doc(user.uid).set({
                    readTips: [],
                }, { merge: true });
                
                // Definir todas as dicas como não lidas
                const tipsWithReadStatus = DEFAULT_TIPS.map(tip => ({
                    ...tip,
                    read: false
                }));
                setTips(tipsWithReadStatus);
            }
        } catch (error) {
            console.error("Erro ao carregar dados do usuário:", error);
            Alert.alert("Erro", "Não foi possível carregar suas dicas. Tente novamente mais tarde.");
        } finally {
            setLoading(false);
        }
    };

    const markTipAsRead = async (id) => {
        try {
            const user = auth().currentUser;
            if (!user) return;

            // Verificar se a dica já foi lida
            if (readTips.includes(id)) {
                return;
            }
            
            // Atualizar interface imediatamente
            const updatedTips = tips.map((tip) =>
                tip.id === id ? { ...tip, read: true } : tip
            );
            setTips(updatedTips);
            
            const newReadTips = [...readTips, id];
            setReadTips(newReadTips);

            // Atualizar Firebase
            const userRef = db.collection('users').doc(user.uid);
            const userDoc = await userRef.get();
            
            if (userDoc.exists) {
                const userData = userDoc.data();
                const readTipsArray = userData.readTips || [];
                if (!readTipsArray.includes(id)) {
                    readTipsArray.push(id);
                    await userRef.update({ readTips: readTipsArray });
                }
            }

            // Verificar conquistas após marcar dica como lida
            await checkAchievements(newReadTips);
            
        } catch (error) {
            console.error("Erro ao marcar dica como lida:", error);
            Alert.alert("Erro", "Não foi possível atualizar sua dica. Tente novamente.");
        }
    };

    const checkAchievements = async (currentReadTips) => {
        try {
            const user = auth().currentUser;
            if (!user) return;

            const userRef = db.collection('users').doc(user.uid);
            const userDoc = await userRef.get();
            
            if (!userDoc.exists) return;
            
            const userData = userDoc.data();
            const userAchievements = userData.badges || [];

            let earnedAchievements = [];
            let totalXpToAdd = 0;

            // Verificar todas as conquistas possíveis
            Object.values(ACHIEVEMENTS).forEach(achievement => {
                // Verificar se o usuário já possui essa conquista
                const hasAchievement = userAchievements.some(badge => badge.id === achievement.id);
                
                // Se não possui a conquista e atingiu o número necessário de dicas lidas
                if (!hasAchievement && currentReadTips.length >= achievement.requiredTips) {
                    earnedAchievements.push({
                        id: achievement.id,
                        name: achievement.name,
                        icon: achievement.icon,
                        description: achievement.description,
                        xpReward: achievement.xpReward,
                    });
                    
                    totalXpToAdd += achievement.xpReward;
                }
            });

            // Se ganhou novas conquistas
            if (earnedAchievements.length > 0) {
                // Atualizar conquistas
                for (const achievement of earnedAchievements) {
                    const userData = (await userRef.get()).data();
                    const badges = userData.badges || [];
                    badges.push({
                        id: achievement.id,
                        name: achievement.name,
                        icon: achievement.icon,
                        description: achievement.description
                    });
                    await userRef.update({ badges: badges });
                }
                
                // Atualizar XP
                const userData = (await userRef.get()).data();
                const currentXp = userData.xp || 0;
                await userRef.update({ xp: currentXp + totalXpToAdd });

                // Preparar animação de conquista
                setNewAchievements(earnedAchievements);
                setTotalXpEarned(totalXpToAdd);
                
                // Redefinir animações
                scaleAnim.setValue(0.5);
                opacityAnim.setValue(0);
                
                // Mostrar diálogo de conquista
                setShowAchievementDialog(true);
                // Iniciar animação
                animateAchievement();
            }
        } catch (error) {
            console.error("Erro ao verificar conquistas:", error);
        }
    };

    const renderTipItem = ({ item }) => (
        <View style={styles.tipItem}>
            <View style={styles.tipHeader}>
                <MaterialIcons
                    name={item.category === "Iluminação" ? "lightbulb" : 
                          item.category === "Climatização" ? "ac-unit" : 
                          item.category === "Eletrônicos" ? "power" :
                          item.category === "Eletrodomésticos" ? "kitchen" :
                          "eco"}
                    size={24}
                    color="#FFC107"
                />
                <Text style={styles.tipTitle}>{item.title}</Text>
                {item.read && (
                    <MaterialIcons name="check-circle" size={20} color="#4CAF50" style={styles.readIcon} />
                )}
            </View>
            <Text style={styles.tipDescription}>{item.description}</Text>
            <TouchableOpacity
                style={[styles.readButton, item.read && styles.readButtonDisabled]}
                onPress={() => markTipAsRead(item.id)}
                disabled={item.read}
            >
                <Text style={styles.readButtonText}>{item.read ? "Lida" : "Marcar como lida"}</Text>
            </TouchableOpacity>
        </View>
    );

    if (!fontsLoaded || loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FFC107" />
                <Text style={styles.loadingText}>Carregando dicas...</Text>
            </View>
        );
    }

    return (
        <Provider>
            <View style={styles.container}>
                {/* Impacto Ambiental */}
                <View style={styles.impactContainer}>
                    <Text style={styles.impactTitle}>Seu Impacto Ambiental</Text>
                    <View style={styles.impactMetrics}>
                        <View style={styles.metric}>
                            <Text style={styles.metricValue}>{impact.co2Saved} kg</Text>
                            <Text style={styles.metricLabel}>CO₂ economizado</Text>
                        </View>
                        <View style={styles.metric}>
                            <Text style={styles.metricValue}>{impact.treesPlanted}</Text>
                            <Text style={styles.metricLabel}>Árvores salvas</Text>
                        </View>
                    </View>
                    <View style={styles.progressContainer}>
                        <Text style={styles.progressText}>
                            {`${readTips.length}/${tips.length} dicas lidas`}
                        </Text>
                        <View style={styles.progressBar}>
                            <View 
                                style={[
                                    styles.progressFill, 
                                    { width: `${(readTips.length / tips.length) * 100}%` }
                                ]} 
                            />
                        </View>
                    </View>
                </View>
                
                {/* Lista de Dicas */}
                <FlatList
                    data={tips}
                    renderItem={renderTipItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.tipsList}
                />
                
                {/* Diálogo de novas conquistas */}
                <Portal>
                    <Dialog 
                        visible={showAchievementDialog} 
                        onDismiss={() => setShowAchievementDialog(false)}
                        style={[styles.achievementDialog, { backgroundColor: 'transparent' }]}
                    >
                        <Animated.View style={[
                            styles.achievementAnimatedContainer,
                            {
                                transform: [{ scale: scaleAnim }],
                                opacity: opacityAnim
                            }
                        ]}>
                            <View style={styles.achievementIconContainer}>
                                <MaterialIcons name="emoji-events" size={80} color="#FFC107" />
                            </View>
                            <Text style={styles.achievementTitle}>
                                {newAchievements.length > 1 
                                    ? "Novas Conquistas!" 
                                    : "Nova Conquista!"}
                            </Text>
                            
                            {newAchievements.map((achievement, index) => (
                                <View key={achievement.id} style={styles.achievementItem}>
                                    <MaterialIcons 
                                        name={achievement.icon} 
                                        size={36} 
                                        color="#FFC107" 
                                    />
                                    <View style={styles.achievementContent}>
                                        <Text style={styles.achievementName}>
                                            {achievement.name}
                                        </Text>
                                        <Text style={styles.achievementDesc}>
                                            {achievement.description}
                                        </Text>
                                        <Text style={styles.achievementXP}>
                                            +{achievement.xpReward} XP
                                        </Text>
                                    </View>
                                </View>
                            ))}
                            
                            <Text style={styles.totalXpText}>
                                Total: +{totalXpEarned} XP
                            </Text>
                            
                            <Button 
                                mode="contained" 
                                onPress={() => setShowAchievementDialog(false)}
                                style={styles.achievementButton}
                                buttonColor="#4CAF50"
                                textColor="#FFFFFF"
                            >
                                Continuar
                            </Button>
                        </Animated.View>
                    </Dialog>
                </Portal>
            </View>
        </Provider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        padding: 16,
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
        color: '#333',
    },
    screenTitle: {
        fontSize: 24,
        fontFamily: 'Poppins_700Bold',
        color: '#333',
        marginBottom: 16,
    },
    tipsList: {
        paddingBottom: 16,
    },
    tipItem: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    tipHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    tipTitle: {
        fontSize: 18,
        fontFamily: 'Poppins_700Bold',
        color: '#333',
        marginLeft: 8,
        flex: 1,
    },
    tipDescription: {
        fontSize: 14,
        fontFamily: 'Poppins_400Regular',
        color: '#666',
        marginBottom: 12,
    },
    readButton: {
        backgroundColor: '#FFC107',
        padding: 8,
        borderRadius: 4,
        alignItems: 'center',
    },
    readButtonDisabled: {
        backgroundColor: '#E0E0E0',
    },
    readButtonText: {
        fontSize: 14,
        fontFamily: 'Poppins_700Bold',
        color: '#FFFFFF',
    },
    readIcon: {
        marginLeft: 8,
    },
    impactContainer: {
        marginBottom: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    impactTitle: {
        fontSize: 20,
        fontFamily: 'Poppins_700Bold',
        color: '#333',
        marginBottom: 12,
    },
    impactMetrics: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 16,
    },
    metric: {
        alignItems: 'center',
    },
    metricValue: {
        fontSize: 24,
        fontFamily: 'Poppins_700Bold',
        color: '#FFC107',
    },
    metricLabel: {
        fontSize: 14,
        fontFamily: 'Poppins_400Regular',
        color: '#666',
    },
    progressContainer: {
        marginTop: 8,
    },
    progressText: {
        fontSize: 14,
        fontFamily: 'Poppins_400Regular',
        color: '#666',
        marginBottom: 4,
        textAlign: 'center',
    },
    progressBar: {
        height: 8,
        backgroundColor: '#E0E0E0',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#FFC107',
    },
    achievementDialog: {
        backgroundColor: 'transparent',
        elevation: 0,
    },
    achievementAnimatedContainer: {
        backgroundColor: 'white',
        padding: 24,
        borderRadius: 16,
        alignItems: 'center',
    },
    achievementIconContainer: {
        backgroundColor: '#FFF9E0',
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    achievementTitle: {
        fontSize: 24,
        fontFamily: 'Poppins_700Bold',
        color: '#333',
        marginBottom: 24,
        textAlign: 'center',
    },
    achievementItem: {
        flexDirection: 'row',
        backgroundColor: '#F8F8F8',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        alignItems: 'center',
        width: '100%',
    },
    achievementContent: {
        flex: 1,
        marginLeft: 12,
    },
    achievementName: {
        fontSize: 16,
        fontFamily: 'Poppins_700Bold',
        color: '#333',
        marginBottom: 4,
    },
    achievementDesc: {
        fontSize: 12,
        fontFamily: 'Poppins_400Regular',
        color: '#666',
        marginBottom: 4,
    },
    achievementXP: {
        fontSize: 12,
        fontFamily: 'Poppins_700Bold',
        color: '#4CAF50',
    },
    totalXpText: {
        fontSize: 18,
        fontFamily: 'Poppins_700Bold',
        color: '#4CAF50',
        marginTop: 8,
        marginBottom: 24,
    },
    achievementButton: {
        width: '100%',
    },
});