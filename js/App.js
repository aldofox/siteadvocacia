function PublicSite({ onGoAdmin }) {
  return (
    <React.Fragment>
      <Header onGoAdmin={onGoAdmin} />
      <main>
        <Hero />
        <About />
        <PracticeAreas />
        <Lawyers />
        <Doubts />
        <Contact />
      </main>
      <Footer />
    </React.Fragment>
  );
}

function App() {
  function getRouteFromHash() {
    return window.location.hash.startsWith("#admin") ? "admin" : "site";
  }

  const [route, setRoute] = React.useState(getRouteFromHash());
  const [authenticated, setAuthenticated] = React.useState(false);
  const [checkingSession, setCheckingSession] = React.useState(true);

  // Ao entrar na área admin, confirma com o servidor (PHP) se já existe
  // uma sessão de login válida (cookie de sessão).
  React.useEffect(() => {
    Api.checkSession()
      .then((data) => setAuthenticated(!!data.autenticado))
      .catch(() => setAuthenticated(false))
      .finally(() => setCheckingSession(false));
  }, []);

  React.useEffect(() => {
    function onHashChange() {
      setRoute(getRouteFromHash());
    }
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  function goAdmin() {
    window.location.hash = "#admin";
    setRoute("admin");
  }

  function goSite() {
    window.location.hash = "#inicio";
    setRoute("site");
  }

  if (route === "admin") {
    if (checkingSession) {
      return (
        <div className="admin-login-wrap">
          <div style={{ color: "#fff", textAlign: "center" }}>
            <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: "2rem" }}></i>
            <p>Verificando sessão...</p>
          </div>
        </div>
      );
    }
    if (!authenticated) {
      return (
        <AdminLogin
          onLoginSuccess={() => setAuthenticated(true)}
          onBackToSite={goSite}
        />
      );
    }
    return (
      <AdminLayout
        onLogout={() => {
          setAuthenticated(false);
          goSite();
        }}
        onBackToSite={goSite}
      />
    );
  }

  return <PublicSite onGoAdmin={goAdmin} />;
}
