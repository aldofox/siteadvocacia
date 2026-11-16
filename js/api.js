/**
 * api.js
 * -----------------------------------------------------------------------
 * Cliente HTTP que conecta o front-end React ao back-end PHP + MySQL.
 * Substitui o antigo js/storage.js (que usava localStorage).
 *
 * Toda função aqui retorna uma Promise (uso com async/await nos componentes).
 *
 * Segurança CSRF: o token de sessão é devolvido pelo back-end no login e na
 * verificação de sessão. Ele é armazenado em memória e anexado automaticamente
 * ao cabeçalho "X-CSRF-Token" em toda requisição de escrita. Isso protege as
 * rotas autenticadas (advogados, dúvidas, mensagens, logout) contra ataques CSRF.
 * -----------------------------------------------------------------------
 */

const API_BASE = "api"; // caminho relativo à raiz do site (ex.: api/advogados.php)

// Token CSRF mantido em memória (não persistido em localStorage por segurança).
let csrfToken = null;

// Métodos que exigem token CSRF (justamente os que alteram dados no servidor).
const CSRF_METHODS = ["POST", "PUT", "PATCH", "DELETE"];

async function apiRequest(path, options = {}) {
  const method = (options.method || "GET").toUpperCase();
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };

  // Anexa o token CSRF em requisições de escrita quando disponível.
  if (csrfToken && CSRF_METHODS.includes(method)) {
    headers["X-CSRF-Token"] = csrfToken;
  }

  const response = await fetch(API_BASE + "/" + path, {
    credentials: "include", // envia/recebe o cookie de sessão do admin
    headers,
    ...options,
  });

  let data = null;
  try {
    data = await response.json();
  } catch (e) {
    data = null;
  }

  if (!response.ok) {
    const message = (data && data.erro) || "Erro ao comunicar com o servidor.";
    throw new Error(message);
  }
  return data;
}

const Api = {
  // ---------- Advogados ----------
  getLawyers() {
    return apiRequest("advogados.php", { method: "GET" });
  },
  createLawyer(payload) {
    return apiRequest("advogados.php", { method: "POST", body: JSON.stringify(payload) });
  },
  updateLawyer(id, payload) {
    return apiRequest("advogados.php?id=" + id, { method: "PUT", body: JSON.stringify(payload) });
  },
  deleteLawyer(id) {
    return apiRequest("advogados.php?id=" + id, { method: "DELETE" });
  },

  // ---------- Dúvidas ----------
  getDoubts() {
    return apiRequest("duvidas.php", { method: "GET" });
  },
  createDoubt(payload) {
    return apiRequest("duvidas.php", { method: "POST", body: JSON.stringify(payload) });
  },
  answerDoubt(id, resposta) {
    return apiRequest("duvidas.php?id=" + id, { method: "PATCH", body: JSON.stringify({ resposta }) });
  },
  deleteDoubt(id) {
    return apiRequest("duvidas.php?id=" + id, { method: "DELETE" });
  },

  // ---------- Contato / Mensagens ----------
  createContact(payload) {
    return apiRequest("contato.php", { method: "POST", body: JSON.stringify(payload) });
  },
  getContacts() {
    return apiRequest("contato.php", { method: "GET" });
  },
  markContactRead(id, lida = true) {
    return apiRequest("contato.php?id=" + id, { method: "PATCH", body: JSON.stringify({ lida }) });
  },
  deleteContact(id) {
    return apiRequest("contato.php?id=" + id, { method: "DELETE" });
  },

  // ---------- Autenticação ----------
  async login(usuario, senha) {
    const data = await apiRequest("auth.php", { method: "POST", body: JSON.stringify({ usuario, senha }) });
    if (data && data.csrf_token) csrfToken = data.csrf_token;
    return data;
  },
  async logout() {
    try {
      return await apiRequest("auth.php?action=logout", { method: "POST" });
    } finally {
      csrfToken = null;
    }
  },
  async checkSession() {
    const data = await apiRequest("auth.php?action=session", { method: "GET" });
    if (data && data.autenticado && data.csrf_token) {
      csrfToken = data.csrf_token;
    }
    return data;
  },
};
