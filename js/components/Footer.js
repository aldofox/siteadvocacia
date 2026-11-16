function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <div className="brand">
            <span className="brand-emblem">
              <i className="fa-solid fa-scale-balanced"></i>
            </span>
            <span className="brand-text">
              <strong style={{ color: "#fff" }}>Fontella &amp; Ribeiro</strong>
              <span>Advogados Associados</span>
            </span>
          </div>
          <p>
            Advocacia técnica e humana desde 2011, com atuação em todo o
            estado de Santa Catarina.
          </p>
        </div>

        <div className="footer-col">
          <h4>Navegação</h4>
          <ul>
            <li><a href="#sobre">Sobre</a></li>
            <li><a href="#areas">Áreas de Atuação</a></li>
            <li><a href="#equipe">Advogados</a></li>
            <li><a href="#duvidas">Dúvidas</a></li>
            <li><a href="#contato">Contato</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Áreas do Direito</h4>
          <ul>
            <li><a href="#areas">Direito de Família</a></li>
            <li><a href="#areas">Direito Trabalhista</a></li>
            <li><a href="#areas">Direito Empresarial</a></li>
            <li><a href="#areas">Direito Criminal</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Contato</h4>
          <ul>
            <li><i className="fa-solid fa-location-dot"></i> Joinville/SC</li>
            <li><i className="fa-solid fa-phone"></i> (47) 3333-4455</li>
            <li><i className="fa-solid fa-envelope"></i> contato@fontellaribeiro.adv.br</li>
          </ul>
        </div>
      </div>

      <div className="container footer-bottom">
        <span>© {year} Fontella &amp; Ribeiro Advogados Associados. Todos os direitos reservados.</span>
        <a href="#inicio">Voltar ao topo ↑</a>
      </div>
    </footer>
  );
}
