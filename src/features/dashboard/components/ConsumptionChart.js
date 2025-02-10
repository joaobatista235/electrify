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
        width={screenWidth - 40} // Ajuste da largura
        height={220}
        yAxisSuffix=" kWh"
        chartConfig={{
          backgroundColor: '#FFFFFF', // Fundo branco
          backgroundGradientFrom: '#FFC107', // Amarelo (início do gradiente)
          backgroundGradientTo: '#FFA000', // Amarelo mais escuro (fim do gradiente)
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // Texto branco
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Texto dos eixos em preto
          style: {
            borderRadius: 8,
          },
          propsForLabels: {
            fontSize: 12,
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
        style={{
          borderRadius: 8,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    backgroundColor: '#FFFFFF', // Fundo branco
    borderRadius: 16, // Bordas mais arredondadas
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000', // Sombra
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5, // Sombra no Android
    marginBottom: 16,
    padding: 16, // Mais espaçamento interno
  },
  chartTitle: {
    fontSize: 20, // Tamanho maior
    fontWeight: 'bold',
    color: '#333333', // Cinza escuro
    marginBottom: 16, // Mais espaçamento
  },
  placeholderText: {
    color: '#888',
    fontSize: 16,
  },
});

export default ConsumptionChart;