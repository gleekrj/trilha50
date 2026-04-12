import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { normalizeUserName } from '../utils/user-name.util';

/**
 * Corpo da requisição para atualização parcial de usuário. Validado com class-validator.
 */
export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  @MaxLength(254)
  email?: string;

  @IsOptional()
  @Transform(({ value }) => normalizeUserName(value))
  @IsString()
  @Matches(/^[\p{L}]+(?: [\p{L}]+)*$/u, {
    message:
      'O nome deve conter apenas letras e espaços simples entre palavras',
  })
  @MinLength(1)
  @MaxLength(120)
  name?: string;
}
