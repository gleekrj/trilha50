import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { UsersModule } from './modules/users/users.module';
import { PrismaModule } from './prisma/prisma.module';

/**
 * Módulo raiz: configuração, persistência e módulos de funcionalidade.
 */
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UsersModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
