import React, { useEffect, useState } from 'react';
import './assets/services/Credentials'; // Importar Credentials primero para inicializar Firebase
import Navigation from './screens/Main/Navigation';
import { AppProvider } from './assets/context/AppContext';
import { BluetoothProvider } from './assets/context/BluetoothContext';
import { Platform, Alert, Linking } from 'react-native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

export default function App() {
  const [permissionsGranted, setPermissionsGranted] = useState({
    bluetoothScan: false,
    bluetoothConnect: false,
    location: false,
  });

  useEffect(() => {
    const requestPermissions = async () => {
      try {
        if (Platform.OS === 'android') {
          const permissionsToRequest = [
            {
              permission: PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
              key: 'bluetoothScan',
              message: 'Se necesita el permiso BLUETOOTH_SCAN para buscar dispositivos Bluetooth. Por favor, otórgalo en la configuración de la app.',
            },
            {
              permission: PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
              key: 'bluetoothConnect',
              message: 'Se necesita el permiso BLUETOOTH_CONNECT para conectar con el peluche. Por favor, otórgalo en la configuración de la app.',
            },
            {
              permission: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
              key: 'location',
              message: 'Se necesita el permiso de ubicación para escanear dispositivos Bluetooth. Por favor, otórgalo en la configuración de la app.',
            },
          ];

          const updatedPermissions = { ...permissionsGranted };

          for (const { permission, key, message } of permissionsToRequest) {
            let result = await check(permission);
            if (result !== RESULTS.GRANTED) {
              result = await request(permission);
              updatedPermissions[key] = result === RESULTS.GRANTED;
              if (result !== RESULTS.GRANTED) {
                Alert.alert(
                  'Permiso Requerido',
                  message,
                  [
                    { text: 'Cancelar', style: 'cancel' },
                    { text: 'Ir a Configuración', onPress: () => Linking.openSettings() },
                  ]
                );
              }
            } else {
              updatedPermissions[key] = true;
            }
          }

          setPermissionsGranted(updatedPermissions);
        }
      } catch (error) {
        console.error('Error solicitando permisos:', error);
      }
    };
    requestPermissions();
  }, []);

  return (
    <BluetoothProvider permissionsGranted={permissionsGranted}>
      <AppProvider>
        <Navigation />
      </AppProvider>
    </BluetoothProvider>
  );
}