import React, { useRef, useCallback } from 'react';
import { Image, View, ScrollView, KeyboardAvoidingView, Platform, TextInput, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import api from '../../services/api';

import getValidationErrors from '../../utils/getValidationErrors';

import Input from '../../components/Input';
import Button from '../../components/Button';

import logoImg from '../../assets/logo.png';

import { Container, Title, BackToSignIn, BackToSignInText } from './styles';

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
}

const SignUp: React.FC = () => {
  /* Para disparar o subimit no form já que o react native não tem um botão submit*/
  const formRef = useRef<FormHandles>();

  const emailInputRef = useRef<TextInput>(null);

  const passwordInputRef = useRef<TextInput>(null);

  const navigation = useNavigation();

   // Lida com o submit e recebe como parâmetro os dados do formulário
   const handleSignUp = useCallback(
    async (data: SignUpFormData) => {
      try {
        formRef.current?.setErrors({});
        /**
         * object() - tipo que será validado
         * shape - defini valildação
         */
        const schema = Yup.object().shape({
          // <Campo a ser validado>: Yup.<tipo>.<validação>.<validação>
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um e-mail válido'),
          password: Yup.string().min(6, 'No mínimo 6 dígitos'),
        });
        // Realizando a validação
        await schema.validate(data, {
          /** Faz com que seja retornado
           * todos os erros de validação e
           * não somente o primeiro encontrado */
          abortEarly: false,
        });

        await api.post('/users', data);

        Alert.alert(
          'Cadastro realizado com sucesso!',
          'Você já pode fazer login na aplicação.',
        )

        /** Redireciona após o cadastro */
        navigation.navigate('SignIn');
      } catch (err) {
        /** Erros capturados */

        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        Alert.alert(
          'Erro no cadastro',
          'Ocorreu um erro ao fazer cadastro, cheque as credenciais.'
        );
      }
    },
    [navigation],
  );

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
              <Title>Crie sua conta</Title>
            </View>
            <Form ref={ formRef } onSubmit={handleSignUp}>
              <Input
                autoCapitalize="words"
                name="name"
                icon="user"
                placeholder="Nome"
                returnKeyType="next"
                onSubmitEditing={() => {
                  emailInputRef.current?.focus();
                }}
              />

              <Input
                ref={emailInputRef}
                keyboardType="email-address"
                autoCorrect={false}
                autoCapitalize="none"
                name="email"
                icon="mail"
                placeholder="E-mail"
                returnKeyType="next"
                onSubmitEditing={() => {
                  passwordInputRef.current?.focus();
                }}
              />

              <Input
                ref={passwordInputRef}
                secureTextEntry
                name="password"
                icon="lock"
                placeholder="Senha"
                /* Evitar sugestão de senha no IoS */
                textContentType="newPassword"
                returnKeyType="send"
                onSubmitEditing={() => formRef.current?.submitForm()}
              />

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
