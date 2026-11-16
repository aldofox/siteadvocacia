function Hero() {
  return (
    <section className="hero" id="inicio">
      <div className="hero-bg"></div>
      <div className="container hero-content">
        <div className="hero-docket">Processo Nº OAB/SC 2011 — Desde 2011</div>
        <h1>
          Defendemos seus direitos com <em>técnica</em>, ética e proximidade.
        </h1>
        <p>
          Escritório de advocacia full service com atuação em Direito Cível,
          Trabalhista, Empresarial, Família e Criminal. Atendimento próximo,
          pareceres claros e acompanhamento em cada etapa do seu processo.
        </p>
        <div className="hero-actions">
          <a href="#contato" className="btn btn-primary">
            <i className="fa-solid fa-calendar-check"></i> Agendar Consulta
          </a>
          <a href="#equipe" className="btn btn-outline">
            <i className="fa-solid fa-users"></i> Conheça a Equipe
          </a>
        </div>
      </div>

      <div className="container hero-stats">
        <div className="stat">
          <strong>14+</strong>
          <span>Anos de Atuação</span>
        </div>
        <div className="stat">
          <strong>1.200+</strong>
          <span>Casos Atendidos</span>
        </div>
        <div className="stat">
          <strong>6</strong>
          <span>Áreas do Direito</span>
        </div>
        <div className="stat">
          <strong>98%</strong>
          <span>Clientes Satisfeitos</span>
        </div>
      </div>
    </section>
  );
}
