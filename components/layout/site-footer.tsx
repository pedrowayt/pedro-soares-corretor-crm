import Image from "next/image";
import Link from "next/link";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container site-footer-grid">
        <div className="site-footer-brand">
          <Image
            className="site-footer-logo"
            src="/brand/logo-footer-pedro.png"
            alt="Pedro Soares Corretor de Imóveis"
            width={1920}
            height={1080}
          />
          <p className="site-footer-impact">Conectando você ao imóvel certo com segurança e estratégia.</p>
          <p className="site-footer-location">Pedro Soares • Corretor de Imóveis em Palmas, Tocantins • CEP 77020-018</p>
        </div>

        <nav className="site-footer-nav" aria-label="Links do rodapé">
          <Link href="/imoveis/prontos">Imóveis prontos</Link>
          <Link href="/imoveis/na-planta">Imóveis na planta</Link>
          <Link href="/imoveis/leilao">Imóveis leilão</Link>
        </nav>

        <div className="site-footer-contact">
          <a
            href="https://wa.me/5563984845101?text=Ol%C3%A1%20Pedro%2C%20quero%20falar%20sobre%20im%C3%B3veis."
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp: (63) 98484-5101
          </a>
          <Link href="/venda-seu-imovel">Quero anunciar meu imóvel</Link>
        </div>
      </div>

      <div className="container site-footer-bottom">
        <p>© {year} Pedro Soares. Todos os direitos reservados.</p>

        <nav aria-label="Links legais" className="site-footer-legal-nav">
          <Link href="/politica-de-privacidade">Política de Privacidade</Link>
          <Link href="/termos-de-servico">Termos de Serviço</Link>
          <Link href="/termos-de-uso">Termos de Uso</Link>
        </nav>

        <div className="site-footer-social">
          <a href="https://www.instagram.com/pedrosoarespmw/" target="_blank" rel="noreferrer" aria-label="Instagram">
            <svg viewBox="0 0 24 24" aria-hidden>
              <path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4h-9Zm10 1.75a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
            </svg>
          </a>
          <a href="https://www.youtube.com/" target="_blank" rel="noreferrer" aria-label="YouTube">
            <svg viewBox="0 0 24 24" aria-hidden>
              <path d="M21.6 7.2a2.9 2.9 0 0 0-2-2C17.8 4.7 12 4.7 12 4.7s-5.8 0-7.6.5a2.9 2.9 0 0 0-2 2A30 30 0 0 0 2 12a30 30 0 0 0 .4 4.8 2.9 2.9 0 0 0 2 2c1.8.5 7.6.5 7.6.5s5.8 0 7.6-.5a2.9 2.9 0 0 0 2-2A30 30 0 0 0 22 12a30 30 0 0 0-.4-4.8ZM10 15.5V8.5L16 12l-6 3.5Z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
