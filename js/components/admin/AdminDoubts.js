function AdminDoubts() {
  const [doubts, setDoubts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [drafts, setDrafts] = React.useState({}); // respostas em edição por id
  const [sendingId, setSendingId] = React.useState(null);
  const [filter, setFilter] = React.useState("todas");
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    loadDoubts();
  }, []);

  function loadDoubts() {
    setLoading(true);
    Api.getDoubts()
      .then(setDoubts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  function handleDraftChange(id, value) {
    setDrafts((prev) => ({ ...prev, [id]: value }));
  }

  async function handleAnswer(id) {
    const resposta = (drafts[id] || "").trim();
    if (!resposta) return;
    setSendingId(id);
    try {
      await Api.answerDoubt(id, resposta);
      setDrafts((prev) => ({ ...prev, [id]: "" }));
      loadDoubts();
    } catch (err) {
      alert("Erro ao responder: " + err.message);
    } finally {
      setSendingId(null);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Remover esta dúvida definitivamente?")) return;
    try {
      await Api.deleteDoubt(id);
      loadDoubts();
    } catch (err) {
      alert("Erro ao excluir: " + err.message);
    }
  }

  const visible = doubts.filter((d) => {
    if (filter === "todas") return true;
    return d.status === filter;
  });

  const pendentesCount = doubts.filter((d) => d.status === "pendente").length;

  return (
    <div>
      <div className="admin-header-row">
        <div>
          <h2>
            Gerenciar Dúvidas
            {pendentesCount > 0 && <span className="badge-count">{pendentesCount} pendente(s)</span>}
          </h2>
          <p>Responda às dúvidas enviadas pelos clientes. A resposta é publicada no site.</p>
        </div>
        <div className="filter-pills">
          <button className={"filter-pill" + (filter === "todas" ? " active" : "")} onClick={() => setFilter("todas")}>Todas</button>
          <button className={"filter-pill" + (filter === "pendente" ? " active" : "")} onClick={() => setFilter("pendente")}>Pendentes</button>
          <button className={"filter-pill" + (filter === "respondida" ? " active" : "")} onClick={() => setFilter("respondida")}>Respondidas</button>
        </div>
      </div>

      <div className="card-panel">
        {error && <div className="admin-error">{error}</div>}

        {loading && (
          <div className="empty-state">
            <i className="fa-solid fa-spinner fa-spin"></i>
            <p>Carregando dúvidas...</p>
          </div>
        )}

        {!loading && visible.length === 0 && (
          <div className="empty-state">
            <i className="fa-regular fa-comments"></i>
            <p>Nenhuma dúvida nesta categoria.</p>
          </div>
        )}

        {visible.map((d) => (
          <div className="admin-doubt-row" key={d.id}>
            <div className="doubt-card-head">
              <div className="doubt-who">
                <strong>{d.nome}</strong>
                <span>{d.email} · {formatDateBR(d.data)}</span>
              </div>
              <span className={"status-tag " + d.status}>
                {d.status === "respondida" ? "Respondida" : "Aguardando"}
              </span>
            </div>
            <p className="doubt-question">
              <i className="fa-solid fa-quote-left"></i> {d.duvida}
            </p>

            {d.status === "respondida" ? (
              <div className="admin-answered-box">
                <strong>Resposta enviada em {formatDateBR(d.dataResposta)}:</strong>
                <div>{d.resposta}</div>
              </div>
            ) : (
              <div className="admin-answer-box form-field">
                <label>Escrever resposta (feedback ao cliente)</label>
                <textarea
                  rows={3}
                  value={drafts[d.id] || ""}
                  onChange={(e) => handleDraftChange(d.id, e.target.value)}
                  placeholder="Digite a orientação jurídica inicial para o cliente..."
                ></textarea>
                <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                  <button
                    className="btn btn-navy btn-sm"
                    onClick={() => handleAnswer(d.id)}
                    disabled={sendingId === d.id}
                  >
                    <i className={"fa-solid " + (sendingId === d.id ? "fa-spinner fa-spin" : "fa-paper-plane")}></i>{" "}
                    {sendingId === d.id ? "Enviando..." : "Responder"}
                  </button>
                </div>
              </div>
            )}

            <div style={{ marginTop: 10 }}>
              <button className="icon-btn danger" onClick={() => handleDelete(d.id)} aria-label="Excluir dúvida">
                <i className="fa-solid fa-trash"></i>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
