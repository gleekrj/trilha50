import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { normalizeUserName } from '../utils/user-name.util';

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

  @IsEmail()
  @MaxLength(254)
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(250)
  password: string;
}
