import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Platform } from 'react-native';
import { TextInput, Button, Text, Card, List, Dialog, Portal, Provider, MD3DarkTheme, MD3LightTheme, useTheme } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { auth, db, firebase } from '../../../firebase/firebaseConfig';
import { MaterialIcons } from '@expo/vector-icons';
import { Animated } from 'react-native';

// Default equipment data as initial options
const DEFAULT_EQUIPMENT_DATA = {
  AC: { label: 'Ar-condicionado', consumption: 1.5 },
  Shower: { label: 'Chuveiro', consumption: 5.0 },
  Lamp: { label: 'Lâmpada', consumption: 0.1 },
  Computer: { label: 'Computador', consumption: 0.3 },
};

const KWH_PRICE = 0.75;

// Achievement definition
const SIMULATOR_MASTER = {
  id: 'SIMULATOR_MASTER',
  name: 'Mestre do Simulador',
  description: 'Criou 3 simulações personalizadas',
  icon: 'science',
  requiredSimulations: 3,
  xpReward: 60,
};

// Custom theme for dialog with white background
const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    background: '#FFFFFF',
    surface: '#FFFFFF',
  },
};

const SimulatorScreen = () => {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });

  const [equipmentData, setEquipmentData] = useState(DEFAULT_EQUIPMENT_DATA);
  const [equipmentType, setEquipmentType] = useState('AC');
  const [quantity, setQuantity] = useState('');
  const [usageHours, setUsageHours] = useState('');
  const [equipments, setEquipments] = useState([]);
  const [totalConsumption, setTotalConsumption] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [customSimulationsCount, setCustomSimulationsCount] = useState(0);
  
  // Achievement state
  const [showAchievementDialog, setShowAchievementDialog] = useState(false);
  const [achievementEarned, setAchievementEarned] = useState(null);
  
  // Animations
  const scaleAnim = useState(new Animated.Value(0.5))[0];
  const opacityAnim = useState(new Animated.Value(0))[0];
  
  // Custom equipment dialog state
  const [customDialogVisible, setCustomDialogVisible] = useState(false);
  const [customEquipmentName, setCustomEquipmentName] = useState('');
  const [customEquipmentConsumption, setCustomEquipmentConsumption] = useState('');
  const [customEquipmentErrors, setCustomEquipmentErrors] = useState({});

  useEffect(() => {
    loadUserEquipmentData();
  }, []);
  
  // Animate achievement dialog
  const animateAchievement = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 30,
        useNativeDriver: true
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true
      })
    ]).start();
  };

  const loadUserEquipmentData = async () => {
    try {
      const user = auth().currentUser;
      if (!user) {
        setLoading(false);
        return;
      }

      const userDoc = await db.collection('users').doc(user.uid).get();
      
      if (userDoc.exists) {
        // Load saved equipment list
        if (userDoc.data().simulatorEquipments) {
          setEquipments(userDoc.data().simulatorEquipments);
        }
        
        // Load custom equipment types
        if (userDoc.data().customEquipment) {
          const customData = {...DEFAULT_EQUIPMENT_DATA};
          Object.keys(userDoc.data().customEquipment).forEach(key => {
            customData[key] = userDoc.data().customEquipment[key];
          });
          setEquipmentData(customData);
        }
        
        // Load custom simulations count
        if (userDoc.data().customSimulationsCount) {
          setCustomSimulationsCount(userDoc.data().customSimulationsCount);
        }
      } else {
        // Create user document if it doesn't exist
        await db.collection('users').doc(user.uid).set({
          simulatorEquipments: [],
          customEquipment: {},
          customSimulationsCount: 0
        });
      }
    } catch (error) {
      console.error("Error loading user equipment: ", error);
    } finally {
      setLoading(false);
    }
  };

  const saveUserEquipmentData = async (newEquipmentList) => {
    try {
      const user = auth().currentUser;
      if (!user) return;

      await db.collection('users').doc(user.uid).update({
        simulatorEquipments: newEquipmentList
      });
    } catch (error) {
      console.error("Error saving equipment data: ", error);
    }
  };

  if (!fontsLoaded || loading) {
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
      label: equipmentData[equipmentType].label,
      quantity: parseInt(quantity),
      usageHours: parseInt(usageHours),
      consumption: equipmentData[equipmentType].consumption,
    };

    const newEquipmentList = [...equipments, newEquipment];
    setEquipments(newEquipmentList);
    saveUserEquipmentData(newEquipmentList);
    setQuantity('');
    setUsageHours('');
  };

  const handleCustomEquipmentAdd = async () => {
    const newErrors = {};

    if (!customEquipmentName.trim()) newErrors.name = 'Nome é obrigatório';
    if (!customEquipmentConsumption) newErrors.consumption = 'Consumo é obrigatório';
    else if (isNaN(parseFloat(customEquipmentConsumption))) newErrors.consumption = 'Consumo deve ser um número';

    if (Object.keys(newErrors).length > 0) {
      setCustomEquipmentErrors(newErrors);
      return;
    }

    try {
      const user = auth().currentUser;
      if (!user) return;

      // Create a unique key for the new equipment
      const customKey = `Custom_${Date.now()}`;
      
      // Create custom equipment object
      const newEquipment = {
        label: customEquipmentName,
        consumption: parseFloat(customEquipmentConsumption),
      };
      
      // Get current user document
      const userRef = db.collection('users').doc(user.uid);
      const userDoc = await userRef.get();
      
      // Update user document with new custom equipment
      if (userDoc.exists) {
        const userData = userDoc.data();
        const customEquipment = userData.customEquipment || {};
        
        // Update equipment
        customEquipment[customKey] = newEquipment;
        
        // Increment custom simulations count
        const newCount = (userData.customSimulationsCount || 0) + 1;
        
        await userRef.update({
          customEquipment: customEquipment,
          customSimulationsCount: newCount
        });
        
        // Update local state
        setCustomSimulationsCount(newCount);
        
        // Check for achievement
        checkAchievements(newCount);
      } else {
        await userRef.set({
          customEquipment: { [customKey]: newEquipment },
          customSimulationsCount: 1
        });
        setCustomSimulationsCount(1);
      }
      
      // Add to equipment data
      const updatedEquipmentData = {
        ...equipmentData,
        [customKey]: newEquipment
      };

      setEquipmentData(updatedEquipmentData);
      setEquipmentType(customKey); // Select the newly added equipment
      setCustomDialogVisible(false);
      setCustomEquipmentName('');
      setCustomEquipmentConsumption('');
      setCustomEquipmentErrors({});
    } catch (error) {
      console.error("Error adding custom equipment: ", error);
    }
  };

  const checkAchievements = async (simulationsCount) => {
    try {
      const user = auth().currentUser;
      if (!user) return;

      const userRef = db.collection('users').doc(user.uid);
      const userDoc = await userRef.get();
      
      if (!userDoc.exists) return;
      
      const userData = userDoc.data();
      const userAchievements = userData.badges || [];

      // Check if user already has the achievement
      const hasAchievement = userAchievements.some(badge => badge.id === SIMULATOR_MASTER.id);
      
      // If user doesn't have achievement and meets the requirement
      if (!hasAchievement && simulationsCount >= SIMULATOR_MASTER.requiredSimulations) {
        // Add achievement to user profile
        const updatedBadges = [
          ...userAchievements,
          {
            id: SIMULATOR_MASTER.id,
            name: SIMULATOR_MASTER.name,
            icon: SIMULATOR_MASTER.icon,
            description: SIMULATOR_MASTER.description
          }
        ];
        
        // Update XP
        const currentXp = userData.xp || 0;
        const newXp = currentXp + SIMULATOR_MASTER.xpReward;
        
        // Update user document
        await userRef.update({
          badges: updatedBadges,
          xp: newXp
        });
        
        // Show achievement dialog
        setAchievementEarned(SIMULATOR_MASTER);
        scaleAnim.setValue(0.5);
        opacityAnim.setValue(0);
        setShowAchievementDialog(true);
        animateAchievement();
      }
    } catch (error) {
      console.error("Error checking achievements:", error);
    }
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
    saveUserEquipmentData([]);
    setTotalConsumption(0);
    setTotalCost(0);
  };

  const handleRemoveEquipment = (index) => {
    const newEquipments = [...equipments];
    newEquipments.splice(index, 1);
    setEquipments(newEquipments);
    saveUserEquipmentData(newEquipments);
  };

  return (
    <Provider theme={theme}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Card do Formulário */}
        <Card style={styles.card}>
          <Card.Content>
            {/* Tipo de Equipamento */}
            <View style={styles.equipmentSelectionContainer}>
              <Text style={styles.label}>Tipo de Equipamento</Text>
              <Button 
                mode="text" 
                onPress={() => setCustomDialogVisible(true)}
                icon="plus-circle" 
                textColor="#FFC107"
                style={styles.addCustomButton}
              >
                Adicionar novo
              </Button>
            </View>
            
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={equipmentType}
                style={styles.picker}
                onValueChange={(itemValue) => setEquipmentType(itemValue)}
                dropdownIconColor="#FFC107"
              >
                {Object.keys(equipmentData).map((key) => (
                  <Picker.Item key={key} label={equipmentData[key].label} value={key} />
                ))}
              </Picker>
            </View>

            {/* Info de consumo */}
            <Text style={styles.consumptionInfo}>
              Consumo: {equipmentData[equipmentType].consumption} kWh
            </Text>

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
                  description={`${equipment.usageHours} horas/dia - ${equipment.consumption.toFixed(2)} kWh`}
                  left={() => <List.Icon icon="lightbulb" color="#FFC107" />}
                  right={() => (
                    <Button 
                      icon="delete" 
                      textColor="#FF5252" 
                      onPress={() => handleRemoveEquipment(index)}
                    />
                  )}
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

        {/* Dialog para adicionar equipamento personalizado */}
        <Portal>
          <Dialog 
            visible={customDialogVisible} 
            onDismiss={() => setCustomDialogVisible(false)}
            style={{ backgroundColor: '#FFFFFF' }}
          >
            <Dialog.Title style={{ fontFamily: 'Poppins_700Bold' }}>Adicionar equipamento</Dialog.Title>
            <Dialog.Content>
              <TextInput
                mode="outlined"
                label="Nome do equipamento"
                value={customEquipmentName}
                onChangeText={setCustomEquipmentName}
                style={styles.dialogInput}
                error={!!customEquipmentErrors.name}
                outlineColor="#E0E0E0"
                activeOutlineColor="#FFC107"
              />
              {customEquipmentErrors.name && <Text style={styles.errorText}>{customEquipmentErrors.name}</Text>}
              
              <TextInput
                mode="outlined"
                label="Consumo (kWh)"
                value={customEquipmentConsumption}
                onChangeText={setCustomEquipmentConsumption}
                keyboardType="numeric"
                style={styles.dialogInput}
                error={!!customEquipmentErrors.consumption}
                outlineColor="#E0E0E0"
                activeOutlineColor="#FFC107"
              />
              {customEquipmentErrors.consumption && <Text style={styles.errorText}>{customEquipmentErrors.consumption}</Text>}
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setCustomDialogVisible(false)} textColor="#757575">Cancelar</Button>
              <Button onPress={handleCustomEquipmentAdd} textColor="#FFC107">Adicionar</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
        
        {/* Achievement Dialog */}
        <Portal>
          <Dialog 
            visible={showAchievementDialog} 
            onDismiss={() => setShowAchievementDialog(false)}
            style={[styles.achievementDialog, { backgroundColor: 'transparent' }]}
          >
            {achievementEarned && (
              <Animated.View style={[
                styles.achievementAnimatedContainer,
                {
                  transform: [{ scale: scaleAnim }],
                  opacity: opacityAnim
                }
              ]}>
                <View style={styles.achievementIconContainer}>
                  <MaterialIcons name="emoji-events" size={80} color="#FFC107" />
                </View>
                <Text style={styles.achievementTitle}>Nova Conquista!</Text>
                
                <View style={styles.achievementItem}>
                  <MaterialIcons 
                    name={achievementEarned.icon} 
                    size={36} 
                    color="#FFC107" 
                  />
                  <View style={styles.achievementContent}>
                    <Text style={styles.achievementName}>
                      {achievementEarned.name}
                    </Text>
                    <Text style={styles.achievementDesc}>
                      {achievementEarned.description}
                    </Text>
                    <Text style={styles.achievementXP}>
                      +{achievementEarned.xpReward} XP
                    </Text>
                  </View>
                </View>
                
                <Button 
                  mode="contained" 
                  onPress={() => setShowAchievementDialog(false)}
                  style={styles.achievementButton}
                  buttonColor="#4CAF50"
                  textColor="#FFFFFF"
                >
                  Continuar
                </Button>
              </Animated.View>
            )}
          </Dialog>
        </Portal>
      </ScrollView>
    </Provider>
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
    marginBottom: 8,
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
  equipmentSelectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  addCustomButton: {
    margin: 0,
    padding: 0,
  },
  dialogInput: {
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  consumptionInfo: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#757575',
    marginBottom: 16,
  },
  // Achievement dialog styles
  achievementDialog: {
    backgroundColor: 'transparent',
    elevation: 0,
  },
  achievementAnimatedContainer: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  achievementIconContainer: {
    backgroundColor: '#FFF9E0',
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  achievementTitle: {
    fontSize: 24,
    fontFamily: 'Poppins_700Bold',
    color: '#333',
    marginBottom: 24,
    textAlign: 'center',
  },
  achievementItem: {
    flexDirection: 'row',
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    width: '100%',
  },
  achievementContent: {
    flex: 1,
    marginLeft: 12,
  },
  achievementName: {
    fontSize: 16,
    fontFamily: 'Poppins_700Bold',
    color: '#333',
    marginBottom: 4,
  },
  achievementDesc: {
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    color: '#666',
    marginBottom: 4,
  },
  achievementXP: {
    fontSize: 12,
    fontFamily: 'Poppins_700Bold',
    color: '#4CAF50',
  },
  achievementButton: {
    width: '100%',
    marginTop: 16,
  },
});

export default SimulatorScreen;