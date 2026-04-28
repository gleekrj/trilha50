import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../prisma/prisma.service';
import { PasswordHasherService } from '../../common/services/password-hasher.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  const prismaMock = {
    account: { findUnique: jest.fn() },
    user: { findUnique: jest.fn() },
  };
  const passwordHasherMock = {
    verifyPassword: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: PasswordHasherService, useValue: passwordHasherMock },
      ],
    }).compile();
    service = module.get(AuthService);
  });

  it('deve lançar quando não há conta nem usuário', async () => {
    prismaMock.account.findUnique.mockResolvedValue(null);
    prismaMock.user.findUnique.mockResolvedValue(null);
    await expect(
      service.login({
        email: 'a@b.co',
        password: 'secret12',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
