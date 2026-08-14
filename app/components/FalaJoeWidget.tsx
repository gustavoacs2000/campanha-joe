'use client';

import { CSSProperties, KeyboardEvent, useEffect, useRef, useState } from 'react';

type Message = { role: 'user' | 'assistant'; content: string };
type FalaJoeWidgetProps = { embedded?: boolean };

const WELCOME = 'Olá! Sou o Falajoe, assistente virtual da campanha de Joe Valle. Como posso ajudar?';

function BotIcon() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <path d="M32 15V9.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <circle cx="32" cy="7" r="3.2" fill="currentColor" />
      <rect x="10.5" y="15" width="43" height="38" rx="13" fill="#fff" stroke="currentColor" strokeWidth="3" />
      <rect x="18" y="24" width="28" height="18" rx="9" fill="currentColor" />
      <circle cx="27" cy="33" r="4" fill="#ff7a00" />
      <circle cx="39" cy="33" r="4" fill="#ff7a00" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3.6 20.5 21 12 3.6 3.5l.1 6.6L15 12 3.7 13.9l-.1 6.6Z" fill="currentColor" />
    </svg>
  );
}

export default function FalaJoeWidget({ embedded = false }: FalaJoeWidgetProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{ role: 'assistant', content: WELCOME }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [messages, loading]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    const userMessage: Message = { role: 'user', content: text };
    const history = [...messages, userMessage];
    setMessages([...history, { role: 'assistant', content: '' }]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      });

      if (!response.ok || !response.body) throw new Error('Falha ao consultar o Falajoe');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6).trim();
          if (!data || data === '[DONE]') continue;

          try {
            const parsed = JSON.parse(data);
            const delta = parsed.choices?.[0]?.delta?.content ?? '';
            if (!delta) continue;
            accumulated += delta;
            setMessages((current) => [
              ...current.slice(0, -1),
              { role: 'assistant', content: accumulated },
            ]);
          } catch {
            // Ignora chunks incompletos ou eventos não JSON.
          }
        }
      }
    } catch (error) {
      console.error(error);
      setMessages((current) => [
        ...current.slice(0, -1),
        { role: 'assistant', content: 'Não consegui responder agora. Tente novamente em instantes.' },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void sendMessage();
    }
  }

  const waitingFirstToken = loading && messages[messages.length - 1]?.content === '';
  const embeddedWidgetStyle: CSSProperties | undefined = embedded
    ? {
        position: 'static',
        right: 'auto',
        bottom: 'auto',
        zIndex: 'auto',
        width: 'calc(100% - 24px)',
        maxWidth: 760,
        margin: '16px auto 0',
        justifyItems: 'stretch',
      }
    : undefined;
  const embeddedPanelStyle: CSSProperties | undefined = embedded
    ? {
        width: '100%',
        height: 'min(520px, 68vh)',
        minHeight: 380,
        boxShadow: '0 16px 42px rgba(86,48,16,.12)',
      }
    : undefined;
  const embeddedLauncherStyle: CSSProperties | undefined = embedded
    ? {
        width: '100%',
        justifyContent: 'center',
        borderRadius: 16,
        minHeight: 62,
      }
    : undefined;

  return (
    <div className={`falajoe-widget ${open ? 'is-open' : ''}`} style={embeddedWidgetStyle}>
      {open && (
        <section
          className="falajoe-panel"
          style={embeddedPanelStyle}
          aria-label="Falajoe, assistente virtual com inteligência artificial"
        >
          <header className="falajoe-header">
            <div className="falajoe-header-brand">
              <span className="falajoe-avatar"><BotIcon /></span>
              <div>
                <strong>Falajoe</strong>
                <span>Assistente virtual com IA</span>
              </div>
            </div>
            <button type="button" className="falajoe-close" onClick={() => setOpen(false)} aria-label="Fechar chat">×</button>
          </header>

          <div className="falajoe-ai-note">Atendimento realizado por inteligência artificial.</div>

          <div className="falajoe-messages" role="log" aria-live="polite">
            {messages.map((message, index) => {
              if (message.role === 'assistant' && !message.content) return null;
              return (
                <div key={index} className={`falajoe-row ${message.role}`}>
                  {message.role === 'assistant' && <span className="falajoe-message-avatar"><BotIcon /></span>}
                  <div className="falajoe-bubble">{message.content}</div>
                </div>
              );
            })}
            {waitingFirstToken && (
              <div className="falajoe-row assistant">
                <span className="falajoe-message-avatar"><BotIcon /></span>
                <div className="falajoe-bubble falajoe-typing" aria-label="Falajoe está escrevendo"><i /><i /><i /></div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="falajoe-composer">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              placeholder="Digite sua mensagem..."
              aria-label="Mensagem para o Falajoe"
            />
            <button type="button" onClick={() => void sendMessage()} disabled={loading || !input.trim()} aria-label="Enviar mensagem">
              <SendIcon />
            </button>
          </div>
        </section>
      )}

      <button
        type="button"
        className="falajoe-launcher"
        style={embeddedLauncherStyle}
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label={open ? 'Fechar Falajoe' : 'Conversar com o Falajoe'}
      >
        <span className="falajoe-launcher-icon"><BotIcon /></span>
        <span className="falajoe-launcher-copy"><strong>Falajoe</strong><small>Assistente com IA</small></span>
      </button>
    </div>
  );
}
