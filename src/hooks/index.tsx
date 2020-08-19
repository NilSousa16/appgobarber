import React from 'react';

import { AuthProvider } from './auth';

/** Componente para armazenar todos os contexto que serão utilizados no App */
const AppProvider: React.FC = ({ children }) => (
  <AuthProvider>
    {children}
  </AuthProvider>
);

export default AppProvider;
