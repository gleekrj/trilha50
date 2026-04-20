import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CompanyModel } from '../models/company.model';
import { CreateCompanyPersistence } from './create-company.persistence';
import { ICompaniesRepository } from './companies.repository.interface';

/**
 * Implementação de {@link ICompaniesRepository} com Prisma.
 */
@Injectable()
export class CompaniesRepository implements ICompaniesRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Persiste uma empresa e sua conta de acesso associada.
   */
  async create(data: CreateCompanyPersistence): Promise<CompanyModel> {
    const row = await this.prisma.company.create({
      data: {
        name: data.name,
        account: {
          create: {
            email: data.email,
            passwordHash: data.passwordHash,
          },
        },
      },
      include: {
        account: { select: { email: true } },
      },
    });
    return CompanyModel.fromPrisma(row);
  }
}

