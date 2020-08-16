import React, { useCallback, useRef } from 'react';
import { Image, View, ScrollView, KeyboardAvoidingView, Platform, TextInput, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import * as Yup from 'yup';

import { Form } from '@unform/mobile';
/* Tipagem com os métodos para manipular o formulário de maneira direta */
import { FormHandles } from '@unform/core';

import getValidationErrors from '../../utils/getValidationErrors'

import Input from '../../components/Input';
import Button from '../../components/Button';

import logoImg from '../../assets/logo.png';

import { Container, Title, ForgotPassword, ForgotPasswordText, CreateAccountButton, CreateAccountButtonText } from './styles';

interface SingInFormData {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  /*
  useRef- criada quando se deseja manipular o elemento de maneira direta e não através de um evento
  No caso para fazer o button dar submit no formulário
  */
  const formRef = useRef<FormHandles>(null);

  /* Quando for executar o foco ele já possue o método focus */
  const passwordInputRef = useRef<TextInput>(null);

  const navigation = useNavigation();

  // Lida com o submit e recebe como parâmetro os dados do formulário
  const handleSignIn = useCallback(
    async (data: SingInFormData) => {
      try {
        formRef.current?.setErrors({});
        /**
         * object() - tipo que será validado
         * shape - defini valildação
         */
        const schema = Yup.object().shape({
          // <Campo a ser validado>: Yup.<tipo>.<validação>.<validação>

          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um e-mail válido'),
          password: Yup.string().required('Senha obrigatória'),
        });
        // Realizando a validação
        await schema.validate(data, {
          /** Faz com que seja retornado
           * todos os erros de validação e
           * não somente o primeiro encontrado */
          abortEarly: false,
        });
        // await signIn({
        //   email: data.email,
        //   password: data.password,
        // });

        // history.push('/dashboard');
      } catch (err) {
        // Erros capturados
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        Alert.alert('Erro na autenticação', 'Ocorreu um erro ao fazer login, cheque as credenciais.')

      }
    },
    // variáveis externas devem ser colocadas neste array de dependência
    [],
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
