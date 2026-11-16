const PRACTICE_AREAS = [
  {
    icon: "fa-people-roof",
    title: "Direito de Família",
    text: "Divórcio, guarda, pensão alimentícia, inventários e planejamento sucessório.",
  },
  {
    icon: "fa-briefcase",
    title: "Direito Trabalhista",
    text: "Reclamações trabalhistas, acordos coletivos e consultoria preventiva para empresas.",
  },
  {
    icon: "fa-building",
    title: "Direito Empresarial",
    text: "Contratos, sociedades, fusões, recuperação judicial e compliance.",
  },
  {
    icon: "fa-house",
    title: "Direito Cível e Imobiliário",
    text: "Contratos, indenizações, ações possessórias e regularização de imóveis.",
  },
  {
    icon: "fa-user-shield",
    title: "Direito Criminal",
    text: "Defesa técnica em inquéritos, processos e tribunal do júri.",
  },
  {
    icon: "fa-file-invoice-dollar",
    title: "Direito Tributário",
    text: "Planejamento fiscal, defesa em autuações e recuperação de créditos tributários.",
  },
];

function PracticeAreas() {
  return (
    <section className="section-pad section-alt" id="areas">
      <div className="container">
        <div className="section-eyebrow">
          <span className="art-number">Art. 2º</span>
          <span className="art-rule"></span>
        </div>
        <h2 className="section-title">Áreas de Atuação</h2>
        <p className="section-subtitle">
          Atuamos de forma consultiva e contenciosa nas principais áreas do
          Direito, sempre com um responsável técnico dedicado ao seu caso.
        </p>

        <div className="areas-grid">
          {PRACTICE_AREAS.map((area) => (
            <div className="area-card" key={area.title}>
              <i className={"fa-solid " + area.icon}></i>
              <h3>{area.title}</h3>
              <p>{area.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
