import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { CommonModule } from './common/common.module';
import { AuthModule } from './modules/auth/auth.module';
import { CompaniesModule } from './modules/companies/companies.module';
import { UsersModule } from './modules/users/users.module';
import { PrismaModule } from './prisma/prisma.module';

function getEnvFilePaths(): string[] {
  const nodeEnv = (process.env.NODE_ENV ?? 'development').toLowerCase();
  const envFileByNodeEnv: Record<string, string> = {
    development: '.env.development',
    dev: '.env.development',
    test: '.env.test',
    homol: '.env.homol',
    staging: '.env.homol',
    production: '.env.production',
    prod: '.env.production',
  };
  const envFilePath = envFileByNodeEnv[nodeEnv];
  if (typeof envFilePath === 'string' && envFilePath.length > 0) {
    return [envFilePath, '.env'];
  }
  return [`.env.${nodeEnv}`, '.env', '.env.development'];
}

/**
 * Módulo raiz: configuração, persistência e módulos de funcionalidade.
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: getEnvFilePaths(),
    }),
    CommonModule,
    PrismaModule,
    CompaniesModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
