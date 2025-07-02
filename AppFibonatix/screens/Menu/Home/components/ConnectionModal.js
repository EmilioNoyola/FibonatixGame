import React, { useEffect, useState } from 'react';
import { Modal, View, Text, ActivityIndicator, StyleSheet } from 'react-native';

const ConnectionModal = ({ visible, status }) => {
  const [message, setMessage] = useState('Conectando con el peluche...');

  useEffect(() => {
    if (status === 'connecting') {
      setMessage('Conectando con el peluche...');
    } else if (status === 'success') {
      setMessage('¡Conexión exitosa!');
    } else if (status === 'error') {
      setMessage('No se pudo conectar. Intenta de nuevo.');
    }
  }, [status]);

  return (
    <Modal transparent={true} visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#4EC160" />
          <Text style={styles.message}>{message}</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    width: '70%',
  },
  message: {
    marginTop: 15,
    fontSize: 16,
    textAlign: 'center',
  },
});

export default ConnectionModal;