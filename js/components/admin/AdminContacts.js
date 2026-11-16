function formatDateBR(isoDateTime) {
  if (!isoDateTime) return "";
  const datePart = isoDateTime.split(" ")[0].split("T")[0];
  const [y, m, d] = datePart.split("-");
  return d + "/" + m + "/" + y;
}

function AdminContacts() {
  const [messages, setMessages] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [filter, setFilter] = React.useState("todas");
  const [togglingId, setTogglingId] = React.useState(null);

  React.useEffect(() => {
    loadMessages();
  }, []);

  function loadMessages() {
    setLoading(true);
    Api.getContacts()
      .then(setMessages)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  async function toggleRead(msg) {
    setTogglingId(msg.id);
    try {
      await Api.markContactRead(msg.id, !msg.lida);
      loadMessages();
    } catch (err) {
      alert("Erro ao atualizar: " + err.message);
    } finally {
      setTogglingId(null);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Excluir esta mensagem definitivamente?")) return;
    try {
      await Api.deleteContact(id);
      loadMessages();
    } catch (err) {
      alert("Erro ao excluir: " + err.message);
    }
  }

  const visible = messages.filter((m) => {
    if (filter === "todas") return true;
    return filter === "naolidas" ? !m.lida : m.lida;
  });

  const naoLidas = messages.filter((m) => !m.lida).length;

  return (
    <div>
      <div className="admin-header-row">
        <div>
          <h2>
            Mensagens &amp; Agendamentos
            {naoLidas > 0 && <span className="badge-count">{naoLidas} não lida(s)</span>}
          </h2>
          <p>
            Mensagens recebidas pelo formulário "Fale Conosco" (consultas e agendamentos).
          </p>
        </div>
        <div className="filter-pills">
          <button className={"filter-pill" + (filter === "todas" ? " active" : "")} onClick={() => setFilter("todas")}>Todas</button>
          <button className={"filter-pill" + (filter === "naolidas" ? " active" : "")} onClick={() => setFilter("naolidas")}>Não Lidas</button>
          <button className={"filter-pill" + (filter === "lidas" ? " active" : "")} onClick={() => setFilter("lidas")}>Lidas</button>
        </div>
      </div>

      <div className="card-panel">
        {error && <div className="admin-error">{error}</div>}

        {loading && (
          <div className="empty-state">
            <i className="fa-solid fa-spinner fa-spin"></i>
            <p>Carregando mensagens...</p>
          </div>
        )}

        {!loading && visible.length === 0 && (
          <div className="empty-state">
            <i className="fa-regular fa-envelope"></i>
            <p>Nenhuma mensagem nesta categoria.</p>
          </div>
        )}

        {visible.map((m) => (
          <div className={"admin-doubt-row" + (m.lida ? "" : " msg-unread")} key={m.id}>
            <div className="doubt-card-head">
              <div className="doubt-who">
                <strong>{m.nome} {!m.lida && <span className="msg-dot" title="Não lida"></span>}</strong>
                <span>{m.email} {m.telefone ? "· " + m.telefone : ""} · {formatDateBR(m.data)}</span>
              </div>
              <span className={"status-tag " + (m.lida ? "respondida" : "pendente")}>
                {m.lida ? "Lida" : "Não lida"}
              </span>
            </div>

            <div className="msg-body">
              <i className="fa-solid fa-quote-left"></i> {m.mensagem}
            </div>

            <div className="msg-actions">
              <button
                className="btn btn-navy btn-sm"
                onClick={() => toggleRead(m)}
                disabled={togglingId === m.id}
              >
                <i className={"fa-solid " + (togglingId === m.id ? "fa-spinner fa-spin" : m.lida ? "fa-envelope" : "fa-envelope-open-text")}></i>{" "}
                {togglingId === m.id ? "..." : m.lida ? "Marcar como não lida" : "Marcar como lida"}
              </button>
              <button className="icon-btn danger" onClick={() => handleDelete(m.id)} aria-label="Excluir mensagem">
                <i className="fa-solid fa-trash"></i>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
