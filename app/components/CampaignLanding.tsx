'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';

const INSTAGRAM_URL = 'https://www.instagram.com/joevalleoficial/';
const TIKTOK_URL = 'https://www.tiktok.com/@joe.valle.malunga?_r=1&_t=ZS-98rMjdKcK5S';
const WHATSAPP_URL = process.env.NEXT_PUBLIC_WHATSAPP_COMMUNITY_URL || '';
const JOE_IMAGE_URL = '/joe-valle-aprovado.webp';

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.25" />
      <circle cx="17.35" cy="6.65" r="1" className="fill-current stroke-none" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg className="whatsapp-mark" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12.04 2C6.52 2 2.04 6.48 2.04 12c0 1.76.46 3.48 1.33 5L2 22l5.12-1.34A9.96 9.96 0 0 0 12.04 22C17.56 22 22 17.52 22 12S17.56 2 12.04 2Zm0 18.18c-1.55 0-3.06-.42-4.38-1.22l-.31-.18-3.04.8.81-2.96-.2-.32a8.15 8.15 0 1 1 7.12 3.88Zm4.47-6.09c-.24-.12-1.45-.72-1.68-.8-.23-.08-.4-.12-.57.12-.17.24-.65.8-.8.97-.15.17-.29.19-.53.06-.24-.12-1.03-.38-1.96-1.2-.72-.64-1.45-1.44-1.7-.24-.24-.03-.37.09-.49.11-.11.24-.29.37-.43.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.43-.06-.12-.57-1.38-.78-1.89-.21-.5-.42-.43-.57-.44h-.49c-.17 0-.43.06-.66.3-.23.24-.87.85-.87 2.08 0 1.22.89 2.4 1.01 2.56.12.16 1.75 2.67 4.24 3.74.59.26 1.06.41 1.42.52.6.19 1.14.16 1.57.1.48-.07 1.45-.59 1.65-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28Z" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M14.4 3v10.3a4.4 4.4 0 1 1-3.7-4.3v3a1.6 1.6 0 1 0 .9 1.4V3h2.8Zm0 0c.3 2.2 1.7 3.8 4.2 4.3v2.8a8.6 8.6 0 0 1-4.2-1.5" />
    </svg>
  );
}

function SocialLinks() {
  return (
    <div className="social-links" aria-label="Redes sociais do Joe Valle">
      <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" aria-label="Instagram do Joe Valle">
        <InstagramIcon />
      </a>
      {WHATSAPP_URL ? (
        <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" aria-label="Comunidade do Joe Valle no WhatsApp">
          <WhatsAppIcon />
        </a>
      ) : (
        <span className="social-placeholder" aria-label="WhatsApp">
          <WhatsAppIcon />
        </span>
      )}
      <a href={TIKTOK_URL} target="_blank" rel="noreferrer" aria-label="TikTok do Joe Valle">
        <TikTokIcon />
      </a>
    </div>
  );
}

function CampaignCopy() {
  return (
    <>
      <h1 className="campaign-title">
        <span>Chegou a hora</span>
        <strong>de voltarmos</strong>
        <strong>a caminhar</strong>
        <em>juntos.</em>
      </h1>
      <p className="campaign-copy">
        As redes sociais podem e vão fazer a diferença nesta nossa caminhada coletiva. Participe e siga as nossas
        orientações. Juntos vamos lutar pelo cerrado, pela sustentabilidade, pela ética na política e pela energia
        limpa. Vamos cuidar desta cidade juntos.
      </p>
      <SocialLinks />
    </>
  );
}

function SignupForm() {
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const phone = String(data.get('phone') || '').replace(/\D/g, '');
    const accepted = data.get('consent') === 'on';

    if (name.length < 2) {
      setError('Informe seu nome.');
      return;
    }
    if (phone.length < 10 || phone.length > 13) {
      setError('Informe um telefone válido com DDD.');
      return;
    }
    if (!accepted) {
      setError('Você precisa aceitar o termo de contato para continuar.');
      return;
    }

    setSending(true);
    setError('');

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, consent: true }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || result?.success === false) {
        throw new Error(result?.message || 'Não foi possível concluir o cadastro.');
      }
      setDone(true);
      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha de conexão. Tente novamente.');
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="form-card" aria-labelledby="form-title">
      <div className="form-heading">
        <div className="form-logo-text" aria-label="Volta Joe"><span>Volta</span><strong>Joe</strong></div>
        <h2 id="form-title">
          Participe desse <span>novo começo!</span>
        </h2>
      </div>
      <p className="form-intro">Deixe seus dados e receba todas as novidades do nosso movimento.</p>

      {done ? (
        <div className="success" role="status">
          <strong>Cadastro realizado.</strong>
          <span>Obrigado por participar desse novo começo.</span>
          {WHATSAPP_URL && (
            <a className="whatsapp-button" href={WHATSAPP_URL} target="_blank" rel="noreferrer">
              <WhatsAppIcon /> Entrar na comunidade do WhatsApp
            </a>
          )}
        </div>
      ) : (
        <form onSubmit={submit} className="signup-form">
          <label>
            <span>Nome</span>
            <input type="text" name="name" autoComplete="name" placeholder="Digite seu nome completo" required />
          </label>
          <label>
            <span>Telefone</span>
            <input
              type="tel"
              name="phone"
              autoComplete="tel"
              inputMode="tel"
              placeholder="(00) 00000-0000"
              required
            />
          </label>
          <label className="consent-row">
            <input type="checkbox" name="consent" required />
            <span>
              Autorizo o uso dos meus dados para contato sobre o movimento e outras comunicações relacionadas, nos
              termos da LGPD. Li e aceito o <Link href="/termos">termo de aceite</Link>.
            </span>
          </label>
          {error && <p className="form-error">{error}</p>}
          <button className="submit-button" type="submit" disabled={sending}>
            <span className="send-icon" aria-hidden="true">➤</span>
            {sending ? 'Enviando...' : 'Quero me inscrever'}
          </button>
        </form>
      )}

      {!done && (
        <a
          className={`whatsapp-button ${WHATSAPP_URL ? '' : 'is-disabled'}`}
          href={WHATSAPP_URL || undefined}
          target={WHATSAPP_URL ? '_blank' : undefined}
          rel={WHATSAPP_URL ? 'noreferrer' : undefined}
          aria-disabled={!WHATSAPP_URL}
          onClick={(event) => {
            if (!WHATSAPP_URL) event.preventDefault();
          }}
        >
          <WhatsAppIcon /> Quero entrar na comunidade do WhatsApp
        </a>
      )}

      <p className="privacy-note">🔒 Seus dados estão protegidos. Não compartilhamos suas informações.</p>
    </section>
  );
}

export default function CampaignLanding() {
  return (
    <main className="campaign-page">
      <section className="desktop-layout">
        <div className="desktop-left">
          <div className="brand-wordmark">Joe<br />Valle</div>
          <div className="portrait-wrap">
            <img src={JOE_IMAGE_URL} alt="Joe Valle" className="portrait-image" />
          </div>
          <div className="desktop-copy"><CampaignCopy /></div>
        </div>
        <SignupForm />
      </section>

      <section className="mobile-layout">
        <div className="mobile-hero">
          <div className="mobile-joe-mark">Volta<br /><strong>Joe</strong></div>
          <div className="mobile-portrait">
            <img src={JOE_IMAGE_URL} alt="Joe Valle" className="portrait-image" />
          </div>
        </div>
        <div className="mobile-copy"><CampaignCopy /></div>
        <SignupForm />
        <div className="mobile-social-copy">
          <p>
            As redes sociais podem e vão fazer a diferença nesta nossa caminhada coletiva. Participe e siga as nossas
            orientações. Juntos vamos lutar pelo cerrado, pela sustentabilidade, pela ética na política e pela energia
            limpa. Vamos cuidar desta cidade juntos.
          </p>
          <SocialLinks />
        </div>
      </section>
    </main>
  );
}
