import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashboardScreen from './src/features/dashboard/screens/DashboardScreen';
import SimulatorScreen from './src/features/simulator/screens/SimulatorScreen'; // Importando a tela do simulador
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Dashboard"
        screenOptions={{
          tabBarActiveTintColor: '#4CAF50',
          tabBarInactiveTintColor: '#808080',
          tabBarStyle: {
            backgroundColor: '#ffffff',
            borderTopWidth: 0,
            height: 60,
          },
        }}
      >
        {/* Tela Dashboard */}
        <Tab.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{
            tabBarLabel: 'Dashboard',
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="coffee" size={size} color={color} />
            ),
          }}
        />
        
        {/* Tela Simulador de Consumo */}
        <Tab.Screen
          name="Simulador"
          component={SimulatorScreen}
          options={{
            tabBarLabel: 'Simulador',
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="calculator" size={size} color={color} /> // Ícone do simulador
            ),
          }}
        />
        
      </Tab.Navigator>
    </NavigationContainer>
  );
}
