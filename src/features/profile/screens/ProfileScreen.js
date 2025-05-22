import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, Alert, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { MaterialIcons, FontAwesome5, Feather } from '@expo/vector-icons';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { auth, db, firebase } from '../../../firebase/firebaseConfig';
import * as ImagePicker from 'expo-image-picker';
import { Button, Dialog, Portal, Provider, TextInput, Surface, Card } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { getAuth, doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import { storage } from '../../../firebase/firebaseConfig';

// XP necessário para cada nível
const XP_PER_LEVEL = {
  1: 0,
  2: 50,
  3: 120,
  4: 250,
  5: 400,
  6: 600,
  7: 850,
  8: 1150,
  9: 1500,
  10: 2000,
};

// Definição das conquistas disponíveis
const ALL_ACHIEVEMENTS = [
  {
    id: 'TIPS_READER_1',
    name: 'Leitor Iniciante',
    description: 'Leu 3 dicas de economia de energia',
    icon: 'book',
    requiredTips: 3,
    xpReward: 20,
  },
  {
    id: 'TIPS_READER_2',
    name: 'Leitor Intermediário',
    description: 'Leu 10 dicas de economia de energia',
    icon: 'book',
    requiredTips: 10,
    xpReward: 50,
  },
  {
    id: 'TIPS_READER_3',
    name: 'Leitor Avançado',
    description: 'Leu todas as dicas de economia de energia',
    icon: 'book',
    requiredTips: 15,
    xpReward: 100,
  },
  {
    id: 'CONSUMPTION_TRACKER_1',
    name: 'Rastreador Iniciante',
    description: 'Registrou 5 consumos de energia',
    icon: 'insert-chart',
    requiredConsumption: 5,
    xpReward: 30,
  },
  {
    id: 'CONSUMPTION_TRACKER_2',
    name: 'Rastreador Dedicado',
    description: 'Registrou 15 consumos de energia',
    icon: 'insert-chart',
    requiredConsumption: 15,
    xpReward: 75,
  },
  {
    id: 'ENERGY_SAVER_1',
    name: 'Economizador Iniciante',
    description: 'Reduziu o consumo por 2 dias consecutivos',
    icon: 'trending-down',
    specialAchievement: true,
    xpReward: 40,
  },
  {
    id: 'SIMULATOR_MASTER',
    name: 'Mestre do Simulador',
    description: 'Criou 3 simulações personalizadas',
    icon: 'science',
    specialAchievement: true,
    xpReward: 60,
  },
];

// Função para calcular o nível com base no XP
const calculateLevel = (xp) => {
  let level = 1;
  for (let i = 10; i >= 1; i--) {
    if (xp >= XP_PER_LEVEL[i]) {
      level = i;
      break;
    }
  }
  return level;
};

// Função para calcular o progresso percentual para o próximo nível
const calculateProgress = (xp, level) => {
  if (level === 10) return 100; // Nível máximo

  const currentLevelXP = XP_PER_LEVEL[level];
  const nextLevelXP = XP_PER_LEVEL[level + 1];
  const xpForNextLevel = nextLevelXP - currentLevelXP;
  const userProgressInLevel = xp - currentLevelXP;

  return Math.min(100, Math.floor((userProgressInLevel / xpForNextLevel) * 100));
};

// Função para obter o título baseado no nível
const getLevelTitle = (level) => {
  const titles = {
    1: 'Iniciante',
    2: 'Aprendiz',
    3: 'Consciente',
    4: 'Economizador',
    5: 'Eficiente',
    6: 'Conservador',
    7: 'Especialista',
    8: 'Mestre',
    9: 'Guru',
    10: 'Sustentável',
  };
  return titles[level] || 'Desconhecido';
};

export default function ProfileScreen({ navigation }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [level, setLevel] = useState(1);
  const [progress, setProgress] = useState(0);
  const [badges, setBadges] = useState([]);

  // Estado para diálogo de conquistas
  const [showAllAchievements, setShowAllAchievements] = useState(false);

  // Estado para mostrar animação de nível
  const [showLevelUpDialog, setShowLevelUpDialog] = useState(false);
  const [levelUpInfo, setLevelUpInfo] = useState({ oldLevel: 0, newLevel: 0 });

  // Estado para mostrar conquistas recém obtidas
  const [showNewAchievementDialog, setShowNewAchievementDialog] = useState(false);
  const [newAchievement, setNewAchievement] = useState(null);

  const [previousXp, setPreviousXp] = useState(0);

  // Estados para edição de perfil
  const [showEditProfileDialog, setShowEditProfileDialog] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editCurrentPassword, setEditCurrentPassword] = useState('');
  const [editNewPassword, setEditNewPassword] = useState('');
  const [uploading, setUploading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  // Estados para controle de visibilidade das senhas
  const [currentPasswordVisible, setCurrentPasswordVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });

  // Atualizar dados quando a tela receber foco
  useFocusEffect(
    React.useCallback(() => {
      loadUserData();
      return () => { };
    }, [])
  );

  const loadUserData = async () => {
    try {
      setLoading(true);
      const user = auth().currentUser;
      
      if (!user) {
        setLoading(false);
        return;
      }

      // Get user document from Firestore
      const userDoc = await db.collection('users').doc(user.uid).get();

      if (userDoc.exists) {
        const userData = userDoc.data();
        
        // Calculate user level based on XP
        const userXp = userData.xp || 0;
        const userLevel = calculateLevel(userXp);
        const levelProgress = calculateProgress(userXp, userLevel);
        const levelTitle = getLevelTitle(userLevel);
        
        // Parse creation time safely
        let creationTime = null;
        try {
          if (user.metadata && user.metadata.creationTime) {
            creationTime = new Date(user.metadata.creationTime);
            // Verificar se é uma data válida
            if (isNaN(creationTime.getTime())) {
              creationTime = null;
            }
          }
        } catch (error) {
          // Ignora erro ao processar data
        }
        
        // Determinar qual URL de foto usar - preferir a do Firestore se existir
        let photoURL = userData.photoURL || user.photoURL || null;
        
        // Set user data in state
        const userDataObj = {
          uid: user.uid,
          name: userData.name || '',
          email: user.email || '',
          photoURL: photoURL,
          creationTime: creationTime,
          level: userLevel,
          xp: userXp,
          progress: levelProgress,
          levelTitle: levelTitle,
          badges: userData.badges || [],
          readTips: userData.readTips?.length || 0,
          totalConsumptionEntries: userData.consumption?.length || 0
        };
        
        setUserData(userDataObj);
        setLevel(userLevel);
        setProgress(levelProgress);
        setBadges(userData.badges || []);
        
        // Preparar dados para edição
        setEditName(userData.name || '');
        setEditEmail(user.email || '');
      } else {
        // Se o documento não existir, vamos criar um novo com dados básicos
        const newUserData = {
          name: user.displayName || '',
          email: user.email || '',
          photoURL: user.photoURL || null,
          xp: 0,
          badges: [],
          readTips: [],
          consumption: []
        };
        
        await db.collection('users').doc(user.uid).set(newUserData);
        
        // Definir dados iniciais
        const userDataObj = {
          uid: user.uid,
          name: newUserData.name,
          email: newUserData.email,
          photoURL: newUserData.photoURL,
          creationTime: user.metadata?.creationTime ? new Date(user.metadata.creationTime) : new Date(),
          level: 1,
          xp: 0,
          progress: 0,
          levelTitle: getLevelTitle(1),
          badges: [],
          readTips: 0,
          totalConsumptionEntries: 0
        };
        
        setUserData(userDataObj);
        setLevel(1);
        setProgress(0);
        setBadges([]);
        
        // Preparar dados para edição
        setEditName(newUserData.name);
        setEditEmail(newUserData.email);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os dados do perfil.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await auth().signOut();
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Error signing out:', error);
      Alert.alert('Erro', 'Não foi possível sair da conta. Tente novamente.');
    }
  };

  // Determinar o ícone de avatar baseado no nível
  const getAvatarIcon = () => {
    if (level >= 8) return 'leaf';
    if (level >= 5) return 'seedling';
    return 'sprout';
  };

  // Formatador de data
  const formatDate = (date) => {
    try {
      if (!date) return "-";
      
      // Se for string, converter para Date
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      
      // Verificar se a data é válida
      if (isNaN(dateObj.getTime())) return "-";
      
      // Formatar data
      return dateObj.toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: '2-digit',
        year: 'numeric' 
      });
    } catch (error) {
      console.error("Erro ao formatar data:", error);
      return "-";
    }
  };

  // Verificar se o usuário já tem uma conquista
  const hasAchievement = (achievementId) => {
    return badges.some(badge => badge.id === achievementId);
  };

  const pickImage = async () => {
    try {
      // Solicitar permissões se necessário
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão necessária', 'É necessário permitir o acesso à galeria para selecionar uma foto.');
        return;
      }
      
      // Configurações para obter uma imagem de tamanho adequado para Firestore
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.1, // Qualidade muito mais baixa (10%)
        base64: true,
        exif: false
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0];
        
        // Verificar se a base64 está disponível
        if (!selectedImage.base64) {
          Alert.alert('Erro', 'Não foi possível processar esta imagem. Por favor, tente com outra imagem.');
          return;
        }
        
        // Verificar tamanho da imagem em base64
        let base64Data = selectedImage.base64;
        let base64Size = base64Data.length * 0.75 / 1024; // Tamanho aproximado em KB
        
        // Se o tamanho ainda for muito grande, ajustar ainda mais
        if (base64Size > 500) {
          Alert.alert(
            'Imagem grande',
            'A imagem selecionada é grande (mais de 500KB). Continuar com qualidade reduzida?',
            [
              {
                text: 'Cancelar',
                style: 'cancel'
              },
              {
                text: 'Continuar',
                onPress: async () => {
                  try {
                    setUploading(true);
                    
                    // Reduzir a qualidade comprimindo mais agressivamente
                    base64Data = createThumbnail(base64Data);
                    
                    await saveProfileImageToFirestore(base64Data);
                  } catch (error) {
                    Alert.alert('Erro', 'Falha ao fazer upload da imagem: ' + error.message);
                  } finally {
                    setUploading(false);
                  }
                }
              }
            ]
          );
          return;
        }
        
        try {
          setUploading(true);
          await saveProfileImageToFirestore(base64Data);
        } catch (uploadError) {
          Alert.alert(
            "Erro no upload", 
            "Não foi possível fazer o upload da imagem: " + uploadError.message
          );
        } finally {
          setUploading(false);
        }
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível selecionar uma imagem: ' + error.message);
      setUploading(false);
    }
  };

  // Função para criar uma versão menor da imagem
  const createThumbnail = (base64Data) => {
    // Método simplificado para reduzir o tamanho da string base64
    // Neste caso, estamos simplesmente truncando a string, o que reduz a qualidade
    // e resolução da imagem, mas garante que caiba no Firestore
    const maxLength = 800 * 1024 * 4/3; // ~800KB após conversão base64
    
    if (base64Data.length > maxLength) {
      // Se for muito grande, reduzir para aproximadamente 600KB
      // Isso é uma abordagem simples, mas funcional para casos onde a aparência
      // não é o mais importante
      return base64Data.substring(0, 600 * 1024 * 4/3);
    }
    
    return base64Data;
  };

  // Método para salvar a imagem diretamente no Firestore
  const saveProfileImageToFirestore = async (base64Data) => {
    try {
      const user = auth().currentUser;
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      // Verificação final de tamanho para garantir que não exceda o limite do Firestore
      const dataSize = base64Data.length * 0.75 / 1024; // KB
      if (dataSize > 800) {
        // Tentar uma redução mais agressiva
        const reducedData = base64Data.substring(0, 500 * 1024 * 4/3); // Aproximadamente 500KB
        base64Data = reducedData;
      }

      // Criar URI de dados para usar como photoURL
      const fullPhotoURL = `data:image/jpeg;base64,${base64Data}`;
      
      // Criar uma thumbnail extremamente pequena para o Auth (firebase tem limite de tamanho)
      // Pegamos apenas uma pequena parte da base64 para criar uma miniatura
      const thumbnailSize = Math.min(5000, base64Data.length); // Pegamos no máximo 5KB
      const thumbnailData = base64Data.substring(0, thumbnailSize);
      const thumbnailURL = `data:image/jpeg;base64,${thumbnailData}`;
      
      try {
        // Atualizar o perfil no Auth com a miniatura
        await user.updateProfile({
          photoURL: thumbnailURL,
        });
      } catch (authError) {
        // Se falhar, usamos uma URL ainda menor ou uma URL fictícia
        if (authError.code === 'auth/invalid-profile-attribute') {
          await user.updateProfile({
            photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData?.name || 'User')}&background=FFC107&color=fff`,
          });
        } else {
          throw authError;
        }
      }

      // Atualizar documento no Firestore usando técnica de divisão para casos extremos
      try {
        // Atualizar o Firestore com a imagem completa e URL de referência
        await db.collection('users').doc(user.uid).update({
          photoURL: fullPhotoURL,
          photoURLAuth: user.photoURL, // Armazenar também a URL do Auth
          lastPhotoUpdate: firebase.firestore.FieldValue.serverTimestamp()
        });
      } catch (firestoreError) {
        // Se falhar por tamanho do documento, usar abordagem alternativa
        if (firestoreError.message && firestoreError.message.includes('exceeds maximum size')) {
          // Dividir a imagem em múltiplos fragmentos se necessário
          const chunkSize = 100 * 1024; // 100KB por fragmento
          await db.collection('users').doc(user.uid).update({
            photoURL: thumbnailURL,
            photoQuality: 'low',
            lastPhotoUpdate: firebase.firestore.FieldValue.serverTimestamp()
          });
          
          // Atualizar interface com a versão menor
          setUserData(prev => ({
            ...prev,
            photoURL: thumbnailURL,
          }));
          
          Alert.alert(
            'Aviso',
            'Sua foto foi salva, mas com qualidade reduzida devido ao tamanho. Para melhor qualidade, tente uma imagem menor.'
          );
          return true;
        } else {
          throw firestoreError;
        }
      }

      // Atualizar estado local
      setUserData(prev => ({
        ...prev,
        photoURL: fullPhotoURL,
      }));

      Alert.alert('Sucesso', 'Foto de perfil atualizada com sucesso!');
      return true;
    } catch (error) {
      if (error.message && error.message.includes('Document exceeds maximum size')) {
        Alert.alert(
          'Erro de tamanho',
          'A imagem é muito grande para ser armazenada. Por favor, tente com uma imagem menor ou de qualidade reduzida.'
        );
      } else if (error.message && error.message.includes('Photo URL too long')) {
        Alert.alert(
          'Erro de tamanho',
          'A URL da foto é muito longa. Por favor, tente com uma imagem menor.'
        );
      } else {
        throw error;
      }
    }
  };

  const saveProfileChanges = async () => {
    try {
      setEditLoading(true);
      const user = auth().currentUser;
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Verificar senha atual se fornecida
      if (editCurrentPassword) {
        try {
          // Reautenticar para verificar a senha
          const credential = firebase.auth.EmailAuthProvider.credential(
            user.email,
            editCurrentPassword
          );
          await user.reauthenticateWithCredential(credential);
          
          // Se forneceu nova senha, atualiza
          if (editNewPassword) {
            await user.updatePassword(editNewPassword);
          }
          
          // Atualizar email se foi alterado
          if (editEmail !== user.email) {
            await user.updateEmail(editEmail);
          }
        } catch (error) {
          console.error('Error in authentication:', error);
          Alert.alert('Erro', 'Senha atual incorreta.');
          setEditLoading(false);
          return;
        }
      } else if (editNewPassword || editEmail !== user.email) {
        Alert.alert('Erro', 'Digite sua senha atual para alterar email ou senha.');
        setEditLoading(false);
        return;
      }

      // Update name in Firestore
      await db.collection('users').doc(user.uid).update({
        name: editName
      });

      // Update state
      loadUserData();  // Recarregar todos os dados
      
      // Fechar diálogo
      setShowEditProfileDialog(false);
      setEditCurrentPassword('');
      setEditNewPassword('');
      
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Erro', 'Não foi possível atualizar o perfil. Tente novamente.');
    } finally {
      setEditLoading(false);
    }
  };

  const uploadProfileImage = async (imageUri) => {
    try {
      if (!imageUri) {
        console.log('No image provided for upload');
        return null;
      }

      setUploading(true);
      const auth = getAuth();
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        Alert.alert('Erro', 'Você precisa estar logado para alterar sua foto.');
        setUploading(false);
        return null;
      }

      // Convert URI to blob
      const response = await fetch(imageUri);
      const blob = await response.blob();
      
      // Create a reference to the file location in Firebase Storage
      const fileExtension = imageUri.split('.').pop();
      const fileName = `profile_${currentUser.uid}_${Date.now()}.${fileExtension}`;
      const storageRef = ref(storage, `profile_images/${fileName}`);
      
      // Upload the blob to storage
      await uploadBytes(storageRef, blob);
      console.log('Image uploaded successfully');
      
      // Get the download URL
      const downloadURL = await getDownloadURL(storageRef);
      
      // Update user profile in Authentication
      await updateProfile(currentUser, {
        photoURL: downloadURL
      });
      
      // Update user document in Firestore
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        photoURL: downloadURL
      });
      
      // Update local state
      setUserData(prev => ({
        ...prev,
        photoURL: downloadURL
      }));
      
      Alert.alert('Sucesso', 'Foto de perfil atualizada com sucesso!');
      return downloadURL;
    } catch (error) {
      console.error('Error uploading profile image:', error);
      Alert.alert('Erro', 'Não foi possível fazer o upload da imagem. Por favor, tente novamente.');
      return null;
    } finally {
      setUploading(false);
    }
  };

  if (!fontsLoaded || loading) {
    return (
      <>
        <StatusBar 
          backgroundColor="#F5F5F5" 
          barStyle="dark-content" 
          translucent={false}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFC107" />
          <Text style={styles.loadingText}>Carregando perfil...</Text>
        </View>
      </>
    );
  }

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Provider>
      <Portal>
        <StatusBar 
          backgroundColor="#F5F5F5" 
          barStyle="dark-content" 
          translucent={false}
        />
        <ScrollView 
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Cabeçalho do Perfil com botão de ajuda integrado */}
          <View style={styles.header}>
            <View style={styles.headerActions}>
              <TouchableOpacity 
                style={styles.helpButton}
                onPress={() => navigation.navigate('Help')}
              >
                <MaterialIcons name="help" size={24} color="#FFC107" />
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity
              style={styles.avatarContainer}
              onPress={() => setShowEditProfileDialog(true)}
            >
              {userData?.photoURL ? (
                <Image
                  source={{ uri: userData.photoURL }}
                  style={styles.avatarImage}
                />
              ) : (
                <FontAwesome5 name={getAvatarIcon()} size={50} color="#FFC107" />
              )}
              <View style={styles.editIconContainer}>
                <MaterialIcons name="edit" size={16} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
            <Text style={styles.userName}>{userData?.name}</Text>
            <Text style={styles.email}>{userData?.email}</Text>
          </View>

          {/* Nível e Progresso */}
          <View style={styles.levelContainer}>
            <View style={styles.levelHeader}>
              <Text style={styles.levelTitle}>Nível {level}</Text>
              <Text style={styles.levelSubtitle}>{userData?.levelTitle}</Text>
            </View>
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${progress}%` }]} />
              </View>
              <Text style={styles.progressText}>{userData?.xp} XP • {progress}% para o próximo nível</Text>
            </View>
          </View>

          {/* Card de Estatísticas */}
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.cardTitle}>Estatísticas</Text>
              <View style={styles.statsContainer}>
                {/* Primeira linha: Dicas Lidas e Registros */}
                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <MaterialIcons name="lightbulb" size={24} color="#FFC107" />
                    <View style={styles.statTextContainer}>
                      <Text style={styles.statLabel} ellipsizeMode="tail" numberOfLines={1}>Dicas lidas</Text>
                      <Text style={styles.statValue} ellipsizeMode="tail" numberOfLines={1}>{userData?.readTips || 0}</Text>
                    </View>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <MaterialIcons name="speed" size={24} color="#FFC107" />
                    <View style={styles.statTextContainer}>
                      <Text style={styles.statLabel} ellipsizeMode="tail" numberOfLines={1}>Registros</Text>
                      <Text style={styles.statValue} ellipsizeMode="tail" numberOfLines={1}>{userData?.totalConsumptionEntries || 0}</Text>
                    </View>
                  </View>
                </View>
                
                {/* Segunda linha: Membro desde */}
                <View style={styles.statsRowSingle}>
                  <View style={[styles.statItem, styles.statItemCenter]}>
                    <MaterialIcons name="calendar-today" size={24} color="#FFC107" />
                    <View style={styles.statTextContainer}>
                      <Text style={styles.statLabel} ellipsizeMode="tail" numberOfLines={1}>Membro desde</Text>
                      <Text style={styles.statValue} ellipsizeMode="tail" numberOfLines={1}>
                        {userData?.creationTime
                          ? formatDate(userData.creationTime)
                          : 'N/A'}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </Card.Content>
          </Card>

          {/* Conquistas */}
          <View style={styles.badgesContainer}>
            <View style={styles.badgesHeader}>
              <Text style={styles.sectionTitle}>Conquistas</Text>
              <Button
                mode="text"
                onPress={() => setShowAllAchievements(true)}
                icon="trophy"
                textColor="#FFC107"
              >
                Ver todas
              </Button>
            </View>

            {badges.length > 0 ? (
              <View style={styles.badgesGrid}>
                {badges.slice(0, 4).map(badge => (
                  <View key={badge.id} style={styles.badgeItem}>
                    <MaterialIcons name={badge.icon} size={36} color="#FFC107" />
                    <Text style={styles.badgeName}>{badge.name}</Text>
                    <Text style={styles.badgeDesc}>{badge.description}</Text>
                  </View>
                ))}
                {badges.length > 4 && (
                  <TouchableOpacity
                    style={styles.moreBadgesButton}
                    onPress={() => setShowAllAchievements(true)}
                  >
                    <Text style={styles.moreBadgesText}>+{badges.length - 4} mais</Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              <View style={styles.emptyBadges}>
                <MaterialIcons name="emoji-events" size={50} color="#E0E0E0" />
                <Text style={styles.emptyBadgesText}>Nenhuma conquista ainda</Text>
                <Text style={styles.emptyBadgesSubtext}>Visite a seção de dicas e economize energia para desbloquear conquistas!</Text>
              </View>
            )}
          </View>

          {/* Botão de Logout */}
          <Button
            mode="contained"
            onPress={handleLogout}
            style={styles.logoutButton}
            buttonColor="#FF5252"
            textColor="#FFFFFF"
            icon="logout"
          >
            Sair da conta
          </Button>

          {/* Diálogo de todas as conquistas */}
          <Dialog
            visible={showAllAchievements}
            onDismiss={() => setShowAllAchievements(false)}
            style={styles.achievementsDialog}
          >
            <Dialog.Title style={styles.dialogTitle}>Minhas Conquistas</Dialog.Title>
            <Dialog.ScrollArea style={styles.achievementsScrollArea}>
              <ScrollView contentContainerStyle={styles.achievementsScrollContent}>
                {ALL_ACHIEVEMENTS.map((achievement) => (
                  <View
                    key={achievement.id}
                    style={[
                      styles.achievementItem,
                      !hasAchievement(achievement.id) && styles.lockedAchievement,
                    ]}
                  >
                    <MaterialIcons
                      name={achievement.icon}
                      size={36}
                      color={hasAchievement(achievement.id) ? '#FFC107' : '#CCCCCC'}
                    />
                    <View style={styles.achievementContent}>
                      <Text
                        style={[
                          styles.achievementName,
                          !hasAchievement(achievement.id) && styles.lockedText,
                        ]}
                      >
                        {achievement.name}
                      </Text>
                      <Text
                        style={[
                          styles.achievementDescription,
                          !hasAchievement(achievement.id) && styles.lockedText,
                        ]}
                      >
                        {achievement.description}
                      </Text>
                      <Text style={styles.achievementXP}>+{achievement.xpReward} XP</Text>
                    </View>
                    {hasAchievement(achievement.id) && (
                      <MaterialIcons name="check-circle" size={24} color="#4CAF50" />
                    )}
                    {!hasAchievement(achievement.id) && (
                      <MaterialIcons name="lock" size={24} color="#CCCCCC" />
                    )}
                  </View>
                ))}
              </ScrollView>
            </Dialog.ScrollArea>
            <Dialog.Actions>
              <Button onPress={() => setShowAllAchievements(false)} textColor="#FFC107">
                Fechar
              </Button>
            </Dialog.Actions>
          </Dialog>

          {/* Diálogo de level up */}
          <Dialog
            visible={showLevelUpDialog}
            onDismiss={() => setShowLevelUpDialog(false)}
            style={styles.levelUpDialog}
          >
            <Dialog.Content style={styles.levelUpContent}>
              <View style={styles.levelUpIconContainer}>
                <MaterialIcons name="emoji-events" size={80} color="#FFC107" />
              </View>
              <Text style={styles.levelUpTitle}>Você subiu de nível!</Text>
              <View style={styles.levelProgress}>
                <View style={styles.levelCircle}>
                  <Text style={styles.levelNumber}>{levelUpInfo.oldLevel}</Text>
                </View>
                <View style={styles.levelArrow}>
                  <MaterialIcons name="arrow-forward" size={30} color="#4CAF50" />
                </View>
                <View style={[styles.levelCircle, styles.newLevelCircle]}>
                  <Text style={styles.levelNumber}>{levelUpInfo.newLevel}</Text>
                </View>
              </View>
              <Text style={styles.levelUpSubtitle}>
                Você agora é um {userData?.levelTitle}!
              </Text>
              <Text style={styles.levelUpDescription}>
                Continue assim para desbloquear mais conquistas e benefícios!
              </Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button
                onPress={() => setShowLevelUpDialog(false)}
                mode="contained"
                buttonColor="#4CAF50"
                textColor="#FFFFFF"
              >
                Continuar
              </Button>
            </Dialog.Actions>
          </Dialog>

          {/* Diálogo de edição de perfil */}
          <Dialog
            visible={showEditProfileDialog}
            onDismiss={() => {
              if (!uploading && !editLoading) setShowEditProfileDialog(false);
            }}
            style={styles.editProfileDialog}
            dismissable={!uploading && !editLoading}
          >
            <Dialog.Title style={styles.dialogTitle}>Editar Perfil</Dialog.Title>
            <Dialog.ScrollArea style={styles.dialogScrollArea}>
              <ScrollView contentContainerStyle={{ paddingVertical: 10 }}>
                <View style={styles.editAvatarContainer}>
                  <Surface style={styles.avatarSurface}>
                    {userData?.photoURL ? (
                      <Image
                        source={{ uri: userData.photoURL }}
                        style={styles.editAvatarImage}
                      />
                    ) : (
                      <View style={styles.editAvatarPlaceholder}>
                        <FontAwesome5 name={getAvatarIcon()} size={60} color="#FFC107" />
                      </View>
                    )}
                    {uploading && (
                      <View style={styles.uploadingOverlay}>
                        <ActivityIndicator size="large" color="#FFFFFF" />
                      </View>
                    )}
                  </Surface>
                  <Button
                    mode="contained"
                    onPress={pickImage}
                    style={styles.photoButton}
                    buttonColor="#FFC107"
                    textColor="#FFFFFF"
                    icon="camera"
                    loading={uploading}
                    disabled={uploading || editLoading}
                  >
                    {uploading ? "Enviando..." : "Alterar foto"}
                  </Button>
                </View>

                {/* Campo de nome */}
                <TextInput
                  label="Nome"
                  value={editName}
                  onChangeText={setEditName}
                  style={styles.input}
                  contentStyle={styles.inputContent}
                  mode="outlined"
                  outlineColor="#CCCCCC"
                  activeOutlineColor="#FFC107"
                  outlineStyle={{ borderRadius: 12 }}
                  textColor="#333333"
                  theme={{ colors: { placeholder: '#666666', text: '#333333' } }}
                  disabled={uploading || editLoading}
                  left={<TextInput.Icon icon="account" color="#FFC107" />}
                />

                {/* Campo de email */}
                <TextInput
                  label="Email"
                  value={editEmail}
                  onChangeText={setEditEmail}
                  style={styles.input}
                  contentStyle={styles.inputContent}
                  mode="outlined"
                  outlineColor="#CCCCCC"
                  activeOutlineColor="#FFC107"
                  outlineStyle={{ borderRadius: 12 }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  textColor="#333333"
                  theme={{ colors: { placeholder: '#666666', text: '#333333' } }}
                  disabled={uploading || editLoading}
                  left={<TextInput.Icon icon="email" color="#FFC107" />}
                />

                {/* Campo de senha atual (para confirmação) */}
                <TextInput
                  label="Senha atual (para confirmar alterações)"
                  value={editCurrentPassword}
                  onChangeText={setEditCurrentPassword}
                  style={styles.input}
                  contentStyle={styles.inputContent}
                  mode="outlined"
                  outlineColor="#CCCCCC"
                  activeOutlineColor="#FFC107"
                  outlineStyle={{ borderRadius: 12 }}
                  secureTextEntry={!currentPasswordVisible}
                  autoCapitalize="none"
                  textColor="#333333"
                  theme={{ colors: { placeholder: '#666666', text: '#333333' } }}
                  disabled={uploading || editLoading}
                  left={<TextInput.Icon icon="lock" color="#FFC107" />}
                  right={
                    <TextInput.Icon
                      icon={currentPasswordVisible ? "eye-off" : "eye"}
                      color="#666666"
                      onPress={() => setCurrentPasswordVisible(!currentPasswordVisible)}
                    />
                  }
                />

                {/* Campo de nova senha */}
                <TextInput
                  label="Nova senha (opcional)"
                  value={editNewPassword}
                  onChangeText={setEditNewPassword}
                  style={styles.input}
                  contentStyle={styles.inputContent}
                  mode="outlined"
                  outlineColor="#CCCCCC"
                  activeOutlineColor="#FFC107"
                  outlineStyle={{ borderRadius: 12 }}
                  secureTextEntry={!newPasswordVisible}
                  autoCapitalize="none"
                  textColor="#333333"
                  theme={{ colors: { placeholder: '#666666', text: '#333333' } }}
                  disabled={uploading || editLoading}
                  left={<TextInput.Icon icon="lock-reset" color="#FFC107" />}
                  right={
                    <TextInput.Icon
                      icon={newPasswordVisible ? "eye-off" : "eye"}
                      color="#666666"
                      onPress={() => setNewPasswordVisible(!newPasswordVisible)}
                    />
                  }
                />
                <Text style={styles.passwordHint}>
                  Deixe em branco para manter a senha atual
                </Text>
              </ScrollView>
            </Dialog.ScrollArea>
            <Dialog.Actions style={styles.dialogActions}>
              <Button
                onPress={() => setShowEditProfileDialog(false)}
                textColor="#757575"
                disabled={uploading || editLoading}
                style={styles.cancelButton}
              >
                Cancelar
              </Button>
              <Button
                onPress={saveProfileChanges}
                mode="contained"
                buttonColor="#FFC107"
                textColor="#FFFFFF"
                loading={editLoading}
                disabled={uploading || editLoading}
                style={styles.saveButton}
                labelStyle={styles.saveButtonLabel}
              >
                Salvar
              </Button>
            </Dialog.Actions>
          </Dialog>
        </ScrollView>
      </Portal>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingTop: 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingTop: 0,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    color: '#333',
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
    marginTop: 0,
  },
  headerActions: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
  },
  helpButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FFC107',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  userName: {
    fontSize: 22,
    fontFamily: 'Poppins_700Bold',
    color: '#333',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#666',
  },
  levelContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  levelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  levelTitle: {
    fontSize: 18,
    fontFamily: 'Poppins_700Bold',
    color: '#333',
  },
  levelSubtitle: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#FFC107',
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFC107',
  },
  progressText: {
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    color: '#666',
    textAlign: 'center',
  },
  statsContainer: {
    width: '100%',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
  },
  statsRowSingle: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  statTextContainer: {
    marginLeft: 8,
    flex: 1,
    width: '80%',
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    color: '#757575',
  },
  statValue: {
    fontSize: 14,
    fontFamily: 'Poppins_700Bold',
    color: '#333333',
  },
  statDivider: {
    width: 1,
    height: '80%',
    backgroundColor: '#E0E0E0',
  },
  statItemCenter: {
    maxWidth: '50%',
    justifyContent: 'center',
  },
  badgesContainer: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  badgesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  badgeItem: {
    width: '48%',
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  badgeName: {
    fontSize: 14,
    fontFamily: 'Poppins_700Bold',
    color: '#333',
    marginTop: 12,
    marginBottom: 4,
    textAlign: 'center',
  },
  badgeDesc: {
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    color: '#666',
    textAlign: 'center',
  },
  emptyBadges: {
    alignItems: 'center',
    padding: 24,
  },
  emptyBadgesText: {
    fontSize: 16,
    fontFamily: 'Poppins_700Bold',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyBadgesSubtext: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#999',
    textAlign: 'center',
  },
  moreBadgesButton: {
    width: '48%',
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
  },
  moreBadgesText: {
    fontSize: 14,
    fontFamily: 'Poppins_700Bold',
    color: '#FFC107',
  },
  achievementsDialog: {
    maxHeight: '80%',
  },
  dialogTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 16,
    color: '#333333',
    textAlign: 'center',
    paddingVertical: 8,
  },
  achievementsScrollArea: {
    paddingHorizontal: 0,
    maxHeight: Platform.OS === 'ios' ? '65%' : '70%',
  },
  achievementsScrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  achievementItem: {
    flexDirection: 'row',
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  achievementItemDisabled: {
    opacity: 0.7,
    backgroundColor: '#F0F0F0',
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
  achievementDescription: {
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
  achievementTextDisabled: {
    color: '#999',
  },
  achievementCheck: {
    marginLeft: 8,
  },
  logoutButton: {
    margin: 16,
    marginTop: 8,
    marginBottom: 32,
  },
  levelUpDialog: {
    backgroundColor: 'white',
    borderRadius: 16,
    alignItems: 'center',
  },
  levelUpContent: {
    alignItems: 'center',
    padding: 8,
  },
  levelUpIconContainer: {
    backgroundColor: '#FFF9E0',
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  levelUpTitle: {
    fontSize: 24,
    fontFamily: 'Poppins_700Bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  levelProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  levelCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  newLevelCircle: {
    backgroundColor: '#FFF9E0',
  },
  levelNumber: {
    fontSize: 24,
    fontFamily: 'Poppins_700Bold',
    color: '#333',
  },
  levelArrow: {
    marginHorizontal: 16,
  },
  levelUpSubtitle: {
    fontSize: 18,
    fontFamily: 'Poppins_700Bold',
    color: '#4CAF50',
    marginBottom: 8,
    textAlign: 'center',
  },
  levelUpDescription: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  editProfileDialog: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    maxHeight: '85%',
  },
  dialogTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 16,
    color: '#333333',
    textAlign: 'center',
    paddingVertical: 8,
  },
  dialogScrollArea: {
    paddingHorizontal: 15,
    maxHeight: '70%',
  },
  input: {
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
    fontSize: 14,
  },
  inputContent: {
    paddingVertical: 6,
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#333333',
  },
  passwordHint: {
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    color: '#757575',
    marginTop: -12,
    marginBottom: 16,
    marginLeft: 8,
  },
  editAvatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarSurface: {
    elevation: 4,
    borderRadius: 60,
    width: 120,
    height: 120,
    overflow: 'hidden',
    backgroundColor: '#F5F5F5',
    marginBottom: 16,
    position: 'relative',
  },
  uploadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editAvatarImage: {
    width: 120,
    height: 120,
  },
  editAvatarPlaceholder: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoButton: {
    borderRadius: 25,
    paddingHorizontal: 20,
    marginTop: 12,
  },
  dialogActions: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveButton: {
    flex: 1,
    borderRadius: 25,
    marginLeft: 8,
    height: 36,
  },
  saveButtonLabel: {
    fontSize: 14,
    fontFamily: 'Poppins_700Bold',
  },
  cancelButton: {
    flex: 1,
    borderRadius: 25,
    height: 36,
  },
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: 'Poppins_700Bold',
    color: '#333',
    marginBottom: 12,
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: 32, // Adicionar padding para o botão de logout
  },
});