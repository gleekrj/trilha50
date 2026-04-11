import { UpdateUserDto } from '../dto/update-user.dto';
import { UserModel } from '../models/user.model';
import { CreateUserPersistence } from './create-user.persistence';

export interface IUsersRepository {
  create(data: CreateUserPersistence): Promise<UserModel>;
  findAll(): Promise<UserModel[]>;
  findById(id: string): Promise<UserModel | null>;
  update(id: string, dto: UpdateUserDto): Promise<UserModel>;
  remove(id: string): Promise<void>;
}
