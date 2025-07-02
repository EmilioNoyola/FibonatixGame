import React, { useState, useEffect } from 'react';
import { View, Text, Image, Pressable, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppContext } from '../../../../assets/context/AppContext';
import { styles } from './HomeStyles';
import ConnectionModal from './ConnectionModal';
import { useBluetooth } from '../../../../assets/context/BluetoothContext';

const UserInfo = () => {
  const { globalData } = useAppContext();
  const { isConnected, autoConnectToPlushie, disconnectDevice } = useBluetooth();
  const [connectionModalVisible, setConnectionModalVisible] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('idle');

  // Efecto para cerrar el modal automáticamente basado en el estado
  useEffect(() => {
    if (connectionStatus === 'success') {
      const timer = setTimeout(() => {
        setConnectionModalVisible(false);
      }, 1500);
      return () => clearTimeout(timer);
    } else if (connectionStatus === 'error') {
      const timer = setTimeout(() => {
        setConnectionModalVisible(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [connectionStatus]);

  const handlePlushiePress = async () => {
    if (isConnected) {
      Alert.alert(
        'Desconectar',
        '¿Quieres desconectar el peluche?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { 
            text: 'Desconectar', 
            onPress: async () => {
              try {
                await disconnectDevice();
                console.log('Peluche desconectado');
              } catch (error) {
                console.error('Error al desconectar:', error);
              }
            }
          }
        ]
      );
      return;
    }

    setConnectionModalVisible(true);
    setConnectionStatus('connecting');

    try {
      const success = await autoConnectToPlushie();
      setConnectionStatus(success ? 'success' : 'error');
      console.log('Estado de conexión:', success ? 'Conectado' : 'Falló');
    } catch (error) {
      console.error('Error en handlePlushiePress:', error);
      setConnectionStatus('error');
    }
  };

  return (
    <View style={styles.containerInfo}>
      <View style={styles.information}>
        <View style={styles.containerMonedas}>
          <Image
            source={{ uri: 'https://raw.githubusercontent.com/EmilioNoyola/FibonatixGame/refs/heads/main/IMG/Emociones/coinShurtle.png' }}
            style={styles.monedas}
          />
          <Text style={styles.textMonedas}>x{globalData.coins || 0}</Text>
        </View>

        <Pressable 
          // onPress={handlePlushiePress} 
          style={styles.containerPlushieButton}
        >
          <View style={[
            styles.plushieButton,
            isConnected && { backgroundColor: '#4EC160' }
          ]}>
            <MaterialIcons 
              name="toys" 
              size={24} 
              color="white" 
            />
          </View>
        </Pressable>

        <View style={styles.containerVictorias}>
          <View style={styles.victorias}>
            <Image
              source={require("../../../../assets/img/Trofeo.png")}
              style={styles.imageWins}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.textVictorias}>x{globalData.trophies || 0}</Text>
        </View>
      </View>
      <ConnectionModal 
        visible={connectionModalVisible} 
        status={connectionStatus}
      />
    </View>
  );
};

export default UserInfo;