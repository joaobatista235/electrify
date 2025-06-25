import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView, Alert, Platform } from 'react-native';
import { Card, Button, TextInput, Dialog, Portal, Provider, ActivityIndicator, IconButton, List } from 'react-native-paper';
import { LineChart } from 'react-native-chart-kit';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { auth, db, firebase } from '../../../firebase/firebaseConfig';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import SummaryCard from '../components/SummaryCard';

const screenWidth = Dimensions.get('window').width;

const KWH_PRICE = 0.75;

const MONTH_NAMES = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
];

export default function DashboardScreen() {
  const [dataPeriod, setDataPeriod] = useState('daily');
  const [loading, setLoading] = useState(true);
  const [consumptionData, setConsumptionData] = useState({
    daily: [],
    weekly: [],
    monthly: []
  });
  const [summaryData, setSummaryData] = useState({
    totalConsumption: 0,
    averagePrice: KWH_PRICE,
    totalPrice: 0,
    estimatedCost: 0,
    current: 0,
  });

  const [consumptionDialogVisible, setConsumptionDialogVisible] = useState(false);
  const [newConsumption, setNewConsumption] = useState('');
  const [consumptionError, setConsumptionError] = useState('');

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);

  const [monthsList] = useState([
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ]);

  const [yearsList] = useState(() => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 5; i <= currentYear; i++) {
      years.push(i);
    }
    return years;
  });

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });

  useEffect(() => {
    loadUserConsumptionData();
  }, []);

  const loadUserConsumptionData = async () => {
    try {
      setLoading(true);
      const user = auth().currentUser;
      if (!user) {
        setLoading(false);
        return;
      }

      const userDoc = await db.collection('users').doc(user.uid).get();

      if (userDoc.exists && userDoc.data().consumption) {
        const consumption = userDoc.data().consumption;

        const processedData = processConsumptionData(consumption);
        setConsumptionData(processedData);

        const summary = calculateSummary(consumption);
        setSummaryData(summary);
      } else {
        const initialData = {
          consumption: []
        };

        if (!userDoc.exists) {
          await db.collection('users').doc(user.uid).set(initialData);
        } else {
          await db.collection('users').doc(user.uid).update(initialData);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar dados de consumo:', error);
      Alert.alert('Erro', 'Não foi possível carregar seus dados de consumo.');
    } finally {
      setLoading(false);
    }
  };

  const processConsumptionData = (consumption) => {
    const sortedData = [...consumption].sort((a, b) => b.timestamp.toDate() - a.timestamp.toDate());

    const dailyData = getDailyData(sortedData);

    const weeklyData = getWeeklyData(sortedData);

    const monthlyData = getMonthlyData(sortedData);

    return {
      daily: dailyData,
      weekly: weeklyData,
      monthly: monthlyData
    };
  };

  const getDailyData = (data) => {
    const now = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);

    const filteredData = data.filter(item => {
      const date = item.timestamp.toDate();
      return date >= sevenDaysAgo;
    });

    const dailyMap = {};
    const labels = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
      labels.push(dateStr.split('/')[0]);
      dailyMap[dateStr] = 0;
    }

    filteredData.forEach(item => {
      const date = item.timestamp.toDate();
      const dateStr = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });

      if (dailyMap[dateStr] !== undefined) {
        dailyMap[dateStr] += item.kwh;
      }
    });

    return {
      labels,
      values: Object.values(dailyMap)
    };
  };

  const getWeeklyData = (data) => {
    const now = new Date();
    const fourWeeksAgo = new Date();
    fourWeeksAgo.setDate(now.getDate() - 28);

    const filteredData = data.filter(item => {
      const date = item.timestamp.toDate();
      return date >= fourWeeksAgo;
    });

    const weeklyMap = {};
    const labels = [];

    for (let i = 3; i >= 0; i--) {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - (i * 7 + 6));

      const weekLabel = `S${4 - i}`;
      labels.push(weekLabel);

      const dateKey = startDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
      weeklyMap[dateKey] = 0;
    }

    filteredData.forEach(item => {
      const date = item.timestamp.toDate();
      const weekIndex = Math.floor((now - date) / (7 * 24 * 60 * 60 * 1000));

      if (weekIndex >= 0 && weekIndex < 4) {
        const dateKeys = Object.keys(weeklyMap);
        if (dateKeys[weekIndex]) {
          weeklyMap[dateKeys[weekIndex]] += item.kwh;
        }
      }
    });

    return {
      labels,
      values: Object.values(weeklyMap)
    };
  };

  const getMonthlyData = (data) => {
    const now = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(now.getMonth() - 6);

    const filteredData = data.filter(item => {
      const date = item.timestamp.toDate();
      return date >= sixMonthsAgo;
    });

    const monthlyMap = {};
    const labels = [];
    const valuesList = [];

    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthName = MONTH_NAMES[date.getMonth()];

      const monthKey = date.toLocaleDateString('pt-BR', { month: '2-digit', year: 'numeric' });

      labels.push(monthName);
      monthlyMap[monthKey] = 0;
    }

    filteredData.forEach(item => {
      const date = item.timestamp.toDate();
      const monthKey = date.toLocaleDateString('pt-BR', { month: '2-digit', year: 'numeric' });

      if (monthlyMap[monthKey] !== undefined) {
        monthlyMap[monthKey] += item.kwh;
      }
    });

    Object.keys(monthlyMap).forEach(key => {
      valuesList.push(monthlyMap[key]);
    });

    return {
      labels,
      values: valuesList
    };
  };

  const calculateSummary = (consumption) => {
    if (!consumption || consumption.length === 0) {
      return {
        totalConsumption: 0,
        averagePrice: KWH_PRICE,
        totalPrice: 0,
        estimatedCost: 0,
        current: 0,
      };
    }

    const sortedData = [...consumption].sort((a, b) => b.timestamp.toDate() - a.timestamp.toDate());

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentConsumption = sortedData.filter(item => {
      const date = item.timestamp.toDate();
      return date >= thirtyDaysAgo;
    });

    const totalConsumption = recentConsumption.reduce((total, item) => total + item.kwh, 0);
    const totalPrice = totalConsumption * KWH_PRICE;

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const currentMonthData = sortedData.filter(item => {
      const date = item.timestamp.toDate();
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });

    const currentMonthConsumption = currentMonthData.reduce((total, item) => total + item.kwh, 0);

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysPassed = Math.min(now.getDate(), daysInMonth);

    const estimatedMonthlyConsumption = (currentMonthConsumption / daysPassed) * daysInMonth;
    const estimatedCost = estimatedMonthlyConsumption * KWH_PRICE;

    return {
      totalConsumption,
      averagePrice: KWH_PRICE,
      totalPrice,
      estimatedCost,
      current: currentMonthConsumption,
    };
  };

  const formatDisplayDate = (date) => {
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const selectDay = (day) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(day);
    setSelectedDate(newDate);
    setShowDatePicker(false);
  };

  const selectMonth = (month) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(month);
    setSelectedDate(newDate);
    setShowMonthPicker(false);

    setShowDatePicker(true);
  };

  const selectYear = (year) => {
    const newDate = new Date(selectedDate);
    newDate.setFullYear(year);
    setSelectedDate(newDate);
    setShowYearPicker(false);

    setShowMonthPicker(true);
  };

  const getDaysInMonth = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const openDatePicker = () => {
    setShowYearPicker(true);
  };

  const handleAddConsumption = async () => {
    setConsumptionError('');

    // Validar entrada
    if (!newConsumption || isNaN(parseFloat(newConsumption))) {
      setConsumptionError('Insira um valor válido');
      return;
    }

    const consumptionValue = parseFloat(newConsumption);
    if (consumptionValue <= 0) {
      setConsumptionError('O valor deve ser maior que zero');
      return;
    }

    try {
      const user = auth().currentUser;
      if (!user) return;

      const adjustedDate = new Date(selectedDate);
      adjustedDate.setHours(12, 0, 0, 0);

      const timestamp = firebase.firestore.Timestamp.fromDate(adjustedDate);

      const newEntry = {
        kwh: consumptionValue,
        timestamp: timestamp
      };

      const userRef = db.collection('users').doc(user.uid);
      const userDoc = await userRef.get();

      if (userDoc.exists) {
        const userData = userDoc.data();
        const consumption = userData.consumption || [];
        consumption.push(newEntry);

        await userRef.update({
          consumption: consumption
        });
      } else {
        await userRef.set({
          consumption: [newEntry]
        });
      }

      setConsumptionDialogVisible(false);
      setNewConsumption('');
      setSelectedDate(new Date());
      setShowDatePicker(false);

      await loadUserConsumptionData();

      Alert.alert('Sucesso', 'Consumo registrado com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar consumo:', error);
      Alert.alert('Erro', 'Não foi possível registrar o consumo. Tente novamente.');
    }
  };

  const handlePeriodChange = (period) => {
    setDataPeriod(period);
  };

  if (!fontsLoaded || loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFC107" />
      </View>
    );
  }

  const chartData = {
    labels: consumptionData[dataPeriod].labels || [],
    datasets: [
      {
        data: consumptionData[dataPeriod].values || [0],
        color: (opacity = 1) => `rgba(255, 193, 7, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const getLegendText = () => {
    switch (dataPeriod) {
      case 'daily':
        return 'Dia do mês';
      case 'weekly':
        return 'Semana';
      case 'monthly':
        return 'Mês';
      default:
        return '';
    }
  };

  return (
    <Provider>
      <ScrollView style={styles.container}>
        {/* Card de Resumo */}
        <SummaryCard data={summaryData} />

        {/* Card do Gráfico e Tabs */}
        <Card style={styles.chartCard}>
          <Card.Content>
            <Text style={styles.chartTitle}>
              Consumo de Energia
              {/* Botão de adicionar consumo */}
              <View style={styles.addButtonContainer}>
                <Button
                  mode="contained"
                  icon="plus"
                  onPress={() => setConsumptionDialogVisible(true)}
                  style={styles.addButton}
                  buttonColor="#FFC107"
                  textColor="#FFFFFF"
                >
                  Adicionar
                </Button>
              </View>
            </Text>

            {/* Tabs de Período */}
            <View style={styles.tabsContainer}>
              <TouchableOpacity
                style={[styles.tabButton, dataPeriod === 'daily' && styles.activeTab]}
                onPress={() => handlePeriodChange('daily')}
              >
                <Text style={[styles.tabText, dataPeriod === 'daily' && styles.activeTabText]}>Diário</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tabButton, dataPeriod === 'weekly' && styles.activeTab]}
                onPress={() => handlePeriodChange('weekly')}
              >
                <Text style={[styles.tabText, dataPeriod === 'weekly' && styles.activeTabText]}>Semanal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tabButton, dataPeriod === 'monthly' && styles.activeTab]}
                onPress={() => handlePeriodChange('monthly')}
              >
                <Text style={[styles.tabText, dataPeriod === 'monthly' && styles.activeTabText]}>Mensal</Text>
              </TouchableOpacity>
            </View>

            {/* Mensagem se não houver dados */}
            {(chartData.datasets[0].data.length === 0 || chartData.datasets[0].data.every(val => val === 0)) ? (
              <View style={styles.noDataContainer}>
                <Icon name="chart-line" size={50} color="#E0E0E0" />
                <Text style={styles.noDataText}>Nenhum dado de consumo registrado</Text>
                <Text style={styles.noDataSubText}>Adicione seu consumo para começar a visualizar</Text>
              </View>
            ) : (
              /* Gráfico de Consumo */
              <View style={styles.chartContainer}>
                <LineChart
                  data={chartData}
                  width={screenWidth - 40}
                  height={220}
                  chartConfig={{
                    backgroundColor: '#FFFFFF',
                    backgroundGradientFrom: '#FFFFFF',
                    backgroundGradientTo: '#FFFFFF',
                    decimalPlaces: 1,
                    color: (opacity = 1) => `rgba(255, 193, 7, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    style: {
                      borderRadius: 8,
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
                    // Ajustar tamanho da fonte para labels mais curtos
                    labelFontSize: 12,
                  }}
                  bezier
                  style={styles.chart}
                  yAxisSuffix=" kWh"
                  fromZero
                />
              </View>
            )}

            {/* Legenda */}
            <View style={styles.legendContainer}>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: '#FFC107' }]} />
                <Text style={styles.legendText}>Consumo em kWh</Text>
              </View>
              <Text style={styles.legendText}>{getLegendText()}</Text>
            </View>
          </Card.Content>
        </Card>

        {/* Card de Dicas (opcional) */}
        <Card style={styles.tipsCard}>
          <Card.Content>
            <Text style={styles.tipsTitle}>Dicas de Economia</Text>
            <View style={styles.tipItem}>
              <Icon name="lightbulb-outline" size={24} color="#FFC107" style={styles.tipIcon} />
              <Text style={styles.tipText}>Substitua lâmpadas incandescentes por LED para economizar até 80% de energia</Text>
            </View>
            <View style={styles.tipItem}>
              <Icon name="air-conditioner" size={24} color="#FFC107" style={styles.tipIcon} />
              <Text style={styles.tipText}>Mantenha a temperatura do ar-condicionado entre 23°C e 25°C</Text>
            </View>
            <View style={styles.tipItem}>
              <Icon name="power-plug-off" size={24} color="#FFC107" style={styles.tipIcon} />
              <Text style={styles.tipText}>Desligue aparelhos da tomada quando não estiverem em uso</Text>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Dialog para adicionar consumo */}
      <Portal>
        <Dialog visible={consumptionDialogVisible} onDismiss={() => setConsumptionDialogVisible(false)} style={[styles.dialog, { backgroundColor: '#FFFFFF' }]}>
          <Dialog.Title style={styles.dialogTitle}>Registrar Consumo</Dialog.Title>
          <Dialog.Content>
            {/* Seletor de data */}
            <Text style={styles.dialogSubtitle}>Data do consumo:</Text>
            <TouchableOpacity
              onPress={openDatePicker}
              style={styles.datePickerContainer}
              activeOpacity={0.7}
            >
              <Text style={styles.dateDisplay}>{formatDisplayDate(selectedDate)}</Text>
              <IconButton
                icon="calendar"
                size={24}
                iconColor="#FFC107"
              />
            </TouchableOpacity>

            {/* Custom DatePicker usando React Native Paper */}
            <Portal>
              {/* Seletor de Ano */}
              <Dialog visible={showYearPicker} onDismiss={() => setShowYearPicker(false)} style={{ backgroundColor: '#FFFFFF' }}>
                <Dialog.Title style={styles.dialogTitle}>Selecione o Ano</Dialog.Title>
                <Dialog.Content>
                  <ScrollView style={styles.datePickerScrollView}>
                    {yearsList.map((year) => (
                      <List.Item
                        key={year}
                        title={year.toString()}
                        onPress={() => selectYear(year)}
                        style={selectedDate.getFullYear() === year ? styles.selectedDateItem : null}
                        titleStyle={[
                          { color: '#333333', fontFamily: 'Poppins_400Regular' },
                          selectedDate.getFullYear() === year ? styles.selectedDateItemText : null
                        ]}
                      />
                    ))}
                  </ScrollView>
                </Dialog.Content>
                <Dialog.Actions>
                  <Button onPress={() => setShowYearPicker(false)} textColor="#757575">Cancelar</Button>
                </Dialog.Actions>
              </Dialog>

              {/* Seletor de Mês */}
              <Dialog visible={showMonthPicker} onDismiss={() => setShowMonthPicker(false)} style={{ backgroundColor: '#FFFFFF' }}>
                <Dialog.Title style={styles.dialogTitle}>Selecione o Mês</Dialog.Title>
                <Dialog.Content>
                  <ScrollView style={styles.datePickerScrollView}>
                    {monthsList.map((month, index) => (
                      <List.Item
                        key={index}
                        title={month}
                        onPress={() => selectMonth(index)}
                        style={selectedDate.getMonth() === index ? styles.selectedDateItem : null}
                        titleStyle={[
                          { color: '#333333', fontFamily: 'Poppins_400Regular' },
                          selectedDate.getMonth() === index ? styles.selectedDateItemText : null
                        ]}
                      />
                    ))}
                  </ScrollView>
                </Dialog.Content>
                <Dialog.Actions>
                  <Button onPress={() => setShowMonthPicker(false)} textColor="#757575">Cancelar</Button>
                </Dialog.Actions>
              </Dialog>

              {/* Seletor de Dia */}
              <Dialog visible={showDatePicker} onDismiss={() => setShowDatePicker(false)} style={{ backgroundColor: '#FFFFFF' }}>
                <Dialog.Title style={styles.dialogTitle}>Selecione o Dia</Dialog.Title>
                <Dialog.Content>
                  <ScrollView style={styles.datePickerScrollView}>
                    <View style={styles.daysContainer}>
                      {getDaysInMonth().map((day) => (
                        <TouchableOpacity
                          key={day}
                          style={[
                            styles.dayButton,
                            selectedDate.getDate() === day ? styles.selectedDayButton : null
                          ]}
                          onPress={() => selectDay(day)}
                        >
                          <Text
                            style={[
                              styles.dayButtonText,
                              selectedDate.getDate() === day ? styles.selectedDayButtonText : null
                            ]}
                          >
                            {day}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </ScrollView>
                </Dialog.Content>
                <Dialog.Actions>
                  <Button onPress={() => setShowDatePicker(false)} textColor="#757575">Cancelar</Button>
                </Dialog.Actions>
              </Dialog>
            </Portal>

            {/* Input de consumo */}
            <Text style={styles.dialogSubtitle}>Informe o consumo em kWh:</Text>
            <TextInput
              mode="outlined"
              label="Consumo (kWh)"
              value={newConsumption}
              onChangeText={setNewConsumption}
              keyboardType="numeric"
              style={[styles.input, { color: '#333333' }]}
              inputStyle={{ color: '#333333' }}
              error={!!consumptionError}
              outlineColor="#E0E0E0"
              activeOutlineColor="#FFC107"
              theme={{
                colors: {
                  text: '#333333',
                  placeholder: '#757575'
                }
              }}
            />
            {consumptionError ? <Text style={styles.errorText}>{consumptionError}</Text> : null}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => {
              setConsumptionDialogVisible(false);
              setShowDatePicker(false);
              setShowMonthPicker(false);
              setShowYearPicker(false);
            }} textColor="#757575">Cancelar</Button>
            <Button onPress={handleAddConsumption} textColor="#FFC107">Registrar</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  addButtonContainer: {
    marginBottom: 0,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  addButton: {
    borderRadius: 20,
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    padding: 16,
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 18,
    fontFamily: 'Poppins_700Bold',
    color: '#333333',
    marginBottom: 16,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    marginBottom: 16,
  },
  tabButton: {
    paddingBottom: 8,
    paddingHorizontal: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#FFC107',
  },
  tabText: {
    fontSize: 16,
    color: '#666666',
    fontFamily: 'Poppins_400Regular',
  },
  activeTabText: {
    color: '#FFC107',
    fontFamily: 'Poppins_700Bold',
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: 8,
    width: '100%',
  },
  chart: {
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  legendContainer: {
    flexDirection: 'row',
    marginTop: 8,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: '#666666',
    fontFamily: 'Poppins_400Regular',
  },
  tipsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    marginBottom: 16,
  },
  tipsTitle: {
    fontSize: 18,
    fontFamily: 'Poppins_700Bold',
    color: '#333333',
    marginBottom: 16,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  tipIcon: {
    marginRight: 8,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#666666',
    fontFamily: 'Poppins_400Regular',
  },
  dialog: {
    backgroundColor: '#FFFFFF',
  },
  dialogTitle: {
    fontFamily: 'Poppins_700Bold',
    color: '#333333',
  },
  dialogSubtitle: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
    fontFamily: 'Poppins_400Regular',
  },
  input: {
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 12,
    color: '#FF5252',
    marginTop: 4,
    fontFamily: 'Poppins_400Regular',
  },
  noDataContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    height: 220,
  },
  noDataText: {
    fontSize: 16,
    fontFamily: 'Poppins_700Bold',
    color: '#666666',
    marginTop: 16,
  },
  noDataSubText: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#999999',
    marginTop: 8,
    textAlign: 'center',
  },
  datePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingLeft: 12,
    marginBottom: 16,
  },
  dateDisplay: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    color: '#333333',
  },

  // Novos estilos para o DatePicker personalizado
  datePickerScrollView: {
    maxHeight: 250,
    color: 'black',
  },
  selectedDateItem: {
    backgroundColor: '#FFF9E0',
    borderRadius: 8,
  },
  selectedDateItemText: {
    color: '#FFC107',
    fontFamily: 'Poppins_700Bold',
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  dayButton: {
    width: '18%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    margin: '1%',
  },
  selectedDayButton: {
    backgroundColor: '#FFC107',
  },
  dayButtonText: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'Poppins_400Regular',
  },
  selectedDayButtonText: {
    color: '#FFF',
    fontFamily: 'Poppins_700Bold',
  },
});