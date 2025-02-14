import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, Card, useTheme } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';

const EquipmentForm = ({ onSubmit }) => {
  const [equipmentType, setEquipmentType] = useState('AC');
  const [quantity, setQuantity] = useState('');
  const [usageHours, setUsageHours] = useState('');
  const [errors, setErrors] = useState({});

  const theme = useTheme();

  const handleSubmit = () => {
    const newErrors = {};

    if (!quantity) newErrors.quantity = 'Campo obrigatório';
    if (!usageHours) newErrors.usageHours = 'Campo obrigatório';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onSubmit({
      equipmentType,
      quantity: parseInt(quantity),
      usageHours: parseInt(usageHours),
    });
  };

  return (
    <Card style={styles.card}>
      <Card.Content>
        {/* Tipo de Equipamento */}
        <Text style={styles.label}>Tipo de Equipamento</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={equipmentType}
            style={styles.picker}
            onValueChange={(itemValue) => setEquipmentType(itemValue)}
            dropdownIconColor={theme.colors.primary}
          >
            <Picker.Item label="Ar-condicionado" value="AC" />
            <Picker.Item label="Lâmpada" value="Lamp" />
            <Picker.Item label="Computador" value="Computer" />
          </Picker>
        </View>

        {/* Quantidade */}
        <Text style={styles.label}>Quantidade</Text>
        <TextInput
          mode="outlined"
          style={styles.input}
          keyboardType="numeric"
          value={quantity}
          onChangeText={setQuantity}
          placeholder="Quantidade de equipamentos"
          error={!!errors.quantity}
          left={<TextInput.Icon icon="counter" color={theme.colors.primary} />}
        />
        {errors.quantity && <Text style={styles.errorText}>{errors.quantity}</Text>}

        {/* Horas de Uso por Dia */}
        <Text style={styles.label}>Horas de Uso por Dia</Text>
        <TextInput
          mode="outlined"
          style={styles.input}
          keyboardType="numeric"
          value={usageHours}
          onChangeText={setUsageHours}
          placeholder="Horas de uso diário"
          error={!!errors.usageHours}
          left={<TextInput.Icon icon="clock" color={theme.colors.primary} />}
        />
        {errors.usageHours && <Text style={styles.errorText}>{errors.usageHours}</Text>}

        {/* Botão de Calcular */}
        <Button
          mode="contained"
          onPress={handleSubmit}
          style={styles.button}
          icon="calculator"
          buttonColor={theme.colors.primary}
          textColor="#FFFFFF"
        >
          Calcular Consumo
        </Button>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 16,
    borderRadius: 8,
    elevation: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    marginBottom: 16,
  },
  picker: {
    width: '100%',
    height: 50,
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  button: {
    marginTop: 16,
  },
  errorText: {
    color: '#FF5252',
    fontSize: 14,
    marginBottom: 8,
  },
});

export default EquipmentForm;