import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
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
          color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
          strokeWidth: 2,
        },
      ],
    },
    weekly: {
      labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
      datasets: [
        {
          data: [15, 20, 18, 25, 30, 40, 50],
          color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
          strokeWidth: 2,
        },
      ],
    },
    monthly: {
      labels: ['1', '5', '10', '15', '20', '25', '30'],
      datasets: [
        {
          data: [100, 120, 130, 140, 160, 170, 180],
          color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
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
      <SummaryCard data={summaryData} />

      <View style={styles.periodSelector}>
        <TouchableOpacity
          style={[styles.periodButton, dataPeriod === 'daily' && styles.activeButton]}
          onPress={() => handlePeriodChange('daily')}
        >
          <Text style={[styles.buttonText, dataPeriod === 'daily' && styles.activeButtonText]}>Diário</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.periodButton, dataPeriod === 'weekly' && styles.activeButton]}
          onPress={() => handlePeriodChange('weekly')}
        >
          <Text style={[styles.buttonText, dataPeriod === 'weekly' && styles.activeButtonText]}>Semanal</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.periodButton, dataPeriod === 'monthly' && styles.activeButton]}
          onPress={() => handlePeriodChange('monthly')}
        >
          <Text style={[styles.buttonText, dataPeriod === 'monthly' && styles.activeButtonText]}>Mensal</Text>
        </TouchableOpacity>
      </View>

      <LineChart
        data={data[dataPeriod]}
        width={screenWidth - 40}
        height={220}
        chartConfig={{
          backgroundColor: '#1cc910',
          backgroundGradientFrom: '#43C6AC',
          backgroundGradientTo: '#191719',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
        }}
        bezier
        style={{ marginVertical: 8, borderRadius: 16 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  periodSelector: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  periodButton: {
    marginHorizontal: 10,
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: '#4CAF50',
    borderRadius: 20,
  },
  activeButton: {
    backgroundColor: '#388E3C',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  activeButtonText: {
    fontWeight: 'bold',
  },
});
