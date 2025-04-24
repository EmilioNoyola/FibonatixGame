import React from 'react';
import './assets/services/Credentials'; // Importar Credentials primero para inicializar Firebase
import Navigation from './screens/Main/Navigation';
import { AppProvider } from './assets/context/AppContext';

export default function App() {
  return (
    <AppProvider>
      <Navigation />
    </AppProvider>
  );
}