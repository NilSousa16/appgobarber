/** Requisitado pelo react navigation */
import 'react-native-gesture-handler';

import React from 'react';
import { View, StatusBar, Text } from 'react-native';
/** Necessário ficar por volta da aplicação para prover o contexto das rotas */
import { NavigationContainer } from '@react-navigation/native';

import AppProvider from './hooks';

import Routes from './routes';

const App: React.FC = () => (
  <NavigationContainer>
    <StatusBar barStyle="light-content" backgroundColor="#312e38"/>
    <AppProvider>
      <View style={{flex: 1, backgroundColor: '#312e38'}} >
        <Routes />
      </View>
    </AppProvider>
  </NavigationContainer>
) ;

export default App;
