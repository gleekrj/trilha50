import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate, type ValidationError } from 'class-validator';
import { CreateCompanyDto } from './create-company.dto';

function dtoFromPlain(plain: Record<string, unknown>): CreateCompanyDto {
  return plainToInstance(CreateCompanyDto, plain, {
    enableImplicitConversion: true,
    exposeDefaultValues: true,
  });
}

async function validateCreateCompany(
  plain: Record<string, unknown>,
): Promise<ValidationError[]> {
  const dto = dtoFromPlain(plain);
  return validate(dto, { whitelist: true, forbidNonWhitelisted: true });
}

describe('CreateCompanyDto (validação de cadastro de empresa)', () => {
  const validBase = {
    name: "Empresa D'Ávila",
    email: 'contato@exemplo.com',
    password: 'senha12',
  };

  it('aceita payload válido com todos os campos obrigatórios', async () => {
    const errors = await validateCreateCompany({ ...validBase });
    expect(errors).toHaveLength(0);
  });

  it('normaliza nome: trim e espaços duplicados antes da validação', async () => {
    const dto = dtoFromPlain({
      name: "  Empresa   D'Ávila  ",
      email: 'a@b.co',
      password: 'abcdef',
    });
    expect(dto.name).toBe("Empresa D'Ávila");
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('aceita letras com acentos e cedilha (Unicode)', async () => {
    const errors = await validateCreateCompany({
      ...validBase,
      name: "Companhia São José da Conceição D'Ávila",
    });
    expect(errors).toHaveLength(0);
  });

  it('rejeita nome vazio após normalização', async () => {
    const errors = await validateCreateCompany({
      ...validBase,
      name: '   ',
    });
    expect(errors.length).toBeGreaterThan(0);
    const props = errors.map((e) => e.property);
    expect(props).toContain('name');
  });

  it('rejeita nome com dígitos', async () => {
    const errors = await validateCreateCompany({
      ...validBase,
      name: 'Empresa 2',
    });
    expect(errors.some((e) => e.property === 'name')).toBe(true);
  });

  it('rejeita nome com hífen, arroba ou pontuação não permitida', async () => {
    for (const name of ['Empresa-A', 'Empresa@A', 'Empresa, SA']) {
      const errors = await validateCreateCompany({ ...validBase, name });
      expect(errors.some((e) => e.property === 'name')).toBe(true);
    }
  });

  it('normaliza e-mail: trim + lowercase', async () => {
    const dto = dtoFromPlain({
      ...validBase,
      email: '  Contato@Exemplo.com  ',
    });
    expect(dto.email).toBe('contato@exemplo.com');
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('rejeita e-mail inválido', async () => {
    const errors = await validateCreateCompany({
      ...validBase,
      email: 'nao-e-email',
    });
    expect(errors.some((e) => e.property === 'email')).toBe(true);
  });

  it('rejeita senha com menos de 6 caracteres', async () => {
    const errors = await validateCreateCompany({
      ...validBase,
      password: '12345',
    });
    expect(errors.some((e) => e.property === 'password')).toBe(true);
  });

  it('rejeita senha com mais de 250 caracteres', async () => {
    const errors = await validateCreateCompany({
      ...validBase,
      password: 'x'.repeat(251),
    });
    expect(errors.some((e) => e.property === 'password')).toBe(true);
  });
});

