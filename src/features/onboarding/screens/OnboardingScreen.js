import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { CommonActions } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const OnboardingScreen = ({ navigation }) => {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });

  const handleNext = () => {
    if (currentScreen < 2) {
      setCurrentScreen(currentScreen + 1);
    }
  };

  const goToMain = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Main' }],
    });
  };

  if (!fontsLoaded) {
    return null;
  }

  const images = [
    require('../../../assets/images/onboarding/onboarding.png'),
    require('../../../assets/images/onboarding/onboarding2.png'),
    require('../../../assets/images/onboarding/onboarding3.png'),
  ];

  const screens = [
    {
      title: 'Entenda seu impacto',
      description: 'Cada aparelho que você usa consome energia. Conhecer esse consumo é o primeiro passo para economizar —e ajudar o planeta.',
      buttonText: 'Proximo',
      onButtonPress: handleNext,
    },
    {
      title: 'Visualize e simule seu consumo',
      description: 'Com gráficos faceis e uma calculadora inteligente, você acompanha seu uso e descobre onde pode reduzir',
      buttonText: 'Proximo',
      onButtonPress: handleNext,
    },
    {
      title: 'Bandeiras de energia',
      description: 'As cores indicam o custo a energia. O Electrify te mostra o impacto dessas mudanças direta na seu bolso.',
      buttonText: 'Começar',
      onButtonPress: goToMain,
    },
  ];

  const currentScreenData = screens[currentScreen];

  return (
    <SafeAreaView style={styles.container}>
      {/* Botão para pular onboarding */}
      <TouchableOpacity style={styles.skipButton} onPress={goToMain}>
        <Text style={styles.skipButtonText}>Pular</Text>
      </TouchableOpacity>
      
      <View style={styles.content}>
        <View style={styles.imageContainer}>
          <Image 
            source={images[currentScreen]} 
            style={styles.image} 
            resizeMode="contain"
          />
        </View>
        
        <Text style={styles.title}>{currentScreenData.title}</Text>
        
        <Text style={styles.description}>{currentScreenData.description}</Text>
        
        <View style={styles.paginationContainer}>
          {screens.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                index === currentScreen ? styles.paginationDotActive : null,
              ]}
            />
          ))}
        </View>
        
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            if (currentScreen === 2) {
              goToMain();
            } else {
              handleNext();
            }
          }}
        >
          <Text style={styles.buttonText}>{currentScreenData.buttonText}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  imageContainer: {
    width: width * 0.6,
    height: width * 0.6,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333333',
    fontFamily: 'Poppins_700Bold',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666666',
    paddingHorizontal: 20,
    lineHeight: 24,
    marginBottom: 30,
    fontFamily: 'Poppins_400Regular',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 40,
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#CCCCCC',
    marginHorizontal: 5,
  },
  paginationDotActive: {
    backgroundColor: '#000000',
  },
  button: {
    backgroundColor: '#FFC107',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Poppins_700Bold',
  },
  skipButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 10,
  },
  skipButtonText: {
    fontSize: 16,
    color: '#FFC107',
    fontWeight: 'bold',
    fontFamily: 'Poppins_700Bold',
  },
});

export default OnboardingScreen; 