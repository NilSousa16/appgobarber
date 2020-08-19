import React, { createContext, useCallback, useState, useContext, useEffect } from 'react';
//import AsyncStorage from '@react-native-community/async-storage';
import { AsyncStorage } from 'react-native';
import api from '../services/api';

interface AuthState {
  token: string;
  user: object;
}

interface SingInCredentials {
  email: string;
  password: string;
}

interface AuthContextData {
  user: object;
  signIn(credentials: SingInCredentials): Promise<void>;
  signOut(): void;
}

// {} as AuthContext -  para inicializar o objeto vazio que é obrigatório
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

// children - tudo o que o elemento recebe como filho
export const AuthProvider: React.FC = ({ children }) => {
  // Armazena o estado de logado ou não
  const [data, setData] = useState<AuthState>({} as AuthState);

  // Necessário para verificar se os valores do storage para o usuário já estão preenchidos
  // Executa assim que o componente for carregado
  // useEffect não permite async de forma direta
  useEffect(() => {
    async function loadStoragedData(): Promise<void> {
      // Busca o token e user no localstorage do browser
      const [token, user] = await AsyncStorage.multiGet([
        '@GoBarber:token',
        '@GoBarber:user'
      ]);

      if(token[1] && user[1]){
        setData({ token: token[1], user: JSON.parse(user[1]) });
      }
    }

    loadStoragedData();
  }, []);

  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post('sessions', {
      email,
      password,
    });

    const { token, user } = response.data;

    // Armazenando o token e user no localstorage do browser
    // stringify - convertendo objeto ou valor em json
    await AsyncStorage.multiSet([
      ['@GoBarber:token', token],
      ['@GoBarber:user', JSON.stringify(user)]
    ]);

    setData({ token, user });
  }, []);

  const signOut = useCallback(async () => {
    AsyncStorage.multiRemove(['@GoBarber:token', '@GoBarber:user']);

    setData({} as AuthState);
  }, []);

  return (
    <AuthContext.Provider value={{ user: data.user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useauth must be used within an AuthProvider');
  }

  return context;
}
