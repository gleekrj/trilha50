import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserModel } from '../models/user.model';
import { IUsersRepository } from './users.repository.interface';

@Injectable()
export class UsersRepository implements IUsersRepository {
  constructor(private readonly prisma: PrismaService) { }

  async create(dto: CreateUserDto): Promise<UserModel> {
    const row = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name ?? null,
      },
    });
    return UserModel.fromPrisma(row);
  }

  async findAll(): Promise<UserModel[]> {
    const rows = await this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return rows.map(UserModel.fromPrisma);
  }

  async findById(id: string): Promise<UserModel | null> {
    const row = await this.prisma.user.findUnique({ where: { id } });
    return row ? UserModel.fromPrisma(row) : null;
  }

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
    } catch {
      throw new NotFoundException(`Usuário ${id} não encontrado`);
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.user.delete({ where: { id } });
    } catch {
      throw new NotFoundException(`Usuário ${id} não encontrado`);
    }
  }
}
