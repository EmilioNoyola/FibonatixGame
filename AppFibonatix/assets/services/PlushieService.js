// Funciones para la interacción con el arduino.
export const plushieService = {
    toggleLEDs: async (writeToCharacteristic, isConnected, currentColorIndex) => {
        try {
            if (!isConnected) {
                throw new Error('No está conectado al peluche');
            }
            const colors = [
                { r: 1, g: 0, b: 0 }, 
                { r: 0, g: 1, b: 0 }, 
                { r: 0, g: 0, b: 1 }, 
            ];
            let nextIndex = currentColorIndex + 1;
            if (nextIndex > 3) nextIndex = 0;

            if (nextIndex === 3) {
                await writeToCharacteristic('LED:0,0,0');
                console.log('LEDs apagados');
            } else {
                const { r, g, b } = colors[nextIndex];
                await writeToCharacteristic(`LED:${r},${g},${b}`);
                console.log(`LED cambiado: R=${r}, G=${g}, B=${b}`);
            }
            return nextIndex;
        } catch (error) {
            console.error('Error al cambiar LEDs:', error);
            throw error;
        }
    },

    toggleVibration: async (writeToCharacteristic, isConnected, isVibrating) => {
        try {
            if (!isConnected) {
                throw new Error('No está conectado al peluche');
            }
            const newState = !isVibrating;
            await writeToCharacteristic(`MOTOR:${newState ? 1 : 0}`);
            console.log(newState ? 'Motor activado' : 'Motor desactivado');
            return newState;
        } catch (error) {
            console.error('Error al controlar vibración:', error);
            throw error;
        }
    },

    monitorFSR: (writeToCharacteristic, subscribeToData, isConnected, onPressureDetected) => {
        let unsubscribe;
        let monitoringInterval = null;
        let isAlertActive = false;
        let lastRequest = 0;
        const requestDelay = 500;

        const startMonitoring = async () => {
            if (!isConnected || isAlertActive) return;

            try {
                await writeToCharacteristic('FSR');
            } catch (error) {
                console.error('Error enviando comando FSR inicial:', error);
            }

            unsubscribe = subscribeToData(async (data) => {
                if (data.includes('FSR:')) {
                    const fsrPart = data.split('FSR:')[1];
                    if (fsrPart) {
                        const fsrValueStr = fsrPart.split(';')[0];
                        const fsrValue = parseInt(fsrValueStr, 10);
                        if (!isNaN(fsrValue)) {
                            onPressureDetected(fsrValue);
                        }
                    }
                }
            });

            monitoringInterval = setInterval(async () => {
                if (isConnected && !isAlertActive) {
                    const now = Date.now();
                    if (now - lastRequest >= requestDelay) {
                        try {
                            await writeToCharacteristic('FSR');
                            lastRequest = now;
                        } catch (error) {
                            console.error('Error enviando comando FSR periódico:', error);
                        }
                    }
                }
            }, requestDelay);
        };

        const pauseMonitoring = () => {
            isAlertActive = true;
            if (monitoringInterval) {
                clearInterval(monitoringInterval);
            }
        };

        const resumeMonitoring = () => {
            isAlertActive = false;
            startMonitoring();
        };

        startMonitoring();

        return {
            cleanup: () => {
                if (unsubscribe) unsubscribe();
                if (monitoringInterval) clearInterval(monitoringInterval);
            },
            pauseMonitoring,
            resumeMonitoring
        };
    },

    monitorIMU: (writeToCharacteristic, subscribeToData, isConnected, onMovementDetected) => {
        let unsubscribe;
        let monitoringInterval = null;
        let lastRequest = 0;
        let prevAccX = 0, prevAccY = 0, prevAccZ = 0;
        const threshold = 0.2;
        const requestDelay = 500; 

        const startMonitoring = async () => {
            if (!isConnected) {
                console.log('No se puede monitorear IMU: dispositivo no conectado');
                return;
            }

            try {
                await writeToCharacteristic('IMU');
            } catch (error) {
                console.error('Error enviando comando IMU inicial:', error);
            }

            unsubscribe = subscribeToData(async (data) => {
                if (data.includes('IMU:')) {
                    console.log('Datos recibidos del IMU:', data);
                    const imuPart = data.split('IMU:')[1];
                    if (imuPart) {
                        const values = imuPart.split('\n')[0].split(',');
                        if (values.length >= 3) {
                            const ax = parseFloat(values[0]);
                            const ay = parseFloat(values[1]);
                            const az = parseFloat(values[2]);

                            if (!isNaN(ax) && !isNaN(ay) && !isNaN(az)) {
                                const movementDetected =
                                    Math.abs(ax - prevAccX) > threshold ||
                                    Math.abs(ay - prevAccY) > threshold ||
                                    Math.abs(az - prevAccZ) > threshold;

                                if (movementDetected) {
                                    onMovementDetected();
                                }

                                prevAccX = ax;
                                prevAccY = ay;
                                prevAccZ = az;
                            }
                        }
                    }
                }
            });

            monitoringInterval = setInterval(async () => {
                if (isConnected) {
                    const now = Date.now();
                    if (now - lastRequest >= requestDelay) {
                        try {
                            await writeToCharacteristic('IMU');
                            lastRequest = now;
                        } catch (error) {
                            console.error('Error enviando comando IMU periódico:', error);
                        }
                    }
                }
            }, requestDelay);
        };

        startMonitoring();

        return (newIsConnected) => {
            if (newIsConnected !== undefined) {
                isConnected = newIsConnected;
            }
            if (unsubscribe) {
                unsubscribe();
            }
            if (monitoringInterval) {
                clearInterval(monitoringInterval);
                monitoringInterval = null;
            }
        };
    },

    selectGame: async (writeToCharacteristic, isConnected, gameId) => {
        if (!isConnected || !gameId) return;
        try {
            await writeToCharacteristic(`GAME:${gameId}\n`);
            console.log(`Comando enviado: GAME:${gameId}\n`);
        } catch (error) {
            console.error('Error al seleccionar juego:', error);
        }
    },

    handleStatusAlert: async (writeToCharacteristic, isConnected, alert) => {
        if (!isConnected) return;

        try {
            const alertType = alert.type.toUpperCase();
            const alertLevel = alert.level.toUpperCase();
            await writeToCharacteristic(`ALERT:${alertType}:${alertLevel}\n`);
            console.log(`Alerta enviada al peluche: ${alertType} - ${alertLevel}`);
        } catch (error) {
            console.error('Error al enviar alerta al peluche:', error);
            throw error;
        }
    },
};