import { Company, type Account } from '../../../generated/prisma/client';

type CompanyWithAccount = Company & { readonly account: Pick<Account, 'email'> };

/**
 * Modelo de saída da API para empresa (sem dados sensíveis).
 */
export class CompanyModel {
  readonly id: string;

  readonly name: string;

  readonly email: string;

  readonly createdAt: Date;

  readonly updatedAt: Date;

  private constructor(input: CompanyModel) {
    this.id = input.id;
    this.name = input.name;
    this.email = input.email;
    this.createdAt = input.createdAt;
    this.updatedAt = input.updatedAt;
  }

  static fromPrisma(row: CompanyWithAccount): CompanyModel {
    return new CompanyModel({
      id: row.id,
      name: row.name,
      email: row.account.email,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}

