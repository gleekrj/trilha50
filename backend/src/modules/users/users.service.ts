import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Prisma } from '../../generated/prisma/client';
import { PRISMA_REQUEST_ERROR_CODE } from './constants/prisma-request-error-code';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserModel } from './models/user.model';
import { IUsersRepository } from './repositories/users.repository.interface';
import { USERS_REPOSITORY } from './repositories/users.repository.token';

const BCRYPT_ROUNDS = 12;

/**
 * Serviço de aplicação dos casos de uso de usuário (criação, leitura, atualização e exclusão).
 */
@Injectable()
export class UsersService {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: IUsersRepository,
  ) {}

  /**
   * Registra um novo usuário com senha armazenada como hash.
   */
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
        e.code === PRISMA_REQUEST_ERROR_CODE.UNIQUE_CONSTRAINT_VIOLATION
      ) {
        throw new ConflictException('E-mail já cadastrado');
      }
      throw e;
    }
  }

  /**
   * Lista todos os usuários ordenados por data de criação (mais recentes primeiro).
   */
  findAll(): Promise<UserModel[]> {
    return this.usersRepository.findAll();
  }

  /**
   * Retorna um usuário pelo id ou lança exceção se não existir.
   */
  async findOne(id: string): Promise<UserModel> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`Usuário ${id} não encontrado`);
    }
    return user;
  }

  /**
   * Aplica atualizações parciais a um usuário.
   */
  async update(id: string, dto: UpdateUserDto): Promise<UserModel> {
    try {
      return await this.usersRepository.update(id, dto);
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === PRISMA_REQUEST_ERROR_CODE.UNIQUE_CONSTRAINT_VIOLATION
      ) {
        throw new ConflictException('E-mail já cadastrado');
      }
      throw e;
    }
  }

  /**
   * Remove um usuário pelo id.
   */
  remove(id: string): Promise<void> {
    return this.usersRepository.remove(id);
  }
}
