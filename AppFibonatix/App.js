import React from 'react';
import Navigation from './screens/Main/Navigation';
import { AppProvider } from './assets/db/AppContext';

export default function App() {
  return (
    <AppProvider>
      <Navigation />
    </AppProvider>
  );
}