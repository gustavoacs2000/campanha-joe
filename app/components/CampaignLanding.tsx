'use client';

import Link from 'next/link';
import { ChangeEvent, FormEvent, useState } from 'react';

const INSTAGRAM_URL = 'https://www.instagram.com/joevalleoficial/';
const TIKTOK_URL = 'https://www.tiktok.com/@joe.valle.malunga?_r=1&_t=ZS-98rMjdKcK5S';
const WHATSAPP_URL = process.env.NEXT_PUBLIC_WHATSAPP_COMMUNITY_URL || '';
const JOE_IMAGE_URL = '/joe-valle-aprovado.webp';

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11);

  if (digits.length <= 2) return digits ? `(${digits}` : '';
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

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
  return <img src="/whatsapp-logo.png" width="34" height="34" alt="" aria-hidden="true" className="whatsapp-logo-image" />;
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
  const [phone, setPhone] = useState('');

  function handlePhoneChange(event: ChangeEvent<HTMLInputElement>) {
    setPhone(formatPhone(event.target.value));
    if (error) setError('');
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const phoneDigits = String(data.get('phone') || '').replace(/\D/g, '');
    const accepted = data.get('consent') === 'on';

    if (name.length < 2) {
      setError('Informe seu nome.');
      return;
    }
    if (phoneDigits.length < 10 || phoneDigits.length > 11) {
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
        body: JSON.stringify({ name, phone: phoneDigits, consent: true }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || result?.success === false) {
        throw new Error(result?.message || 'Não foi possível concluir o cadastro.');
      }
      setDone(true);
      setPhone('');
      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha de conexão. Tente novamente.');
    } finally {
      setSending(false);
    }
  }

  return (
    <section className={`form-card ${done ? 'form-card-success' : ''}`} aria-labelledby="form-title">
      <div className={`form-heading ${done ? 'form-heading-success' : ''}`}>
        <div className="form-logo-text" aria-label="Volta Joe"><span>Volta</span><strong>Joe</strong></div>
        <h2 id="form-title">
          {done ? (
            <>Cadastro <span>realizado.</span></>
          ) : (
            <>Participe desse <span>novo começo!</span></>
          )}
        </h2>
      </div>

      {done ? (
        <p className="success-intro">Obrigado por participar desse novo começo.</p>
      ) : (
        <p className="form-intro">Deixe seus dados e receba todas as novidades do nosso movimento.</p>
      )}

      {done ? (
        <div className="success" role="status" aria-live="polite">
          <div aria-hidden="true" style={{ width: 68, height: 68, marginBottom: 6 }}>
            <svg viewBox="0 0 52 52" width="68" height="68" fill="none">
              <circle cx="26" cy="26" r="24" stroke="#0a9c43" strokeWidth="3" strokeDasharray="151" strokeDashoffset="151">
                <animate attributeName="stroke-dashoffset" from="151" to="0" dur="0.45s" fill="freeze" />
              </circle>
              <path d="M15 27l7 7 15-16" stroke="#0a9c43" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="40" strokeDashoffset="40">
                <animate attributeName="stroke-dashoffset" from="40" to="0" dur="0.3s" begin="0.35s" fill="freeze" />
              </path>
            </svg>
          </div>
          {WHATSAPP_URL && (
            <a className="whatsapp-button success-whatsapp-button" href={WHATSAPP_URL} target="_blank" rel="noreferrer">
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
              inputMode="numeric"
              placeholder="(00) 00000-0000"
              value={phone}
              onChange={handlePhoneChange}
              maxLength={15}
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
          {error && <p className="form-error" role="alert" aria-live="assertive">{error}</p>}
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
          <div className="mobile-portrait">
            <img src={JOE_IMAGE_URL} alt="Joe Valle" className="portrait-image" />
          </div>
          <h1 className="mobile-title">
            <span>Chegou a hora</span>
            <strong>de voltarmos</strong>
            <strong>a caminhar</strong>
            <em>juntos.</em>
          </h1>
        </div>
        <SignupForm />
        <div className="mobile-socials" aria-label="Redes sociais do Joe Valle">
          <SocialLinks />
        </div>
      </section>
    </main>
  );
}
