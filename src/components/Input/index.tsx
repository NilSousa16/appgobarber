/* useImperativeHandle - para passar a funcionalidade de um componente interno para um componente pai */
import React, { useState, useCallback, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
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

interface InputRef {
  focus(): void;
}

/* RefForwardingComponent<{tipo da ref}, ...> - Necessário para receber referências, no caso o ref, já que o FC não recebe referências por padrão  */
const Input: React.RefForwardingComponent<InputRef, InputProps> = ({ name, icon, ...rest }, ref) => {

  const inputElementRef = useRef<any>(null);

  /* useField(<nome do input>) */
  const { registerField, defaultValue = '', fieldName, error } = useField(name);

  /* Referência do Input */
  const inputValueRef = useRef<InputValueReference>({ value: defaultValue });

  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
  }, [])

  const handleInputBlur = useCallback(() => {
    setIsFocused(false);

    setIsFilled(!!inputValueRef.current.value);

  }, [])

  /* Recebe a ref e uma função que retorna os parâmetros a serem jogados dentro da ref */
  /* Injeta a função focus dentro da ref */
  useImperativeHandle(ref, () => ({
    /* Estou repassando a função com o parâmetro desejado */
    focus() {
      inputElementRef.current.focus();
    }
  }));

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
    <Container isFocused={isFocused} isErrored={!!error}>
      <Icon
        name={icon}
        size={20}
        color={isFocused || isFilled ? '#ff9000' : '#666360'}
      />

      <TextInput
        ref= { inputElementRef }
        keyboardAppearance="dark"
        placeholderTextColor="#666360"
        defaultValue= { defaultValue }
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
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
/* forwardRef - necessário a uso do forwardRef ao utilizar RefForwardingComponent */
export default forwardRef(Input);
