import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { useAppContext } from '../context/AppContext';
import axios from 'axios';

const API_BASE_URL = 'https://shurtleserver-production.up.railway.app/';

export const NotificationHandler = () => {
    const { clientId } = useAppContext();

    useEffect(() => {
        const setupNotifications = async () => {
            const { status } = await Notifications.requestPermissionsAsync();
            if (status === 'granted') {
                const token = (await Notifications.getExpoPushTokenAsync()).data;
                console.log('Expo Push Token:', token);

                if (clientId) {
                    try {
                        await axios.post(`${API_BASE_URL}/api/registerPushToken`, {
                            clientId,
                            pushToken: token,
                        });
                        console.log('Token enviado al servidor con éxito');
                    } catch (error) {
                        console.error('Error enviando token al servidor:', error);
                    }
                }
            }
        };

        setupNotifications();

        Notifications.setNotificationHandler({
            handleNotification: async () => ({
                shouldShowAlert: true,
                shouldPlaySound: true,
                shouldSetBadge: false,
            }),
        });
    }, [clientId]);

    return null;
};