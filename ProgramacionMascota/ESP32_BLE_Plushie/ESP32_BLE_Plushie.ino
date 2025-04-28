#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>
#include <Wire.h>
#include <MPU6050.h>

// Pines para los LEDs RGB (ánodo común)
const int ledRojo1 = 16;  // LED 1: Rojo
const int ledVerde1 = 17; // LED 1: Verde
const int ledAzul1 = 18;  // LED 1: Azul
// Pines para los otros LEDs (puedes conectarlos después)
const int ledRojo2 = 19;  const int ledVerde2 = 21;  const int ledAzul2 = 22;
const int ledRojo3 = 23;  const int ledVerde3 = 25;  const int ledAzul3 = 26;
const int ledRojo4 = 27;  const int ledVerde4 = 32;  const int ledAzul4 = 33;
const int ledRojo5 = 12;  const int ledVerde5 = 13;  const int ledAzul5 = 14;

// Pines para los motores de vibración
const int motor1 = 5;  // Motor 1
const int motor2 = 4;  // Motor 2
const int motor3 = 2;  // Motor 3

// Pin para el sensor FSR
const int fsrPin = 34;

// MPU6050
MPU6050 mpu;

// UUIDs para el servicio y las características
#define SERVICE_UUID        "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
#define LED_CHARACTERISTIC_UUID "beb5483e-36e1-4688-b7f5-ea07361b26a8"
#define MOTOR_CHARACTERISTIC_UUID "1c95d5e3-d8f7-4132-a0dc-23311b4bd1b8"
#define FSR_CHARACTERISTIC_UUID "9e3b5e5b-6c1f-4e6b-9e6d-fb5e5e5b6c1f"
#define IMU_CHARACTERISTIC_UUID "a4e5b7c2-8d3e-4f7a-b1e2-c3d5e7f9a1b2"

BLECharacteristic *pLedCharacteristic;
BLECharacteristic *pMotorCharacteristic;
BLECharacteristic *pFsrCharacteristic;
BLECharacteristic *pImuCharacteristic;

void setup() {
  Serial.begin(115200);

  // Configurar pines de los LEDs como salidas
  pinMode(ledRojo1, OUTPUT);
  pinMode(ledVerde1, OUTPUT);
  pinMode(ledAzul1, OUTPUT);
  pinMode(ledRojo2, OUTPUT);
  pinMode(ledVerde2, OUTPUT);
  pinMode(ledAzul2, OUTPUT);
  pinMode(ledRojo3, OUTPUT);
  pinMode(ledVerde3, OUTPUT);
  pinMode(ledAzul3, OUTPUT);
  pinMode(ledRojo4, OUTPUT);
  pinMode(ledVerde4, OUTPUT);
  pinMode(ledAzul4, OUTPUT);
  pinMode(ledRojo5, OUTPUT);
  pinMode(ledVerde5, OUTPUT);
  pinMode(ledAzul5, OUTPUT);

  // Apagar todos los LEDs al inicio (HIGH = apagado para ánodo común)
  digitalWrite(ledRojo1, HIGH);
  digitalWrite(ledVerde1, HIGH);
  digitalWrite(ledAzul1, HIGH);
  digitalWrite(ledRojo2, HIGH);
  digitalWrite(ledVerde2, HIGH);
  digitalWrite(ledAzul2, HIGH);
  digitalWrite(ledRojo3, HIGH);
  digitalWrite(ledVerde3, HIGH);
  digitalWrite(ledAzul3, HIGH);
  digitalWrite(ledRojo4, HIGH);
  digitalWrite(ledVerde4, HIGH);
  digitalWrite(ledAzul4, HIGH);
  digitalWrite(ledRojo5, HIGH);
  digitalWrite(ledVerde5, HIGH);
  digitalWrite(ledAzul5, HIGH);

  // Configurar pines de los motores como salidas
  pinMode(motor1, OUTPUT);
  pinMode(motor2, OUTPUT);
  pinMode(motor3, OUTPUT);
  digitalWrite(motor1, LOW);
  digitalWrite(motor2, LOW);
  digitalWrite(motor3, LOW);

  // Inicializar el MPU6050
  Wire.begin();
  mpu.initialize();
  if (!mpu.testConnection()) {
    Serial.println("MPU6050 connection failed");
  }

  // Inicializar BLE
  BLEDevice::init("ShurtlePlushie");
  BLEServer *pServer = BLEDevice::createServer();
  BLEService *pService = pServer->createService(SERVICE_UUID);

  // Característica para controlar los LEDs
  pLedCharacteristic = pService->createCharacteristic(
    LED_CHARACTERISTIC_UUID,
    BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_WRITE
  );
  pLedCharacteristic->setValue("0,0,0,0,0,0,0,0,0,0,0,0,0,0,0"); // 15 valores (5 LEDs x 3 colores)

  // Característica para controlar los motores
  pMotorCharacteristic = pService->createCharacteristic(
    MOTOR_CHARACTERISTIC_UUID,
    BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_WRITE
  );
  pMotorCharacteristic->setValue("0,0,0"); // 3 valores (3 motores)

  // Característica para leer el sensor FSR
  pFsrCharacteristic = pService->createCharacteristic(
    FSR_CHARACTERISTIC_UUID,
    BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_NOTIFY
  );
  pFsrCharacteristic->addDescriptor(new BLE2902());
  pFsrCharacteristic->setValue("0");

  // Característica para leer el IMU
  pImuCharacteristic = pService->createCharacteristic(
    IMU_CHARACTERISTIC_UUID,
    BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_NOTIFY
  );
  pImuCharacteristic->addDescriptor(new BLE2902());
  pImuCharacteristic->setValue("0,0,0,0,0,0"); // accelX, accelY, accelZ, gyroX, gyroY, gyroZ

  // Iniciar el servicio BLE
  pService->start();
  pServer->getAdvertising()->start();
  Serial.println("BLE device is ready to connect");
}

void loop() {
  // Leer y manejar comandos para los LEDs
  std::string ledValue = pLedCharacteristic->getValue();
  if (ledValue.length() > 0) {
    int ledValues[15];
    char *token = strtok(const_cast<char*>(ledValue.c_str()), ",");
    int i = 0;
    while (token != NULL && i < 15) {
      ledValues[i++] = atoi(token);
      token = strtok(NULL, ",");
    }

    // LED 1 (Rojo, Verde, Azul)
    digitalWrite(ledRojo1, ledValues[0] ? LOW : HIGH);
    digitalWrite(ledVerde1, ledValues[1] ? LOW : HIGH);
    digitalWrite(ledAzul1, ledValues[2] ? LOW : HIGH);
    // LED 2
    digitalWrite(ledRojo2, ledValues[3] ? LOW : HIGH);
    digitalWrite(ledVerde2, ledValues[4] ? LOW : HIGH);
    digitalWrite(ledAzul2, ledValues[5] ? LOW : HIGH);
    // LED 3
    digitalWrite(ledRojo3, ledValues[6] ? LOW : HIGH);
    digitalWrite(ledVerde3, ledValues[7] ? LOW : HIGH);
    digitalWrite(ledAzul3, ledValues[8] ? LOW : HIGH);
    // LED 4
    digitalWrite(ledRojo4, ledValues[9] ? LOW : HIGH);
    digitalWrite(ledVerde4, ledValues[10] ? LOW : HIGH);
    digitalWrite(ledAzul4, ledValues[11] ? LOW : HIGH);
    // LED 5
    digitalWrite(ledRojo5, ledValues[12] ? LOW : HIGH);
    digitalWrite(ledVerde5, ledValues[13] ? LOW : HIGH);
    digitalWrite(ledAzul5, ledValues[14] ? LOW : HIGH);
  }

  // Leer y manejar comandos para los motores
  std::string motorValue = pMotorCharacteristic->getValue();
  if (motorValue.length() > 0) {
    int motorValues[3];
    char *token = strtok(const_cast<char*>(motorValue.c_str()), ",");
    int i = 0;
    while (token != NULL && i < 3) {
      motorValues[i++] = atoi(token);
      token = strtok(NULL, ",");
    }
    digitalWrite(motor1, motorValues[0] ? HIGH : LOW);
    digitalWrite(motor2, motorValues[1] ? HIGH : LOW);
    digitalWrite(motor3, motorValues[2] ? HIGH : LOW);
  }

  // Leer el sensor FSR y notificar
  int fsrValue = analogRead(fsrPin);
  char fsrStr[10];
  sprintf(fsrStr, "%d", fsrValue);
  pFsrCharacteristic->setValue(fsrStr);
  pFsrCharacteristic->notify();

  // Leer el IMU y notificar
  int16_t ax, ay, az, gx, gy, gz;
  mpu.getMotion6(&ax, &ay, &az, &gx, &gy, &gz);
  char imuStr[50];
  sprintf(imuStr, "%d,%d,%d,%d,%d,%d", ax, ay, az, gx, gy, gz);
  pImuCharacteristic->setValue(imuStr);
  pImuCharacteristic->notify();

  delay(100); // Pequeña pausa para evitar saturar el loop
}