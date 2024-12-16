// firebaseConfig.js

// Importa la función para inicializar Firebase
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from "firebase/firestore";

// Configuración de tu aplicación Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDXtmjGAa9lGO-80Qp2KGCecmUUejUj4VI",
  authDomain: "appfibonatix.firebaseapp.com",
  projectId: "appfibonatix",
  storageBucket: "appfibonatix.appspot.com",
  messagingSenderId: "538060749315",
  appId: "1:538060749315:web:f49f1431fa42345fa52c36",
  measurementId: "G-GZ2Z76MG18"
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
