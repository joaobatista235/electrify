import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';

const mockTips = [
    { id: 1, title: "Use lâmpadas LED", description: "Substitua lâmpadas incandescentes por LED para economizar até 80% de energia.", category: "Iluminação", read: false },
    { id: 2, title: "Ajuste o termostato", description: "Mantenha o ar-condicionado a 24°C para reduzir o consumo.", category: "Climatização", read: false },
    { id: 3, title: "Desligue dispositivos em standby", description: "Aparelhos em standby consomem energia. Use réguas com botão de liga/desliga.", category: "Eletrônicos", read: false },
    { id: 4, title: "Use energia solar", description: "Considere instalar painéis solares para reduzir sua dependência da rede elétrica.", category: "Energia Renovável", read: false },
];

const mockImpact = {
    co2Saved: 50.5,
    treesPlanted: 3,
};

export default function TipsScreen() {
    const [tips, setTips] = useState(mockTips);

    const [fontsLoaded] = useFonts({
        Poppins_400Regular,
        Poppins_700Bold,
    });

    if (!fontsLoaded) {
        return null;
    }

    const markTipAsRead = (id) => {
        const updatedTips = tips.map((tip) =>
            tip.id === id ? { ...tip, read: true } : tip
        );
        setTips(updatedTips);
    };

    const renderTipItem = ({ item }) => (
        <View style={styles.tipItem}>
            <View style={styles.tipHeader}>
                <MaterialIcons
                    name={item.category === "Iluminação" ? "lightbulb" : item.category === "Climatização" ? "ac-unit" : "power"}
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
                style={styles.readButton}
                onPress={() => markTipAsRead(item.id)}
            >
                <Text style={styles.readButtonText}>{item.read ? "Lida" : "Marcar como lida"}</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Impacto Ambiental */}
            <View style={styles.impactContainer}>
                <Text style={styles.impactTitle}>Seu Impacto Ambiental</Text>
                <View style={styles.impactMetrics}>
                    <View style={styles.metric}>
                        <Text style={styles.metricValue}>{mockImpact.co2Saved} kg</Text>
                        <Text style={styles.metricLabel}>CO₂ economizado</Text>
                    </View>
                    <View style={styles.metric}>
                        <Text style={styles.metricValue}>{mockImpact.treesPlanted}</Text>
                        <Text style={styles.metricLabel}>Árvores salvas</Text>
                    </View>
                </View>
            </View>
            {/* Lista de Dicas */}
            <FlatList
                data={tips}
                renderItem={renderTipItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.tipsList}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        padding: 16,
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
    readButtonText: {
        fontSize: 14,
        fontFamily: 'Poppins_700Bold',
        color: '#FFFFFF',
    },
    readIcon: {
        marginLeft: 'auto',
    },
    impactContainer: {
        marginBottom: 8,
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
    profileInfo: {
        alignItems: 'center',
    },
    userName: {
        fontSize: 22,
        fontFamily: 'Poppins_700Bold',
        color: '#333',
        marginTop: 8,
    },
    levelText: {
        fontSize: 16,
        fontFamily: 'Poppins_400Regular',
        color: '#555',
        marginBottom: 8,
    },
});