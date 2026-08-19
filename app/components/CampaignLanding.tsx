'use client';

import Link from 'next/link';
import { ChangeEvent, FormEvent, useState } from 'react';
import FalaJoeWidget from './FalaJoeWidget';

const INSTAGRAM_URL = 'https://www.instagram.com/joevalleoficial/';
const TIKTOK_URL = 'https://www.tiktok.com/@joe.valle.malunga?_r=1&_t=ZS-98rMjdKcK5S';
const WHATSAPP_URL = 'https://chat.whatsapp.com/GBMLOZT2jN612wTeX3oZL9?s=qt&p=i&ilr=4';
const JOE_IMAGE_URL = '/joe-valle-aprovado.webp';

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return digits ? `(${digits}` : '';
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function CampaignLogo({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`campaign-logo ${compact ? 'campaign-logo-compact' : ''}`} aria-label="Joe Valle, deputado distrital, 12345">
      <div className="campaign-logo-name"><strong>JOE</strong><span>VALLE</span></div>
      <div className="campaign-logo-office"><span>DEPUTADO</span><strong>DISTRITAL</strong></div>
      <div className="campaign-logo-number">12345</div>
    </div>
  );
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

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M14.4 3v10.3a4.4 4.4 0 1 1-3.7-4.3v3a1.6 1.6 0 1 0 .9 1.4V3h2.8Zm0 0c.3 2.2 1.7 3.8 4.2 4.3v2.8a8.6 8.6 0 0 1-4.2-1.5" />
    </svg>
  );
}

function WhatsAppIcon() {
  return <img src="/whatsapp-logo.png" width="42" height="42" alt="" aria-hidden="true" />;
}

function SocialCards() {
  return (
    <div className="social-cards" aria-label="Redes sociais do Joe Valle">
      <a className="social-card social-card-whatsapp" href={WHATSAPP_URL} target="_blank" rel="noreferrer">
        <span className="social-card-icon"><WhatsAppIcon /></span>
        <span className="social-card-copy"><small>Comunidade</small><strong>WhatsApp</strong><em>Entrar agora</em></span>
        <span className="social-card-arrow" aria-hidden="true">›</span>
      </a>
      <a className="social-card" href={INSTAGRAM_URL} target="_blank" rel="noreferrer">
        <span className="social-card-icon instagram-icon"><InstagramIcon /></span>
        <span className="social-card-copy"><strong>Instagram</strong><small>Siga a campanha</small><em>@joevalleoficial</em></span>
        <span className="social-card-arrow" aria-hidden="true">›</span>
      </a>
      <a className="social-card" href={TIKTOK_URL} target="_blank" rel="noreferrer">
        <span className="social-card-icon tiktok-icon"><TikTokIcon /></span>
        <span className="social-card-copy"><strong>TikTok</strong><small>Acompanhe os bastidores</small></span>
        <span className="social-card-arrow" aria-hidden="true">›</span>
      </a>
    </div>
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

    if (name.length < 2) return setError('Informe seu nome.');
    if (phoneDigits.length < 10 || phoneDigits.length > 11) return setError('Informe um telefone válido com DDD.');
    if (!accepted) return setError('Você precisa aceitar o termo de contato para continuar.');

    setSending(true);
    setError('');

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone: phoneDigits, consent: true }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || result?.success === false) throw new Error(result?.message || 'Não foi possível concluir o cadastro.');
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
    <div className="form-stack">
      <section className={`form-card ${done ? 'form-card-success' : ''}`} aria-labelledby="form-title">
        <div className="form-heading">
          <CampaignLogo compact />
          <div>
            <h2 id="form-title">{done ? 'Cadastro realizado.' : <>Entre para<br />a campanha do Joe.</>}</h2>
            {!done && <p>Cadastre-se para receber agenda, novidades e convites para participar das próximas ações.</p>}
          </div>
        </div>

        {done ? (
          <div className="success" role="status" aria-live="polite">
            <div className="success-check" aria-hidden="true">✓</div>
            <p>Obrigado por participar. Agora você já faz parte dessa caminhada.</p>
            <a className="success-whatsapp" href={WHATSAPP_URL} target="_blank" rel="noreferrer"><WhatsAppIcon /> Entrar na comunidade do WhatsApp</a>
          </div>
        ) : (
          <form onSubmit={submit} className="signup-form">
            <label className="field-row">
              <span className="field-icon" aria-hidden="true">○</span>
              <input type="text" name="name" autoComplete="name" placeholder="Nome completo" required />
            </label>
            <label className="field-row">
              <span className="field-icon phone-mark" aria-hidden="true">⌕</span>
              <input type="tel" name="phone" autoComplete="tel" inputMode="numeric" placeholder="(00) 00000-0000" value={phone} onChange={handlePhoneChange} maxLength={15} required />
            </label>
            <label className="consent-row">
              <input type="checkbox" name="consent" required />
              <span>Autorizo o contato e o tratamento dos dados conforme os termos da campanha e a LGPD. Li e aceito o <Link href="/termos">termo de aceite</Link>.</span>
            </label>
            {error && <p className="form-error" role="alert" aria-live="assertive">{error}</p>}
            <button className="submit-button" type="submit" disabled={sending}>{sending ? 'Enviando...' : 'Cadastrar e participar'}</button>
          </form>
        )}

        {!done && <a className="inline-whatsapp" href={WHATSAPP_URL} target="_blank" rel="noreferrer"><span>◉</span> ou entrar direto na comunidade do WhatsApp →</a>}
        <p className="privacy-note">Seus dados ficam protegidos e não são compartilhados.</p>
      </section>
      <SocialCards />
    </div>
  );
}

function Hero() {
  return (
    <div className="hero-copy">
      <CampaignLogo />
      <h1>Uma<br />campanha<br /><span>próxima</span><br />de você.</h1>
      <p>Chegou a hora de caminharmos juntos. Acompanhe, participe e ajude a construir uma Brasília mais sustentável e humana.</p>
      <a className="hero-cta" href="#cadastro">Quero participar</a>
    </div>
  );
}

export default function CampaignLanding() {
  return (
    <main className="campaign-page">
      <section className="desktop-layout">
        <div className="desktop-hero">
          <Hero />
          <div className="portrait-stage"><img src={JOE_IMAGE_URL} alt="Joe Valle" className="portrait-image" /></div>
        </div>
        <div id="cadastro" className="desktop-form-area"><SignupForm /></div>
        <span className="campaign-year">CAMPANHA 2026</span>
        <FalaJoeWidget />
      </section>

      <section className="mobile-layout">
        <div className="mobile-hero">
          <div className="mobile-hero-copy"><CampaignLogo /><h1>Uma<br />campanha<br /><span>próxima</span><br />de você.</h1><p>Chegou a hora de caminharmos juntos. Acompanhe, participe e ajude a construir uma Brasília mais sustentável e humana.</p></div>
          <div className="mobile-portrait"><img src={JOE_IMAGE_URL} alt="Joe Valle" className="portrait-image" /></div>
        </div>
        <div id="cadastro-mobile"><SignupForm /></div>
        <FalaJoeWidget embedded />
      </section>
    </main>
  );
}
