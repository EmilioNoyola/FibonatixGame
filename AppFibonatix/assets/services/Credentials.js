// Configuración inicial de Firebase.
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyDPbEunOLHDzlIi5VDN7kp6RaNrRezv25M",
  authDomain: "appfibonatix.firebaseapp.com",
  projectId: "appfibonatix",
  storageBucket: "appfibonatix.firebasestorage.app",
  messagingSenderId: "538060749315",
  appId: "1:538060749315:web:f47dd6b3621db81ca52c36",
  measurementId: "G-TQX2SW422C"
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});


const db = getFirestore(app);

export { auth, db }; 
export default app;
