import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { normalizeEmail } from '../../companies/utils/email.util';
import { normalizeUserName } from '../utils/user-name.util';

/**
 * Corpo da requisição para criação de usuário. Validado com class-validator.
 */
export class CreateUserDto {
  @Transform(({ value }) => normalizeUserName(value))
  @IsString()
  @IsNotEmpty()
  @Matches(/^[\p{L}]+(?: [\p{L}]+)*$/u, {
    message:
      'O nome deve conter apenas letras e espaços simples entre palavras',
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
