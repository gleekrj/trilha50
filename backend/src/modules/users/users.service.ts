import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Prisma } from '../../generated/prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserModel } from './models/user.model';
import { IUsersRepository } from './repositories/users.repository.interface';
import { USERS_REPOSITORY } from './repositories/users.repository.token';

const BCRYPT_ROUNDS = 12;

@Injectable()
export class UsersService {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: IUsersRepository,
  ) {}

  async create(dto: CreateUserDto): Promise<UserModel> {
    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);
    try {
      return await this.usersRepository.create({
        email: dto.email,
        name: dto.name,
        passwordHash,
      });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        throw new ConflictException('E-mail já cadastrado');
      }
      throw e;
    }
  }

  findAll(): Promise<UserModel[]> {
    return this.usersRepository.findAll();
  }

  async findOne(id: string): Promise<UserModel> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`Usuário ${id} não encontrado`);
    }
    return user;
  }

  async update(id: string, dto: UpdateUserDto): Promise<UserModel> {
    try {
      return await this.usersRepository.update(id, dto);
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        throw new ConflictException('E-mail já cadastrado');
      }
      throw e;
    }
  }

  remove(id: string): Promise<void> {
    return this.usersRepository.remove(id);
  }
}
