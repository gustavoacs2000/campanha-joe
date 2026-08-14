import Link from 'next/link';

export default function TermsPage() {
  return (
    <main className="terms-page">
      <article>
        <Link href="/">← Voltar</Link>
        <h1>Termo de aceite para contato e tratamento de dados</h1>
        <p>
          Ao marcar a caixa de aceite no formulário, você autoriza o tratamento do seu nome e telefone para cadastro,
          contato e envio de comunicações relacionadas às atividades, mobilizações, eventos e conteúdos de Joe Valle.
        </p>
        <p>
          O tratamento dos dados deverá observar a Lei nº 13.709/2018 (LGPD), especialmente os princípios de finalidade,
          adequação, necessidade, segurança, prevenção e transparência.
        </p>
        <p>
          Os dados não devem ser comercializados. O titular poderá solicitar informações sobre o tratamento, correção,
          exclusão ou revogação do consentimento pelos canais oficiais divulgados pela organização responsável.
        </p>
        <p>
          Este texto é uma base operacional para a página. Antes da publicação definitiva, os dados do controlador,
          canal de contato para exercício de direitos e política de privacidade da campanha devem ser preenchidos e
          revisados pelo responsável jurídico/encarregado de dados.
        </p>
      </article>
    </main>
  );
}
