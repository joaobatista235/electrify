import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import DashboardScreen from '../dashboard/screens/DashboardScreen';
import SimulatorScreen from '../simulator/screens/SimulatorScreen';
import ProfileScreen from '../profile/screens/ProfileScreen';
import TipsScreen from '../tips/screens/TipsScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HelpScreen } from '../help';

const Tab = createBottomTabNavigator();
const ProfileStack = createNativeStackNavigator();

// Navegador de pilha para a seção de perfil
const ProfileStackScreen = () => {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="ProfileMain" component={ProfileScreen} />
      <ProfileStack.Screen name="Help" component={HelpScreen} />
    </ProfileStack.Navigator>
  );
};

export default function MainTabs() {
    return (
        <Tab.Navigator
            initialRouteName="Início"
            screenOptions={{
                tabBarActiveTintColor: '#FFC107',
                tabBarInactiveTintColor: '#808080',
                tabBarStyle: styles.tabBar,
                headerShown: true,
                tabBarShowLabel: true,
                tabBarLabelStyle: { fontSize: 12, fontWeight: 'bold' },
            }}
        >
            <Tab.Screen
                name="Início"
                component={DashboardScreen}
                options={{
                    tabBarLabel: 'Início',
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="home" size={size} color={color} />
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
            <Tab.Screen
                name="Economia"
                component={TipsScreen}
                options={{
                    tabBarLabel: 'Economia',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="eco" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Perfil"
                component={ProfileStackScreen}
                options={{
                    tabBarLabel: 'Perfil',
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="user" size={size} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: '#FFFFFF',
        borderTopWidth: 0,
        height: 70,
        paddingBottom: 5,
        paddingTop: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 10,
        borderRadius: 15,
    },
});