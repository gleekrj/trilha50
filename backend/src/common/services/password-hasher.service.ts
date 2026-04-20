import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';

type VerifyPasswordInput = {
  readonly password: string;
  readonly passwordHash: string;
};

/**
 * Serviço de hash/verificação de senha com Argon2id.
 */
@Injectable()
export class PasswordHasherService {
  async hashPassword(password: string): Promise<string> {
    return argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 19456,
      timeCost: 2,
      parallelism: 1,
      hashLength: 32,
    });
  }

  async verifyPassword(input: VerifyPasswordInput): Promise<boolean> {
    return argon2.verify(input.passwordHash, input.password, {
      type: argon2.argon2id,
    });
  }
}

