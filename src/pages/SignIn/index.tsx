import React, { useCallback, useRef } from 'react';
import { Image, View, ScrollView, KeyboardAvoidingView, Platform, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';

import { Form } from '@unform/mobile';
/* Tipagem com os métodos para manipular o formulário de maneira direta */
import { FormHandles } from '@unform/core';

import Input from '../../components/Input';
import Button from '../../components/Button';

import logoImg from '../../assets/logo.png';

import { Container, Title, ForgotPassword, ForgotPasswordText, CreateAccountButton, CreateAccountButtonText } from './styles';


const SignIn: React.FC = () => {
  /*
  useRef- criada quando se deseja manipular o elemento de maneira direta e não através de um evento
  No caso para fazer o button dar submit no formulário
  */
  const formRef = useRef<FormHandles>(null);

  /* Quando for executar o foco ele já possue o método focus */
  const passwordInputRef = useRef<TextInput>(null);

  const navigation = useNavigation();

  const handleSignIn = useCallback((data: object) => {
    console.log(data);
  }, []);

  return (
    <>
      {/* KeyboardAvoidingView - para que o teclado do IoS não fique por cima do app, mas empurre o app para cima */}
      {/* behavior={Platform.OS === 'ios' ? 'paddig' : undefined} - verfica o SO e aplica o paddig ao keyborad se for IoS */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
      >
        {/* keyboardShouldPersistTaps="handled" - ao clicar na scrollview o comportamento será o padrão do sistema */}
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flex: 1 }}
        >
          <Container>
            <Image source={logoImg} />

            {/* View utilizada apenas para realizar a animação correta do texto no IoS */}
            <View>
              <Title>Faça seu logon</Title>
            </View>
            <Form ref={formRef} onSubmit={handleSignIn}>
              <Input
                autoCorrect={false}
                autoCapitalize="none"
                keyboardType="email-address"
                name="email"
                icon="mail"
                placeholder="E-mail"
                /* Modifica o botão de enter */
                returnKeyType="next"
                /* Função disparada ao clicar no botão */
                onSubmitEditing={() => {
                  passwordInputRef.current.focus();
                }}
              />

              <Input
                ref={passwordInputRef}
                name="password"
                icon="lock"
                placeholder="Senha"
                /* Identificar campo de senha */
                secureTextEntry
                /* Modifica o botão de enter */
                returnKeyType="send"
                /* Função disparada ao clicar no botão */
                onSubmitEditing={() => {
                  formRef.current?.submitForm();
                }}
              />

              <Button
                onPress={() => {
                  formRef.current?.submitForm();
                }}
              >
                Entrar
              </Button>
            </Form>
            <ForgotPassword onPress={() => {}}>
              <ForgotPasswordText>
                Esqueci minha senha
              </ForgotPasswordText>
            </ForgotPassword>

          </Container>
        </ScrollView>
      </KeyboardAvoidingView>

      <CreateAccountButton onPress={() => {navigation.navigate('SignUp')}}>
        <Icon name="log-in" size={20} color="#ff9000" />

        <CreateAccountButtonText>Criar conta</CreateAccountButtonText>
      </CreateAccountButton>
    </>
  );
}

export default SignIn;
