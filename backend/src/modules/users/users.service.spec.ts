import { ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Prisma } from '../../generated/prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UserModel } from './models/user.model';
import { IUsersRepository } from './repositories/users.repository.interface';
import { UsersService } from './users.service';

describe('UsersService (hash de senha e unicidade de e-mail)', () => {
  let service: UsersService;
  let repository: jest.Mocked<IUsersRepository>;

  const sampleUser = (): UserModel => {
    return new UserModel(
      'id-1',
      'a@b.co',
      'Nome',
      new Date('2026-01-01'),
      new Date('2026-01-01'),
    );
  };

  beforeEach(() => {
    repository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };
    service = new UsersService(repository);
  });

  describe('create', () => {
    it('persiste hash bcrypt da senha, nunca a senha em texto puro', async () => {
      repository.create.mockResolvedValue(sampleUser());

      const dto = {
        name: 'Maria',
        email: 'maria@exemplo.com',
        password: 'segredo12',
      } as CreateUserDto;

      await service.create(dto);

      expect(repository.create).toHaveBeenCalledTimes(1);
      const arg = repository.create.mock.calls[0][0];
      expect(arg.email).toBe(dto.email);
      expect(arg.name).toBe(dto.name);
      expect(arg.passwordHash).toMatch(/^\$2[aby]\$/);
      expect(arg.passwordHash).not.toContain('segredo');
      await expect(bcrypt.compare('segredo12', arg.passwordHash)).resolves.toBe(
        true,
      );
    });

    it('lança ConflictException quando o e-mail já existe (P2002)', async () => {
      repository.create.mockRejectedValue(
        new Prisma.PrismaClientKnownRequestError('Unique', {
          code: 'P2002',
          clientVersion: 'test',
        }),
      );

      await expect(
        service.create({
          name: 'A',
          email: 'dup@exemplo.com',
          password: '123456',
        } as CreateUserDto),
      ).rejects.toThrow(ConflictException);

      await expect(
        service.create({
          name: 'A',
          email: 'dup@exemplo.com',
          password: '123456',
        } as CreateUserDto),
      ).rejects.toMatchObject({
        response: { message: 'E-mail já cadastrado' },
      });
    });

    it('propaga outros erros do repositório', async () => {
      const boom = new Error('db indisponível');
      repository.create.mockRejectedValue(boom);

      await expect(
        service.create({
          name: 'A',
          email: 'a@b.co',
          password: '123456',
        } as CreateUserDto),
      ).rejects.toBe(boom);
    });
  });

  describe('update', () => {
    it('lança ConflictException em violação de unicidade de e-mail (P2002)', async () => {
      repository.update.mockRejectedValue(
        new Prisma.PrismaClientKnownRequestError('Unique', {
          code: 'P2002',
          clientVersion: 'test',
        }),
      );

      await expect(
        service.update('uuid', { email: 'outro@dup.com' }),
      ).rejects.toThrow(ConflictException);
    });
  });
});
