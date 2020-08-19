import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Dashboard from '../pages/Dashboard';

const App = createStackNavigator();

const AppRoutes: React.FC = () => (
  /** screenOptions - Opções para o header do navigator
   * headerShown - oculta o header
   * cardStyle estilos aplicados a cada rota
   */
  <App.Navigator
    screenOptions={{
      headerShown: true,
      cardStyle: { backgroundColor: '#312e38' },
    }}
  >
    <App.Screen name="Dashboard" component={Dashboard} />
  </App.Navigator>
);

export default AppRoutes;
