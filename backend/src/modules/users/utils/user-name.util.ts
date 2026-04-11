/** Trim, collapse internal spaces; pass through non-strings for validators. */
export function normalizeUserName(value: unknown): unknown {
  if (typeof value !== 'string') return value;
  return value.trim().replace(/\s+/g, ' ');
}
