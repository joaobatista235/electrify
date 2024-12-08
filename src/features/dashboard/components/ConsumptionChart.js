import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const ConsumptionChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <View style={styles.chartContainer}>
        <Text style={styles.placeholderText}>Sem dados para exibir</Text>
      </View>
    );
  }

  const labels = data.map(item => item.day);
  const values = data.map(item => item.consumption);

  return (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>Gráfico de Consumo</Text>
      <LineChart
        data={{
          labels: labels,
          datasets: [
            {
              data: values,
            },
          ],
        }}
        width={screenWidth - 50}
        height={220}
        yAxisSuffix=" kWh"
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#f5f5f5',
          backgroundGradientTo: '#e0e0e0',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 8,
          },
          propsForLabels: {
            fontSize: 12,
          },
          propsForDots: {
            r: '4',
            strokeWidth: '2',
            stroke: '#4CAF50',
          },
        }}
        bezier
        style={{
          borderRadius: 8,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    height: 260,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
    padding: 8,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  placeholderText: {
    color: '#888',
    fontSize: 16,
  },
});

export default ConsumptionChart;
