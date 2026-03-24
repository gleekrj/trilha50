import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserModel } from './models/user.model';
import { IUsersRepository } from './repositories/users.repository.interface';
import { USERS_REPOSITORY } from './repositories/users.repository.token';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: IUsersRepository,
  ) { }

  create(dto: CreateUserDto): Promise<UserModel> {
    return this.usersRepository.create(dto);
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

  update(id: string, dto: UpdateUserDto): Promise<UserModel> {
    return this.usersRepository.update(id, dto);
  }

  remove(id: string): Promise<void> {
    return this.usersRepository.remove(id);
  }
}
