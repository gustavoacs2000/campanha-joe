# Pré-campanha Joe Valle

Landing page responsiva em Next.js para captação de contatos da pré-campanha.

## Desenvolvimento

```bash
npm install
npm run dev
```

## Variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha:

- `ENGAJABR_API_KEY`: chave privada usada exclusivamente no servidor pelo proxy `/api/register`.
- `NEXT_PUBLIC_WHATSAPP_COMMUNITY_URL`: link de convite da comunidade do WhatsApp. Enquanto estiver vazio, o botão aparece desabilitado.

No Vercel, cadastre as mesmas variáveis em **Project > Settings > Environment Variables**.

## EngajaBR

A integração segue a estrutura existente no commit `769a080` do repositório `gustavoacs2000/joe-valle`: o navegador envia nome e telefone para `/api/register`, e a rota server-side encaminha os dados para o EngajaBR usando `Authorization: Bearer <ENGAJABR_API_KEY>`.

Slug usado nesta landing page: `pre_campanha_joe`.

## LGPD

A página exige aceite explícito antes do envio e inclui uma rota `/termos`. O texto atual é uma base operacional e deve receber os dados definitivos do controlador/encarregado e revisão jurídica antes da publicação oficial.
