export const maxDuration = 15;

const ENGAJABR_URL = 'https://engajabr.com.br/api/landing-page/register';

export async function POST(request: Request) {
  const apiKey = process.env.ENGAJABR_API_KEY;
  if (!apiKey) {
    return Response.json(
      { success: false, message: 'Cadastro indisponível no momento. Tente novamente mais tarde.' },
      { status: 503 },
    );
  }

  const body = await request.json().catch(() => null);
  const name = typeof body?.name === 'string' ? body.name.trim() : '';
  const phone = typeof body?.phone === 'string' ? body.phone.replace(/\D/g, '') : '';
  const consent = body?.consent === true;

  if (name.length < 2 || phone.length < 10 || phone.length > 13 || !consent) {
    return Response.json(
      { success: false, message: 'Confira nome, telefone e aceite do termo de contato.' },
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
    return Response.json(data, { status: response.status });
  } catch (error) {
    console.error('EngajaBR registration error:', error);
    return Response.json(
      { success: false, message: 'Falha de conexão com o serviço de cadastro.' },
      { status: 502 },
    );
  }
}
