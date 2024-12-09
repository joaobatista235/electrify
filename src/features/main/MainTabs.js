import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashboardScreen from '../dashboard/screens/DashboardScreen';
import SimulatorScreen from '../simulator/screens/SimulatorScreen';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
    return (
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
            <Tab.Screen
                name="Dashboard"
                component={DashboardScreen}
                options={{
                    tabBarLabel: 'Dashboard',
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="dashboard" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Simulador"
                component={SimulatorScreen}
                options={{
                    tabBarLabel: 'Simulador',
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="calculator" size={size} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}
