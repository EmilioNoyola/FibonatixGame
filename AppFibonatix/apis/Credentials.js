// firebaseConfig.js

// Importa la función para inicializar Firebase
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from "firebase/firestore";

// Configuración de tu aplicación Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDPbEunOLHDzlIi5VDN7kp6RaNrRezv25M",
  authDomain: "appfibonatix.firebaseapp.com",
  projectId: "appfibonatix",
  storageBucket: "appfibonatix.firebasestorage.app",
  messagingSenderId: "538060749315",
  appId: "1:538060749315:web:f47dd6b3621db81ca52c36",
  measurementId: "G-TQX2SW422C"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Inicializa Firebase Auth con AsyncStorage para persistencia
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});


// Inicializa Firestore
const db = getFirestore(app);

// Exporta los servicios que vas a usar en otras partes de la app
export { auth, db }; // Exporta solo auth inicializado y db
export default app;
