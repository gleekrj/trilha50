/**
 * Aplica trim e colapsa espaços internos; repassa não-strings para os validadores.
 */
export function normalizeUserName(value: unknown): unknown {
  if (typeof value !== 'string') return value;
  return value.trim().replace(/\s+/g, ' ');
}
