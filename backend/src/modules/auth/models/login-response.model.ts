/**
 * Resposta de login autenticado (sem segredo nem hash).
 */
export class LoginResponseModel {
  constructor(
    readonly role: 'company' | 'professional',
    readonly id: string,
    readonly email: string,
    readonly displayName: string,
  ) {}
}
