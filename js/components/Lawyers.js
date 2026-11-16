function Lawyers() {
  const [lawyers, setLawyers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [query, setQuery] = React.useState("");
  const [activeFilter, setActiveFilter] = React.useState("Todos");

  React.useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Api.getLawyers()
      .then((data) => {
        if (!cancelled) setLawyers(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const allAreas = React.useMemo(() => {
    const set = new Set();
    lawyers.forEach((l) => (l.atuacao || []).forEach((a) => set.add(a)));
    return ["Todos", ...Array.from(set)];
  }, [lawyers]);

  const filtered = lawyers.filter((l) => {
    const matchesFilter =
      activeFilter === "Todos" || (l.atuacao || []).includes(activeFilter);
    const q = query.trim().toLowerCase();
    const matchesQuery =
      q === "" ||
      l.nome.toLowerCase().includes(q) ||
      (l.atuacao || []).some((a) => a.toLowerCase().includes(q)) ||
      l.oab.toLowerCase().includes(q);
    return matchesFilter && matchesQuery;
  });

  return (
    <section className="section-pad" id="equipe">
      <div className="container">
        <div className="section-eyebrow">
          <span className="art-number">Art. 3º</span>
          <span className="art-rule"></span>
        </div>
        <h2 className="section-title">Nossos Advogados</h2>
        <p className="section-subtitle">
          Pesquise por nome, número da OAB ou área de atuação para encontrar o
          profissional mais indicado para o seu caso.
        </p>

        <div className="lawyers-toolbar">
          <div className="search-box">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input
              type="text"
              placeholder="Buscar por nome, OAB ou área (ex: Trabalhista)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Buscar advogado"
            />
          </div>
          <div className="filter-pills">
            {allAreas.slice(0, 7).map((area) => (
              <button
                key={area}
                className={"filter-pill" + (activeFilter === area ? " active" : "")}
                onClick={() => setActiveFilter(area)}
              >
                {area}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="empty-state">
            <i className="fa-solid fa-spinner fa-spin"></i>
            <p>Carregando advogados...</p>
          </div>
        ) : error ? (
          <div className="empty-state">
            <i className="fa-solid fa-triangle-exclamation"></i>
            <p>Não foi possível carregar os advogados. {error}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <i className="fa-solid fa-user-magnifying-glass"></i>
            <p>Nenhum advogado encontrado para essa busca.</p>
          </div>
        ) : (
          <div className="lawyers-grid">
            {filtered.map((lawyer) => (
              <div className="lawyer-card" key={lawyer.id}>
                <div className="lawyer-photo">
                  <img src={lawyer.foto} alt={"Foto de " + lawyer.nome} loading="lazy" />
                  <span className="lawyer-oab">{lawyer.oab}</span>
                </div>
                <div className="lawyer-body">
                  <h3>{lawyer.nome}</h3>
                  <div className="lawyer-tags">
                    {(lawyer.atuacao || []).map((a) => (
                      <span key={a}>{a}</span>
                    ))}
                  </div>
                  <p>{lawyer.descricao}</p>
                  <a href="#contato" className="lawyer-contact-link">
                    Falar com {lawyer.nome.split(" ")[1] || "advogado"}{" "}
                    <i className="fa-solid fa-arrow-right"></i>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
