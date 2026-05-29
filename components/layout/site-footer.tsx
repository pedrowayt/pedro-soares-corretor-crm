import Image from "next/image";
import Link from "next/link";
import { OpenCookieSettingsButton } from "@/components/layout/open-cookie-settings-button";
import { SeoFooterLinks } from "@/components/layout/seo-footer-links";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container site-footer-grid">
        <div className="site-footer-brand">
          <Image
            className="site-footer-logo"
            src="/brand/logo-footer-hq.png"
            alt="Pedro Soares Corretor de Imóveis"
            width={681}
            height={152}
          />
          <p className="site-footer-impact">Especialista em imóveis prontos, na planta e leilões em Palmas.</p>
        </div>

        <div className="site-footer-links-wrap">
          <section className="site-footer-group" aria-label="Navegação de imóveis">
            <p className="site-footer-group-title">Imóveis</p>
            <nav className="site-footer-link-list">
              <Link href="/imoveis/prontos">Imóveis prontos</Link>
              <Link href="/lancamentos">Imóveis na planta</Link>
              <Link href="/imoveis/leilao">Imóveis leilão</Link>
              <Link href="/construtoras">Construtoras</Link>
            </nav>
          </section>

          <section className="site-footer-group" aria-label="Navegação institucional">
            <p className="site-footer-group-title">Institucional</p>
            <nav className="site-footer-link-list">
              <Link href="/sobre">Sobre</Link>
              <Link href="/blog">Blog</Link>
              <Link href="/venda-seu-imovel">Anunciar</Link>
              <Link href="/contato">Contato</Link>
              <Link href="/admin/login">Área admin</Link>
            </nav>
          </section>
        </div>

        <div className="site-footer-contact">
          <a
            className="site-footer-whatsapp"
            href="https://wa.me/5563984845101?text=Ol%C3%A1%20Pedro%2C%20quero%20falar%20sobre%20im%C3%B3veis."
            target="_blank"
            rel="noreferrer"
          >
            Falar no WhatsApp
          </a>

          <a
            href="https://wa.me/5563984845101?text=Ol%C3%A1%20Pedro%2C%20quero%20falar%20sobre%20im%C3%B3veis."
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp: (63) 98484-5101
          </a>
          <Link href="/venda-seu-imovel">Quero anunciar meu imóvel</Link>

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
      </div>

      <SeoFooterLinks />

      <div className="container site-footer-bottom">
        <p>© {year} Pedro Soares. Todos os direitos reservados.</p>

        <nav aria-label="Links legais" className="site-footer-legal-nav">
          <Link href="/politica-de-cookies">Política de Cookies</Link>
          <Link href="/politica-de-privacidade">Política de Privacidade</Link>
          <Link href="/termos-de-servico">Termos de Serviço</Link>
          <Link href="/termos-de-uso">Termos de Uso</Link>
          <OpenCookieSettingsButton />
        </nav>

        <details className="site-footer-legal-mobile">
          <summary>Legal</summary>
          <div className="site-footer-legal-mobile-links">
            <Link href="/politica-de-cookies">Política de Cookies</Link>
            <Link href="/politica-de-privacidade">Política de Privacidade</Link>
            <Link href="/termos-de-servico">Termos de Serviço</Link>
            <Link href="/termos-de-uso">Termos de Uso</Link>
            <OpenCookieSettingsButton />
          </div>
        </details>
      </div>
    </footer>
  );
}
