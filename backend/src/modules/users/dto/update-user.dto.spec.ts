import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { UpdateUserDto } from './update-user.dto';

function dtoFromPlain(plain: Record<string, unknown>) {
  return plainToInstance(UpdateUserDto, plain, {
    enableImplicitConversion: true,
    exposeDefaultValues: true,
  });
}

async function validateUpdateUser(plain: Record<string, unknown>) {
  const dto = dtoFromPlain(plain);
  return validate(dto, { whitelist: true, forbidNonWhitelisted: true });
}

describe('UpdateUserDto (nome e e-mail opcionais, mesmas regras quando informados)', () => {
  it('aceita objeto vazio (nenhum campo)', async () => {
    const errors = await validateUpdateUser({});
    expect(errors).toHaveLength(0);
  });

  it('normaliza nome quando enviado', async () => {
    const dto = dtoFromPlain({ name: '  Ana   Paula  ' });
    expect(dto.name).toBe('Ana Paula');
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('rejeita nome inválido quando enviado', async () => {
    const errors = await validateUpdateUser({ name: 'X1' });
    expect(errors.some((e) => e.property === 'name')).toBe(true);
  });

  it('rejeita e-mail inválido quando enviado', async () => {
    const errors = await validateUpdateUser({ email: 'invalid' });
    expect(errors.some((e) => e.property === 'email')).toBe(true);
  });
});
