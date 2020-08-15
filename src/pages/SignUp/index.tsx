import React, { useRef } from 'react';
import { Image, View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';

import Input from '../../components/Input';
import Button from '../../components/Button';

import logoImg from '../../assets/logo.png';

import { Container, Title, BackToSignIn, BackToSignInText } from './styles';

const SignUp: React.FC = () => {
  /* Para disparar o subimit no form já que o react native não tem um botão submit*/
  const formRef = useRef<FormHandles>();

  const navigation = useNavigation();

  return (
    <>
      {/* KeyboardAvoidingView - para que o teclado do IoS não fique por cima do app, mas empurre o app para cima */}
      {/* behavior={Platform.OS === 'ios' ? 'paddig' : undefined} - verfica o SO e aplica o paddig ao keyborad se for IoS */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'paddig' : undefined}
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
              <Title>Crie sua conta</Title>
            </View>
            <Form ref={ formRef } onSubmit={(data) => {console.log(data)}}>
              <Input name="name" icon="user" placeholder="Nome"/>
              <Input name="email" icon="mail" placeholder="E-mail"/>
              <Input name="password" icon="lock" placeholder="Senha"/>

              <Button onPress={() => {formRef.current?.submitForm();}}>Criar</Button>
            </Form>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>

      <BackToSignIn onPress={() => {navigation.goBack()}}>
        <Icon name="arrow-left" size={20} color="#fff" />

        <BackToSignInText>Voltar para logon</BackToSignInText>
      </BackToSignIn>
    </>
  );
}

export default SignUp;
