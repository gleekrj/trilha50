const USER_NAME_PATTERN = /^[\p{L}]+(?: [\p{L}]+)*$/u;
const COMPANY_NAME_PATTERN = /^[\p{L}]+(?:[ '\u2019][\p{L}]+)*$/u;

export function validateUserName(value: string): string | null {
  const trimmed: string = value.trim();
  if (!trimmed) {
    return 'Informe seu nome completo.';
  }
  if (trimmed.length > 120) {
    return 'Nome muito longo.';
  }
  if (!USER_NAME_PATTERN.test(trimmed)) {
    return 'Use apenas letras e espaços entre palavras.';
  }
  return null;
}

export function validateCompanyName(value: string): string | null {
  const trimmed: string = value.trim();
  if (!trimmed) {
    return 'Informe o nome da empresa.';
  }
  if (trimmed.length > 120) {
    return 'Nome muito longo.';
  }
  if (!COMPANY_NAME_PATTERN.test(trimmed)) {
    return 'Use apenas letras, espaços e apóstrofo entre palavras.';
  }
  return null;
}

export function validateEmail(value: string): string | null {
  const trimmed: string = value.trim();
  if (!trimmed) {
    return 'Informe o e-mail.';
  }
  if (trimmed.length > 254) {
    return 'E-mail muito longo.';
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return 'E-mail inválido.';
  }
  return null;
}

export function validatePassword(value: string): string | null {
  if (!value) {
    return 'Informe a senha.';
  }
  if (value.length < 6) {
    return 'A senha deve ter pelo menos 6 caracteres.';
  }
  if (value.length > 250) {
    return 'Senha muito longa.';
  }
  return null;
}
