import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import EquipmentForm from '../components/EquipmentForm';
import { calculateConsumption } from '../utils/calculationUtils';

const SimulatorScreen = () => {
  const [results, setResults] = useState(null);

  const handleFormSubmit = (data) => {
    const { equipmentType, quantity, usageHours } = data;
    const result = calculateConsumption(equipmentType, quantity, usageHours);
    setResults(result);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Simulador de Consumo</Text>
      <EquipmentForm onSubmit={handleFormSubmit} />

      {results && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>Consumo Diário: {results.dailyConsumption} kWh</Text>
          <Text style={styles.resultText}>Custo Estimado Diário: R${results.dailyCost.toFixed(2)}</Text>
          <Text style={styles.resultText}>Custo Estimado Mensal: R${results.monthlyCost.toFixed(2)}</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  resultContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
  },
  resultText: {
    fontSize: 18,
  },
});

export default SimulatorScreen;
