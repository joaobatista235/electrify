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
        width={screenWidth - 40} 
        height={220}
        yAxisSuffix=" kWh"
        chartConfig={{
          backgroundColor: '#FFFFFF',
          backgroundGradientFrom: '#FFC107',
          backgroundGradientTo: '#FFA000',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 8,
          },
          propsForLabels: {
            fontSize: 12,
          },
          propsForDots: {
            r: '5',
            strokeWidth: '2',
            stroke: '#FFA000',
            fill: '#FFFFFF',
          },
          propsForBackgroundLines: {
            stroke: '#E0E0E0',
            strokeWidth: 1,
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
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    marginBottom: 16,
    padding: 16,
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
  },
  placeholderText: {
    color: '#888',
    fontSize: 16,
  },
});

export default ConsumptionChart;