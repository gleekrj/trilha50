import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '../generated/prisma/client';

/**
 * Cliente Prisma gerenciado pelo Nest com hooks de ciclo de vida da conexão.
 */
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(configService: ConfigService) {
    const connectionString = configService.getOrThrow<string>('DATABASE_URL');
    const adapter = new PrismaMariaDb(connectionString);
    super({ adapter });
  }

  /**
   * Conecta ao banco quando a aplicação Nest inicia.
   */
  async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  /**
   * Desconecta do banco quando a aplicação Nest encerra.
   */
  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
