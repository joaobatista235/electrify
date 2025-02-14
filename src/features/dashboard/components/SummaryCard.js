import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const SummaryCard = ({ data }) => {
  if (!data) return null;

  return (
    <View style={styles.cardContainer}>
      {/* Título */}
      <Text style={styles.title}>Consumo Atual</Text>

      {/* Valor do Consumo */}
      <View style={styles.valueContainer}>
        <FontAwesome name="bolt" size={24} color="#FFC107" style={styles.icon} />
        <Text style={styles.value}>{data.current} kWh</Text>
      </View>

      {/* Estimativa de Custo */}
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
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    marginRight: 8,
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFC107',
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
  },
});

export default SummaryCard;