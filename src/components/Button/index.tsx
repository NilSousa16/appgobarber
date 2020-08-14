import React from 'react';
import {RectButtonProperties} from 'react-native-gesture-handler';

import { Container, ButtonText } from './styles';

/** Para pegar o onPress, redefine o children como string e obrigatório */
interface ButtonProps extends RectButtonProperties {
  children: string;
}

/** ...rest - repassa as demais propriedades */
const Button: React.FC<ButtonProps> = ({ children, ...rest}) => (
  /** Passando as propriedade do rectbutton para o container */
  <Container {...rest}>
    <ButtonText>{ children }</ButtonText>
  </Container>
);

export default Button;
