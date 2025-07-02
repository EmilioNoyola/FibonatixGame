import './assets/services/Credentials';
import Navigation from './screens/Main/Navigation';
import React, { useEffect, useState } from 'react';
import { AppProvider } from './assets/context/AppContext';
import { BluetoothProvider } from './assets/context/BluetoothContext';
import { Platform, Alert, Linking } from 'react-native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import * as Notifications from 'expo-notifications';
import { useAppContext } from './assets/context/AppContext';
import { NotificationHandler } from './assets/components/NotificationHandler';

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
                <NotificationHandler />
                <Navigation />
            </AppProvider>
        </BluetoothProvider>
    );
}