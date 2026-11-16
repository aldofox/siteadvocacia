function formatDateBR(isoDateTime) {
  if (!isoDateTime) return "";
  const datePart = isoDateTime.split(" ")[0].split("T")[0];
  const [y, m, d] = datePart.split("-");
  return d + "/" + m + "/" + y;
}

function Doubts() {
  const [doubts, setDoubts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [loadError, setLoadError] = React.useState("");
  const [form, setForm] = React.useState({ nome: "", email: "", duvida: "" });
  const [submitting, setSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    loadDoubts();
  }, []);

  function loadDoubts() {
    setLoading(true);
    Api.getDoubts()
      .then((data) => {
        setDoubts(data);
        setLoadError("");
      })
      .catch((err) => setLoadError(err.message))
      .finally(() => setLoading(false));
  }

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.nome.trim() || !form.email.trim() || !form.duvida.trim()) return;

    setSubmitting(true);
    setSubmitError("");
    try {
      await Api.createDoubt({
        nome: form.nome.trim(),
        email: form.email.trim(),
        duvida: form.duvida.trim(),
      });
      setForm({ nome: "", email: "", duvida: "" });
      setSubmitted(true);
      setIndex(0);
      loadDoubts();
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  const total = doubts.length;
  const current = doubts[index];

  function goTo(i) {
    if (i < 0 || i >= total) return;
    setIndex(i);
  }

  return (
    <section className="section-pad" id="duvidas">
      <div className="container">
        <div className="section-eyebrow">
          <span className="art-number">Art. 4º</span>
          <span className="art-rule"></span>
        </div>
        <h2 className="section-title">Dúvidas &amp; Respostas</h2>
        <p className="section-subtitle">
          Envie sua dúvida jurídica e receba uma orientação inicial do nosso
          time por e-mail. As perguntas e respostas mais recentes aparecem
          publicamente abaixo (sem exibir seu e-mail).
        </p>

        <div className="doubts-layout">
          {/* Formulário */}
          <div className="card-panel">
            <h3>
              <i className="fa-regular fa-comment-dots"></i> Envie sua Dúvida
            </h3>
            <p className="hint">
              Preencha os campos abaixo. Nosso time responderá pelo e-mail
              informado e a resposta também será publicada aqui.
            </p>

            {submitted && (
              <div className="form-success">
                <i className="fa-solid fa-circle-check"></i>
                Dúvida enviada com sucesso! Você receberá o retorno no e-mail informado.
              </div>
            )}
            {submitError && <div className="admin-error">{submitError}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-field">
                <label htmlFor="doubt-nome">Nome do cliente</label>
                <input
                  id="doubt-nome"
                  type="text"
                  required
                  value={form.nome}
                  onChange={(e) => handleChange("nome", e.target.value)}
                  placeholder="Seu nome completo"
                />
              </div>
              <div className="form-field">
                <label htmlFor="doubt-email">E-mail para retorno</label>
                <input
                  id="doubt-email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="voce@email.com"
                />
              </div>
              <div className="form-field">
                <label htmlFor="doubt-texto">Descreva sua dúvida</label>
                <textarea
                  id="doubt-texto"
                  required
                  rows={5}
                  value={form.duvida}
                  onChange={(e) => handleChange("duvida", e.target.value)}
                  placeholder="Explique sua situação com o máximo de detalhes possível..."
                ></textarea>
              </div>
              <button type="submit" className="btn btn-burgundy btn-block" disabled={submitting}>
                <i className={"fa-solid " + (submitting ? "fa-spinner fa-spin" : "fa-paper-plane")}></i>{" "}
                {submitting ? "Enviando..." : "Enviar Dúvida"}
              </button>
              <p className="form-note">
                A data de postagem é registrada automaticamente. Seus dados de
                contato não são exibidos publicamente, apenas seu nome e a
                dúvida.
              </p>
            </form>
          </div>

          {/* Carrossel de dúvidas respondidas / pendentes */}
          <div className="doubts-carousel">
            {loading ? (
              <div className="empty-state card-panel">
                <i className="fa-solid fa-spinner fa-spin"></i>
                <p>Carregando dúvidas...</p>
              </div>
            ) : loadError ? (
              <div className="empty-state card-panel">
                <i className="fa-solid fa-triangle-exclamation"></i>
                <p>Não foi possível carregar as dúvidas. {loadError}</p>
              </div>
            ) : total === 0 ? (
              <div className="empty-state card-panel">
                <i className="fa-regular fa-comments"></i>
                <p>Ainda não há dúvidas publicadas. Seja o primeiro a perguntar!</p>
              </div>
            ) : (
              <React.Fragment>
                <div className="doubt-slide-track">
                  <div className="doubt-card">
                    <div className="doubt-card-head">
                      <div className="doubt-who">
                        <strong>{current.nome}</strong>
                        <span>Publicado em {formatDateBR(current.data)}</span>
                      </div>
                      <span className={"status-tag " + current.status}>
                        {current.status === "respondida" ? "Respondida" : "Aguardando"}
                      </span>
                    </div>

                    <p className="doubt-question">
                      <i className="fa-solid fa-quote-left"></i>
                      {current.duvida}
                    </p>

                    {current.status === "respondida" ? (
                      <div className="doubt-answer">
                        <strong>
                          <i className="fa-solid fa-scale-balanced"></i>{" "}
                          Resposta de {current.respondidoPor} — {formatDateBR(current.dataResposta)}
                        </strong>
                        {current.resposta}
                      </div>
                    ) : (
                      <div className="doubt-answer waiting">
                        <i className="fa-regular fa-clock"></i> Nossa equipe
                        ainda está analisando esta dúvida. Em breve a resposta
                        será publicada aqui.
                      </div>
                    )}
                  </div>
                </div>

                <div className="carousel-controls">
                  <button
                    className="carousel-btn"
                    onClick={() => goTo(index - 1)}
                    disabled={index === 0}
                    aria-label="Dúvida anterior"
                  >
                    <i className="fa-solid fa-chevron-left"></i>
                  </button>
                  <div className="carousel-dots">
                    {doubts.map((d, i) => (
                      <button
                        key={d.id}
                        className={i === index ? "active" : ""}
                        onClick={() => goTo(i)}
                        aria-label={"Ir para dúvida " + (i + 1)}
                      ></button>
                    ))}
                  </div>
                  <button
                    className="carousel-btn"
                    onClick={() => goTo(index + 1)}
                    disabled={index === total - 1}
                    aria-label="Próxima dúvida"
                  >
                    <i className="fa-solid fa-chevron-right"></i>
                  </button>
                </div>
                <p className="pagination-info">
                  Registro {index + 1} de {total}
                </p>
              </React.Fragment>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
