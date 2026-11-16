function Contact() {
  const [form, setForm] = React.useState({ nome: "", email: "", telefone: "", mensagem: "" });
  const [sending, setSending] = React.useState(false);
  const [sent, setSent] = React.useState(false);
  const [error, setError] = React.useState("");

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.nome.trim() || !form.email.trim() || !form.mensagem.trim()) return;

    setSending(true);
    setError("");
    setSent(false);
    try {
      await Api.createContact({
        nome: form.nome.trim(),
        email: form.email.trim(),
        telefone: form.telefone.trim(),
        mensagem: form.mensagem.trim(),
      });
      setForm({ nome: "", email: "", telefone: "", mensagem: "" });
      setSent(true);
      setTimeout(() => setSent(false), 5000);
    } catch (err) {
      setError(err.message || "Não foi possível enviar a mensagem.");
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="section-pad contact-section" id="contato">
      <div className="container">
        <div className="section-eyebrow">
          <span className="art-number">Art. 5º</span>
          <span className="art-rule"></span>
        </div>
        <h2 className="section-title">Fale Conosco</h2>
        <p className="section-subtitle">
          Agende uma consulta ou tire dúvidas gerais sobre nossos serviços.
          Respondemos em até 1 dia útil.
        </p>

        <div className="contact-grid">
          <div>
            <div className="contact-info-list">
              <div className="contact-info-item">
                <span className="icon-badge"><i className="fa-solid fa-location-dot"></i></span>
                <div>
                  <strong>Endereço</strong>
                  <span>Rua das Palmeiras, 482 — Centro, Joinville/SC</span>
                </div>
              </div>
              <div className="contact-info-item">
                <span className="icon-badge"><i className="fa-solid fa-phone"></i></span>
                <div>
                  <strong>Telefone</strong>
                  <a href="tel:+554733334455">(47) 3333-4455</a>
                </div>
              </div>
              <div className="contact-info-item">
                <span className="icon-badge"><i className="fa-brands fa-whatsapp"></i></span>
                <div>
                  <strong>WhatsApp</strong>
                  <a href="https://wa.me/5547999991122" target="_blank" rel="noopener noreferrer">
                    (47) 99999-1122
                  </a>
                </div>
              </div>
              <div className="contact-info-item">
                <span className="icon-badge"><i className="fa-solid fa-envelope"></i></span>
                <div>
                  <strong>E-mail</strong>
                  <a href="mailto:contato@fontellaribeiro.adv.br">contato@fontellaribeiro.adv.br</a>
                </div>
              </div>
              <div className="contact-info-item">
                <span className="icon-badge"><i className="fa-solid fa-clock"></i></span>
                <div>
                  <strong>Horário de Atendimento</strong>
                  <span>Segunda a sexta, das 8h às 18h</span>
                </div>
              </div>
            </div>

            <div className="contact-social">
              <a href="https://instagram.com/fontellaribeiro" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <i className="fa-brands fa-instagram"></i>
              </a>
              <a href="https://linkedin.com/company/fontellaribeiro" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <i className="fa-brands fa-linkedin-in"></i>
              </a>
              <a href="https://facebook.com/fontellaribeiro" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <i className="fa-brands fa-facebook-f"></i>
              </a>
            </div>
          </div>

          <div className="contact-form-panel">
            {sent && (
              <div className="form-success">
                <i className="fa-solid fa-circle-check"></i>
                Mensagem enviada! Retornaremos em breve.
              </div>
            )}
            {error && <div className="admin-error">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="contact-form-row">
                <div className="form-field">
                  <label htmlFor="contact-nome">Nome</label>
                  <input
                    id="contact-nome"
                    type="text"
                    required
                    value={form.nome}
                    onChange={(e) => handleChange("nome", e.target.value)}
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="contact-telefone">Telefone</label>
                  <input
                    id="contact-telefone"
                    type="tel"
                    value={form.telefone}
                    onChange={(e) => handleChange("telefone", e.target.value)}
                  />
                </div>
              </div>
              <div className="form-field">
                <label htmlFor="contact-email">E-mail</label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                />
              </div>
              <div className="form-field">
                <label htmlFor="contact-mensagem">Mensagem</label>
                <textarea
                  id="contact-mensagem"
                  rows={4}
                  required
                  value={form.mensagem}
                  onChange={(e) => handleChange("mensagem", e.target.value)}
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary btn-block" disabled={sending}>
                <i className={"fa-solid " + (sending ? "fa-spinner fa-spin" : "fa-paper-plane")}></i>{" "}
                {sending ? "Enviando..." : "Enviar Mensagem"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
