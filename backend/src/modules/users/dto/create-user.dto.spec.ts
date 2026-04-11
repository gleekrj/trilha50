import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

function dtoFromPlain(plain: Record<string, unknown>) {
  return plainToInstance(CreateUserDto, plain, {
    enableImplicitConversion: true,
    exposeDefaultValues: true,
  });
}

async function validateCreateUser(plain: Record<string, unknown>) {
  const dto = dtoFromPlain(plain);
  return validate(dto, { whitelist: true, forbidNonWhitelisted: true });
}

describe('CreateUserDto (regras de cadastro profissional 50+)', () => {
  const validBase = {
    name: 'Maria Silva',
    email: 'maria@exemplo.com',
    password: 'senha12',
  };

  it('aceita payload válido com todos os campos obrigatórios', async () => {
    const errors = await validateCreateUser({ ...validBase });
    expect(errors).toHaveLength(0);
  });

  it('normaliza nome: trim e espaços duplicados antes da validação de letras', async () => {
    const dto = dtoFromPlain({
      name: '  Maria    Silva  ',
      email: 'a@b.co',
      password: 'abcdef',
    });
    expect(dto.name).toBe('Maria Silva');
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('aceita letras com acentos (Unicode)', async () => {
    const errors = await validateCreateUser({
      ...validBase,
      name: 'José María Çağ',
    });
    expect(errors).toHaveLength(0);
  });

  it('rejeita nome vazio após normalização', async () => {
    const errors = await validateCreateUser({
      ...validBase,
      name: '   ',
    });
    expect(errors.length).toBeGreaterThan(0);
    const props = errors.map((e) => e.property);
    expect(props).toContain('name');
  });

  it('rejeita nome com dígitos', async () => {
    const errors = await validateCreateUser({
      ...validBase,
      name: 'João2',
    });
    expect(errors.some((e) => e.property === 'name')).toBe(true);
  });

  it('rejeita nome com pontuação ou símbolos', async () => {
    for (const name of ['Ana-Maria', "O'Brien", 'Silva@']) {
      const errors = await validateCreateUser({ ...validBase, name });
      expect(errors.some((e) => e.property === 'name')).toBe(true);
    }
  });

  it('rejeita e-mail inválido', async () => {
    const errors = await validateCreateUser({
      ...validBase,
      email: 'nao-e-email',
    });
    expect(errors.some((e) => e.property === 'email')).toBe(true);
  });

  it('rejeita e-mail acima de 254 caracteres', async () => {
    const local = 'a'.repeat(250);
    const errors = await validateCreateUser({
      ...validBase,
      email: `${local}@x.co`,
    });
    expect(errors.some((e) => e.property === 'email')).toBe(true);
  });

  it('rejeita senha com menos de 6 caracteres', async () => {
    const errors = await validateCreateUser({
      ...validBase,
      password: '12345',
    });
    expect(errors.some((e) => e.property === 'password')).toBe(true);
  });

  it('aceita senha com exatamente 6 caracteres', async () => {
    const errors = await validateCreateUser({
      ...validBase,
      password: '123456',
    });
    expect(errors).toHaveLength(0);
  });

  it('rejeita senha com mais de 250 caracteres', async () => {
    const errors = await validateCreateUser({
      ...validBase,
      password: 'x'.repeat(251),
    });
    expect(errors.some((e) => e.property === 'password')).toBe(true);
  });

  it('aceita senha com exatamente 250 caracteres', async () => {
    const errors = await validateCreateUser({
      ...validBase,
      password: 'x'.repeat(250),
    });
    expect(errors).toHaveLength(0);
  });

  it('rejeita nome ausente', async () => {
    const errors = await validateCreateUser({
      email: validBase.email,
      password: validBase.password,
    });
    expect(errors.some((e) => e.property === 'name')).toBe(true);
  });

  it('rejeita e-mail ausente', async () => {
    const errors = await validateCreateUser({
      name: validBase.name,
      password: validBase.password,
    });
    expect(errors.some((e) => e.property === 'email')).toBe(true);
  });

  it('rejeita senha ausente', async () => {
    const errors = await validateCreateUser({
      name: validBase.name,
      email: validBase.email,
    });
    expect(errors.some((e) => e.property === 'password')).toBe(true);
  });

  it('rejeita senha vazia', async () => {
    const errors = await validateCreateUser({
      ...validBase,
      password: '',
    });
    expect(errors.some((e) => e.property === 'password')).toBe(true);
  });

  it('rejeita nome acima de 120 caracteres (após normalização)', async () => {
    const name = `${'A'.repeat(60)} ${'B'.repeat(60)}`;
    expect(name.length).toBeGreaterThan(120);
    const errors = await validateCreateUser({ ...validBase, name });
    expect(errors.some((e) => e.property === 'name')).toBe(true);
  });
});
