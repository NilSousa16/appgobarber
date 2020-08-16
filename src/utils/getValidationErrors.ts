import { ValidationError } from 'yup';

// Chave pode ser qualquer coisa que seja string
// O valor pode ser qualquer coisa que seja string
// O 'key' e irrelevante
interface Errors {
  [key: string]: string;
}

export default function getValidationErrors(err: ValidationError): Errors {
  const validationErrors: Errors = {};

  err.inner.forEach(error => {
    validationErrors[error.path] = error.message;
  });

  return validationErrors;
}
