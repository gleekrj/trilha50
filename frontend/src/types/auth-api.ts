export type LoginResponseBody = {
  readonly role: 'company' | 'professional';
  readonly id: string;
  readonly email: string;
  readonly displayName: string;
};
