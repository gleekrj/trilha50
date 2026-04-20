import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import { PasswordHasherService } from '../../common/services/password-hasher.service';
import { PRISMA_REQUEST_ERROR_CODE } from '../users/constants/prisma-request-error-code';
import { CreateCompanyDto } from './dto/create-company.dto';
import { CompanyModel } from './models/company.model';
import { ICompaniesRepository } from './repositories/companies.repository.interface';
import { COMPANIES_REPOSITORY } from './repositories/companies.repository.token';

/**
 * Serviço de aplicação dos casos de uso de empresa (criação).
 */
@Injectable()
export class CompaniesService {
  constructor(
    private readonly passwordHasherService: PasswordHasherService,
    @Inject(COMPANIES_REPOSITORY)
    private readonly companiesRepository: ICompaniesRepository,
  ) {}

  /**
   * Registra uma nova empresa com senha armazenada como hash (Argon2id).
   */
  async create(dto: CreateCompanyDto): Promise<CompanyModel> {
    const passwordHash = await this.passwordHasherService.hashPassword(
      dto.password,
    );
    try {
      return await this.companiesRepository.create({
        name: dto.name,
        email: dto.email,
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
}

