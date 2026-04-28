import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { normalizeCompanyName } from '../utils/company-name.util';
import { normalizeEmail } from '../utils/email.util';

/**
 * Corpo da requisição para criação de empresa. Validado com class-validator.
 */
export class CreateCompanyDto {
  @Transform(({ value }) => normalizeCompanyName(value))
  @IsString()
  @IsNotEmpty()
  @Matches(/^[\p{L}]+(?:[ '\u2019][\p{L}]+)*$/u, {
    message:
      'O nome deve conter apenas letras, espaços simples e apóstrofo entre palavras',
  })
  @MaxLength(120)
  name: string;

  @Transform(({ value }) => normalizeEmail(value))
  @IsEmail()
  @MaxLength(254)
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(250)
  password: string;
}

