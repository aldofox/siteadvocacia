function About() {
  return (
    <section className="section-pad" id="sobre">
      <div className="container">
        <div className="about-grid">
          <div className="about-photo-wrap">
            <img
              src="https://images.pexels.com/photos/8112159/pexels-photo-8112159.jpeg?auto=compress&cs=tinysrgb&w=900"
              alt="Reunião entre advogado e cliente em escritório"
              loading="lazy"
            />
            <div className="about-photo-badge">
              <strong>14 anos</strong>
              <span>de história construída com a confiança dos nossos clientes</span>
            </div>
          </div>

          <div className="about-text">
            <div className="section-eyebrow">
              <span className="art-number">Art. 1º</span>
              <span className="art-rule"></span>
            </div>
            <h2 className="section-title">Quem Somos</h2>
            <p>
              O <strong>Fontella &amp; Ribeiro Advogados Associados</strong>{" "}
              nasceu em 2011 da união de dois profissionais com uma visão em
              comum: praticar uma advocacia técnica, transparente e acessível.
              Hoje somos uma equipe multidisciplinar, capaz de atender desde
              pessoas físicas em questões de família até empresas em
              operações societárias complexas.
            </p>
            <p>
              Acreditamos que um bom atendimento jurídico começa por ouvir.
              Por isso, cada caso passa por uma análise cuidadosa antes de
              qualquer orientação — nada de respostas prontas ou genéricas.
            </p>

            <div className="about-values">
              <div className="value-item">
                <i className="fa-solid fa-handshake"></i>
                <div>
                  <strong>Transparência</strong>
                  <p>Honorários e prazos claros desde a primeira reunião.</p>
                </div>
              </div>
              <div className="value-item">
                <i className="fa-solid fa-gavel"></i>
                <div>
                  <strong>Técnica</strong>
                  <p>Equipe especializada por área do Direito.</p>
                </div>
              </div>
              <div className="value-item">
                <i className="fa-solid fa-clock"></i>
                <div>
                  <strong>Agilidade</strong>
                  <p>Retorno rápido em cada etapa do processo.</p>
                </div>
              </div>
              <div className="value-item">
                <i className="fa-solid fa-heart"></i>
                <div>
                  <strong>Proximidade</strong>
                  <p>Atendimento humano, sem "juridiquês" desnecessário.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
