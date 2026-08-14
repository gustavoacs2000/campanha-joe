import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Volta Joe | Participe desse novo começo',
  description:
    'Participe da caminhada coletiva de Joe Valle. Cadastre-se para receber informações e entrar na comunidade.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
