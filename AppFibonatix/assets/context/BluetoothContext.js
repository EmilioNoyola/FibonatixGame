// Contexto de la conexión Bluetooth. 
import RNBluetoothClassic from 'react-native-bluetooth-classic';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';

const BluetoothContext = createContext();

export const BluetoothProvider = ({ children, permissionsGranted }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [device, setDevice] = useState(null);
  const [pairedDevices, setPairedDevices] = useState([]);
  const [isConnecting, setIsConnecting] = useState(false);

  const initializeBluetooth = async () => {
    if (!permissionsGranted.bluetoothConnect) {
      console.log('Permiso BLUETOOTH_CONNECT no otorgado. No se puede inicializar Bluetooth.');
      return;
    }

    try {
      const enabled = await RNBluetoothClassic.isBluetoothEnabled();
      if (!enabled) {
        await RNBluetoothClassic.requestBluetoothEnabled();
        console.log('Bluetooth habilitado');
      } else {
        console.log('Bluetooth ya está habilitado');
      }

      const devices = await RNBluetoothClassic.getBondedDevices();
      setPairedDevices(devices);
    } catch (error) {
      console.error('Error inicializando Bluetooth:', error);
    }
  };

  const connectToDevice = async (targetDevice) => {
    if (!permissionsGranted.bluetoothConnect || !permissionsGranted.bluetoothScan) {
      console.log('Faltan permisos para conectar al dispositivo. Asegúrate de otorgar BLUETOOTH_SCAN y BLUETOOTH_CONNECT.');
      Alert.alert('Permisos Faltantes', 'Por favor, otorga los permisos de Bluetooth y ubicación para continuar.');
      return;
    }

    if (isConnecting) {
      console.log('Ya hay un intento de conexión en curso. Por favor espera.');
      Alert.alert('Conexión en Progreso', 'Ya se está intentando conectar a un dispositivo. Por favor espera.');
      return;
    }

    setIsConnecting(true);

    try {
      console.log(`Intentando conectar a ${targetDevice.name} (${targetDevice.address})...`);
      await targetDevice.connect();
      setDevice(targetDevice);
      setIsConnected(true);
      console.log(`Conectado a ${targetDevice.name}`);
      Alert.alert('Conexión Exitosa', `Se ha conectado correctamente a ${targetDevice.name}.`);
    } catch (error) {
      console.error('Error al conectar:', error);
      setIsConnected(false);
      Alert.alert('Error de Conexión', `No se pudo conectar a ${targetDevice.name}. Asegúrate de que esté encendido y emparejado.`);
    } finally {
      setIsConnecting(false);
    }
  };

  const autoConnectToPlushie = async () => {
    if (!permissionsGranted.bluetoothConnect || !permissionsGranted.bluetoothScan) {
      console.log('Faltan permisos para conectar automáticamente');
      return false;
    }

    if (isConnected || isConnecting) {
      console.log('Ya hay una conexión activa o en progreso');
      return true;
    }

    setIsConnecting(true);

    try {
      const devices = await RNBluetoothClassic.getBondedDevices();
      console.log('Dispositivos emparejados:', devices);

      const plushieDevice = devices.find(d => 
        d.name && (d.name.includes('Plushie-HC06') || d.name === 'HC-06')
      );

      if (!plushieDevice) {
        console.log('No se encontró el peluche emparejado');
        return false;
      }

      console.log(`Intentando conectar automáticamente a ${plushieDevice.name} (${plushieDevice.address})`);
      await plushieDevice.connect({ timeout: 10000 });
      setDevice(plushieDevice);
      setIsConnected(true);

      await new Promise(resolve => setTimeout(resolve, 500));

      try {
        await writeToCharacteristic('CONNECTED\n');
        console.log('Notificación de conexión enviada');
      } catch (writeError) {
        console.error('Error al enviar CONNECTED:', writeError);
      }

      console.log('Conexión automática exitosa');
      return true;
    } catch (error) {
      console.error('Error en conexión automática:', error);
      if (device) {
        try {
          await device.disconnect();
        } catch (disconnectError) {
          console.error('Error al desconectar:', disconnectError);
        }
      }
      setDevice(null);
      setIsConnected(false);
      return false;
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectDevice = async () => {
    try {
      if (device) {
        await writeToCharacteristic('DISCONNECTED\n');
        await device.disconnect();
      }
    } catch (error) {
      console.error('Error al desconectar:', error);
    } finally {
      setDevice(null);
      setIsConnected(false);
    }
  };

  const writeToCharacteristic = async (value) => {
    if (!isConnected || !device) {
      console.log('No se puede escribir: dispositivo no conectado');
      return;
    }
    try {
      await RNBluetoothClassic.writeToDevice(device.address, value, 'ascii');
      console.log(`Dato enviado: ${value}`);
    } catch (error) {
      console.error('Error escribiendo:', error);
      throw error;
    }
  };

  const subscribeToData = (callback) => {
    if (!device || !isConnected) {
      console.log('No se puede suscribir: dispositivo no conectado');
      return () => {};
    }

    const subscription = device.onDataReceived((data) => {
      const message = data.data;
      callback(message);
    });

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  };

  useEffect(() => {
    if (permissionsGranted.bluetoothConnect) {
      initializeBluetooth();
    }

    const onDisconnect = RNBluetoothClassic.onDeviceDisconnected(() => {
      setIsConnected(false);
      setDevice(null);
      console.log('Conexión perdida');
      Alert.alert('Conexión Perdida', 'Se ha perdido la conexión con el peluche.');
    });

    return () => {
      disconnectDevice();
      onDisconnect.remove();
    };
  }, [permissionsGranted]);

  return (
    <BluetoothContext.Provider
      value={{
        isConnected,
        isConnecting,
        pairedDevices,
        connectToDevice,
        disconnectDevice,
        writeToCharacteristic,
        subscribeToData,
        autoConnectToPlushie, 
      }}
    >
      {children}
    </BluetoothContext.Provider>
  );
};

export const useBluetooth = () => useContext(BluetoothContext);