import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SummaryCard = ({ data }) => {
  if (!data) return null;

  return (
    <View style={styles.cardContainer}>
      <Text style={styles.title}>Consumo Atual:</Text>
      <Text style={styles.value}>{data.current} kWh</Text>
      <Text style={styles.subtitle}>
        Estimativa de Custo: R${data.estimatedCost ? data.estimatedCost.toFixed(2) : '0.00'}
      </Text>
    </View>
  );
  
};

const styles = StyleSheet.create({
  cardContainer: {
    width: '100%',
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
});

export default SummaryCard;
