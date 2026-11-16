const EMPTY_LAWYER_FORM = {
  id: null,
  nome: "",
  oab: "",
  atuacaoTexto: "", // palavras-chave separadas por vírgula
  foto: "",
  descricao: "",
  destaque: false,
};

function AdminLawyers() {
  const [lawyers, setLawyers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [form, setForm] = React.useState(EMPTY_LAWYER_FORM);
  const [editingId, setEditingId] = React.useState(null);
  const [saving, setSaving] = React.useState(false);
  const [formError, setFormError] = React.useState("");

  React.useEffect(() => {
    loadLawyers();
  }, []);

  function loadLawyers() {
    setLoading(true);
    Api.getLawyers()
      .then(setLawyers)
      .catch((err) => setFormError(err.message))
      .finally(() => setLoading(false));
  }

  function handleField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function resetForm() {
    setForm(EMPTY_LAWYER_FORM);
    setEditingId(null);
    setFormError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.nome.trim() || !form.oab.trim()) return;

    const fotoNormalizada = form.foto.trim().replace(/\\/g, "/");

    const payload = {
      nome: form.nome.trim(),
      oab: form.oab.trim(),
      atuacao: form.atuacaoTexto.trim(),
      foto:
        fotoNormalizada ||
        "https://images.pexels.com/photos/16963942/pexels-photo-16963942.jpeg?auto=compress&cs=tinysrgb&w=600",
      descricao: form.descricao.trim(),
      destaque: form.destaque,
    };

    setSaving(true);
    setFormError("");
    try {
      if (editingId) {
        await Api.updateLawyer(editingId, payload);
      } else {
        await Api.createLawyer(payload);
      }
      resetForm();
      loadLawyers();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(lawyer) {
    setEditingId(lawyer.id);
    setForm({
      id: lawyer.id,
      nome: lawyer.nome,
      oab: lawyer.oab,
      atuacaoTexto: (lawyer.atuacao || []).join(", "),
      foto: lawyer.foto,
      descricao: lawyer.descricao,
      destaque: !!lawyer.destaque,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id) {
    if (!confirm("Tem certeza que deseja remover este advogado?")) return;
    try {
      await Api.deleteLawyer(id);
      if (editingId === id) resetForm();
      loadLawyers();
    } catch (err) {
      alert("Erro ao excluir: " + err.message);
    }
  }

  return (
    <div>
      <div className="admin-header-row">
        <div>
          <h2>Gerenciar Advogados</h2>
          <p>Cadastre, edite ou remova advogados exibidos no site.</p>
        </div>
      </div>

      <div className="admin-grid-layout">
        <div className="card-panel">
          <h3>
            <i className={"fa-solid " + (editingId ? "fa-pen" : "fa-user-plus")}></i>{" "}
            {editingId ? "Editar Advogado" : "Novo Advogado"}
          </h3>

          {formError && <div className="admin-error">{formError}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-field">
              <label htmlFor="lw-nome">Nome completo</label>
              <input
                id="lw-nome"
                type="text"
                required
                value={form.nome}
                onChange={(e) => handleField("nome", e.target.value)}
                placeholder="Dra. Nome Sobrenome"
              />
            </div>
            <div className="form-field">
              <label htmlFor="lw-oab">Número da OAB</label>
              <input
                id="lw-oab"
                type="text"
                required
                value={form.oab}
                onChange={(e) => handleField("oab", e.target.value)}
                placeholder="OAB/SC 00.000"
              />
            </div>
            <div className="form-field">
              <label htmlFor="lw-atuacao">
                Área de atuação (palavras-chave para pesquisa, separadas por vírgula)
              </label>
              <input
                id="lw-atuacao"
                type="text"
                value={form.atuacaoTexto}
                onChange={(e) => handleField("atuacaoTexto", e.target.value)}
                placeholder="Direito Trabalhista, Acordos Coletivos"
              />
            </div>
            <div className="form-field">
              <label htmlFor="lw-foto">Foto (URL completa ou caminho relativo)</label>
              <input
                id="lw-foto"
                type="text"
                value={form.foto}
                onChange={(e) => handleField("foto", e.target.value)}
                placeholder="https://... ou img/advogados/nome.jpg"
              />
              <p className="form-note" style={{ marginTop: 6 }}>
                Use uma URL completa (https://...) ou um caminho relativo à
                pasta do site, sempre com barra normal:{" "}
                <strong>img/advogados/sofia.jpg</strong> (não use barra
                invertida "\", pois isso é do Windows e não funciona na web).
              </p>
            </div>
            <div className="form-field">
              <label htmlFor="lw-descricao">Descrição / Apresentação</label>
              <textarea
                id="lw-descricao"
                rows={4}
                value={form.descricao}
                onChange={(e) => handleField("descricao", e.target.value)}
                placeholder="Breve apresentação do advogado, experiência e especialidades..."
              ></textarea>
            </div>
            <div className="form-field" style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                id="lw-destaque"
                type="checkbox"
                style={{ width: "auto" }}
                checked={form.destaque}
                onChange={(e) => handleField("destaque", e.target.checked)}
              />
              <label htmlFor="lw-destaque" style={{ margin: 0 }}>
                Advogado(a) sócio(a) / destaque
              </label>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button type="submit" className="btn btn-navy" style={{ flex: 1 }} disabled={saving}>
                <i className={"fa-solid " + (saving ? "fa-spinner fa-spin" : editingId ? "fa-check" : "fa-plus")}></i>{" "}
                {saving ? "Salvando..." : editingId ? "Salvar Alterações" : "Cadastrar Advogado"}
              </button>
              {editingId && (
                <button type="button" className="btn btn-outline" style={{ color: "#1c1c1e", borderColor: "#d8cfbc" }} onClick={resetForm}>
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Foto</th>
                <th>Nome / OAB</th>
                <th>Áreas</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center", color: "#4a4a45" }}>
                    <i className="fa-solid fa-spinner fa-spin"></i> Carregando...
                  </td>
                </tr>
              )}
              {!loading && lawyers.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center", color: "#4a4a45" }}>
                    Nenhum advogado cadastrado ainda.
                  </td>
                </tr>
              )}
              {lawyers.map((l) => (
                <tr key={l.id}>
                  <td><img className="mini-photo" src={l.foto} alt={l.nome} /></td>
                  <td>
                    <strong>{l.nome}</strong>
                    <br />
                    <span style={{ fontSize: "0.75rem", color: "#4a4a45" }}>{l.oab}</span>
                  </td>
                  <td>
                    {(l.atuacao || []).map((a) => (
                      <span className="tag-chip" key={a}>{a}</span>
                    ))}
                  </td>
                  <td className="actions">
                    <button className="icon-btn" onClick={() => handleEdit(l)} aria-label="Editar">
                      <i className="fa-solid fa-pen"></i>
                    </button>
                    <button className="icon-btn danger" onClick={() => handleDelete(l.id)} aria-label="Excluir">
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
