import { API_BASE_URL } from '@/lib/api-base';
import { parseApiError } from '@/lib/parse-api-error';

type ApiResult<T> =
  | { readonly ok: true; readonly data: T }
  | { readonly ok: false; readonly error: string };

export async function apiPostJson<T>(
  path: string,
  body: unknown,
): Promise<ApiResult<T>> {
  const response: Response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const error: string = await parseApiError(response);
    return { ok: false, error };
  }
  const data = (await response.json()) as T;
  return { ok: true, data };
}
