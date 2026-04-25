import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { PasswordHasherService } from '../../common/services/password-hasher.service';
import { LoginDto } from './dto/login.dto';
import { LoginResponseModel } from './models/login-response.model';

/**
 * Casos de uso de autenticação (login por e-mail e senha).
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly passwordHasherService: PasswordHasherService,
  ) {}

  /**
   * Autentica por conta (`Account`) ou legado (`User` profissional).
   */
  async login(dto: LoginDto): Promise<LoginResponseModel> {
    const account = await this.prisma.account.findUnique({
      where: { email: dto.email },
      include: { company: true, professional: true },
    });
    if (account) {
      const isPasswordValid = await this.passwordHasherService.verifyPassword({
        passwordHash: account.passwordHash,
        password: dto.password,
      });
      if (!isPasswordValid) {
        throw new UnauthorizedException('E-mail ou senha incorretos');
      }
      if (account.company) {
        return new LoginResponseModel(
          'company',
          account.company.id,
          account.email,
          account.company.name,
        );
      }
      if (account.professional) {
        return new LoginResponseModel(
          'professional',
          account.professional.id,
          account.email,
          'Profissional',
        );
      }
      throw new UnauthorizedException('Conta sem perfil associado');
    }
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (user) {
      const isPasswordValid = await bcrypt.compare(
        dto.password,
        user.passwordHash,
      );
      if (!isPasswordValid) {
        throw new UnauthorizedException('E-mail ou senha incorretos');
      }
      return new LoginResponseModel(
        'professional',
        user.id,
        user.email,
        user.name,
      );
    }
    throw new UnauthorizedException('E-mail ou senha incorretos');
  }
}
