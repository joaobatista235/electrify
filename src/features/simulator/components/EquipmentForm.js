import React, { useState } from 'react';
import { TextInput, Button, View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const EquipmentForm = ({ onSubmit }) => {
  const [equipmentType, setEquipmentType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [usageHours, setUsageHours] = useState('');

  const handleSubmit = () => {
    if (equipmentType && quantity && usageHours) {
      onSubmit({
        equipmentType,
        quantity: parseInt(quantity),
        usageHours: parseInt(usageHours),
      });
    }
  };

  return (
    <View style={styles.formContainer}>
      <Text style={styles.label}>Tipo de Equipamento</Text>
      <Picker
        selectedValue={equipmentType}
        style={styles.picker}
        onValueChange={(itemValue) => setEquipmentType(itemValue)}
      >
        <Picker.Item label="Ar-condicionado" value="AC" />
        <Picker.Item label="Lâmpada" value="Lamp" />
        <Picker.Item label="Computador" value="Computer" />
      </Picker>

      <Text style={styles.label}>Quantidade</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={quantity}
        onChangeText={setQuantity}
        placeholder="Quantidade de equipamentos"
      />

      <Text style={styles.label}>Horas de Uso por Dia</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={usageHours}
        onChangeText={setUsageHours}
        placeholder="Horas de uso diário"
      />

      <Button title="Calcular Consumo" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginVertical: 10,
    paddingLeft: 8,
  },
  picker: {
    width: '100%',
    height: 50,
  },
});

export default EquipmentForm;