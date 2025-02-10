import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import SummaryCard from '../components/SummaryCard';

// Largura da tela
const screenWidth = Dimensions.get('window').width;

export default function DashboardScreen() {
  const [dataPeriod, setDataPeriod] = useState('daily');

  const data = {
    daily: {
      labels: ['12:00', '14:00', '16:00', '18:00', '20:00'],
      datasets: [
        {
          data: [1, 2, 3, 2, 5],
          color: (opacity = 1) => `rgba(255, 193, 7, ${opacity})`, // Amarelo
          strokeWidth: 2,
        },
      ],
    },
    weekly: {
      labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
      datasets: [
        {
          data: [15, 20, 18, 25, 30, 40, 50],
          color: (opacity = 1) => `rgba(255, 193, 7, ${opacity})`, // Amarelo
          strokeWidth: 2,
        },
      ],
    },
    monthly: {
      labels: ['1', '5', '10', '15', '20', '25', '30'],
      datasets: [
        {
          data: [100, 120, 130, 140, 160, 170, 180],
          color: (opacity = 1) => `rgba(255, 193, 7, ${opacity})`, // Amarelo
          strokeWidth: 2,
        },
      ],
    },
  };

  const handlePeriodChange = (period) => {
    setDataPeriod(period);
  };

  const calculateTotalConsumption = () => {
    const selectedData = data[dataPeriod].datasets[0].data;
    return selectedData.reduce((acc, value) => acc + value, 0);
  };

  const summaryData = {
    totalConsumption: calculateTotalConsumption(),
    averagePrice: 0.12,
    totalPrice: calculateTotalConsumption() * 0.12,
    estimatedCost: 120,
    current: 120,
  };

  return (
    <View style={styles.container}>
      {/* Card de Resumo */}
      <SummaryCard data={summaryData} />

      {/* Card do Gráfico e Tabs */}
      <View style={styles.chartCard}>
        {/* Tabs de Período */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tabButton, dataPeriod === 'daily' && styles.activeTab]}
            onPress={() => handlePeriodChange('daily')}
          >
            <Text style={[styles.tabText, dataPeriod === 'daily' && styles.activeTabText]}>Diário</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, dataPeriod === 'weekly' && styles.activeTab]}
            onPress={() => handlePeriodChange('weekly')}
          >
            <Text style={[styles.tabText, dataPeriod === 'weekly' && styles.activeTabText]}>Semanal</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, dataPeriod === 'monthly' && styles.activeTab]}
            onPress={() => handlePeriodChange('monthly')}
          >
            <Text style={[styles.tabText, dataPeriod === 'monthly' && styles.activeTabText]}>Mensal</Text>
          </TouchableOpacity>
        </View>

        {/* Gráfico de Consumo */}
        <LineChart
          data={data[dataPeriod]}
          width={screenWidth - 40}
          height={220}
          chartConfig={{
            backgroundColor: '#FFFFFF', // Fundo branco
            backgroundGradientFrom: '#FFFFFF', // Fundo branco
            backgroundGradientTo: '#FFFFFF', // Fundo branco
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(255, 193, 7, ${opacity})`, // Linha do gráfico em amarelo
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Texto dos eixos em preto
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '5', // Tamanho dos pontos
              strokeWidth: '2',
              stroke: '#FFA000', // Borda dos pontos em amarelo mais escuro
              fill: '#FFFFFF', // Preenchimento dos pontos em branco
            },
            propsForBackgroundLines: {
              stroke: '#E0E0E0', // Linhas de fundo do gráfico em cinza claro
              strokeWidth: 1,
            },
          }}
          bezier
          style={{ marginVertical: 8, borderRadius: 16, backgroundColor: '#FFFFFF' }} // Fundo branco
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5', // Fundo cinza claro
    padding: 16,
  },
  chartCard: {
    backgroundColor: '#FFFFFF', // Fundo branco
    borderRadius: 16, // Bordas mais arredondadas
    shadowColor: '#000', // Sombra
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5, // Sombra no Android
    padding: 16,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0', // Linha separadora
    marginBottom: 16,
  },
  tabButton: {
    paddingBottom: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#FFC107', // Amarelo (cor primária)
  },
  tabText: {
    fontSize: 16,
    color: '#666666', // Cinza médio
  },
  activeTabText: {
    color: '#FFC107', // Amarelo (cor primária)
    fontWeight: 'bold',
  },
});