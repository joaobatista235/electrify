import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { MaterialIcons, FontAwesome5 } from 'react-native-vector-icons';

const { width } = Dimensions.get('window');

const HelpScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  const tabs = [
    { title: 'Bandeiras Tarifárias', icon: 'flag' },
    { title: 'Meu Consumo', icon: 'bolt' }
  ];

  const renderBandeirasContent = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>O que são Bandeiras Tarifárias?</Text>
        <Text style={styles.sectionText}>
          O sistema de bandeiras tarifárias foi criado para indicar se haverá ou não acréscimo no valor da energia a ser repassada ao consumidor final, em função das condições de geração de eletricidade.
        </Text>
      </View>

      <View style={styles.bandeiraTipoContainer}>
        <View style={styles.bandeiraItem}>
          <View style={[styles.bandeiraCor, { backgroundColor: '#4CAF50' }]} />
          <View style={styles.bandeiraInfo}>
            <Text style={styles.bandeiraTitulo}>Bandeira Verde</Text>
            <Text style={styles.bandeiraDescricao}>
              Condições favoráveis de geração de energia. Não há acréscimo na tarifa.
            </Text>
          </View>
        </View>

        <View style={styles.bandeiraItem}>
          <View style={[styles.bandeiraCor, { backgroundColor: '#FFC107' }]} />
          <View style={styles.bandeiraInfo}>
            <Text style={styles.bandeiraTitulo}>Bandeira Amarela</Text>
            <Text style={styles.bandeiraDescricao}>
              Condições menos favoráveis. Acréscimo de R$ 1,874 para cada 100 kWh consumidos.
            </Text>
          </View>
        </View>

        <View style={styles.bandeiraItem}>
          <View style={[styles.bandeiraCor, { backgroundColor: '#F44336' }]} />
          <View style={styles.bandeiraInfo}>
            <Text style={styles.bandeiraTitulo}>Bandeira Vermelha - Patamar 1</Text>
            <Text style={styles.bandeiraDescricao}>
              Condições mais custosas. Acréscimo de R$ 3,971 para cada 100 kWh consumidos.
            </Text>
          </View>
        </View>

        <View style={styles.bandeiraItem}>
          <View style={[styles.bandeiraCor, { backgroundColor: '#B71C1C' }]} />
          <View style={styles.bandeiraInfo}>
            <Text style={styles.bandeiraTitulo}>Bandeira Vermelha - Patamar 2</Text>
            <Text style={styles.bandeiraDescricao}>
              Condições ainda mais custosas. Acréscimo de R$ 9,795 para cada 100 kWh consumidos.
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Como Economizar</Text>
        <Text style={styles.sectionText}>
          Em períodos de bandeira amarela ou vermelha, é ainda mais importante economizar energia. Algumas dicas:
        </Text>
        <View style={styles.dicaItem}>
          <MaterialIcons name="lightbulb" size={24} color="#FFC107" style={styles.dicaIcon} />
          <Text style={styles.dicaTexto}>Substitua lâmpadas comuns por LED.</Text>
        </View>
        <View style={styles.dicaItem}>
          <MaterialIcons name="ac-unit" size={24} color="#FFC107" style={styles.dicaIcon} />
          <Text style={styles.dicaTexto}>Mantenha o ar-condicionado em 23ºC.</Text>
        </View>
        <View style={styles.dicaItem}>
          <MaterialIcons name="wash" size={24} color="#FFC107" style={styles.dicaIcon} />
          <Text style={styles.dicaTexto}>Use a máquina de lavar com carga completa.</Text>
        </View>
        <View style={styles.dicaItem}>
          <MaterialIcons name="outlet" size={24} color="#FFC107" style={styles.dicaIcon} />
          <Text style={styles.dicaTexto}>Desligue aparelhos em modo de espera.</Text>
        </View>
      </View>
    </ScrollView>
  );

  const renderConsumoContent = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Como Entender Seu Consumo</Text>
        <Text style={styles.sectionText}>
          O aplicativo Electrify oferece várias formas de visualizar e entender seu consumo de energia:
        </Text>
      </View>

      <View style={styles.featureContainer}>
        <View style={styles.featureItem}>
          <View style={styles.featureIconContainer}>
            <MaterialIcons name="dashboard" size={32} color="#FFC107" />
          </View>
          <View style={styles.featureInfo}>
            <Text style={styles.featureTitulo}>Dashboard</Text>
            <Text style={styles.featureDescricao}>
              Na tela inicial, você tem acesso a gráficos que mostram seu consumo diário, semanal e mensal.
            </Text>
          </View>
        </View>

        <View style={styles.featureItem}>
          <View style={styles.featureIconContainer}>
            <MaterialIcons name="add-chart" size={32} color="#FFC107" />
          </View>
          <View style={styles.featureInfo}>
            <Text style={styles.featureTitulo}>Adicionar Consumo</Text>
            <Text style={styles.featureDescricao}>
              Clique no botão "+" na tela inicial para registrar suas leituras de consumo de energia.
            </Text>
          </View>
        </View>

        <View style={styles.featureItem}>
          <View style={styles.featureIconContainer}>
            <MaterialIcons name="calculate" size={32} color="#FFC107" />
          </View>
          <View style={styles.featureInfo}>
            <Text style={styles.featureTitulo}>Simulador</Text>
            <Text style={styles.featureDescricao}>
              Use o simulador para calcular o consumo individual de seus eletrodomésticos e ver seu impacto na conta.
            </Text>
          </View>
        </View>

        <View style={styles.featureItem}>
          <View style={styles.featureIconContainer}>
            <MaterialIcons name="trending-down" size={32} color="#FFC107" />
          </View>
          <View style={styles.featureInfo}>
            <Text style={styles.featureTitulo}>Dicas de Economia</Text>
            <Text style={styles.featureDescricao}>
              Na aba "Economia", encontre sugestões personalizadas para reduzir seu consumo de energia.
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Como Interpretar a Conta de Luz</Text>
        <Text style={styles.sectionText}>
          Sua conta de luz contém informações importantes sobre seu consumo:
        </Text>
        <View style={styles.contaLuzItem}>
          <Text style={styles.contaLuzTitulo}>kWh Total:</Text>
          <Text style={styles.contaLuzDescricao}>
            Quantidade total de energia consumida no mês.
          </Text>
        </View>
        <View style={styles.contaLuzItem}>
          <Text style={styles.contaLuzTitulo}>Valor (R$):</Text>
          <Text style={styles.contaLuzDescricao}>
            Custo total, incluindo consumo, taxas e impostos.
          </Text>
        </View>
        <View style={styles.contaLuzItem}>
          <Text style={styles.contaLuzTitulo}>Histórico:</Text>
          <Text style={styles.contaLuzDescricao}>
            Gráfico comparativo com meses anteriores.
          </Text>
        </View>
        <View style={styles.contaLuzItem}>
          <Text style={styles.contaLuzTitulo}>Bandeira:</Text>
          <Text style={styles.contaLuzDescricao}>
            Bandeira tarifária aplicada no período.
          </Text>
        </View>
      </View>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Informações</Text>
      </View>

      <View style={styles.tabsContainer}>
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.tabButton,
              index === activeTab ? styles.activeTabButton : null
            ]}
            onPress={() => setActiveTab(index)}
          >
            <MaterialIcons 
              name={tab.icon} 
              size={24} 
              color={index === activeTab ? "#FFC107" : "#888"}
            />
            <Text 
              style={[
                styles.tabButtonText,
                index === activeTab ? styles.activeTabText : null
              ]}
            >
              {tab.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {activeTab === 0 ? renderBandeirasContent() : renderConsumoContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    marginLeft: 16,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    fontFamily: 'Poppins_700Bold',
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: '#FFC107',
  },
  tabButtonText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#888888',
    fontFamily: 'Poppins_400Regular',
  },
  activeTabText: {
    color: '#333333',
    fontWeight: 'bold',
    fontFamily: 'Poppins_700Bold',
  },
  tabContent: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333333',
    fontFamily: 'Poppins_700Bold',
  },
  sectionText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#666666',
    fontFamily: 'Poppins_400Regular',
  },
  bandeiraTipoContainer: {
    marginBottom: 24,
  },
  bandeiraItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    padding: 12,
  },
  bandeiraCor: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 12,
  },
  bandeiraInfo: {
    flex: 1,
  },
  bandeiraTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333333',
    fontFamily: 'Poppins_700Bold',
  },
  bandeiraDescricao: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'Poppins_400Regular',
  },
  dicaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  dicaIcon: {
    marginRight: 12,
  },
  dicaTexto: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'Poppins_400Regular',
  },
  featureContainer: {
    marginBottom: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    padding: 12,
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F3F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  featureInfo: {
    flex: 1,
  },
  featureTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333333',
    fontFamily: 'Poppins_700Bold',
  },
  featureDescricao: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'Poppins_400Regular',
  },
  contaLuzItem: {
    marginTop: 8,
  },
  contaLuzTitulo: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
    fontFamily: 'Poppins_700Bold',
  },
  contaLuzDescricao: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'Poppins_400Regular',
  },
});

export default HelpScreen; 