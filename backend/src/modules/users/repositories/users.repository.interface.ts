import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserModel } from '../models/user.model';

export interface IUsersRepository {
  create(dto: CreateUserDto): Promise<UserModel>;
  findAll(): Promise<UserModel[]>;
  findById(id: string): Promise<UserModel | null>;
  update(id: string, dto: UpdateUserDto): Promise<UserModel>;
  remove(id: string): Promise<void>;
}
