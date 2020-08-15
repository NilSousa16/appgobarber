import React, { useEffect, useRef } from 'react';
import { TextInputProps } from 'react-native';

/* Para registrar campos dentro do formulário */
import { useField } from '@unform/core';

import { Container, TextInput, Icon } from './styles';

interface InputProps extends TextInputProps {
  name: string;
  icon: string;
}

interface InputValueReference {
  value: string;
}

const Input: React.FC<InputProps> = ({ name, icon, ...rest }) => {

  const inputElementRef = useRef<any>(null);

  /* useField(<nome do input>) */
  const { registerField, defaultValue = '', fieldName, error } = useField(name);

  /* Referência do Input */
  const inputValueRef = useRef<InputValueReference>({ value: defaultValue });

  /* Será executado assim que exibido em tela e registrará o elemento no unform */
  useEffect(() => {
    /* Registro de campos */
    registerField({
      name: fieldName,
      /* Valor do input */
      ref: inputValueRef.current,
      /* Local do valor do input - no caso esta em value do inputValueRef */
      path: 'value',
      /* O que acontece se o unform tentar setar um valor de forma manual */
      /* ref - campos do TextInput */
      setValue(ref: any, value: string) {
        /* seta o valor do input */
        inputValueRef.current.value = value;
        /* Setar propriedade nativa do elemento */
        /* Responsável por mudar visualmento o texto do input */
        inputElementRef.current.setNativeProps({ text: value })
      },
      /* O que acontece como input quando o unform necessitar limpa-lo */
      clearValue() {
        /* Limpa o valor da referência */
        inputValueRef.current.value = "";
        /* Limpa o valor da tela */
        inputElementRef.current.clear();
      }
    })

  }, [fieldName, registerField]);

  return (
    <Container>
      <Icon name={icon} size={20} color="#666360" />

      <TextInput
        ref= { inputElementRef }
        keyboardAppearance="dark"
        placeholderTextColor="#666360"
        defaultValue= { defaultValue }
        /* Disparado sempre que houver um novo valor digitado dentro do input */
        /* A função pega o texto digitado(value) no input e preenche o value do inputValueRef */
        onChangeText={ value => {
          inputValueRef.current.value = value
        }}
        {...rest}
      />
    </Container>
  )
};

export default Input;
