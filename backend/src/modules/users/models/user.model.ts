import type { User as PrismaUser } from '../../../generated/prisma/client';

/**
 * Modelo de domínio / persistência exposto pela camada de aplicação (não confundir com DTO de entrada/saída).
 * `passwordHash` não é mapeado de propósito para não vazar em respostas JSON.
 */
export class UserModel {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;

  static fromPrisma(row: PrismaUser): UserModel {
    const m = new UserModel();
    m.id = row.id;
    m.email = row.email;
    m.name = row.name;
    m.createdAt = row.createdAt;
    m.updatedAt = row.updatedAt;
    return m;
  }
}
