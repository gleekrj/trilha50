/**
 * Campos necessários para persistir um novo usuário (inclui hash da senha).
 */
export type CreateUserPersistence = {
  email: string;
  name: string;
  passwordHash: string;
};
