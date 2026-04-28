import type { User as PrismaUser } from '../../../generated/prisma/client';

/**
 * Modelo de domínio retornado pela camada de aplicação (não é DTO de entrada nem de saída).
 * O `passwordHash` é omitido de propósito para não aparecer em respostas JSON.
 */
export class UserModel {
  constructor(
    readonly id: string,
    readonly email: string,
    readonly name: string,
    readonly createdAt: Date,
    readonly updatedAt: Date,
  ) {}

  /**
   * Monta um `UserModel` a partir de uma linha `User` do Prisma.
   */
  static fromPrisma(row: PrismaUser): UserModel {
    return new UserModel(
      row.id,
      row.email,
      row.name,
      row.createdAt,
      row.updatedAt,
    );
  }
}
