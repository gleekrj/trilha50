export async function parseApiError(response: Response): Promise<string> {
  const text: string = await response.text();
  let body: unknown;
  try {
    body = JSON.parse(text) as unknown;
  } catch {
    return 'Não foi possível concluir a operação.';
  }
  if (typeof body !== 'object' || body === null) {
    return 'Não foi possível concluir a operação.';
  }
  const message = (body as { message?: unknown }).message;
  if (Array.isArray(message)) {
    return message.filter((x): x is string => typeof x === 'string').join(' ');
  }
  if (typeof message === 'string') {
    return message;
  }
  return 'Não foi possível concluir a operação.';
}
