function AdminLogin({ onLoginSuccess, onBackToSite }) {
  const [usuario, setUsuario] = React.useState("");
  const [senha, setSenha] = React.useState("");
  const [erro, setErro] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setErro("");
    try {
      await Api.login(usuario.trim(), senha);
      onLoginSuccess();
    } catch (err) {
      setErro(err.message || "Usuário ou senha inválidos.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-login-wrap">
      <div className="admin-login-card">
        <div className="brand-emblem" style={{ width: 56, height: 56, fontSize: "1.4rem" }}>
          <i className="fa-solid fa-lock"></i>
        </div>
        <h2>Área Administrativa</h2>
        <p className="hint" style={{ textAlign: "center", color: "#4a4a45", fontSize: "0.88rem" }}>
          Acesso restrito à equipe do escritório
        </p>

        {erro && <div className="admin-error">{erro}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="admin-usuario">Usuário</label>
            <input
              id="admin-usuario"
              type="text"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              placeholder="admin"
              required
              autoFocus
            />
          </div>
          <div className="form-field">
            <label htmlFor="admin-senha">Senha</label>
            <input
              id="admin-senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <button type="submit" className="btn btn-navy btn-block" disabled={loading}>
            <i className={"fa-solid " + (loading ? "fa-spinner fa-spin" : "fa-right-to-bracket")}></i>{" "}
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className="admin-demo-note">
          <i className="fa-solid fa-circle-info"></i> Demonstração: usuário{" "}
          <strong>admin</strong> / senha <strong>admin123</strong> (definidos em{" "}
          <code>database/schema.sql</code>)
        </div>

        <a className="admin-login-back" href="#inicio" onClick={onBackToSite}>
          <i className="fa-solid fa-arrow-left"></i> Voltar para o site
        </a>
      </div>
    </div>
  );
}
