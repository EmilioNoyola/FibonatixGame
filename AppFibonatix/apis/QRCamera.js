/* import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Pressable, Text, Alert } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner'; // Asegúrate de importar desde aquí
import LoadingScreen from '../apis/LoadingScreen';

// Fuentes personalizadas.
import useCustomFonts from '../apis/FontsConfigure';

const QRCamera = ({ onQRCodeRead, onClose }) => {

  const { fontsLoaded, onLayoutRootView } = useCustomFonts();
  if (!fontsLoaded) return null; // Si las fuentes no están cargadas, se retorna null

  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getCameraPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    onQRCodeRead(data);
    Alert.alert(`Código QR escaneado: ${data}`);
  };

  if (hasPermission === null) {
    return <LoadingScreen textoAdicional={'Pidiendo permisos de cámara...'} />;
  }
  
  if (hasPermission === false) {
    return <LoadingScreen textoAdicional={'No se han concedido permisos de cámara.'} />;
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={styles.buttonContainer}>
        {scanned && (
          <TouchableOpacity style={styles.button} onPress={() => setScanned(false)}>
            <Text style={styles.buttonText}>Escanear de nuevo</Text>
          </TouchableOpacity>
        )}
        <Pressable onPress={onClose}
        
          style={({pressed}) => [
            {
              backgroundColor: pressed ? '#1f8a83' : '#239790',
            },
              styles.button,
          ]}
        
        >
          <Text style={styles.buttonText}>Cerrar</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#9DE0B6',
  },

  buttonContainer: {
    position: 'absolute',
    bottom: 70,
    left: 0,
    right: 0,
    alignItems: 'center',
  },

  button: {
    width: 274,
    height: 58,
    padding: 10,
    marginVertical: 5,
    alignItems: 'center',
    borderRadius: 27,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 7 },
      shadowOpacity: 0.8,
      shadowRadius: 4,
      elevation: 5,
  },

  buttonText: {
    color: '#fff',
    fontSize: 25,
    fontFamily: 'Quicksand',
    textTransform: 'uppercase',
  },

  infoText: {
    color: '#000000',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  
});

export default QRCamera;

*/