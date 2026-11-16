function Header({ onGoAdmin }) {
  const [open, setOpen] = React.useState(false);

  const links = [
    { href: "#inicio", label: "Início" },
    { href: "#sobre", label: "Sobre" },
    { href: "#areas", label: "Áreas de Atuação" },
    { href: "#equipe", label: "Advogados" },
    { href: "#duvidas", label: "Dúvidas" },
    { href: "#contato", label: "Contato" },
  ];

  function handleLinkClick() {
    setOpen(false);
  }

  return (
    <header className="site-header">
      <div className="container">
        <a href="#inicio" className="brand" onClick={handleLinkClick}>
          <span className="brand-emblem">
            <i className="fa-solid fa-scale-balanced"></i>
          </span>
          <span className="brand-text">
            <strong>Fontella &amp; Ribeiro</strong>
            <span>Advogados Associados</span>
          </span>
        </a>

        <nav className={"main-nav" + (open ? " open" : "")}>
          {links.map((link) => (
            <a key={link.href} href={link.href} onClick={handleLinkClick}>
              {link.label}
            </a>
          ))}
          <button className="nav-admin-btn" onClick={onGoAdmin}>
            <i className="fa-solid fa-lock"></i> Área Administrativa
          </button>
        </nav>

        <button
          className="nav-toggle"
          aria-label="Abrir menu"
          onClick={() => setOpen((v) => !v)}
        >
          <i className={"fa-solid " + (open ? "fa-xmark" : "fa-bars")}></i>
        </button>
      </div>
    </header>
  );
}
