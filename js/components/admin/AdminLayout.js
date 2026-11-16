function AdminLayout({ onLogout, onBackToSite }) {
  const [tab, setTab] = React.useState("advogados");

  // Sincroniza a aba interna com o hash (#admin, #admin/duvidas, #admin/mensagens).
  React.useEffect(() => {
    const h = window.location.hash;
    if (h === "#admin/mensagens") setTab("mensagens");
    else if (h === "#admin/duvidas") setTab("duvidas");
    else setTab("advogados");
  }, []);

  function switchTab(t) {
    setTab(t);
    window.location.hash = t === "mensagens" ? "admin/mensagens" : t === "duvidas" ? "admin/duvidas" : "admin";
  }

  async function handleLogout() {
    try {
      await Api.logout();
    } catch (err) {
      // mesmo se falhar, seguimos deslogando no front-end
      console.error(err);
    }
    onLogout();
  }

  return (
    <div className="admin-shell">
      <div className="admin-topbar">
        <div className="container">
          <div className="brand" style={{ color: "#fff" }}>
            <span className="brand-emblem">
              <i className="fa-solid fa-scale-balanced"></i>
            </span>
            <span className="brand-text">
              <strong>Painel Administrativo</strong>
              <span>Fontella &amp; Ribeiro</span>
            </span>
          </div>

          <div className="admin-tabs">
            <button
              className={"admin-tab" + (tab === "advogados" ? " active" : "")}
              onClick={() => switchTab("advogados")}
            >
              <i className="fa-solid fa-user-tie"></i> Advogados
            </button>
            <button
              className={"admin-tab" + (tab === "duvidas" ? " active" : "")}
              onClick={() => switchTab("duvidas")}
            >
              <i className="fa-regular fa-comment-dots"></i> Dúvidas
            </button>
            <button
              className={"admin-tab" + (tab === "mensagens" ? " active" : "")}
              onClick={() => switchTab("mensagens")}
            >
              <i className="fa-regular fa-envelope"></i> Mensagens
            </button>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button className="admin-logout" onClick={onBackToSite}>
              <i className="fa-solid fa-eye"></i> Ver Site
            </button>
            <button className="admin-logout" onClick={handleLogout}>
              <i className="fa-solid fa-right-from-bracket"></i> Sair
            </button>
          </div>
        </div>
      </div>

      <div className="container admin-main">
        {tab === "advogados" && <AdminLawyers />}
        {tab === "duvidas" && <AdminDoubts />}
        {tab === "mensagens" && <AdminContacts />}
      </div>
    </div>
  );
}
