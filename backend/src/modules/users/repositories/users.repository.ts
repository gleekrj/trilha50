import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../../generated/prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { PRISMA_REQUEST_ERROR_CODE } from '../constants/prisma-request-error-code';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserModel } from '../models/user.model';
import { CreateUserPersistence } from './create-user.persistence';
import { IUsersRepository } from './users.repository.interface';

/**
 * Implementação de {@link IUsersRepository} com Prisma.
 */
@Injectable()
export class UsersRepository implements IUsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Persiste um novo usuário.
   */
  async create(data: CreateUserPersistence): Promise<UserModel> {
    const row = await this.prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        passwordHash: data.passwordHash,
      },
    });
    return UserModel.fromPrisma(row);
  }

  /**
   * Lista todos os usuários.
   */
  async findAll(): Promise<UserModel[]> {
    const rows = await this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return rows.map(UserModel.fromPrisma);
  }

  /**
   * Busca usuário por id ou retorna `null`.
   */
  async findById(id: string): Promise<UserModel | null> {
    const row = await this.prisma.user.findUnique({ where: { id } });
    return row ? UserModel.fromPrisma(row) : null;
  }

  /**
   * Atualiza campos do usuário.
   */
  async update(id: string, dto: UpdateUserDto): Promise<UserModel> {
    try {
      const row = await this.prisma.user.update({
        where: { id },
        data: {
          ...(dto.email !== undefined && { email: dto.email }),
          ...(dto.name !== undefined && { name: dto.name }),
        },
      });
      return UserModel.fromPrisma(row);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === PRISMA_REQUEST_ERROR_CODE.RECORD_NOT_FOUND) {
          throw new NotFoundException(`Usuário ${id} não encontrado`);
        }
        throw e;
      }
      throw e;
    }
  }

  /**
   * Remove o usuário pelo id.
   */
  async remove(id: string): Promise<void> {
    try {
      await this.prisma.user.delete({ where: { id } });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === PRISMA_REQUEST_ERROR_CODE.RECORD_NOT_FOUND
      ) {
        throw new NotFoundException(`Usuário ${id} não encontrado`);
      }
      throw e;
    }
  }
}
