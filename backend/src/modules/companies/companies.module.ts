import { Module } from '@nestjs/common';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { COMPANIES_REPOSITORY } from './repositories/companies.repository.token';
import { CompaniesRepository } from './repositories/companies.repository';

/**
 * Módulo de empresas: controlador, serviço e vínculo do repositório.
 */
@Module({
  controllers: [CompaniesController],
  providers: [
    CompaniesService,
    {
      provide: COMPANIES_REPOSITORY,
      useClass: CompaniesRepository,
    },
  ],
})
export class CompaniesModule {}

