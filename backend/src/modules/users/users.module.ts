import { Module } from '@nestjs/common';
import { UsersRepository } from './repositories/users.repository';
import { USERS_REPOSITORY } from './repositories/users.repository.token';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

/**
 * Módulo de usuários: controlador, serviço e vínculo do repositório.
 */
@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: USERS_REPOSITORY,
      useClass: UsersRepository,
    },
  ],
})
export class UsersModule {}
