import { normalizeUserName } from './user-name.util';

describe('normalizeUserName', () => {
  it('remove espaços no início e no fim', () => {
    expect(normalizeUserName('  Ana  ')).toBe('Ana');
  });

  it('colapsa múltiplos espaços internos em um único espaço', () => {
    expect(normalizeUserName('Maria    Silva')).toBe('Maria Silva');
  });

  it('combina trim e colapso', () => {
    expect(normalizeUserName('  João   Carlos  ')).toBe('João Carlos');
  });

  it('retorna string vazia quando só há espaços', () => {
    expect(normalizeUserName('   \t  ')).toBe('');
  });

  it('não altera valor não-string (para validadores posteriores)', () => {
    expect(normalizeUserName(null)).toBe(null);
    expect(normalizeUserName(42)).toBe(42);
    expect(normalizeUserName(undefined)).toBe(undefined);
  });
});
