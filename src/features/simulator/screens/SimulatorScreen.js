import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { TextInput, Button, Text, Card, List } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';

const EQUIPMENT_DATA = {
  AC: { label: 'Ar-condicionado', consumption: 1.5 },
  Shower: { label: 'Chuveiro', consumption: 5.0 },
  Lamp: { label: 'Lâmpada', consumption: 0.1 },
  Computer: { label: 'Computador', consumption: 0.3 },
};

const KWH_PRICE = 0.75;

const SimulatorScreen = () => {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });

  const [equipmentType, setEquipmentType] = useState('AC');
  const [quantity, setQuantity] = useState('');
  const [usageHours, setUsageHours] = useState('');
  const [equipments, setEquipments] = useState([]);
  const [totalConsumption, setTotalConsumption] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [errors, setErrors] = useState({});

  if (!fontsLoaded) {
    return null;
  }

  const handleAddEquipment = () => {
    const newErrors = {};

    if (!quantity) newErrors.quantity = 'Campo obrigatório';
    if (!usageHours) newErrors.usageHours = 'Campo obrigatório';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    const newEquipment = {
      type: equipmentType,
      label: EQUIPMENT_DATA[equipmentType].label,
      quantity: parseInt(quantity),
      usageHours: parseInt(usageHours),
      consumption: EQUIPMENT_DATA[equipmentType].consumption,
    };

    setEquipments([...equipments, newEquipment]);
    setQuantity('');
    setUsageHours('');
  };

  const handleCalculate = () => {
    let consumption = 0;
    equipments.forEach((equipment) => {
      consumption += equipment.consumption * equipment.quantity * equipment.usageHours;
    });

    setTotalConsumption(consumption);
    setTotalCost(consumption * KWH_PRICE);
  };

  const handleClear = () => {
    setEquipments([]);
    setTotalConsumption(0);
    setTotalCost(0);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Card do Formulário */}
      <Card style={styles.card}>
        <Card.Content>
          {/* Tipo de Equipamento */}
          <Text style={styles.label}>Tipo de Equipamento</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={equipmentType}
              style={styles.picker}
              onValueChange={(itemValue) => setEquipmentType(itemValue)}
              dropdownIconColor="#FFC107"
            >
              {Object.keys(EQUIPMENT_DATA).map((key) => (
                <Picker.Item key={key} label={EQUIPMENT_DATA[key].label} value={key} />
              ))}
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
            left={<TextInput.Icon icon="counter" color="#FFC107" />} // Amarelo
            outlineColor="#E0E0E0" // Cinza claro
            activeOutlineColor="#FFC107" // Amarelo
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
            left={<TextInput.Icon icon="clock" color="#FFC107" />}
            outlineColor="#E0E0E0"
            activeOutlineColor="#FFC107"
          />
          {errors.usageHours && <Text style={styles.errorText}>{errors.usageHours}</Text>}

          {/* Botão de Adicionar */}
          <Button
            mode="contained"
            onPress={handleAddEquipment}
            style={styles.button}
            icon="plus"
            buttonColor="#FFC107"
            textColor="#FFFFFF"
          >
            Adicionar Equipamento
          </Button>
        </Card.Content>
      </Card>

      {/* Lista de Equipamentos Adicionados */}
      {equipments.length > 0 && (
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.title}>Equipamentos Adicionados</Text>
            {equipments.map((equipment, index) => (
              <List.Item
                key={index}
                title={`${equipment.label} (${equipment.quantity}x)`}
                description={`${equipment.usageHours} horas/dia`}
                left={() => <List.Icon icon="lightbulb" color="#FFC107" />}
              />
            ))}
          </Card.Content>
        </Card>
      )}

      {/* Resultado do Cálculo */}
      {totalConsumption > 0 && (
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.title}>Resultado</Text>
            <Text style={styles.resultText}>
              Consumo Total: {totalConsumption.toFixed(2)} kWh
            </Text>
            <Text style={styles.resultText}>
              Custo Estimado: R$ {totalCost.toFixed(2)}
            </Text>
          </Card.Content>
        </Card>
      )}

      {/* Botões de Ação */}
      <View style={styles.actionsContainer}>
        <Button
          mode="contained"
          onPress={handleCalculate}
          style={styles.button}
          icon="calculator"
          buttonColor="#FFC107"
          textColor="#FFFFFF"
          disabled={equipments.length === 0}
        >
          Calcular Consumo
        </Button>
        <Button
          mode="outlined"
          onPress={handleClear}
          style={styles.button}
          icon="delete"
          textColor="#FFC107"
          disabled={equipments.length === 0}
        >
          Limpar Tudo
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  card: {
    marginBottom: 16,
    borderRadius: 8,
    elevation: 4,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 20,
    fontFamily: 'Poppins_700Bold',
    color: '#333333',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Poppins_700Bold',
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
    marginTop: 8,
  },
  errorText: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#FF5252',
    marginBottom: 8,
  },
  resultText: {
    fontSize: 16,
    fontFamily: 'Poppins_700Bold',
    color: '#333333',
    marginBottom: 8,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
});

export default SimulatorScreen;