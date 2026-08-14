export const maxDuration = 15;

const ENGAJABR_URL = 'https://engajabr.com.br/api/landing-page/register';

function getApiMessages(data: unknown) {
  if (!data || typeof data !== 'object') return [];

  const payload = data as Record<string, unknown>;
  const messages: string[] = [];
  const errors = payload.errors;

  if (errors && typeof errors === 'object') {
    for (const value of Object.values(errors as Record<string, unknown>)) {
      if (typeof value === 'string' && value.trim()) {
        messages.push(value.trim());
      } else if (Array.isArray(value)) {
        for (const item of value) {
          if (typeof item === 'string' && item.trim()) messages.push(item.trim());
        }
      }
    }
  }

  for (const value of [payload.message, payload.error, payload.detail]) {
    if (typeof value === 'string' && value.trim()) messages.push(value.trim());
  }

  return messages;
}

function isDuplicateRegistration(status: number, messages: string[]) {
  if (status === 409) return true;

  const normalized = messages
    .join(' ')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

  return [
    'ja cadastrad',
    'ja registrado',
    'ja existe',
    'already registered',
    'already exists',
    'duplicate',
    'duplicado',
  ].some((term) => normalized.includes(term));
}

export async function POST(request: Request) {
  const apiKey = process.env.ENGAJABR_API_KEY;
  if (!apiKey) {
    return Response.json(
      { success: false, code: 'SERVICE_UNAVAILABLE', message: 'Cadastro indisponível no momento. Tente novamente mais tarde.' },
      { status: 503 },
    );
  }

  const body = await request.json().catch(() => null);
  const name = typeof body?.name === 'string' ? body.name.trim() : '';
  const phone = typeof body?.phone === 'string' ? body.phone.replace(/\D/g, '') : '';
  const consent = body?.consent === true;

  if (name.length < 2 || phone.length < 10 || phone.length > 13 || !consent) {
    return Response.json(
      { success: false, code: 'INVALID_DATA', message: 'Confira nome, telefone e aceite do termo de contato.' },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(ENGAJABR_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        phone,
        landing_page_slug: 'pre_campanha_joe',
      }),
      cache: 'no-store',
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const apiMessages = getApiMessages(data);

      if (isDuplicateRegistration(response.status, apiMessages)) {
        return Response.json(
          {
            success: false,
            code: 'ALREADY_REGISTERED',
            message: 'Este telefone já está cadastrado.',
          },
          { status: 409 },
        );
      }

      return Response.json(
        {
          success: false,
          code: 'REGISTRATION_FAILED',
          message: apiMessages[0] || 'Não foi possível concluir o cadastro. Confira os dados e tente novamente.',
        },
        { status: response.status },
      );
    }

    return Response.json(data, { status: response.status });
  } catch (error) {
    console.error('EngajaBR registration error:', error);
    return Response.json(
      { success: false, code: 'UPSTREAM_CONNECTION_ERROR', message: 'Falha de conexão com o serviço de cadastro. Tente novamente.' },
      { status: 502 },
    );
  }
}
