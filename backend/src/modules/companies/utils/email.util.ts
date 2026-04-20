/**
 * Normaliza e-mail para lowercase e trim; repassa não-strings para os validadores.
 */
export function normalizeEmail(value: unknown): unknown {
  if (typeof value !== 'string') return value;
  return value.trim().toLowerCase();
}

